import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomSearchPage.css';
import Header from '../../components/common/Header';
import { FaSearch, FaCalendar, FaBuilding, FaClock, FaUsers, FaRegClock, FaInfoCircle } from 'react-icons/fa';
import { getRooms, searchRooms, filterRooms } from '../../services/api';

const RoomSearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState({
    capacity: [],
    timeRange: [],
    duration: [],
    building: []
  });
  const [showUnavailableRooms, setShowUnavailableRooms] = useState(true);

  const buildingOptions = ['B1', 'H2' ,'H3', 'H6'];
  const timeRangeOptions = ['7h - 9h', '9h - 11h', '11h - 13h', '13h - 15h', '15h - 17h', '17h - 19h', '19h - 21h'];
  const capacityOptions = [2, 5, 7];
  const durationOptions = ['1 tiếng', '2 tiếng', '3 tiếng', '4 tiếng'];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await getRooms();
        if (response.success) {
          setRooms(response.data);
          console.log("Initial rooms loaded:", response.data.length);
        } else {
          setError('Failed to load rooms');
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) {
      try {
        setLoading(true);
        const response = await getRooms();
        if (response.success) {
          setRooms(response.data);
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const response = await searchRooms(searchQuery);
      if (response.success) {
        setRooms(response.data);
      }
    } catch (err) {
      console.error('Error searching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
      if (updatedFilters[filterType].includes(value)) {
        updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value);
      } else {
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
      
      return updatedFilters;
    });
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const apiFilters = {
        capacity: filters.capacity.length ? Math.min(...filters.capacity) : undefined,
        date: selectedDate,
        building: filters.building.length ? filters.building[0] : undefined,
      };
      
      if (filters.timeRange.length > 0) {
        const timeRange = filters.timeRange[0];
        const parts = timeRange.split(' - ');
        const startTime = parts[0].replace('h', ':00');
        const endTime = parts[1].replace('h', ':00');
        
        apiFilters.startTime = startTime;
        apiFilters.endTime = endTime;
      }
      
      console.log("Sending API filters:", apiFilters);
      const response = await filterRooms(apiFilters);
      
      if (response.success) {
        console.log("Filtered rooms received:", response.data.length);
        setRooms(response.data);
      } else {
        console.error("Filter API error:", response.error || "Unknown error");
        // Không đặt setRooms([]) ở đây để tránh mất dữ liệu nếu API lỗi
      }
    } catch (err) {
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = () => {
    return filters.capacity.length > 0 || 
           filters.building.length > 0 || 
           filters.timeRange.length > 0 || 
           filters.duration.length > 0 ||
           searchQuery.trim() !== '';
  };

  useEffect(() => {
    // Chỉ thực hiện filter khi có ít nhất một điều kiện lọc được chọn
    const hasActiveFilter = filters.capacity.length > 0 || 
                           filters.building.length > 0 || 
                           filters.timeRange.length > 0 || 
                           filters.duration.length > 0;
    
    // Sử dụng debounce để tránh gọi API quá nhiều khi thay đổi filter
    const timer = setTimeout(() => {
      if (hasActiveFilter) {
        console.log("Applying filters:", filters);
        applyFilters();
      } else if (rooms.length === 0) {
        // Chỉ tải lại tất cả các phòng nếu danh sách hiện tại trống
        console.log("Fetching all rooms because no active filters");
        const fetchAllRooms = async () => {
          try {
            setLoading(true);
            const response = await getRooms();
            if (response.success) {
              console.log("All rooms loaded:", response.data.length);
              setRooms(response.data);
            }
          } catch (err) {
            console.error('Error fetching all rooms:', err);
          } finally {
            setLoading(false);
          }
        };
        
        fetchAllRooms();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [filters, selectedDate]);

  const handleBookRoom = (room) => {
    let selectedStartHour = 7;
    let selectedEndHour = 9;
    
    if (filters.timeRange.length > 0) {
      const timeRange = filters.timeRange[0];
      const parts = timeRange.split(' - ');
      selectedStartHour = parseInt(parts[0].replace('h', ''), 10);
      selectedEndHour = parseInt(parts[1].replace('h', ''), 10);
    }
    
    const selectedDuration = filters.duration.length > 0 ? filters.duration[0] : '1 tiếng';
    
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);
    
    const startTime = new Date(selectedDateObj);
    startTime.setHours(selectedStartHour, 0, 0, 0);
    
    const endTime = new Date(selectedDateObj);
    endTime.setHours(selectedEndHour, 0, 0, 0);
    
    const formattedDate = new Date(selectedDate).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    navigate('/confirm-booking', { 
      state: { 
        roomData: room,
        selectedDate: selectedDate,
        formattedDate: formattedDate,
        selectedTimeRange: filters.timeRange.length > 0 ? filters.timeRange[0] : '7h - 9h',
        selectedDuration: selectedDuration,
        selectedStartHour,
        selectedEndHour,
        startTimeISO: startTime.toISOString(),
        endTimeISO: endTime.toISOString(),
        attendeesCount: filters.capacity.length > 0 ? filters.capacity[0] : room.capacity || 20
      } 
    });
  };

  const toggleUnavailableRooms = () => {
    setShowUnavailableRooms(!showUnavailableRooms);
  };

  const filteredRooms = searchQuery
    ? rooms.filter(room => 
        room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (room.location && room.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (room.building && room.building.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : rooms;

  const displayedRooms = filters.timeRange.length > 0 && !showUnavailableRooms
    ? filteredRooms.filter(room => room.isAvailableForTimeRange !== false)
    : filteredRooms;

  return (
    <div className="room-search-layout">
      <Header />

      <div className="room-search-wrapper">
        <aside className="filter-sidebar">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm phòng theo tên, vị trí..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
          </div>

          <h4>Bộ lọc</h4>

          <div className="filter-group">
            <h5><FaCalendar /> Ngày</h5>
            <div className="date-selector">
              <input 
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                min={new Date().toISOString().split('T')[0]}
                className="date-input"
              />
            </div>
          </div>

          <div className="filter-group">
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

          <div className="filter-group">
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
              <div className="availability-toggle">
                <label>
                  <input 
                    type="checkbox"
                    checked={showUnavailableRooms}
                    onChange={toggleUnavailableRooms}
                  /> Hiển thị cả phòng không khả dụng
                </label>
              </div>
            )}
          </div>

          <div className="filter-group">
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

          <div className="filter-group">
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

        <section className="room-listing">
          <h2>Phòng khả dụng ngày {new Date(selectedDate).toLocaleDateString('vi-VN')}</h2>
          
          {loading ? (
            <div className="loading">Đang tải danh sách phòng...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <div className="results-header">
                <p>{displayedRooms.length} kết quả được tìm thấy</p>
                
                {filters.timeRange.length > 0 && (
                  <div className="availability-info">
                    <FaInfoCircle className="info-icon" />
                    <span>
                      Phòng hiển thị dựa trên khung giờ {filters.timeRange[0]} 
                      {!showUnavailableRooms ? " (chỉ hiển thị phòng khả dụng)" : ""}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="room-grid">
                {displayedRooms.length > 0 ? (
                  displayedRooms.map((room) => (
                    <div 
                      key={room.id} 
                      className={`room-card-modern ${filters.timeRange.length > 0 && room.isAvailableForTimeRange === false ? 'unavailable-room' : ''}`}
                    >
                      <img 
                        src={
                          room.roomImage || room.room_image
                            ? `http://localhost:5000${room.roomImage || room.room_image}`
                            : require('../../assets/room-main.png')
                        } 
                        alt={room.name} 
                      />
                      <div className="card-body">
                        <div>
                          <h4>{room.name}</h4>
                          <p className="room-location"><FaBuilding size={12} /> {room.building || 'B1'}, {room.location || 'Lầu 1'}</p>
                          <p className="room-capacity"><FaUsers size={12} /> {room.capacity || '50'} người</p>
                          
                          {filters.timeRange.length > 0 && (
                            <p className={`room-availability ${room.isAvailableForTimeRange ? 'available' : 'unavailable'}`}>
                              {room.isAvailableForTimeRange ? 'Khả dụng' : 'Không khả dụng'} trong khoảng giờ {filters.timeRange[0]}
                            </p>
                          )}
                          
                          <div className="room-features">
                            {room.facilities && Array.isArray(room.facilities) && room.facilities.map((facility, idx) => (
                              <span key={idx} className="facility-tag">{facility}</span>
                            ))}
                            {room.facilities && typeof room.facilities === 'string' && (
                              <span className="facility-tag">{room.facilities}</span>
                            )}
                          </div>
                        </div>
                        
                        <button 
                          className={`btn-primary ${filters.timeRange.length > 0 && room.isAvailableForTimeRange === false ? 'btn-disabled' : ''}`} 
                          onClick={() => handleBookRoom(room)}
                          disabled={filters.timeRange.length > 0 && room.isAvailableForTimeRange === false}
                        >
                          {filters.timeRange.length > 0 && room.isAvailableForTimeRange === false ? 
                            'Không khả dụng' : 'Đặt phòng'}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-results">
                    <p>Không tìm thấy phòng phù hợp với bộ lọc đã chọn.</p>
                    <p>Vui lòng thử điều chỉnh lại bộ lọc hoặc chọn ngày khác.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default RoomSearchPage;
