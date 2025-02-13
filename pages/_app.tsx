// pages/_app.tsx
import React from 'react';
import type { AppProps } from 'next/app'
import '../globals.css'   // Tailwind base
import '../theme.css'     // Optional theme classes

// If using Google Fonts, you could do something like:
// import { Inter } from 'next/font/google'
// const inter = Inter({ subsets: ['latin'] })

import { SiteHeader } from '../components/layout/SiteHeader'
import { SiteFooter } from '../components/layout/SiteFooter'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col bg-offWhite">
      <SiteHeader />
      <main className="flex-1">
        <Component {...pageProps} />
      </main>
      <SiteFooter />
    </div>
  )
}
