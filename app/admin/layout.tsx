'use client';

import React, { useState } from 'react';
import styles from './Admin.module.css';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Menu } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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



