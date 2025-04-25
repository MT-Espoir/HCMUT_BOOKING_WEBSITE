import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoIcon from '../../assets/logo.png';
import userAvatar from '../../assets/avatar.jpg';
import { FaBell } from 'react-icons/fa';
import NotificationPanel from './NotificationPanel';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
<div className="logo-container">
  <img src={logoIcon} alt="HCMUT Logo" className="bk-logo" />
  <div className="logo-text">
    <span className="logo-title">HCMUT</span>
    <span className="logo-subtitle">Booking room</span>
  </div>
</div>

      <nav className="main-nav">
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/room-search">Tìm phòng</Link></li>
          <li><Link to="/myroom">My Rooms</Link></li>
          <li><Link to="#">About</Link></li>
          <li><Link to="#">Contact</Link></li>
        </ul>
      </nav>

      <div className="user-actions">
        {isAuthenticated && (
          <>
            <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
              <FaBell />
              <span className="notification-badge">3</span>
            </div>

            <div className="user-info">
              <img src={userAvatar} alt="User" className="avatar" />

              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          </>
        )}
      </div>

      {showNotifications && <NotificationPanel />}
    </header>
  );
};

export default Header;
