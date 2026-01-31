import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kaposvár+ — városi szuperapp',
  description: 'Egyetlen appban a parkolás, városkártya, jegyek és partnerkedvezmények. Gyors online ügyintézés, kevesebb sorban állás.',
  openGraph: {
    title: 'Kaposvár+ — városi szuperapp',
    description: 'Parkolás, városkártya, jegyek és kedvezmények egy helyen.',
    locale: 'hu_HU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaposvár+ — városi szuperapp',
    description: 'Parkolás, városkártya, jegyek és kedvezmények egy helyen.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  )
}
