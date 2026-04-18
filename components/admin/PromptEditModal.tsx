'use client';

import React, { useState } from 'react';
import { Prompt, Category } from '@/types';
import { Loader2, X, Save } from 'lucide-react';
import styles from '@/app/admin/Admin.module.css';

interface PromptEditModalProps {
  prompt: Prompt;
  categories: Category[];
  onClose: () => void;
  onSave: (formData: any, image: File | null) => Promise<void>;
}

export default function PromptEditModal({ prompt, categories, onClose, onSave }: PromptEditModalProps) {
  const [form, setForm] = React.useState({
    title: prompt.title,
    description: prompt.description,
    promptText: prompt.promptText,
    category: (prompt.category as any)._id || (prompt.category as any),
    model: prompt.model || '',
  });
  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(prompt.imageUrl || null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      await onSave(form, image);
    } catch (err: any) {
      setError(err.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-container" style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header flex-between">
          <h3 style={{ fontWeight: 800, fontSize: '1.125rem' }}>Edit Prompt</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-admin-text)' }}>
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label className="form-label" style={{ color: 'var(--color-admin-text)' }}>Title</label>
              <input 
                className="form-input" 
                value={form.title} 
                onChange={(e) => setForm({ ...form, title: e.target.value })} 
                style={{ backgroundColor: 'var(--color-admin-surface)', color: 'var(--color-admin-text)' }}
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label className="form-label" style={{ color: 'var(--color-admin-text)' }}>Category</label>
                <select 
                  className="form-select" 
                  value={form.category} 
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{ backgroundColor: 'var(--color-admin-surface)', color: 'var(--color-admin-text)' }}
                >
                  {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="form-label" style={{ color: 'var(--color-admin-text)' }}>Model</label>
                <input 
                  className="form-input" 
                  value={form.model} 
                  onChange={(e) => setForm({ ...form, model: e.target.value })}
                  style={{ backgroundColor: 'var(--color-admin-surface)', color: 'var(--color-admin-text)' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ color: 'var(--color-admin-text)' }}>Usage Instructions</label>
              <textarea 
                className="form-textarea" 
                rows={6} 
                value={form.description} 
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                style={{ backgroundColor: 'var(--color-admin-surface)', color: 'var(--color-admin-text)' }}
              />
            </div>

            <div>
              <label className="form-label" style={{ color: 'var(--color-admin-text)' }}>Prompt Text</label>
              <textarea 
                className="form-textarea prompt-notepad-font" 
                rows={10} 
                value={form.promptText} 
                onChange={(e) => setForm({ ...form, promptText: e.target.value })}
                style={{ backgroundColor: 'var(--color-admin-surface)', color: 'var(--color-admin-text)' }}
              />
            </div>

            <div>
               <label className="form-label" style={{ color: 'var(--color-admin-text)' }}>Replace Preview Image</label>
               <input type="file" onChange={handleImageChange} style={{ fontSize: '0.875rem', color: 'var(--color-admin-text)' }} />
               {preview && <img src={preview} alt="preview" style={{ marginTop: '12px', height: '80px', borderRadius: '8px', objectFit: 'cover' }} />}
            </div>
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '16px' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-admin-border)' }}>
            <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--color-admin-border)', background: 'transparent', cursor: 'pointer', fontWeight: 600, color: 'var(--color-admin-text)' }}>Cancel</button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              style={{ padding: '10px 24px', borderRadius: '8px', border: 'none', background: 'var(--color-admin-accent)', color: 'white', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
