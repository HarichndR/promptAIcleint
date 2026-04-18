'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export const HeroSearch = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/prompts?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="hero-search-container">
      <input 
        type="text"
        placeholder="Search prompts (landscape, chat bots, coding help...)"
        className="hero-search-input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="btn-base btn-primary btn-md">
        Search Now
      </button>
    </form>
  );
};
