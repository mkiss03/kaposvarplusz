import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Sparkles, ShieldCheck, Ticket, Wifi, Gift, MapPin } from 'lucide-react'
import ValueTile from '@/components/ValueTile'
import DemoPhone from '@/components/DemoPhone'
import TransitPass from '@/components/TransitPass'
import PointsDemo from '@/components/PointsDemo'
import RoiCalculator from '@/components/RoiCalculator'
import Section from '@/components/Section'

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
  ssr: false,
  loading: () => <div style={{ minHeight: '400px', background: '#0F172A', borderRadius: '18px' }} />,
})

export default function HomePage() {
  return (
    <>
      <nav className="nav">
        <div className="container">
          <div className="nav-inner">
            <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--brand)' }}>
              Kaposvár<span style={{ color: '#EAEFF7' }}>+</span>
            </div>
            <ul className="nav-links">
              <li><a href="#demo">Demó</a></li>
              <li><a href="#transport">Tömegközlekedés</a></li>
              <li><a href="#points">Pontprogram</a></li>
              <li><a href="#roi">Kalkulátor</a></li>
            </ul>
            <a href="mailto:hello@kaposvarplus.hu" className="btn btn-primary">
              Kérem a demót
            </a>
          </div>
        </div>
      </nav>

      {/* A) 3D HERO */}
      <section style={{ paddingBlock: 'clamp(3rem,8vw,6rem)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div>
              <h1 className="h1" style={{ marginBottom: '1.5rem' }}>
                Kaposvár+ — Kedvezmények, jegyek és parkolás egy helyen
              </h1>
              <p className="muted" style={{ fontSize: '1.125rem', marginBottom: '2rem', lineHeight: 1.7 }}>
                Egyetlen appban a parkolás, városkártya, jegyek és partnerkedvezmények. Gyors online ügyintézés, kevesebb sorban állás.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="mailto:hello@kaposvarplus.hu" className="btn btn-primary">
                  Kérem a demót
                </a>
                <a href="#demo" className="btn">
                  Tudj meg többet
                </a>
              </div>
            </div>
            <div>
              <Suspense fallback={<div style={{ minHeight: '400px', background: '#0F172A', borderRadius: '18px' }} />}>
                <HeroCanvas />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* B) VALUE GRID */}
      <Section title="Minden, ami a városban kell" id="features">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <ValueTile
            icon={<MapPin size={32} aria-hidden />}
            title="Olcsóbb parkolás"
            text="Rendszerhasználati díj csökkentés."
          />
          <ValueTile
            icon={<ShieldCheck size={32} aria-hidden />}
            title="Digitális Kaposvár Kártya"
            text="QR/Wallet, online hosszabbítás."
          />
          <ValueTile
            icon={<Ticket size={32} aria-hidden />}
            title="Jegyvásárlás helyi eseményekre"
            text="E-jegy és ülésrend."
          />
          <ValueTile
            icon={<Wifi size={32} aria-hidden />}
            title="Ellenőrzés offline"
            text="Aláírt pillanatkép alapján."
          />
          <ValueTile
            icon={<Gift size={32} aria-hidden />}
            title="Partnerkedvezmények"
            text="Gyors érvényesítés, naplózás."
          />
          <ValueTile
            icon={<Sparkles size={32} aria-hidden />}
            title="Szabad férőhely térképen"
            text="Oszlopadat integrációra kész."
          />
        </div>
      </Section>

      {/* C) LIVE DEMO */}
      <Section title="Élő demó" subtitle="Próbáld ki az interfészt" id="demo">
        <DemoPhone />
      </Section>

      {/* D) TÖMEGKÖZLEKEDÉS */}
      <Section
        title="Digitális buszjegy és bérlet"
        subtitle="Online vásárlás • E-bérlet a Wallettben • Ellenőrzés offline is"
        id="transport"
      >
        <TransitPass />
      </Section>

      {/* E) KAPOSVÁR PONT */}
      <Section
        title="Kaposvár Pont — Hűségprogram"
        subtitle="Pontgyűjtés vásárláskor • Beváltás jegyre, parkolásra • Havi nyereményjáték (opció)"
        id="points"
      >
        <PointsDemo />
      </Section>

      {/* F) ROI CALCULATOR */}
      <Section title="Bevétel szimulátor" subtitle="Becsült éves bevétel a rendszerhasználati díjakból" id="roi">
        <RoiCalculator />
      </Section>

      {/* G) HOGYAN INDUL A PILOT */}
      <Section title="Hogyan indul a pilot?" id="pilot">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--brand), var(--brand-2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.5rem',
              color: 'var(--ink)',
              marginBottom: '1rem'
            }}>
              1
            </div>
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>Igényfelmérés</h3>
            <p className="muted">Megbeszéljük az igényeket és a helyi sajátosságokat.</p>
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--brand), var(--brand-2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.5rem',
              color: 'var(--ink)',
              marginBottom: '1rem'
            }}>
              2
            </div>
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>Technikai bekötés</h3>
            <p className="muted">API integráció a parkolás, jegyrendszer és partnerek felé.</p>
          </div>
          <div className="card" style={{ padding: '2rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--brand), var(--brand-2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.5rem',
              color: 'var(--ink)',
              marginBottom: '1rem'
            }}>
              3
            </div>
            <h3 className="h3" style={{ marginBottom: '.5rem' }}>Indulás és riportok</h3>
            <p className="muted">Pilot launch, beta tesztelők, folyamatos analytics.</p>
          </div>
        </div>
      </Section>

      {/* H) CTA / CONTACT */}
      <Section title="Kérek egy pilot megbeszélést" id="contact">
        <div className="card" style={{ padding: '3rem', textAlign: 'center', maxWidth: '600px', marginInline: 'auto' }}>
          <p className="muted" style={{ marginBottom: '2rem', fontSize: '1.125rem' }}>
            Írj nekünk és 48 órán belül felvesszük veled a kapcsolatot.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:hello@kaposvarplus.hu" className="btn btn-primary">
              hello@kaposvarplus.hu
            </a>
            <a href="tel:+36301234567" className="btn">
              +36 30 123 4567
            </a>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #ffffff1a', marginTop: '4rem', paddingBlock: '2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', fontSize: '.875rem' }}>
            <div className="muted">© 2025 Kaposvár+ — Minden jog fenntartva</div>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#" className="muted" style={{ textDecoration: 'none' }}>Adatkezelés</a>
              <a href="#" className="muted" style={{ textDecoration: 'none' }}>Impresszum</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
