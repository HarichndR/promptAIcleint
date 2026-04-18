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
        <h1>Identity & <span style={{ color: 'var(--color-primary)' }}>Authority</span></h1>
        <p>Manage your administrative profile and system permissions.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: 'var(--space-10)' }} className="mobile-grid-1">
        <aside>
          <div className={styles.pendingSection} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
            <div style={{ 
              width: '120px', height: '120px', borderRadius: '50%', backgroundColor: 'var(--color-primary-soft)', 
              margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem', fontWeight: 900, color: 'var(--color-primary)', border: '4px solid white', boxShadow: 'var(--shadow-lg)'
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h3>{user.name}</h3>
            <div className={`badge badge-admin`} style={{ marginTop: '8px' }}>Platform Administrator</div>
            
            <div style={{ marginTop: 'var(--space-8)', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="flex-row" style={{ gap: '12px', fontSize: '0.875rem' }}>
                <Mail size={16} color="#94a3b8" />
                <span style={{ color: '#64748b' }}>{user.email}</span>
              </div>
              <div className="flex-row" style={{ gap: '12px', fontSize: '0.875rem' }}>
                <Calendar size={16} color="#94a3b8" />
                <span style={{ color: '#64748b' }}>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex-row" style={{ gap: '12px', fontSize: '0.875rem' }}>
                <ShieldCheck size={16} color="#10b981" />
                <span style={{ color: '#10b981', fontWeight: 600 }}>Root Authority Level</span>
              </div>
            </div>
          </div>

          <div className={styles.pendingSection} style={{ marginTop: 'var(--space-6)', backgroundColor: '#f8fafc' }}>
             <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem' }}>
               <Key size={14} /> Security Status
             </h4>
             <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Two-factor authentication is recommended for all root accounts.</p>
             <button className="btn-base btn-link" style={{ fontSize: '0.75rem', padding: 0, marginTop: '12px', color: 'var(--color-primary)' }}>
               Manage Credentials →
             </button>
          </div>
        </aside>

        <section className={styles.pendingSection}>
           <h3 style={{ marginBottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <UserCircle size={20} /> Personal Configuration
           </h3>

           <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Administrative Alias</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your display name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Professional Bio</label>
                <textarea 
                  className="form-textarea"
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Administrative focus or regional oversight details..."
                />
              </div>

              {message.text && (
                <div style={{ 
                  padding: '12px', borderRadius: '8px', marginBottom: '20px',
                  backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
                  color: message.type === 'success' ? '#065f46' : '#991b1b',
                  fontSize: '0.875rem', fontWeight: 600, border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
                }}>
                  {message.text}
                </div>
              )}

              <Button type="submit" disabled={isUpdating} style={{ width: '200px' }}>
                {isUpdating ? 'Synchronizing...' : 'Update Identity'}
              </Button>
           </form>
        </section>
      </div>
    </div>
  );
}
