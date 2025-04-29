import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkingpage.css';
import Header from '../../components/common/Header';
import roomImage from '../../assets/room-main.png';
import { FaInfoCircle, FaWifi, FaChalkboard, FaSnowflake } from 'react-icons/fa';

const CheckingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomData = location.state?.roomData || {
    name: 'Phòng B1-201',
    capacity: 2,
    size: 25,
    checkIn: 'Sunday, March 19, 2023 - 09:00',
    checkOut: 'Sunday, March 19, 2023 - 10:00',
    duration: '2 tiếng',
    image: roomImage
  };

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    studentId: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Vui lòng nhập tên';
    if (!formData.lastName.trim()) newErrors.lastName = 'Vui lòng nhập họ';
    if (!formData.email.trim()) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert('Đặt phòng thành công!');
    navigate('/myroom');
  };

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <div className="checking-page">
      <Header />

      <main className="main-content">
        <div className="checkout-container">
          <h2 className="checkout-title">Secure your reservation</h2>

          <div className="room-info-bar">
            <FaInfoCircle className="info-icon" />
            <p>{roomData.name}, Cỡ: {roomData.capacity} người - {roomData.size} m²</p>
          </div>

          <div className="checkout-content">
            <div className="booking-form-container">
              <h3>Thông tin đặt phòng</h3>
              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="firstName">Tên</label>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'error' : ''} />
                  {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">Họ</label>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'error' : ''} />
                  {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="email">Mail</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'error' : ''} />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="studentId">MSSV (nếu có)</label>
                  <input type="text" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} />
                </div>

                <div className="form-actions">
                  <button type="button" onClick={handleGoBack} className="back-button">Quay lại</button>
                  <button type="submit" className="complete-booking-button">Complete Booking</button>
                </div>
              </form>
            </div>

            <div className="room-summary">
              <div className="room-image">
                <img src={roomData.image} alt={roomData.name} />
              </div>
              <h3>{roomData.name}</h3>
              <div className="booking-details">
                <div className="booking-detail">
                  <span className="detail-label">Check-in:</span>
                  <span className="detail-value">{roomData.checkIn}</span>
                </div>
                <div className="booking-detail">
                  <span className="detail-label">Check-out:</span>
                  <span className="detail-value">{roomData.checkOut}</span>
                </div>
                <div className="booking-duration">{roomData.duration}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckingPage;