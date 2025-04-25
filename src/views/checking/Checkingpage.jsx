import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkingpage.css';
import Header from '../../components/common/Header';

const CheckingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
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
    if (!formData.password.trim()) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
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
    navigate('/room-selection');
  };

  return (
    <div className="checking-page">
      <Header />

      <main className="main-content">
        <div className="checkout-container">
          <h2 className="checkout-title">Secure your reservation</h2>

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
              <label htmlFor="password">Mật khẩu</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className={errors.password ? 'error' : ''} />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="studentId">MSSV (nếu có)</label>
              <input type="text" id="studentId" name="studentId" value={formData.studentId} onChange={handleChange} />
            </div>

            <div className="form-actions">
              <button type="button" onClick={handleGoBack} className="back-button">Quay lại</button>
              <button type="submit" className="complete-booking-button">Hoàn tất</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default CheckingPage;
