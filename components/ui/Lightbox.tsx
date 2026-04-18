'use client';

import React, { useEffect } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import Image from 'next/image';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const Lightbox: React.FC<LightboxProps> = ({ isOpen, onClose, imageUrl }) => {
  const [isZoomed, setIsZoomed] = React.useState(false);

  // ESC Key listener
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    window.addEventListener('keydown', handleEsc);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="animate-fade-in"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(10px)',
        cursor: isZoomed ? 'zoom-out' : 'default'
      }}
      onClick={onClose}
    >
      {/* HEADER ACTIONS */}
      <div style={{
        position: 'absolute',
        top: 'env(safe-area-inset-top, 24px)',
        right: 'var(--space-4, 16px)',
        display: 'flex',
        gap: '12px',
        zIndex: 10000
      }}>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsZoomed(!isZoomed); }}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
        >
          {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>
        <button 
          onClick={onClose}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(10px)' }}
        >
          <X size={20} />
        </button>
      </div>

      <div 
        className="animate-zoom-in"
        style={{
          position: 'relative',
          width: isZoomed ? '100%' : '100%', // Mobile-first edge-to-edge
          height: isZoomed ? '100%' : '100%',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isZoomed ? '0' : 'var(--space-4, 16px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: isZoomed ? 'none' : '1200px', maxHeight: isZoomed ? 'none' : '90vh' }}>
          <Image 
            src={imageUrl}
            alt="Original High Fidelity Asset"
            fill
            style={{ 
              objectFit: 'contain',
              transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            unoptimized={true}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95) translateY(10px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .animate-zoom-in { animation: zoomIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};
