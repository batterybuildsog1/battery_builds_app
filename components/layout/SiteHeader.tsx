// components/layout/SiteHeader.tsx
import React from 'react';
import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="bg-charcoal text-white">
      <nav className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
        {/* Left side: brand or site title/logo */}
        <div className="flex items-center">
          {/* If you have a logo image: <img src="/images/logo.png" alt="Logo" className="h-8 w-auto mr-2" /> */}
          <Link href="/" className="text-xl font-bold hover:opacity-80">
            Battery Builds
          </Link>
        </div>

        {/* Right side: nav links + login button */}
        <div className="flex items-center space-x-4">
          <Link href="/about" className="hover:underline">
            About
          </Link>
          <Link href="/manual-j-calculator" className="hover:underline">
            Manual J
          </Link>
          <Link href="/dashboard" className="hover:underline">
            Dashboard
          </Link>

          {/* Login Button */}
          <Link href="/login" className="bg-primaryPurple hover:bg-secondaryPurple text-white px-4 py-2 rounded-md">
            Log In
          </Link>
        </div>
      </nav>
    </header>
  )
}
