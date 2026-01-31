'use client'
import { useState } from 'react'
import confetti from 'canvas-confetti'
import { Wallet } from 'lucide-react'

const ROWS = 12
const COLS = 8
const TICKET_PRICE = 3500

export default function TicketsFlow() {
  const [seats, setSeats] = useState<Set<string>>(new Set())
  const [purchased, setPurchased] = useState(false)
  const [occupiedSeats] = useState<Set<string>>(
    new Set(['3-3', '3-4', '5-2', '5-5', '5-6', '7-3', '7-4', '7-5', '9-4', '10-2', '10-6'])
  )

  const toggleSeat = (row: number, col: number) => {
    const seatId = `${row}-${col}`
    if (occupiedSeats.has(seatId)) return

    const newSeats = new Set(seats)
    if (newSeats.has(seatId)) {
      newSeats.delete(seatId)
    } else {
      newSeats.add(seatId)
    }
    setSeats(newSeats)
  }

  const handlePurchase = () => {
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#F3C623', '#FFD44D', '#6366F1', '#8B5CF6'],
    })
    setPurchased(true)
  }

  const getSeatColor = (row: number, col: number) => {
    const seatId = `${row}-${col}`
    if (occupiedSeats.has(seatId)) return '#4B5563'
    if (seats.has(seatId)) return '#F3C623'
    return '#ffffff15'
  }

  return (
    <div className="card glass" style={{ padding: 'clamp(2rem,4vw,3rem)' }}>
      {!purchased ? (
        <>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>
              Válassz üléseket
            </h3>
            <p className="muted">Színház Kaposvár — 2025.02.15, 19:00</p>
          </div>

          {/* Stage */}
          <div
            style={{
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              padding: '1rem',
              borderRadius: '12px 12px 0 0',
              textAlign: 'center',
              fontWeight: 700,
              marginBottom: '2rem',
              color: 'white',
            }}
          >
            SZÍNPAD
          </div>

          {/* Seat Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${COLS}, 1fr)`,
              gap: '.5rem',
              marginBottom: '2rem',
              maxWidth: '500px',
              marginInline: 'auto',
            }}
          >
            {Array.from({ length: ROWS }).map((_, row) =>
              Array.from({ length: COLS }).map((_, col) => (
                <button
                  key={`${row}-${col}`}
                  onClick={() => toggleSeat(row, col)}
                  disabled={occupiedSeats.has(`${row}-${col}`)}
                  style={{
                    aspectRatio: '1',
                    borderRadius: '6px',
                    border: 'none',
                    background: getSeatColor(row, col),
                    cursor: occupiedSeats.has(`${row}-${col}`) ? 'not-allowed' : 'pointer',
                    transition: 'all .2s ease',
                    fontSize: '.75rem',
                    color: seats.has(`${row}-${col}`) ? 'var(--ink)' : '#ffffff60',
                  }}
                  aria-label={`Sor ${row + 1}, Szék ${col + 1}`}
                >
                  {row + 1}-{col + 1}
                </button>
              ))
            )}
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2rem',
              fontSize: '.875rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  background: '#ffffff15',
                }}
              />
              <span className="muted">Szabad</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  background: '#F3C623',
                }}
              />
              <span className="muted">Kiválasztott</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '4px',
                  background: '#4B5563',
                }}
              />
              <span className="muted">Foglalt</span>
            </div>
          </div>

          {/* Summary */}
          {seats.size > 0 && (
            <div
              className="card glass"
              style={{
                padding: '1.5rem',
                marginBottom: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div className="muted" style={{ fontSize: '.875rem' }}>
                  {seats.size} jegy kiválasztva
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand)' }}>
                  {seats.size * TICKET_PRICE} Ft
                </div>
              </div>
              <button className="btn btn-primary" onClick={handlePurchase}>
                Fizetés (demó)
              </button>
            </div>
          )}
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h3 className="h3" style={{ marginBottom: '1rem', color: 'var(--brand)' }}>
            Sikeres vásárlás!
          </h3>
          <p className="muted" style={{ marginBottom: '2rem' }}>
            {seats.size} jegy · {seats.size * TICKET_PRICE} Ft
          </p>
          <button className="btn btn-ghost" style={{ gap: '.75rem' }}>
            <Wallet size={20} aria-hidden />
            Jegy a Walletben
          </button>
          <div style={{ marginTop: '1.5rem' }}>
            <button
              className="btn"
              onClick={() => {
                setPurchased(false)
                setSeats(new Set())
              }}
            >
              Új jegyvásárlás
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
