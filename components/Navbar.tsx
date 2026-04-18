'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { NotificationBell } from './NotificationBell';
import { Search, X } from 'lucide-react';

export const Navbar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  // Sync internal state with URL params
  useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  const showSearch = pathname === '/' || pathname === '/prompts' || pathname === '/collections';

  const handleSearchChange = (val: string) => {
    setSearchValue(val);
    const params = new URLSearchParams(searchParams.toString());
    if (val.trim()) {
      params.set('search', val);
    } else {
      params.delete('search');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className="site-nav">
      <div className="site-container" style={{ height: '100%', width: '100%' }}>
        <div className="flex-between" style={{ height: '100%' }}>
          {/* MOBILE SEARCH OVERLAY */}
          {isMobileSearchOpen && (
            <div style={{ 
              position: 'absolute', inset: 0, backgroundColor: 'white', zIndex: 1100,
              display: 'flex', alignItems: 'center', padding: '0 var(--space-4)'
            }}>
              <Search size={18} color="var(--color-primary)" style={{ marginRight: '12px' }} />
              <input 
                autoFocus
                type="text" 
                placeholder="Search prompts..." 
                className="nav-search-input" 
                value={searchValue}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none' }}
              />
              <button 
                onClick={() => setIsMobileSearchOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', marginLeft: '12px' }}
              >
                <X size={20} />
              </button>
            </div>
          )}

          {/* LOGO */}
          <Link href="/" className="nav-logo" style={{ fontSize: '1.25rem', margin: 0 }}>
            Prompt <span style={{ color: 'var(--color-primary)' }}>AI</span>
          </Link>

          {/* DESKTOP SEARCH & LINKS */}
          <div className="flex-row" style={{ flex: 1, justifyContent: 'center', margin: '0 20px' }}>
            {showSearch && (
              <>
                <div className="nav-search-container hide-mobile" style={{ maxWidth: '300px', width: '100%' }}>
                  <Search size={16} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    className="nav-search-input" 
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
                {/* Mobile Search Trigger */}
                <button 
                  className="md-hidden"
                  onClick={() => setIsMobileSearchOpen(true)}
                  style={{ background: 'var(--color-bg)', border: 'none', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Search size={18} color="var(--color-text-primary)" />
                </button>
              </>
            )}
            
            <div className="flex-row hide-mobile" style={{ marginLeft: showSearch ? '20px' : '0', gap: '8px' }}>
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/guide" className="nav-link">Guide</Link>
              {user && (
                <>
                  <Link href="/collections" className="nav-link">My Collection</Link>
                  <Link href="/my-prompts" className="nav-link">My Prompts</Link>
                </>
              )}
            </div>
          </div>

          {/* USER ACTIONS */}
          <div className="flex-row" style={{ gap: 'var(--space-4)' }}>
            {!user ? (
              <div className="flex-row" style={{ gap: 'var(--space-3)' }}>
                <Link href="/login" className="nav-link hide-mobile" style={{ fontSize: '0.85rem' }}>Login</Link>
                <Link 
                  href="/register"
                  className="btn-base btn-primary btn-sm"
                  style={{ height: '36px', padding: '0 16px', borderRadius: '8px', fontSize: '0.8rem' }}
                >
                  Join
                </Link>
              </div>
            ) : (
              <div className="flex-row" style={{ gap: 'var(--space-4)' }}>
                 <NotificationBell />
                 <Link href="/profile" className="flex-center" style={{ 
                    width: '34px', height: '34px', borderRadius: '50%', overflow: 'hidden', border: '1.5px solid var(--color-border)'
                 }}>
                    {user.avatar ? <img src={user.avatar} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.name.charAt(0)}
                 </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
