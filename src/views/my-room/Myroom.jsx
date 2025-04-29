import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Myroom.css';
import Header from '../../components/common/Header';
import roomImage from '../../assets/room-main.png';
import { FaClock, FaCheckCircle, FaTimes, FaCalendarAlt, FaSearch } from 'react-icons/fa';

const MyRoomPage = () => {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', bookingId: null });

  const bookings = [
    { id: 1, roomName: 'Phòng B1-201', checkIn: 'Sunday, April 24, 2025 - 09:00', checkOut: 'Sunday, April 24, 2025 - 10:00', duration: '1 tiếng', status: 'upcoming', image: roomImage },
    { id: 2, roomName: 'Phòng B1-202', checkIn: 'Monday, March 19, 2023 - 13:00', checkOut: 'Monday, March 19, 2023 - 15:00', duration: '2 tiếng', status: 'past', image: roomImage },  ];

  const handleChangeRoom = (bookingId) => {
    navigate(`/changeroom/${bookingId}`);
  };

  const handleStartBooking = () => {
    alert('Bắt đầu sử dụng phòng!');
  };

  const showConfirmation = (type, bookingId) => {
    setConfirmAction({ show: true, type, bookingId });
  };

  const closeConfirmation = () => {
    setConfirmAction({ show: false, type: '', bookingId: null });
  };

  const handleConfirmAction = () => {
    // Xử lý hành động hủy phòng
    if (confirmAction.type === 'cancel') {
      alert(`Đã hủy phòng có ID: ${confirmAction.bookingId}`);
    }
    closeConfirmation();
  };

  const handleSearchRoom = () => {
    navigate('/room-search');
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'upcoming': return 'Sắp diễn ra';
      case 'past': return 'Đã hoàn thành';
      case 'canceled': return 'Đã hủy';
      default: return '';
    }
  };

  return (
    <div className="my-room-page">
      <Header />

      <main className="main-content">
        <h2 className="page-title">Phòng của tôi</h2>

        {bookings.length > 0 ? (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div className={`booking-card ${booking.status}`} key={booking.id}>
                <div className="booking-image">
                  <img src={booking.image} alt={booking.roomName} />
                  <div className={`booking-status ${booking.status}`}>
                    {getStatusLabel(booking.status)}
                  </div>
                </div>

                <div className="booking-details">
                  <div>
                    <h3 className="room-name">{booking.roomName}</h3>
                    <div className="booking-time">
                      <p><strong>Check-in:</strong> {booking.checkIn}</p>
                      <p><strong>Check-out:</strong> {booking.checkOut}</p>
                      <p className="duration"><FaClock className="duration-icon" /> {booking.duration}</p>
                    </div>
                  </div>

                  <div className="booking-actions">
                    {booking.status === 'upcoming' && (
                      <>
                        <button className="action-btn start-btn" onClick={handleStartBooking}>Bắt đầu</button>
                        <button className="action-btn change-btn" onClick={() => handleChangeRoom(booking.id)}>Đổi phòng</button>
                        <button className="action-btn cancel-btn" onClick={() => showConfirmation('cancel', booking.id)}>Hủy</button>
                      </>
                    )}
                    {booking.status === 'past' && (
                      <button className="action-btn completed-btn" disabled><FaCheckCircle /> Đã hoàn thành</button>
                    )}
                    {booking.status === 'canceled' && (
                      <button className="action-btn canceled-btn" disabled>Đã hủy</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-bookings">
            <FaCalendarAlt className="empty-icon" />
            <h3>Bạn chưa có phòng nào</h3>
            <p>Hiện tại bạn chưa đặt phòng nào. Hãy tìm kiếm và đặt phòng để bắt đầu sử dụng dịch vụ.</p>
            <button className="search-room-btn" onClick={handleSearchRoom}>
              <FaSearch style={{ marginRight: '8px' }} /> Tìm phòng ngay
            </button>
          </div>
        )}
      </main>

      {confirmAction.show && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <button className="close-modal" onClick={closeConfirmation}>
              <FaTimes />
            </button>
            <h4>Xác nhận hủy phòng</h4>
            <p>Bạn có chắc chắn muốn hủy đặt phòng này? Hành động này không thể hoàn tác.</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={closeConfirmation}>Quay lại</button>
              <button className="modal-btn confirm" onClick={handleConfirmAction}>Xác nhận hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRoomPage;
