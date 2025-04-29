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
    <div className="C-checking-page">
      <Header />

      <main className="C-main-content">
        <div className="C-checkout-container">
          <h2 className="C-checkout-title">Secure your reservation</h2>

          <div className="C-room-info-bar">
            <FaInfoCircle className="C-info-icon" />
            <p>{roomData.name}, Cỡ: {roomData.capacity} người - {roomData.size} m²</p>
          </div>

          <div className="C-checkout-content">
            <div className="C-booking-form-container">
              <h3>Thông tin đặt phòng</h3>
              <form className="C-booking-form" onSubmit={handleSubmit}>
                <div className="C-form-group">
                  <label htmlFor="firstName">Tên</label>
                  <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? 'C-error' : ''} />
                  {errors.firstName && <span className="C-error-message">{errors.firstName}</span>}
                </div>

                <div className="C-form-group">
                  <label htmlFor="lastName">Họ</label>
                  <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? 'C-error' : ''} />
                  {errors.lastName && <span className="C-error-message">{errors.lastName}</span>}
                </div>

                <div className="C-form-group">
                  <label htmlFor="email">Mail</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className={errors.email ? 'C-error' : ''} />
                  {errors.email && <span className="C-error-message">{errors.email}</span>}
                </div>

                <div className="C-form-group">
                  <label htmlFor="studentId">MSSV (nếu có)</label>
                  <input type="text" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} />
                </div>

                <div className="C-form-actions">
                  <button type="button" onClick={handleGoBack} className="C-back-button">Quay lại</button>
                  <button type="submit" className="C-complete-booking-button">Complete Booking</button>
                </div>
              </form>
            </div>

            <div className="C-room-summary">
              <div className="C-room-image">
                <img src={roomData.image} alt={roomData.name} />
              </div>
              <h3>{roomData.name}</h3>
              <div className="C-booking-details">
                <div className="C-booking-detail">
                  <span className="C-detail-label">Check-in:</span>
                  <span className="C-detail-value">{roomData.checkIn}</span>
                </div>
                <div className="C-booking-detail">
                  <span className="C-detail-label">Check-out:</span>
                  <span className="C-detail-value">{roomData.checkOut}</span>
                </div>
                <div className="C-booking-duration">{roomData.duration}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckingPage;