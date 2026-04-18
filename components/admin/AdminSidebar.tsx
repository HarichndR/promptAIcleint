'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Sparkles, 
  FolderTree, 
  Users, 
  UserCircle, 
  PlusCircle, 
  ExternalLink,
  ShieldCheck,
  X,
  ArrowLeft
} from 'lucide-react';

import styles from '@/app/admin/Admin.module.css';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Prompts', icon: Sparkles, href: '/admin/prompts' },
  { label: 'Categories', icon: FolderTree, href: '/admin/categories' },
  { label: 'User Base', icon: Users, href: '/admin/users' },
  { label: 'Identity', icon: UserCircle, href: '/admin/profile' },
];


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/prompts', label: 'Prompts', icon: Sparkles },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/profile', label: 'Profile', icon: UserCircle },
  ];

  return (
    <>
      {isOpen && <div className={styles.navOverlay} onClick={onClose} />}
      <aside className={`${styles.adminNav} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-10)' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em' }}>
            COMMAND <span style={{ color: 'var(--color-primary)' }}>CENTER</span>
          </div>
          <button 
            onClick={onClose} 
            className="md-hidden" 
            style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={isActive ? styles.activeNavLink : ''}
                onClick={() => {
                  if (window.innerWidth <= 1024) onClose();
                }}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link href="/" className={styles.backLink}>
          <ArrowLeft size={16} /> Exit to Site
        </Link>
      </aside>
    </>
  );
};
