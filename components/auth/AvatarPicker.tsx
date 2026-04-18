'use client';

import React, { useRef } from 'react';
import Image from 'next/image';

interface AvatarPickerProps {
  currentAvatar?: string;
  onSelect: (avatar: string | File) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=128&h=128&fit=crop', // Abstract Blue
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&h=128&fit=crop', // Abstract Purple
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?w=128&h=128&fit=crop', // Abstract Orange
  'https://images.unsplash.com/photo-1614851099175-e5b30eb6f696?w=128&h=128&fit=crop', // Abstract Teal
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=128&h=128&fit=crop', // Abstract Dark
  'https://images.unsplash.com/photo-1557683311-eac922347aa1?w=128&h=128&fit=crop', // Gradient Pink
  'https://images.unsplash.com/photo-1557683316-973673baf926?w=128&h=128&fit=crop', // Gradient Blue
  'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=128&h=128&fit=crop', // Gradient Dark Blue
  'https://images.unsplash.com/photo-1550684847-75bdda21cc95?w=128&h=128&fit=crop', // Geometric Pattern
  'https://images.unsplash.com/photo-1502691876148-a84978f5d88b?w=128&h=128&fit=crop', // Color Splash
];

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ currentAvatar, onSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onSelect(e.target.files[0]);
    }
  };

  return (
    <div className="flex-col" style={{ gap: 'var(--space-6)' }}>
      <label className="form-label">Choose an Avatar</label>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(5, 1fr)', 
        gap: 'var(--space-3)',
        marginBottom: 'var(--space-4)'
      }}>
        {PRESET_AVATARS.map((url, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelect(url)}
            style={{
              padding: 0,
              border: currentAvatar === url ? '3px solid var(--color-primary)' : '2px solid transparent',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              cursor: 'pointer',
              aspectRatio: '1/1',
              position: 'relative',
              transition: 'transform 0.2s',
              backgroundColor: '#f1f5f9'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Image src={url} alt={`Preset ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
          </button>
        ))}
      </div>

      <div className="flex-center" style={{ gap: 'var(--space-4)' }}>
        <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--color-border)' }}></div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', fontWeight: 600 }}>OR</span>
        <div style={{ height: '1px', flex: 1, backgroundColor: 'var(--color-border)' }}></div>
      </div>

      <button
        type="button"
        className="btn-base btn-outline btn-sm"
        onClick={() => fileInputRef.current?.click()}
        style={{ width: '100%', borderStyle: 'dashed' }}
      >
        Upload Custom Image
      </button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />
    </div>
  );
};
