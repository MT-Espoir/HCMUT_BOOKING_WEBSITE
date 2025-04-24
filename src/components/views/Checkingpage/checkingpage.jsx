import React, { useState } from 'react';
import './checkingpage.css';
// Import hình ảnh và icons
import roomMainImg from '../../assests/room-main.png';
import logoIcon from '../../assests/logo.png';
import userAvatar from '../../assests/avatar.jpg';
import { FaUser, FaExpandAlt, FaBell, FaInfoCircle, FaTimes } from 'react-icons/fa';

const CheckingPage = ({ navigateTo }) => {
  // State cho form
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    studentId: ''
  });
  
  // State cho lỗi
  const [errors, setErrors] = useState({});
  
  // Hàm xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Xóa lỗi khi người dùng sửa
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  // Hàm validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vui lòng nhập tên';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Vui lòng nhập họ';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    return newErrors;
  };
  
  // Hàm xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Gửi dữ liệu đặt phòng
    alert('Đặt phòng thành công! Xác nhận sẽ được gửi qua email của bạn.');
    // Sau khi đặt phòng thành công, chuyển đến trang My Room
    navigateTo('myroom');
  };
  
  // Hàm quay lại trang booking - đã cập nhật để sử dụng props navigateTo
  const handleGoBack = () => {
    navigateTo('booking');
  };

  // Hàm điều hướng đến trang My Rooms
  const handleMyRooms = () => {
    navigateTo('myroom');
  };

  return (
    <div className="checking-page">
      {/* Header Component */}
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
          <div className="notification-icon">
            <FaBell />
            <span className="notification-badge">3</span>
          </div>
          <div className="avatar">
            <img src={userAvatar} alt="User" />
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="main-content">
        <div className="checkout-container">
          <h2 className="checkout-title">Secure your reservation</h2>
          
          <div className="room-info-bar">
            <FaInfoCircle className="info-icon" />
            <span>Phòng T1, Cỡ 2 - 25m²</span>
          </div>
          
          <div className="checkout-content">
            <div className="booking-form-container">
              <h3>Thông tin đặt phòng</h3>
              
              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="firstName">Tên</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Họ</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="studentId">MSSV (nếu có)</label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button type="button" className="back-button" onClick={handleGoBack}>
                    Quay lại
                  </button>
                  <button type="submit" className="complete-booking-button">
                    Complete Booking
                  </button>
                </div>
              </form>
            </div>
            
            <div className="room-summary">
              <div className="room-image">
                <img src={roomMainImg} alt="Phòng T1" />
              </div>
              
              <h3>Phòng T1</h3>
              
              <div className="booking-details">
                <div className="booking-detail">
                  <span className="detail-label">Check-in:</span>
                  <span className="detail-value">Sunday, March 19, 2023 - 09:00</span>
                </div>
                
                <div className="booking-detail">
                  <span className="detail-label">Check-out:</span>
                  <span className="detail-value">Sunday, March 19, 2023 - 10:00</span>
                </div>
                
                <div className="booking-duration">
                  <span>2 tiếng</span>
                </div>
              </div>
              
              <div className="room-amenities">
                <div className="amenity">
                  <FaUser className="amenity-icon" />
                  <span>Cỡ: 2 người</span>
                </div>
                <div className="amenity">
                  <FaExpandAlt className="amenity-icon" />
                  <span>25 m²</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckingPage;