import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/header/dashboard-header';
import Sidebar from '@/components/dashboard/dashboard/common/Sidebar';
import Footer from '@/components/dashboard/dashboard/common/Footer';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [typeFilter, setTypeFilter] = useState('all');
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user.user_id || user.id;

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchNotifications();
  }, [userId]);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/notifications/${userId}?limit=100`);
      const data = await response.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.is_read) {
      try {
        await fetch(`${API_BASE}/api/notifications/${notification.id}/read`, {
          method: 'PATCH'
        });
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n)
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Navigate to action URL
    if (notification.action_url) {
      navigate(notification.action_url);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch(`${API_BASE}/api/notifications/${userId}/read-all`, {
        method: 'PATCH'
      });
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!confirm('Delete this notification?')) return;
    
    try {
      await fetch(`${API_BASE}/api/notifications/${notificationId}`, {
        method: 'DELETE'
      });
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'readiness_outdated':
        return '🔄';
      case 'mentor_validation':
        return '✅';
      case 'roadmap_updated':
        return '🗺️';
      case 'role_changed':
        return '🎯';
      default:
        return '📢';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'readiness_outdated':
        return 'Readiness';
      case 'mentor_validation':
        return 'Validation';
      case 'roadmap_updated':
        return 'Roadmap';
      case 'role_changed':
        return 'Role Change';
      default:
        return 'General';
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.is_read) return false;
    if (filter === 'read' && !n.is_read) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <>
      <div className="header-margin"></div>
      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            {/* Page Header */}
            <div className="row y-gap-20 justify-between items-end pb-40 lg:pb-40 md:pb-32">
              <div className="col-auto">
                <h1 className="text-30 lh-14 fw-600">Notifications</h1>
                <div className="text-15 text-light-1">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'All caught up!'}
                </div>
              </div>
              {unreadCount > 0 && (
                <div className="col-auto">
                  <button
                    onClick={handleMarkAllRead}
                    className="button -sm -blue-1 bg-blue-1-05 text-blue-1"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>

            {/* Filters */}
            <div className="row pb-30">
              <div className="col-12">
                <div className="bg-white rounded-8 px-30 py-20 shadow-sm">
                  <div className="row x-gap-20 y-gap-20">
                    {/* Status Filter */}
                    <div className="col-auto">
                      <div className="d-flex gap-2">
                        <button
                          onClick={() => setFilter('all')}
                          className={`button -sm ${filter === 'all' ? '-blue-1 bg-blue-1 text-white' : '-blue-1-05 text-blue-1'}`}
                        >
                          All
                        </button>
                        <button
                          onClick={() => setFilter('unread')}
                          className={`button -sm ${filter === 'unread' ? '-blue-1 bg-blue-1 text-white' : '-blue-1-05 text-blue-1'}`}
                        >
                          Unread
                        </button>
                        <button
                          onClick={() => setFilter('read')}
                          className={`button -sm ${filter === 'read' ? '-blue-1 bg-blue-1 text-white' : '-blue-1-05 text-blue-1'}`}
                        >
                          Read
                        </button>
                      </div>
                    </div>

                    {/* Type Filter */}
                    <div className="col-auto">
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="form-select"
                        style={{
                          padding: '8px 12px',
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0',
                          fontSize: '14px'
                        }}
                      >
                        <option value="all">All Types</option>
                        <option value="readiness_outdated">Readiness</option>
                        <option value="mentor_validation">Validation</option>
                        <option value="roadmap_updated">Roadmap</option>
                        <option value="role_changed">Role Change</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="row">
              <div className="col-12">
                {isLoading ? (
                  <div className="text-center py-60">
                    <div className="spinner-border text-blue-1" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                ) : filteredNotifications.length === 0 ? (
                  <div className="bg-white rounded-8 px-30 py-60 text-center">
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
                    <h3 className="text-20 fw-600 mb-10">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </h3>
                    <p className="text-15 text-light-1">
                      {filter === 'unread'
                        ? 'You\'re all caught up!'
                        : 'Notifications will appear here when there are updates.'}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-8 overflow-hidden shadow-sm">
                    {filteredNotifications.map((notification, index) => (
                      <div
                        key={notification.id}
                        style={{
                          padding: '20px 30px',
                          borderBottom: index < filteredNotifications.length - 1 ? '1px solid #f1f5f9' : 'none',
                          backgroundColor: notification.is_read ? 'white' : '#f0f7ff',
                          transition: 'background-color 0.2s'
                        }}
                      >
                        <div className="row items-center">
                          {/* Icon */}
                          <div className="col-auto">
                            <div
                              style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '24px',
                                backgroundColor: notification.is_read ? '#f8fafc' : '#dbeafe'
                              }}
                            >
                              {getTypeIcon(notification.type)}
                            </div>
                          </div>

                          {/* Content */}
                          <div className="col">
                            <div className="d-flex align-items-center gap-2 mb-5">
                              <span className="badge bg-light-1 text-dark-1 text-11 fw-500 px-10 py-5">
                                {getTypeLabel(notification.type)}
                              </span>
                              {!notification.is_read && (
                                <span
                                  style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: '#5693C1'
                                  }}
                                />
                              )}
                              <span className="text-13 text-light-1">
                                {formatTime(notification.created_at)}
                              </span>
                            </div>
                            <h4
                              className="text-16 fw-600 mb-5"
                              style={{ fontWeight: notification.is_read ? 500 : 600 }}
                            >
                              {notification.title}
                            </h4>
                            <p className="text-14 text-light-1 mb-0">
                              {notification.message}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="col-auto">
                            <div className="d-flex gap-2">
                              {notification.action_url && (
                                <button
                                  onClick={() => handleNotificationClick(notification)}
                                  className="button -sm -blue-1 bg-blue-1 text-white"
                                  title="Take action"
                                >
                                  Take Action
                                </button>
                              )}
                              {!notification.is_read && (
                                <button
                                  onClick={() => handleNotificationClick(notification)}
                                  className="button -sm -blue-1-05 text-blue-1"
                                  title="Mark as read"
                                >
                                  Mark Read
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteNotification(notification.id)}
                                className="button -sm -red-1-05 text-red-1"
                                title="Delete"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
