// src/components/site-footer/index.tsx
import React from 'react';

export function SiteFooter() {
  return (
    <footer className="bg-charcoal text-white mt-4">
      <div className="mx-auto max-w-screen-xl py-4 px-4 text-sm flex justify-between items-center">
        <p className="opacity-70">© {new Date().getFullYear()} Battery Builds. All rights reserved.</p>
        <p className="opacity-70">Powered by Next.js & Supabase</p>
      </div>
    </footer>
  );
}