// src/layouts/GuestLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';
import './GuestLayout.css'; // Import CSS styles for GuestLayout


const GuestLayout = () => {
  return (
    <div className="guest-layout">
      {/* Header riêng cho guest */}
      <header className="guest-header">
      
      <div className="logo-container">
  <img src={logo} alt="HCMUT Logo" className="bk-logo" />
  <div className="logo-text">
    <span className="logo-title">HCMUT</span>
    <span className="logo-subtitle">Booking room</span>
  </div>
</div>
        <nav>
          <a href="/">Trang chủ</a>
          <a href="/guest">Giới thiệu</a>
          <a href="/login">Đăng nhập</a>
        </nav>
      </header>

      {/* Phần nội dung con */}
      <main>
        <Outlet />
      </main>

      <footer className="guest-footer">
        <p>© 2025 HCMUT. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default GuestLayout;
