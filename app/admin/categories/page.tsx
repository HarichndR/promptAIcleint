'use client';

import React, { useState, useEffect } from 'react';
import { categoryApi } from '@/services/api';
import { Category } from '@/types';
import styles from '../Admin.module.css';
import { Tag, Plus, Trash2, Edit2, Loader2, Save, X } from 'lucide-react';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for creation
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  
  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  
  // State for in-flight tasks
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setIsSaving(true);
    try {
      await categoryApi.createCategory({ name: newName });
      await fetchCategories();
      setNewName('');
      setIsCreating(false);
    } catch (err) {
      alert('Failed to create category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    setIsSaving(true);
    try {
      await categoryApi.updateCategory(id, { name: editName });
      await fetchCategories();
      setEditingId(null);
    } catch (err) {
      alert('Failed to update category. Names must be unique.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will fail if prompts are actively bound to this category.')) return;
    setIsDeleting(id);
    try {
      await categoryApi.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      alert('Failed to delete category. Ensure no prompts are currently using it.');
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingOverlay}>
        <Loader2 className="animate-spin" size={32} color="var(--color-primary)" />
      </div>
    );
  }

  return (
    <div className="animate-reveal">
      <header className={styles.dashboardHeader}>
        <div className="flex-between">
          <div>
            <h1>Taxonomy <span style={{ color: 'var(--color-admin-accent)' }}>Engine</span></h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Organize the platform's architectural ecosystem.</p>
          </div>
          <button className={styles.fabBtn} style={{ margin: 0 }} onClick={() => setIsCreating(true)}>
            <Plus size={18} /> Category
          </button>
        </div>
      </header>

      <div style={{ backgroundColor: 'var(--color-admin-surface)', borderRadius: '24px', border: '1px solid var(--color-admin-border)', overflowX: 'auto', boxShadow: 'var(--shadow-sm)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ textAlign: 'left', backgroundColor: 'var(--color-admin-pill)', borderBottom: '1px solid var(--color-admin-border)' }}>
              <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.1em' }}>Category Name</th>
              <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.1em' }}>Identifier</th>
              <th style={{ padding: '20px 24px', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', color: 'var(--color-text-secondary)', letterSpacing: '0.1em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* New Category Input Row */}
            {isCreating && (
              <tr style={{ borderBottom: '1px solid var(--color-admin-border)', backgroundColor: 'rgba(99, 102, 241, 0.05)' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ backgroundColor: 'var(--color-admin-accent-glow)', padding: '8px', borderRadius: '8px' }}>
                      <Tag size={16} color="var(--color-admin-accent)" />
                    </div>
                    <input 
                      autoFocus
                      type="text" 
                      value={newName} 
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                      placeholder="New name..." 
                      style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--color-admin-accent)', borderRadius: '8px', backgroundColor: 'var(--color-admin-surface)', color: 'var(--color-admin-text)', fontSize: '0.875rem' }}
                    />
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--color-admin-accent)', fontWeight: 700, fontSize: '0.75rem' }}>DRAFTING...</td>
                <td style={{ padding: '16px 24px' }}>
                  <div className="flex-row" style={{ gap: '8px' }}>
                    <button onClick={handleCreate} disabled={isSaving || !newName.trim()} className={styles.actionBtn} style={{ background: 'var(--color-primary)', color: 'white' }}>
                      {isSaving ? <Loader2 className="animate-spin" size={14} /> : 'Save'}
                    </button>
                    <button onClick={() => setIsCreating(false)} className={styles.actionBtn} style={{ background: 'transparent' }}>
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            )}

            {categories.map(cat => (
              <tr key={cat._id} style={{ borderBottom: '1px solid var(--color-admin-border)', transition: 'background 0.2s' }}>
                <td style={{ padding: '16px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', padding: '8px', borderRadius: '8px' }}>
                      <Tag size={16} color="var(--color-admin-accent)" />
                    </div>
                    {editingId === cat._id ? (
                      <input 
                        autoFocus
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat._id)}
                        style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--color-admin-accent)', borderRadius: '8px', backgroundColor: 'var(--color-admin-surface)', color: 'var(--color-admin-text)', fontSize: '0.875rem' }}
                      />
                    ) : (
                      <span style={{ fontWeight: 800, color: 'var(--color-admin-text)' }}>{cat.name}</span>
                    )}
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                  {cat._id.slice(-8).toUpperCase()}
                </td>
                <td style={{ padding: '16px 24px' }}>
                  <div className="flex-row" style={{ gap: '8px' }}>
                    {editingId === cat._id ? (
                      <>
                        <button 
                          onClick={() => handleUpdate(cat._id)} disabled={isSaving || !editName.trim()}
                          className={styles.actionBtn} style={{ background: 'var(--color-success)', color: 'white' }}
                        >
                          {isSaving ? <Loader2 className="animate-spin" size={14} /> : 'Update'}
                        </button>
                        <button onClick={() => setEditingId(null)} className={styles.actionBtn} style={{ background: 'transparent' }}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          className={styles.actionBtn}
                          style={{ background: 'transparent' }}
                          onClick={() => {
                            setEditingId(cat._id);
                            setEditName(cat.name);
                          }}
                        >
                          Edit
                        </button>
                        <button 
                          className={styles.actionBtn}
                          style={{ background: 'transparent', color: '#ef4444' }}
                          onClick={() => handleDelete(cat._id)}
                          disabled={isDeleting === cat._id}
                        >
                          {isDeleting === cat._id ? <Loader2 className="animate-spin" size={14} /> : 'Delete'}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && !isCreating && (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>No categories found in registry.</p>
          </div>
        )}
      </div>
    </div>
  );
}
