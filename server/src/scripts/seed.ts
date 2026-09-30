import dotenv from 'dotenv';
dotenv.config();

import { getDb } from '../services/firebase.js';

const expeditions = [
  {
    id: 'iae46',
    title: '46th Indian Antarctic Expedition',
    number: 46,
    year: '2026–27',
    region: 'Antarctica',
    status: 'Planning',
    objective: 'Long-term cryosphere, atmosphere, geology and Southern Ocean observations with integrated digital field logging.',
    leader: 'Dr. A. Menon',
    scientists: ['Dr. A. Menon', 'Dr. Kavya Rao', 'Dr. R. Singh', 'Dr. Meera Nair'],
    stations: ['Maitri', 'Bharati'],
    route: [
      [15.0, -35.0],
      [20, -45],
      [35, -55],
      [55, -66],
      [76.2, -69.4],
    ],
    categories: ['Glaciology', 'Atmosphere', 'Oceanography'],
    datasets: ['ds-temp', 'ds-ice'],
    publications: ['pub-ice'],
    media: ['media-1'],
    progress: 28,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'iae45',
    title: '45th Indian Antarctic Expedition',
    number: 45,
    year: '2025–26',
    region: 'Antarctica',
    status: 'Completed',
    objective: 'Integrated studies of sea-ice variability, atmospheric aerosols and coastal ecosystem processes.',
    leader: 'Dr. S. Iyer',
    scientists: ['Dr. S. Iyer', 'Dr. N. Das', 'Dr. P. Shah'],
    stations: ['Bharati'],
    route: [
      [18, -34],
      [28, -49],
      [48, -60],
      [69, -69],
    ],
    categories: ['Sea Ice', 'Atmosphere', 'Biology'],
    datasets: ['ds-ice'],
    publications: ['pub-eco'],
    media: ['media-2'],
    progress: 100,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'arctic24',
    title: 'Arctic Research Campaign 2024',
    number: 24,
    year: '2024',
    region: 'Arctic',
    status: 'Completed',
    objective: 'Permafrost, fjord oceanography and aerosol-cloud interaction observations around Svalbard.',
    leader: 'Dr. R. Banerjee',
    scientists: ['Dr. R. Banerjee', 'Dr. Tanya Bose'],
    stations: ['Himadri'],
    route: [
      [15.6, 78.2],
      [14.9, 78.9],
      [18.9, 79.0],
    ],
    categories: ['Permafrost', 'Oceanography', 'Atmosphere'],
    datasets: ['ds-permafrost'],
    publications: ['pub-arctic'],
    media: ['media-3'],
    progress: 100,
    updatedAt: new Date().toISOString(),
  },
];

