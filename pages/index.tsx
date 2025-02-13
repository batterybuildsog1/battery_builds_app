// pages/index.tsx
import React from 'react';
import Head from 'next/head'

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Battery Builds - Home</title>
        <meta name="description" content="Battery Builds Home Page" />
      </Head>

      <section className="mx-auto max-w-screen-xl py-8 px-4">
        <h1 className="site-title text-accent">
          Welcome to Battery Builds
        </h1>
        <p className="mt-4 text-gray-700">
          This is our home page. Explore the site or log in to manage your projects.
        </p>
      </section>
    </>
  )
}
