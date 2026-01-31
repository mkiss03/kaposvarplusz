'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'Hogyan működik a digitális városkártya?',
    a: 'A Kaposvár+ kártya a telefonodban QR kód vagy Apple/Google Wallet formájában tárolható. Partnerhelyeken egyetlen szkennelés szükséges a kedvezmény érvényesítéséhez, minden tranzakció automatikusan naplózódik.',
  },
  {
    q: 'Milyen parkolási díjak érvényesek?',
    a: 'A rendszerhasználati díj várható mértéke 20–200 Ft/tranzakció, mely a város által megszabott szinttől függ. Ez alacsonyabb, mint a hagyományos parkolóórás rendszer üzemeltetési költsége, miközben több adatot és funkciót nyújt.',
  },
  {
    q: 'Offline is működik az ellenőrzés?',
    a: 'Igen! Az ellenőr alkalmazás aláírt pillanatképet tölt le a szerverről, mely tartalmazza az összes aktív parkolást és bérletet. Ez biztosítja, hogy internetkapcsolat nélkül is ellenőrizhető legyen a jogosultság.',
  },
  {
    q: 'Hogyan vásárolhatok jegyet eseményekre?',
    a: 'Az applikációban kiválasztod az eseményt, a kívánt üléseket (ha van ülésrend), majd bankkártyával fizetsz. Az e-jegy azonnal a telefonodra kerül QR kód formájában, amit a helyszínen szkennelnek.',
  },
  {
    q: 'Milyen adatokat gyűjt a rendszer?',
    a: 'Kizárólag tranzakciós adatokat: parkolás kezdete/vége, zóna, rendszám (hash-elve), vásárlási előzmények partner típusok szerint. Semmilyen helymeghatározást vagy egyéb személyes adatot nem tárolunk a szükségesnél többet. GDPR-kompatibilis.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div style={{ maxWidth: '800px', marginInline: 'auto' }}>
      {faqs.map((faq, i) => (
        <div
          key={i}
          className="card glass"
          style={{
            marginBottom: '1rem',
            padding: '1.5rem',
            cursor: 'pointer',
            transition: 'all .3s ease',
          }}
          onClick={() => setOpenIndex(openIndex === i ? null : i)}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <h3 className="h3" style={{ fontSize: '1.125rem', marginBottom: 0 }}>
              {faq.q}
            </h3>
            <ChevronDown
              size={24}
              style={{
                flexShrink: 0,
                color: 'var(--brand)',
                transition: 'transform .3s ease',
                transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              aria-hidden
            />
          </div>
          <div
            style={{
              maxHeight: openIndex === i ? '400px' : '0',
              overflow: 'hidden',
              transition: 'max-height .4s cubic-bezier(.4,0,.2,1)',
            }}
          >
            <p
              className="muted"
              style={{
                marginTop: '1rem',
                lineHeight: 1.7,
                fontSize: '.9375rem',
              }}
            >
              {faq.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
