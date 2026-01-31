'use client'
import { useState } from 'react'
import { Gift } from 'lucide-react'

export default function PointsDemo() {
  const [points, setPoints] = useState(65)
  const [showConfetti, setShowConfetti] = useState(false)

  const addPoints = () => {
    setPoints((p) => Math.min(p + 10, 100))
  }

  const redeem = () => {
    if (points >= 80) {
      setShowConfetti(true)
      setTimeout(() => {
        setPoints(0)
        setShowConfetti(false)
      }, 2000)
    }
  }

  return (
    <div style={{ maxWidth: '400px', marginInline: 'auto', position: 'relative' }}>
      {showConfetti && <Confetti />}
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
        <div style={{ position: 'relative', width: '180px', height: '180px' }}>
          <svg
            width="180"
            height="180"
            viewBox="0 0 180 180"
            style={{ transform: 'rotate(-90deg)' }}
          >
            <circle
              cx="90"
              cy="90"
              r="70"
              stroke="#ffffff1a"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="90"
              cy="90"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 70}`}
              strokeDashoffset={`${2 * Math.PI * 70 * (1 - points / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--brand)" />
                <stop offset="100%" stopColor="var(--brand-2)" />
              </linearGradient>
            </defs>
          </svg>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--brand)' }}>
              {points}
            </div>
            <div className="muted" style={{ fontSize: '.875rem' }}>
              / 100 pont
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <button onClick={addPoints} className="btn" style={{ flex: 1 }}>
            +10 Pont
          </button>
          {points >= 80 && (
            <button onClick={redeem} className="btn btn-primary" style={{ flex: 1, gap: '.5rem' }}>
              <Gift size={18} aria-hidden />
              Beváltás
            </button>
          )}
        </div>

        <p className="muted" style={{ fontSize: '.875rem', textAlign: 'center' }}>
          {points < 80
            ? `Még ${80 - points} pont a következő jutalomig`
            : 'Beválthatod a pontjaid kedvezményre!'}
        </p>
      </div>
    </div>
  )
}

function Confetti() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: '-10px',
            width: '8px',
            height: '8px',
            background: ['#F3C623', '#FFD44D', '#6366F1', '#8B5CF6'][Math.floor(Math.random() * 4)],
            borderRadius: '50%',
            animation: `confetti-fall ${1 + Math.random() * 2}s linear forwards`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(500px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
