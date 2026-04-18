'use client';

import React from 'react';

export type ProfileTab = 'general' | 'interests' | 'activity';

interface ProfileTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'general', label: 'General Identity' },
    { id: 'interests', label: 'Curation Vault' },
    { id: 'activity', label: 'Your Activity' },
  ];

  return (
    <div className="tab-nav">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id as ProfileTab)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
