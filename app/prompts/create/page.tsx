import React from 'react';
import { PromptForm } from '@/components/PromptForm';

export default function CreatePromptPage() {
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
