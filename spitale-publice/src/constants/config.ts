import L from 'leaflet'

export const APP_VERSION = import.meta.env.VITE_APP_VERSION ?? 'dev'
export const GIT_COMMIT = import.meta.env.VITE_GIT_COMMIT ?? 'local'

export const FORMSPREE_URL = 'https://formspree.io/f/xykbover'

export const GITHUB_URL = 'https://github.com/Radu-StefanPopescu/public-hospitals'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/rspopescu/'
export const DATASET_URL = 'https://data.gov.ro/dataset'

export const CARTO_BASE_URL =
  'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'

export const CARTO_LABELS_URL =
  'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png'

export const NUTS0_URL =
  'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_10M_2021_4326_LEVL_0.geojson'

export const NUTS3_URL =
  'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_10M_2021_4326_LEVL_3.geojson'

export const ROMANIA_CENTER: [number, number] = [45.9432, 24.9668]

export const ROMANIA_BOUNDS: L.LatLngBoundsExpression = [
  [43.2, 19.5],
  [48.8, 30.2],
]

export const WORLD_RING: [number, number][] = [
  [-180, -90],
  [180, -90],
  [180, 90],
  [-180, 90],
  [-180, -90],
]
