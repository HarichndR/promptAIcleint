'use client';

import React, { useEffect, useState } from 'react';
import { PromptCard } from '@/components/PromptCard';
import { CategoryTabs } from '@/components/CategoryTabs';
import { useInfinitePrompts } from '@/hooks/useInfinitePrompts';
import { useSearchParams, useRouter } from 'next/navigation';
import { categoryApi } from '@/services/api';
import { Category } from '@/types';
import { useAuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { PenTool } from 'lucide-react';

export default function PromptsPageClient() {
  const router = useRouter();
  const { user } = useAuthContext();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('category') || '';

  const [categories, setCategories] = useState<Category[]>([]);
  const { prompts, isLoading, hasMore, lastElementRef, updateParams } = useInfinitePrompts();

  useEffect(() => {
    categoryApi.getCategories().then(res => setCategories(res.data));
  }, []);

  useEffect(() => {
    const query = new URLSearchParams();
    if (search) query.set('search', search);
    if (categoryId) query.set('category', categoryId);
    updateParams(query.toString());
  }, [search, categoryId, updateParams]);

  const handleCategorySelect = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
      params.set('category', id);
    } else {
      params.delete('category');
    }
    router.push(`/?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/');
  };

  return (
    <div className="animate-reveal">
      {/* 1. CURATOR HERO */}
      <section className="curator-hero site-container">
        <h1>
          Elevate your <br />
          <span style={{ color: 'var(--color-primary)' }}>AI interactions.</span>
        </h1>
        <p>
          A highly curated gallery of architectural prompts, creative frameworks, 
          and engineered logic for the next generation of creators.
        </p>
      </section>

      <div style={{ position: 'sticky', top: '76px', zIndex: 900, backgroundColor: 'rgba(252, 252, 253, 0.95)', backdropFilter: 'blur(8px)', padding: 'var(--space-4) 0', borderBottom: '1px solid var(--color-border)' }}>
         <div className="site-container">
            <CategoryTabs
              categories={categories}
              activeCategory={categoryId}
              onSelect={handleCategorySelect}
            />
         </div>
      </div>

      {user && <StickyPostButton />}

      {/* 3. GRID FEED */}
      <section className="site-container" style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
        
        {search && (
          <div className="flex-between" style={{ marginBottom: 'var(--space-8)', padding: 'var(--space-4)', backgroundColor: 'white', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
            <p style={{ margin: 0 }}>Showing results for "<span style={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>{search}</span>"</p>
            <button onClick={clearFilters} style={{ padding: '4px 12px', borderRadius: '4px', border: '1px solid var(--color-border)', backgroundColor: 'transparent', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              Clear All
            </button>
          </div>
        )}

        <div className="prompt-grid">
          {Array.from(new Set(prompts.map(p => p._id))).map((id, idx, uniqueIds) => {
            const prompt = prompts.find(p => p._id === id)!;
            const isLast = uniqueIds.length === idx + 1;
            return (
              <div key={id} ref={isLast ? lastElementRef : null}>
                <PromptCard prompt={prompt} />
              </div>
            );
          })}
        </div>


        {/* Loading State */}
        {isLoading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', opacity: 0.5, marginTop: '24px' }}>
             {[1,2,3].map(i => (
               <div key={i} style={{ height: '400px', backgroundColor: '#eee', borderRadius: '16px' }} />
             ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && prompts.length === 0 && (
          <div className="flex-center" style={{ minHeight: '400px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '4rem', marginBottom: 'var(--space-6)' }}>🔍</div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-2)' }}>No prompts found</h3>
              <p style={{ maxWidth: '400px', margin: '0 auto var(--space-8)' }}>
                Try adjusting your search terms or exploring different categories.
              </p>
              <Button variant="outline" onClick={clearFilters}>Reset Everything</Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StickyPostButton() {
  const router = useRouter();
  return (
    <button 
      onClick={() => router.push('/prompts/create')}
      className="btn-base btn-primary flex-center"
      style={{
        position: 'fixed', 
        bottom: '84px', // Adjusted to sit above MobileBottomNav (64px + 20px)
        right: '24px',
        width: '56px', height: '56px', borderRadius: '50%',
        boxShadow: '0 12px 32px rgba(37, 99, 235, 0.4)',
        zIndex: 2000, padding: 0, minWidth: 'auto'
      }}
      title="Post New Prompt"
    >
      <PenTool size={22} />
    </button>
  );
}
