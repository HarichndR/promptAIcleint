'use client';

import React from 'react';
import { Prompt } from '@/types';
import { PromptCard } from '@/components/PromptCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { Bookmark, Sparkles, Compass, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface SavedPromptsGridProps {
  prompts: Prompt[];
  isLoading: boolean;
  isAuthLoading: boolean;
  variant?: 'public' | 'admin';
  renderExtraActions?: (prompt: Prompt) => React.ReactNode;
}

export const SavedPromptsGrid = ({ 
  prompts, 
  isLoading, 
  isAuthLoading, 
  variant = 'public',
  renderExtraActions 
}: SavedPromptsGridProps) => {
  const isAdmin = variant === 'admin';

  // Skeleton state
  if (isAuthLoading || isLoading) {
    return (
      <div className="prompt-grid">
        {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  // Loaded state with content
  if (prompts.length > 0) {
    return (
      <div className="prompt-grid">
        {prompts.map((prompt) => (
          <div key={prompt._id} style={{ position: 'relative' }}>
             {renderExtraActions && renderExtraActions(prompt)}
             <PromptCard prompt={prompt} />
          </div>
        ))}
      </div>
    );
  }

  // Empty State / Placeholder
  return (
    <div className="flex-col" style={{ gap: '32px' }}>
      <div className="flex-center" style={{ 
        padding: 'var(--space-20)', 
        textAlign: 'center', 
        backgroundColor: isAdmin ? 'var(--color-admin-surface)' : 'white', 
        border: isAdmin ? '1px dashed var(--color-admin-border)' : '1px dashed var(--color-border)', 
        borderRadius: 'var(--radius-lg)', 
        minHeight: '300px' 
      }}>
        <div>
          <div style={{ color: isAdmin ? 'var(--color-admin-accent)' : 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', opacity: 0.3 }}>
            <Bookmark size={48} strokeWidth={1} style={{ margin: '0 auto' }} />
          </div>
          <h3 style={{ color: isAdmin ? 'var(--color-admin-text)' : 'inherit' }}>Your collection is waiting for its first prompt</h3>
          <p style={{ maxWidth: '450px', margin: '12px auto 24px', color: isAdmin ? 'var(--color-text-secondary)' : 'inherit' }}>Save the logic and frameworks you find in the library to build your own personal engineering toolkit.</p>
          <Link href="/prompts" className={isAdmin ? "btn-base btn-outline btn-md" : "btn-base btn-primary btn-md"} style={{ padding: '0 32px' }}>
            Start Exploring
          </Link>
        </div>
      </div>

      {/* Recommendations Utility */}
      <div className="grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        <div className="clean-border" style={{ padding: '24px', backgroundColor: isAdmin ? 'var(--color-admin-surface)' : 'white' }}>
          <Sparkles size={18} style={{ marginBottom: '16px', color: '#f59e0b' }} />
          <h4 style={{ marginBottom: '8px', fontSize: '1rem', color: isAdmin ? 'var(--color-admin-text)' : 'inherit' }}>Refine your Search</h4>
          <p style={{ fontSize: '0.875rem', color: isAdmin ? 'var(--color-text-secondary)' : 'inherit' }}>Use specific categories like 'Productivity' to find high-value prompts.</p>
        </div>
        <div className="clean-border" style={{ padding: '24px', backgroundColor: isAdmin ? 'var(--color-admin-surface)' : 'white' }}>
          <Compass size={18} style={{ marginBottom: '16px', color: '#10b981' }} />
          <h4 style={{ marginBottom: '8px', fontSize: '1rem', color: isAdmin ? 'var(--color-admin-text)' : 'inherit' }}>Follow Creators</h4>
          <p style={{ fontSize: '0.875rem', color: isAdmin ? 'var(--color-text-secondary)' : 'inherit' }}>Check out an author's other works to find similar high-quality logic.</p>
        </div>
        <div className="clean-border" style={{ padding: '24px', backgroundColor: isAdmin ? 'var(--color-admin-surface)' : 'white' }}>
          <BookOpen size={18} style={{ marginBottom: '16px', color: '#3b82f6' }} />
          <h4 style={{ marginBottom: '8px', fontSize: '1rem', color: isAdmin ? 'var(--color-admin-text)' : 'inherit' }}>Read the Guide</h4>
          <p style={{ fontSize: '0.875rem', color: isAdmin ? 'var(--color-text-secondary)' : 'inherit' }}>Learn the fundamentals of structuring instructions in our guide.</p>
        </div>
      </div>
    </div>
  );
};
