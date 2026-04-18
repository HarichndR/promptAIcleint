'use client';

import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Modal } from '../ui/Modal';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalTab, authModalMessage, closeAuthModal } = useAuthContext();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    setActiveTab(authModalTab);
  }, [authModalTab]);

  return (
    <Modal 
      isOpen={authModalOpen} 
      onClose={closeAuthModal} 
      title={activeTab === 'login' ? 'Log In' : 'Create Account'}
    >
      {authModalMessage && (
        <div style={{ 
          padding: 'var(--space-3) var(--space-4)', 
          backgroundColor: 'var(--color-primary-soft)', 
          color: 'var(--color-primary)', 
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: 'var(--space-6)',
          textAlign: 'center',
          border: '1px solid rgba(37, 99, 235, 0.1)'
        }}>
          {authModalMessage}
        </div>
      )}
      {activeTab === 'login' ? (
        <LoginForm onToggle={() => setActiveTab('register')} />
      ) : (
        <RegisterForm onToggle={() => setActiveTab('login')} />
      )}
    </Modal>
  );
};
