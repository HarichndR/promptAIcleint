'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bookmark, User, PenTool } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const { user, isAdmin, openAuthModal } = useAuth();

  const handleProtectedClick = (e: React.MouseEvent, href: string) => {
    if (!user) {
      e.preventDefault();
      openAuthModal('login', 'Please login to access this feature');
    }
  };

  // Hide on auth pages and for admins
  const isAuthPage = pathname === '/login' || pathname === '/register';
  if (isAdmin || isAuthPage) return null;

  return (
    <nav className="mobile-bottom-nav">
      <div className="site-container flex-row" style={{ height: '100%', width: '100%', padding: '0 var(--space-2)' }}>
        <Link href="/" className={`mobile-nav-item ${pathname === '/' ? 'active' : ''}`}>
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link
          href="/my-prompts"
          onClick={(e) => handleProtectedClick(e, '/my-prompts')}
          className={`mobile-nav-item ${pathname === '/my-prompts' ? 'active' : ''}`}
        >
          <PenTool size={20} />
          <span>My Prompts</span>
        </Link>

        <Link
          href="/collections"
          onClick={(e) => handleProtectedClick(e, '/collections')}
          className={`mobile-nav-item ${pathname === '/collections' ? 'active' : ''}`}
        >
          <Bookmark size={20} />
          <span>Saved</span>
        </Link>

        <Link
          href="/profile"
          onClick={(e) => handleProtectedClick(e, '/profile')}
          className={`mobile-nav-item ${pathname === '/profile' ? 'active' : ''}`}
        >
          <User size={20} />
          <span>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
