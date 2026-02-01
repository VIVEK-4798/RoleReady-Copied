/**
 * ============================================================================
 * CONTEXTUAL NOTIFICATION BANNER
 * ============================================================================
 * Purpose: Display contextual banners on relevant pages based on notifications
 * 
 * Usage:
 * <NotificationBanner 
 *   userId={123}
 *   types={['readiness_outdated', 'mentor_validation']}
 *   onDismiss={(notificationId) => handleDismiss(notificationId)}
 * />
 * 
 * Features:
 * - Shows unread notifications relevant to current page
 * - Dismissable (marks as read)
 * - Links to action URL
 * - Non-intrusive design
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Banner style variants based on notification type
const BANNER_STYLES = {
  readiness_outdated: {
    bg: '#fef3c7',
    border: '#f59e0b',
    icon: '🔄',
    textColor: '#92400e'
  },
  mentor_validation: {
    bg: '#d1fae5',
    border: '#10b981',
    icon: '✅',
    textColor: '#065f46'
  },
  roadmap_updated: {
    bg: '#dbeafe',
    border: '#3b82f6',
    icon: '🗺️',
    textColor: '#1e40af'
  },
  role_changed: {
    bg: '#f3e8ff',
    border: '#8b5cf6',
    icon: '🎯',
    textColor: '#5b21b6'
  },
  default: {
    bg: '#f1f5f9',
    border: '#64748b',
    icon: '📢',
    textColor: '#334155'
  }
};

const NotificationBanner = ({ userId, types = [], maxBanners = 2, className = '' }) => {
  const [banners, setBanners] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    fetchContextualNotifications();
  }, [userId, types.join(',')]);

  const fetchContextualNotifications = async () => {
    try {
      const typesParam = types.length > 0 ? `?types=${types.join(',')}` : '';
      const response = await fetch(`${API_BASE}/api/notifications/${userId}/contextual${typesParam}`);
      const data = await response.json();
      
      if (data.success && data.notifications) {
        setBanners(data.notifications.slice(0, maxBanners));
      }
    } catch (error) {
      console.error('Error fetching contextual notifications:', error);
    }
  };

  const handleDismiss = async (notificationId) => {
    try {
      await fetch(`${API_BASE}/api/notifications/${notificationId}/read`, {
        method: 'PATCH'
      });
      setDismissed(prev => new Set([...prev, notificationId]));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  const handleAction = (notification) => {
    handleDismiss(notification.id);
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const visibleBanners = banners.filter(b => !dismissed.has(b.id));

  if (visibleBanners.length === 0) return null;

  return (
    <div className={`notification-banners ${className}`} style={{ marginBottom: '16px' }}>
      {visibleBanners.map((notification) => {
        const style = BANNER_STYLES[notification.type] || BANNER_STYLES.default;
        
        return (
          <div
            key={notification.id}
            style={{
              backgroundColor: style.bg,
              borderLeft: `4px solid ${style.border}`,
              borderRadius: '8px',
              padding: '14px 16px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
            }}
          >
            <span style={{ fontSize: '20px' }}>{style.icon}</span>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontWeight: '600', 
                fontSize: '14px', 
                color: style.textColor,
                marginBottom: '2px'
              }}>
                {notification.title}
              </div>
              <div style={{ 
                fontSize: '13px', 
                color: style.textColor,
                opacity: 0.85,
                lineHeight: '1.4'
              }}>
                {notification.message}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {notification.action_url && (
                <button
                  onClick={() => handleAction(notification)}
                  style={{
                    background: style.border,
                    color: 'white',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Take Action
                </button>
              )}
              <button
                onClick={() => handleDismiss(notification.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: style.textColor,
                  opacity: 0.6,
                  cursor: 'pointer',
                  padding: '4px',
                  fontSize: '16px',
                  lineHeight: 1
                }}
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationBanner;
