'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CommentSection } from './CommentSection';

interface CommentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  promptId: string;
}

export const CommentDrawer: React.FC<CommentDrawerProps> = ({ isOpen, onClose, promptId }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="drawer-overlay" onClick={onClose}>
      <div 
        className="drawer-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Discussion</h2>
          <button 
            onClick={onClose}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.5rem', 
              cursor: 'pointer',
              color: 'var(--color-text-secondary)'
            }}
          >
            &times;
          </button>
        </div>
        <div className="drawer-body">
          <CommentSection promptId={promptId} />
        </div>
      </div>
    </div>,
    document.body
  );
};
