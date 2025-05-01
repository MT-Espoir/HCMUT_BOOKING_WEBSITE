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

  // Booking details - in a real app, you'd get these from a form or URL parameters
  const [bookingDetails, setBookingDetails] = useState({
    roomId: roomData.id,
    title: 'Room Booking', // Added required field
    purpose: 'General meeting',
    startTime: new Date(Date.now() + 3600000).toISOString(), // Changed from checkIn to startTime
    endTime: new Date(Date.now() + 7200000).toISOString(),   // Changed from checkOut to endTime
    attendeesCount: roomData.capacity || 1 // Added attendeesCount field
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
                  <img src={roomData.image || roomMainImg} alt="Hình ảnh chính của phòng" />
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