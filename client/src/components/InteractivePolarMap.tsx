import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import {
  expeditionMapData,
  REGIONAL_MAP_BOUNDS,
  ExpeditionMapData,
  MapLocationPoint,
} from '../data/polarMapData';
import { computeDigitalTwinTelemetry, DigitalTwinTelemetry } from '../lib/digitalTwinEngine';
import {
  MapPin,
  Compass,
  Ship,
  Sliders,
  Layers,
  Sparkles,
  X,
  Maximize2,
  RotateCcw,
  Plus,
  Minus,
  CheckCircle2,
  FileText,
  Database,
  BookOpen,
  User,
  Activity,
  Globe2,
  ExternalLink,
  Calendar,
  Play,
  Pause,
  Navigation,
  Radio,
  Clock,
  Waves,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from './UI';

interface InteractivePolarMapProps {
  initialExpeditionId?: string | null;
  onSelectExpedition?: (expId: string) => void;
  height?: number | string;
  showSidebar?: boolean;
  enableDigitalTwin?: boolean;
  digitalTwinProgress?: number;
  onDigitalTwinProgressChange?: (progress: number) => void;
  digitalTwinPlaying?: boolean;
  onTogglePlay?: () => void;
}

// Custom Leaflet DivIcon for the Moving Digital Twin Vessel / Research Unit
function createVesselIcon(heading: number, region: string) {
  const iconHtml = `
    <div style="position:relative; width:44px; height:44px; display:flex; align-items:center; justify-content:center;">
      <!-- Pulsing radar wave -->
      <div style="position:absolute; inset:2px; border-radius:50%; background:rgba(0, 229, 255, 0.25); animation:pulse 2s infinite ease-out;"></div>
      <!-- Core beacon ring -->
      <div style="position:absolute; inset:8px; border-radius:50%; background:#071D33; border:2px solid #74D4F5; box-shadow:0 0 16px #00e5ff; display:flex; align-items:center; justify-content:center; transform:rotate(${heading}deg); transition:transform 0.4s ease;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#74D4F5" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 19 21 12 17 5 21 12 2"></polygon>
        </svg>
      </div>
      <!-- Center glowing dot -->
      <div style="position:absolute; width:6px; height:6px; border-radius:50%; background:#ffffff; box-shadow:0 0 6px #ffffff;"></div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'digital-twin-vessel-marker',
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

// Leaflet Controller Component to manage view transitions, smooth zoom, and resize invalidation safely
function MapController({
  bounds,
  center,
  zoom,
  targetZoomDelta,
  followPosition,
  isFollowing,
}: {
  bounds?: [[number, number], [number, number]] | null;
  center?: [number, number] | null;
  zoom?: number;
  targetZoomDelta?: number;
  followPosition?: [number, number] | null;
  isFollowing?: boolean;
}) {
  const map = useMap();
  const prevFollowPosRef = useRef<[number, number] | null>(null);

  // Smooth resize invalidation on mount and layout changes
  useEffect(() => {
    map.invalidateSize();
    const timer1 = setTimeout(() => map.invalidateSize(), 150);
    const timer2 = setTimeout(() => map.invalidateSize(), 400);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  // Handle bounds fitting
  useEffect(() => {
    if (bounds) {
      map.flyToBounds(bounds, {
        padding: [50, 50],
        duration: 1.2,
        easeLinearity: 0.25,
      });
    } else if (center && zoom !== undefined) {
      map.flyTo(center, zoom, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    }
  }, [map, bounds, center, zoom]);

  // Handle zoom delta buttons (+ / -)
  useEffect(() => {
    if (targetZoomDelta !== undefined && targetZoomDelta !== 0) {
      map.setZoom(map.getZoom() + targetZoomDelta, { animate: true });
    }
  }, [map, targetZoomDelta]);

  // Smooth vessel following during playback
  useEffect(() => {
    if (isFollowing && followPosition) {
      const prev = prevFollowPosRef.current;
      if (!prev || Math.abs(prev[0] - followPosition[0]) > 0.05 || Math.abs(prev[1] - followPosition[1]) > 0.05) {
        map.panTo(followPosition, { animate: true, duration: 0.8, easeLinearity: 0.2 });
        prevFollowPosRef.current = followPosition;
      }
    }
  }, [map, followPosition, isFollowing]);

  return null;
}

export function InteractivePolarMap({
  initialExpeditionId,
  onSelectExpedition,
  height = 620,
  showSidebar = true,
  enableDigitalTwin = true,
  digitalTwinProgress: externalProgress,
  onDigitalTwinProgressChange,
  digitalTwinPlaying: externalIsPlaying,
  onTogglePlay: externalOnTogglePlay,
}: InteractivePolarMapProps) {
  // Filter States
  const [selectedRegion, setSelectedRegion] = useState<string>('Antarctica');
  const [selectedResearchArea, setSelectedResearchArea] = useState<string>('All');
  const [selectedExpId, setSelectedExpId] = useState<string | null>(initialExpeditionId || 'iae46');

  // Layer Visibility Toggles
  const [showStations, setShowStations] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showSamplingSites, setShowSamplingSites] = useState(true);
  const [showVessels, setShowVessels] = useState(true);

  // Map Tile Style State
  const [mapTileStyle, setMapTileStyle] = useState<'dark' | 'osm'>('dark');

  // Selected Location Inspector State
  const [inspectedLocation, setInspectedLocation] = useState<MapLocationPoint | null>(null);

  // Map Navigation Target Control
  const [mapTargetBounds, setMapTargetBounds] = useState<[[number, number], [number, number]] | null>(
    initialExpeditionId
      ? expeditionMapData.find((e) => e.id === initialExpeditionId)?.bounds || REGIONAL_MAP_BOUNDS.Antarctica
      : REGIONAL_MAP_BOUNDS.Antarctica
  );
  const [zoomTrigger, setZoomTrigger] = useState<{ delta: number; id: number }>({ delta: 0, id: 0 });

  // Digital Twin Playback Internal State (if not controlled externally)
  const [internalProgress, setInternalProgress] = useState(0);
  const [internalIsPlaying, setInternalIsPlaying] = useState(false);
  const [twinSpeed, setTwinSpeed] = useState<0.5 | 1 | 2 | 4>(1);
  const [cameraFollow, setCameraFollow] = useState(false);

  const isControlledProgress = externalProgress !== undefined;
  const isControlledPlaying = externalIsPlaying !== undefined;

  const currentProgress = isControlledProgress ? externalProgress : internalProgress;
  const isPlaying = isControlledPlaying ? externalIsPlaying : internalIsPlaying;

  const setProgress = useCallback(
    (updater: number | ((prev: number) => number)) => {
      if (typeof updater === 'function') {
        setInternalProgress((prev) => {
          const next = updater(prev);
          if (onDigitalTwinProgressChange) {
            onDigitalTwinProgressChange(next);
          }
          return next;
        });
      } else {
        if (onDigitalTwinProgressChange) {
          onDigitalTwinProgressChange(updater);
        }
        if (!isControlledProgress) {
          setInternalProgress(updater);
        }
      }
    },
    [onDigitalTwinProgressChange, isControlledProgress]
  );

  const togglePlay = useCallback(() => {
    if (externalOnTogglePlay) {
      externalOnTogglePlay();
    } else {
      setInternalIsPlaying((prev) => !prev);
    }
  }, [externalOnTogglePlay]);

  // Sync initialExpeditionId prop
  useEffect(() => {
    if (initialExpeditionId !== undefined) {
      setSelectedExpId(initialExpeditionId);
      if (initialExpeditionId) {
        const exp = expeditionMapData.find((e) => e.id === initialExpeditionId);
        if (exp) {
          setMapTargetBounds(exp.bounds);
        }
      }
    }
  }, [initialExpeditionId]);

  // Active Selected Expedition Object
  const activeExpeditionObj = useMemo(() => {
    return expeditionMapData.find((e) => e.id === selectedExpId) || expeditionMapData[0];
  }, [selectedExpId]);

  // Handle Expedition Selection
  const handleSelectExpedition = (expId: string | null) => {
    setSelectedExpId(expId);
    setProgress(0);
    if (onSelectExpedition && expId) {
      onSelectExpedition(expId);
    }

    if (expId) {
      const exp = expeditionMapData.find((e) => e.id === expId);
      if (exp) {
        setSelectedRegion(exp.region);
        setMapTargetBounds(exp.bounds);
      }
    } else {
      setMapTargetBounds(REGIONAL_MAP_BOUNDS[selectedRegion] || REGIONAL_MAP_BOUNDS.Antarctica);
    }
  };

  // Digital Twin RAF Animation Loop
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const deltaSeconds = (now - lastTime) / 1000;
      lastTime = now;

      // Base step: 100% in 24 seconds at 1x speed
      const step = (deltaSeconds / 24) * 100 * twinSpeed;

      setProgress((prev: number) => {
        const next = prev + step;
        if (next >= 100) {
          if (!isControlledPlaying) setInternalIsPlaying(false);
          return 100;
        }
        return next;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, twinSpeed, setProgress, isControlledPlaying]);

  // Compute Live Telemetry for the Active Expedition
  const telemetry: DigitalTwinTelemetry = useMemo(() => {
    return computeDigitalTwinTelemetry(activeExpeditionObj, currentProgress);
  }, [activeExpeditionObj, currentProgress]);

  // Filter Expeditions List
  const filteredExpeditions = useMemo(() => {
    return expeditionMapData.filter((e) => {
      const matchRegion = selectedRegion === 'All' || e.region === selectedRegion;
      const matchArea =
        selectedResearchArea === 'All' ||
        e.researchArea.toLowerCase().includes(selectedResearchArea.toLowerCase());
      const matchExp = !selectedExpId || e.id === selectedExpId;
      return matchRegion && matchArea && matchExp;
    });
  }, [selectedRegion, selectedResearchArea, selectedExpId]);

  // Aggregate Visible Locations
  const visibleStations = useMemo(() => {
    const list: MapLocationPoint[] = [];
    filteredExpeditions.forEach((exp) => {
      if (showStations) list.push(...exp.stations);
    });
    return list;
  }, [filteredExpeditions, showStations]);

  const visibleSamplingSites = useMemo(() => {
    const list: MapLocationPoint[] = [];
    filteredExpeditions.forEach((exp) => {
      if (showSamplingSites) list.push(...exp.samplingSites, ...exp.observationPoints);
    });
    return list;
  }, [filteredExpeditions, showSamplingSites]);

  // Reset Map View
  const handleResetView = () => {
    const defaultBounds = REGIONAL_MAP_BOUNDS[selectedRegion] || REGIONAL_MAP_BOUNDS.Antarctica;
    setMapTargetBounds(defaultBounds);
    setInspectedLocation(null);
  };

  const handleFitActiveRoute = () => {
    if (activeExpeditionObj) {
      setMapTargetBounds(activeExpeditionObj.bounds);
    } else {
      setMapTargetBounds(REGIONAL_MAP_BOUNDS[selectedRegion] || REGIONAL_MAP_BOUNDS.Antarctica);
    }
  };

  const handleZoomIn = () => {
    setZoomTrigger((prev) => ({ delta: 0.75, id: prev.id + 1 }));
  };

  const handleZoomOut = () => {
    setZoomTrigger((prev) => ({ delta: -0.75, id: prev.id + 1 }));
  };

  const vesselIcon = useMemo(() => {
    return createVesselIcon(telemetry.headingDeg, activeExpeditionObj.region);
  }, [telemetry.headingDeg, activeExpeditionObj.region]);

  return (
    <div className="space-y-4">
      {/* Top Filter & Layer Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-[#183647]/15 shadow-sm">
        {/* Left Region Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#183647]">
            <Globe2 size={15} className="text-[#487b91]" /> Region:
          </div>
          <div className="flex flex-wrap gap-1">
            {['Antarctica', 'Arctic', 'Southern Ocean', 'Himalayas', 'All'].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setSelectedRegion(r);
                  setSelectedExpId(null);
                  setMapTargetBounds(REGIONAL_MAP_BOUNDS[r] || REGIONAL_MAP_BOUNDS.Antarctica);
                }}
                className={`px-3 py-1.5 rounded-xl font-semibold transition ${
                  selectedRegion === r
                    ? 'bg-[#183647] text-white shadow-sm'
                    : 'bg-slate-100 text-[#487b91] hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Right Layer Toggles & Map Style Toggle */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowStations(!showStations)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              showStations ? 'bg-cyan-900 text-cyan-200 border border-cyan-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            ● Stations
          </button>
          <button
            onClick={() => setShowRoutes(!showRoutes)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              showRoutes ? 'bg-sky-900 text-sky-200 border border-sky-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            — Routes
          </button>
          <button
            onClick={() => setShowSamplingSites(!showSamplingSites)}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              showSamplingSites
                ? 'bg-emerald-900 text-emerald-200 border border-emerald-700'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            ▲ Sampling Sites
          </button>
          <button
            onClick={() => setMapTileStyle(mapTileStyle === 'dark' ? 'osm' : 'dark')}
            className="btn-secondary text-[11px] py-1 px-3"
          >
            {mapTileStyle === 'dark' ? '🛰️ OSM Map' : '🌌 Dark Mode'}
          </button>
        </div>
      </div>

      {/* Main Map Container Grid */}
      <div className={`grid gap-6 ${showSidebar ? 'lg:grid-cols-[1fr_320px]' : 'grid-cols-1'}`}>
        {/* Left Map Viewport Canvas */}
        <div className="relative overflow-hidden rounded-3xl border border-[#183647]/15 shadow-xl bg-[#071D33] flex flex-col">
          {/* Map Controls Floating Overlay */}
          <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="bg-[#183647]/90 backdrop-blur-md text-white p-2.5 rounded-xl shadow-lg border border-white/20 hover:bg-[#254b61] transition font-bold"
            >
              <Plus size={16} />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="bg-[#183647]/90 backdrop-blur-md text-white p-2.5 rounded-xl shadow-lg border border-white/20 hover:bg-[#254b61] transition font-bold"
            >
              <Minus size={16} />
            </button>
            <button
              onClick={handleResetView}
              title="Reset Regional View"
              className="bg-[#183647]/90 backdrop-blur-md text-white p-2.5 rounded-xl shadow-lg border border-white/20 hover:bg-[#254b61] transition"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={handleFitActiveRoute}
              title="Fit to Selected Route"
              className="bg-[#183647]/90 backdrop-blur-md text-white p-2.5 rounded-xl shadow-lg border border-white/20 hover:bg-[#254b61] transition"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          {/* Active Expedition Live Telemetry Banner */}
          {activeExpeditionObj && (
            <div className="absolute top-4 left-4 z-[400] bg-[#071D33]/92 backdrop-blur-md text-white p-3.5 rounded-2xl border border-[#74D4F5]/35 shadow-2xl max-w-sm space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <Badge>{activeExpeditionObj.region}</Badge>
                <div className="flex items-center gap-1.5 font-mono text-[#74D4F5] font-bold">
                  <Radio size={12} className={isPlaying ? 'animate-pulse text-emerald-400' : 'text-[#74D4F5]'} />
                  {isPlaying ? 'LIVE TELEMETRY' : 'DIGITAL TWIN READY'}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs leading-snug">{activeExpeditionObj.title}</h4>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Leader: {activeExpeditionObj.leader} · {activeExpeditionObj.vesselOrBase}
                </div>
              </div>

              {/* Live coordinates and date HUD */}
              <div className="rounded-xl bg-black/40 p-2.5 border border-white/10 text-[11px] space-y-1 font-mono">
                <div className="flex justify-between text-[#74D4F5]">
                  <span>POS: {telemetry.currentPosition[0].toFixed(3)}°, {telemetry.currentPosition[1].toFixed(3)}°</span>
                  <span>{telemetry.speedKnots} kn · {telemetry.headingDeg}°</span>
                </div>
                <div className="flex justify-between text-slate-300 text-[10px]">
                  <span>DATE: {telemetry.currentDate}</span>
                  <span>DAY {telemetry.dayNumber} / {telemetry.totalDays}</span>
                </div>
                <div className="text-[10px] text-emerald-300 font-sans truncate pt-0.5">
                  {telemetry.activeActivity}
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] pt-1 border-t border-white/10">
                <button
                  onClick={() => setCameraFollow(!cameraFollow)}
                  className={`flex items-center gap-1 font-bold ${
                    cameraFollow ? 'text-emerald-400' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Navigation size={11} /> {cameraFollow ? 'Camera Lock: ON' : 'Follow Vessel'}
                </button>

                <button
                  onClick={() => handleSelectExpedition(null)}
                  className="text-slate-400 hover:text-white font-bold"
                >
                  Clear Selection ×
                </button>
              </div>
            </div>
          )}

          {/* Leaflet Map Engine Canvas */}
          <div className="w-full flex-1 min-h-[420px]" style={{ height: height }}>
            <MapContainer
              center={[-70, 45]}
              zoom={3.5}
              minZoom={1.5}
              maxZoom={18}
              scrollWheelZoom={true}
              zoomDelta={0.5}
              zoomSnap={0.25}
              wheelPxPerZoomLevel={90}
              style={{ height: '100%', width: '100%', background: '#071D33' }}
            >
              {/* View Controller */}
              <MapController
                bounds={mapTargetBounds}
                targetZoomDelta={zoomTrigger.delta}
                followPosition={telemetry.currentPosition}
                isFollowing={cameraFollow && isPlaying}
              />

              {/* Tile Layer (No API Key Required) */}
              {mapTileStyle === 'dark' ? (
                <TileLayer
                  attribution="&copy; OpenStreetMap &copy; Esri World Dark Gray"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
                  maxZoom={18}
                  noWrap={false}
                />
              ) : (
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maxZoom={18}
                  noWrap={false}
                />
              )}

              {/* Render Full Static Route Polylines for Non-Active Expeditions */}
              {showRoutes &&
                filteredExpeditions
                  .filter((exp) => exp.id !== selectedExpId)
                  .map((exp) => (
                    <Polyline
                      key={exp.id}
                      positions={exp.routePoints}
                      pathOptions={{
                        color: '#487b91',
                        weight: 2.5,
                        opacity: 0.45,
                        dashArray: '5, 8',
                      }}
                      eventHandlers={{
                        click: () => handleSelectExpedition(exp.id),
                      }}
                    />
                  ))}

              {/* Active Selected Expedition: Dynamic Digital Twin Traveled & Remaining Route Paths */}
              {showRoutes && activeExpeditionObj && (
                <>
                  {/* Glowing Traveled Route Segment */}
                  <Polyline
                    positions={telemetry.traveledRoute}
                    pathOptions={{
                      color: '#00e5ff',
                      weight: 5,
                      opacity: 1.0,
                    }}
                  />
                  {/* Subtle Inner Highlight Trail */}
                  <Polyline
                    positions={telemetry.traveledRoute}
                    pathOptions={{
                      color: '#ffffff',
                      weight: 2,
                      opacity: 0.8,
                    }}
                  />
                  {/* Remaining Planned Route Segment */}
                  <Polyline
                    positions={telemetry.remainingRoute}
                    pathOptions={{
                      color: '#487b91',
                      weight: 3,
                      opacity: 0.5,
                      dashArray: '4, 8',
                    }}
                  />
                </>
              )}

              {/* Moving Digital Twin Vessel / Expedition Marker */}
              {enableDigitalTwin && activeExpeditionObj && (
                <Marker position={telemetry.currentPosition} icon={vesselIcon} zIndexOffset={1000}>
                  <Popup>
                    <div className="text-xs space-y-1.5 p-1 min-w-[200px]">
                      <div className="flex items-center gap-1.5 font-bold text-[#183647] border-b pb-1">
                        <Ship size={14} className="text-[#00e5ff]" /> {activeExpeditionObj.vesselOrBase}
                      </div>
                      <div className="text-[11px] text-slate-600 font-semibold">{telemetry.currentLegTitle}</div>
                      <div className="font-mono text-[10px] text-[#487b91]">
                        Lat: {telemetry.currentPosition[0].toFixed(3)}°, Lng: {telemetry.currentPosition[1].toFixed(3)}°
                      </div>
                      <div className="text-[11px] text-emerald-700 bg-emerald-50 p-1.5 rounded-lg">
                        {telemetry.activeActivity}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Render Station Markers */}
              {visibleStations.map((st) => {
                const isNearby = telemetry.nearestStationOrSite?.id === st.id;
                return (
                  <CircleMarker
                    key={st.id}
                    center={st.coordinates}
                    radius={isNearby ? 13 : st.type === 'station' ? 10 : 8}
                    pathOptions={{
                      color: isNearby ? '#00e5ff' : st.type === 'station' ? '#00e5ff' : '#a855f7',
                      fillColor: isNearby ? '#ffffff' : st.type === 'station' ? '#74D4F5' : '#c084fc',
                      fillOpacity: 0.95,
                      weight: isNearby ? 3.5 : 2,
                    }}
                    eventHandlers={{
                      click: () => setInspectedLocation(st),
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1.5 p-1">
                        <b className="text-[#183647] block text-sm">{st.name}</b>
                        <div className="text-slate-600 font-semibold">{st.category}</div>
                        <div className="text-[11px] text-[#487b91]">{st.activity}</div>
                        <button
                          onClick={() => setInspectedLocation(st)}
                          className="text-[11px] font-bold text-[#183647] underline block pt-1"
                        >
                          Inspect Details →
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {/* Render Sampling Site Markers */}
              {visibleSamplingSites.map((site) => {
                const isNearby = telemetry.nearestStationOrSite?.id === site.id;
                return (
                  <CircleMarker
                    key={site.id}
                    center={site.coordinates}
                    radius={isNearby ? 10 : 7}
                    pathOptions={{
                      color: isNearby
                        ? '#ffffff'
                        : site.type === 'observation_point'
                        ? '#f59e0b'
                        : '#10b981',
                      fillColor: site.type === 'observation_point' ? '#fbbf24' : '#34d399',
                      fillOpacity: 0.95,
                      weight: isNearby ? 3 : 2,
                    }}
                    eventHandlers={{
                      click: () => setInspectedLocation(site),
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1 p-1">
                        <b className="text-[#183647] block">{site.name}</b>
                        <div className="text-slate-600">{site.category}</div>
                        <button
                          onClick={() => setInspectedLocation(site)}
                          className="text-[11px] font-bold text-[#183647] underline block pt-1"
                        >
                          Inspect Details →
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          </div>

          {/* Integrated Digital Twin Timeline & Playback Control Bar */}
          {enableDigitalTwin && activeExpeditionObj && (
            <div className="bg-[#071D33]/95 border-t border-white/10 p-4 text-white space-y-3 z-[400]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Play / Pause & Speed Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="flex items-center gap-2 rounded-xl bg-[#00e5ff] text-[#071D33] px-4 py-2 text-xs font-black shadow-lg hover:bg-cyan-300 transition"
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    {isPlaying ? 'PAUSE TELEMETRY' : 'PLAY DIGITAL TWIN'}
                  </button>

                  <button
                    onClick={() => {
                      setProgress(0);
                      if (isPlaying) togglePlay();
                    }}
                    title="Restart Journey"
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition text-xs font-bold"
                  >
                    <RotateCcw size={14} />
                  </button>

                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl text-xs font-bold border border-white/10">
                    {([0.5, 1, 2, 4] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setTwinSpeed(s)}
                        className={`px-2 py-1 rounded-lg transition ${
                          twinSpeed === s ? 'bg-[#00e5ff] text-[#071D33]' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline Status Badge */}
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-[#74D4F5] font-bold">
                    {Math.round(currentProgress)}% COMPLETE
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-200">
                    DAY {telemetry.dayNumber} OF {telemetry.totalDays}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-400 font-sans font-bold text-[11px] truncate max-w-xs">
                    {telemetry.currentLegTitle}
                  </span>
                </div>
              </div>

              {/* Timeline Scrubber Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={currentProgress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-full cursor-pointer accent-[#00e5ff] h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Start: {activeExpeditionObj.startPoint.name}</span>
                  <span>Current: {telemetry.currentPosition[0].toFixed(2)}°, {telemetry.currentPosition[1].toFixed(2)}°</span>
                  <span>End: {activeExpeditionObj.endPoint.name}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Expedition & Location Sidebar */}
        {showSidebar && (
          <div className="space-y-4">
            <div className="card space-y-4 text-xs">
              <div className="flex justify-between items-center border-b border-[#183647]/10 pb-2">
                <h3 className="font-bold text-[#183647] text-sm">
                  Expeditions ({filteredExpeditions.length})
                </h3>
                <span className="text-[10px] font-bold text-[#487b91]">SELECT TO TRACK</span>
              </div>

              <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
                {filteredExpeditions.map((exp) => {
                  const isSelected = exp.id === selectedExpId;
                  return (
                    <div
                      key={exp.id}
                      onClick={() => handleSelectExpedition(exp.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-[#183647] text-white border-[#183647] shadow-md'
                          : 'bg-slate-50 text-[#183647] border-[#183647]/12 hover:border-[#487b91]'
                      }`}
                    >
                      <div className="flex justify-between items-center text-[10px]">
                        <span
                          className={`font-mono font-bold ${
                            isSelected ? 'text-[#74D4F5]' : 'text-[#487b91]'
                          }`}
                        >
                          {exp.region}
                        </span>
                        <span className={isSelected ? 'text-slate-300' : 'text-slate-500'}>{exp.year}</span>
                      </div>

                      <h4 className="font-bold text-xs leading-snug">{exp.title}</h4>
                      <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                        {exp.summary}
                      </p>

                      <div className="pt-2 border-t border-current/10 flex justify-between items-center text-[10px]">
                        <span>Leader: {exp.leader}</span>
                        <Link
                          to={`/expeditions/${exp.id}`}
                          className={`font-bold hover:underline ${
                            isSelected ? 'text-[#74D4F5]' : 'text-[#183647]'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          Details →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MARKER / LOCATION DETAIL INSPECTOR MODAL */}
      {inspectedLocation && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl card space-y-5 border-[#183647]/20 shadow-2xl">
            <div className="flex justify-between items-start border-b border-[#183647]/10 pb-3">
              <div>
                <Badge>{inspectedLocation.category}</Badge>
                <h3 className="text-xl font-bold text-[#183647] mt-1">{inspectedLocation.name}</h3>
                <p className="text-xs text-[#487b91]">
                  Location: {inspectedLocation.coordinates[0].toFixed(2)}°,{' '}
                  {inspectedLocation.coordinates[1].toFixed(2)}° · {inspectedLocation.region}
                </p>
              </div>
              <button onClick={() => setInspectedLocation(null)} className="text-[#487b91] hover:text-[#183647]">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#183647]">
              <div>
                <span className="font-bold text-[#487b91]">Expedition:</span> {inspectedLocation.expeditionTitle}
              </div>
              <div>
                <span className="font-bold text-[#487b91]">Lead Scientist / Leader:</span>{' '}
                {inspectedLocation.leaderOrScientist}
              </div>
              <div>
                <span className="font-bold text-[#487b91]">Research Activity:</span> {inspectedLocation.activity}
              </div>
              {inspectedLocation.samplesOrDataCollected && (
                <div>
                  <span className="font-bold text-[#487b91]">Samples / Data Collected:</span>{' '}
                  {inspectedLocation.samplesOrDataCollected}
                </div>
              )}

              <p className="rounded-xl bg-slate-50 p-3 border border-[#183647]/10 text-slate-700 leading-relaxed">
                {inspectedLocation.description}
              </p>

              {inspectedLocation.instruments && (
                <div className="space-y-1">
                  <span className="font-bold text-[#487b91]">Instruments Deployed:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {inspectedLocation.instruments.map((inst) => (
                      <span
                        key={inst}
                        className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#183647]"
                      >
                        {inst}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons & Links */}
            <div className="pt-3 border-t border-[#183647]/10 flex flex-wrap justify-between items-center gap-2 text-xs">
              <div className="flex items-center gap-2">
                {inspectedLocation.related?.datasets?.[0] && (
                  <Link to={`/datasets/${inspectedLocation.related.datasets[0]}`} className="btn-secondary text-xs">
                    <Database size={13} /> View Dataset
                  </Link>
                )}
                {inspectedLocation.related?.reports?.[0] && (
                  <Link to={`/expeditions/${inspectedLocation.expeditionId}`} className="btn-secondary text-xs">
                    <FileText size={13} /> View Report
                  </Link>
                )}
              </div>

              <button onClick={() => setInspectedLocation(null)} className="btn-primary text-xs">
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
