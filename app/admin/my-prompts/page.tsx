'use client';

import React, { useEffect, useState } from 'react';
import { PromptCard } from '@/components/PromptCard';
import { SavedPromptsGrid } from '@/components/SavedPromptsGrid';
import { Prompt, Category } from '@/types';
import { categoryApi, promptApi } from '@/services/api';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Loader2, PenTool } from 'lucide-react';
import styles from '../Admin.module.css';
import dynamic from 'next/dynamic';

const PromptEditModal = dynamic(() => import('@/components/admin/PromptEditModal'), {
  loading: () => <div className="modal-overlay"><div className="modal-container flex-center" style={{ height: '200px' }}><Loader2 className="animate-spin" size={32} color="var(--color-admin-accent)" /></div></div>
});

export default function AdminMyPromptsPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [sort, setSort] = useState('new');
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal state
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);

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

  const handleSaveEdit = async (form: any, image: File | null) => {
    if (!editingPrompt) return;
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('promptText', form.promptText);
    fd.append('category', form.category);
    fd.append('model', form.model);
    if (image) fd.append('image', image);

    const res = await promptApi.updatePrompt(editingPrompt._id, fd);
    if (res.success) {
      setPrompts(prev => prev.map(p => p._id === editingPrompt._id ? { ...p, ...res.data } : p));
      setEditingPrompt(null);
    } else {
      throw new Error(res.message || 'Update failed');
    }
  };

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
    <div className="animate-reveal" style={{ maxWidth: '1200px' }}>
      {/* EDIT MODAL - LAZY LOADED */}
      {editingPrompt && (
        <PromptEditModal 
          prompt={editingPrompt}
          categories={categories}
          onClose={() => setEditingPrompt(null)}
          onSave={handleSaveEdit}
        />
      )}

      <header className={styles.dashboardHeader}>
        <div className="flex-row" style={{ gap: '12px', marginBottom: '8px' }}>
          <PenTool size={20} style={{ color: 'var(--color-admin-accent)' }} />
          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>Author Credentials</span>
        </div>
        <h1>My <span style={{ color: 'var(--color-admin-accent)' }}>Prompts</span></h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px' }}>The definitive archive of every architectural blueprint you've shared with the world.</p>
        
        <div className="flex-row" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-admin-text)' }}>Sort By:</span>
          <select className="form-select" style={{ width: '160px', marginBottom: 0, backgroundColor: 'var(--color-admin-surface)', borderColor: 'var(--color-admin-border)', fontSize: '0.875rem' }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="new">Newest First</option>
            <option value="old">Oldest First</option>
          </select>
        </div>
      </header>

      <section style={{ marginTop: 'var(--space-10)' }}>
        <SavedPromptsGrid 
          prompts={prompts}
          isLoading={isLoading}
          isAuthLoading={loading}
          variant="admin"
          renderExtraActions={(p) => (
            <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', gap: '6px' }}>
              <button
                onClick={() => openEdit(p)}
                title="Edit Prompt"
                style={{ background: 'white', border: '1px solid var(--color-admin-border)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}
              >
                <Edit2 size={14} color="var(--color-admin-accent)" />
              </button>
              <button
                onClick={() => handleDelete(p._id)}
                disabled={deletingId === p._id}
                title="Delete Prompt"
                style={{ background: 'white', border: '1px solid rgba(239,68,68,0.2)', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}
              >
                {deletingId === p._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} color="#ef4444" />}
              </button>
            </div>
          )}
        />
      </section>
    </div>
  );
}