const datasets = [
  {
    id: 'ds-temp',
    title: 'East Antarctic Surface Temperature Series',
    category: 'Climate',
    region: 'East Antarctica',
    period: '1990–2026',
    format: 'CSV',
    size: '42 MB',
    description: 'Monthly surface temperature observations and derived annual anomaly series measured at Maitri and Bharati stations.',
    variables: ['temperature_anomaly', 'surface_temperature'],
    unit: '°C anomaly',
    status: 'VERIFIED',
    downloads: 1842,
    source: 'National Centre for Polar and Ocean Research (NCPOR)',
    values: [
      { year: 1990, value: -0.42 },
      { year: 1995, value: -0.28 },
      { year: 2000, value: -0.15 },
      { year: 2005, value: 0.02 },
      { year: 2010, value: 0.09 },
      { year: 2015, value: 0.17 },
      { year: 2020, value: 0.31 },
      { year: 2025, value: 0.37 },
    ],
    version: '2.1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ds-ice',
    title: 'Antarctic Sea-Ice Seasonal Index',
    category: 'Sea Ice',
    region: 'Southern Ocean',
    period: '2000–2026',
    format: 'GeoJSON',
    size: '86 MB',
    description: 'High-resolution sea-ice concentration and extent seasonal index derived from microwave radiometry and shipboard observations.',
    variables: ['sea_ice_index', 'extent'],
    unit: 'index value',
    status: 'VERIFIED',
    downloads: 2790,
    source: 'Indian Antarctic Data Center',
    values: [
      { year: 2000, value: 100 },
      { year: 2004, value: 102 },
      { year: 2008, value: 98 },
      { year: 2012, value: 105 },
      { year: 2016, value: 101 },
      { year: 2020, value: 94 },
      { year: 2024, value: 89 },
      { year: 2026, value: 91 },
    ],
    version: '1.4',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const publications = [
  {
    id: 'pub-ice',
    title: 'Integrated Observations of Antarctic Ice and Atmosphere',
    authors: ['Dr. Kavya Rao', 'Dr. R. Singh'],
    year: 2025,
    category: 'Glaciology',
    journal: 'Journal of Polar Cryosphere Research',
    doi: '10.0000/demo.ice.2025',
    abstract: 'Multidisciplinary research linking cryosphere mass balance, surface heat budgets, and atmospheric boundary layer profiles across East Antarctica.',
    citations: 24,
    expeditionId: 'iae45',
    reviewStatus: 'PUBLISHED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'pub-eco',
    title: 'Coastal Ecosystem Signals from East Antarctica',
    authors: ['Dr. N. Das', 'Dr. P. Shah'],
    year: 2026,
    category: 'Biology',
    journal: 'Polar Ecological Letters',
    doi: '10.0000/demo.eco.2026',
    abstract: 'Field investigation into biological oceanography, phytoplankton spring bloom timing, and micro-faunal adaptations in Prydz Bay.',
    citations: 8,
    expeditionId: 'iae45',
    reviewStatus: 'PUBLISHED',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const stations = [
  {
    id: 'maitri',
    name: 'Maitri Station',
    region: 'Antarctica',
    coordinates: [11.73, -70.77],
    establishedYear: 1989,
    status: 'Active',
    description: 'Second permanent Antarctic research station of India, situated in the Schirmacher Oasis.',
  },
  {
    id: 'bharati',
    name: 'Bharati Station',
    region: 'Antarctica',
    coordinates: [76.19, -69.41],
    establishedYear: 2012,
    status: 'Active',
    description: 'State-of-the-art third Antarctic research facility located in Larsemann Hills.',
  },
  {
    id: 'himadri',
    name: 'Himadri Station',
    region: 'Arctic',
    coordinates: [11.93, 78.91],
    establishedYear: 2008,
    status: 'Seasonal',
    description: 'First Indian Arctic research station, located at Ny-Ålesund, Svalbard, Norway.',
  },
];

const graphNodes = [
  { id: 'iae45', name: '45th IAE', group: 'Expedition' },
  { id: 'bharati', name: 'Bharati Station', group: 'Station' },
  { id: 'rao', name: 'Dr. Kavya Rao', group: 'Scientist' },
  { id: 'ice', name: 'Sea-Ice Index', group: 'Dataset' },
  { id: 'pub-ice', name: 'Integrated Observations of Antarctic Ice', group: 'Publication' },
  { id: 'ocean', name: 'Southern Ocean', group: 'Location' },
];

const graphEdges = [
  { source: 'rao', target: 'iae45', label: 'PARTICIPATED_IN' },
  { source: 'iae45', target: 'bharati', label: 'BASED_AT' },
  { source: 'iae45', target: 'ice', label: 'COLLECTED' },
  { source: 'ice', target: 'pub-ice', label: 'UTILIZED_IN' },
  { source: 'iae45', target: 'ocean', label: 'OPERATED_IN' },
];

async function seed() {
  console.log('[POLARIS Seed] Seeding database records...');
  const db = getDb();
  if (!db) {
    console.log('[POLARIS Seed] Firestore not configured. Seed completed for in-memory fallback.');
    return;
  }

  try {
    for (const item of expeditions) await db.collection('expeditions').doc(item.id).set(item);
    for (const item of datasets) await db.collection('datasets').doc(item.id).set(item);
    for (const item of publications) await db.collection('publications').doc(item.id).set(item);
    for (const item of stations) await db.collection('stations').doc(item.id).set(item);
    for (const item of graphNodes) await db.collection('knowledgeGraphNodes').doc(item.id).set(item);
    for (const item of graphEdges) await db.collection('knowledgeGraphEdges').doc(`${item.source}-${item.target}`).set(item);

    console.log('[POLARIS Seed] Successfully seeded Firestore collections!');
  } catch (err) {
    console.error('[POLARIS Seed] Error seeding Firestore:', err);
  }
}

seed();
