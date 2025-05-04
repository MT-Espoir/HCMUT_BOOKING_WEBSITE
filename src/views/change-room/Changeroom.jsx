import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Changeroom.css';
import Header from '../../components/common/Header';
import { FaSearch, FaCalendar, FaUser, FaRulerCombined, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa';
import { getRooms, getBookingDetails, changeBookingRoom } from '../../services/api';

const ChangeRoomPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams(); // Get booking ID from URL parameters
  
  // State cho booking hiện tại và dữ liệu phòng
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [processingChange, setProcessingChange] = useState(false);
  const [canChangeRoom, setCanChangeRoom] = useState(true);
  const [restrictionReason, setRestrictionReason] = useState('');
  
  // State cho tìm kiếm và filter
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    size: [],
    capacity: [],
    amenities: [],
    timeRange: [],
    duration: []
  });

  // Format thời gian theo định dạng UTC+0 (không thêm offset múi giờ địa phương)
  const formatTime = (isoTimeString) => {
    try {
      const date = new Date(isoTimeString);
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      const weekdayIndex = date.getDay();
      const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const weekday = weekdays[weekdayIndex];

      return `${weekday}, ${day} Tháng ${month} ${year} - ${hours}:${minutes}`;
    } catch (err) {
      console.error('Error formatting date:', err);
      return isoTimeString || 'N/A';
    }
  };

  // Fetch booking details và các phòng khả dụng khi component mount
  useEffect(() => {
    const fetchBookingAndRooms = async () => {
      try {
        setLoading(true);
        
        // Lấy thông tin booking hiện tại
        const bookingResponse = await getBookingDetails(bookingId);
        if (bookingResponse.success && bookingResponse.data) {
          setCurrentBooking(bookingResponse.data);
          
          // Kiểm tra tính hợp lệ của việc đổi phòng
          const bookingStatus = bookingResponse.data.bookingStatus;
          const isValidStatus = ['PENDING', 'CONFIRMED'].includes(bookingStatus);
          
          if (!isValidStatus) {
            setCanChangeRoom(false);
            setRestrictionReason(`Không thể đổi phòng khi trạng thái đặt phòng là: ${bookingStatus}`);
            setLoading(false);
            return;
          }
          
          // Lấy danh sách phòng khả dụng cùng thời gian
          const roomsResponse = await getRooms({
            startTime: bookingResponse.data.startTime,
            endTime: bookingResponse.data.endTime
          });
          
          if (roomsResponse.success) {
            setRooms(roomsResponse.data);
          } else {
            setError('Không thể tải danh sách phòng');
          }
        } else {
          setError('Không tìm thấy thông tin đặt phòng');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookingAndRooms();
  }, [bookingId]);

  // Xử lý thay đổi ô tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = () => {
    // Hiện tại chỉ lọc client-side, có thể mở rộng để gọi API search nếu cần
  };
  
  // Xử lý thay đổi filter
  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => {
      const updatedFilters = {...prevFilters};
      
      if (updatedFilters[category].includes(value)) {
        // Nếu đã có trong filter, loại bỏ
        updatedFilters[category] = updatedFilters[category].filter(item => item !== value);
      } else {
        // Nếu chưa có trong filter, thêm vào
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      
      return updatedFilters;
    });
  };
  
  // Lọc phòng dựa trên từ khóa tìm kiếm và bộ lọc
  const filteredRooms = rooms.filter(room => {
    // Lọc theo từ khóa tìm kiếm
    if (searchQuery && !room.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Lọc theo kích thước
    if (filters.size.length > 0 && !filters.size.includes(room.size)) {
      return false;
    }
    
    // Lọc theo sức chứa
    if (filters.capacity.length > 0) {
      let capacityMatch = false;
      for (const cap of filters.capacity) {
        if (room.capacity === parseInt(cap) || room.capacity >= parseInt(cap)) {
          capacityMatch = true;
          break;
        }
      }
      if (!capacityMatch) return false;
    }
    
    // Lọc theo tiện ích
    if (filters.amenities.length > 0) {
      if (!room.facilities) return false;
      
      // Chuyển đổi facilities thành chuỗi để dễ kiểm tra
      const facilitiesString = typeof room.facilities === 'string' 
        ? room.facilities.toLowerCase() 
        : Array.isArray(room.facilities) 
          ? room.facilities.join(',').toLowerCase() 
          : '';
          
      let amenitiesMatch = false;
      for (const amenity of filters.amenities) {
        if (facilitiesString.includes(amenity.toLowerCase())) {
          amenitiesMatch = true;
          break;
        }
      }
      if (!amenitiesMatch) return false;
    }
    
    // Loại trừ phòng hiện tại khỏi kết quả
    if (currentBooking && room.id === currentBooking.roomId) {
      return false;
    }
    
    return true;
  });
  
  // Xử lý yêu cầu đổi phòng
  const handleChangeRoom = async (newRoomId) => {
    try {
      if (!currentBooking || !newRoomId) return;
      
      setProcessingChange(true);
      const response = await changeBookingRoom(currentBooking.id, newRoomId);
      
      if (response.success) {
        setChangeSuccess(true);
      } else {
        setError(response.error || 'Không thể đổi phòng. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Error changing room:', err);
      setError('Đã xảy ra lỗi khi đổi phòng. Vui lòng thử lại sau.');
    } finally {
      setProcessingChange(false);
    }
  };

  // Xử lý quay lại trang Phòng của tôi
  const handleMyRooms = () => {
    navigate('/myroom');
  };

  // Hiển thị khi đang tải
  if (loading) {
    return (
      <div className="changeroom-page">
        <Header />
        <div className="changeroom-wrapper">
          <div className="changeroom-loading">Đang tải thông tin...</div>
        </div>
      </div>
    );
  }

  // Hiển thị khi có lỗi
  if (error && !currentBooking) {
    return (
      <div className="changeroom-page">
        <Header />
        <div className="changeroom-wrapper">
          <div className="changeroom-error">
            <h3>Đã xảy ra lỗi</h3>
            <p>{error}</p>
            <button className="changeroom-back-btn" onClick={handleMyRooms}>
              Quay lại Phòng của tôi
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị khi đổi phòng thành công
  if (changeSuccess) {
    return (
      <div className="changeroom-page">
        <Header />
        <div className="changeroom-wrapper">
          <div className="changeroom-success">
            <h3>Đổi phòng thành công!</h3>
            <p>Thông tin đặt phòng mới của bạn đã được cập nhật.</p>
            <button className="changeroom-back-btn" onClick={handleMyRooms}>
              Xem Phòng của tôi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="changeroom-page">
      <Header />
      
      <div className="changeroom-wrapper">
        {/* Current booking information */}
        <div className="changeroom-current-booking">
          <div className="changeroom-back-button-container">
            <button className="changeroom-back-button" onClick={handleMyRooms}>
              <FaArrowLeft /> Quay lại Phòng của tôi
            </button>
          </div>
          
          <h2>Thông tin đặt phòng hiện tại</h2>
          
          {currentBooking && (
            <div className="changeroom-current-room-card">
              <div className="changeroom-room-image">
                <img 
                  src={
                    currentBooking.roomImage
                      ? `http://localhost:5000${currentBooking.roomImage}`
                      : require('../../assets/room-main.png')
                  } 
                  alt={currentBooking.roomName || 'Room image'} 
                />
              </div>
              <div className="changeroom-room-details">
                <h3>{currentBooking.roomName || `Phòng ${currentBooking.roomId}`}</h3>
                <div className="changeroom-room-specs">
                  <div className="changeroom-room-meta">
                    <span><FaCalendar /> Bắt đầu: {formatTime(currentBooking.startTime)}</span>
                    <span><FaCalendar /> Kết thúc: {formatTime(currentBooking.endTime)}</span>
                  </div>
                  <div className="changeroom-room-meta">
                    <span><FaUser /> Sức chứa: {currentBooking.attendeesCount} người</span>
                    <span><FaRulerCombined /> Trạng thái: {currentBooking.bookingStatus}</span>
                  </div>
                </div>
                
                {restrictionReason && (
                  <div className="changeroom-restriction-notice">
                    <FaExclamationTriangle className="changeroom-warning-icon" />
                    <p>{restrictionReason}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {canChangeRoom ? (
          <div className="changeroom-content">
            <aside className="changeroom-sidebar">
              <div className="changeroom-search-bar">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên phòng"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
                  className="changeroom-search-input"
                />
                <button onClick={handleSearchSubmit} className="changeroom-search-button">
                  <FaSearch />
                </button>
              </div>

              <h4>Bộ lọc</h4>

              <div className="changeroom-filter-group">
                <h5>Cỡ số</h5>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('size', 1)}
                    checked={filters.size.includes(1)}
                  />
                  <span>1 người</span>
                  <span className="changeroom-count">{rooms.filter(r => r.size === 1).length}</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('size', 2)}
                    checked={filters.size.includes(2)}
                  />
                  <span>2 người</span>
                  <span className="changeroom-count">{rooms.filter(r => r.size === 2).length}</span>
                </label>
              </div>

              <div className="changeroom-filter-group">
                <h5>Khoảng giờ</h5>
                {['7h - 9h', '9h - 11h', '11h - 13h', '13h - 15h', '15h - 17h'].map((timeRange, index) => (
                  <label key={index} className="changeroom-filter-option">
                    <input 
                      type="checkbox" 
                      onChange={() => handleFilterChange('timeRange', timeRange)}
                      checked={filters.timeRange.includes(timeRange)}
                    />
                    <span>{timeRange}</span>
                  </label>
                ))}
              </div>

              <div className="changeroom-filter-group">
                <h5>Sức chứa tối đa</h5>
                {[50, 100, 150, 200, 250].map((c) => (
                  <label key={c} className="changeroom-filter-option">
                    <input 
                      type="checkbox" 
                      onChange={() => handleFilterChange('capacity', c)} 
                      checked={filters.capacity.includes(c)}
                    />
                    <span>{c}</span>
                    <span className="changeroom-count">{rooms.filter(r => r.capacity >= c).length}</span>
                  </label>
                ))}
              </div>

              <div className="changeroom-filter-group">
                <h5>Thời gian sử dụng</h5>
                {['1 tiếng', '2 tiếng', '3 tiếng', '4 tiếng'].map((duration, index) => (
                  <label key={index} className="changeroom-filter-option">
                    <input 
                      type="checkbox" 
                      onChange={() => handleFilterChange('duration', duration)}
                      checked={filters.duration.includes(duration)}
                    />
                    <span>{duration}</span>
                  </label>
                ))}
              </div>

              <div className="changeroom-filter-group">
                <h5>Tiện ích</h5>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('amenities', 'projector')}
                    checked={filters.amenities.includes('projector')}
                  />
                  <span>Máy chiếu</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('amenities', 'aircon')}
                    checked={filters.amenities.includes('aircon')}
                  />
                  <span>Máy lạnh</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('amenities', 'whiteboard')}
                    checked={filters.amenities.includes('whiteboard')}
                  />
                  <span>Bảng trắng</span>
                </label>
              </div>
            </aside>

            <section className="changeroom-room-listing">
              <h3>Phòng khả dụng cho thời gian đã chọn</h3>
              <p className="changeroom-result-count">{filteredRooms.length} kết quả được tìm thấy</p>
              
              {processingChange ? (
                <div className="changeroom-processing">Đang xử lý yêu cầu đổi phòng...</div>
              ) : error ? (
                <div className="changeroom-error-message">{error}</div>
              ) : filteredRooms.length === 0 ? (
                <div className="changeroom-no-results">
                  Không tìm thấy phòng phù hợp. Vui lòng thử lại với bộ lọc khác.
                </div>
              ) : (
                <div className="changeroom-room-grid">
                  {filteredRooms.map((room) => (
                    <div key={room.id} className="changeroom-room-card-modern">
                      <img 
                        src={
                          room.roomImage
                            ? `http://localhost:5000${room.roomImage}`
                            : require('../../assets/room-main.png')
                        } 
                        alt={room.name} 
                      />
                      <div className="changeroom-card-body">
                        <div>
                          <h4>{room.name}</h4>
                          <p className="changeroom-location">{room.location || room.building}</p>
                          <p className="changeroom-description">{room.description || `Phòng số ${room.id}`}</p>
                          
                          <div className="changeroom-room-meta">
                            <span><FaUser /> {room.capacity} người</span>
                            <span><FaRulerCombined /> {room.area} m²</span>
                          </div>
                          
                          <p className="changeroom-room-amenities">
                            Tiện nghi: {typeof room.facilities === 'string' 
                              ? room.facilities 
                              : Array.isArray(room.facilities) 
                                ? room.facilities.join(', ') 
                                : 'Không có thông tin'}
                          </p>
                        </div>
                        
                        <button 
                          className="changeroom-book-btn" 
                          onClick={() => handleChangeRoom(room.id)}
                          disabled={processingChange}
                        >
                          Đổi sang phòng này
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div className="changeroom-restriction-container">
            <p>Không thể đổi phòng tại thời điểm này.</p>
            <button className="changeroom-back-btn" onClick={handleMyRooms}>
              Quay lại Phòng của tôi
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeRoomPage;