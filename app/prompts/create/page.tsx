'use client';

import React from 'react';
import { PromptForm } from '@/components/PromptForm';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';

export default function CreatePromptPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login?message=Sign in to share your prompt');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;
  return (
    <div className="site-container animate-reveal" style={{ padding: 'var(--space-16) 0' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ marginBottom: 'var(--space-10)', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>Share Your Prompt</h1>
          <p>Help others unlock the full power of AI by contributing your best-tested sequences.</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-premium)' }}>
           <PromptForm />
        </div>
      </div>
    </div>
  );
}
