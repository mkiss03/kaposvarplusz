'use client'
import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Polygon, Marker, Popup, LayersControl, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icons in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

interface OccupancySpot {
  id: string
  lat: number
  lng: number
  total: number
  occupied: number
  zone: string
}

const zones = {
  Z1: {
    name: 'Belváros',
    coords: [
      [46.3585, 17.7878],
      [46.3621, 17.7919],
      [46.3628, 17.7990],
      [46.3594, 17.8014],
      [46.3569, 17.7960],
    ] as [number, number][],
    color: '#6366F1',
  },
  Z2: {
    name: 'Piac/Vasútállomás',
    coords: [
      [46.3568, 17.8046],
      [46.3560, 17.8110],
      [46.3534, 17.8098],
      [46.3529, 17.8033],
      [46.3549, 17.8009],
    ] as [number, number][],
    color: '#8B5CF6',
  },
  Z3: {
    name: 'Színház/Park',
    coords: [
      [46.3606, 17.8025],
      [46.3628, 17.8066],
      [46.3610, 17.8101],
      [46.3588, 17.8078],
      [46.3587, 17.8040],
    ] as [number, number][],
    color: '#F59E0B',
  },
}

function ZoneControl({ onZoneClick }: { onZoneClick: (zone: keyof typeof zones) => void }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        zIndex: 1000,
        display: 'flex',
        gap: '.5rem',
        flexWrap: 'wrap',
      }}
    >
      {Object.entries(zones).map(([key, zone]) => (
        <button
          key={key}
          onClick={() => onZoneClick(key as keyof typeof zones)}
          className="btn btn-ghost"
          style={{
            fontSize: '.875rem',
            padding: '.5rem .875rem',
            background: 'rgba(255,255,255,.95)',
            color: 'var(--ink)',
            border: 'none',
          }}
        >
          Ugorj {zone.name}
        </button>
      ))}
    </div>
  )
}

function FlyToZone({ zone }: { zone: keyof typeof zones | null }) {
  const map = useMap()

  useEffect(() => {
    if (zone && zones[zone]) {
      const bounds = L.latLngBounds(zones[zone].coords as [number, number][])
      map.flyToBounds(bounds, { padding: [50, 50], duration: 1.2 })
    }
  }, [zone, map])

  return null
}

export default function MapKaposvar() {
  const [mounted, setMounted] = useState(false)
  const [occupancy, setOccupancy] = useState<OccupancySpot[]>([])
  const [selectedZone, setSelectedZone] = useState<keyof typeof zones | null>(null)
  const workerRef = useRef<Worker | null>(null)

  useEffect(() => {
    setMounted(true)

    if (typeof window !== 'undefined') {
      const worker = new Worker('/worker-occupancy.js')
      workerRef.current = worker

      worker.onmessage = (e: MessageEvent<OccupancySpot[]>) => {
        setOccupancy(e.data)
      }

      return () => {
        worker.terminate()
      }
    }
  }, [])

  if (!mounted) {
    return (
      <div
        style={{
          width: '100%',
          height: '500px',
          background: 'var(--card)',
          borderRadius: 'var(--radius-lg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p className="muted">Térkép betöltése...</p>
      </div>
    )
  }

  const getMarkerColor = (spot: OccupancySpot) => {
    const percentage = (spot.occupied / spot.total) * 100
    if (percentage < 60) return '#10B981'
    if (percentage < 85) return '#F59E0B'
    return '#EF4444'
  }

  const createColoredIcon = (color: string) => {
    return L.divIcon({
      className: 'custom-marker',
      html: `<div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    })
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow)',
          border: '1px solid #ffffff15',
        }}
      >
        <MapContainer
          center={[46.3589, 17.7960]}
          zoom={14}
          style={{ height: '500px', width: '100%' }}
          scrollWheelZoom={true}
        >
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="OpenStreetMap">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay checked name="Zónák">
              <>
                {Object.entries(zones).map(([key, zone]) => (
                  <Polygon
                    key={key}
                    positions={zone.coords}
                    pathOptions={{
                      color: zone.color,
                      fillColor: zone.color,
                      fillOpacity: 0.15,
                      weight: 2,
                    }}
                  >
                    <Popup>
                      <strong>{zone.name}</strong>
                      <br />
                      Zóna: {key}
                    </Popup>
                  </Polygon>
                ))}
              </>
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Parkolóoszlopok">
              <>
                {occupancy.map((spot) => (
                  <Marker
                    key={spot.id}
                    position={[spot.lat, spot.lng]}
                    icon={createColoredIcon(getMarkerColor(spot))}
                  >
                    <Popup>
                      <strong>{spot.id}</strong>
                      <br />
                      Zóna: {spot.zone}
                      <br />
                      Szabad: {spot.total - spot.occupied}/{spot.total}
                    </Popup>
                  </Marker>
                ))}
              </>
            </LayersControl.Overlay>
          </LayersControl>

          <FlyToZone zone={selectedZone} />
        </MapContainer>
      </div>

      <ZoneControl onZoneClick={setSelectedZone} />

      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          bottom: '1rem',
          left: '1rem',
          background: 'rgba(255,255,255,.95)',
          padding: '1rem',
          borderRadius: '12px',
          fontSize: '.875rem',
          boxShadow: '0 4px 12px rgba(0,0,0,.15)',
          zIndex: 1000,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '.5rem', color: 'var(--ink)' }}>
          Foglaltság
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.375rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#10B981',
              }}
            />
            <span style={{ color: 'var(--ink)' }}>&lt;60% - Szabad</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#F59E0B',
              }}
            />
            <span style={{ color: 'var(--ink)' }}>60-85% - Kevés</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: '#EF4444',
              }}
            />
            <span style={{ color: 'var(--ink)' }}>&gt;85% - Tele</span>
          </div>
        </div>
      </div>
    </div>
  )
}
