'use client'
import { useState } from 'react'

export default function RoiCalculator() {
  const [dailyParkings, setDailyParkings] = useState(1000)
  const [feePerParking, setFeePerParking] = useState(50)

  const yearlyRevenue = dailyParkings * feePerParking * 365

  return (
    <div style={{ maxWidth: '600px', marginInline: 'auto' }}>
      <div className="card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div>
            <label
              htmlFor="daily-parkings"
              style={{ display: 'block', marginBottom: '.75rem', fontWeight: 600 }}
            >
              Napi parkolások száma: <span style={{ color: 'var(--brand)' }}>{dailyParkings}</span>
            </label>
            <input
              id="daily-parkings"
              type="range"
              min="200"
              max="5000"
              step="100"
              value={dailyParkings}
              onChange={(e) => setDailyParkings(Number(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: '#ffffff1a',
                outline: 'none',
                accentColor: 'var(--brand)',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="fee-per-parking"
              style={{ display: 'block', marginBottom: '.75rem', fontWeight: 600 }}
            >
              Rendszerhasználati díj parkolásként: <span style={{ color: 'var(--brand)' }}>{feePerParking} Ft</span>
            </label>
            <input
              id="fee-per-parking"
              type="range"
              min="20"
              max="200"
              step="10"
              value={feePerParking}
              onChange={(e) => setFeePerParking(Number(e.target.value))}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: '#ffffff1a',
                outline: 'none',
                accentColor: 'var(--brand)',
              }}
            />
          </div>

          <div
            style={{
              padding: '2rem',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #ffffff0f, #ffffff06)',
              border: '2px solid var(--brand)',
              textAlign: 'center',
            }}
          >
            <div className="muted" style={{ marginBottom: '.5rem', fontSize: '.875rem' }}>
              Becsült éves bevétel
            </div>
            <div
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 800,
                background: 'linear-gradient(135deg, var(--brand), var(--brand-2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {yearlyRevenue.toLocaleString('hu-HU')} Ft
            </div>
            <p className="muted" style={{ marginTop: '1rem', fontSize: '.875rem' }}>
              Képlet: {dailyParkings} parkolás × {feePerParking} Ft × 365 nap
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
