'use client'
import { useEffect, useRef, type ReactNode } from 'react'

interface SectionProps {
  title?: string
  subtitle?: string
  id?: string
  children: ReactNode
}

export default function Section({ title, subtitle, id, children }: SectionProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reveals = element.querySelectorAll('.reveal')
    if (reveals.length === 0) {
      element.classList.add('reveal')
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    if (reveals.length === 0) {
      observer.observe(element)
    } else {
      reveals.forEach((el) => observer.observe(el))
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={ref}
      id={id}
      style={{
        paddingBlock: 'clamp(3rem, 8vw, 5rem)',
      }}
    >
      <div className="container">
        {(title || subtitle) && (
          <div style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
            {title && <h2 className="h2 reveal" style={{ marginBottom: '.75rem' }}>{title}</h2>}
            {subtitle && (
              <p className="muted reveal" style={{ fontSize: '1.125rem', maxWidth: '700px', marginInline: 'auto' }}>
                {subtitle}
              </p>
            )}
          </div>
        )}
        <div className="reveal">{children}</div>
      </div>
    </section>
  )
}
