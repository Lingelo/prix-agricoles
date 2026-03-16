import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'public', 'data');

const SERIES = {
  general:       { id: '010776593', label: 'Indice general',               color: '#1e40af' },
  cereales:      { id: '010776596', label: 'Cereales',                     color: '#ca8a04' },
  oleagineux:    { id: '010776606', label: 'Oleagineux',                   color: '#65a30d' },
  animaux:       { id: '010776665', label: 'Animaux & produits animaux',   color: '#dc2626' },
  bovins:        { id: '010776667', label: 'Gros bovins',                  color: '#b91c1c' },
  porcins:       { id: '010776678', label: 'Porcins',                     color: '#f472b6' },
  volailles:     { id: '010776681', label: 'Volailles',                   color: '#f97316' },
  lait:          { id: '010776692', label: 'Lait',                         color: '#0ea5e9' },
  oeufs:         { id: '010776696', label: 'Oeufs',                       color: '#eab308' },
  fruitsLegumes: { id: '010776697', label: 'Fruits & legumes',            color: '#22c55e' },
  vin:           { id: '010776638', label: 'Vin',                          color: '#7c3aed' },
  pommesTerre:   { id: '010776610', label: 'Pommes de terre',             color: '#a16207' },
};

async function fetchData() {
  const ids = Object.values(SERIES).map(s => s.id).join('+');
  const url = `https://bdm.insee.fr/series/sdmx/data/SERIES_BDM/${ids}?startPeriod=2020-01&detail=full`;

  console.log('Fetching from INSEE BDM...');
  const res = await fetch(url, {
    headers: { 'Accept': 'application/vnd.sdmx.genericdata+xml;version=2.1' },
  });

  if (!res.ok) {
    throw new Error(`INSEE API returned ${res.status}: ${res.statusText}`);
  }

  const xml = await res.text();
  console.log(`Received ${(xml.length / 1024).toFixed(0)} KB of XML`);

  // Build a map from IDBANK -> series key
  const idToKey = new Map();
  for (const [key, s] of Object.entries(SERIES)) {
    idToKey.set(s.id, key);
  }

  // Parse SDMX XML — extract Series blocks
  const result = {};
  // Match each Series block
  const seriesRegex = /<generic:Series>([\s\S]*?)<\/generic:Series>/g;
  let seriesMatch;

  while ((seriesMatch = seriesRegex.exec(xml)) !== null) {
    const block = seriesMatch[1];

    // Extract IDBANK from SeriesKey
    const idbankMatch = block.match(/<generic:Value\s+id="IDBANK"\s+value="(\d+)"/);
    if (!idbankMatch) continue;
    const idbank = idbankMatch[1];
    const key = idToKey.get(idbank);
    if (!key) continue;

    // Extract observations
    const data = [];
    const obsRegex = /<generic:ObsDimension\s+value="([^"]+)"[\s\S]*?<generic:ObsValue\s+value="([^"]+)"/g;
    let obsMatch;
    while ((obsMatch = obsRegex.exec(block)) !== null) {
      data.push({
        date: obsMatch[1],
        value: parseFloat(obsMatch[2]),
      });
    }

    data.sort((a, b) => a.date.localeCompare(b.date));

    result[key] = {
      label: SERIES[key].label,
      color: SERIES[key].color,
      data,
    };
  }

  const foundKeys = Object.keys(result);
  console.log(`Parsed ${foundKeys.length} series: ${foundKeys.join(', ')}`);

  if (foundKeys.length === 0) {
    throw new Error('No series parsed from XML. Check API response format.');
  }

  const output = {
    meta: {
      generatedAt: new Date().toISOString(),
      base: '2020=100',
    },
    series: result,
  };

  mkdirSync(OUT_DIR, { recursive: true });
  const outPath = join(OUT_DIR, 'prix.json');
  writeFileSync(outPath, JSON.stringify(output));
  console.log(`Written to ${outPath}`);
}

fetchData().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
