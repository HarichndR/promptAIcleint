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
            <h1>Taxonomy <span style={{ color: 'var(--color-primary)' }}>Engine</span></h1>
            <p>Organize the platform's architectural ecosystem.</p>
          </div>
          <button className={styles.fabBtn} style={{ margin: 0 }} onClick={() => setIsCreating(true)}>
            <Plus size={18} /> Category
          </button>
        </div>
      </header>

      <div className={styles.pendingSection}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          
          {/* Creating Card overlay */}
          {isCreating && (
            <div className={styles.itemCard} style={{ padding: '20px', alignItems: 'center', borderColor: 'var(--color-primary)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                 <div style={{ backgroundColor: 'var(--color-primary-soft)', padding: '10px', borderRadius: '12px' }}>
                    <Tag size={20} color="var(--color-primary)" />
                 </div>
                 <input 
                   autoFocus
                   type="text" 
                   value={newName} 
                   onChange={(e) => setNewName(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                   placeholder="New Category..." 
                   style={{ width: '100%', padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px' }}
                 />
               </div>
               <div className="flex-row" style={{ gap: '8px', marginLeft: '12px' }}>
                 <button onClick={handleCreate} disabled={isSaving || !newName.trim()} style={{ background: 'var(--color-primary)', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                   {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                 </button>
                 <button onClick={() => setIsCreating(false)} style={{ background: 'transparent', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                   <X size={16} color="#64748b" />
                 </button>
               </div>
            </div>
          )}

          {categories.map(cat => (
            <div key={cat._id} className={styles.itemCard} style={{ padding: '20px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                <div style={{ backgroundColor: 'var(--color-primary-soft)', padding: '10px', borderRadius: '12px' }}>
                  <Tag size={20} color="var(--color-primary)" />
                </div>
                
                {editingId === cat._id ? (
                  <input 
                    autoFocus
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat._id)}
                    style={{ width: '100%', padding: '8px', border: '1px solid var(--color-primary)', borderRadius: '6px' }}
                  />
                ) : (
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.125rem' }}>{cat.name}</h4>
                    <p style={{ margin: '4px 0 0', fontSize: '0.75rem', color: '#64748b' }}>System Identified</p>
                  </div>
                )}
              </div>
              
              <div className="flex-row" style={{ gap: '8px', marginLeft: '12px' }}>
                {editingId === cat._id ? (
                  <>
                    <button 
                      onClick={() => handleUpdate(cat._id)} disabled={isSaving || !editName.trim()}
                      style={{ background: 'var(--color-success)', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    </button>
                    <button onClick={() => setEditingId(null)} style={{ background: 'transparent', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                      <X size={16} color="#64748b" />
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      style={{ background: 'transparent', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                      onClick={() => {
                        setEditingId(cat._id);
                        setEditName(cat.name);
                      }}
                    >
                      <Edit2 size={16} color="#64748b" />
                    </button>
                    <button 
                      style={{ background: 'transparent', border: '1px solid #fee2e2', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                      onClick={() => handleDelete(cat._id)}
                      disabled={isDeleting === cat._id}
                    >
                      {isDeleting === cat._id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} color="#ef4444" />}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {categories.length === 0 && !isCreating && (
          <div style={{ padding: '60px', textAlign: 'center' }}>
            <p style={{ color: '#64748b' }}>No categories found in registry.</p>
          </div>
        )}
      </div>
    </div>
  );
}

