'use client';

import React, { useEffect, useState } from 'react';
import { Copy, Bookmark, Share2, Zap, Layers, ScrollText, Eye, Heart } from 'lucide-react';
import { Prompt } from '@/types';
import { promptApi } from '@/services/api';
import Link from 'next/link';

/* 1. SIMPLE COPY OVERLAY */
interface ActionOverlayProps {
  onCopy: () => void;
}

export const ActionOverlay: React.FC<ActionOverlayProps> = ({ onCopy }) => (
  <div className="action-overlay" style={{ top: '16px', right: '16px' }}>
    <button className="overlay-btn" onClick={onCopy} title="Copy Prompt">
      <Copy size={20} />
    </button>
  </div>
);


/* 2. SPECS GRID */
export const SpecsGrid: React.FC<{ prompt: Prompt }> = ({ prompt }) => {
  const specs = [
    { label: 'AI Model', value: prompt.model || 'Unknown', icon: <Zap size={16} /> },
    { label: 'Category', value: prompt.category.name, icon: <Layers size={16} /> },
  ];

  return (
    <div className="specs-grid animate-reveal">
      {specs.map((spec, i) => (
        <div key={i} className="spec-item" style={{ padding: '12px 16px' }}>
          <div className="flex-row" style={{ gap: '6px', marginBottom: '2px' }}>
            <span style={{ color: 'var(--color-primary)', opacity: 0.8 }}>{spec.icon}</span>
            <span className="spec-label" style={{ fontSize: '0.6rem' }}>{spec.label}</span>
          </div>
          <div className="spec-value" style={{ fontSize: '0.95rem' }}>{spec.value}</div>
        </div>
      ))}
    </div>
  );
};

/* 3. DYNAMIC DETAIL SIDEBAR */
interface DetailSidebarProps {
  prompt: Prompt;
}

export const DetailSidebar: React.FC<DetailSidebarProps> = ({ prompt }) => {
  const [related, setRelated] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch top matching prompts from same category
    promptApi.getPrompts(`category=${prompt.category._id}&limit=4`).then(res => {
      // Accessing .data.prompts because the API wraps the payload
      const prompts = res.data?.prompts || [];
      // Filter out the current prompt
      setRelated(prompts.filter(p => p._id !== prompt._id).slice(0, 3));
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch related prompts:', err);
      setLoading(false);
    });
  }, [prompt]);

  return (
    <aside className="animate-reveal" style={{ animationDelay: '0.2s' }}>
      <div className="sidebar-box">
        <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Discovery Stats</h4>
        
        <div className="meta-row">
          <div className="flex-row" style={{ gap: '8px' }}>
            <Eye size={16} className="text-secondary" />
            <span className="meta-label">Views</span>
          </div>
          <span className="meta-value">{(prompt.views || 0).toLocaleString()}</span>
        </div>

        <div className="meta-row">
          <div className="flex-row" style={{ gap: '8px' }}>
            <Heart size={16} className="text-secondary" />
            <span className="meta-label">Shares</span>
          </div>
          <span className="meta-value">{(prompt.likes || 124).toLocaleString()}</span>
        </div>

        <div className="meta-row">
          <div className="flex-row" style={{ gap: '8px' }}>
            <Bookmark size={16} className="text-secondary" />
            <span className="meta-label">Saved</span>
          </div>
          <span className="meta-value">{(prompt.saves || 42).toLocaleString()}</span>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h4 style={{ marginBottom: '16px', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Related Inspirations</h4>
        <div className="flex-col" style={{ gap: '12px' }}>
           {loading ? (
             [1,2].map(i => <div key={i} style={{ width: '100%', height: '80px', borderRadius: '8px', backgroundColor: '#f1f5f9' }} className="animate-pulse" />)
           ) : related.length > 0 ? (
             related.map(p => (
               <Link href={`/prompts/${p._id}`} key={p._id} className="clean-border flex-row" style={{ padding: '8px', background: 'white', gap: '12px', textDecoration: 'none' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={p.imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={p.title} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.8125rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-text-primary)' }}>{p.title}</p>
                    <div className="flex-row" style={{ gap: '6px', marginTop: '4px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', overflow: 'hidden' }}>
                        <img 
                          src={p.author?.avatar || `https://ui-avatars.com/api/?name=${p.author?.name || 'User'}&background=random&color=fff`} 
                          alt={p.author?.name} 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>{p.author.name}</p>
                    </div>
                  </div>
               </Link>
             ))
           ) : (
             <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>No similar prompts yet.</p>
           )}
        </div>
        <Link href="/prompts" className="btn-base btn-outline btn-sm" style={{ width: '100%', marginTop: '16px', display: 'flex', justifyContent: 'center' }}>
          Explore Full Collection
        </Link>
      </div>
    </aside>
  );
};
/* 4. AUTHOR SPOTLIGHT (Laptop density filler) */
export const AuthorSpotlight: React.FC<{ author: any }> = ({ author }) => (
  <div className="sidebar-box spotlight" style={{ borderLeft: '4px solid var(--color-primary)', background: 'var(--color-primary-soft)' }}>
    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px', color: 'var(--color-primary)' }}>Featured Creator</h4>
    <div className="flex-row" style={{ gap: '12px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid white' }}>
        <img src={author?.avatar || `https://ui-avatars.com/api/?name=${author?.name || 'User'}&background=random`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={author?.name} />
      </div>
      <div>
        <p style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text-primary)' }}>{author?.name}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>Elite Creator</p>
      </div>
    </div>
    <div style={{ marginTop: '16px', fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--color-text-primary)', opacity: 0.8 }}>
      {author?.bio || "Expert prompt engineer specializing in high-precision AI generation and professional workflows. Discovering new boundaries of creative automation."}
    </div>
  </div>
);
