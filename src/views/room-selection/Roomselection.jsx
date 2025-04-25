import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Roomselection.css';
import roomImage from '../../assets/room-main.png';
import Header from '../../components/common/Header';
import { FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa';

const Roomselection = () => {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', bookingId: null });

  const bookings = [
    { id: 1, roomName: 'Phòng T1', checkIn: 'Sunday, April 24, 2025 - 09:00', checkOut: 'Sunday, April 24, 2025 - 10:00', duration: '1 tiếng', status: 'upcoming', image: roomImage },
    { id: 2, roomName: 'Phòng T1', checkIn: 'Monday, March 19, 2023 - 13:00', checkOut: 'Monday, March 19, 2023 - 15:00', duration: '2 tiếng', status: 'past', image: roomImage },
    { id: 3, roomName: 'Phòng T1', checkIn: 'Tuesday, February 15, 2023 - 10:00', checkOut: 'Tuesday, February 15, 2023 - 11:30', duration: '1.5 tiếng', status: 'canceled', image: roomImage }
  ];

  const handleStartBooking = (bookingId) => {
    navigate('/confirm-booking');
  };

  const showConfirmation = (type, bookingId) => {
    setConfirmAction({ show: true, type, bookingId });
  };

  const closeConfirmation = () => {
    setConfirmAction({ show: false, type: '', bookingId: null });
  };

  const confirmActionHandler = () => {
    closeConfirmation();
  };

  return (
    <div className="my-room-page">
      <Header />

      <main className="main-content">
        <h2 className="page-title">Chọn phòng</h2>

        <div className="bookings-list">
          {bookings.map(booking => (
            <div className={`booking-card ${booking.status}`} key={booking.id}>
              <div className="booking-image">
                <img src={booking.image} alt={booking.roomName} />
              </div>

              <div className="booking-details">
                <h3 className="room-name">{booking.roomName}</h3>
                <div className="booking-time">
                  <p><strong>Check-in:</strong> {booking.checkIn}</p>
                  <p><strong>Check-out:</strong> {booking.checkOut}</p>
                  <p className="duration"><FaClock className="duration-icon" /> {booking.duration}</p>
                </div>

                <div className="booking-actions">
                  {booking.status === 'upcoming' && (
                    <button className="action-btn start-btn" onClick={() => handleStartBooking(booking.id)}>Đặt phòng</button>
                  )}
                  {booking.status === 'past' && (
                    <button className="action-btn completed-btn" disabled><FaCheckCircle className="check-icon" /> Đã hoàn thành</button>
                  )}
                  {booking.status === 'canceled' && (
                    <button className="action-btn canceled-btn" disabled>Đã hủy</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {confirmAction.show && (
        <div className="modal-overlay">
          <div className="confirmation-modal">
            <h4>Xác nhận</h4>
            <p>Bạn có chắc chắn không?</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={closeConfirmation}>Không</button>
              <button className="modal-btn confirm" onClick={confirmActionHandler}>Có</button>
            </div>
            <button className="close-modal" onClick={closeConfirmation}><FaTimes /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roomselection;
