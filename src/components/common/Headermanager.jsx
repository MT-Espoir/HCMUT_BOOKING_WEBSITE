import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Headermanager.css';
import logoIcon from '../../assets/logo.png';
import userAvatar from '../../assets/avatar.jpg';
import { FaBell, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const Headermanager = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Thêm hook useLocation để theo dõi đường dẫn hiện tại
  const { user, logout, isAuthenticated } = useAuth();
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const managementLinks = [
    { path: '/manager', title: 'Quản lý người dùng' },
    { path: '/manager-system', title: 'Quản lý quyền hệ thống' },
    { path: '/manager-device', title: 'Quản lý thiết bị' },
    { path: '/user-verification', title: 'Xác thực người dùng' },
    { path: '/usage-report', title: 'Báo cáo sử dụng' }
  ];

  // Hàm kiểm tra xem link có đang active không
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header-manager">
      <div className="logo-container">
        <img src={logoIcon} alt="HCMUT Logo" className="bk-logo" />
        <div className="logo-text">
          <span className="logo-title">HCMUT</span>
          <span className="logo-subtitle">Admin Dashboard</span>
        </div>
      </div>

      <nav className="manager-nav">
        <ul>
          {managementLinks.map((link, index) => (
            <li key={index}>
              <Link 
                to={link.path} 
                className={isActive(link.path) ? 'active' : ''}
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="user-actions">
        {isAuthenticated && (
          <>
            <div className="notification-icon">
              <FaBell />
              <span className="notification-badge">3</span>
            </div>

            <div className="user-info" ref={userMenuRef}>
              <div className="avatar-container">
                <img 
                  src={userAvatar} 
                  alt="User" 
                  className="avatar" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                />
                <span className="user-name">{user?.name || 'Admin'}</span>
                <FaChevronDown className="dropdown-icon" onClick={() => setShowUserMenu(!showUserMenu)} />
                
                {showUserMenu && (
                  <div className="user-dropdown-menu">
                    <div className="user-dropdown-item" onClick={() => navigate('/home')}>
                      Về trang chủ
                    </div>
                    <div className="user-dropdown-item" onClick={handleLogout}>
                      Đăng xuất
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Headermanager;