import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logoIcon from '../../assets/logo.png';
import userAvatar from '../../assets/avatar.jpg';
import { FaBell } from 'react-icons/fa';
import NotificationPanel from './NotificationPanel';

const Header = () => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleMyRooms = () => {
    navigate('/myroom');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logoIcon} alt="HCMUT Booking Room Logo" className="logo" />
        <h1>HCMUT Booking Room</h1>
      </div>

      <nav className="main-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="#">Discover</Link></li>
          <li><Link to="/myroom">MyRooms</Link></li>
          <li><Link to="#">About</Link></li>
          <li><Link to="#">Contact</Link></li>
        </ul>
      </nav>

      <div className="user-actions">
        <div className="notification-icon" onClick={() => setShowNotifications(!showNotifications)}>
          <FaBell />
          <span className="notification-badge">3</span>
        </div>
        <div className="avatar">
          <img src={userAvatar} alt="User" />
        </div>
      </div>

      {showNotifications && <NotificationPanel />}
    </header>
  );
};

export default Header;
