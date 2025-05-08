import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Changeroom.css';
import Header from '../../components/common/Header';
import { FaSearch, FaCalendar, FaUser, FaRulerCombined, FaExclamationTriangle, FaArrowLeft, FaBuilding, FaClock, FaUsers, FaRegClock, FaInfoCircle } from 'react-icons/fa';
import { getRooms, getBookingDetails, changeBookingRoom, filterRooms } from '../../services/api';

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
    capacity: [],
    timeRange: [],
    duration: [],
    building: []
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showUnavailableRooms, setShowUnavailableRooms] = useState(true);

  // Các tùy chọn filter giống với RoomSearchPage
  const buildingOptions = ['B1', 'H2', 'H3', 'H6'];
  const timeRangeOptions = ['7h - 9h', '9h - 11h', '11h - 13h', '13h - 15h', '15h - 17h', '17h - 19h', '19h - 21h'];
  const capacityOptions = [2, 5, 7];
  const durationOptions = ['1 tiếng', '2 tiếng', '3 tiếng', '4 tiếng'];

  // Format thời gian theo định dạng UTC (không thêm offset múi giờ địa phương)
  const formatTime = (isoTimeString) => {
    try {
      const date = new Date(isoTimeString);
      
      // Use UTC methods to get the time components without timezone adjustment
      const day = date.getUTCDate();
      const month = date.getUTCMonth() + 1;
      const year = date.getUTCFullYear();
      const hours = date.getUTCHours().toString().padStart(2, '0');
      const minutes = date.getUTCMinutes().toString().padStart(2, '0');

      const weekdayUTC = date.getUTCDay();
      const weekdays = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
      const weekday = weekdays[weekdayUTC];

      // Add debug logging in development environment
      if (process.env.NODE_ENV === 'development') {
        console.log('Time debug:', {
          originalISO: isoTimeString,
          utcTime: `${hours}:${minutes}`,
          localTime: `${date.getHours()}:${date.getMinutes()}`
        });
      }

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
          // Ensure booking data includes roomName
          const bookingData = bookingResponse.data;
          
          // If roomName is undefined, try to get it from room properties
          if (!bookingData.roomName) {
            console.log('Debug booking data:', bookingData);
            bookingData.roomName = bookingData.room?.name || 
                                 `Phòng ${bookingData.roomId || bookingData.room_id || ""}`;
          }
          
          setCurrentBooking(bookingData);
          
          // Cập nhật selectedDate từ booking
          if (bookingData.startTime) {
            const bookingDate = new Date(bookingData.startTime);
            setSelectedDate(bookingDate.toISOString().split('T')[0]);
          }
          
          // Thêm timeRange dựa trên giờ bắt đầu và kết thúc
          if (bookingData.startTime && bookingData.endTime) {
            const startHour = new Date(bookingData.startTime).getUTCHours();
            const endHour = new Date(bookingData.endTime).getUTCHours();
            const timeRange = `${startHour}h - ${endHour}h`;
            
            // Kiểm tra xem timeRange có trong các tùy chọn không
            if (timeRangeOptions.includes(timeRange)) {
              setFilters(prev => ({
                ...prev,
                timeRange: [timeRange]
              }));
            }
          }
          
          // Kiểm tra tính hợp lệ của việc đổi phòng
          const bookingStatus = bookingData.bookingStatus;
          const isValidStatus = ['PENDING', 'CONFIRMED'].includes(bookingStatus);
          
          if (!isValidStatus) {
            setCanChangeRoom(false);
            setRestrictionReason(`Không thể đổi phòng khi trạng thái đặt phòng là: ${bookingStatus}`);
            setLoading(false);
            return;
          }
          
          // Lấy danh sách phòng khả dụng dựa trên chính xác thời gian của booking hiện tại
          await fetchAvailableRooms(bookingData);
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

  // Hàm tìm kiếm phòng khả dụng - tách riêng để tái sử dụng
  const fetchAvailableRooms = async (bookingData) => {
    try {
      // Lấy giờ bắt đầu và kết thúc từ booking
      const startTime = bookingData.startTime;
      const endTime = bookingData.endTime;
      
      console.log('Filtering with time range:', startTime, 'to', endTime);
      console.log('Excluding booking ID:', bookingId, 'from availability check');
      
      // Gọi API để lấy phòng khả dụng với thời gian đã chọn
      const roomsResponse = await filterRooms({
        date: selectedDate,
        startTime: startTime,
        endTime: endTime,
        excludeBookingId: bookingId // Thêm ID booking hiện tại để loại trừ khỏi việc kiểm tra chồng chéo
      });
      
      if (roomsResponse.success) {
        console.log('Available rooms:', roomsResponse.data.length);
        
        // Đánh dấu các phòng có sẵn và loại bỏ phòng hiện tại khỏi danh sách
        const availableRooms = roomsResponse.data
          .filter(room => room.id !== bookingData.roomId && room.status === 'AVAILABLE')
          .map(room => ({
            ...room,
            isAvailableForTimeRange: true // Đánh dấu tất cả là có sẵn vì đã lọc bởi backend
          }));
        
        setRooms(availableRooms);
      } else {
        setError('Không thể tải danh sách phòng');
      }
    } catch (err) {
      console.error('Error fetching available rooms:', err);
      setError('Đã xảy ra lỗi khi tải danh sách phòng khả dụng.');
    }
  };

  // Apply filters tương tự với RoomSearchPage
  const applyFilters = async () => {
    if (!currentBooking) return;
    
    try {
      setLoading(true);
      
      const apiFilters = {
        date: selectedDate,
        excludeBookingId: bookingId
      };
      
      // Thêm capacity filter nếu có
      if (filters.capacity.length) {
        apiFilters.capacity = Math.min(...filters.capacity);
      }
      
      // Thêm building filter nếu có
      if (filters.building.length) {
        apiFilters.building = filters.building[0];
      }
      
      // Thêm time range filter nếu có hoặc dùng thời gian từ booking
      if (filters.timeRange.length > 0) {
        const timeRange = filters.timeRange[0];
        const parts = timeRange.split(' - ');
        const startTime = parts[0].replace('h', ':00');
        const endTime = parts[1].replace('h', ':00');
        
        apiFilters.startTime = `${selectedDate}T${startTime}:00.000Z`;
        apiFilters.endTime = `${selectedDate}T${endTime}:00.000Z`;
      } else if (currentBooking.startTime && currentBooking.endTime) {
        apiFilters.startTime = currentBooking.startTime;
        apiFilters.endTime = currentBooking.endTime;
      }
      
      console.log("Applying filters:", apiFilters);
      
      const response = await filterRooms(apiFilters);
      if (response.success) {
        console.log("Filtered rooms received:", response.data.length);
        
        // Đánh dấu các phòng khả dụng và loại bỏ phòng hiện tại
        const availableRooms = response.data
          .filter(room => room.id !== currentBooking.roomId)
          .map(room => ({
            ...room,
            isAvailableForTimeRange: true // Đánh dấu tất cả là có sẵn vì đã lọc bởi backend
          }));
        
        setRooms(availableRooms);
      } else {
        console.error("Filter API error:", response.error || "Unknown error");
      }
    } catch (err) {
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi ô tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Xử lý thay đổi filter
  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => {
      const updatedFilters = {...prevFilters};
      
      if (updatedFilters[category].includes(value)) {
        // Nếu đã có trong filter, loại bỏ
        updatedFilters[category] = updatedFilters[category].filter(item => item !== value);
      } else {
        // Nếu là timeRange, chỉ cho phép chọn một
        if (category === 'timeRange') {
          updatedFilters[category] = [value];
        } else {
          // Đối với các filter khác, cho phép chọn nhiều
          updatedFilters[category] = [...updatedFilters[category], value];
        }
      }
      
      return updatedFilters;
    });
  };
  
  // Kích hoạt áp dụng filter khi filter hoặc ngày thay đổi
  useEffect(() => {
    // Kiểm tra nếu có filter được chọn
    const hasActiveFilters = filters.capacity.length > 0 ||
                           filters.building.length > 0 ||
                           filters.timeRange.length > 0 ||
                           filters.duration.length > 0;
    
    // Áp dụng filter nếu có filter được chọn và đã có booking
    if (hasActiveFilters && currentBooking) {
      const debounceTimer = setTimeout(() => {
        console.log("Applying filters due to filter change:", filters);
        applyFilters();
      }, 500);
      
      return () => clearTimeout(debounceTimer);
    }
  }, [filters, selectedDate, currentBooking]);
  
  // Lọc phòng dựa trên từ khóa tìm kiếm và bộ lọc
  const filteredRooms = searchQuery
    ? rooms.filter(room => 
        room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.building?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : rooms;

  // Hiển thị phòng dựa theo filter khả dụng
  const displayedRooms = filters.timeRange.length > 0 && !showUnavailableRooms
    ? filteredRooms.filter(room => room.isAvailableForTimeRange !== false)
    : filteredRooms;
  
  // Xử lý yêu cầu đổi phòng
  const handleChangeRoom = async (newRoomId) => {
    try {
      if (!currentBooking || !newRoomId) return;
      
      setProcessingChange(true);
      console.log(`Changing booking ${currentBooking.id} to room ${newRoomId}`);
      const response = await changeBookingRoom(currentBooking.id, newRoomId);
      
      if (response.success) {
        setChangeSuccess(true);
      } else {
        setError(response.error || 'Không thể đổi phòng. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Error changing room:', err);
      setError(`Đã xảy ra lỗi khi đổi phòng: ${err.message}`);
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
                <FaSearch className="changeroom-search-icon" />
                <input
                  type="text"
                  placeholder="Tìm phòng theo tên, vị trí..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyPress={(e) => e.key === 'Enter'}
                  className="changeroom-search-input"
                />
              </div>

              <h4>Bộ lọc</h4>

              <div className="changeroom-filter-group">
                <h5><FaCalendar /> Ngày</h5>
                <div className="changeroom-date-selector">
                  <input 
                    type="date"
                    value={selectedDate}
                    disabled
                    className="changeroom-date-input"
                  />
                </div>
              </div>

              <div className="changeroom-filter-group">
                <h5><FaBuilding /> Tòa nhà</h5>
                {buildingOptions.map((building) => (
                  <label key={building}>
                    <input 
                      type="checkbox" 
                      onChange={() => handleFilterChange('building', building)} 
                      checked={filters.building?.includes(building)}
                    /> {building}
                  </label>
                ))}
              </div>

              <div className="changeroom-filter-group">
                <h5><FaClock /> Khoảng giờ</h5>
                {timeRangeOptions.map((t) => (
                  <label key={t}>
                    <input 
                      type="checkbox"
                      onChange={() => handleFilterChange('timeRange', t)} 
                      checked={filters.timeRange?.includes(t)}
                    /> {t}
                  </label>
                ))}
                
                {filters.timeRange.length > 0 && (
                  <div className="changeroom-availability-toggle">
                    <label>
                      <input 
                        type="checkbox"
                        checked={showUnavailableRooms}
                        onChange={() => setShowUnavailableRooms(!showUnavailableRooms)}
                      /> Hiển thị cả phòng không khả dụng
                    </label>
                  </div>
                )}
              </div>

              <div className="changeroom-filter-group">
                <h5><FaUsers /> Số lượng người</h5>
                {capacityOptions.map((c) => (
                  <label key={c}>
                    <input 
                      type="checkbox" 
                      onChange={() => handleFilterChange('capacity', c)} 
                      checked={filters.capacity?.includes(c)}
                    /> {c} người
                  </label>
                ))}
              </div>

              <div className="changeroom-filter-group">
                <h5><FaRegClock /> Thời lượng sử dụng</h5>
                {durationOptions.map((d) => (
                  <label key={d}>
                    <input 
                      type="checkbox" 
                      onChange={() => handleFilterChange('duration', d)} 
                      checked={filters.duration?.includes(d)}
                    /> {d}
                  </label>
                ))}
              </div>
            </aside>

            <section className="changeroom-room-listing">
              <h3>Phòng khả dụng cho thời gian đã chọn</h3>
              
              <div className="changeroom-results-header">
                <p className="changeroom-result-count">{filteredRooms.length} kết quả được tìm thấy</p>
                
                {filters.timeRange.length > 0 && (
                  <div className="changeroom-availability-info">
                    <FaInfoCircle className="changeroom-info-icon" />
                    <span>
                      Phòng hiển thị dựa trên khung giờ {filters.timeRange[0]} 
                      {!showUnavailableRooms ? " (chỉ hiển thị phòng khả dụng)" : ""}
                    </span>
                  </div>
                )}
              </div>
              
              {processingChange ? (
                <div className="changeroom-processing">Đang xử lý yêu cầu đổi phòng...</div>
              ) : error ? (
                <div className="changeroom-error-message">{error}</div>
              ) : displayedRooms.length === 0 ? (
                <div className="changeroom-no-results">
                  <p>Không tìm thấy phòng phù hợp với bộ lọc đã chọn.</p>
                  <p>Vui lòng thử điều chỉnh lại bộ lọc.</p>
                </div>
              ) : (
                <div className="changeroom-room-grid">
                  {displayedRooms.map((room) => (
                    <div 
                      key={room.id} 
                      className={`changeroom-room-card-modern ${filters.timeRange.length > 0 && room.isAvailableForTimeRange === false ? 'unavailable-room' : ''}`}
                    >
                      <img 
                        src={
                          room.roomImage || room.room_image
                            ? `http://localhost:5000${room.roomImage || room.room_image}`
                            : require('../../assets/room-main.png')
                        } 
                        alt={room.name} 
                      />
                      <div className="changeroom-card-body">
                        <div>
                          <h4>{room.name}</h4>
                          <p className="changeroom-location"><FaBuilding size={12} /> {room.building || 'B1'}, {room.location || 'Lầu 1'}</p>
                          <p className="changeroom-room-capacity"><FaUsers size={12} /> {room.capacity || '50'} người</p>
                          
                          {filters.timeRange.length > 0 && (
                            <p className={`room-availability ${room.isAvailableForTimeRange ? 'available' : 'unavailable'}`}>
                              {room.isAvailableForTimeRange ? 'Khả dụng' : 'Không khả dụng'} trong khoảng giờ {filters.timeRange[0]}
                            </p>
                          )}
                          
                          <div className="changeroom-room-features">
                            {room.facilities && Array.isArray(room.facilities) && room.facilities.map((facility, idx) => (
                              <span key={idx} className="changeroom-facility-tag">{facility}</span>
                            ))}
                            {room.facilities && typeof room.facilities === 'string' && (
                              <span className="changeroom-facility-tag">{room.facilities}</span>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          className={`changeroom-book-btn ${filters.timeRange.length > 0 && room.isAvailableForTimeRange === false ? 'btn-disabled' : ''}`} 
                          onClick={() => handleChangeRoom(room.id)}
                          disabled={processingChange || (filters.timeRange.length > 0 && room.isAvailableForTimeRange === false)}
                        >
                          {filters.timeRange.length > 0 && room.isAvailableForTimeRange === false ? 
                            'Không khả dụng' : 'Đổi sang phòng này'}
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