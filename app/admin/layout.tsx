'use client';

import React, { useState } from 'react';
import styles from './Admin.module.css';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  // 🛡️ ADMIN COMMAND CENTER GUARD
  React.useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/prompts?message=Admin access required');
    }
  }, [loading, isAdmin, router]);

  if (loading) return <div className={styles.loadingOverlay}>Initializing Secure Session...</div>;
  if (!user || !isAdmin) return null;

  return (
    <div className={styles.adminLayout}>
      <header className={styles.mobileHeader}>
        <div style={{ fontWeight: 900, fontSize: '1rem', letterSpacing: '-0.02em' }}>
          COMMAND <span style={{ color: 'var(--color-primary)' }}>CENTER</span>
        </div>
        <button className={styles.hamburger} onClick={() => setIsSidebarOpen(true)}>
          <Menu size={24} color="#0f172a" />
        </button>
      </header>
      
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      
      <main className={styles.adminContent}>
        {children}
      </main>
    </div>
  );
}



