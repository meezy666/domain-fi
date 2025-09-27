'use client';

import { useState } from 'react';
import Header from './Header';
import Hero from './Hero';
import SearchSection from './SearchSection';
import DomainResults from './DomainResults';
import Features from './Features';

export default function MainLayout() {
  const [domainData, setDomainData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-neutral-950 text-white w-full">
      {/* Background */}
      <div className="fixed inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/30 via-neutral-950/50 to-neutral-900/30"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 w-full">
        {/* Hero Section */}
        <Hero />

        {/* Search Section */}
        <SearchSection onDomainData={setDomainData} />

        {/* Domain Results */}
        <DomainResults domainData={domainData} />

        {/* Features Section */}
        <Features />
      </main>
    </div>
  );
}
