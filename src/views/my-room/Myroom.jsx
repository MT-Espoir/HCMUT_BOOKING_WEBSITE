import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Myroom.css';
import Header from '../../components/common/Header';
import { FaClock, FaCheckCircle, FaTimes, FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { getUserBookings, cancelBooking } from '../../services/api';

const MyRoomPage = () => {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', bookingId: null });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user's bookings when component mounts
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getUserBookings();
        if (response.success) {
          setBookings(response.data);
        } else {
          setError('Failed to load bookings');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load your bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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

  const handleConfirmAction = async () => {
    // Handle cancel booking
    if (confirmAction.type === 'cancel') {
      try {
        setLoading(true);
        const response = await cancelBooking(confirmAction.bookingId);
        if (response.success) {
          // Update the bookings list to reflect the cancellation
          setBookings(prevBookings => 
            prevBookings.map(booking => 
              booking.id === confirmAction.bookingId 
                ? { ...booking, status: 'canceled' } 
                : booking
            )
          );
          alert('Booking cancelled successfully');
        } else {
          alert('Failed to cancel booking');
        }
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert('Failed to cancel booking. Please try again.');
      } finally {
        setLoading(false);
        closeConfirmation();
      }
    }
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

  const calculateDuration = (checkIn, checkOut) => {
    try {
      // This is a simple approximation for the UI
      // In a real application, you'd use proper date/time libraries
      const checkInTime = new Date(checkIn);
      const checkOutTime = new Date(checkOut);
      const durationMs = checkOutTime - checkInTime;
      const durationHours = Math.round(durationMs / (1000 * 60 * 60));
      
      return `${durationHours} tiếng`;
    } catch (err) {
      console.error('Error calculating duration:', err);
      return 'Unknown duration';
    }
  };

  return (
    <div className="MR-my-room-page">
      <Header />

      <main className="MR-main-content">
        <h2 className="MR-page-title">Phòng của tôi</h2>

        {loading ? (
          <div className="MR-loading">Loading your bookings...</div>
        ) : error ? (
          <div className="MR-error">{error}</div>
        ) : bookings.length > 0 ? (
          <div className="MR-bookings-list">
            {bookings.map(booking => (
              <div className={`MR-booking-card ${booking.status}`} key={booking.id}>
                <div className="MR-booking-image">
                  <img src={booking.image || "https://via.placeholder.com/350x200?text=Room+Image"} alt={booking.roomName} />
                  <div className={`MR-booking-status ${booking.status}`}>
                    {getStatusLabel(booking.status)}
                  </div>
                </div>

                <div className="MR-booking-details">
                  <div>
                    <h3 className="MR-room-name">{booking.roomName}</h3>
                    <div className="MR-booking-time">
                      <p><strong>Check-in:</strong> {booking.checkIn}</p>
                      <p><strong>Check-out:</strong> {booking.checkOut}</p>
                      <p className="MR-duration">
                        <FaClock className="MR-duration-icon" /> 
                        {booking.duration || calculateDuration(booking.checkIn, booking.checkOut)}
                      </p>
                    </div>
                  </div>

                  <div className="MR-booking-actions">
                    {booking.status === 'upcoming' && (
                      <>
                        <button className="MR-action-btn start-btn" onClick={handleStartBooking}>Bắt đầu</button>
                        <button className="MR-action-btn change-btn" onClick={() => handleChangeRoom(booking.id)}>Đổi phòng</button>
                        <button className="MR-action-btn cancel-btn" onClick={() => showConfirmation('cancel', booking.id)}>Hủy</button>
                      </>
                    )}
                    {booking.status === 'past' && (
                      <button className="MR-action-btn completed-btn" disabled><FaCheckCircle /> Đã hoàn thành</button>
                    )}
                    {booking.status === 'canceled' && (
                      <button className="MR-action-btn canceled-btn" disabled>Đã hủy</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="MR-empty-bookings">
            <FaCalendarAlt className="MR-empty-icon" />
            <h3>Bạn chưa có phòng nào</h3>
            <p>Hiện tại bạn chưa đặt phòng nào. Hãy tìm kiếm và đặt phòng để bắt đầu sử dụng dịch vụ.</p>
            <button className="MR-search-room-btn" onClick={handleSearchRoom}>
              <FaSearch style={{ marginRight: '8px' }} /> Tìm phòng ngay
            </button>
          </div>
        )}
      </main>

      {confirmAction.show && (
        <div className="MR-modal-overlay">
          <div className="MR-confirmation-modal">
            <button className="MR-close-modal" onClick={closeConfirmation}>
              <FaTimes />
            </button>
            <h4>Xác nhận hủy phòng</h4>
            <p>Bạn có chắc chắn muốn hủy đặt phòng này? Hành động này không thể hoàn tác.</p>
            <div className="MR-modal-actions">
              <button className="MR-modal-btn cancel" onClick={closeConfirmation}>Quay lại</button>
              <button className="MR-modal-btn confirm" onClick={handleConfirmAction}>Xác nhận hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRoomPage;
