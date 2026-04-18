'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Sparkles,
  PenTool,
  Bookmark,
  UserCircle,
  Tag,
  ShieldCheck,
  X,
  LogOut
} from 'lucide-react';

import styles from '@/app/admin/Admin.module.css';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Prompts', icon: Sparkles, href: '/admin/prompts' },
  { label: 'Categories', icon: Tag, href: '/admin/categories' },
  { label: 'My Prompts', icon: PenTool, href: '/admin/my-prompts' },
  { label: 'Saved', icon: Bookmark, href: '/admin/collections' },
  { label: 'Profile', icon: UserCircle, href: '/admin/profile' },
];


interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <>
      {isOpen && <div className={styles.navOverlay} onClick={onClose} />}
      <aside className={`${styles.adminNav} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className="flex-between" style={{ marginBottom: 'var(--space-12)' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.05em', color: 'var(--color-admin-text)' }}>
            COMMAND <span style={{ color: 'var(--color-admin-accent)' }}>CENTER</span>
          </div>
          <button
            onClick={onClose}
            className="md-hidden"
            style={{ background: 'transparent', border: 'none', color: 'var(--color-admin-text)', cursor: 'pointer' }}
          >
            <X size={24} />
          </button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
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

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-admin-border)', paddingTop: '24px' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              width: '100%',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
              color: '#ef4444',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <LogOut size={16} />
            Logout Command Session
          </button>
        </div>
      </aside>
    </>
  );
};
