'use client'
import { useEffect, useRef } from 'react'

export default function MapPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = 600 * dpr
    canvas.height = 400 * dpr
    ctx.scale(dpr, dpr)

    // Parking spots with random occupancy
    const spots = [
      { x: 150, y: 100, status: 'free' },
      { x: 300, y: 120, status: 'occupied' },
      { x: 450, y: 90, status: 'free' },
      { x: 200, y: 250, status: 'warning' },
      { x: 350, y: 280, status: 'free' },
      { x: 480, y: 240, status: 'occupied' },
    ]

    const draw = () => {
      ctx.clearRect(0, 0, 600, 400)

      // Zone 1 (top-left)
      ctx.fillStyle = 'rgba(99, 102, 241, 0.12)'
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50, 50)
      ctx.lineTo(250, 50)
      ctx.lineTo(220, 180)
      ctx.lineTo(80, 160)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Zone 2 (top-right)
      ctx.fillStyle = 'rgba(139, 92, 246, 0.12)'
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.4)'
      ctx.beginPath()
      ctx.moveTo(280, 60)
      ctx.lineTo(520, 80)
      ctx.lineTo(500, 200)
      ctx.lineTo(300, 180)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Zone 3 (bottom)
      ctx.fillStyle = 'rgba(243, 198, 35, 0.12)'
      ctx.strokeStyle = 'rgba(243, 198, 35, 0.4)'
      ctx.beginPath()
      ctx.moveTo(100, 220)
      ctx.lineTo(500, 230)
      ctx.lineTo(520, 350)
      ctx.lineTo(80, 340)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()

      // Draw parking spots
      spots.forEach((spot) => {
        const colors = {
          free: { fill: 'rgba(16, 185, 129, 0.3)', stroke: '#10B981' },
          occupied: { fill: 'rgba(239, 68, 68, 0.3)', stroke: '#EF4444' },
          warning: { fill: 'rgba(245, 158, 11, 0.3)', stroke: '#F59E0B' },
        }

        const color = colors[spot.status as keyof typeof colors]

        // Outer glow
        ctx.shadowColor = color.stroke
        ctx.shadowBlur = 15
        ctx.fillStyle = color.fill
        ctx.beginPath()
        ctx.arc(spot.x, spot.y, 12, 0, Math.PI * 2)
        ctx.fill()

        ctx.shadowBlur = 0
        ctx.strokeStyle = color.stroke
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.arc(spot.x, spot.y, 10, 0, Math.PI * 2)
        ctx.stroke()

        // Inner dot
        ctx.fillStyle = color.stroke
        ctx.beginPath()
        ctx.arc(spot.x, spot.y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      // Labels
      ctx.shadowBlur = 0
      ctx.font = '600 12px Inter, sans-serif'
      ctx.fillStyle = '#9FB0C3'
      ctx.fillText('Belváros', 120, 100)
      ctx.fillText('Parkolóház', 360, 120)
      ctx.fillText('Piac', 280, 290)
    }

    draw()

    // Random status change every 3s
    const interval = setInterval(() => {
      const randomSpot = spots[Math.floor(Math.random() * spots.length)]
      const statuses = ['free', 'occupied', 'warning']
      randomSpot.status = statuses[Math.floor(Math.random() * statuses.length)]
      draw()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="card glass" style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 className="h3" style={{ marginBottom: '.5rem' }}>
          Valós idejű férőhely-térkép
        </h3>
        <p className="muted" style={{ fontSize: '.9375rem' }}>
          Parkolóoszlop integráció az aktuális városi rendszerrel
        </p>
      </div>

      <div
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#0A0F1F',
          border: '1px solid #ffffff10',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          marginTop: '1.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          fontSize: '.875rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#10B981',
            }}
          />
          <span className="muted">Szabad</span>
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
          <span className="muted">Kevés</span>
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
          <span className="muted">Foglalt</span>
        </div>
      </div>

      <button className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>
        Integráció az oszlop API-val
      </button>
    </div>
  )
}
