import { ExpeditionMapData, MapLocationPoint } from '../data/polarMapData';

export interface DigitalTwinTelemetry {
  currentPosition: [number, number]; // [lat, lng]
  traveledRoute: [number, number][];
  remainingRoute: [number, number][];
  currentDate: string;
  dayNumber: number;
  totalDays: number;
  currentWaypointIndex: number;
  currentLegTitle: string;
  activeActivity: string;
  speedKnots: number;
  headingDeg: number;
  nearestStationOrSite: MapLocationPoint | null;
  progressPercent: number;
}

// Great circle distance in km
function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Bearing calculation in degrees
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const y = Math.sin(((lon2 - lon1) * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.cos(((lon2 - lon1) * Math.PI) / 180);
  const brng = (Math.atan2(y, x) * 180) / Math.PI;
  return (brng + 360) % 360;
}

export function computeDigitalTwinTelemetry(
  expedition: ExpeditionMapData,
  progressPercent: number // 0 to 100
): DigitalTwinTelemetry {
  const clampedProgress = Math.max(0, Math.min(100, progressPercent));
  const t = clampedProgress / 100;
  const points = expedition.routePoints;

  if (!points || points.length === 0) {
    const fallbackCoord: [number, number] = [-69.41, 76.19];
    return {
      currentPosition: fallbackCoord,
      traveledRoute: [fallbackCoord],
      remainingRoute: [fallbackCoord],
      currentDate: expedition.startPoint?.date || '2026-01-01',
      dayNumber: 1,
      totalDays: 120,
      currentWaypointIndex: 0,
      currentLegTitle: expedition.title,
      activeActivity: 'Station operations telemetry active',
      speedKnots: 12.4,
      headingDeg: 145,
      nearestStationOrSite: expedition.stations[0] || null,
      progressPercent: clampedProgress,
    };
  }

  if (points.length === 1) {
    return {
      currentPosition: points[0],
      traveledRoute: points,
      remainingRoute: points,
      currentDate: expedition.startPoint?.date || '2026-01-01',
      dayNumber: 1,
      totalDays: 100,
      currentWaypointIndex: 0,
      currentLegTitle: expedition.startPoint?.name || 'Origin Base',
      activeActivity: expedition.summary,
      speedKnots: 0,
      headingDeg: 0,
      nearestStationOrSite: expedition.stations[0] || null,
      progressPercent: clampedProgress,
    };
  }

  // Compute segment lengths
  const segmentLengths: number[] = [];
  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const d = haversineDistance(points[i][0], points[i][1], points[i + 1][0], points[i + 1][1]);
    segmentLengths.push(d);
    totalDistance += d;
  }

  const targetDist = t * totalDistance;
  let accumulatedDist = 0;
  let segIndex = 0;
  let segT = 0;

  for (let i = 0; i < segmentLengths.length; i++) {
    if (accumulatedDist + segmentLengths[i] >= targetDist || i === segmentLengths.length - 1) {
      segIndex = i;
      const segLength = segmentLengths[i] || 1;
      segT = Math.max(0, Math.min(1, (targetDist - accumulatedDist) / segLength));
      break;
    }
    accumulatedDist += segmentLengths[i];
  }

  const p1 = points[segIndex];
  const p2 = points[segIndex + 1] || p1;

  // Linear interpolation between p1 and p2
  const currentLat = p1[0] + (p2[0] - p1[0]) * segT;
  const currentLng = p1[1] + (p2[1] - p1[1]) * segT;
  const currentPosition: [number, number] = [currentLat, currentLng];

  // Traveled vs remaining polylines
  const traveledRoute = [...points.slice(0, segIndex + 1), currentPosition];
  const remainingRoute = [currentPosition, ...points.slice(segIndex + 1)];

  // Heading & Speed
  const headingDeg = Math.round(calculateBearing(p1[0], p1[1], p2[0], p2[1]));
  const speedKnots = t >= 0.99 ? 0 : 11.8 + Math.sin(t * 12) * 2.2;

  // Date & Day calculation
  const startDate = new Date(expedition.startPoint?.date || '2025-11-20');
  const endDate = new Date(expedition.endPoint?.date || '2026-04-15');
  const diffTime = Math.max(1, endDate.getTime() - startDate.getTime());
  const totalDays = Math.max(1, Math.round(diffTime / (1000 * 60 * 60 * 24)));
  const currentTimestamp = startDate.getTime() + t * diffTime;
  const currentDateObj = new Date(currentTimestamp);
  const currentDate = currentDateObj.toISOString().split('T')[0];
  const dayNumber = Math.min(totalDays, Math.max(1, Math.round(t * totalDays)));

  // Current Leg Title & Activity
  const legNames = [
    'Port Departure & Coastal Transit',
    'Open Ocean Frontal Crossing & Lidar Telemetry',
    'Polar Front Hydrographic Profiling',
    'Ice Shelf Approach & Acoustic Sounding',
    'Fast-Ice Core Extraction & Station Docking',
    'Deep Plateau Ice Drilling Operations',
  ];
  const currentLegTitle =
    legNames[Math.min(legNames.length - 1, segIndex)] || `Expedition Leg ${segIndex + 1}`;

  // Find nearest station or sampling site within 350km
  const allLocations: MapLocationPoint[] = [
    ...(expedition.stations || []),
    ...(expedition.samplingSites || []),
    ...(expedition.observationPoints || []),
  ];
  let nearestStationOrSite: MapLocationPoint | null = null;
  let minDistance = Infinity;

  for (const loc of allLocations) {
    const d = haversineDistance(currentLat, currentLng, loc.coordinates[0], loc.coordinates[1]);
    if (d < minDistance) {
      minDistance = d;
      if (d <= 350) {
        nearestStationOrSite = loc;
      }
    }
  }

  const activeActivity = nearestStationOrSite
    ? `Operating near ${nearestStationOrSite.name}: ${nearestStationOrSite.activity}`
    : `En route across ${expedition.region} (${currentLegTitle}) · Underway Sensor Logging`;

  return {
    currentPosition,
    traveledRoute,
    remainingRoute,
    currentDate,
    dayNumber,
    totalDays,
    currentWaypointIndex: segIndex,
    currentLegTitle,
    activeActivity,
    speedKnots: Number(speedKnots.toFixed(1)),
    headingDeg,
    nearestStationOrSite,
    progressPercent: clampedProgress,
  };
}
