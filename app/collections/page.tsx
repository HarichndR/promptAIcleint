'use client';

import React, { useState, useEffect } from 'react';
import { Prompt } from '@/types';
import { promptApi } from '@/services/api';
import { PromptCard } from '@/components/PromptCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { useAuth } from '@/hooks/useAuth';
import { Bookmark, Sparkles, Compass, BookOpen } from 'lucide-react';
import { StickyAddButton } from '@/components/ui/StickyAddButton';
import { SavedPromptsGrid } from '@/components/SavedPromptsGrid';
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
    <React.Fragment>
      <StickyAddButton />
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
        <SavedPromptsGrid 
          prompts={prompts} 
          isLoading={isLoading} 
          isAuthLoading={authLoading} 
        />
      </div>
    </div>
    </React.Fragment>
  );
}

