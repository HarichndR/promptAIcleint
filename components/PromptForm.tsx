'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category } from '../types';
import { categoryApi, promptApi } from '../services/api';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Textarea } from './ui/Textarea';
import { MarkdownRenderer } from './MarkdownRenderer';

export const PromptForm: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    promptText: '',
    model: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    categoryApi.getCategories().then(({ data }) => setCategories(data));
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // In testing/development, allow submission without image if needed for unblocking
    if (!image) {
      setError('Please upload a result screenshot for your prompt.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    data.append('promptText', formData.promptText);
    data.append('model', formData.model);
    if (image) data.append('image', image);

    try {
      const res = await promptApi.createPrompt(data);
      if (res.success) {
        router.push('/my-prompts');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create prompt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="animate-reveal">
      <div className="form-group">
        <label className="form-label">Descriptive Title</label>
        <Input
          placeholder="e.g., SEO Article Generator with Keyphrase Optimization"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label">AI Model</label>
        <Input
          placeholder="e.g., Midjourney v6, GPT-4, Stable Diffusion XL"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          required
        />
      </div>

      <div className="form-group grid-2 mobile-grid-1" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-6)', display: 'grid' }}>
        <div>
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            style={{ marginBottom: 0 }}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Result </label>
          <div style={{ position: 'relative' }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              style={{ fontSize: '0.85rem' }}
            />
            {imagePreview && (
              <div style={{ marginTop: 'var(--space-2)', borderRadius: 'var(--radius-md)', overflow: 'hidden', height: '60px', width: '100px', border: '1px solid var(--color-border)' }}>
                <img src={imagePreview || ''} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Description & Usage (Markdown Preview)</label>
        <div className="grid-2 mobile-grid-1" style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <Textarea
            placeholder="Explain how to use this prompt, what parameters to change, and what output to expect..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={12}
            required
            className="form-textarea"
          />
          <div style={{
            padding: 'var(--space-6)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            backgroundColor: '#f8fafc',
            minHeight: '300px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '12px', color: 'var(--color-primary)' }}>Live Preview</p>
            <MarkdownRenderer content={formData.description || '*Draft your description to see result here...*'} />
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Final Prompt Text (Copying this should work perfectly)</label>
        <Textarea
          placeholder="Paste the exact text here..."
          value={formData.promptText}
          onChange={(e) => setFormData({ ...formData, promptText: e.target.value })}
          rows={18}
          className="form-textarea prompt-notepad-font"
          required
        />
      </div>

      {error && (
        <p style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
          {error}
        </p>
      )}

      <Button type="submit" isLoading={isLoading} size="lg" style={{ width: '100%' }}>
        Share with Community
      </Button>
    </form>
  );
};
