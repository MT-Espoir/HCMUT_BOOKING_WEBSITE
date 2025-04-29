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
                        {roomData.fullDescription}
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

              <div className="CB-booking-action">
                <button onClick={handleBookButton} className="CB-book-button">
                  Đặt phòng
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