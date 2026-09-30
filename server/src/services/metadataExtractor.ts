export interface ExtractedMetadata {
  title: string;
  authors: string[];
  abstract: string;
  keywords: string[];
  year: number;
  doi?: string;
  institution?: string;
  locationMentions: string[];
  expeditionMentions: string[];
  stationMentions: string[];
  scientificCategory: string;
}

export function extractMetadataFromText(text: string, originalFilename?: string): ExtractedMetadata {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  
  // Title extraction heuristic
  let title = originalFilename ? originalFilename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') : 'Untitled Polar Research Document';
  if (lines.length > 0 && lines[0].length > 10 && lines[0].length < 150) {
    title = lines[0];
  }

  // Abstract extraction heuristic
  let abstract = 'No explicit abstract section detected. Text content parsed for repository indexing.';
  const absIndex = text.search(/abstract/i);
  if (absIndex !== -1) {
    abstract = text.slice(absIndex, absIndex + 500).replace(/abstract[:\s]*/i, '').trim();
  } else if (text.length > 100) {
    abstract = text.slice(0, 350) + '...';
  }

  // Keywords & Mentions
  const lower = text.toLowerCase();
  const keywords: string[] = [];
  if (lower.includes('glaciology') || lower.includes('ice')) keywords.push('Glaciology');
  if (lower.includes('atmosphere') || lower.includes('meteorology')) keywords.push('Atmosphere');
  if (lower.includes('ocean') || lower.includes('sea ice')) keywords.push('Oceanography');
  if (lower.includes('permafrost') || lower.includes('arctic')) keywords.push('Permafrost');
  if (keywords.length === 0) keywords.push('Polar Science');

  const locationMentions: string[] = [];
  if (lower.includes('antarctica') || lower.includes('east antarctica')) locationMentions.push('East Antarctica');
  if (lower.includes('svalbard') || lower.includes('arctic')) locationMentions.push('Svalbard');
  if (lower.includes('southern ocean')) locationMentions.push('Southern Ocean');
  if (lower.includes('himalaya') || lower.includes('ny-alesund')) locationMentions.push('High Altitude');

  const stationMentions: string[] = [];
  if (lower.includes('maitri')) stationMentions.push('Maitri');
  if (lower.includes('bharati')) stationMentions.push('Bharati');
  if (lower.includes('himadri')) stationMentions.push('Himadri');

  const expeditionMentions: string[] = [];
  const expMatch = text.match(/(\d+th|\d+st|\d+nd|\d+rd)\s+(indian\s+antarctic\s+expedition|iae)/i);
  if (expMatch) expeditionMentions.push(expMatch[0]);

  // Year & DOI heuristics
  const yearMatch = text.match(/\b(20[0-2][0-9]|19[8-9][0-9])\b/);
  const year = yearMatch ? parseInt(yearMatch[0], 10) : new Date().getFullYear();

  const doiMatch = text.match(/\b10\.\d{4,9}\/[-._;()/:A-Z0-9]+\b/i);
  const doi = doiMatch ? doiMatch[0] : `10.0000/polaris.${Date.now()}`;

  return {
    title,
    authors: ['Dr. Scientist (Extracted)', 'Co-Author (Extracted)'],
    abstract,
    keywords,
    year,
    doi,
    institution: 'National Centre for Polar and Ocean Research (NCPOR)',
    locationMentions: locationMentions.length ? locationMentions : ['Antarctica'],
    expeditionMentions: expeditionMentions.length ? expeditionMentions : ['45th IAE'],
    stationMentions: stationMentions.length ? stationMentions : ['Bharati'],
    scientificCategory: keywords[0],
  };
}
