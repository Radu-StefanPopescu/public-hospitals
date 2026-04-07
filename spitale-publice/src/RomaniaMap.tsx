import { useEffect, useRef } from 'react'
import { MapContainer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-boundary-canvas'

// ---------- type shim for leaflet-boundary-canvas ----------
declare module 'leaflet' {
  namespace TileLayer {
    function boundaryCanvas(
      urlTemplate: string,
      options?: L.TileLayerOptions & { boundary?: object }
    ): L.TileLayer
  }
}

// ---------- types ----------
export type Pin = {
  id: string
  name: string
  lat: number
  lng: number
}

// ---------- constants ----------
const CARTO_URL =
  'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'

// Eurostat GISCO – official EU NUTS boundaries, always available, CORS-open
const NUTS0_URL =
  'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_10M_2021_4326_LEVL_0.geojson'
const NUTS3_URL =
  'https://gisco-services.ec.europa.eu/distribution/v2/nuts/geojson/NUTS_RG_10M_2021_4326_LEVL_3.geojson'

const ROMANIA_CENTER: [number, number] = [45.9432, 24.9668]
// Loose bounds – prevents panning too far outside Romania
const ROMANIA_BOUNDS: L.LatLngBoundsExpression = [
  [43.2, 19.5],
  [48.8, 30.2],
]

// World polygon ring (outer) used to build the mask
const WORLD_RING: [number, number][] = [
  [-180, -90],
  [180, -90],
  [180, 90],
  [-180, 90],
  [-180, -90],
]

const hospitalIcon = new L.DivIcon({
  html: `<div style="
    background:#3b82f6;
    border:1.5px solid #bfdbfe;
    border-radius:50%;
    width:8px;height:8px;
    box-shadow:0 1px 3px rgba(0,0,0,.25);
    margin:-4px 0 0 -4px;
  "></div>`,
  className: '',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
  popupAnchor: [0, -5],
})

// ---------- helper: extract outer rings from a GeoJSON geometry ----------
function outerRings(geometry: GeoJSON.Geometry): number[][][] {
  if (geometry.type === 'Polygon') return [geometry.coordinates[0] as number[][]]
  if (geometry.type === 'MultiPolygon')
    return geometry.coordinates.map((poly) => poly[0] as number[][])
  return []
}

// ---------- inner component that has access to the map instance ----------
function MapLayers({ pins }: { pins: Pin[] }) {
  const map = useMap()
  const cleanupRef = useRef<(() => void) | null>(null)

  // --- geographic layers (tiles + boundaries + mask) ---
  useEffect(() => {
    let cancelled = false
    const added: L.Layer[] = []

    ;(async () => {
      try {
        const [r0, r3] = await Promise.all([fetch(NUTS0_URL), fetch(NUTS3_URL)])
        const [nuts0, nuts3]: [GeoJSON.FeatureCollection, GeoJSON.FeatureCollection] =
          await Promise.all([r0.json(), r3.json()])

        if (cancelled) return

        // Filter to Romania only
        const roCountry: GeoJSON.FeatureCollection = {
          ...nuts0,
          features: nuts0.features.filter((f) => f.properties?.NUTS_ID === 'RO'),
        }
        const roCounties: GeoJSON.FeatureCollection = {
          ...nuts3,
          features: nuts3.features.filter((f) =>
            (f.properties?.NUTS_ID as string)?.startsWith('RO')
          ),
        }

        // 1. Boundary-clipped tile layer – tiles only render inside Romania
        const tiles = L.TileLayer.boundaryCanvas(CARTO_URL, {
          boundary: roCountry,
          attribution:
            '&copy; <a href="https://carto.com">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>',
          subdomains: 'abcd',
          maxZoom: 18,
        })
        map.addLayer(tiles)
        added.push(tiles)

        // 2. White mask – covers everything outside Romania's border
        //    Built as a "donut" polygon: world bbox with Romania as a hole
        if (roCountry.features.length > 0) {
          const geom = roCountry.features[0].geometry
          const rings = outerRings(geom)
          const maskCoords: number[][][] = [WORLD_RING as unknown as number[][], ...rings]
          const maskGeoJSON: GeoJSON.Feature = {
            type: 'Feature',
            properties: {},
            geometry: { type: 'Polygon', coordinates: maskCoords },
          }
          const mask = L.geoJSON(maskGeoJSON, {
            style: {
              color: 'white',
              fillColor: 'white',
              fillOpacity: 1,
              weight: 0,
              interactive: false,
            } as L.PathOptions,
          }).addTo(map)
          added.push(mask)
        }

        // 3. County boundaries (thin grey lines)
        const counties = L.geoJSON(roCounties, {
          style: {
            color: '#9ca3af',
            weight: 0.8,
            fillOpacity: 0,
            interactive: false,
          },
        }).addTo(map)
        added.push(counties)

        // 4. Country border (thicker, darker)
        const countryBorder = L.geoJSON(roCountry, {
          style: {
            color: '#374151',
            weight: 2,
            fillOpacity: 0,
            interactive: false,
          },
        }).addTo(map)
        added.push(countryBorder)
      } catch (err) {
        console.error('Failed to load Romania boundaries:', err)
      }
    })()

    cleanupRef.current = () => {
      cancelled = true
      added.forEach((l) => {
        try { map.removeLayer(l) } catch (_) { /* map already gone */ }
      })
    }

    return () => cleanupRef.current?.()
  }, [map])

  // --- hospital markers ---
  useEffect(() => {
    if (pins.length === 0) return

    const markers: L.Marker[] = pins.map((pin) =>
      L.marker([pin.lat, pin.lng], { icon: hospitalIcon })
        .bindPopup(`<strong>${pin.name}</strong>`)
        .addTo(map)
    )

    return () => {
      markers.forEach((m) => {
        try { map.removeLayer(m) } catch (_) { /* map already gone */ }
      })
    }
  }, [map, pins])

  return null
}

// ---------- public component ----------
export function RomaniaMap({ pins }: { pins: Pin[] }) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={ROMANIA_CENTER}
        zoom={7}
        minZoom={6}
        maxZoom={14}
        maxBounds={ROMANIA_BOUNDS}
        maxBoundsViscosity={0.8}
        zoomControl
        style={{ width: '100%', height: '100%', background: 'white' }}
      >
        <MapLayers pins={pins} />
      </MapContainer>
    </div>
  )
}

export default RomaniaMap
