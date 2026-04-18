'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Prompt } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { CommentDrawer } from './CommentDrawer';
import { Button } from './ui/Button';
import { ChevronRight, MessageSquare, Heart, Bookmark, Share2 } from 'lucide-react';
import { ActionOverlay, SpecsGrid, DetailSidebar, AuthorSpotlight } from './DetailSubComponents';
import { promptApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { LikeButton } from './LikeButton';
import { SaveButton } from './SaveButton';

interface PromptDetailClientProps {
  prompt: Prompt;
}

export default function PromptDetailClient({ prompt }: PromptDetailClientProps) {
  const { requireAuth } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCommentDrawerOpen, setIsCommentDrawerOpen] = useState(false);

  // ACTION HANDLERS
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.promptText);
    alert('Prompt copied to clipboard!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: prompt.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard');
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', paddingBottom: '120px' }}>
      <div className="animate-reveal">
        <div className="site-container">
          {/* 1. TITLE SECTION (Above Image) */}
          <header style={{ padding: 'var(--space-12) 0 var(--space-8)' }}>
             <div className="flex-row" style={{ gap: '12px', marginBottom: '16px' }}>
                <span style={{ backgroundColor: 'var(--color-primary-soft)', color: 'var(--color-primary)', padding: '4px 12px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  Premium Prompt
                </span>
                <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                  {prompt.category.name.toUpperCase()}
                </span>
             </div>
             <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
               {prompt.title}
             </h1>
          </header>

          {/* 2. IMAGE SECTION */}
          <div style={{ position: 'relative', width: '100%', height: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', marginBottom: '40px' }}>
            <Image 
              src={prompt.imageUrl} 
              alt={prompt.title} 
              fill
              style={{ objectFit: 'cover' }}
              priority
            />
            {/* RESULT LABEL */}
            <div style={{ 
              position: 'absolute', top: '24px', left: '24px', 
              backgroundColor: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(8px)',
              padding: '6px 16px', borderRadius: '8px', 
              fontSize: '0.75rem', fontWeight: 900, color: 'var(--color-primary)', 
              letterSpacing: '0.1em', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}>
              RESULT
            </div>
          </div>

          {/* 3. MAIN GRID */}
          <div className="detail-grid">
            <main>
              {/* PROMPT BOX */}
              <div className="prompt-card-box">
                <div className="flex-row" style={{ marginBottom: '20px', gap: '8px' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.1em' }}>Prompt Instructions</span>
                </div>
                
                <ActionOverlay onCopy={handleCopy} />

                <div 
                  className={isExpanded ? 'animate-reveal' : 'prompt-collapsed-preview'}
                  onDoubleClick={() => setIsExpanded(!isExpanded)}
                  style={{ cursor: 'pointer', transition: 'all 0.4s ease', position: 'relative' }}
                  title="Double-click to toggle view"
                >
                  <MarkdownRenderer content={prompt.promptText} />
                  {!isExpanded && (
                    <div style={{ 
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: '40px', 
                      background: 'linear-gradient(transparent, #ffffff)', pointerEvents: 'none' 
                    }} />
                  )}
                </div>


                {prompt.promptText.length > 50 && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                    className="flex-row"
                    style={{ marginTop: '16px', color: 'var(--color-primary)', fontWeight: 800, background: 'none', border: 'none', cursor: 'pointer', gap: '4px', fontSize: '0.9rem' }}
                  >
                    {isExpanded ? 'Read Less' : 'Read Full Prompt'} <ChevronRight size={18} style={{ transform: isExpanded ? 'rotate(-90deg)' : 'none', transition: 'transform 0.3s ease' }} />
                  </button>
                )}
              </div>

              {/* DESCRIPTION & SPECS */}
              <section style={{ marginTop: '48px' }}>
                <div className="grid-2">
                    <div>
                      <h4 className="spec-label" style={{ marginBottom: '16px' }}>Technical Logic</h4>
                      <div className="markdown-container" style={{ 
                        maxHeight: isExpanded ? 'none' : '200px', 
                        overflow: 'hidden', 
                        position: 'relative',
                        transition: 'max-height 0.4s ease'
                      }}>
                        <MarkdownRenderer content={prompt.description} />
                        {!isExpanded && prompt.description.length > 300 && (
                          <div style={{ 
                            position: 'absolute', bottom: 0, left: 0, right: 0, height: '60px', 
                            background: 'linear-gradient(transparent, white)', pointerEvents: 'none' 
                          }} />
                        )}
                      </div>
                      {prompt.description.length > 300 && (
                        <button 
                          onClick={() => setIsExpanded(!isExpanded)}
                          style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', marginTop: '12px' }}
                        >
                          {isExpanded ? 'Show less' : 'Read more'}
                        </button>
                      )}
                    </div>
                   <div>
                      <h4 className="spec-label" style={{ marginBottom: '16px' }}>Prompt Engineering Specs</h4>
                      <SpecsGrid prompt={prompt} />
                      
                      <div style={{ marginTop: '32px' }} className="cleanup-border p-6 bg-white rounded-xl">
                        <h4 className="spec-label" style={{ marginBottom: '12px', fontSize: '0.8rem' }}>🔥 Pro Tips</h4>
                        <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', lineHeight: 1.8, color: 'var(--color-text-secondary)' }}>
                          <li>Use <strong>Temperature 0.7</strong> for optimal creative balance.</li>
                          <li>Append "--v 6" if using Midjourney for high-fidelity.</li>
                          <li>Works best with clean, 1-sentence context priming.</li>
                        </ul>
                      </div>
                   </div>
                </div>

                {/* USAGE EXAMPLES (Laptop filler) */}
                <div style={{ marginTop: '64px', padding: '40px', background: 'var(--color-bg)', borderRadius: '24px', border: '1px dashed var(--color-border)' }}>
                   <div className="flex-between" style={{ marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Usage Scenarios</h3>
                      <span className="badge">3 Verified use cases</span>
                   </div>
                   <div className="grid-3" style={{ gap: '24px' }}>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                         <p style={{ fontWeight: 800, marginBottom: '8px', fontSize: '0.9rem' }}>Fast Prototyping</p>
                         <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Perfect for initial wireframes and visual brain-storming sessions.</p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                         <p style={{ fontWeight: 800, marginBottom: '8px', fontSize: '0.9rem' }}>Content Marketing</p>
                         <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Generated high-conversion assets for over 12 successful campaigns.</p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm">
                         <p style={{ fontWeight: 800, marginBottom: '8px', fontSize: '0.9rem' }}>Product Design</p>
                         <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Used by our internal design team for iterative UI component testing.</p>
                      </div>
                   </div>
                </div>
              </section>
            </main>

            <aside style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
              <AuthorSpotlight author={prompt.author} />
              <div style={{ marginTop: '24px' }}>
                <DetailSidebar prompt={prompt} />
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR - OUTSIDE ANIMATED CONTAINER */}
      <div className="detail-sticky-bar">
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <LikeButton promptId={prompt._id} initialLikes={prompt.likes} initialIsLiked={prompt.isLiked} />
          <button onClick={() => setIsCommentDrawerOpen(true)} className="action-btn" title="Comments">
             <MessageSquare size={20} />
          </button>
          <SaveButton promptId={prompt._id} initialIsSaved={prompt.isSaved} />
        </div>
        <button onClick={handleShare} className="action-btn" title="Share Prompt" style={{ color: 'var(--color-primary)' }}>
          <Share2 size={24} />
        </button>

      </div>

      <CommentDrawer 
        isOpen={isCommentDrawerOpen} 
        onClose={() => setIsCommentDrawerOpen(false)} 
        promptId={prompt._id} 
      />
    </div>
  );
}
