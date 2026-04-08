import { useEffect, useRef } from 'react'
import { MapContainer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-boundary-canvas'
import type { Pin } from '../../../types/hospital'
import {
  CARTO_BASE_URL,
  NUTS0_URL,
  NUTS3_URL,
  ROMANIA_CENTER,
  ROMANIA_BOUNDS,
} from '../../../constants/config'

declare module 'leaflet' {
  namespace TileLayer {
    function boundaryCanvas(
      urlTemplate: string,
      options?: L.TileLayerOptions & { boundary?: object }
    ): L.TileLayer
  }
}

const hospitalIcon = new L.DivIcon({
  html: '<div class="hospital-marker"></div>',
  className: '',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
  popupAnchor: [0, -5],
})


interface MapLayersProps {
  pins: Pin[]
}

const MapLayers = ({ pins }: MapLayersProps) => {
  const map = useMap()
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    let cancelled = false
    const added: L.Layer[] = []

    ;(async () => {
      try {
        const [r0, r3] = await Promise.all([fetch(NUTS0_URL), fetch(NUTS3_URL)])
        const [nuts0, nuts3]: [GeoJSON.FeatureCollection, GeoJSON.FeatureCollection] =
          await Promise.all([r0.json(), r3.json()])

        if (cancelled) return

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

        const tileOptions = {
          boundary: roCountry,
          attribution:
            '&copy; <a href="https://carto.com">CARTO</a> &copy; <a href="https://openstreetmap.org">OSM</a>',
          subdomains: 'abcd',
          maxZoom: 18,
        }

        const baseTiles = L.TileLayer.boundaryCanvas(CARTO_BASE_URL, tileOptions)
        map.addLayer(baseTiles)
        added.push(baseTiles)

        const counties = L.geoJSON(roCounties, {
          style: { color: '#9ca3af', weight: 0.8, fillOpacity: 0, interactive: false },
        }).addTo(map)
        added.push(counties)

        const countryBorder = L.geoJSON(roCountry, {
          style: { color: '#374151', weight: 2, fillOpacity: 0, interactive: false },
        }).addTo(map)
        added.push(countryBorder)

      } catch (err) {
        console.error('Failed to load Romania boundaries:', err)
      }
    })()

    cleanupRef.current = () => {
      cancelled = true
      added.forEach((l) => { try { map.removeLayer(l) } catch (_) { /* map gone */ } })
    }

    return () => cleanupRef.current?.()
  }, [map])

  useEffect(() => {
    if (pins.length === 0) return

    const markers: L.Marker[] = pins.map((pin) =>
      L.marker([pin.lat, pin.lng], { icon: hospitalIcon })
        .bindPopup(`<strong>${pin.name}</strong>`)
        .addTo(map)
    )

    return () => {
      markers.forEach((m) => { try { map.removeLayer(m) } catch (_) { /* map gone */ } })
    }
  }, [map, pins])

  return null
}

interface RomaniaMapProps {
  pins: Pin[]
}

export const RomaniaMap = ({ pins }: RomaniaMapProps) => {
  const styles = {
    root: 'w-full h-full',
    map: 'w-full h-full',
  }

  return (
    <div className={styles.root}>
      <MapContainer
        center={ROMANIA_CENTER}
        zoom={7}
        minZoom={6}
        maxZoom={14}
        maxBounds={ROMANIA_BOUNDS}
        maxBoundsViscosity={0.8}
        zoomControl
        className={styles.map}
      >
        <MapLayers pins={pins} />
      </MapContainer>
    </div>
  )
}
