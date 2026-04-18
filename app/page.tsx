'use client';

import React, { Suspense } from 'react';
import PromptsPageClient from './prompts/PromptsPageClient';

export default function RootPage() {
  return (
    <Suspense fallback={
      <div className="site-container flex-center" style={{ minHeight: '60vh' }}>
        <div className="loader"></div>
        <p style={{ fontWeight: 600, color: 'var(--color-text-secondary)', marginLeft: '12px' }}>Loading the discovery feed...</p>
      </div>
    }>
      <PromptsPageClient />
    </Suspense>
  );
}
