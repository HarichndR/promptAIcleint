'use client';

import React from 'react';
import { Button } from './ui/Button';
import { useToast } from '@/hooks/useToast';
import styles from './ShareButton.module.css';

interface ShareButtonProps {
  title: string;
  text?: string;
  url?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
  const { showToast } = useToast();
  const shareUrl = url || typeof window !== 'undefined' ? window.location.href : '';

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: text || `Check out this prompt: ${title}`,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('Link copied to clipboard!', 'success');
      } catch (err) {
        showToast('Failed to copy link', 'error');
      }
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleShare}
      className={styles.btn}
    >
      <span className={styles.icon}>↗</span>
      Share
    </Button>
  );
};
