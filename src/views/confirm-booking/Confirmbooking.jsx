import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './confirmbooking.css';
import Header from '../../components/common/Header';
import roomMainImg from '../../assets/room-main.png';
import roomSide1Img from '../../assets/room-side1.jpg';
import roomSide2Img from '../../assets/room-side2.jpg';
import { FaArrowLeft, FaUser, FaRulerCombined } from 'react-icons/fa';

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
    facilities: ['Bàn ghế hiện đại', 'Máy chiếu', 'Bảng trắng', 'Điều hòa nhiệt độ', 'Wifi tốc độ cao', 'Giá đỡ tài liệu'],
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
    // Sử dụng thông tin giờ được truyền từ RoomSearchPage
    const startHour = location.state?.selectedStartHour || 7;
    const endHour = location.state?.selectedEndHour|| 9;
    
    // Nếu đã có thời gian từ trang trước, sử dụng trực tiếp
    if (location.state?.startTime && location.state?.endTime) {
      return {
        startTime: location.state.startTime,
        endTime: location.state.endTime,
        formattedStart: `${startHour.toString().padStart(2, '0')}:00`,
        formattedEnd: `${endHour.toString().padStart(2, '0')}:00`
      };
    }
    
    // Tạo đối tượng Date với ngày đã chọn
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    // Tạo thời gian bắt đầu và kết thúc theo giờ địa phương
    const startTime = new Date(selectedDateObj);
    startTime.setHours(startHour, 0, 0, 0);
    
    const endTime = new Date(selectedDateObj);
    endTime.setHours(endHour, 0, 0, 0);
    
    // Tạo chuỗi thời gian tùy chỉnh dạng "YYYY-MM-DD HH:MM:SS"
    const formatDateToCustomString = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };
    
    const startTimeStr = formatDateToCustomString(startTime);
    const endTimeStr = formatDateToCustomString(endTime);
    
    // Chỉ hiển thị debug log trong môi trường development
    if (process.env.NODE_ENV === 'development') {
      console.log("DEBUG - Chi tiết thời gian:", {
        selectedDate,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        startHour,
        endHour,
        startTimeLocal: startTime.toLocaleString(),
        endTimeLocal: endTime.toLocaleString(),
        startTimeStr,
        endTimeStr
      });
    }
    
    return {
      startTime: startTimeStr,
      endTime: endTimeStr,
      formattedStart: `${startHour.toString().padStart(2, '0')}:00`,
      formattedEnd: `${endHour.toString().padStart(2, '0')}:00`
    };
  };

  // Lấy thời gian đặt phòng từ hàm đã tính
  const bookingTimes = calculateBookingTimes();
  
  // Chỉ hiển thị debug log trong môi trường development
  if (process.env.NODE_ENV === 'development') {
    console.log("Thời gian đặt phòng:", {
      selectedDate,
      selectedTimeRange,
      selectedDuration,
      startTime: bookingTimes.startTime,
      endTime: bookingTimes.endTime
    });
  }

  // Booking details - now using the calculated times from selected date and time range
  const [bookingDetails, setBookingDetails] = useState({
    roomId: roomData.id,
    title: 'Room Booking',
    purpose: 'General meeting',
    startTime: bookingTimes.startTime,
    endTime: bookingTimes.endTime,
    attendeesCount: roomData.capacity || 1
  });

  // Convert facilities from string to array if needed
  const facilitiesList = typeof roomData.facilities === 'string' 
    ? roomData.facilities.split(',').map(item => item.replace('Tiện nghi:', '').trim())
    : roomData.facilitiesList || roomData.facilities || [];
  
  // Ensure features is an array
  const featuresList = Array.isArray(roomData.features) 
    ? roomData.features 
    : (roomData.features ? [roomData.features] : []);

  const handleBookButton = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Không gọi API createBooking ở đây nữa, chỉ chuyển sang trang checking với thông tin phòng và booking
      navigate('/checking', { 
        state: { 
          roomData,
          bookingDetails: {
            ...bookingDetails,
            duration: selectedDuration
          }
        }
      });
      
    } catch (err) {
      console.error('Error handling booking:', err);
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
                      
                      <div className="CB-facilities">
                        <h4>Tiện ích</h4>
                        <div className="CB-facilities-list">
                          {facilitiesList.map((facility, index) => (
                            <div key={index} className="CB-facility-item">
                              <span className="CB-facility-icon">•</span>
                              <span className="CB-facility-text">{facility}</span>
                            </div>
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