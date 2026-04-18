'use client';

import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Eye, EyeOff } from 'lucide-react';


import Link from 'next/link';

export const RegisterForm: React.FC<{ onToggle?: () => void }> = ({ onToggle }) => {
  const { register } = useAuthContext();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', bio: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await register(formData);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Full Name</label>
        <Input 
          type="text" 
          placeholder="Jane Doe"
          value={formData.name} 
          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          required 
        />
      </div>
      <div className="form-group">
        <label className="form-label">Email Address</label>
        <Input 
          type="email" 
          placeholder="name@example.com"
          value={formData.email} 
          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          required 
        />
      </div>
      <div className="form-group">
        <label className="form-label">Password</label>
        <div style={{ position: 'relative' }}>
          <Input 
            type={showPassword ? 'text' : 'password'} 
            placeholder="Minimum 6 characters"
            value={formData.password} 
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
            required 
            style={{ paddingRight: '45px' }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)',
              display: 'flex', alignItems: 'center'
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {error && (
        <p style={{ color: 'var(--color-error)', fontSize: '0.85rem', marginBottom: 'var(--space-4)', fontWeight: 600 }}>
          {error}
        </p>
      )}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <label className="form-label">Professional Bio</label>
          <textarea
            name="bio"
            placeholder="Tell us about your prompt engineering expertise..."
            className="form-input"
            style={{ minHeight: '80px', resize: 'none' }}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
        </div>

        <Button type="submit" className="w-full" variant="primary" isLoading={isLoading}>
          Create Account
        </Button>
      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
        Already have an account? {onToggle ? (
          <span onClick={onToggle} style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}>Sign In</span>
        ) : (
          <Link href="/login" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>Sign In</Link>
        )}
      </p>
    </form>
  );
};
