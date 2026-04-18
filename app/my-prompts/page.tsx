'use client';

import React, { useEffect, useState } from 'react';
import { PromptCard } from '@/components/PromptCard';
import { Prompt, Category } from '@/types';
import { categoryApi, promptApi } from '@/services/api';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PenTool, Edit2, Trash2, Loader2, X, Save } from 'lucide-react';

export default function MyPromptsPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [sort, setSort] = useState('new');
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal state
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', promptText: '', category: '', model: '' });
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login?message=Sign in to view your collection');
    }
  }, [user, loading, router]);

  useEffect(() => {
    categoryApi.getCategories().then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      promptApi.getMyPrompts(sort).then(res => {
        setPrompts(res.data);
        setIsLoading(false);
      });
    }
  }, [user, sort]);

  const openEdit = (p: Prompt) => {
    setEditingPrompt(p);
    setEditForm({
      title: p.title,
      description: p.description,
      promptText: p.promptText,
      category: (p.category as any)._id || (p.category as any),
      model: p.model || '',
    });
    setEditImage(null);
    setEditImagePreview(null);
    setEditError('');
  };

  const handleSaveEdit = async () => {
    if (!editingPrompt) return;
    setIsSaving(true);
    setEditError('');
    try {
      const fd = new FormData();
      fd.append('title', editForm.title);
      fd.append('description', editForm.description);
      fd.append('promptText', editForm.promptText);
      fd.append('category', editForm.category);
      fd.append('model', editForm.model);
      if (editImage) fd.append('image', editImage);

      const res = await promptApi.updatePrompt(editingPrompt._id, fd);
      if (res.success) {
        setPrompts(prev => prev.map(p => p._id === editingPrompt._id ? { ...p, ...res.data } : p));
        setEditingPrompt(null);
      } else {
        setEditError(res.message || 'Update failed');
      }
    } catch (err: any) {
      setEditError(err.message || 'Something went wrong');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this prompt? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await promptApi.deletePrompt(id);
      setPrompts(prev => prev.filter(p => p._id !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete prompt');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading || !user) return null;

  return (
    <div className="animate-reveal">
      <StickyPostButton />

      {/* EDIT MODAL */}
      {editingPrompt && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setEditingPrompt(null); }}>
          <div className="modal-container" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header flex-between">
              <h3 style={{ fontWeight: 800, fontSize: '1.125rem' }}>Edit Prompt</h3>
              <button onClick={() => setEditingPrompt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>TITLE</label>
                <input className="form-input" style={{ marginBottom: 0 }} value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>CATEGORY</label>
                  <select className="form-select" style={{ marginBottom: 0 }} value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                    <option value="">Select...</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>AI MODEL</label>
                  <input className="form-input" style={{ marginBottom: 0 }} value={editForm.model} onChange={e => setEditForm({ ...editForm, model: e.target.value })} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>DESCRIPTION</label>
                <textarea className="form-textarea" rows={4} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>PROMPT TEXT</label>
                <textarea className="form-textarea prompt-notepad-font" rows={6} value={editForm.promptText} onChange={e => setEditForm({ ...editForm, promptText: e.target.value })} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>REPLACE IMAGE (optional)</label>
                <input type="file" accept="image/*" style={{ fontSize: '0.875rem' }} onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setEditImage(e.target.files[0]);
                    setEditImagePreview(URL.createObjectURL(e.target.files[0]));
                  }
                }} />
                {editImagePreview && <img src={editImagePreview} alt="preview" style={{ marginTop: '8px', height: '60px', borderRadius: '6px', objectFit: 'cover' }} />}
              </div>

              {editError && <p style={{ color: 'var(--color-error)', fontSize: '0.85rem', fontWeight: 600 }}>{editError}</p>}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                <button onClick={() => setEditingPrompt(null)} className="btn-base btn-outline btn-md" style={{ minWidth: 'auto' }}>Cancel</button>
                <button onClick={handleSaveEdit} disabled={isSaving} className="btn-base btn-primary btn-md flex-row" style={{ gap: '8px', minWidth: 'auto' }}>
                  {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <section style={{ padding: 'var(--space-16) 0 var(--space-8)', borderBottom: '1px solid var(--color-border)', backgroundColor: 'white' }}>
        <div className="site-container">
          <div className="flex-between" style={{ flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem' }}>My <span style={{ color: 'var(--color-primary)' }}>Collection</span></h1>
              <p>The definitive archive of every prompt you've authored and shared.</p>
            </div>
            <div className="flex-row" style={{ gap: 'var(--space-4)' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Sort By:</span>
              <select className="form-select" style={{ width: '160px', marginBottom: 0 }} value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="new">Newest First</option>
                <option value="old">Oldest First</option>
                <option value="relevance">Most Relevant</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <section className="site-container" style={{ padding: 'var(--space-16) 0' }}>
        {isLoading ? (
          <div className="flex-center" style={{ minHeight: '300px' }}>
            <Loader2 size={32} className="animate-spin" color="var(--color-primary)" />
          </div>
        ) : prompts.length > 0 ? (
          <div className="prompt-grid">
            {prompts.map(p => (
              <div key={p._id} style={{ position: 'relative' }}>
                {/* Status Badge - top right */}
                <div style={{
                  position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                  padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                  backgroundColor: p.status === 'approved' ? 'var(--color-success)' : '#f59e0b',
                  color: 'white'
                }}>
                  {p.status}
                </div>

                {/* Edit + Delete - top left */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => openEdit(p)}
                    title="Edit Prompt"
                    style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.08)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  >
                    <Edit2 size={14} color="var(--color-primary)" />
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    disabled={deletingId === p._id}
                    title="Delete Prompt"
                    style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(239,68,68,0.2)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  >
                    {deletingId === p._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} color="#ef4444" />}
                  </button>
                </div>

                <PromptCard prompt={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-center" style={{ padding: 'var(--space-20)', textAlign: 'center', backgroundColor: 'white', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
            <div>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>✍️</div>
              <h3>You haven't shared any prompts yet</h3>
              <p style={{ marginBottom: 'var(--space-6)' }}>Contribute your first prompt to build your reputation.</p>
              <button className="btn-base btn-primary btn-md" onClick={() => router.push('/prompts/create')}>
                Post Your First Prompt
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function StickyPostButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/prompts/create')}
      className="btn-base btn-primary flex-center"
      style={{
        position: 'fixed', bottom: '100px', right: '24px',
        width: '56px', height: '56px', borderRadius: '50%',
        boxShadow: '0 12px 32px rgba(37, 99, 235, 0.4)',
        zIndex: 2000, padding: 0, minWidth: 'auto'
      }}
      title="Post New Prompt"
    >
      <PenTool size={22} />
    </button>
  );
}
