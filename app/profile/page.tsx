'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { authApi, promptApi, categoryApi } from '@/services/api';
import { AvatarPicker } from '@/components/auth/AvatarPicker';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Category, Prompt } from '@/types';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { ProfileTabs, ProfileTab } from '@/components/profile/ProfileTabs';
import { PromptCard } from '@/components/PromptCard';
import { Bookmark, PenTool, Activity, ShieldCheck, Mail, MapPin, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, setUser, logout, loading: authLoading } = useAuthContext();
  const router = useRouter();
  const hasLoadedRef = useRef(false);
  
  // Form State
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | File>('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState<ProfileTab>('general');
  const [categories, setCategories] = useState<Category[]>([]);
  const [myPrompts, setMyPrompts] = useState<Prompt[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load Initial Metadata (Categories) Once
  useEffect(() => {
    categoryApi.getCategories().then(({ data }) => setCategories(data));
  }, []);

  // Sync Form with User Object (On Load or Context Update)
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
      setSelectedInterests(user.interests?.map((i: any) => typeof i === 'string' ? i : i._id) || []);
      
      // Load and update statistical HUD ONLY if not already loaded for this user session
      if (!hasLoadedRef.current && user?._id) {
        promptApi.getMyPrompts().then(({ data }) => setMyPrompts(data));
        promptApi.getSavedPrompts().then(({ data }) => setSavedCount(data.length));
        hasLoadedRef.current = true;
      }
    }
  }, [user?._id, user?.name, user?.bio, user?.avatar]);

  useEffect(() => {
    if (!authLoading && !user) {
      const timer = setTimeout(() => {
        if (!user) router.push('/login');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user?._id, authLoading, router]);


  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('bio', bio);
      formData.append('interests', JSON.stringify(selectedInterests));
      
      if (typeof avatar === 'string') {
        formData.append('image', avatar);
      } else if (avatar instanceof File) {
        formData.append('image', avatar);
      }

      const res = await authApi.updateProfile(formData);
      if (res.success && res.data?.user) {
        setUser(res.data.user);
        setMessage({ type: 'success', text: 'Identity synchronized successfully!' });
      } else {
        throw new Error('Server synchronization failed. Please try again.');
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update identity' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (authLoading || !user) return null;

  return (
    <div className="animate-reveal" style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      {/* CINEMATIC HERO HEADER */}
      <div className="profile-hero-gradient">
         <div className="site-container" style={{ height: '100%', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: 'var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
               {user.role === 'admin' && (
                 <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    <ShieldCheck size={14} color="#60a5fa" />
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', color: '#93c5fd', letterSpacing: '0.05em' }}>Platform Admin</span>
                 </div>
               )}
            </div>
         </div>
      </div>

      <div className="site-container" style={{ marginTop: '-60px', paddingBottom: 'var(--space-20)' }}>
        {/* IDENTITY ANCHOR */}
        <div className="flex-row" style={{ alignItems: 'flex-end', gap: 'var(--space-8)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
          <div style={{ 
            position: 'relative', width: '160px', height: '160px', 
            borderRadius: 'var(--radius-lg)', overflow: 'hidden',
            border: '6px solid var(--color-bg)', backgroundColor: 'white',
            boxShadow: 'var(--shadow-lg)', flexShrink: 0
          }}>
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} fill style={{ objectFit: 'cover' }} />
            ) : (
              <div className="flex-center" style={{ width: '100%', height: '100%', fontSize: '4rem', fontWeight: 900, color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-soft)' }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div style={{ flex: 1, paddingBottom: 'var(--space-2)' }}>
             <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{user.name}</h1>
             <div className="flex-row" style={{ gap: 'var(--space-6)', flexWrap: 'wrap' }}>
                <div className="flex-row" style={{ gap: '8px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                   <Mail size={16} />
                   <span>{user.email}</span>
                </div>
                <div className="flex-row" style={{ gap: '8px', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                   <MapPin size={16} />
                   <span>Global Creator</span>
                </div>
                <button 
                  onClick={() => { logout(); router.push('/'); }} 
                  className="flex-row" 
                  style={{ 
                    gap: '8px', color: 'var(--color-error)', fontSize: '0.9rem', 
                    background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600,
                    marginLeft: 'auto', padding: '8px 16px', borderRadius: '8px', transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-error-soft)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                   <LogOut size={16} />
                   <span>Sign Out</span>
                </button>
             </div>
          </div>
        </div>

        {/* STATS HUD */}
        <ProfileStats promptsCount={myPrompts.length} savedCount={savedCount} />

        {/* MAIN CONFIGURATION AREA */}
        <div style={{ marginTop: 'var(--space-12)', display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-8)' }}>
           <div className="clean-border glass-card-premium" style={{ padding: 'var(--space-10)' }}>
              <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

              <div className="animate-reveal" key={activeTab}>
                 {activeTab === 'general' && (
                    <form onSubmit={handleUpdate} style={{ maxWidth: '800px' }}>
                       <div className="grid-2 mobile-grid-1" style={{ display: 'grid', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                          <div className="form-group">
                            <label className="form-label">Display Name</label>
                            <input 
                              type="text" 
                              className="form-input" 
                              value={name} 
                              onChange={(e) => setName(e.target.value)}
                              placeholder="How everyone sees you"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Avatar Preset</label>
                            <AvatarPicker 
                              currentAvatar={typeof avatar === 'string' ? avatar : ''} 
                              onSelect={(val) => setAvatar(val)} 
                            />
                          </div>
                       </div>

                       <div className="form-group" style={{ marginBottom: 'var(--space-10)' }}>
                         <label className="form-label">Professional Bio ({bio.length}/500)</label>
                         <textarea 
                           className="form-textarea"
                           rows={6}
                           value={bio}
                           onChange={(e) => setBio(e.target.value.slice(0, 500))}
                           placeholder="Describe your prompt engineering focus, specialized models (GPT-4, Midjourney), or the industries you serve..."
                           style={{ fontSize: '1rem', padding: 'var(--space-4)' }}
                         />
                       </div>

                       {message.text && (
                        <div style={{ 
                          padding: 'var(--space-4)', 
                          borderRadius: 'var(--radius-md)',
                          marginBottom: 'var(--space-6)',
                          backgroundColor: message.type === 'success' ? 'var(--color-success-soft)' : 'var(--color-error-soft)',
                          color: message.type === 'success' ? '#065f46' : '#991b1b',
                          fontSize: '0.875rem',
                          fontWeight: 700,
                          border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
                        }}>
                          {message.text}
                        </div>
                      )}

                       <Button type="submit" disabled={isUpdating} style={{ width: '220px' }}>
                          {isUpdating ? 'Synchronizing...' : 'Save Identity'}
                       </Button>
                    </form>
                 )}

                 {activeTab === 'interests' && (
                    <div>
                       <div style={{ marginBottom: 'var(--space-8)' }}>
                          <h3>Curation Vault</h3>
                          <p>Select the frameworks and domains that define your discovery engine.</p>
                       </div>
                       <div className="flex-row" style={{ flexWrap: 'wrap', gap: '12px' }}>
                          {categories.map((cat) => {
                            const isSelected = selectedInterests.includes(cat._id);
                            return (
                              <button
                                key={cat._id}
                                type="button"
                                onClick={() => toggleInterest(cat._id)}
                                style={{
                                  padding: '12px 24px',
                                  borderRadius: '30px',
                                  fontSize: '0.9rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                  backgroundColor: isSelected ? 'var(--color-primary-soft)' : 'white',
                                  color: isSelected ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px'
                                }}
                              >
                                {isSelected ? <ShieldCheck size={16} /> : <Activity size={16} />}
                                {cat.name}
                              </button>
                            );
                          })}
                       </div>
                       <div style={{ marginTop: 'var(--space-12)', paddingTop: 'var(--space-8)', borderTop: '1px solid var(--color-border)' }}>
                          <Button onClick={handleUpdate} disabled={isUpdating}>
                             {isUpdating ? 'Saving Vault...' : 'Update Curation Interests'}
                          </Button>
                       </div>
                    </div>
                 )}

                 {activeTab === 'activity' && (
                    <div>
                       <div style={{ marginBottom: 'var(--space-8)' }}>
                          <h3>Your Professional Output</h3>
                          <p>A high-performance archive of all prompts you have authored.</p>
                       </div>
                       {myPrompts.length > 0 ? (
                          <div className="prompt-grid">
                             {myPrompts.map(p => (
                               <div key={p._id} style={{ position: 'relative' }}>
                                 <PromptCard prompt={p} />
                               </div>
                             ))}
                          </div>
                       ) : (
                          <div className="flex-center" style={{ height: '300px', border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                             <div style={{ textAlign: 'center' }}>
                                <PenTool size={48} style={{ margin: '0 auto 16px', color: 'var(--color-text-secondary)', opacity: 0.3 }} />
                                <h4>No published activity yet</h4>
                                <Link href="/my-prompts" className="btn-base btn-link" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 700 }}>Post your first prompt →</Link>
                             </div>
                          </div>
                       )}
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
