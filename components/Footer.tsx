import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-grid">
          <div className="footer-col">
            <Link href="/" className="nav-logo" style={{ marginBottom: 'var(--space-6)', display: 'block' }}>
              Prompt<span>AI</span>
            </Link>
            <p style={{ maxWidth: '300px' }}>
              The world's premier library for high-quality, community-tested AI prompts. 
              Unlock your creativity and productivity with precisely engineered instructions.
            </p>
          </div>
          <div className="footer-col">
            <h4>Platform</h4>
            <Link href="/prompts" className="footer-link">Explore Prompts</Link>
            <Link href="/guide" className="footer-link">Writing Guide</Link>
            <Link href="/collections" className="footer-link">Saved Items</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <Link href="/help" className="footer-link">Help Center</Link>
            <Link href="/terms" className="footer-link">Terms of Service</Link>
            <Link href="/privacy" className="footer-link">Privacy Policy</Link>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <Link href="/blog" className="footer-link">Blog & News</Link>
            <Link href="/twitter" className="footer-link">Follow on X</Link>
            <Link href="/discord" className="footer-link">Join Discord</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} PromptAI Platform. All rights reserved.</p>
          <div className="flex-row" style={{ gap: 'var(--space-6)' }}>
            <span>Built by the community, for the community.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
