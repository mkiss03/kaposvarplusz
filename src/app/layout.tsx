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
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Sora:wght@400;600;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
