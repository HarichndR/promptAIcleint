'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MobileBottomNav } from "@/components/MobileBottomNav";

export const ConditionalLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
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
      {!isAdminPath && (
        <>
          <Footer />
          <MobileBottomNav />
        </>
      )}
    </>
  );
};
