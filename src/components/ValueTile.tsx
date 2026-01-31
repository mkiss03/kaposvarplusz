import type { ReactNode } from 'react'

interface ValueTileProps {
  icon: ReactNode
  title: string
  text: string
}

export default function ValueTile({ icon, title, text }: ValueTileProps) {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <div style={{ color: 'var(--brand)', marginBottom: '1rem' }}>
        {icon}
      </div>
      <h3 className="h3" style={{ marginBottom: '.5rem' }}>
        {title}
      </h3>
      <p className="muted" style={{ fontSize: '.9375rem' }}>
        {text}
      </p>
    </div>
  )
}
