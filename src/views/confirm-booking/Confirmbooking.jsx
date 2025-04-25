import React from 'react';
import { useNavigate } from 'react-router-dom';
import './confirmbooking.css';
import Header from '../../components/common/Header';
import logoIcon from '../../assets/logo.png';
import userAvatar from '../../assets/avatar.jpg';
import { FaArrowLeft } from 'react-icons/fa';

const Confirmbookingpage = () => {
  const navigate = useNavigate();

  const handleBookButton = () => {
    navigate('/checking');
  };

  const handleBackToRoomSelection = () => {
    navigate('/room-selection');
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
              {/* Bạn có thể load hình phòng thật tại đây */}
            </div>

            <div className="room-info">
              <h2>Tên phòng mẫu</h2>
              <p className="room-description">Mô tả chi tiết phòng...</p>

              <div className="booking-action">
                <button onClick={handleBookButton} className="book-button">
                  Đặt phòng
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Confirmbookingpage;
