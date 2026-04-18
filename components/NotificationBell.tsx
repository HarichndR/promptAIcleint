'use client';

import React, { useState, useEffect, useRef } from 'react';
import { notificationApi } from '@/services/api';
import type { Notification as AppNotification } from '@/types';
import { Bell } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await notificationApi.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      notificationApi.markAsRead();
      setUnreadCount(0);
    }
  };

  const getMessage = (notif: AppNotification) => {
    switch (notif.type) {
      case 'liked': return <span><strong>{notif.actorName}</strong> liked your prompt <strong>{notif.promptId?.title}</strong></span>;
      case 'commented': return <span><strong>{notif.actorName}</strong> commented on <strong>{notif.promptId?.title || 'your prompt'}</strong></span>;
      case 'prompt_approved': return <span>Your prompt <strong>{notif.promptId?.title}</strong> has been <strong>approved</strong>!</span>;
      case 'new_submission': return <span>New submission: {notif.promptId?.title || 'Unknown Prompt'}</span>;
      default: return 'New activity';
    }
  };

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button 
        onClick={handleToggle}
        className="flex-center"
        style={{ 
          background: 'none', border: 'none', cursor: 'pointer', padding: 'var(--space-2)',
          fontSize: '1.25rem', position: 'relative', color: 'var(--color-text-secondary)'
        }}
        aria-label="Notifications"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', top: '2px', right: '2px', backgroundColor: 'var(--color-error)',
            color: 'white', fontSize: '0.625rem', fontWeight: 800, padding: '2px 5px',
            borderRadius: '10px', minWidth: '18px', border: '2px solid white'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="clean-border" style={{ 
          position: 'absolute', top: 'calc(100% + 12px)', right: 0, width: '320px',
          backgroundColor: 'white', zIndex: 1000, borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)', overflow: 'hidden', animation: 'revealUp 0.2s ease-out'
        }}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--color-border)', fontWeight: 800, fontSize: '0.875rem' }}>
            Notifications
          </div>
          <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  style={{ 
                    padding: 'var(--space-4)', borderBottom: '1px solid #f1f5f9',
                    fontSize: '0.8125rem', backgroundColor: notif.isRead ? 'transparent' : 'var(--color-primary-soft)',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{ marginBottom: 'var(--space-1)' }}>{getMessage(notif)}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)' }}>
                     {new Date(notif.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                No recent activity.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
