'use client';

import React from 'react';
import { Category } from '../types';

interface CategoryTabsProps {
  categories?: Category[];
  activeCategory?: string | null;
  onSelect?: (id: string | null) => void;
  userInterests?: string[]; // Phase 7: Interest-based sorting
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories = [],
  activeCategory = null,
  onSelect = () => {},
  userInterests = [],
}) => {
  // Sort categories: user's interest categories come first
  const sortedCategories = userInterests.length > 0
    ? [
        ...categories.filter(c => userInterests.includes(c._id)),
        ...categories.filter(c => !userInterests.includes(c._id)),
      ]
    : categories;

  return (
    <div className="category-scroller">
      <button
        className={`category-btn ${activeCategory === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        {userInterests.length > 0 ? '✦ For You' : 'All Prompts'}
      </button>
      {sortedCategories.map((cat) => {
        const isInterest = userInterests.includes(cat._id);
        return (
          <button
            key={cat._id}
            className={`category-btn ${activeCategory === cat._id ? 'active' : ''}`}
            onClick={() => onSelect(cat._id)}
            style={isInterest && activeCategory !== cat._id ? { borderColor: 'rgba(37,99,235,0.3)', color: 'var(--color-primary)' } : {}}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
