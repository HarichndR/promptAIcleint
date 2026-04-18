'use client';

import React, { useState, useEffect } from 'react';
import { Prompt } from '@/types';
import { promptApi } from '@/services/api';
import { PromptCard } from '@/components/PromptCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useAuth } from '@/hooks/useAuth';
import { Bookmark, Sparkles, Compass, BookOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CollectionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      promptApi.getSavedPrompts()
        .then(({ data }) => setPrompts(data))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [user, authLoading]);
  
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?message=Sign in to view your collection');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  return (
    <div className="animate-reveal">
      <section style={{ padding: 'var(--space-16) 0 var(--space-8)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'white' }}>
        <div className="site-container">
          <div className="flex-row" style={{ gap: '12px', marginBottom: '8px' }}>
            <Bookmark size={24} className="text-primary" />
            <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>Personal Vault</span>
          </div>
          <h1 style={{ fontSize: '3rem' }}>Saved <span style={{ color: 'var(--color-primary)' }}>Library</span></h1>
          <p>Your curated collection of high-performance instructions saved from the community.</p>
        </div>
      </section>

      <div className="site-container" style={{ padding: 'var(--space-16) 0 var(--space-20)' }}>
        {/* Skeleton state */}
        {(authLoading || isLoading) ? (
          <div className="prompt-grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : prompts.length > 0 ? (
          <div className="prompt-grid">
            {prompts.map((prompt) => (
              <PromptCard key={prompt._id} prompt={prompt} />
            ))}
          </div>
        ) : (
          /* "Not Empty" Placeholder State when user has 0 saved items */
          <div className="flex-col" style={{ gap: '32px' }}>
             <div className="flex-center" style={{ padding: 'var(--space-20)', textAlign: 'center', backgroundColor: 'white', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', minHeight: '300px' }}>
              <div>
                <div style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', opacity: 0.3 }}>
                   <Bookmark size={48} strokeWidth={1} style={{ margin: '0 auto' }} />
                </div>
                <h3>Your collection is waiting for its first prompt</h3>
                <p style={{ maxWidth: '450px', margin: '12px auto 24px' }}>Save the logic and frameworks you find in the library to build your own personal engineering toolkit.</p>
                <Link href="/prompts" className="btn-base btn-primary btn-md" style={{ padding: '0 32px' }}>
                   Start Exploring
                </Link>
              </div>
            </div>

            {/* Recommendations/Guide section to ensure screen is NOT empty */}
            <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
               <div className="clean-border" style={{ padding: '24px', backgroundColor: 'white' }}>
                  <Sparkles size={24} style={{ marginBottom: '16px', color: '#f59e0b' }} />
                  <h4 style={{ marginBottom: '8px' }}>Refine your Search</h4>
                  <p style={{ fontSize: '0.875rem' }}>Use specific categories like 'Productivity' or 'Visual Arts' to find high-value prompts.</p>
               </div>
               <div className="clean-border" style={{ padding: '24px', backgroundColor: 'white' }}>
                  <Compass size={24} style={{ marginBottom: '16px', color: '#10b981' }} />
                  <h4 style={{ marginBottom: '8px' }}>Follow Creators</h4>
                  <p style={{ fontSize: '0.875rem' }}>See a prompt you like? Check out the author's other works to find similar high-quality logic.</p>
               </div>
               <div className="clean-border" style={{ padding: '24px', backgroundColor: 'white' }}>
                  <BookOpen size={24} style={{ marginBottom: '16px', color: '#3b82f6' }} />
                  <h4 style={{ marginBottom: '8px' }}>Read the Guide</h4>
                  <p style={{ fontSize: '0.875rem' }}>New to Prompt Engineering? Learn the fundamentals of structuring instructions in our guide.</p>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
