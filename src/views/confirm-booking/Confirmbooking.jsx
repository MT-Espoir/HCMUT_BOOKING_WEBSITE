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
  
  // Lấy dữ liệu phòng từ location state hoặc sử dụng dữ liệu mặc định nếu không có
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

  // Chuyển đổi amenities từ chuỗi sang mảng nếu cần
  const amenitiesList = typeof roomData.amenities === 'string' 
    ? roomData.amenities.split(',').map(item => item.replace('Tiện nghi:', '').trim())
    : roomData.amenitiesList || roomData.amenities || [];
  
  // Đảm bảo features luôn là một mảng
  const featuresList = Array.isArray(roomData.features) 
    ? roomData.features 
    : [];

  const handleBookButton = () => {
    // Truyền dữ liệu phòng đến trang checking
    navigate('/checking', { state: { roomData } });
  };
  
  const handleBackToRoomSelection = () => {
    navigate('/room-search');
  };

  return (
    <div className="booking-page">
      <Header />

      <main className="main-content">
        <div className="back-button-container">
          <button className="back-button" onClick={handleBackToRoomSelection}>
            <FaArrowLeft /> Quay lại trang chọn phòng
          </button>
        </div>

        <div className="content-wrapper">
          <section className="room-details">
            <div className="room-images">
              <div className="image-gallery">
                <div className="main-image">
                  <img src={roomData.image || roomMainImg} alt="Hình ảnh chính của phòng" />
                </div>
                <div className="side-images">
                  <img src={roomSide1Img} alt="Hình ảnh phụ 1 của phòng" />
                  <img src={roomSide2Img} alt="Hình ảnh phụ 2 của phòng" />
                </div>
              </div>
            </div>

            <div className="room-info">
              <h2>{roomData.name}</h2>
              
              <div className="room-specs">
                <div className="spec">
                  <h4>Sức chứa</h4>
                  <p><FaUser /> Cỡ: {roomData.capacity} người</p>
                </div>
                <div className="spec">
                  <h4>Diện tích</h4>
                  <p><FaRulerCombined /> {roomData.size} m²</p>
                </div>
              </div>
              
              <div className="tab-container">
                <div className="tab-menu">
                  <button 
                    className={activeTab === 'overview' ? 'tab-active' : ''} 
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                </div>
                
                <div className="tab-content">
                  {activeTab === 'overview' && (
                    <div className="overview-tab">
                      <p className="room-description">
                        {roomData.fullDescription}
                      </p>
                      
                      <div className="amenities">
                        <h4>Tiện ích</h4>
                        <ul>
                          {amenitiesList.map((amenity, index) => (
                            <li key={index}>{amenity}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="features">
                        <h4>Đặc điểm</h4>
                        <div className="feature-list">
                          {featuresList.map((feature, index) => (
                            <span key={index} className="feature">{feature}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="booking-action">
                <button onClick={handleBookButton} className="book-button">
                  Đặt phòng
                </button>
                <p className="booking-notes"></p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Confirmbookingpage;