export interface MapLocationPoint {
  id: string;
  name: string;
  type: 'station' | 'sampling_site' | 'vessel' | 'observation_point' | 'start_point' | 'end_point';
  category: string;
  coordinates: [number, number]; // [lat, lng]
  expeditionId: string;
  expeditionTitle: string;
  region: 'Antarctica' | 'Arctic' | 'Southern Ocean' | 'Himalayas';
  date?: string;
  activity: string;
  leaderOrScientist: string;
  samplesOrDataCollected?: string;
  description: string;
  instruments?: string[];
  related?: {
    datasets?: string[];
    publications?: string[];
    reports?: string[];
    media?: string[];
  };
}

export interface ExpeditionMapData {
  id: string;
  title: string;
  year: string;
  region: 'Antarctica' | 'Arctic' | 'Southern Ocean' | 'Himalayas';
  status: 'Ongoing' | 'Completed' | 'Planned';
  researchArea: string;
  leader: string;
  vesselOrBase: string;
  routePoints: [number, number][]; // [lat, lng]
  bounds: [[number, number], [number, number]]; // [[minLat, minLng], [maxLat, maxLng]]
  startPoint: { name: string; coordinates: [number, number]; date: string };
  endPoint: { name: string; coordinates: [number, number]; date: string };
  stations: MapLocationPoint[];
  samplingSites: MapLocationPoint[];
  observationPoints: MapLocationPoint[];
  summary: string;
  related: {
    datasets?: string[];
    publications?: string[];
    reports?: string[];
    media?: string[];
  };
}

export const REGIONAL_MAP_BOUNDS: Record<string, [[number, number], [number, number]]> = {
  All: [[-78, -30], [82, 100]],
  Antarctica: [[-78, 0], [-64, 90]],
  Arctic: [[74, 5], [83, 25]],
  'Southern Ocean': [[-68, 20], [-35, 100]],
  Himalayas: [[31, 75], [34, 80]],
};

