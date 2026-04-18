'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const ConditionalLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();
  const isAdminPath = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPath && <Navbar />}
      <main style={{ 
        minHeight: isAdminPath ? '100vh' : 'calc(100vh - 76px - 400px)',
        backgroundColor: isAdminPath ? '#f1f5f9' : 'transparent' 
      }}>
        {children}
      </main>

      {/* 🛡️ GLOBAL ADMIN REDIRECT BUTTON */}
      {isAdmin && !isAdminPath && (
        <Link 
          href="/admin" 
          className="admin-floating-fab animate-reveal"
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '24px',
            zIndex: 1500,
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: 800,
            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)',
            textDecoration: 'none',
            border: '1.5px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}
          // Interactive Hover Effect Logic
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(37, 99, 235, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(37, 99, 235, 0.4)';
          }}
        >
          <ShieldCheck size={18} />
          <span>ADMIN PANEL</span>
        </Link>
      )}

      {!isAdminPath && (
        <>
          <Footer />
          <MobileBottomNav />
        </>
      )}
    </>
  );
};
