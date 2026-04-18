'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'isomorphic-dompurify';
import styles from './Markdown.module.css';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div className={styles.markdown}>
      <ReactMarkdown>{sanitizedContent}</ReactMarkdown>
    </div>
  );
};
