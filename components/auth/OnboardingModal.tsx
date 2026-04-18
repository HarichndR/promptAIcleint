'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { categoryApi } from '@/services/api';
import { Category } from '@/types';
import { useAuthContext } from '@/context/AuthContext';

export const OnboardingModal: React.FC = () => {
  const { user, completeOnboarding } = useAuthContext();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (step === 2 && categories.length === 0) {
      categoryApi.getCategories().then(res => setCategories(res.data));
    }
  }, [step, categories.length]);

  const toggleCategory = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await completeOnboarding(selectedIds);
      setIsDismissed(true);
    } catch (err) {
      console.error('Onboarding failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Only show if user exists, hasn't completed onboarding, and isn't locally dismissed
  if (!user || user.onboardingCompleted || isDismissed) return null;

  return (
    <Modal isOpen={true} onClose={() => {}} title="Tailor Your Experience">
      <div className="animate-reveal">
        {step === 1 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-6)' }}>👋</div>
            <h2 style={{ marginBottom: 'var(--space-2)' }}>Welcome to PromptAI</h2>
            <p style={{ marginBottom: 'var(--space-10)' }}>
              Let's customize your discovery feed so you find exactly what you need.
            </p>
            <Button onClick={() => setStep(2)} size="lg" style={{ width: '100%' }}>
              Get Started
            </Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 style={{ marginBottom: 'var(--space-2)' }}>What interests you?</h3>
            <p style={{ marginBottom: 'var(--space-6)', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
              Select multiple categories to personalize your feed.
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 'var(--space-3)', 
              maxHeight: '300px', 
              overflowY: 'auto',
              padding: '2px',
              marginBottom: 'var(--space-10)'
            }}>
              {categories.map(cat => {
                const isSelected = selectedIds.includes(cat._id);
                return (
                  <button
                    key={cat._id}
                    onClick={() => toggleCategory(cat._id)}
                    className="clean-border"
                    style={{
                      padding: 'var(--space-4)',
                      textAlign: 'left',
                      backgroundColor: isSelected ? 'var(--color-primary-soft)' : 'white',
                      borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      fontSize: '0.9rem',
                      fontWeight: 600
                    }}
                  >
                    <div className="flex-between">
                      <span>{cat.name}</span>
                      {isSelected && <span style={{ color: 'var(--color-primary)' }}>✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex-between" style={{ gap: 'var(--space-4)' }}>
               <Button variant="outline" onClick={() => setStep(1)} style={{ width: '120px' }}>Back</Button>
               <Button onClick={() => setStep(3)} disabled={selectedIds.length === 0} style={{ flexGrow: 1 }}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: 'var(--space-6)' }}>🚀</div>
            <h2 style={{ marginBottom: 'var(--space-2)' }}>You're all set!</h2>
            <p style={{ marginBottom: 'var(--space-10)' }}>
              We've prepared a set of high-quality prompts curated just for your interests.
            </p>
            <Button onClick={handleFinish} isLoading={isLoading} size="lg" style={{ width: '100%' }}>
              Start Exploring
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
