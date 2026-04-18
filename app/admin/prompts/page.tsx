'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Prompt } from '@/types';
import { adminApi, promptApi } from '@/services/api';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../Admin.module.css';



export default function AdminPromptsPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'ecosystem' | 'queue' | 'mine'>('queue');
  
  // Data State
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fitler & Sort State
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) router.push('/');
  }, [user, loading, router]);

  const fetchPrompts = useCallback(async () => {
    setIsLoading(true);
    try {
      let data;
      if (activeTab === 'mine') {
        const res = await promptApi.getMyPrompts(sort);
        data = res.data;
      } else {
        const status = activeTab === 'queue' ? 'pending' : '';
        const res = await adminApi.getAllPrompts(status, search, sort);
        data = res.data;
      }
      setPrompts(data);
    } catch (err) {
      console.error('Failed to fetch prompts', err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, search, sort]);

  useEffect(() => { 
    const timer = setTimeout(() => fetchPrompts(), 300); // Debounce search
    return () => clearTimeout(timer);
  }, [fetchPrompts]);

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      if (action === 'approve') {
        await adminApi.approvePrompt(id);
      } else if (action === 'reject') {
        if (!confirm('Reject and delete?')) return;
        await adminApi.rejectPrompt(id);
      } else {
        if (!confirm('Permanently delete?')) return;
        await adminApi.deletePrompt(id);
      }
      fetchPrompts();
    } catch (err) {
      alert('Action failed');
    }
  };

  if (loading || !user) return null;

  return (
    <div className="animate-reveal">
      <header className={styles.dashboardHeader}>
        <div className="flex-between">
          <div>
            <h1>Prompts <span style={{ color: 'var(--color-admin-accent)' }}>Engine</span></h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Administer the platform's architectural prompt library.</p>
          </div>
          <Link href="/prompts/create" className={styles.fabBtn} style={{ margin: 0 }}>
            + Prompt
          </Link>
        </div>
      </header>

      {/* TABS CONTROL - Mobile Optimized Sliding Nav */}
      <div style={{ 
        position: 'relative', 
        marginBottom: 'var(--space-8)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'row',
          gap: 'var(--space-2)', 
          overflowX: 'auto',
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          paddingBottom: '2px'
        }} className="no-scrollbar">
          {[
            { id: 'queue', label: 'Moderation Queue', icon: '⏳' },
            { id: 'ecosystem', label: 'Full Library', icon: '🌐' },
            { id: 'mine', label: 'My Submissions', icon: '👤' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-admin-accent)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--color-admin-accent)' : 'var(--color-text-secondary)',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.8125rem',
                whiteSpace: 'nowrap'
              }}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>
        
        {/* Visual Fade Indicator for scroll */}
        <div style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: '40px',
          background: 'linear-gradient(to right, transparent, var(--color-admin-bg))',
          pointerEvents: 'none',
          opacity: 0.8
        }} />
      </div>

      {/* ADVANCED FILTERS */}
      <div className="flex-between" style={{ marginBottom: 'var(--space-8)', gap: '20px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
          <span style={{ position: 'absolute', left: '14px', top: '11px', opacity: 0.4 }}>🔍</span>
        </div>
        
        <div className="flex-row" style={{ gap: '12px' }}>
          <select 
            className="form-select" 
            style={{ width: '150px', marginBottom: 0, border: '1px solid var(--color-admin-border)', backgroundColor: 'var(--color-admin-surface)' }}
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title">Title (A-Z)</option>
          </select>
        </div>
      </div>

      {/* DATA GRID */}
      {isLoading ? (
        <div className={styles.loadingOverlay}>
          <div className="loader"></div>
        </div>
      ) : prompts.length === 0 ? (
        <div style={{ padding: '80px 40px', textAlign: 'center', backgroundColor: 'var(--color-admin-surface)', borderRadius: '24px', border: '1px dashed var(--color-admin-border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>Empty</div>
          <p style={{ color: 'var(--color-text-secondary)' }}>No data matching filters.</p>
        </div>
      ) : (
        <div style={{ 
          backgroundColor: 'var(--color-admin-surface)', 
          borderRadius: '24px', 
          border: '1px solid var(--color-admin-border)', 
          overflowX: 'auto', 
          boxShadow: 'var(--shadow-sm)',
          width: '100%' 
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: 'var(--color-admin-pill)', borderBottom: '1px solid var(--color-admin-border)' }}>
                <th style={{ padding: '16px 20px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.1em' }}>Prompt Title</th>
                <th style={{ padding: '16px 20px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.1em' }}>Author</th>
                <th style={{ padding: '16px 20px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.1em' }}>Status</th>
                <th style={{ padding: '16px 20px', fontSize: '0.7rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.1em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--color-admin-border)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 800 }}>
                    <Link href={`/prompts/${p._id}`} style={{ color: 'var(--color-admin-text)', textDecoration: 'none', fontSize: '0.875rem' }}>
                      {p.title}
                    </Link>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--color-text-secondary)', fontSize: '0.8125rem' }}>{typeof p.author === 'object' ? p.author.name : 'Unknown'}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span className={`badge badge-${p.status}`} style={{ textTransform: 'capitalize', fontSize: '0.7rem' }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'nowrap' }}>
                      {p.status === 'pending' && (
                        <button 
                          className={`${styles.actionBtn} ${styles.approveBtn}`}
                          onClick={() => handleAction(p._id, 'approve')}
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          Approve
                        </button>
                      )}
                      <button 
                         className={`${styles.actionBtn} ${styles.rejectBtn}`}
                         onClick={() => handleAction(p._id, activeTab === 'queue' ? 'reject' : 'delete')}
                         style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                      >
                        {activeTab === 'queue' ? 'Reject' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

