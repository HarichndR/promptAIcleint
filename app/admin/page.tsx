'use client';

import React, { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import { adminApi } from '@/services/api';
import { Prompt } from '@/types';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';


export default function AdminHomePage() {
  const [stats, setStats] = useState<any>(null);
  const [pendingPrompts, setPendingPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, promptsRes] = await Promise.all([
        adminApi.getAdminStats(),
        adminApi.getAllPrompts('pending')
      ]);
      setStats(statsRes.data);
      setPendingPrompts(promptsRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      if (action === 'approve') {
        await adminApi.approvePrompt(id);
      } else {
        if (!confirm('Reject and delete this prompt?')) return;
        await adminApi.rejectPrompt(id);
      }
      setPendingPrompts(prev => prev.filter(p => p._id !== id));
      const statsRes = await adminApi.getAdminStats();
      setStats(statsRes.data);
    } catch (err) {
      alert(`Failed to ${action} prompt`);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="animate-reveal">
      <header className={styles.dashboardHeader}>
        <div className="flex-between">
          <div>
            <h1>Command <span style={{ color: 'var(--color-primary)' }}>Center</span></h1>
            <p style={{ color: '#64748b' }}>Platform metrics and automated system oversight.</p>
          </div>
          <div style={{ textAlign: 'right' }} className="md-hidden">
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              System Status
            </div>
            <div className="flex-row" style={{ gap: '8px', marginTop: '4px', justifyContent: 'flex-end' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Operational</span>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.stats}>
        {[
          { label: 'Total Library', value: stats?.totalPrompts || 0, color: '#3b82f6', icon: '✨' },
          { label: 'Active Curators', value: stats?.totalUsers || 0, color: '#8b5cf6', icon: '👥' },
          { label: 'Pending Moderation', value: stats?.pendingPrompts || 0, color: '#ef4444', icon: '⏳' },
          { label: 'Approval Index', value: `${Math.round(((stats?.approvedPrompts || 0) / (stats?.totalPrompts || 1)) * 100)}%`, color: '#10b981', icon: '📈' },
        ].map((stat, i) => (
          <div key={i} className={styles.statCard} style={{ borderTop: `4px solid ${stat.color}` }}>
            <div className="flex-between" style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '1.25rem' }}>{stat.icon}</span>
              <div style={{ fontSize: '0.65rem', color: stat.color, fontWeight: 800, textTransform: 'uppercase' }}>
                Live Metric
              </div>
            </div>
            <h4 style={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 500 }}>{stat.label}</h4>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a' }}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className={styles.dashboardGrid}>
        <section className={styles.pendingSection}>
          <div className="flex-between" style={{ marginBottom: 'var(--space-8)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '1.125rem' }}>
              Approval Queue
              <span style={{ fontSize: '0.75rem', background: '#fee2e2', color: '#ef4444', padding: '2px 10px', borderRadius: '20px', fontWeight: 800 }}>
                {pendingPrompts.length} Needed
              </span>
            </h3>
            <button 
              onClick={fetchData} 
              style={{ background: 'transparent', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}
            >
              Sync
            </button>
          </div>

          {pendingPrompts.length === 0 ? (
            <div style={{ padding: '60px 40px', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>☕</div>
              <p style={{ fontWeight: 600, color: '#64748b' }}>Queue is clean.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingPrompts.slice(0, 5).map(prompt => (
                <div key={prompt._id} className={styles.itemCard} style={{ padding: '16px' }}>
                  <div className={styles.itemInfo}>
                    <h5 style={{ fontSize: '1rem', marginBottom: '4px' }}>{prompt.title}</h5>
                    <div className={styles.itemMeta}>
                      <span>{prompt.author?.name}</span>
                      <span>•</span>
                      <span>{prompt.category?.name}</span>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <button 
                      className={`${styles.actionBtn} ${styles.approveBtn}`}
                      onClick={() => handleAction(prompt._id, 'approve')}
                      style={{ padding: '6px 12px' }}
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))}
              {pendingPrompts.length > 5 && (
                <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
                  <Link href='/admin/prompts?status=pending' style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
                    View Remaining {pendingPrompts.length - 5} Items →
                  </Link>
                </div>
              )}
            </div>
          )}
        </section>

        <section className={styles.pendingSection} style={{ backgroundColor: '#0f172a', color: 'white' }}>
          <h3 style={{ fontSize: '1.125rem' }}>System Performance</h3>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: 'var(--space-8)' }}>Latency and throughput monitoring.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {[
              { label: 'DB Cluster', val: '12ms', score: 98 },
              { label: 'API Edge', val: '45ms', score: 95 },
              { label: 'Storage CDN', val: 'Stable', score: 100 },
            ].map((p, i) => (
              <div key={i}>
                <div className="flex-between" style={{ marginBottom: '8px', fontSize: '0.75rem' }}>
                  <span style={{ color: '#94a3b8' }}>{p.label}</span>
                  <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>{p.val}</span>
                </div>
                <div style={{ height: '4px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${p.score}%`, background: 'var(--color-primary)' }}></div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-12)', padding: 'var(--space-6)', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
             <h4 style={{ fontSize: '0.8125rem', marginBottom: '4px' }}>Audit Log Ready</h4>
             <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.5 }}>Unauthorized access attempts will trigger an immediate identity lockout.</p>
          </div>
        </section>
      </div>
    </div>
  );
}



