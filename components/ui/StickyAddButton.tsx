'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const StickyAddButton = () => {
  const router = useRouter();
  const { user, openAuthModal } = useAuth();

  const handleClick = () => {
    if (!user) {
      openAuthModal('login', 'Sign in to share your world-class prompts');
      return;
    }
    router.push('/prompts/create');
  };

  return (
    <button
      onClick={handleClick}
      className="btn-base btn-primary flex-center animate-reveal sticky-add-btn"
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(37, 99, 235, 0.6)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.5)';
      }}
      title="Post New Prompt"
    >
      <Plus size={32} strokeWidth={3} color="white" />
    </button>
  );
};
