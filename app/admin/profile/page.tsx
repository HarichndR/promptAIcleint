'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { authApi } from '@/services/api';
import styles from '@/app/admin/Admin.module.css';
import { ShieldCheck, Mail, Calendar, Key, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function AdminProfilePage() {
  const { user, setUser } = useAuthContext();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
    }
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      
      const res = await authApi.updateProfile(formData);
      if (res.success) {
        setUser(res.data.user);
        setMessage({ type: 'success', text: 'Identity synchronized successfully!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Update failed' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="animate-reveal">
      <header className={styles.dashboardHeader}>
        <h1 style={{ color: 'var(--color-admin-text)' }}>IDENTITY & <span style={{ color: 'var(--color-admin-accent)' }}>AUTHORITY</span></h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Manage your administrative profile and system permissions.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 0.8fr) minmax(0, 1.2fr)', gap: 'var(--space-8)' }} className="mobile-grid-1">
        <aside>
          <div className={styles.pendingSection} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
            <div style={{ 
              width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'var(--color-admin-accent-glow)', 
              margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2.5rem', fontWeight: 900, color: 'var(--color-admin-accent)', border: '4px solid var(--color-admin-surface)', boxShadow: 'var(--shadow-lg)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3 style={{ color: 'var(--color-admin-text)', fontSize: '1.25rem' }}>{user.name}</h3>
            <div style={{ 
              marginTop: '8px', padding: '4px 12px', background: 'var(--color-admin-accent)', 
              color: 'white', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 900, 
              display: 'inline-block', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              Platform Administrator
            </div>
            
            <div style={{ marginTop: 'var(--space-10)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="flex-row" style={{ gap: '12px', fontSize: '0.85rem' }}>
                <Mail size={16} color="var(--color-admin-accent)" />
                <span style={{ color: 'var(--color-text-secondary)' }}>{user.email}</span>
              </div>
              <div className="flex-row" style={{ gap: '12px', fontSize: '0.85rem' }}>
                <Calendar size={16} color="var(--color-text-secondary)" />
                <span style={{ color: 'var(--color-text-secondary)' }}>
                  Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Alpha Session'}
                </span>
              </div>
              <div className="flex-row" style={{ gap: '12px', fontSize: '0.85rem' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span style={{ color: '#10b981', fontWeight: 700 }}>Root Authority Level</span>
              </div>
            </div>
          </div>

          <div className={styles.pendingSection} style={{ marginTop: 'var(--space-6)', border: '1px dashed var(--color-admin-border)' }}>
             <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--color-admin-text)', fontWeight: 800 }}>
               <Key size={14} /> SECURITY STATUS
             </h4>
             <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '8px', lineHeight: 1.5 }}>Two-factor authentication is recommended for all root accounts.</p>
             <button style={{ 
               background: 'none', border: 'none', fontSize: '0.75rem', padding: 0, marginTop: '12px', 
               color: 'var(--color-admin-accent)', fontWeight: 700, cursor: 'pointer'  
             }}>
               Manage Credentials →
             </button>
          </div>
        </aside>

        <section className={styles.pendingSection}>
           <h3 style={{ marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.125rem', color: 'var(--color-admin-text)' }}>
             <UserCircle size={20} color="var(--color-admin-accent)" /> Personal Configuration
           </h3>

           <form onSubmit={handleUpdate}>
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>Administrative Alias</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ background: 'var(--color-admin-pill)', border: '1px solid var(--color-admin-border)', padding: '12px 16px', color: 'var(--color-admin-text)' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '10px' }}>Professional Bio</label>
                <textarea 
                  className="form-textarea"
                  rows={6}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ background: 'var(--color-admin-pill)', border: '1px solid var(--color-admin-border)', padding: '16px', color: 'var(--color-admin-text)', resize: 'none' }}
                />
              </div>

              {message.text && (
                <div style={{ 
                  padding: '16px', borderRadius: '12px', marginBottom: '24px',
                  backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                  color: message.type === 'success' ? '#10b981' : '#ef4444',
                  fontSize: '0.8125rem', fontWeight: 700, border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}`
                }}>
                  {message.text}
                </div>
              )}

              <Button type="submit" disabled={isUpdating} style={{ height: '48px', padding: '0 32px', borderRadius: '12px' }}>
                {isUpdating ? 'Synchronizing...' : 'Update Identity'}
              </Button>
           </form>
        </section>
      </div>
    </div>
  );
}
