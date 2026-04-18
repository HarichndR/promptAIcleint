'use client';

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { promptApi } from '../services/api';
import { Bookmark } from 'lucide-react';

interface SaveButtonProps {
  promptId: string;
  initialIsSaved?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({ 
  promptId, 
  initialIsSaved = false 
}) => {
  const { requireAuth } = useAuth();
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    requireAuth(async () => {
      setLoading(true);
      try {
        await promptApi.toggleSave(promptId);
        setIsSaved(!isSaved);
      } catch (err) {
        console.error('Failed to toggle save');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <button 
      onClick={handleSave} 
      className="action-btn"
      style={{ color: isSaved ? '#000000' : 'var(--color-text-secondary)' }}
      disabled={loading}
    >
      <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
    </button>
  );
};


