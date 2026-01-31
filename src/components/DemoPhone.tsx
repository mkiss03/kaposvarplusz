'use client'
import { useState, useEffect, useRef } from 'react'
import { Play, CreditCard, Search } from 'lucide-react'

type Tab = 'parking' | 'card' | 'check'

export default function DemoPhone() {
  const [activeTab, setActiveTab] = useState<Tab>('parking')
  const [plate, setPlate] = useState('ABC123')
  const [zone, setZone] = useState<'Z1' | 'Z2' | 'Z3'>('Z1')
  const [parkingActive, setParkingActive] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const [cardFlipped, setCardFlipped] = useState(false)
  const [checkPlate, setCheckPlate] = useState('')
  const [checkStatus, setCheckStatus] = useState<'idle' | 'valid' | 'invalid'>('idle')
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (parkingActive) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => e + 1)
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [parkingActive])

  const startParking = () => {
    setParkingActive(true)
    setElapsed(0)
  }

  const stopParking = () => {
    setParkingActive(false)
    setElapsed(0)
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const calculateFee = (seconds: number) => {
    const rates = { Z1: 200, Z2: 150, Z3: 100 }
    const hourly = rates[zone]
    return Math.floor((seconds / 3600) * hourly)
  }

  const handleCheck = () => {
    const valid = Math.random() > 0.5
    setCheckStatus(valid ? 'valid' : 'invalid')
    setTimeout(() => setCheckStatus('idle'), 3000)
  }

  return (
    <div style={{ maxWidth: '420px', marginInline: 'auto' }}>
      <div
        className="card"
        style={{
          padding: '1.5rem',
          minHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '.5rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid #ffffff1a',
            paddingBottom: '.5rem',
          }}
        >
          <button
            onClick={() => setActiveTab('parking')}
            className="btn"
            style={{
              flex: 1,
              background: activeTab === 'parking' ? 'var(--brand)' : 'transparent',
              color: activeTab === 'parking' ? 'var(--ink)' : '#EAEFF7',
              border: 'none',
            }}
          >
            <Play size={16} aria-hidden /> Parkolás
          </button>
          <button
            onClick={() => setActiveTab('card')}
            className="btn"
            style={{
              flex: 1,
              background: activeTab === 'card' ? 'var(--brand)' : 'transparent',
              color: activeTab === 'card' ? 'var(--ink)' : '#EAEFF7',
              border: 'none',
            }}
          >
            <CreditCard size={16} aria-hidden /> Kártya
          </button>
          <button
            onClick={() => setActiveTab('check')}
            className="btn"
            style={{
              flex: 1,
              background: activeTab === 'check' ? 'var(--brand)' : 'transparent',
              color: activeTab === 'check' ? 'var(--ink)' : '#EAEFF7',
              border: 'none',
            }}
          >
            <Search size={16} aria-hidden /> Ellenőrzés
          </button>
        </div>

        {activeTab === 'parking' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '.5rem', fontWeight: 600 }}>
                Rendszám
              </label>
              <input
                type="text"
                value={plate}
                onChange={(e) => setPlate(e.target.value.toUpperCase())}
                disabled={parkingActive}
                style={{
                  width: '100%',
                  padding: '.75rem',
                  borderRadius: '12px',
                  border: '1px solid #ffffff1a',
                  background: '#ffffff0a',
                  color: '#EAEFF7',
                  fontSize: '1rem',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '.5rem', fontWeight: 600 }}>
                Zóna
              </label>
              <div style={{ display: 'flex', gap: '.5rem' }}>
                {(['Z1', 'Z2', 'Z3'] as const).map((z) => (
                  <button
                    key={z}
                    onClick={() => setZone(z)}
                    disabled={parkingActive}
                    className="btn"
                    style={{
                      flex: 1,
                      background: zone === z ? 'var(--brand)' : 'transparent',
                      color: zone === z ? 'var(--ink)' : '#EAEFF7',
                      border: '1px solid #ffffff1a',
                    }}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>
            {parkingActive && (
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '12px',
                  background: '#ffffff0a',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand)' }}>
                  {formatTime(elapsed)}
                </div>
                <div className="muted" style={{ marginTop: '.5rem' }}>
                  {calculateFee(elapsed)} Ft
                </div>
              </div>
            )}
            <button
              onClick={parkingActive ? stopParking : startParking}
              className="btn btn-primary"
              style={{ marginTop: 'auto' }}
            >
              {parkingActive ? 'Megállítás' : 'Indítás'}
            </button>
          </div>
        )}

        {activeTab === 'card' && (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div
              onClick={() => setCardFlipped(!cardFlipped)}
              style={{
                width: '100%',
                maxWidth: '320px',
                height: '200px',
                perspective: '1000px',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.6s',
                  transform: cardFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #F3C623, #FFD44D)',
                    padding: '1.5rem',
                    color: 'var(--ink)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>Kaposvár+</div>
                  <div>
                    <div style={{ fontSize: '.75rem', opacity: 0.7 }}>Kártyabirtokos</div>
                    <div style={{ fontWeight: 700 }}>Minta Felhasználó</div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: '.75rem', opacity: 0.7 }}>Érvényes</div>
                      <div style={{ fontWeight: 700 }}>2026.12</div>
                    </div>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'white',
                        borderRadius: '6px',
                      }}
                    />
                  </div>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #1E293B, #0F172A)',
                    padding: '1.5rem',
                    color: '#EAEFF7',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div
                    style={{
                      width: '80%',
                      height: '40px',
                      background: 'white',
                      borderRadius: '6px',
                    }}
                  />
                  <div style={{ fontSize: '.875rem', opacity: 0.7 }}>KAPO-0123-4567</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'check' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '.5rem', fontWeight: 600 }}>
                Rendszám ellenőrzése
              </label>
              <input
                type="text"
                value={checkPlate}
                onChange={(e) => setCheckPlate(e.target.value.toUpperCase())}
                placeholder="ABC123"
                style={{
                  width: '100%',
                  padding: '.75rem',
                  borderRadius: '12px',
                  border: '1px solid #ffffff1a',
                  background: '#ffffff0a',
                  color: '#EAEFF7',
                  fontSize: '1rem',
                }}
              />
            </div>
            <button onClick={handleCheck} className="btn btn-primary">
              Ellenőrzés
            </button>
            {checkStatus !== 'idle' && (
              <div
                style={{
                  padding: '2rem',
                  borderRadius: '12px',
                  background: checkStatus === 'valid' ? '#10B98120' : '#EF444420',
                  border: `2px solid ${checkStatus === 'valid' ? '#10B981' : '#EF4444'}`,
                  textAlign: 'center',
                  marginTop: '1rem',
                }}
              >
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 800,
                    color: checkStatus === 'valid' ? '#10B981' : '#EF4444',
                  }}
                >
                  {checkStatus === 'valid' ? '✓ Érvényes' : '✗ Érvénytelen'}
                </div>
                <div className="muted" style={{ marginTop: '.5rem', fontSize: '.875rem' }}>
                  {checkStatus === 'valid'
                    ? 'Parkolás aktív, lejárat: 14:32'
                    : 'Nincs aktív parkolás ezen a rendszámon'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
