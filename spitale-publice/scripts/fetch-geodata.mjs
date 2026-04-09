/**
 * Downloads Romania-only NUTS boundaries from Eurostat GISCO and saves them
 * to public/geodata/ so the map loads them as local static assets.
 *
 * Run once (or on demand):   node scripts/fetch-geodata.mjs
 */

import { mkdirSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_DIR = join(__dirname, '..', 'public', 'geodata')

const NUTS0_URL =
  'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_10M_2021_4326_LEVL_0.geojson'
const NUTS3_URL =
  'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_10M_2021_4326_LEVL_3.geojson'

async function fetchAndFilter(url, filterFn, label) {
  console.log(`Fetching ${label}…`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  const geojson = await res.json()
  const filtered = { ...geojson, features: geojson.features.filter(filterFn) }
  console.log(`  → kept ${filtered.features.length} feature(s) from ${geojson.features.length}`)
  return filtered
}

mkdirSync(OUT_DIR, { recursive: true })

const [country, counties] = await Promise.all([
  fetchAndFilter(NUTS0_URL, (f) => f.properties?.NUTS_ID === 'RO', 'NUTS0 (country)'),
  fetchAndFilter(NUTS3_URL, (f) => f.properties?.NUTS_ID?.startsWith('RO'), 'NUTS3 (counties)'),
])

writeFileSync(join(OUT_DIR, 'romania-country.geojson'), JSON.stringify(country))
writeFileSync(join(OUT_DIR, 'romania-counties.geojson'), JSON.stringify(counties))

console.log(`\nSaved to ${OUT_DIR}`)
