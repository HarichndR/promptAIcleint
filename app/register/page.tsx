'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
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
    <div className="flex-center" style={{ minHeight: 'calc(100vh - 150px)', padding: '60px 20px' }}>
      <div className="animate-reveal" style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" className="nav-logo" style={{ fontSize: '2rem', marginBottom: '16px', display: 'inline-block' }}>
            Prompt <span style={{ color: 'var(--color-primary)' }}>AI</span>
          </Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
            Join the elite
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px' }}>
            Discover and share world-class AI prompts
          </p>
        </div>

        <div className="cleanup-border" style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '24px', boxShadow: 'var(--shadow-lg)' }}>
          <RegisterForm />
        </div>

        <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
          By joining, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
