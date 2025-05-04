import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Myroom.css';
import Header from '../../components/common/Header';
import { FaClock, FaCheckCircle, FaTimes, FaCalendarAlt, FaSearch, FaRegClock } from 'react-icons/fa';
import { getUserBookings, cancelBooking, startBooking, checkOutBooking } from '../../services/api';

const MyRoomPage = () => {
  const navigate = useNavigate();
  const [confirmAction, setConfirmAction] = useState({ show: false, type: '', bookingId: null });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật thời gian hiện tại mỗi phút
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Fetch user's bookings when component mounts
    fetchBookings();
  }, [currentTime]);

  // Tách hàm fetchBookings ra để có thể gọi lại sau các thao tác
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await getUserBookings();
      if (response.success) {
        const processedBookings = response.data.map(booking => {
          // Debug log để kiểm tra dữ liệu gốc từ API
          if (process.env.NODE_ENV === 'development') {
            console.log('Original booking data from API:', booking);
          }
          
          const endTime = new Date(booking.endTime || booking.checkOut);
          const startTime = new Date(booking.startTime || booking.checkIn);
          const now = new Date();
          
          // Kiểm tra trường status hoặc bookingStatus từ API
          // API có thể trả về 'status' hoặc 'bookingStatus' nên cần kiểm tra cả hai
          const apiStatus = booking.bookingStatus || booking.status;
          
          // Nếu có trạng thái từ API thì ưu tiên sử dụng
          if (apiStatus) {
            // Chuyển về chữ thường để so sánh dễ dàng hơn
            const lowerCaseStatus = apiStatus.toLowerCase();
            
            // Chuyển đổi từ trạng thái API sang trạng thái UI
            if (lowerCaseStatus === 'cancelled' || lowerCaseStatus === 'canceled' || lowerCaseStatus === 'auto_cancelled') {
              return { ...booking, status: 'canceled', autoCanceled: lowerCaseStatus === 'auto_cancelled' };
            }
            
            if (lowerCaseStatus === 'completed') {
              return { ...booking, status: 'past' };
            }
            
            if (lowerCaseStatus === 'checked_in') {
              // Kiểm tra nếu booking đang ở trạng thái CHECKED_IN nhưng đã quá hạn checkout
              if (endTime < now) {
                // Gọi API để tự động checkout cho booking này
                handleAutoCheckout(booking.id);
                return { ...booking, status: 'past' };
              }
              return { ...booking, status: 'active' };
            }
            
            if (lowerCaseStatus === 'pending' || lowerCaseStatus === 'confirmed') {
              // Kiểm tra thêm logic thời gian dưới đây
            } else {
              console.log(`Unknown booking status from API: ${apiStatus}`);
            }
          }
          
          // Tiếp tục logic xử lý dựa trên thời gian nếu status API không rõ ràng
          if (endTime < now && booking.status !== 'canceled') {
            return { ...booking, status: 'past' };
          }
          
          // Kiểm tra nếu đã qua 10 phút từ thời gian bắt đầu mà chưa check-in -> tự động hủy
          // Chỉ áp dụng cho đơn đang ở trạng thái upcoming (chưa bắt đầu)
          if (!booking.status || booking.status === 'upcoming' || booking.bookingStatus === 'PENDING' || booking.bookingStatus === 'CONFIRMED') {
            const tenMinutesAfterStart = new Date(startTime);
            tenMinutesAfterStart.setMinutes(tenMinutesAfterStart.getMinutes() + 10);
            
            if (now > tenMinutesAfterStart) {
              // Tạm thời chỉ cập nhật UI, trong thực tế sẽ gọi API hủy đơn
              return { ...booking, status: 'canceled', autoCanceled: true };
            }
            
            // Booking vẫn trong tương lai và còn hạn
            return { ...booking, status: 'upcoming' };
          }
          
          return booking;
        });
        
        // Sắp xếp booking theo thời gian đặt phòng
        const sortedBookings = processedBookings.sort((a, b) => {
          // Định nghĩa thứ tự ưu tiên của các trạng thái
          const statusPriority = {
            'active': 0,    // Đang sử dụng: ưu tiên cao nhất
            'upcoming': 1,  // Sắp diễn ra: ưu tiên thứ hai
            'past': 2,      // Đã hoàn thành: ưu tiên thấp
            'canceled': 3   // Đã hủy: ưu tiên thấp nhất
          };
          
          // So sánh theo trạng thái trước
          const statusDiff = statusPriority[a.status] - statusPriority[b.status];
          if (statusDiff !== 0) return statusDiff;
          
          // Nếu cùng trạng thái, so sánh theo thời gian đặt phòng (booking_time)
          // Sử dụng a.bookingTime hoặc a.booking_time nếu có
          const aBookingTime = new Date(a.bookingTime || a.booking_time || a.createdAt || a.startTime || a.checkIn);
          const bBookingTime = new Date(b.bookingTime || b.booking_time || b.createdAt || b.startTime || b.checkIn);
          
          // Đặt phòng cũ hơn sẽ nằm bên dưới (sắp xếp giảm dần theo thời gian đặt)
          return bBookingTime - aBookingTime;
        });
        
        setBookings(sortedBookings);
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

  const handleChangeRoom = (bookingId) => {
    navigate(`/changeroom/${bookingId}`);
  };

  const handleStartBooking = async (bookingId) => {
    try {
      setLoading(true);
      
      // Tìm booking cần cập nhật
      const bookingToStart = bookings.find(b => b.id === bookingId);
      if (!bookingToStart) {
        throw new Error('Booking not found');
      }
      
      // Gọi API để cập nhật thời gian check-in
      const response = await startBooking(bookingId);
      
      if (response.success) {
        // Cập nhật state hiển thị
        setBookings(prevBookings => 
          prevBookings.map(booking => 
            booking.id === bookingId 
              ? { 
                  ...booking, 
                  checkIn: new Date().toISOString(), // Cập nhật thời gian check-in
                  checkOut: booking.endTime, // checkOutTime sẽ là endTime của phòng
                  status: 'active',  // Chuyển trạng thái sang đang sử dụng
                  actualCheckIn: new Date().toISOString()
                } 
              : booking
          )
        );
        
        // Cập nhật lại danh sách booking từ server
        fetchBookings();
        
        alert('Đã bắt đầu sử dụng phòng!');
      } else {
        throw new Error(response.message || 'Failed to start booking');
      }
    } catch (err) {
      console.error('Error starting booking:', err);
      alert('Không thể bắt đầu sử dụng phòng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoCheckout = async (bookingId) => {
    try {
      const response = await checkOutBooking(bookingId);
      if (response.success) {
        console.log(`Auto checkout successful for booking ID: ${bookingId}`);
      } else {
        console.error(`Failed to auto checkout for booking ID: ${bookingId}`);
      }
    } catch (err) {
      console.error(`Error during auto checkout for booking ID: ${bookingId}`, err);
    }
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
          alert('Đã hủy đặt phòng thành công');
        } else {
          alert('Không thể hủy đặt phòng');
        }
      } catch (err) {
        console.error('Error cancelling booking:', err);
        alert('Không thể hủy đặt phòng. Vui lòng thử lại.');
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
      case 'active': return 'Đang sử dụng';
      case 'past': return 'Đã hoàn thành';
      case 'canceled': return 'Đã hủy';
      default: return '';
    }
  };

  // Format thời gian theo UTC+0 (không thêm offset múi giờ địa phương)
  const formatTimeUTC7 = (isoTimeString) => {
    if (!isoTimeString) return '';
    
    try {
      // Phân tích chuỗi ISO để lấy các thành phần thời gian
      // Chuỗi có dạng: "2025-05-03T07:00:00.000Z"
      const matches = isoTimeString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
      
      if (!matches) {
        console.error('Invalid ISO format:', isoTimeString);
        return isoTimeString;
      }
      
      const year = matches[1];
      const month = matches[2];  
      const day = matches[3];
      const hours = matches[4];  
      const minutes = matches[5];
      
      // Log thông tin debug trong môi trường development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Debug format time: ISO=${isoTimeString}, UTC time=${day}/${month}/${year} ${hours}:${minutes}`);
      }
      
      // Format: DD/MM/YYYY HH:MM theo UTC
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (err) {
      console.error('Error formatting time:', err, isoTimeString);
      
      // Fallback: Sử dụng Date object nhưng loại bỏ timezone offset
      try {
        const date = new Date(isoTimeString);
        if (isNaN(date.getTime())) return isoTimeString;
        
        // Lấy các giá trị UTC từ object Date
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      } catch {
        return isoTimeString;
      }
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

  const calculateTimeRemaining = (booking) => {
    if (!booking.checkOut) return null;
    
    const endTime = new Date(booking.checkOut);
    const now = new Date();
    
    // Nếu đã quá thời gian kết thúc
    if (now > endTime) return { hours: 0, minutes: 0, isOver: true };
    
    const diff = endTime - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes, isOver: false };
  };

  // Kiểm tra xem có nên hiển thị nút hay không
  const shouldShowButtons = (booking) => {
    // Kiểm tra trạng thái UI đầu tiên
    if (booking.status === 'past' || booking.status === 'canceled') {
      return false;
    }
    
    // Kiểm tra cả trường status và bookingStatus từ API
    const apiStatus = booking.bookingStatus || booking.status;
    if (apiStatus) {
      const lowerCaseStatus = String(apiStatus).toLowerCase();
      if (lowerCaseStatus === 'cancelled' || 
          lowerCaseStatus === 'canceled' ||
          lowerCaseStatus === 'auto_cancelled' ||
          lowerCaseStatus === 'completed') {
        return false;
      }
    }
    
    return true;
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
            {bookings.map(booking => {
              const timeRemaining = calculateTimeRemaining(booking);
              const isActive = booking.status === 'active';
              const isUpcoming = booking.status === 'upcoming';
              const isPast = booking.status === 'past';
              const isCanceled = booking.status === 'canceled';
              const showButtons = shouldShowButtons(booking);
              
              return (
                <div className={`MR-booking-card ${booking.status}`} key={booking.id}>
                  <div className="MR-booking-image">
                    <img 
                      src={
                        booking.roomImage ? 
                        `http://localhost:5000${booking.roomImage}` : 
                        require('../../assets/room-main.png')
                      }
                      alt={booking.roomName} 
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.src = require('../../assets/room-main.png');
                      }}
                    />
                    <div className={`MR-booking-status ${booking.status}`}>
                      {getStatusLabel(booking.status)}
                      {booking.autoCanceled && ' (Tự động)'}
                    </div>
                  </div>

                  <div className="MR-booking-details">
                    <div>
                      <h3 className="MR-room-name">{booking.roomName}</h3>
                      <div className="MR-booking-time">
                        <p><strong>Check-in:</strong> {formatTimeUTC7(booking.startTime || booking.checkIn)}</p>
                        <p><strong>Check-out:</strong> {formatTimeUTC7(booking.endTime || booking.checkOut)}</p>
                        <p className="MR-duration">
                          <FaClock className="MR-duration-icon" /> 
                          {booking.duration || calculateDuration(booking.startTime || booking.checkIn, booking.endTime || booking.checkOut)}
                        </p>
                        
                        {/* Hiển thị thời gian còn lại nếu đang sử dụng hoặc sắp diễn ra */}
                        {(isActive || isUpcoming) && timeRemaining && (
                          <p className="MR-time-remaining">
                            <FaRegClock className="MR-duration-icon" />
                            <span>Thời gian còn lại: </span>
                            <strong>
                              {timeRemaining.hours}h {timeRemaining.minutes}m
                            </strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="MR-booking-actions">
                      {/* Hiển thị các nút theo yêu cầu mới */}
                      {showButtons ? (
                        <>
                          {!isActive && (
                            <button className="MR-action-btn start-btn" onClick={() => handleStartBooking(booking.id)}>
                              Bắt đầu
                            </button>
                          )}
                          
                          {!isActive && (
                            <button className="MR-action-btn change-btn" onClick={() => handleChangeRoom(booking.id)}>
                              Đổi phòng
                            </button>
                          )}
                          
                          <button className="MR-action-btn cancel-btn" onClick={() => showConfirmation('cancel', booking.id)}>
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          {isPast && (
                            <button className="MR-action-btn completed-btn" disabled>
                              <FaCheckCircle /> Đã hoàn thành
                            </button>
                          )}
                          
                          {isCanceled && (
                            <button className="MR-action-btn canceled-btn" disabled>
                              Đã hủy {booking.autoCanceled && '(Tự động)'}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
