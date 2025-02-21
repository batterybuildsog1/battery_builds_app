// src/components/site-header/index.tsx
import React from 'react';
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="bg-charcoal text-white">
      <nav className="mx-auto flex max-w-screen-xl items-center justify-between p-4">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold hover:opacity-80">
            Battery Builds
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/about" className="hover:underline">About</Link>
          <Link href="/manual-j-calculator" className="hover:underline">Manual J</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/login" className="bg-primaryPurple hover:bg-secondaryPurple text-white px-4 py-2 rounded-md">Log In</Link>
        </div>
      </nav>
    </header>
  );
}