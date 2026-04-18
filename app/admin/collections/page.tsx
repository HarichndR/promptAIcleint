'use client';

import React, { useState, useEffect } from 'react';
import { Prompt } from '@/types';
import { promptApi } from '@/services/api';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { SavedPromptsGrid } from '@/components/SavedPromptsGrid';
import styles from '../Admin.module.css';

export default function AdminCollectionsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthContext();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      promptApi.getSavedPrompts()
        .then(({ data }) => setPrompts(data))
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  if (authLoading || !user || user.role !== 'admin') return null;

  return (
    <div className="animate-reveal">
      <header className={styles.dashboardHeader}>
        <div className="flex-row" style={{ gap: '12px', marginBottom: '8px' }}>
          <Bookmark size={20} style={{ color: 'var(--color-admin-accent)' }} />
          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>Personal Curation</span>
        </div>
        <h1>My <span style={{ color: 'var(--color-admin-accent)' }}>Collection</span></h1>
        <p>Your private repository of world-class architectural logic and prompts.</p>
      </header>

      <section style={{ marginTop: 'var(--space-10)' }}>
        <SavedPromptsGrid 
          prompts={prompts} 
          isLoading={isLoading} 
          isAuthLoading={authLoading} 
          variant="admin"
        />
      </section>
    </div>
  );
}
