'use client';

import React, { useEffect, useState } from 'react';
import { PromptCard } from '@/components/PromptCard';
import { SavedPromptsGrid } from '@/components/SavedPromptsGrid';
import { Prompt, Category } from '@/types';
import { categoryApi, promptApi } from '@/services/api';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Edit2, Trash2, Loader2, PenTool } from 'lucide-react';
import dynamic from 'next/dynamic';

const PromptEditModal = dynamic(() => import('@/components/admin/PromptEditModal'), {
  loading: () => <div className="modal-overlay"><div className="modal-container flex-center" style={{ height: '200px' }}><Loader2 className="animate-spin" size={32} color="var(--color-primary)" /></div></div>
});

export default function MyPromptsPage() {
  const router = useRouter();
  const { user, loading } = useAuthContext();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [sort, setSort] = useState('new');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleSaveEdit = async (form: any, image: File | null) => {
    if (!editingPrompt) return;
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]: [string, any]) => fd.append(k, v));
    if (image) fd.append('image', image);

    const res = await promptApi.updatePrompt(editingPrompt._id, fd);
    if (res.success) {
      setPrompts(prev => prev.map(p => p._id === editingPrompt._id ? { ...p, ...res.data } : p));
      setEditingPrompt(null);
    } else {
      throw new Error(res.message || 'Update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this prompt?')) return;
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
    <div className="animate-reveal site-container" style={{ paddingTop: 'var(--space-20)', paddingBottom: 'var(--space-20)' }}>
      {editingPrompt && (
        <PromptEditModal 
          prompt={editingPrompt}
          categories={categories}
          onClose={() => setEditingPrompt(null)}
          onSave={handleSaveEdit}
        />
      )}

      <header style={{ marginBottom: 'var(--space-12)' }}>
        <div className="flex-row" style={{ gap: '12px', marginBottom: '8px' }}>
          <PenTool size={20} color="var(--color-primary)" />
          <span style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>Creator Workspace</span>
        </div>
        <h1>My <span className="text-gradient">Prompts</span></h1>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: '600px' }}>Manage and refine your architectural collection of prompts.</p>
        
        <div className="flex-row" style={{ gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Sort By:</span>
          <select className="form-select" style={{ width: '160px', marginBottom: 0 }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="new">Newest First</option>
            <option value="old">Oldest First</option>
          </select>
        </div>
      </header>

      <SavedPromptsGrid 
        prompts={prompts}
        isLoading={isLoading}
        isAuthLoading={loading}
        renderExtraActions={(p) => (
          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setEditingPrompt(p)}
              className="action-pill"
              style={{ background: 'white', border: '1px solid var(--color-border)', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
            >
              <Edit2 size={14} color="var(--color-primary)" />
            </button>
            <button
              onClick={() => handleDelete(p._id)}
              disabled={deletingId === p._id}
              className="action-pill"
              style={{ background: 'white', border: '1px solid rgba(239,68,68,0.2)', padding: '6px', borderRadius: '8px', cursor: 'pointer' }}
            >
              {deletingId === p._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} color="var(--color-error)" />}
            </button>
            <div style={{
              padding: '4px 10px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.05em',
              backgroundColor: p.status === 'approved' ? 'var(--color-success)' : '#f59e0b',
              color: 'white', marginLeft: 'auto'
            }}>
              {p.status}
            </div>
          </div>
        )}
      />
    </div>
  );
}
