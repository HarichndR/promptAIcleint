'use client';

import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Eye, EyeOff } from 'lucide-react';


import Link from 'next/link';

export const LoginForm: React.FC<{ onToggle?: () => void }> = ({ onToggle }) => {
  const { login } = useAuthContext();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await login(formData);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
            placeholder="••••••••"
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
      <Button type="submit" isLoading={isLoading} size="lg" style={{ width: '100%' }}>
        Sign In
      </Button>
      <p style={{ textAlign: 'center', marginTop: 'var(--space-6)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
        New to PromptAI? {onToggle ? (
          <span onClick={onToggle} style={{ color: 'var(--color-primary)', fontWeight: 700, cursor: 'pointer' }}>Create account</span>
        ) : (
          <Link href="/register" style={{ color: 'var(--color-primary)', fontWeight: 700, textDecoration: 'none' }}>Create account</Link>
        )}
      </p>
    </form>
  );
};
