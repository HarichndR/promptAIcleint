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
            <h1>Prompts <span style={{ color: 'var(--color-primary)' }}>Engine</span></h1>
            <p>Administer the platform's architectural prompt library.</p>
          </div>
          <Link href="/prompts/create" className={styles.fabBtn} style={{ margin: 0 }}>
            + Prompt
          </Link>
        </div>
      </header>

      {/* TABS CONTROL */}
      <div className="flex-row" style={{ gap: 'var(--space-8)', borderBottom: '1px solid var(--color-border)', marginBottom: 'var(--space-8)' }}>
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
              borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.9375rem'
            }}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
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
            style={{ width: '150px', marginBottom: 0 }}
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
        <div style={{ padding: '80px 40px', textAlign: 'center', backgroundColor: 'white', borderRadius: '24px', border: '1px dashed var(--color-border)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>Empty</div>
          <p style={{ color: '#64748b' }}>No data matching filters.</p>
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid var(--color-border)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ textAlign: 'left', backgroundColor: '#f8fafc', borderBottom: '1px solid var(--color-border)' }}>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Prompt Title</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Author</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map(p => (
                <tr key={p._id} className={styles.itemCard} style={{ display: 'table-row' }}>
                  <td style={{ padding: '20px 24px', fontWeight: 700 }}>
                    <Link href={`/prompts/${p._id}`} style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                      {p.title}
                    </Link>
                  </td>
                  <td style={{ padding: '20px 24px', color: '#64748b', fontSize: '0.875rem' }}>{typeof p.author === 'object' ? p.author.name : 'Unknown'}</td>
                  <td style={{ padding: '20px 24px' }}>
                    <span className={`badge badge-${p.status}`} style={{ textTransform: 'capitalize' }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '20px 24px' }}>
                    <div className="flex-row" style={{ gap: '8px' }}>
                      {p.status === 'pending' && (
                        <button 
                          className={`${styles.actionBtn} ${styles.approveBtn}`}
                          onClick={() => handleAction(p._id, 'approve')}
                        >
                          Approve
                        </button>
                      )}
                      <button 
                         className={`${styles.actionBtn} ${styles.rejectBtn}`}
                         onClick={() => handleAction(p._id, activeTab === 'queue' ? 'reject' : 'delete')}
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

