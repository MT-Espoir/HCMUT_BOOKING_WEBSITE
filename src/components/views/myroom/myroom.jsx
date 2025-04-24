import React, { useState, useEffect } from 'react';
import './myroom.css';
// Import API services
import { getUserBookings, cancelBooking, deleteBookingHistory } from '../../../services/api';

// Import hình ảnh và icons
import logoIcon from '../../assests/logo.png';
import userAvatar from '../../assests/avatar.jpg';
import roomImage from '../../assests/room-main.png';
import { FaBell, FaClock, FaTrashAlt, FaExchangeAlt, FaTimes, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const MyRoomPage = ({ navigateTo }) => {
  // State cho xác nhận xóa hoặc hủy
  const [confirmAction, setConfirmAction] = useState({
    show: false,
    type: '',
    bookingId: null
  });
  
  // State cho danh sách đặt phòng
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bookings when component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await getUserBookings();
        if (response.success) {
          setBookings(response.data.map(booking => ({
            ...booking,
            image: roomImage // add image field since API doesn't provide it
          })));
        } else {
          setError('Failed to fetch bookings');
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Error loading bookings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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
  const confirmActionHandler = async () => {
    try {
      // Hiển thị loading hoặc disable nút để tránh click nhiều lần
      setLoading(true);
      
      if (confirmAction.type === 'cancel') {
        // Hủy đặt phòng
        const response = await cancelBooking(confirmAction.bookingId);
        
        if (response.success) {
          // Update the booking in the local state
          setBookings(bookings.map(booking => 
            booking.id === confirmAction.bookingId 
              ? { ...booking, status: 'canceled' } 
              : booking
          ));
          alert(`Đã hủy đơn đặt phòng #${confirmAction.bookingId}`);
        } else {
          alert('Không thể hủy đơn đặt phòng. Vui lòng thử lại sau.');
        }
      } else if (confirmAction.type === 'delete') {
        // Xóa lịch sử đặt phòng
        const response = await deleteBookingHistory(confirmAction.bookingId);
        
        if (response.success) {
          // Remove the booking from the local state
          setBookings(bookings.filter(booking => booking.id !== confirmAction.bookingId));
          alert(`Đã xóa lịch sử đặt phòng #${confirmAction.bookingId}`);
        } else {
          alert('Không thể xóa lịch sử đặt phòng. Vui lòng thử lại sau.');
        }
      }
    } catch (error) {
      console.error('Error performing action:', error);
      alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
      closeConfirmation();
    }
  };

  // Chuyển đến trang đổi phòng
  const handleChangeRoom = (bookingId) => {
    // Chuyển trang và truyền thông tin đặt phòng
    navigateTo('changeroom', { bookingId: bookingId });
  };

  return (
    <div className="my-room-page">
      {/* Header Component */}
      <header className="header">
        <div className="logo-container">
          <img src={logoIcon} alt="HCMUT Booking Room Logo" className="logo" />
          <h1>HCMUT Booking Room</h1>
        </div>
        
        <nav className="main-nav">
          <ul>
            <li><a href="#" onClick={() => navigateTo('booking')}>Home</a></li>
            <li><a href="#">Discover</a></li>
            <li><a href="#" className="active">My Rooms</a></li>
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
        <h2 className="page-title">My rooms</h2>
        
        {loading && bookings.length === 0 ? (
          <div className="loading-container">
            <FaSpinner className="spinner" />
            <p>Đang tải danh sách đặt phòng...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="empty-bookings">
            <p>Bạn chưa có đặt phòng nào.</p>
            <button onClick={() => navigateTo('roomselection')} className="book-now-btn">
              Đặt phòng ngay
            </button>
          </div>
        ) : (
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
                          disabled={loading}
                        >
                          Bắt đầu
                        </button>
                        <button 
                          className="action-btn change-btn"
                          onClick={() => handleChangeRoom(booking.id)}
                          disabled={loading}
                        >
                          Đổi phòng
                        </button>
                        <button 
                          className="action-btn cancel-btn"
                          onClick={() => showConfirmation('cancel', booking.id)}
                          disabled={loading}
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
                          disabled={loading}
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
                          disabled={loading}
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
        )}
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
                disabled={loading}
              >
                Không
              </button>
              <button 
                className="modal-btn confirm"
                onClick={confirmActionHandler}
                disabled={loading}
              >
                {loading ? <FaSpinner className="spinner" /> : 'Có'}
              </button>
            </div>
            <button className="close-modal" onClick={closeConfirmation} disabled={loading}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRoomPage;