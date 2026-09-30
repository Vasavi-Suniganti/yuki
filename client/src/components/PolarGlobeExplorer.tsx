import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import {
  expeditionMapData,
  REGIONAL_MAP_BOUNDS,
  ExpeditionMapData,
  MapLocationPoint,
} from '../data/polarMapData';
import {
  researchers,
  expeditions as demoExpeditions,
  datasets as demoDatasets,
  publications as demoPublications,
} from '../data/demo';
import { InteractivePolarMap } from './InteractivePolarMap';
import {
  Globe as GlobeIcon,
  Map as MapIcon,
  Compass,
  Layers,
  Sparkles,
  Search,
  RotateCcw,
  Maximize,
  Minimize,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  X,
  ExternalLink,
  Navigation,
  Activity,
  Database,
  BookOpen,
  User,
  Radio,
  Thermometer,
  Waves,
  Mountain,
  Snowflake,
  ShieldAlert,
  Info,
  Sliders,
  Calendar,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Exploration Mode Types
export type ExplorationMode =
  | 'overview'
  | 'expeditions'
  | 'stations'
  | 'sites'
  | 'datasets'
  | 'publications'
  | 'scientists'
  | 'climate'
  | 'ocean';

export interface GlobeEntity {
  id: string;
  name: string;
  type: 'station' | 'sampling_site' | 'vessel' | 'dataset' | 'publication' | 'scientist' | 'expedition';
  category: string;
  coordinates: [number, number]; // [lat, lng]
  region: 'Antarctica' | 'Arctic' | 'Southern Ocean' | 'Himalayas' | 'Global';
  year?: string | number;
  expeditionId?: string;
  expeditionTitle?: string;
  leaderOrScientist?: string;
  description: string;
  activity?: string;
  instruments?: string[];
  samplesOrDataCollected?: string;
  elevationOrDepth?: string;
  status?: string;
  metrics?: { label: string; value: string }[];
  related?: {
    datasets?: string[];
    publications?: string[];
    expeditions?: string[];
    reports?: string[];
  };
}

// Convert Lat/Lng to 3D Cartesian coordinates on sphere of radius R
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

// Interpolate Great Circle Arc for 3D route curves
function createCurvedRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  radius: number,
  numPoints: number = 30
): THREE.Vector3[] {
  const startVec = latLngToVector3(startLat, startLng, radius);
  const endVec = latLngToVector3(endLat, endLng, radius);

  const points: THREE.Vector3[] = [];
  const distance = startVec.distanceTo(endVec);
  const maxAltitude = Math.min(radius * 0.18, Math.max(radius * 0.02, distance * 0.12));

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    // Slerp-like spherical interpolation
    const p = new THREE.Vector3().lerpVectors(startVec, endVec, t);
    const arcHeight = Math.sin(Math.PI * t) * maxAltitude;
    p.normalize().multiplyScalar(radius + arcHeight);
    points.push(p);
  }

  return points;
}

