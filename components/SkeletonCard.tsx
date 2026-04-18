import React from 'react';
import styles from './SkeletonCard.module.css';

export const SkeletonCard: React.FC = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.image}></div>
      <div className={styles.content}>
        <div className={styles.category}></div>
        <div className={styles.title}></div>
        <div className={styles.description}></div>
        <div className={styles.footer}>
          <div className={styles.btn}></div>
          <div className={styles.btn}></div>
        </div>
      </div>
    </div>
  );
};
