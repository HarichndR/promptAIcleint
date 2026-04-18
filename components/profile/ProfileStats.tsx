'use client';

import React from 'react';

interface ProfileStatsProps {
  promptsCount: number;
  savedCount: number;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ promptsCount, savedCount }) => {
  return (
    <div className="flex-row" style={{ gap: 'var(--space-4)', flexWrap: 'wrap', marginTop: '-40px', position: 'relative', zIndex: 10 }}>
      <div className="stat-pill glass-card-premium">
        <span className="stat-value">{promptsCount}</span>
        <span className="stat-label">Authored</span>
      </div>
      <div className="stat-pill glass-card-premium">
        <span className="stat-value">{savedCount}</span>
        <span className="stat-label">Saved Items</span>
      </div>
      <div className="stat-pill glass-card-premium">
        <span className="stat-value">Top 5%</span>
        <span className="stat-label">Community</span>
      </div>
    </div>
  );
};
