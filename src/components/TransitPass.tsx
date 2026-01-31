'use client'
import { Smartphone } from 'lucide-react'

export default function TransitPass() {
  return (
    <div style={{ maxWidth: '500px', marginInline: 'auto' }}>
      <div
        className="card"
        style={{
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '280px',
            height: '180px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            padding: '1.5rem',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div>
            <div style={{ fontSize: '.875rem', opacity: 0.8 }}>Kaposvár Helyi Járat</div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem', marginTop: '.25rem' }}>
              Havi Bérlet
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: '.75rem', opacity: 0.8 }}>Érvényes</div>
              <div style={{ fontWeight: 700 }}>2025.02.01 - 02.28</div>
            </div>
            <div
              style={{
                width: '64px',
                height: '64px',
                background: 'white',
                borderRadius: '8px',
              }}
            />
          </div>
          <div
            style={{
              position: 'absolute',
              right: '-20px',
              top: '-20px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
            }}
          />
        </div>

        <div style={{ textAlign: 'center' }}>
          <p className="muted" style={{ fontSize: '.9375rem', marginBottom: '1rem' }}>
            Napi, heti, havi bérlet • Diák/nyugdíjas kedvezmény • Offline ellenőrzés
          </p>
          <button className="btn" style={{ gap: '.75rem' }}>
            <Smartphone size={20} aria-hidden />
            Hozzáadás a Wallethez
          </button>
        </div>
      </div>
    </div>
  )
}