export const expeditionMapData: ExpeditionMapData[] = [
  {
    id: 'iae46',
    title: '46th Indian Antarctic Expedition (IAE-46)',
    year: '2026',
    region: 'Antarctica',
    status: 'Ongoing',
    researchArea: 'Glaciology & Mass Balance',
    leader: 'Dr. Kavya Rao',
    vesselOrBase: 'Bharati & Maitri Stations',
    routePoints: [
      [-33.9, 18.4], // Cape Town Departure
      [-55.0, 30.0], // Southern Ocean Transect Waypoint
      [-65.0, 55.0], // Ice Edge Approach
      [-69.41, 76.19], // Bharati Station (Larsemann Hills)
      [-69.45, 76.35], // Prydz Bay Fast Ice Core Site
      [-70.77, 11.73], // Maitri Station (Schirmacher Oasis)
      [-72.5, 75.0], // Princess Elizabeth Land Deep Core Site
    ],
    bounds: [[-73.0, 10.0], [-65.0, 78.0]],
    startPoint: { name: 'Cape Town Port of Departure', coordinates: [-33.9, 18.4], date: '2025-11-20' },
    endPoint: { name: 'Princess Elizabeth Land Deep Core Site', coordinates: [-72.5, 75.0], date: '2026-04-02' },
    stations: [
      {
        id: 'st-bharati',
        name: 'Bharati Station',
        type: 'station',
        category: 'Permanent Antarctic Station',
        coordinates: [-69.41, 76.19],
        expeditionId: 'iae46',
        expeditionTitle: '46th Indian Antarctic Expedition (IAE-46)',
        region: 'Antarctica',
        date: 'Commissioned 2012',
        activity: 'Continuous Atmospheric, Glaciological & Cleanroom Mass Spectrometry Telemetry',
        leaderOrScientist: 'Dr. Kavya Rao',
        samplesOrDataCollected: 'Daily AWS Telemetry, Ice Cores, Cleanroom Gas Samples',
        description: 'India’s third permanent Antarctic station featuring 134 containerized units enclosed in an aerodynamic thermal skin.',
        instruments: ['Micro-Pulse Lidar', 'Spectrometer', 'AWS Telemetry', 'Sub-Ice Sonic Sounder'],
        related: { datasets: ['ds-temp-1'], publications: ['pub-ice-1'], reports: ['rep-1'] },
      },
      {
        id: 'st-maitri',
        name: 'Maitri Station',
        type: 'station',
        category: 'Permanent Antarctic Station',
        coordinates: [-70.77, 11.73],
        expeditionId: 'iae46',
        expeditionTitle: '46th Indian Antarctic Expedition (IAE-46)',
        region: 'Antarctica',
        date: 'Commissioned 1989',
        activity: 'Schirmacher Oasis Geomagnetic, Seismological & Permafrost Monitoring',
        leaderOrScientist: 'Dr. A. Menon',
        samplesOrDataCollected: 'Geomagnetic Variometer Logs, Lake Priyadarshini Sediment Cores',
        description: 'India’s second permanent Antarctic research base situated on the ice-free Schirmacher Oasis.',
        instruments: ['Fluxgate Magnetometer', 'Broadband Seismometer', 'Ozonesonde Balloon Array'],
        related: { datasets: ['ds-aerosol-6'], publications: ['pub-atmosphere-7'], reports: ['rep-5'] },
      },
    ],
    samplingSites: [
      {
        id: 'site-pel-1',
        name: 'Princess Elizabeth Land Deep Core Site #46',
        type: 'sampling_site',
        category: 'Ice Core Drilling Site',
        coordinates: [-72.5, 75.0],
        expeditionId: 'iae46',
        expeditionTitle: '46th Indian Antarctic Expedition (IAE-46)',
        region: 'Antarctica',
        date: '2026-01-15',
        activity: '120-Meter Electromechanical Ice Core Retrieval',
        leaderOrScientist: 'Dr. Kavya Rao',
        samplesOrDataCollected: '120m Solid Ice Barrels (2,220 Years Paleoclimate Record)',
        description: 'High-altitude plateau site where IAE-46 scientists extracted 120 meters of ancient ice core.',
        instruments: ['Electromechanical Ice Drill', 'Polarized Light Stratigraphy Bench'],
        related: { datasets: ['ds-temp-1', 'ds-radar-8'], publications: ['pub-ice-1'], reports: ['rep-1'] },
      },
      {
        id: 'site-prydz-fastice',
        name: 'Prydz Bay Fast Ice Core Site',
        type: 'sampling_site',
        category: 'Fast Ice & Marine Core Site',
        coordinates: [-69.45, 76.35],
        expeditionId: 'iae46',
        expeditionTitle: '46th Indian Antarctic Expedition (IAE-46)',
        region: 'Antarctica',
        date: '2025-12-10',
        activity: 'Fast-Ice Salinity Channels & Microbial Sampling',
        leaderOrScientist: 'Dr. N. Das',
        samplesOrDataCollected: '1.6m Sea Ice Cores & Under-Ice Plankton Casts',
        description: 'Coastal fast-ice sampling station capturing winter brine drainage and microbial diatoms.',
        instruments: ['Sea Ice Core Auger', 'CTD Profiler', 'Fluorescence Microscope'],
        related: { datasets: ['ds-microbe-7'], publications: ['pub-bio-6'], reports: ['rep-6'] },
      },
    ],
    observationPoints: [
      {
        id: 'obs-lidar-1',
        name: 'Larsemann Hills Aerosol Lidar Point',
        type: 'observation_point',
        category: 'Atmospheric Lidar Station',
        coordinates: [-69.42, 76.22],
        expeditionId: 'iae46',
        expeditionTitle: '46th Indian Antarctic Expedition (IAE-46)',
        region: 'Antarctica',
        date: 'Continuous 2026',
        activity: 'Green Laser Pulse Aerosol Backscatter Sounding',
        leaderOrScientist: 'Dr. A. Menon',
        samplesOrDataCollected: 'Aerosol Optical Depth (AOD) Profiles',
        description: 'Micro-pulse LIDAR array measuring long-range transport of black carbon aerosols.',
        instruments: ['532nm Micro-Pulse Lidar', 'Aethalometer'],
        related: { datasets: ['ds-aerosol-6'], publications: ['pub-atmosphere-7'], reports: ['rep-5'] },
      },
    ],
    summary: 'The 46th Indian Antarctic Expedition (IAE-46) focuses on deep plateau ice core drilling in Princess Elizabeth Land and aerosol micro-lidar sounding across Larsemann Hills.',
    related: { datasets: ['ds-temp-1', 'ds-radar-8', 'ds-aerosol-6'], publications: ['pub-ice-1', 'pub-atmosphere-7'], reports: ['rep-1', 'rep-5'] },
  },

  {
    id: 'arctic26',
    title: 'Indian Arctic Expedition 2026 (ARC-26)',
    year: '2026',
    region: 'Arctic',
    status: 'Ongoing',
    researchArea: 'Permafrost & Fjord Oceanography',
    leader: 'Dr. R. Banerjee',
    vesselOrBase: 'Himadri Station, Ny-Ålesund',
    routePoints: [
      [78.22, 15.63], // Longyearbyen Airport / Port
      [78.55, 13.80], // Isfjorden Transect
      [78.91, 11.93], // Himadri Station (Ny-Ålesund)
      [78.93, 11.90], // Kongsfjorden Inner Fjord Basin
      [78.88, 12.05], // Midtre Lovénbreen Glacier Margin
    ],
    bounds: [[78.8, 11.5], [79.0, 16.0]],
    startPoint: { name: 'Longyearbyen Logistics Hub', coordinates: [78.22, 15.63], date: '2026-06-01' },
    endPoint: { name: 'Midtre Lovénbreen Glacier Margin', coordinates: [78.88, 12.05], date: '2026-10-15' },
    stations: [
      {
        id: 'st-himadri',
        name: 'Himadri Station',
        type: 'station',
        category: 'Permanent Arctic Station',
        coordinates: [78.91, 11.93],
        expeditionId: 'arctic26',
        expeditionTitle: 'Indian Arctic Expedition 2026 (ARC-26)',
        region: 'Arctic',
        date: 'Commissioned 2008',
        activity: 'Ny-Ålesund Permafrost Thaw & Fjord Hydrology Monitoring',
        leaderOrScientist: 'Dr. R. Banerjee',
        samplesOrDataCollected: 'Active-Layer Thermal Borehole Logs, Kongsfjorden Salinity Profiles',
        description: 'India’s permanent Arctic research base located at 78°9′N in Ny-Ålesund, Svalbard.',
        instruments: ['Borehole Thermistor String', 'Seabird SBE-19 CTD', 'Aethalometer'],
        related: { datasets: ['ds-permafrost-3'], publications: ['pub-permafrost-3'], reports: ['rep-2'] },
      },
    ],
    samplingSites: [
      {
        id: 'site-kongsfjord',
        name: 'Kongsfjorden Fjord Hydrographic Station ARC-3',
        type: 'sampling_site',
        category: 'Fjord Water Column Site',
        coordinates: [78.93, 11.90],
        expeditionId: 'arctic26',
        expeditionTitle: 'Indian Arctic Expedition 2026 (ARC-26)',
        region: 'Arctic',
        date: '2026-07-14',
        activity: 'CTD Rosette Profiling & Meltwater Discharge Sampling',
        leaderOrScientist: 'Dr. R. Banerjee',
        samplesOrDataCollected: '45 Fjord Water Samples (Salinity, Density, Turbidity)',
        description: 'Deep fjord hydrographic transect measuring glacial meltwater plume influx into Kongsfjorden.',
        instruments: ['Seabird CTD Rosette', 'Turbidity Meter'],
        related: { datasets: ['ds-permafrost-3'], publications: ['pub-permafrost-3'], reports: ['rep-2'] },
      },
      {
        id: 'site-permafrost-borehole',
        name: 'Ny-Ålesund Active-Layer Borehole ARC-1',
        type: 'sampling_site',
        category: 'Permafrost Monitoring Site',
        coordinates: [78.88, 12.05],
        expeditionId: 'arctic26',
        expeditionTitle: 'Indian Arctic Expedition 2026 (ARC-26)',
        region: 'Arctic',
        date: '2026-08-02',
        activity: 'Active-Layer Thaw Depth & Sub-Surface Soil Moisture Logging',
        leaderOrScientist: 'Dr. Tanya Bose',
        samplesOrDataCollected: '84cm Thaw Depth Continuous Temperature Telemetry',
        description: 'Automated thermistor array recording sub-surface permafrost degradation.',
        instruments: ['Automated Permafrost Thermistor Array'],
        related: { datasets: ['ds-permafrost-3'], publications: ['pub-permafrost-3'], reports: ['rep-2'] },
      },
    ],
    observationPoints: [],
    summary: 'ARC-26 investigates Svalbard permafrost thaw dynamics, active-layer deepening, and glacial meltwater intrusion into Kongsfjorden.',
    related: { datasets: ['ds-permafrost-3'], publications: ['pub-permafrost-3'], reports: ['rep-2'] },
  },

  {
    id: 'so26',
    title: 'Southern Ocean Expedition 2026 (SOE-26)',
    year: '2026',
    region: 'Southern Ocean',
    status: 'Ongoing',
    researchArea: 'Physical Oceanography & Carbon Sink',
    leader: 'Dr. S. Malik',
    vesselOrBase: 'ORV Sagar Nidhi',
    routePoints: [
      [-20.16, 57.5], // Port Louis Departure
      [-35.0, 57.5], // 35°S Sub-Tropical Front
      [-45.0, 57.5], // 45°S Sub-Antarctic Front
      [-55.0, 57.5], // 55°S Polar Frontal Zone
      [-65.0, 57.5], // 65°S Deep Abyssal Station
    ],
    bounds: [[-66.0, 50.0], [-20.0, 60.0]],
    startPoint: { name: 'Port Louis Departure (Mauritius)', coordinates: [-20.16, 57.5], date: '2026-01-10' },
    endPoint: { name: '65°S Deep Hydrographic Station', coordinates: [-65.0, 57.5], date: '2026-04-30' },
    stations: [
      {
        id: 'vessel-sagar-nidhi',
        name: 'ORV Sagar Nidhi',
        type: 'vessel',
        category: 'Ocean Research Vessel',
        coordinates: [-55.0, 57.5],
        expeditionId: 'so26',
        expeditionTitle: 'Southern Ocean Expedition 2026 (SOE-26)',
        region: 'Southern Ocean',
        date: 'Deploying 2026',
        activity: 'Continuous Underway pCO2, Acoustic Doppler & Deep Argo Deployment',
        leaderOrScientist: 'Dr. S. Malik',
        samplesOrDataCollected: 'Deep Argo Telemetry, 4000m CTD Rosette Profiles',
        description: 'India’s ice-strengthened oceanographic research vessel conducting hydrographic transects across the Indian sector of the Southern Ocean.',
        instruments: ['Deep Argo Bio-Floats', 'Underway pCO2 Analyzer', 'ADCP Profiler'],
        related: { datasets: ['ds-ocean-4'], publications: ['pub-ocean-4'], reports: ['rep-3'] },
      },
    ],
    samplingSites: [
      {
        id: 'site-argo-deploy',
        name: 'Polar Front Deep Argo Float Deployment Site #441',
        type: 'sampling_site',
        category: 'Deep Ocean Float Site',
        coordinates: [-55.0, 57.5],
        expeditionId: 'so26',
        expeditionTitle: 'Southern Ocean Expedition 2026 (SOE-26)',
        region: 'Southern Ocean',
        date: '2026-02-18',
        activity: '6000m Deep Argo Bio-Float Deployment',
        leaderOrScientist: 'Dr. S. Malik',
        samplesOrDataCollected: 'Live Temperature, Salinity & Dissolved Oxygen Profiles',
        description: 'Deep-sea float deployment location along the 57°E oceanographic transect.',
        instruments: ['Deep Argo Bio-Float'],
        related: { datasets: ['ds-ocean-4'], publications: ['pub-ocean-4'], reports: ['rep-3'] },
      },
      {
        id: 'site-ctd-abyssal',
        name: 'Abyssal CTD Rosette Cast Site 18 (4,000m)',
        type: 'sampling_site',
        category: 'Deep Hydrographic Site',
        coordinates: [-65.0, 57.5],
        expeditionId: 'so26',
        expeditionTitle: 'Southern Ocean Expedition 2026 (SOE-26)',
        region: 'Southern Ocean',
        date: '2026-03-05',
        activity: 'Full-Depth CTD Rosette Cast (0 to 4000 meters)',
        leaderOrScientist: 'Dr. J. Thomas',
        samplesOrDataCollected: '24 Niskin Bottle Samples (AABW Warming Detection)',
        description: 'Full-depth ocean rosette cast capturing Antarctic Bottom Water warming trends.',
        instruments: ['Seabird 24-Bottle CTD Rosette'],
        related: { datasets: ['ds-ocean-4'], publications: ['pub-ocean-4'], reports: ['rep-3'] },
      },
    ],
    observationPoints: [],
    summary: 'SOE-26 conducts deep hydrographic profiling across 40°S–65°S to measure Antarctic Bottom Water warming and carbon dioxide sink variability.',
    related: { datasets: ['ds-ocean-4'], publications: ['pub-ocean-4'], reports: ['rep-3'] },
  },

  {
    id: 'himansh26',
    title: 'Himansh High-Altitude Himalayan Expedition 2026',
    year: '2026',
    region: 'Himalayas',
    status: 'Ongoing',
    researchArea: 'Glaciation & River Discharge',
    leader: 'Dr. A. Kumar',
    vesselOrBase: 'Himansh Base Observatory (Lahaul-Spiti)',
    routePoints: [
      [32.24, 77.18], // Manali
      [32.37, 77.24], // Rohtang Pass
      [32.35, 77.62], // Batal Base Camp
      [32.40, 77.65], // Himansh Station (4500m)
      [32.44, 77.68], // Siti Glacier Tongue
      [32.38, 77.60], // Chandra River Hydrometric Station
    ],
    bounds: [[32.2, 77.1], [32.5, 77.8]],
    startPoint: { name: 'Manali Staging Base', coordinates: [32.24, 77.18], date: '2026-05-10' },
    endPoint: { name: 'Chandra River Hydrometric Station', coordinates: [32.38, 77.60], date: '2026-10-30' },
    stations: [
      {
        id: 'st-himansh',
        name: 'Himansh Base Observatory',
        type: 'station',
        category: 'High-Altitude Himalayan Station',
        coordinates: [32.40, 77.65],
        expeditionId: 'himansh26',
        expeditionTitle: 'Himansh High-Altitude Himalayan Expedition 2026',
        region: 'Himalayas',
        date: 'Commissioned 2016',
        activity: '4,500m Glacier Mass Balance & Hydrometric Stream Gauging',
        leaderOrScientist: 'Dr. A. Kumar',
        samplesOrDataCollected: 'Ablation Stake Surveys, ADCP Stream Discharge Logs',
        description: 'India’s remote high-altitude research station at 4,500m altitude in Lahaul-Spiti, Himachal Pradesh.',
        instruments: ['RTK-GPS Ablation Stake Array', 'Acoustic Doppler Current Profiler (ADCP)', 'AWS Station'],
        related: { datasets: ['ds-temp-1'], publications: ['pub-geo-8'], reports: ['rep-4'] },
      },
    ],
    samplingSites: [
      {
        id: 'site-siti-glacier',
        name: 'Siti Glacier Ablation Stake Site #4',
        type: 'sampling_site',
        category: 'Glacier Mass Balance Site',
        coordinates: [32.44, 77.68],
        expeditionId: 'himansh26',
        expeditionTitle: 'Himansh High-Altitude Himalayan Expedition 2026',
        region: 'Himalayas',
        date: '2026-06-20',
        activity: 'Ice Surface Retreat & Melt Measurement',
        leaderOrScientist: 'Dr. A. Kumar',
        samplesOrDataCollected: '18 RTK-GPS Stake Measurements (-0.62m w.e. annual melt)',
        description: 'High-altitude glacier tongue survey measuring seasonal ice loss.',
        instruments: ['Leica RTK-GPS', 'Steam Ice Drill'],
        related: { datasets: ['ds-temp-1'], publications: ['pub-geo-8'], reports: ['rep-4'] },
      },
      {
        id: 'site-chandra-river',
        name: 'Chandra River Doppler ADCP Flow Station',
        type: 'sampling_site',
        category: 'Hydrometric Discharge Site',
        coordinates: [32.38, 77.60],
        expeditionId: 'himansh26',
        expeditionTitle: 'Himansh High-Altitude Himalayan Expedition 2026',
        region: 'Himalayas',
        date: '2026-07-05',
        activity: 'Glacial Meltwater Stream Flow & Sediment Load Profiling',
        leaderOrScientist: 'Dr. P. Verma',
        samplesOrDataCollected: 'Daily Meltwater Discharge (m3/sec) & Suspended Sediment Density',
        description: 'River gauging station measuring meltwater runoff feeding the Indus basin.',
        instruments: ['SonTek RiverSurveyor ADCP'],
        related: { datasets: ['ds-temp-1'], publications: ['pub-geo-8'], reports: ['rep-4'] },
      },
    ],
    observationPoints: [],
    summary: 'Himansh 2026 monitors glacier mass balance, meltwater runoff dynamics, and monsoon impacts across the Third Pole in Lahaul-Spiti.',
    related: { datasets: ['ds-temp-1'], publications: ['pub-geo-8'], reports: ['rep-4'] },
  },
];
