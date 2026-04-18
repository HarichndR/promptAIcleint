'use client';

import React from 'react';
import styles from './Select.module.css';

interface Option {
  id: string;
  name: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, ...props }) => {
  return (
    <div className={styles.wrapper}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.selectContainer}>
        <select className={`${styles.select} ${error ? styles.errorInput : ''}`} {...props}>
          <option value="">Select a category</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        <span className={styles.arrow}>▾</span>
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};
