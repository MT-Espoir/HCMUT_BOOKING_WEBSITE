import React from 'react';
import Header from '../../components/common/Header';
import MainContent from './MainContent';
import './MainPage.css';
import logo from '../../assets/logo.png';

const MainPage = () => {
  return (
    <div className="main-page">
      <Header />
      <MainContent />
      
      {/* Footer */}
      <footer className="Afooter">
        <div className="Acontainer">
          <div className="Afooter-content">
            <div className="Afooter-logo">
              <img src={logo} alt="HCMUT Logo" />
              <div className="Afooter-name">
                <h3>Trường Đại học Bách Khoa - ĐHQG TP.HCM</h3>
                <p>Ho Chi Minh City University of Technology (HCMUT)</p>
              </div>
            </div>
            <div className="Afooter-links">
              <div className="Afooter-col">
                <h4>Liên kết nhanh</h4>
                <ul>
                  <li><a href="/home" className="Aactive">Trang chủ</a></li>
                  <li><a href="/about">Giới thiệu</a></li>
                  <li><a href="/room-search">Tìm phòng</a></li>
                  <li><a href="/guide">Hướng dẫn</a></li>
                </ul>
              </div>
              <div className="Afooter-col">
                <h4>Dành cho</h4>
                <ul>
                  <li><a href="/student">Sinh viên</a></li>
                  <li><a href="/teacher">Giảng viên</a></li>
                  <li><a href="/manager">Quản lý</a></li>
                </ul>
              </div>
              <div className="Afooter-col">
                <h4>Chính sách</h4>
                <ul>
                  <li><a href="/privacy">Quyền riêng tư</a></li>
                  <li><a href="/terms">Điều khoản sử dụng</a></li>
                  <li><a href="/faq">FAQ</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="Afooter-bottom">
            <p>&copy; {new Date().getFullYear()} Hệ thống Đặt Phòng Học Trực Tuyến - Đại học Bách Khoa TP.HCM</p>
            <p>Website: <a href="https://www.hcmut.edu.vn" target="_blank" rel="noreferrer">https://www.hcmut.edu.vn</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainPage;
