import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Sparkles, ShieldCheck, Ticket, Wifi, Gift, MapPin } from 'lucide-react'
import ValueTile from '@/components/ValueTile'
import TransitPass from '@/components/TransitPass'
import PointsDemo from '@/components/PointsDemo'
import RoiCalculator from '@/components/RoiCalculator'
import Section from '@/components/Section'
import FAQ from '@/components/FAQ'

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '420px', background: 'var(--card)', borderRadius: 'var(--radius-lg)' }} />,
})

const MapKaposvar = dynamic(() => import('@/components/MapKaposvar'), {
  ssr: false,
  loading: () => (
    <div style={{ height: '500px', background: 'var(--card)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p className="muted">Térkép betöltése...</p>
    </div>
  ),
})

const ParkolasFlow = dynamic(() => import('@/components/ParkolasFlow'), {
  ssr: false,
})

const TicketsFlow = dynamic(() => import('@/components/TicketsFlow'), {
  ssr: false,
})

const DemoPhone = dynamic(() => import('@/components/DemoPhone'), {
  ssr: false,
})

export default function HomePage() {
  return (
    <>
      {/* Navigation */}
      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <a href="#" className="nav-logo">
              Kaposvár<span style={{ color: '#E8EEF7' }}>+</span>
            </a>
            <ul className="nav-links">
              <li><a href="#features">Funkciók</a></li>
              <li><a href="#map">Térkép</a></li>
              <li><a href="#tickets">Jegyek</a></li>
              <li><a href="#parking">Parkolás</a></li>
              <li><a href="#faq">GYIK</a></li>
            </ul>
            <a href="#contact" className="btn btn-primary">
              Kérem a demót
            </a>
          </div>
        </div>
      </nav>

      {/* 3D HERO */}
      <section style={{ paddingBlock: 'clamp(4rem,10vw,7rem)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'clamp(2rem,5vw,4rem)', alignItems: 'center' }}>
            <div>
              <h1 className="h1" style={{ marginBottom: '1.75rem' }}>
                Kaposvár+ — Kedvezmények, jegyek és parkolás egy helyen
              </h1>
              <p className="muted" style={{ fontSize: '1.125rem', marginBottom: '2.5rem', lineHeight: 1.75, maxWidth: '560px' }}>
                Egyetlen appban a parkolás, városkártya, jegyek és partnerkedvezmények. Gyors online ügyintézés, kevesebb sorban állás.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="#contact" className="btn btn-primary">
                  Kérem a demót
                </a>
                <a href="#features" className="btn btn-ghost">
                  Tudj meg többet
                </a>
              </div>
            </div>
            <div>
              <Suspense fallback={<div style={{ minHeight: '420px', background: 'var(--card)', borderRadius: 'var(--radius-lg)' }} />}>
                <HeroCanvas />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE GRID */}
      <Section title="Minden, ami a városban kell" id="features">
        <div className="grid-auto">
          <ValueTile
            icon={<MapPin size={32} aria-hidden />}
            title="Olcsóbb parkolás"
            text="Rendszerhasználati díj csökkentés minden tranzakcióból."
          />
          <ValueTile
            icon={<ShieldCheck size={32} aria-hidden />}
            title="Digitális Kaposvár Kártya"
            text="QR kód és Wallet integráció, online hosszabbítás."
          />
          <ValueTile
            icon={<Ticket size={32} aria-hidden />}
            title="Jegyvásárlás eseményekre"
            text="E-jegy megvásárlása ülésrenddel, azonnal."
          />
          <ValueTile
            icon={<Wifi size={32} aria-hidden />}
            title="Ellenőrzés offline"
            text="Aláírt pillanatkép alapján, internet nélkül is."
          />
          <ValueTile
            icon={<Gift size={32} aria-hidden />}
            title="Partnerkedvezmények"
            text="Gyors érvényesítés és automatikus naplózás."
          />
          <ValueTile
            icon={<Sparkles size={32} aria-hidden />}
            title="Valós idejű térkép"
            text="Parkolóoszlop adat integráció élő foglaltsággal."
          />
        </div>
      </Section>

      {/* REAL MAP */}
      <Section
        title="Valós idejű parkolási térkép"
        subtitle="Kaposvár belváros élő parkolóhely-foglaltsággal"
        id="map"
      >
        <Suspense fallback={<div style={{ height: '500px', background: 'var(--card)' }}>Betöltés...</div>}>
          <MapKaposvar />
        </Suspense>
      </Section>

      {/* TICKETS FLOW */}
      <Section
        title="Jegyvásárlás és ülésrend"
        subtitle="Válassz üléseket, fizess egy kattintással"
        id="tickets"
      >
        <Suspense fallback={<div>Betöltés...</div>}>
          <TicketsFlow />
        </Suspense>
      </Section>

      {/* PARKING FLOW */}
      <Section
        title="Parkolási folyamat"
        subtitle="Rendszám → Zóna → Indítás → Folyamat → Leállítás"
        id="parking"
      >
        <Suspense fallback={<div>Betöltés...</div>}>
          <ParkolasFlow />
        </Suspense>
      </Section>

      {/* PHONE DEMO */}
      <Section title="Telefon demó" subtitle="Próbáld ki az interfészt böngészőben" id="demo">
        <Suspense fallback={<div>Betöltés...</div>}>
          <DemoPhone />
        </Suspense>
      </Section>

      {/* TÖMEGKÖZLEKEDÉS */}
      <Section
        title="Digitális buszjegy és bérlet"
        subtitle="Online vásárlás • E-bérlet a Wallettben • Ellenőrzés offline is"
        id="transport"
      >
        <TransitPass />
      </Section>

      {/* KAPOSVÁR PONT */}
      <Section
        title="Kaposvár Pont — Hűségprogram"
        subtitle="Pontgyűjtés vásárláskor • Beváltás jegyre, parkolásra • Havi nyereményjáték (opció)"
        id="points"
      >
        <PointsDemo />
      </Section>

      {/* ROI CALCULATOR */}
      <Section title="Bevétel szimulátor" subtitle="Becsült éves bevétel a rendszerhasználati díjakból" id="roi">
        <RoiCalculator />
      </Section>

      {/* PILOT STEPS */}
      <Section title="Hogyan indul a pilot?" id="pilot">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            {
              num: 1,
              title: 'Igényfelmérés',
              desc: 'Megbeszéljük az igényeket és a helyi sajátosságokat.',
            },
            {
              num: 2,
              title: 'Technikai bekötés',
              desc: 'API integráció a parkolás, jegyrendszer és partnerek felé.',
            },
            {
              num: 3,
              title: 'Indulás és riportok',
              desc: 'Pilot launch, beta tesztelők, folyamatos analytics.',
            },
          ].map((step) => (
            <div key={step.num} className="card glass" style={{ padding: '2rem' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, var(--brand), var(--brand2))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.75rem',
                  color: 'var(--ink)',
                  marginBottom: '1.25rem',
                }}
              >
                {step.num}
              </div>
              <h3 className="h3" style={{ marginBottom: '.75rem' }}>
                {step.title}
              </h3>
              <p className="muted">{step.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Gyakran ismételt kérdések" id="faq">
        <FAQ />
      </Section>

      {/* CTA / CONTACT */}
      <Section title="Kérek egy pilot megbeszélést" id="contact">
        <div className="card glass" style={{ padding: 'clamp(2rem,5vw,3.5rem)', textAlign: 'center', maxWidth: '680px', marginInline: 'auto' }}>
          <p className="muted" style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
            Írj nekünk és 48 órán belül felvesszük veled a kapcsolatot.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:hello@kaposvarplus.hu" className="btn btn-primary">
              hello@kaposvarplus.hu
            </a>
            <a href="tel:+36301234567" className="btn btn-ghost">
              +36 30 123 4567
            </a>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #ffffff12', marginTop: '4rem', paddingBlock: '2.5rem' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1.5rem',
              fontSize: '.875rem',
            }}
          >
            <div className="muted">© 2025 Kaposvár+ — Minden jog fenntartva</div>
            <div style={{ display: 'flex', gap: '2rem' }}>
              <a href="#" className="muted" style={{ textDecoration: 'none', transition: 'color .2s' }}>
                Adatkezelés
              </a>
              <a href="#" className="muted" style={{ textDecoration: 'none', transition: 'color .2s' }}>
                Impresszum
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
