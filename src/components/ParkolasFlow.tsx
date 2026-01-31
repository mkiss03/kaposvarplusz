'use client'
import { useState, useEffect } from 'react'
import { ChevronRight } from 'lucide-react'
import dynamic from 'next/dynamic'

const MapKaposvar = dynamic(() => import('./MapKaposvar'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '300px', background: 'var(--card)', borderRadius: 'var(--radius)' }}>
      Térkép betöltése...
    </div>
  ),
})

type Step = 'rendszam' | 'zona' | 'inditas' | 'folyamat' | 'leallitas'

const zones = {
  Z1: { name: 'Belváros', rate: 250 },
  Z2: { name: 'Piac/Vasútállomás', rate: 180 },
  Z3: { name: 'Színház/Park', rate: 200 },
}

export default function ParkolasFlow() {
  const [step, setStep] = useState<Step>('rendszam')
  const [rendszam, setRendszam] = useState('')
  const [selectedZone, setSelectedZone] = useState<keyof typeof zones | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSeconds((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const systemFee = 90
  const calculateFee = () => {
    if (!selectedZone) return 0
    const minutes = Math.floor(elapsedSeconds / 60)
    const hourlyRate = zones[selectedZone].rate
    return Math.floor((hourlyRate / 60) * minutes) + systemFee
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="card glass" style={{ padding: 'clamp(2rem,4vw,3rem)' }}>
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {[
          { id: 'rendszam', label: '1. Rendszám' },
          { id: 'zona', label: '2. Zóna' },
          { id: 'inditas', label: '3. Indítás' },
          { id: 'folyamat', label: '4. Folyamat' },
          { id: 'leallitas', label: '5. Leállítás' },
        ].map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div
              className="chip"
              style={{
                background: step === s.id ? 'var(--brand)' : '#ffffff08',
                color: step === s.id ? 'var(--ink)' : 'var(--muted)',
                fontWeight: step === s.id ? 800 : 600,
              }}
            >
              {s.label}
            </div>
            {i < 4 && <ChevronRight size={16} className="muted" aria-hidden />}
          </div>
        ))}
      </div>

      {/* Step: Rendszám */}
      {step === 'rendszam' && (
        <div>
          <h3 className="h3" style={{ marginBottom: '1rem' }}>
            Add meg a rendszámodat
          </h3>
          <input
            type="text"
            value={rendszam}
            onChange={(e) => setRendszam(e.target.value.toUpperCase())}
            placeholder="ABC-123"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '12px',
              border: '1px solid #ffffff1a',
              background: '#ffffff0a',
              color: '#E8EEF7',
              fontSize: '1.125rem',
              marginBottom: '1.5rem',
            }}
          />
          <button
            className="btn btn-primary"
            onClick={() => setStep('zona')}
            disabled={rendszam.length < 3}
          >
            Tovább
          </button>
        </div>
      )}

      {/* Step: Zóna */}
      {step === 'zona' && (
        <div>
          <h3 className="h3" style={{ marginBottom: '1rem' }}>
            Válaszd ki a zónát
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {Object.entries(zones).map(([key, zone]) => (
              <button
                key={key}
                className={selectedZone === key ? 'card' : 'card glass'}
                onClick={() => setSelectedZone(key as keyof typeof zones)}
                style={{
                  padding: '1.5rem',
                  cursor: 'pointer',
                  border: selectedZone === key ? '2px solid var(--brand)' : '1px solid #ffffff15',
                  background: selectedZone === key ? 'rgba(243,198,35,.1)' : undefined,
                }}
              >
                <div style={{ fontWeight: 800, marginBottom: '.5rem' }}>{key}</div>
                <div className="muted" style={{ fontSize: '.875rem' }}>
                  {zone.name}
                </div>
                <div style={{ marginTop: '.75rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--brand)' }}>
                  {zone.rate} Ft/óra
                </div>
              </button>
            ))}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setStep('inditas')}
            disabled={!selectedZone}
          >
            Tovább
          </button>
        </div>
      )}

      {/* Step: Indítás */}
      {step === 'inditas' && (
        <div>
          <h3 className="h3" style={{ marginBottom: '1rem' }}>
            Parkolás indítása
          </h3>
          <div className="card glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gap: '.75rem' }}>
              <div>
                <span className="muted">Rendszám:</span>{' '}
                <strong style={{ color: 'var(--brand)' }}>{rendszam}</strong>
              </div>
              <div>
                <span className="muted">Zóna:</span> <strong>{selectedZone}</strong> -{' '}
                {selectedZone && zones[selectedZone].name}
              </div>
              <div>
                <span className="muted">Óradíj:</span>{' '}
                <strong>{selectedZone && zones[selectedZone].rate} Ft</strong>
              </div>
              <div>
                <span className="muted">Rendszerhasználati díj:</span> <strong>{systemFee} Ft</strong>
              </div>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setIsRunning(true)
              setStep('folyamat')
            }}
          >
            Parkolás indítása
          </button>
        </div>
      )}

      {/* Step: Folyamat */}
      {step === 'folyamat' && (
        <div>
          <h3 className="h3" style={{ marginBottom: '1rem' }}>
            Parkolás folyamatban
          </h3>
          <div
            className="card glass"
            style={{
              padding: '2rem',
              textAlign: 'center',
              marginBottom: '1.5rem',
              background: 'linear-gradient(135deg, rgba(243,198,35,.15), rgba(255,212,77,.05))',
            }}
          >
            <div className="stat" style={{ fontSize: 'clamp(3rem,8vw,5rem)' }}>
              {formatTime(elapsedSeconds)}
            </div>
            <div className="muted" style={{ marginTop: '1rem', fontSize: '1.125rem' }}>
              {calculateFee()} Ft
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setIsRunning(false)
              setStep('leallitas')
            }}
            style={{ width: '100%' }}
          >
            Parkolás leállítása
          </button>
        </div>
      )}

      {/* Step: Leállítás */}
      {step === 'leallitas' && (
        <div>
          <h3 className="h3" style={{ marginBottom: '1rem', color: 'var(--brand)' }}>
            ✓ Parkolás befejezve
          </h3>
          <div className="card glass" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gap: '.75rem' }}>
              <div>
                <span className="muted">Rendszám:</span> <strong>{rendszam}</strong>
              </div>
              <div>
                <span className="muted">Időtartam:</span> <strong>{formatTime(elapsedSeconds)}</strong>
              </div>
              <div>
                <span className="muted">Zóna:</span> <strong>{selectedZone}</strong>
              </div>
              <div style={{ borderTop: '1px solid #ffffff15', paddingTop: '.75rem', marginTop: '.5rem' }}>
                <span className="muted">Végösszeg:</span>{' '}
                <strong style={{ fontSize: '1.5rem', color: 'var(--brand)' }}>
                  {calculateFee()} Ft
                </strong>
              </div>
            </div>
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setStep('rendszam')
              setRendszam('')
              setSelectedZone(null)
              setElapsedSeconds(0)
              setIsRunning(false)
            }}
            style={{ width: '100%' }}
          >
            Új parkolás indítása
          </button>
        </div>
      )}
    </div>
  )
}
