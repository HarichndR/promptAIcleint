'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const { user, loading, isAdmin, openAuthModal } = useAuthContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get('message');

  useEffect(() => {
    if (!loading && user) {
      const target = user.role === 'admin' ? '/admin' : '/';
      router.push(target);
    }
  }, [user, loading, router]);


  if (loading || user) {
    return (
      <div className="flex-center" style={{ height: '80vh' }}>
        <div className="loader"></div>
      </div>
    );
  }


  return (
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 150px)', padding: '40px 20px' }}>
      <div className="animate-reveal" style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" className="nav-logo" style={{ fontSize: '2rem', marginBottom: '16px', display: 'inline-block' }}>
            Prompt <span style={{ color: 'var(--color-primary)' }}>AI</span>
          </Link>

          {message && (
            <div className="animate-reveal" style={{ 
              marginBottom: '24px', 
              padding: '12px 16px', 
              backgroundColor: 'var(--color-primary-soft)', 
              borderRadius: '12px',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              fontSize: '0.9rem',
              fontWeight: 600
            }}>
              {message}
            </div>
          )}

          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            Sign in to access your curated collections
          </p>
        </div>

        <div className="cleanup-border" style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
          <LoginForm />
        </div>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
