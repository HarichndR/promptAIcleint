import React from 'react';
import styles from './ui.module.css';

interface BadgeProps {
  children: React.ReactNode;
  variant: 'pending' | 'approved';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant }) => {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {children}
    </span>
  );
};
