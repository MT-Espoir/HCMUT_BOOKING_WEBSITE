import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkingpage.css';
import Header from '../../components/common/Header';
import roomImage from '../../assets/room-main.png';
import { FaInfoCircle, FaWifi, FaChalkboard, FaSnowflake } from 'react-icons/fa';
import { createBooking } from '../../services/api';

const CheckingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  
  // Lấy dữ liệu về phòng và đặt phòng từ location state
  const roomData = location.state?.roomData || {
    name: 'Phòng B1-201',
    capacity: 2,
    size: 25,
    checkIn: 'Sunday, March 19, 2023 - 09:00',
    checkOut: 'Sunday, March 19, 2023 - 10:00',
    duration: '2 tiếng',
    image: roomImage
  };
  
  // Lấy dữ liệu đặt phòng từ location state nếu có
  const bookingDetails = location.state?.bookingDetails || {};
  
  // Format thời gian đặt phòng để hiển thị
  const formatBookingTime = (isoTimeString) => {
    if (!isoTimeString) return '';
    
    try {
      // Tạo đối tượng Date từ chuỗi ISO
      const date = new Date(isoTimeString);
      
      // Lấy các thành phần ngày tháng theo múi giờ địa phương
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // getMonth() trả về 0-11
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      
      // Lấy tên thứ trong tuần
      const weekdayIndex = date.getDay();
      const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const weekday = weekdays[weekdayIndex];
      
      // Định dạng giờ và phút với số 0 ở trước nếu cần
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      
      // Chỉ hiển thị debug log trong môi trường development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Debug format time: ISO=${isoTimeString}, Local components: [${weekday}, ${day}/${month}/${year} - ${formattedHours}:${formattedMinutes}]`);
      }
      
      return `${weekday}, ${day} Tháng ${month} ${year} - ${formattedHours}:${formattedMinutes}`;
    } catch (err) {
      console.error('Error formatting date:', err);
      return isoTimeString;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setApiError('');
      
      // Tạo payload để gửi API
      const bookingPayload = {
        roomId: roomData.id,
        title: `Booking by ${formData.firstName} ${formData.lastName}`,
        purpose: 'General meeting',
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        attendeesCount: bookingDetails.attendeesCount || roomData.capacity || 1,
        notes: `Email: ${formData.email}, Student ID: ${formData.studentId || 'N/A'}`
      };
      
      // Kiểm tra và điều chỉnh định dạng thời gian nếu cần
      if (bookingDetails.startTime && !bookingDetails.startTime.includes('T')) {
        // Nếu thời gian không có định dạng ISO, thì cần chuyển thành ISO
        // Định dạng "2025-05-03 17:00:00" cần thành "2025-05-03T17:00:00"
        bookingPayload.startTime = bookingDetails.startTime.replace(' ', 'T');
      }
      
      if (bookingDetails.endTime && !bookingDetails.endTime.includes('T')) {
        bookingPayload.endTime = bookingDetails.endTime.replace(' ', 'T');
      }
      
      // Đảm bảo rằng đối tượng Date được tạo đúng cách
      try {
        // Kiểm tra lại thời gian sau khi đã điều chỉnh
        const startDate = new Date(bookingPayload.startTime);
        const endDate = new Date(bookingPayload.endTime);
        
        // Nếu startTime hoặc endTime không phải là đối tượng Date hợp lệ, ta tạo lại từ startTimeISO/endTimeISO
        if (isNaN(startDate.getTime()) && bookingDetails.startTimeISO) {
          bookingPayload.startTime = bookingDetails.startTimeISO;
        }
        
        if (isNaN(endDate.getTime()) && bookingDetails.endTimeISO) {
          bookingPayload.endTime = bookingDetails.endTimeISO;
        }
      } catch (e) {
        console.error('Error processing booking times:', e);
      }
      
      // Thêm thông tin debug trong môi trường development
      if (process.env.NODE_ENV === 'development') {
        console.log('Sending booking data:', bookingPayload);
        console.log('Browser timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
        console.log('Local time equivalent of startTime:', new Date(bookingPayload.startTime).toLocaleString());
        console.log('Local time equivalent of endTime:', new Date(bookingPayload.endTime).toLocaleString());
      }
      
      // Gọi API để tạo booking
      const response = await createBooking(bookingPayload);
      
      if (response.success) {
        // Log response data in development mode
        if (process.env.NODE_ENV === 'development' && response.data) {
          console.log('API response data:', response.data);
        }
        
        alert('Đặt phòng thành công!');
        navigate('/myroom');
      } else {
        setApiError(response.error || 'Không thể đặt phòng. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setApiError(err.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  return (
    <div className="C-checking-page">
      <Header />

      <main className="C-main-content">
        <div className="C-checkout-container">
          <h2 className="C-checkout-title">Hoàn tất đặt phòng</h2>

          <div className="C-room-info-bar">
            <FaInfoCircle className="C-info-icon" />
            <p>{roomData.name}, Cỡ: {roomData.capacity} người - {roomData.size} m²</p>
          </div>

          <div className="C-checkout-content">
            <div className="C-booking-form-container">
              <h3>Thông tin đặt phòng</h3>
              {apiError && <div className="C-api-error">{apiError}</div>}
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
                  <button 
                    type="submit" 
                    className="C-complete-booking-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Xác nhận đặt phòng'}
                  </button>
                </div>
              </form>
            </div>

            <div className="C-room-summary">
              <div className="C-room-image">
                <img 
                  src={
                    roomData.roomImage || roomData.room_image
                      ? `http://localhost:5000${roomData.roomImage || roomData.room_image}`
                      : roomData.image || roomImage
                  } 
                  alt={roomData.name} 
                />
              </div>
              <h3>{roomData.name}</h3>
              <div className="C-booking-details">
                <div className="C-booking-detail">
                  <span className="C-detail-label">Check-in:</span>
                  <span className="C-detail-value">
                    {bookingDetails.startTime 
                      ? formatBookingTime(bookingDetails.startTime)
                      : roomData.checkIn}
                  </span>
                </div>
                <div className="C-booking-detail">
                  <span className="C-detail-label">Check-out:</span>
                  <span className="C-detail-value">
                    {bookingDetails.endTime
                      ? formatBookingTime(bookingDetails.endTime)
                      : roomData.checkOut}
                  </span>
                </div>
                <div className="C-booking-duration">
                  {bookingDetails.duration || roomData.duration || 
                   (bookingDetails.startTime && bookingDetails.endTime ? 
                    `${Math.round((new Date(bookingDetails.endTime) - new Date(bookingDetails.startTime)) / (1000 * 60 * 60))} tiếng` : 
                    '1 tiếng')}
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