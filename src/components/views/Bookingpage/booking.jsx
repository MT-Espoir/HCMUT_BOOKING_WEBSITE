import React from 'react';
import './booking.css';
// Import hình ảnh và icons
import logoIcon from '../../assests/logo.png';
import userAvatar from '../../assests/avatar.jpg';
import { FaUser, FaBell, FaArrowLeft } from 'react-icons/fa';

const BookingPage = ({ navigateTo, currentRoom }) => {

  // Hàm xử lý đặt phòng
  const handleBookButton = () => {
    // Chuyển đến trang xác nhận đặt phòng
    navigateTo('checking');
  };

  // Quay lại trang chọn phòng
  const handleBackToRoomSelection = () => {
    navigateTo('roomselection');
  };

  // Hàm điều hướng đến trang My Rooms
  const handleMyRooms = () => {
    navigateTo('myroom');
  };

  // Kiểm tra xem đã chọn phòng chưa
  if (!currentRoom) {
    return (
      <div className="loading-container">
        <p>Đang tải thông tin phòng...</p>
        <button onClick={handleBackToRoomSelection}>Quay lại trang chọn phòng</button>
      </div>
    );
  }

  return (
    <div className="booking-page">
      {/* Header Component */}
      <header className="header">
        <div className="logo-container">
          <img src={logoIcon} alt="HCMUT Booking Room Logo" className="logo" />
          <h1>HCMUT Booking Room</h1>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li><a href="#" onClick={handleBackToRoomSelection}>Home</a></li>
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
        {/* Nút quay lại */}
        <div className="back-button-container">
          <button 
            className="back-button" 
            onClick={handleBackToRoomSelection}
          >
            <FaArrowLeft /> Quay lại trang chọn phòng
          </button>
        </div>

        <div className="content-wrapper">
          {/* Hình ảnh và thông tin phòng */}
          <section className="room-details">
            <div className="room-images">
              <div className="main-image">
                <img src={currentRoom.images.main} alt={currentRoom.name} />
              </div>
              <div className="side-images">
                <img src={currentRoom.images.side1} alt={`${currentRoom.name} view 1`} />
                <img src={currentRoom.images.side2} alt={`${currentRoom.name} view 2`} />
              </div>
            </div>
            
            <div className="room-info">
              <h2>{currentRoom.name}</h2>
              <p className="room-description">{currentRoom.overview}</p>
              
              <div className="room-specs">
                <div className="spec">
                  <h4>Vị trí</h4>
                  <p>{currentRoom.location}</p>
                </div>
                <div className="spec">
                  <h4>Sức chứa</h4>
                  <p>{currentRoom.capacity} người</p>
                </div>
                <div className="spec">
                  <h4>Diện tích</h4>
                  <p>{currentRoom.area}</p>
                </div>
              </div>
              
              <div className="amenities">
                <h4>Tiện nghi</h4>
                <ul>
                  {currentRoom.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                  ))}
                </ul>
              </div>
              
              <div className="features">
                <h4>Đặc điểm</h4>
                <div className="feature-list">
                  {currentRoom.features.map((feature, index) => (
                    <div className="feature" key={index}>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Nút đặt phòng */}
              <div className="booking-action">
                <button onClick={handleBookButton} className="book-button">
                  Đặt phòng
                </button>
              </div>
              
              <div className="booking-notes">
                <p><strong>Lưu ý:</strong> Vui lòng đặt phòng trước ít nhất 1 ngày. Bạn có thể hủy đặt phòng miễn phí trước 24 giờ.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BookingPage;