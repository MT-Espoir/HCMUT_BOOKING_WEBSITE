import React, { useState } from 'react';
import './NotificationPanel.css'; 
import avatarIcon from '../../assets/avatar.jpg'; // Đổi nếu dùng avatar khác

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Hệ thống',
      time: 'Cách đây 1 giờ',
      content: `Kính gửi sinh viên A,\nHệ thống tự động giải phóng phòng học...`,
      expanded: false
    },
    {
      id: 2,
      title: 'Hệ thống',
      time: 'Cách đây 2 giờ',
      content: `Hệ thống quản lý xin trân trọng thông báo về việc thay đổi phòng học...`,
      expanded: false
    }
  ]);

  const toggleNotification = (id) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, expanded: !n.expanded } : n
      )
    );
  };

  return (
    <div className="notification-panel">
      <h3>Thông báo</h3>
      {notifications.map(n => (
        <div className="notification-card" key={n.id}>
          <div className="notification-header">
            <img src={avatarIcon} alt="System" className="avatar" />
            <div className="info">
              <strong>{n.title}</strong>
              <p>{n.time}</p>
            </div>
            <button className="view-btn" onClick={() => toggleNotification(n.id)}>
              {n.expanded ? 'Ẩn' : 'Xem'}
            </button>
          </div>
          {n.expanded && (
            <div className="notification-body">
              <pre>{n.content}</pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationPanel;
