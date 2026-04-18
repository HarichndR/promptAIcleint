'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bookmark, User, PenTool } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  // Hide only for admins (they have a specific admin dashboard layout)
  if (isAdmin) return null;

  return (
    <nav className="mobile-bottom-nav">
      <Link href="/" className={`mobile-nav-item ${pathname === '/' ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </Link>

      <Link href="/prompts" className={`mobile-nav-item ${(pathname === '/prompts') ? 'active' : ''}`}>
        <PenTool size={20} />
        <span>Explore</span>
      </Link>

      {user ? (
        <>
          <Link href="/collections" className={`mobile-nav-item ${pathname === '/collections' ? 'active' : ''}`}>
            <Bookmark size={20} />
            <span>Saved</span>
          </Link>
          <Link href="/profile" className={`mobile-nav-item ${pathname === '/profile' ? 'active' : ''}`}>
            <User size={20} />
            <span>Profile</span>
          </Link>
        </>
      ) : (
        <>
          <Link href="/login" className={`mobile-nav-item ${pathname === '/login' ? 'active' : ''}`}>
            <User size={20} />
            <span>Login</span>
          </Link>
        </>
      )}
    </nav>
  );
}
