import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Myroom.css';
import Header from '../../components/common/Header';
import roomImage from '../../assets/room-main.png';
import { FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa';

const MyRoomPage = () => {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', bookingId: null });

  const bookings = [
    { id: 1, roomName: 'Phòng T1', checkIn: 'Sunday, April 24, 2025 - 09:00', checkOut: 'Sunday, April 24, 2025 - 10:00', duration: '1 tiếng', status: 'upcoming', image: roomImage },
    { id: 2, roomName: 'Phòng T1', checkIn: 'Monday, March 19, 2023 - 13:00', checkOut: 'Monday, March 19, 2023 - 15:00', duration: '2 tiếng', status: 'past', image: roomImage },
    { id: 3, roomName: 'Phòng T1', checkIn: 'Tuesday, February 15, 2023 - 10:00', checkOut: 'Tuesday, February 15, 2023 - 11:30', duration: '1.5 tiếng', status: 'canceled', image: roomImage }
  ];

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

  return (
    <div className="my-room-page">
      <Header />

      <main className="main-content">
        <h2 className="page-title">Phòng của tôi</h2>

        <div className="bookings-list">
          {bookings.map(booking => (
            <div className={`booking-card ${booking.status}`} key={booking.id}>
              <div className="booking-image">
                <img src={booking.image} alt={booking.roomName} />
              </div>

              <div className="booking-details">
                <h3 className="room-name">{booking.roomName}</h3>
                <p><strong>Check-in:</strong> {booking.checkIn}</p>
                <p><strong>Check-out:</strong> {booking.checkOut}</p>
                <p className="duration"><FaClock className="duration-icon" /> {booking.duration}</p>

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
          ))}
        </div>
      </main>
    </div>
  );
};

export default MyRoomPage;
