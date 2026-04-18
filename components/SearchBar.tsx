'use client';

import React, { useState, useEffect } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { Input } from './ui/Input';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, placeholder = 'Search prompts...' }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>🔍</div>
      <Input 
        type="text" 
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={styles.input}
      />
    </div>
  );
};