// Procedural Canvas Texture Generator for Earth Surface with Deep Ocean & Glowing Polar Caps
function generateEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Deep Polar Ocean Gradient Base
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  oceanGrad.addColorStop(0, '#041122'); // Arctic Ocean
  oceanGrad.addColorStop(0.2, '#061830');
  oceanGrad.addColorStop(0.5, '#020b18'); // Equator
  oceanGrad.addColorStop(0.8, '#061830');
  oceanGrad.addColorStop(1, '#041122'); // Antarctic Ocean
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Glowing Subtle Grid / Graticule lines
  ctx.strokeStyle = 'rgba(116, 212, 245, 0.08)';
  ctx.lineWidth = 1;

  // Latitude lines
  for (let lat = -80; lat <= 80; lat += 20) {
    const y = ((90 - lat) / 180) * canvas.height;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  // Longitude lines
  for (let lng = -180; lng <= 180; lng += 30) {
    const x = ((lng + 180) / 360) * canvas.width;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Polar Circles (66.5°N and 66.5°S) Highlighted
  ctx.strokeStyle = 'rgba(116, 212, 245, 0.35)';
  ctx.lineWidth = 2;
  const arcticY = ((90 - 66.5) / 180) * canvas.height;
  const antarcticY = ((90 - -66.5) / 180) * canvas.height;
  ctx.setLineDash([8, 6]);
  ctx.beginPath();
  ctx.moveTo(0, arcticY);
  ctx.lineTo(canvas.width, arcticY);
  ctx.moveTo(0, antarcticY);
  ctx.lineTo(canvas.width, antarcticY);
  ctx.stroke();
  ctx.setLineDash([]);

  // 3. Vector Continents & Landmasses
  ctx.fillStyle = '#0f2942'; // Dark Navy Continent Base
  ctx.strokeStyle = '#1d486e'; // Subtle border
  ctx.lineWidth = 1.5;

  // Function to map lat/lng to canvas pixels
  const toX = (lng: number) => ((lng + 180) / 360) * canvas.width;
  const toY = (lat: number) => ((90 - lat) / 180) * canvas.height;

  const drawPoly = (coords: [number, number][], fillStyle = '#0f2942', strokeStyle = '#235985') => {
    if (coords.length < 3) return;
    ctx.beginPath();
    ctx.moveTo(toX(coords[0][1]), toY(coords[0][0]));
    for (let i = 1; i < coords.length; i++) {
      ctx.lineTo(toX(coords[i][1]), toY(coords[i][0]));
    }
    ctx.closePath();
    ctx.fillStyle = fillStyle;
    ctx.fill();
    ctx.strokeStyle = strokeStyle;
    ctx.stroke();
  };

  // --- ANTARCTICA (Huge Polar Ice Mass with Ice Blue Glow) ---
  const antarcticaCoast: [number, number][] = [
    [-63, -57], [-64, -62], [-68, -67], [-73, -75], [-75, -90], [-74, -110], [-72, -130],
    [-75, -150], [-78, -170], [-82, 175], [-77, 160], [-72, 150], [-66, 140], [-66, 120],
    [-66, 100], [-68, 80], [-69, 76], [-70, 50], [-70, 20], [-70, 10], [-71, -10],
    [-74, -30], [-72, -45], [-63, -57]
  ];
  drawPoly(antarcticaCoast, '#143859', '#74D4F5');

  // Interior Antarctic High Plateau (Icy White-Blue core)
  const antarcticaCore: [number, number][] = [
    [-75, -30], [-78, -80], [-84, -140], [-86, 160], [-80, 100], [-74, 50], [-75, -30]
  ];
  drawPoly(antarcticaCore, '#24618e', '#bfeeff');

  // --- GREENLAND (Arctic Ice Sheet) ---
  const greenland: [number, number][] = [
    [60, -44], [65, -38], [72, -22], [80, -18], [83, -30], [82, -50], [77, -68], [68, -52], [60, -44]
  ];
  drawPoly(greenland, '#1b4a70', '#74D4F5');

  // --- SVALBARD ARCHIPELAGO (Ny-Ålesund / Himadri Site) ---
  const svalbard: [number, number][] = [
    [76.5, 16], [78.2, 15.6], [79.2, 12], [80, 18], [80.5, 24], [78.5, 22], [76.5, 16]
  ];
  drawPoly(svalbard, '#255e8c', '#a5f0ff');

  // --- EURASIA ---
  const eurasia: [number, number][] = [
    [36, -6], [43, -9], [48, -4], [52, 5], [58, 6], [62, 5], [71, 28], [70, 60], [73, 72],
    [76, 110], [72, 140], [66, 170], [60, 160], [52, 140], [42, 130], [35, 120], [22, 114],
    [10, 106], [1, 104], [15, 96], [22, 90], [25, 80], [20, 73], [12, 75], [8, 77], [13, 80],
    [22, 70], [25, 62], [28, 50], [30, 35], [36, 28], [40, 26], [38, 15], [36, -6]
  ];
  drawPoly(eurasia, '#0c2238', '#1a4369');

  // --- HIMALAYAS & THIRD POLE GLACIER CRESCENT (Glowing Mountain Ridge) ---
  const himalayasRidge: [number, number][] = [
    [28, 75], [31, 78], [33, 76], [35, 78], [36, 80], [32, 85], [30, 92], [27, 88], [28, 75]
  ];
  drawPoly(himalayasRidge, '#215680', '#63d4f7');

  // --- AFRICA ---
  const africa: [number, number][] = [
    [36, -6], [37, 10], [32, 32], [12, 44], [12, 51], [0, 42], [-15, 40], [-28, 32],
    [-34.8, 20], [-34, 18.4], [-20, 12], [-5, 12], [4, 9], [6, 2], [5, -4], [15, -17], [36, -6]
  ];
  drawPoly(africa, '#0c2238', '#1a4369');

  // --- NORTH AMERICA ---
  const northAmerica: [number, number][] = [
    [7, -78], [15, -88], [20, -97], [29, -95], [25, -80], [35, -75], [45, -65], [52, -56],
    [60, -64], [68, -85], [72, -95], [70, -135], [71, -156], [60, -165], [54, -165],
    [58, -137], [48, -124], [35, -120], [23, -110], [15, -92], [7, -78]
  ];
  drawPoly(northAmerica, '#0c2238', '#1a4369');

  // --- SOUTH AMERICA ---
  const southAmerica: [number, number][] = [
    [12, -72], [10, -62], [5, -52], [-5, -35], [-23, -42], [-35, -55], [-45, -65],
    [-55, -68], [-53, -74], [-40, -74], [-20, -70], [-5, -80], [8, -78], [12, -72]
  ];
  drawPoly(southAmerica, '#0c2238', '#1a4369');

  // --- AUSTRALIA ---
  const australia: [number, number][] = [
    [-12, 131], [-12, 136], [-15, 145], [-24, 153], [-37, 150], [-38, 140], [-35, 116], [-22, 114], [-12, 131]
  ];
  drawPoly(australia, '#0c2238', '#1a4369');

  // 4. Glowing Atmosphere and Contour Accents
  ctx.shadowColor = '#00e5ff';
  ctx.shadowBlur = 12;
  ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
  ctx.stroke();
  ctx.shadowBlur = 0;

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  return texture;
}

export function PolarGlobeExplorer() {
  // View states
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [explorationMode, setExplorationMode] = useState<ExplorationMode>('overview');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState<boolean>(false);
  const [selectedEntity, setSelectedEntity] = useState<GlobeEntity | null>(null);
  const [hoveredEntity, setHoveredEntity] = useState<GlobeEntity | null>(null);
  const [selectedExpeditionId, setSelectedExpeditionId] = useState<string>('iae46');
  const [activeWaypointIndex, setActiveWaypointIndex] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [cameraCoordinates, setCameraCoordinates] = useState<{ lat: number; lng: number; dist: number }>({
    lat: -70,
    lng: 45,
    dist: 350,
  });

  // DOM Container Ref
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Three.js State Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const markersGroupRef = useRef<THREE.Group | null>(null);
  const routesGroupRef = useRef<THREE.Group | null>(null);
  const haloMeshRef = useRef<THREE.Mesh | null>(null);

  // Animation & Interaction tracking refs
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0.35, y: -0.8 }); // default focus near Antarctica
  const currentRotationRef = useRef<{ x: number; y: number }>({ x: 0.35, y: -0.8 });
  const cameraDistanceRef = useRef(290);
  const targetCameraDistanceRef = useRef(290);
  const touchStartDistRef = useRef<number | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  const pulsePhaseRef = useRef<number>(0);

  // Compile Comprehensive Globe Entities from all real datasets
  const allGlobeEntities = useMemo<GlobeEntity[]>(() => {
    const list: GlobeEntity[] = [];

    // 1. Research Stations
    expeditionMapData.forEach((exp) => {
      exp.stations.forEach((st) => {
        list.push({
          id: st.id,
          name: st.name,
          type: st.type === 'vessel' ? 'vessel' : 'station',
          category: st.category,
          coordinates: st.coordinates,
          region: st.region,
          year: exp.year,
          expeditionId: exp.id,
          expeditionTitle: exp.title,
          leaderOrScientist: st.leaderOrScientist,
          description: st.description,
          activity: st.activity,
          instruments: st.instruments,
          samplesOrDataCollected: st.samplesOrDataCollected,
          status: 'Active Telemetry',
          metrics: [
            { label: 'Coordinates', value: `${st.coordinates[0].toFixed(2)}°, ${st.coordinates[1].toFixed(2)}°` },
            { label: 'Region', value: st.region },
            { label: 'Expedition', value: exp.title.split('(')[1]?.replace(')', '') || exp.title },
          ],
          related: st.related,
        });
      });

      // 2. Sampling Sites
      exp.samplingSites.forEach((site) => {
        list.push({
          id: site.id,
          name: site.name,
          type: 'sampling_site',
          category: site.category,
          coordinates: site.coordinates,
          region: site.region,
          year: exp.year,
          expeditionId: exp.id,
          expeditionTitle: exp.title,
          leaderOrScientist: site.leaderOrScientist,
          description: site.description,
          activity: site.activity,
          instruments: site.instruments,
          samplesOrDataCollected: site.samplesOrDataCollected,
          status: 'Field Validated',
          metrics: [
            { label: 'Site Type', value: site.category },
            { label: 'Sample Date', value: site.date || '2026' },
            { label: 'Lead PI', value: site.leaderOrScientist },
          ],
          related: site.related,
        });
      });
    });

    // 3. Open Datasets mapped to real coordinates
    demoDatasets.forEach((ds) => {
      let coords: [number, number] = [-69.41, 76.19];
      let region: GlobeEntity['region'] = 'Antarctica';

      if (ds.region.toLowerCase().includes('arctic') || ds.region.toLowerCase().includes('svalbard')) {
        coords = [78.91, 11.93];
        region = 'Arctic';
      } else if (ds.region.toLowerCase().includes('ocean')) {
        coords = [-55.0, 57.5];
        region = 'Southern Ocean';
      } else if (ds.region.toLowerCase().includes('himalaya')) {
        coords = [32.4, 77.65];
        region = 'Himalayas';
      } else if (ds.region.toLowerCase().includes('maitri')) {
        coords = [-70.77, 11.73];
        region = 'Antarctica';
      }

      const recordCount = ds.recordCount || ds.values?.length || 1200;
      list.push({
        id: ds.id,
        name: ds.title,
        type: 'dataset',
        category: ds.category,
        coordinates: coords,
        region: region,
        year: ds.period || '2026',
        description: ds.description,
        activity: `Data Points: ${recordCount.toLocaleString()} · Resolution: ${ds.period}`,
        samplesOrDataCollected: ds.variables ? ds.variables.join(', ') : ds.unit,
        status: ds.status || 'VERIFIED',
        metrics: [
          { label: 'Dataset Size', value: ds.size || `${recordCount.toLocaleString()} records` },
          { label: 'Format', value: ds.format || 'NetCDF / GeoTIFF' },
          { label: 'Access', value: ds.license || 'Open Access' },
        ],
        related: {
          expeditions: ds.expeditionId ? [ds.expeditionId] : ['iae46'],
          publications: ds.relatedPublicationIds || [],
        },
      });
    });

    // 4. Peer-Reviewed Publications mapped to field study areas
    demoPublications.forEach((pub) => {
      let coords: [number, number] = [-72.5, 75.0];
      let region: GlobeEntity['region'] = 'Antarctica';
      const reg = (pub.researchRegion || '').toLowerCase();

      if (reg.includes('arctic') || reg.includes('svalbard')) {
        coords = [78.88, 12.05];
        region = 'Arctic';
      } else if (reg.includes('ocean')) {
        coords = [-65.0, 57.5];
        region = 'Southern Ocean';
      } else if (reg.includes('himalaya')) {
        coords = [32.44, 77.68];
        region = 'Himalayas';
      }

      list.push({
        id: pub.id,
        name: pub.title,
        type: 'publication',
        category: pub.category,
        coordinates: coords,
        region: region,
        year: pub.year,
        leaderOrScientist: pub.authors?.[0] || 'NCPOR Scientist',
        description: pub.abstract,
        activity: `Published in ${pub.journal} (DOI: ${pub.doi})`,
        samplesOrDataCollected: pub.keyFindings?.[0] || 'Peer-reviewed polar science finding',
        status: 'Peer-Reviewed',
        metrics: [
          { label: 'Journal', value: pub.journal },
          { label: 'Lead Author', value: pub.authors?.[0] || 'PI' },
          { label: 'Year', value: pub.year.toString() },
        ],
        related: {
          datasets: pub.dataSources || [],
        },
      });
    });

    // 5. Lead Scientists / Field PIs
    researchers.forEach((res) => {
      let coords: [number, number] = [-69.41, 76.19];
      let region: GlobeEntity['region'] = 'Antarctica';

      if (res.region.toLowerCase().includes('arctic')) {
        coords = [78.91, 11.93];
        region = 'Arctic';
      } else if (res.region.toLowerCase().includes('ocean')) {
        coords = [-55.0, 57.5];
        region = 'Southern Ocean';
      } else if (res.region.toLowerCase().includes('himalaya')) {
        coords = [32.4, 77.65];
        region = 'Himalayas';
      }

      list.push({
        id: res.id,
        name: res.name,
        type: 'scientist',
        category: res.role,
        coordinates: coords,
        region: region,
        leaderOrScientist: res.name,
        description: res.bio,
        activity: res.specialization,
        samplesOrDataCollected: `Institution: ${res.institution}`,
        status: 'Principal Investigator',
        metrics: [
          { label: 'Institution', value: res.institution },
          { label: 'Specialization', value: res.specialization },
          { label: 'Active Region', value: res.region },
        ],
        related: {
          expeditions: res.expeditions,
          publications: res.publications,
          datasets: res.datasets,
        },
      });
    });

    return list;
  }, []);

  // Filter entities according to exploration mode, region, year, and search query
  const filteredEntities = useMemo(() => {
    return allGlobeEntities.filter((entity) => {
      // 1. Region filter
      if (selectedRegion !== 'All' && entity.region !== selectedRegion) {
        return false;
      }

      // 2. Exploration mode filter
      if (explorationMode === 'stations' && entity.type !== 'station' && entity.type !== 'vessel') {
        return false;
      }
      if (explorationMode === 'sites' && entity.type !== 'sampling_site') {
        return false;
      }
      if (explorationMode === 'datasets' && entity.type !== 'dataset') {
        return false;
      }
      if (explorationMode === 'publications' && entity.type !== 'publication') {
        return false;
      }
      if (explorationMode === 'scientists' && entity.type !== 'scientist') {
        return false;
      }
      if (explorationMode === 'expeditions') {
        if (entity.expeditionId !== selectedExpeditionId && entity.type !== 'station') {
          return false;
        }
      }
      if (explorationMode === 'climate') {
        const text = (entity.category + ' ' + entity.description + ' ' + (entity.activity || '')).toLowerCase();
        if (!text.includes('glacier') && !text.includes('ice') && !text.includes('permafrost') && !text.includes('climate') && !text.includes('aerosol')) {
          return false;
        }
      }
      if (explorationMode === 'ocean') {
        const text = (entity.category + ' ' + entity.description + ' ' + (entity.activity || '')).toLowerCase();
        if (!text.includes('ocean') && !text.includes('ctd') && !text.includes('argo') && !text.includes('water') && !text.includes('vessel') && !text.includes('fjord')) {
          return false;
        }
      }

      // 3. Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          entity.name.toLowerCase().includes(q) ||
          entity.category.toLowerCase().includes(q) ||
          entity.description.toLowerCase().includes(q) ||
          (entity.leaderOrScientist && entity.leaderOrScientist.toLowerCase().includes(q));
        if (!matches) return false;
      }

      return true;
    });
  }, [allGlobeEntities, explorationMode, selectedRegion, selectedExpeditionId, searchQuery]);

  // Selected Active Expedition for Route visualization
  const currentExpedition = useMemo(() => {
    return expeditionMapData.find((e) => e.id === selectedExpeditionId) || expeditionMapData[0];
  }, [selectedExpeditionId]);

  // Handle Timeline Playback
  useEffect(() => {
    if (!isTimelinePlaying) return;
    const interval = setInterval(() => {
      setSelectedYear((prev) => (prev >= 2026 ? 2020 : prev + 1));
    }, 2800);
    return () => clearInterval(interval);
  }, [isTimelinePlaying]);

  // Fast-travel camera focus helper
  const focusOnCoordinates = useCallback((lat: number, lng: number, zoomDistance = 240) => {
    // Calculate rotation angles from target lat/lng
    const targetY = -(lng * (Math.PI / 180)) - Math.PI / 2;
    const targetX = lat * (Math.PI / 180);

    targetRotationRef.current = { x: targetX, y: targetY };
    targetCameraDistanceRef.current = zoomDistance;
  }, []);

  // Handle region fast-travel jumps
  const handleRegionJump = useCallback(
    (region: string) => {
      setSelectedRegion(region);
      if (region === 'Antarctica') {
        focusOnCoordinates(-72, 45, 230);
      } else if (region === 'Arctic') {
        focusOnCoordinates(78, 15, 230);
      } else if (region === 'Southern Ocean') {
        focusOnCoordinates(-55, 57, 260);
      } else if (region === 'Himalayas') {
        focusOnCoordinates(32.4, 77.6, 220);
      } else {
        focusOnCoordinates(-20, 30, 300);
      }
    },
    [focusOnCoordinates]
  );

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Step through expedition waypoints
  const handleNextWaypoint = () => {
    if (!currentExpedition.routePoints.length) return;
    const nextIdx = (activeWaypointIndex + 1) % currentExpedition.routePoints.length;
    setActiveWaypointIndex(nextIdx);
    const pt = currentExpedition.routePoints[nextIdx];
    focusOnCoordinates(pt[0], pt[1], 210);
  };

  const handlePrevWaypoint = () => {
    if (!currentExpedition.routePoints.length) return;
    const prevIdx = (activeWaypointIndex - 1 + currentExpedition.routePoints.length) % currentExpedition.routePoints.length;
    setActiveWaypointIndex(prevIdx);
    const pt = currentExpedition.routePoints[prevIdx];
    focusOnCoordinates(pt[0], pt[1], 210);
  };

  // ----------------------------------------------------------------------
  // THREE.JS 3D POLAR GLOBE INITIALIZATION & RENDER LOOP
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (viewMode !== '3d' || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 700;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color('#030812'); // Deep Polar Night

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 3000);
    camera.position.set(0, 0, cameraDistanceRef.current);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight('#74D4F5', 1.8);
    sunLight.position.set(500, 400, 500);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight('#00e5ff', 1.2);
    rimLight.position.set(-500, -200, -300);
    scene.add(rimLight);

    // 5. Starfield Background (1,500 Twinkling Polar Stars)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 1500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const dist = 900 + Math.random() * 500;

      starPositions[i * 3] = dist * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = dist * Math.cos(phi);

      const isCyan = Math.random() > 0.7;
      starColors[i * 3] = isCyan ? 0.45 : 0.9;
      starColors[i * 3 + 1] = isCyan ? 0.85 : 0.95;
      starColors[i * 3 + 2] = isCyan ? 1.0 : 1.0;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // 6. Globe Group
    const globeGroup = new THREE.Group();
    globeGroupRef.current = globeGroup;
    scene.add(globeGroup);

    const GLOBE_RADIUS = 100;

    // Earth Sphere Mesh
    const earthTexture = generateEarthTexture();
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthMaterial = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.65,
      metalness: 0.25,
      emissive: new THREE.Color('#031224'),
      emissiveIntensity: 0.4,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // Atmospheric Fresnel Halo Outer Glow
    const haloGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.035, 48, 48);
    const haloMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(0.0, 0.85, 1.0, 1.0) * intensity * 0.9;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    haloMeshRef.current = haloMesh;
    scene.add(haloMesh);

    // 3D Polar Orbital Rings (Equator & Polar Circles)
    const ringMaterial = new THREE.LineBasicMaterial({
      color: 0x74d4f5,
      transparent: true,
      opacity: 0.35,
    });

    const createLatitudeRing = (lat: number, r: number) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 72; i++) {
        const lng = (i / 72) * 360 - 180;
        points.push(latLngToVector3(lat, lng, r));
      }
      const geom = new THREE.BufferGeometry().setFromPoints(points);
      return new THREE.Line(geom, ringMaterial);
    };

    globeGroup.add(createLatitudeRing(66.5, GLOBE_RADIUS * 1.002)); // Arctic Circle
    globeGroup.add(createLatitudeRing(-66.5, GLOBE_RADIUS * 1.002)); // Antarctic Circle
    globeGroup.add(createLatitudeRing(0, GLOBE_RADIUS * 1.002)); // Equator

    // 7. Markers & Routes Subgroups
    const markersGroup = new THREE.Group();
    markersGroupRef.current = markersGroup;
    globeGroup.add(markersGroup);

    const routesGroup = new THREE.Group();
    routesGroupRef.current = routesGroup;
    globeGroup.add(routesGroup);

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Mouse / Touch Interaction Event Handlers
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current || !cameraRef.current || !globeGroupRef.current) return;

      const rect = canvas.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Raycasting for interactive marker hover
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

      if (markersGroupRef.current) {
        const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const entity = hit.userData?.entity as GlobeEntity | undefined;
          if (entity) {
            setHoveredEntity(entity);
            canvas.style.cursor = 'pointer';
          }
        } else {
          setHoveredEntity(null);
          canvas.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
        }
      }

      // Drag to rotate
      if (isDraggingRef.current) {
        const deltaX = e.clientX - previousMousePositionRef.current.x;
        const deltaY = e.clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.0055;
        targetRotationRef.current.x = Math.max(
          -Math.PI / 2.1,
          Math.min(Math.PI / 2.1, targetRotationRef.current.x + deltaY * 0.0055)
        );

        previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'grab';
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY * 0.22;
      targetCameraDistanceRef.current = Math.max(140, Math.min(550, targetCameraDistanceRef.current + zoomFactor));
    };

    // Touch Support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2) {
        isDraggingRef.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDistRef.current = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && isDraggingRef.current) {
        const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
        const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

        targetRotationRef.current.y += deltaX * 0.006;
        targetRotationRef.current.x = Math.max(
          -Math.PI / 2.1,
          Math.min(Math.PI / 2.1, targetRotationRef.current.x + deltaY * 0.006)
        );

        previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newDist = Math.hypot(dx, dy);
        const diff = touchStartDistRef.current - newDist;
        targetCameraDistanceRef.current = Math.max(140, Math.min(550, targetCameraDistanceRef.current + diff * 0.5));
        touchStartDistRef.current = newDist;
      }
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
      touchStartDistRef.current = null;
    };

    // Click on marker
    const onClick = (e: MouseEvent) => {
      if (!canvasRef.current || !cameraRef.current || !markersGroupRef.current) return;
      const rect = canvas.getBoundingClientRect();
      const mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(mouseX, mouseY), cameraRef.current);

      const intersects = raycaster.intersectObjects(markersGroupRef.current.children, true);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        const entity = hit.userData?.entity as GlobeEntity | undefined;
        if (entity) {
          setSelectedEntity(entity);
          focusOnCoordinates(entity.coordinates[0], entity.coordinates[1], 210);
        }
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('click', onClick);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // 8. Main Render Animation Loop
    const renderLoop = () => {
      pulsePhaseRef.current += 0.04;

      // Auto rotation when idle
      if (autoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += 0.0012;
      }

      // Smooth inertia rotation interpolation
      currentRotationRef.current.x += (targetRotationRef.current.x - currentRotationRef.current.x) * 0.08;
      currentRotationRef.current.y += (targetRotationRef.current.y - currentRotationRef.current.y) * 0.08;

      // Smooth camera distance zoom interpolation
      cameraDistanceRef.current += (targetCameraDistanceRef.current - cameraDistanceRef.current) * 0.1;
      if (cameraRef.current) {
        cameraRef.current.position.z = cameraDistanceRef.current;
      }

      // Apply rotation to globe group
      if (globeGroupRef.current) {
        globeGroupRef.current.rotation.x = currentRotationRef.current.x;
        globeGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      // Update camera coordinate HUD values
      const currentLat = -(currentRotationRef.current.x * (180 / Math.PI));
      const currentLng = -((currentRotationRef.current.y + Math.PI / 2) * (180 / Math.PI)) % 360;
      setCameraCoordinates({
        lat: Math.max(-90, Math.min(90, currentLat)),
        lng: ((currentLng + 180) % 360) - 180,
        dist: Math.round(cameraDistanceRef.current),
      });

      // Animate pulsing scale of marker beacon rings
      if (markersGroupRef.current) {
        markersGroupRef.current.children.forEach((marker) => {
          const pulseRing = marker.getObjectByName('pulseRing');
          if (pulseRing) {
            const scale = 1 + 0.35 * Math.sin(pulsePhaseRef.current * 2);
            pulseRing.scale.set(scale, scale, scale);
          }
        });
      }

      renderer.render(scene, camera);
      animationFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameIdRef.current = requestAnimationFrame(renderLoop);

    // Cleanup on unmount or viewMode change
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('click', onClick);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
    };
  }, [viewMode, autoRotate, focusOnCoordinates]);

  // ----------------------------------------------------------------------
  // REBUILD 3D MARKERS & EXPEDITION ROUTES ON FILTER / SELECTION CHANGE
  // ----------------------------------------------------------------------
  useEffect(() => {
    if (viewMode !== '3d' || !markersGroupRef.current || !routesGroupRef.current) return;

    const markersGroup = markersGroupRef.current;
    const routesGroup = routesGroupRef.current;
    const GLOBE_RADIUS = 100;

    // Clear old 3D children safely
    while (markersGroup.children.length > 0) {
      const obj = markersGroup.children[0];
      markersGroup.remove(obj);
    }
    while (routesGroup.children.length > 0) {
      const obj = routesGroup.children[0];
      routesGroup.remove(obj);
    }

    // 1. Build 3D Interactive Object Markers
    filteredEntities.forEach((entity) => {
      const isSelected = selectedEntity?.id === entity.id;
      const markerGroup = new THREE.Group();
      markerGroup.userData = { entity };

      const pos = latLngToVector3(entity.coordinates[0], entity.coordinates[1], GLOBE_RADIUS * 1.01);
      markerGroup.position.copy(pos);

      // Align marker orientation to globe surface normal
      markerGroup.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

      // Colors by entity type
      let markerColor = 0x00e5ff; // stations / default
      let pinHeight = 5;
      let pinRadius = 1.2;

      if (entity.type === 'station') {
        markerColor = 0x00e5ff; // Cyan
        pinHeight = 7;
        pinRadius = 1.6;
      } else if (entity.type === 'sampling_site') {
        markerColor = 0xffb703; // Amber / Gold
        pinHeight = 5;
        pinRadius = 1.3;
      } else if (entity.type === 'vessel') {
        markerColor = 0x06d6a0; // Emerald
        pinHeight = 6;
        pinRadius = 1.5;
      } else if (entity.type === 'dataset') {
        markerColor = 0x3a86ff; // Cobalt Blue
        pinHeight = 4.5;
        pinRadius = 1.1;
      } else if (entity.type === 'publication') {
        markerColor = 0x9d4edd; // Violet
        pinHeight = 4.5;
        pinRadius = 1.1;
      } else if (entity.type === 'scientist') {
        markerColor = 0xf72585; // Magenta
        pinHeight = 5;
        pinRadius = 1.2;
      }

      // Vertical Glowing Pin/Stem
      const pinGeom = new THREE.CylinderGeometry(0.3, pinRadius * 0.8, pinHeight, 16);
      pinGeom.translate(0, pinHeight / 2, 0);
      const pinMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffffff : markerColor,
        transparent: true,
        opacity: isSelected ? 1.0 : 0.85,
      });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.userData = { entity };
      markerGroup.add(pinMesh);

      // Top Beacon Orb
      const orbGeom = new THREE.SphereGeometry(pinRadius, 16, 16);
      orbGeom.translate(0, pinHeight + pinRadius, 0);
      const orbMat = new THREE.MeshBasicMaterial({
        color: isSelected ? 0xffffff : markerColor,
      });
      const orbMesh = new THREE.Mesh(orbGeom, orbMat);
      orbMesh.userData = { entity };
      markerGroup.add(orbMesh);

      // Pulsing Radar Base Ring
      const ringGeom = new THREE.RingGeometry(pinRadius * 1.5, pinRadius * 2.6, 24);
      ringGeom.rotateX(-Math.PI / 2);
      const ringMat = new THREE.MeshBasicMaterial({
        color: markerColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: isSelected ? 0.9 : 0.45,
      });
      const pulseRing = new THREE.Mesh(ringGeom, ringMat);
      pulseRing.name = 'pulseRing';
      pulseRing.userData = { entity };
      markerGroup.add(pulseRing);

      markersGroup.add(markerGroup);
    });

    // 2. Build 3D Animated Expedition Routes
    if (explorationMode === 'expeditions' || explorationMode === 'overview') {
      const activeExp = currentExpedition;
      if (activeExp && activeExp.routePoints.length >= 2) {
        const routePoints = activeExp.routePoints;

        for (let i = 0; i < routePoints.length - 1; i++) {
          const start = routePoints[i];
          const end = routePoints[i + 1];
          const curveVecs = createCurvedRoute(start[0], start[1], end[0], end[1], GLOBE_RADIUS * 1.015, 25);

          const curveGeom = new THREE.BufferGeometry().setFromPoints(curveVecs);
          const curveMat = new THREE.LineDashedMaterial({
            color: 0x00e5ff,
            linewidth: 3,
            scale: 1,
            dashSize: 2.5,
            gapSize: 1.5,
            transparent: true,
            opacity: 0.9,
          });

          const routeLine = new THREE.Line(curveGeom, curveMat);
          routeLine.computeLineDistances();
          routesGroup.add(routeLine);
        }

        // Add 3D Waypoint Number Badges
        routePoints.forEach((pt, idx) => {
          const wpPos = latLngToVector3(pt[0], pt[1], GLOBE_RADIUS * 1.02);
          const wpGeom = new THREE.SphereGeometry(1.4, 12, 12);
          const wpMat = new THREE.MeshBasicMaterial({
            color: idx === activeWaypointIndex ? 0xffffff : 0x00e5ff,
          });
          const wpMesh = new THREE.Mesh(wpGeom, wpMat);
          wpMesh.position.copy(wpPos);
          routesGroup.add(wpMesh);
        });
      }
    }
  }, [viewMode, filteredEntities, explorationMode, currentExpedition, activeWaypointIndex, selectedEntity]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[#030812] text-white select-none transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-[9999] h-screen w-screen' : 'rounded-3xl border border-[#183647]/30 shadow-2xl h-[780px]'
      }`}
    >
      {/* 1. TOP HEADER & EXPLORATION TOOLBAR */}
      <div className="absolute top-0 inset-x-0 z-30 p-4 md:p-6 bg-gradient-to-b from-[#030812]/95 via-[#030812]/80 to-transparent backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Status */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#00e5ff]/15 border border-[#00e5ff]/30 text-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.3)]">
              <GlobeIcon size={22} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black tracking-widest uppercase text-white">Yuki Polar Globe</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#00e5ff]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#00e5ff] border border-[#00e5ff]/30">
                  <Radio size={10} className="animate-pulse" /> 3D Digital Twin Active
                </span>
              </div>
              <p className="text-xs text-white/60">Global Geospatial Science Observatory & Polar Mission Hub</p>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="relative max-w-md w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search Bharati, Maitri, Himadri, Ice Cores, CTD, PIs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-white/5 pl-9 pr-8 py-2 text-xs text-white placeholder-white/40 outline-none backdrop-blur-xl focus:border-[#00e5ff]/50 focus:bg-white/10 transition"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Action Controls (2D/3D Toggle, Auto-Rotate, Fullscreen) */}
          <div className="flex items-center gap-2">
            {/* 2D / 3D Mode Toggle */}
            <div className="flex rounded-2xl bg-white/10 p-1 border border-white/10 backdrop-blur-xl">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === '3d' ? 'bg-[#00e5ff] text-[#030812] shadow-[0_0_12px_rgba(0,229,255,0.4)]' : 'text-white/70 hover:text-white'
                }`}
              >
                <GlobeIcon size={13} /> 3D Globe
              </button>
              <button
                onClick={() => setViewMode('2d')}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                  viewMode === '2d' ? 'bg-[#00e5ff] text-[#030812] shadow-[0_0_12px_rgba(0,229,255,0.4)]' : 'text-white/70 hover:text-white'
                }`}
              >
                <MapIcon size={13} /> 2D Map
              </button>
            </div>

            {/* Auto-Rotate Toggle (3D Mode) */}
            {viewMode === '3d' && (
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1 rounded-2xl border px-3 py-2 text-xs font-bold backdrop-blur-xl transition ${
                  autoRotate ? 'border-[#00e5ff] bg-[#00e5ff]/20 text-[#00e5ff]' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                }`}
                title="Toggle Slow Cinematic Orbit"
              >
                <RotateCcw size={13} className={autoRotate ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">{autoRotate ? 'Orbit On' : 'Orbit'}</span>
              </button>
            )}

            {/* Reset View */}
            <button
              onClick={() => handleRegionJump('All')}
              className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/70 hover:bg-white/10 backdrop-blur-xl transition"
              title="Reset View Orientation"
            >
              <Compass size={13} />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 backdrop-blur-xl transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
            </button>
          </div>
        </div>

        {/* 2. EXPLORATION MODES (CRITICAL FEATURE PILL SELECTOR) */}
        <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: Sparkles, count: allGlobeEntities.length },
            { id: 'expeditions', label: 'Expeditions', icon: Navigation, count: demoExpeditions.length },
            { id: 'stations', label: 'Research Stations', icon: Radio, count: 5 },
            { id: 'sites', label: 'Sampling Sites', icon: Activity, count: 8 },
            { id: 'datasets', label: 'Datasets', icon: Database, count: demoDatasets.length },
            { id: 'publications', label: 'Publications', icon: BookOpen, count: demoPublications.length },
            { id: 'scientists', label: 'Scientists', icon: User, count: researchers.length },
            { id: 'climate', label: 'Ice / Climate', icon: Snowflake, count: 6 },
            { id: 'ocean', label: 'Ocean', icon: Waves, count: 5 },
          ].map((mode) => {
            const Icon = mode.icon;
            const isActive = explorationMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setExplorationMode(mode.id as ExplorationMode);
                  setSelectedEntity(null);
                }}
                className={`flex items-center gap-2 shrink-0 rounded-2xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#00e5ff] text-[#030812] shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-105'
                    : 'bg-white/5 text-white/75 hover:bg-white/10 hover:text-white border border-white/5'
                }`}
              >
                <Icon size={13} />
                <span>{mode.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    isActive ? 'bg-[#030812]/20 text-[#030812]' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {mode.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. POLAR FAST-TRAVEL QUICK REGIONS (South Pole, North Pole, Southern Ocean, Himalayas) */}
      <div className="absolute left-6 top-36 z-20 flex flex-col gap-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-[#00e5ff]/80 drop-shadow">
          Polar Focus Points
        </div>
        {[
          { id: 'Antarctica', label: 'Antarctica (South Pole)', icon: Snowflake, lat: -72, lng: 45 },
          { id: 'Arctic', label: 'Arctic (North Pole)', icon: Compass, lat: 78, lng: 15 },
          { id: 'Southern Ocean', label: 'Southern Ocean', icon: Waves, lat: -55, lng: 57 },
          { id: 'Himalayas', label: 'Himalayas (Third Pole)', icon: Mountain, lat: 32.4, lng: 77.6 },
        ].map((reg) => {
          const Icon = reg.icon;
          const isSelected = selectedRegion === reg.id;
          return (
            <button
              key={reg.id}
              onClick={() => handleRegionJump(reg.id)}
              className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2 text-xs font-bold backdrop-blur-xl border transition-all ${
                isSelected
                  ? 'bg-[#00e5ff] text-[#030812] border-[#00e5ff] shadow-[0_0_15px_rgba(0,229,255,0.4)] scale-105'
                  : 'bg-[#030812]/70 text-white/80 border-white/10 hover:bg-white/15 hover:text-white'
              }`}
            >
              <Icon size={14} className={isSelected ? 'text-[#030812]' : 'text-[#00e5ff]'} />
              <span>{reg.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. ACTIVE EXPEDITION ROUTE CONTROLS (When in Expedition Mode) */}
      {explorationMode === 'expeditions' && (
        <div className="absolute right-6 top-36 z-20 w-80 rounded-3xl border border-white/10 bg-[#030812]/85 p-4 backdrop-blur-2xl shadow-2xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#00e5ff]">
              Active Expedition Path
            </span>
            <span className="rounded-full bg-[#00e5ff]/20 px-2 py-0.5 text-[10px] font-bold text-[#00e5ff]">
              {currentExpedition.status}
            </span>
          </div>

          <div>
            <select
              value={selectedExpeditionId}
              onChange={(e) => {
                setSelectedExpeditionId(e.target.value);
                setActiveWaypointIndex(0);
                const exp = expeditionMapData.find((x) => x.id === e.target.value);
                if (exp && exp.routePoints.length) {
                  focusOnCoordinates(exp.routePoints[0][0], exp.routePoints[0][1], 220);
                }
              }}
              className="w-full rounded-2xl border border-white/15 bg-white/10 p-2.5 text-xs font-bold text-white outline-none"
            >
              {expeditionMapData.map((exp) => (
                <option key={exp.id} value={exp.id} className="bg-[#071D33] text-white">
                  {exp.title} ({exp.year})
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-white/70 line-clamp-2">{currentExpedition.summary}</div>

          {/* Stepper Controls */}
          <div className="rounded-2xl bg-white/5 p-3 border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-white/80">
              <span>Waypoint Step {activeWaypointIndex + 1} of {currentExpedition.routePoints.length}</span>
              <span className="text-[#00e5ff]">
                {currentExpedition.routePoints[activeWaypointIndex]
                  ? `${currentExpedition.routePoints[activeWaypointIndex][0].toFixed(1)}°, ${currentExpedition.routePoints[activeWaypointIndex][1].toFixed(1)}°`
                  : ''}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevWaypoint}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-white/10 py-1.5 text-xs font-bold hover:bg-white/20 transition"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <button
                onClick={handleNextWaypoint}
                className="flex-1 flex items-center justify-center gap-1 rounded-xl bg-[#00e5ff] text-[#030812] py-1.5 text-xs font-bold hover:bg-[#74d4f5] transition"
              >
                Next Step <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 3D WEBGL GLOBE CANVAS */}
      {viewMode === '3d' ? (
        <canvas ref={canvasRef} className="h-full w-full block cursor-grab active:cursor-grabbing" />
      ) : (
        /* 2D MAP MODE (Integrated Leaflet Polar Map) */
        <div className="h-full w-full pt-28 pb-20">
          <InteractivePolarMap height="100%" showSidebar={true} initialExpeditionId={selectedExpeditionId} />
        </div>
      )}

      {/* 6. HOVER TOOLTIP ON 3D OBJECTS */}
      {hoveredEntity && !selectedEntity && viewMode === '3d' && (
        <div className="pointer-events-none absolute bottom-28 left-1/2 -translate-x-1/2 z-30 rounded-2xl border border-[#00e5ff]/50 bg-[#030812]/90 px-4 py-2.5 backdrop-blur-xl shadow-[0_0_25px_rgba(0,229,255,0.3)]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#00e5ff] animate-ping" />
            <span className="text-xs font-black text-white">{hoveredEntity.name}</span>
            <span className="text-[10px] rounded-full bg-white/10 px-2 py-0.5 text-[#00e5ff] font-bold">
              {hoveredEntity.category}
            </span>
          </div>
          <div className="text-[11px] text-white/70 mt-1">
            Lat: {hoveredEntity.coordinates[0].toFixed(2)}° · Lng: {hoveredEntity.coordinates[1].toFixed(2)}° · Click to inspect details
          </div>
        </div>
      )}

      {/* 7. TRANSLUCENT GLASSMORPHISM INFORMATION CARD (CLICKED OBJECT DETAILS) */}
      {selectedEntity && (
        <div className="absolute right-6 top-36 bottom-24 z-30 w-96 max-w-[calc(100vw-3rem)] overflow-y-auto rounded-3xl border border-white/20 bg-[#030812]/90 p-5 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] space-y-4 animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <span className="rounded-full bg-[#00e5ff]/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#00e5ff] border border-[#00e5ff]/30">
                {selectedEntity.type.replace('_', ' ')}
              </span>
              <h3 className="mt-2 text-base font-black text-white leading-tight">{selectedEntity.name}</h3>
              <p className="text-xs text-white/60">{selectedEntity.category}</p>
            </div>
            <button
              onClick={() => setSelectedEntity(null)}
              className="rounded-full bg-white/10 p-1.5 text-white/60 hover:bg-white/20 hover:text-white transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Coordinates & Region Metric Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/5 p-2.5 border border-white/5">
              <div className="text-[10px] font-bold uppercase text-white/40">Coordinates</div>
              <div className="mt-1 text-xs font-black text-[#00e5ff]">
                {selectedEntity.coordinates[0].toFixed(2)}°, {selectedEntity.coordinates[1].toFixed(2)}°
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-2.5 border border-white/5">
              <div className="text-[10px] font-bold uppercase text-white/40">Region</div>
              <div className="mt-1 text-xs font-black text-white">{selectedEntity.region}</div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Overview</div>
            <p className="text-xs text-white/80 leading-relaxed">{selectedEntity.description}</p>
          </div>

          {/* Scientific Activity / Samples */}
          {selectedEntity.activity && (
            <div className="rounded-2xl bg-[#00e5ff]/10 p-3 border border-[#00e5ff]/20 space-y-1">
              <div className="text-[10px] font-bold uppercase text-[#00e5ff]">Scientific Activity</div>
              <div className="text-xs text-white font-medium">{selectedEntity.activity}</div>
            </div>
          )}

          {/* Instruments */}
          {selectedEntity.instruments && selectedEntity.instruments.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-white/40">Active Instrumentation</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedEntity.instruments.map((inst, i) => (
                  <span key={i} className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white/90">
                    {inst}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Direct Yuki Links */}
          <div className="border-t border-white/10 pt-3 space-y-2">
            {selectedEntity.expeditionId && (
              <Link
                to={`/expeditions/${selectedEntity.expeditionId}`}
                className="flex items-center justify-between rounded-2xl bg-[#00e5ff] px-4 py-2.5 text-xs font-bold text-[#030812] hover:bg-[#74d4f5] transition shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                <span>Open Expedition Dossier</span>
                <ExternalLink size={14} />
              </Link>
            )}

            {selectedEntity.type === 'dataset' && (
              <Link
                to={`/datasets/${selectedEntity.id}`}
                className="flex items-center justify-between rounded-2xl bg-[#3a86ff] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#5b9bff] transition"
              >
                <span>View Dataset Repository</span>
                <ExternalLink size={14} />
              </Link>
            )}

            {selectedEntity.type === 'publication' && (
              <Link
                to={`/publications/${selectedEntity.id}`}
                className="flex items-center justify-between rounded-2xl bg-[#9d4edd] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#b06cf0] transition"
              >
                <span>View Publication & Findings</span>
                <ExternalLink size={14} />
              </Link>
            )}

            <button
              onClick={() => focusOnCoordinates(selectedEntity.coordinates[0], selectedEntity.coordinates[1], 190)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-xs font-bold text-white/80 hover:bg-white/20 transition"
            >
              <Compass size={14} /> Focus Camera Here
            </button>
          </div>
        </div>
      )}

      {/* 8. BOTTOM COORDINATE HUD & CAMERA TELEMETRY */}
      <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#030812]/80 px-4 py-2 text-[11px] font-mono backdrop-blur-xl text-white/80">
          <div className="flex items-center gap-1.5 text-[#00e5ff]">
            <Compass size={14} />
            <span>
              LAT: {cameraCoordinates.lat >= 0 ? `${cameraCoordinates.lat.toFixed(1)}°N` : `${Math.abs(cameraCoordinates.lat).toFixed(1)}°S`}
            </span>
          </div>
          <div className="text-white/30">|</div>
          <div className="text-[#00e5ff]">
            LNG: {cameraCoordinates.lng >= 0 ? `${cameraCoordinates.lng.toFixed(1)}°E` : `${Math.abs(cameraCoordinates.lng).toFixed(1)}°W`}
          </div>
          <div className="text-white/30">|</div>
          <div className="text-white/60">ALT: {cameraCoordinates.dist} km</div>
        </div>
      </div>

      {/* 9. BOTTOM INTERACTIVE TIMELINE SCRUBBER (2020 ─── 2026) */}
      <div className="absolute bottom-6 inset-x-0 mx-auto max-w-xl px-4 z-20">
        <div className="flex items-center gap-3 rounded-3xl border border-white/15 bg-[#030812]/90 px-5 py-3 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)]">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsTimelinePlaying(!isTimelinePlaying)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-[#00e5ff] text-[#030812] font-bold hover:bg-[#74d4f5] transition shadow-[0_0_10px_rgba(0,229,255,0.4)]"
            title={isTimelinePlaying ? 'Pause Year Stepper' : 'Auto-Play Mission Timeline'}
          >
            {isTimelinePlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>

          {/* Year Display */}
          <div className="shrink-0 text-xs font-black text-[#00e5ff] w-12 text-center">
            {selectedYear}
          </div>

          {/* Year Slider */}
          <div className="relative flex-1 flex items-center">
            <input
              type="range"
              min="2020"
              max="2026"
              step="1"
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(parseInt(e.target.value));
                setIsTimelinePlaying(false);
              }}
              className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#00e5ff]"
            />
          </div>

          {/* Year Ticks */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-white/50">
            {[2020, 2022, 2024, 2026].map((yr) => (
              <button
                key={yr}
                onClick={() => setSelectedYear(yr)}
                className={`transition ${selectedYear === yr ? 'text-[#00e5ff] font-black' : 'hover:text-white'}`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
