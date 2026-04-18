'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';

interface CopyButtonProps {
  text: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button variant="outline" onClick={handleCopy} style={{ minWidth: '100px' }}>
      {copied ? '✓ Copied!' : 'Copy Prompt'}
    </Button>
  );
};
