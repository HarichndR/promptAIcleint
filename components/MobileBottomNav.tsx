'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bookmark, User, PenTool } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const { user, isAdmin } = useAuth();

  // Only show for logged-in, non-admin users
  if (!user || isAdmin) return null;

  return (
    <nav className="mobile-bottom-nav">
      <Link href="/prompts" className={`mobile-nav-item ${(pathname === '/prompts' || pathname === '/') ? 'active' : ''}`}>
        <Home size={20} />
        <span>Home</span>
      </Link>

      <Link href="/my-prompts" className={`mobile-nav-item ${pathname === '/my-prompts' ? 'active' : ''}`}>
        <PenTool size={20} />
        <span>My Prompts</span>
      </Link>

      <Link href="/collections" className={`mobile-nav-item ${pathname === '/collections' ? 'active' : ''}`}>
        <Bookmark size={20} />
        <span>Saved</span>
      </Link>

      <Link href="/profile" className={`mobile-nav-item ${pathname === '/profile' ? 'active' : ''}`}>
        <User size={20} />
        <span>Profile</span>
      </Link>
    </nav>
  );
};
