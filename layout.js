import { Playfair_Display, Caveat, Inter } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin']
  variable: '--font-inter',
  display: 'swap',
  })

export const metadata = {
  title: 'A Birthday Surprise ',
  description: 'A little something just for you',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${playfair.variable} ${caveat.variable} ${inter.variable}`}
      <body className="font-sans antialiased">{children}</body>
    </html>
   )
}

    
