'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Prompt } from '../types';
import { useAuth } from '../hooks/useAuth';
import { promptApi } from '../services/api';
import { CommentDrawer } from './CommentDrawer';
import { Heart, Share2, Bookmark, ArrowRight } from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const { requireAuth } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Helper to strip markdown for preview
  const stripMarkdown = (text: string) => {
    return text
      .replace(/[#*`_~]/g, '') // Remove simple markdown symbols
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Flatten links [text](url) -> text
      .replace(/!\[[^\]]+\]\([^)]+\)/g, '') // Remove images
      .trim();
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(async () => {
      await promptApi.toggleLike(prompt._id);
    });
  };

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    requireAuth(async () => {
      await promptApi.toggleSave(prompt._id);
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: prompt.title,
        url: `${window.location.origin}/prompts/${prompt._id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/prompts/${prompt._id}`);
      alert('Link copied to clipboard');
    }
  };

  return (
    <>
      <div className="prompt-card reveal-up">
        {/* IMAGE TOP SECTION */}
        <Link href={`/prompts/${prompt._id}`} className="card-img-wrapper" style={{ borderBottom: 'none' }}>
           <Image 
            src={prompt.imageUrl} 
            alt={prompt.title} 
            fill
            className="card-img"
            style={{ borderRadius: '12px 12px 0 0' }}
          />
          {/* FLOATING CATEGORY TAG */}
          <div style={{ 
            position: 'absolute', top: '16px', left: '16px', 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '4px 12px', 
            borderRadius: '99px', fontSize: '0.7rem', fontWeight: 800, 
            color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.05em',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            {prompt.category.name}
          </div>
        </Link>

        {/* CONTENT BOTTOM SECTION */}
        <div className="card-content">
          <Link href={`/prompts/${prompt._id}`} style={{ textDecoration: 'none' }}>
            {/* AUTHOR */}
            <div className="flex-row" style={{ gap: '8px', marginBottom: '16px' }}>
              <div style={{ 
                width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#f1f5f9',
                overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 800, border: '1.5px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flexShrink: 0
              }}>
                <img 
                  src={prompt.author?.avatar || `https://ui-avatars.com/api/?name=${prompt.author?.name || 'User'}&background=random&color=fff`} 
                  alt={prompt.author?.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                {prompt.author?.name}
              </span>
            </div>

            <h3 className="card-title">{prompt.title}</h3>
            
            <p className="card-desc" style={{ marginBottom: '24px', opacity: 0.8 }}>
              {stripMarkdown(prompt.description)}
            </p>
          </Link>

          <footer style={{ 
            marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-bg)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between'
          }}>
             <div className="flex-row" style={{ gap: '16px' }}>
                <button onClick={handleLike} className="flex-row" style={{ background: 'none', border: 'none', gap: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                  <Heart size={16} /> {(prompt.likes || 0) > 1000 ? `${(prompt.likes/1000).toFixed(1)}k` : prompt.likes}
                </button>
                <button onClick={handleShare} className="flex-row" style={{ background: 'none', border: 'none', gap: '4px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
                  <Share2 size={16} /> Share
                </button>
                <button onClick={handleSave} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, fontSize: '0.85rem' }}>
                   <Bookmark size={18} /> Save
                </button>
             </div>

             <div className="flex-row">
                <Link href={`/prompts/${prompt._id}`} className="flex-row" style={{ 
                  color: 'var(--color-primary)', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none', gap: '4px'
                }}>
                  View Prompt <ArrowRight size={16} />
                </Link>
             </div>
          </footer>
        </div>
      </div>

      <CommentDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        promptId={prompt._id} 
      />
    </>
  );
};
