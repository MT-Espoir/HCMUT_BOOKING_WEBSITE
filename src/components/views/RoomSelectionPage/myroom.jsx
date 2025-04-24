import React, { useState } from 'react';
import './myroom.css';

import roomImage from '../../assests/room-main.png';
import { FaBell, FaClock, FaTrashAlt, FaExchangeAlt, FaTimes, FaCheckCircle } from 'react-icons/fa';
import Header from '../Shared/Header/Header';

const MyRoomPage = ({ navigateTo }) => {
  // State cho xác nhận xóa hoặc hủy
  const [confirmAction, setConfirmAction] = useState({
    show: false,
    type: '',
    bookingId: null
  });

  // Dữ liệu mẫu cho các đơn đặt phòng
  const bookings = [
    {
      id: 1,
      roomName: 'Phòng T1',
      checkIn: 'Sunday, April 24, 2025 - 09:00',
      checkOut: 'Sunday, April 24, 2025 - 10:00',
      duration: '1 tiếng',
      status: 'upcoming', // upcoming, past, canceled
      image: roomImage
    },
    {
      id: 2,
      roomName: 'Phòng T1',
      checkIn: 'Monday, March 19, 2023 - 13:00',
      checkOut: 'Monday, March 19, 2023 - 15:00',
      duration: '2 tiếng',
      status: 'past',
      image: roomImage
    },
    {
      id: 3,
      roomName: 'Phòng T1',
      checkIn: 'Tuesday, February 15, 2023 - 10:00',
      checkOut: 'Tuesday, February 15, 2023 - 11:30',
      duration: '1.5 tiếng',
      status: 'canceled',
      image: roomImage
    }
  ];

  // Hàm xử lý bắt đầu sử dụng phòng
  const handleStartBooking = (bookingId) => {
    alert(`Bạn đã bắt đầu sử dụng phòng cho đơn đặt phòng #${bookingId}`);
    // Trong thực tế, có thể chuyển người dùng đến trang chi tiết phòng hoặc cập nhật trạng thái
    navigateTo('booking');
  };

  // Hiển thị xác nhận trước khi hủy hoặc xóa đặt phòng
  const showConfirmation = (type, bookingId) => {
    setConfirmAction({
      show: true,
      type,
      bookingId
    });
  };

  // Đóng hộp thoại xác nhận
  const closeConfirmation = () => {
    setConfirmAction({
      show: false,
      type: '',
      bookingId: null
    });
  };

  // Xác nhận hành động
  const confirmActionHandler = () => {
    if (confirmAction.type === 'cancel') {
      // Hủy đặt phòng
      alert(`Đã hủy đơn đặt phòng #${confirmAction.bookingId}`);
    } else if (confirmAction.type === 'delete') {
      // Xóa lịch sử đặt phòng
      alert(`Đã xóa lịch sử đặt phòng #${confirmAction.bookingId}`);
    }
    closeConfirmation();
  };

  // Chuyển đến trang đổi phòng
  const handleChangeRoom = (bookingId) => {
    // Chuyển trang và truyền thông tin đặt phòng
    navigateTo('changeroom', { bookingId: bookingId });
  };

  return (
    <div className="my-room-page">
      {/* Header Component */}
      <Header navigateTo={navigateTo} />

      
      {/* Main Content */}
      <main className="main-content">
        <h2 className="page-title">My rooms</h2>
        
        <div className="bookings-list">
          {bookings.map(booking => (
            <div 
              className={`booking-card ${booking.status}`} 
              key={booking.id}
            >
              <div className="booking-image">
                <img src={booking.image} alt={booking.roomName} />
                {booking.status === 'upcoming' && (
                  <div className="booking-status upcoming">Sắp tới</div>
                )}
                {booking.status === 'past' && (
                  <div className="booking-status past">Đã hoàn thành</div>
                )}
                {booking.status === 'canceled' && (
                  <div className="booking-status canceled">Đã hủy</div>
                )}
              </div>
              
              <div className="booking-details">
                <h3 className="room-name">{booking.roomName}</h3>
                <div className="booking-time">
                  <p><strong>Check-in:</strong> {booking.checkIn}</p>
                  <p><strong>Check-out:</strong> {booking.checkOut}</p>
                  <p className="duration">
                    <FaClock className="duration-icon" /> 
                    {booking.duration}
                  </p>
                </div>
                
                <div className="booking-actions">
                  {booking.status === 'upcoming' && (
                    <>
                      <button 
                        className="action-btn start-btn"
                        onClick={() => handleStartBooking(booking.id)}
                      >
                        Bắt đầu
                      </button>
                      <button 
                        className="action-btn change-btn"
                        onClick={() => handleChangeRoom(booking.id)}
                      >
                        Đổi phòng
                      </button>
                      <button 
                        className="action-btn cancel-btn"
                        onClick={() => showConfirmation('cancel', booking.id)}
                      >
                        Hủy
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'past' && (
                    <>
                      <button 
                        className="action-btn completed-btn"
                        disabled
                      >
                        <FaCheckCircle className="check-icon" /> Đã hoàn thành
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => showConfirmation('delete', booking.id)}
                      >
                        Xóa
                      </button>
                    </>
                  )}
                  
                  {booking.status === 'canceled' && (
                    <>
                      <button 
                        className="action-btn canceled-btn"
                        disabled
                      >
                        Đã hủy
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => showConfirmation('delete', booking.id)}
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      
      {/* Confirmation Modal */}
      {confirmAction.show && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h4>Xác nhận</h4>
            {confirmAction.type === 'cancel' ? (
              <p>Bạn có chắc chắn muốn hủy đơn đặt phòng này không?</p>
            ) : (
              <p>Bạn có chắc chắn muốn xóa lịch sử đặt phòng này không?</p>
            )}
            <div className="modal-actions">
              <button 
                className="modal-btn cancel"
                onClick={closeConfirmation}
              >
                Không
              </button>
              <button 
                className="modal-btn confirm"
                onClick={confirmActionHandler}
              >
                Có
              </button>
            </div>
            <button className="close-modal" onClick={closeConfirmation}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRoomPage;