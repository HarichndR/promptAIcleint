'use client';

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { promptApi } from '../services/api';
import { Heart } from 'lucide-react';

interface LikeButtonProps {
  promptId: string;
  initialLikes: number;
  initialIsLiked?: boolean;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ 
  promptId, 
  initialLikes, 
  initialIsLiked = false 
}) => {
  const { requireAuth } = useAuth();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [loading, setLoading] = useState(false);

  const handleLike = () => {
    requireAuth(async () => {
      setLoading(true);
      try {
        const { data } = await promptApi.toggleLike(promptId);
        setLikes(data.likes);
        setIsLiked(!isLiked);
      } catch (err) {
        console.error('Failed to toggle like');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <button 
      onClick={handleLike} 
      className="action-btn"
      style={{ color: isLiked ? '#ef4444' : 'var(--color-text-secondary)' }}
      disabled={loading}
    >
      <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{likes}</span>
    </button>
  );
};

