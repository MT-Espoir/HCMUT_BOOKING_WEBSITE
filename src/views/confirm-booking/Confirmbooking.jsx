import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './confirmbooking.css';
import Header from '../../components/common/Header';
import roomMainImg from '../../assets/room-main.png';
import roomSide1Img from '../../assets/room-side1.jpg';
import roomSide2Img from '../../assets/room-side2.jpg';
import { FaArrowLeft, FaUser, FaRulerCombined } from 'react-icons/fa';
import { createBooking } from '../../services/api';

const Confirmbookingpage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get room data from location state or use default data
  const roomData = location.state?.roomData || {
    id: 3,
    name: 'Phòng T1',
    description: 'Tầng trệt, khu vực thư viện',
    amenities: ['Bàn ghế hiện đại', 'Máy chiếu', 'Bảng trắng', 'Điều hòa nhiệt độ', 'Wifi tốc độ cao', 'Giá đỡ tài liệu'],
    image: roomMainImg,
    branch: 1,
    capacity: 2,
    size: 25,
    features: ['Ánh sáng tự nhiên', 'Cách âm tốt', 'Không gian riêng tư', 'Thích hợp họp nhóm'],
    fullDescription: 'Phòng Poker (tầng trệt) là không gian lý tưởng cho các cuộc họp nhỏ hoặc làm việc nhóm. Phòng được trang bị đầy đủ tiện nghi hiện đại, ánh sáng tự nhiên, và không gian yên tĩnh để đảm bảo hiệu quả công việc tối đa.'
  };

  // Lấy thông tin ngày và khoảng thời gian từ location state
  const selectedDate = location.state?.selectedDate || new Date().toISOString().split('T')[0];
  const selectedTimeRange = location.state?.selectedTimeRange || '7h - 9h';
  const selectedDuration = location.state?.selectedDuration || '1 tiếng';

  // Chuyển đổi khoảng thời gian thành thời gian bắt đầu và kết thúc
  const getTimeFromRange = (timeRange) => {
    if (!timeRange) return { startHour: 7, endHour: 9 };
    const parts = timeRange.split(' - ');
    const startPart = parts[0].replace('h', '');
    const endPart = parts[1].replace('h', '');
    return {
      startHour: parseInt(startPart, 10),
      endHour: parseInt(endPart, 10)
    };
  };

  // Chuyển đổi thời lượng thành số giờ
  const getDurationHours = (duration) => {
    if (!duration) return 1;
    return parseInt(duration.split(' ')[0], 10) || 1;
  };

  // Tính toán thời gian bắt đầu và kết thúc dựa trên ngày và khoảng thời gian đã chọn
  const calculateBookingTimes = () => {
    const { startHour } = getTimeFromRange(selectedTimeRange);
    const durationHours = getDurationHours(selectedDuration);
    
    // Tạo đối tượng Date từ ngày đã chọn và giờ bắt đầu
    const startDate = new Date(selectedDate);
    startDate.setHours(startHour, 0, 0, 0);
    
    // Tính toán thời gian kết thúc bằng cách thêm thời lượng
    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + durationHours);
    
    return {
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString()
    };
  };

  // Lấy thời gian đặt phòng từ hàm đã tính
  const bookingTimes = calculateBookingTimes();

  // Booking details - now using the calculated times from selected date and time range
  const [bookingDetails, setBookingDetails] = useState({
    roomId: roomData.id,
    title: 'Room Booking',
    purpose: 'General meeting',
    startTime: bookingTimes.startTime,
    endTime: bookingTimes.endTime,
    attendeesCount: roomData.capacity || 1
  });

  // Convert amenities from string to array if needed
  const amenitiesList = typeof roomData.amenities === 'string' 
    ? roomData.amenities.split(',').map(item => item.replace('Tiện nghi:', '').trim())
    : roomData.amenitiesList || roomData.amenities || [];
  
  // Ensure features is an array
  const featuresList = Array.isArray(roomData.features) 
    ? roomData.features 
    : (roomData.features ? [roomData.features] : []);

  const handleBookButton = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Ensure all values are properly defined before sending to API
      // Convert any undefined values to null
      const bookingPayload = {
        roomId: bookingDetails.roomId || null,
        title: bookingDetails.title || 'Room Booking',
        purpose: bookingDetails.purpose || 'General meeting',
        startTime: bookingDetails.startTime,
        endTime: bookingDetails.endTime,
        attendeesCount: bookingDetails.attendeesCount || 1,
        notes: bookingDetails.notes || null
      };
      
      // Submit booking to backend
      const response = await createBooking(bookingPayload);
      
      if (response.success) {
        // Navigate to booking confirmation page
        navigate('/checking', { state: { 
          roomData,
          bookingId: response.data.id,
          bookingDetails: response.data
        }});
      } else {
        setError(response.error || 'Failed to create booking');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToRoomSelection = () => {
    navigate('/room-search');
  };

  return (
    <div className="CB-booking-page">
      <Header />

      <main className="CB-main-content">
        <div className="CB-back-button-container">
          <button className="CB-back-button" onClick={handleBackToRoomSelection}>
            <FaArrowLeft /> Quay lại trang chọn phòng
          </button>
        </div>

        <div className="CB-content-wrapper">
          <section className="CB-room-details">
            <div className="CB-room-images">
              <div className="CB-image-gallery">
                <div className="CB-main-image">
                  <img 
                    src={
                      roomData.roomImage || roomData.room_image
                        ? `http://localhost:5000${roomData.roomImage || roomData.room_image}`
                        : roomData.image || roomMainImg
                    } 
                    alt="Hình ảnh chính của phòng" 
                  />
                </div>
                <div className="CB-side-images">
                  <img src={roomSide1Img} alt="Hình ảnh phụ 1 của phòng" />
                  <img src={roomSide2Img} alt="Hình ảnh phụ 2 của phòng" />
                </div>
              </div>
            </div>

            <div className="CB-room-info">
              <h2>{roomData.name}</h2>
              
              <div className="CB-room-specs">
                <div className="CB-spec">
                  <h4>Sức chứa</h4>
                  <p><FaUser /> Cỡ: {roomData.capacity} người</p>
                </div>
                <div className="CB-spec">
                  <h4>Diện tích</h4>
                  <p><FaRulerCombined /> {roomData.size} m²</p>
                </div>
              </div>

              {/* Hiển thị thông tin đặt phòng */}
              <div className="CB-booking-time-info">
                <h3>Thông tin đặt phòng</h3>
                <p><strong>Ngày:</strong> {new Date(selectedDate).toLocaleDateString('vi-VN')}</p>
                <p><strong>Thời gian:</strong> {selectedTimeRange || '7h - 9h'}</p>
                <p><strong>Thời lượng:</strong> {selectedDuration || '1 tiếng'}</p>
              </div>
              
              <div className="CB-tab-container">
                <div className="CB-tab-menu">
                  <button 
                    className={activeTab === 'overview' ? 'CB-tab-active' : ''} 
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                </div>
                
                <div className="CB-tab-content">
                  {activeTab === 'overview' && (
                    <div className="CB-overview-tab">
                      <p className="CB-room-description">
                        {roomData.fullDescription || roomData.description}
                      </p>
                      
                      <div className="CB-amenities">
                        <h4>Tiện ích</h4>
                        <ul>
                          {amenitiesList.map((amenity, index) => (
                            <li key={index}>{amenity}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="CB-features">
                        <h4>Đặc điểm</h4>
                        <div className="CB-feature-list">
                          {featuresList.map((feature, index) => (
                            <span key={index} className="CB-feature">{feature}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {error && <div className="CB-error-message">{error}</div>}
              
              <div className="CB-booking-action">
                <button 
                  onClick={handleBookButton} 
                  className="CB-book-button"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Đặt phòng'}
                </button>
                <p className="CB-booking-notes"></p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Confirmbookingpage;