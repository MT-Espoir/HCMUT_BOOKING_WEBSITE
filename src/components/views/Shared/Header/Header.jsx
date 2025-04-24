import React, { useState } from 'react';
import './Header.css';
import logoIcon from '../../../assests/logo.png';
import userAvatar from '../../../assests/avatar.jpg';
import { FaBell } from 'react-icons/fa';
import NotificationPanel from '../NotificationPanel/NotificationPanel';

const Header = ({ navigateTo }) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const handleMyRooms = () => {
    navigateTo('myroom');
  };

  return (
    <header className="header">
      <div className="logo-container">
        <img src={logoIcon} alt="HCMUT Booking Room Logo" className="logo" />
        <h1>HCMUT Booking Room</h1>
      </div>

      <nav className="main-nav">
        <ul>
          <li><a href="#" onClick={() => navigateTo('booking')}>Home</a></li>
          <li><a href="#">Discover</a></li>
          <li><a href="#" onClick={handleMyRooms}>My Rooms</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
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
