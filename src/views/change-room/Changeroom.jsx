import React, { useState, useEffect } from 'react';
import './Changeroom.css';
// Import hình ảnh và icons
import roomImage from '../../assets/room-main.png';
import { FaUser, FaBell, FaSearch, FaProjectDiagram, FaSnowflake, FaClock } from 'react-icons/fa';
import Header from '../../components/common/Header';

const ChangeRoomPage = ({ navigateTo, params }) => {
  // Hiển thị thông tin từ tham số nếu có
  const bookingId = params?.bookingId || 'không xác định';
  
  // State cho từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState('');
  
  // State cho bộ lọc
  const [filters, setFilters] = useState({
    size: [],
    timeRange: [],
    capacity: [],
    duration: [],
    amenities: []
  });
  
  // Dữ liệu mẫu cho danh sách phòng
  const roomsData = [
    {
      id: 1,
      name: 'Phòng B1-201',
      description: 'Tọa lạc tầng 2 tòa B1',
      amenities: 'Tiện nghi máy chiếu, bảng trắng, điều hòa',
      image: roomImage,
      size: 2,
      capacity: 10
    },
    {
      id: 2,
      name: 'Phòng B1-202',
      description: 'Tọa lạc tầng 2 tòa B1',
      amenities: 'Tiện nghi máy chiếu, bảng trắng, điều hòa, âm thanh',
      image: roomImage,
      size: 1,
      capacity: 10
    },
    {
      id: 3,
      name: 'Phòng B1-301',
      description: 'Tọa lạc tầng 3 tòa B1',
      amenities: 'Tiện nghi bảng trắng, điều hòa',
      image: roomImage,
      size: 2,
      capacity: 150
    }
  ];
  
  // Hàm xử lý thay đổi từ khóa tìm kiếm
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Hàm xử lý thay đổi bộ lọc
  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => {
      const updatedFilters = {...prevFilters};
      
      if (updatedFilters[category].includes(value)) {
        // Nếu đã có giá trị này trong bộ lọc, loại bỏ nó
        updatedFilters[category] = updatedFilters[category].filter(item => item !== value);
      } else {
        // Nếu chưa có, thêm vào
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      
      return updatedFilters;
    });
  };
  
  // Lọc phòng dựa trên từ khóa tìm kiếm và bộ lọc
  const filteredRooms = roomsData.filter(room => {
    // Lọc theo từ khóa tìm kiếm
    if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Lọc theo cỡ phòng
    if (filters.size.length > 0 && !filters.size.includes(room.size)) {
      return false;
    }
    
    // Lọc theo sức chứa
    if (filters.capacity.length > 0) {
      let capacityMatch = false;
      for (const cap of filters.capacity) {
        if (room.capacity === parseInt(cap)) {
          capacityMatch = true;
          break;
        }
      }
      if (!capacityMatch) return false;
    }
    
    // Các bộ lọc khác có thể thêm ở đây
    
    return true;
  });
  
  // Hàm xử lý khi nhấn nút đổi phòng
  const handleChangeRoom = (roomId) => {
    alert(`Đang xử lý yêu cầu đổi sang phòng có ID: ${roomId} cho đơn đặt phòng #${bookingId}`);
    // Trong thực tế, sẽ có API call để tiến hành đổi phòng và xác nhận
    // Sau khi đổi phòng thành công, chuyển hướng về trang My Room
    navigateTo('myroom');
  };

  // Hàm điều hướng đến trang My Rooms
  const handleMyRooms = () => {
    navigateTo('myroom');
  };

  return (
    <div className="changeroom-page">
      <Header />
      
      {/* Main Content */}
      <main className="changeroom-main-content">
        {/* Thông tin phòng hiện tại */}
        <div className="changeroom-current-room-info">
          <h2>Đổi phòng cho đơn đặt phòng</h2>
          <div className="changeroom-current-room-card">
            <div className="changeroom-room-image">
              <img src={roomImage} alt="Current Room" />
            </div>
            <div className="changeroom-room-details">
              <h3>Phòng hiện tại: B1-201</h3>
              <p>Thời gian: Chủ nhật, 19/03/2023 - 9:00 - 10:00</p>
              <p>Thời lượng: 1 tiếng</p>
              <p>Sức chứa: 2 người</p>
            </div>
          </div>
        </div>
        
        {/* Thanh tìm kiếm */}
        <div className="changeroom-search-container">
          <div className="changeroom-search-box">
            <FaSearch className="changeroom-search-icon" />
            <input 
              type="text" 
              placeholder="Search by room name" 
              value={searchQuery}
              onChange={handleSearchChange}
              className="changeroom-search-input"
            />
          </div>
        </div>
        
        {/* Nội dung chính với bộ lọc và danh sách phòng */}
        <div className="changeroom-content-container">
          {/* Bộ lọc bên trái */}
          <div className="changeroom-filter-panel">
            <h3>Filter by</h3>
            
            {/* Bộ lọc cỡ phòng */}
            <div className="changeroom-filter-group">
              <h4>Cỡ số</h4>
              <div className="changeroom-filter-options">
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('size', 1)}
                    checked={filters.size.includes(1)}
                  />
                  <span>1 người</span>
                  <span className="changeroom-count">200</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('size', 2)}
                    checked={filters.size.includes(2)}
                  />
                  <span>2 người</span>
                  <span className="changeroom-count">100</span>
                </label>
              </div>
            </div>
            
            {/* Bộ lọc khoảng giờ */}
            <div className="changeroom-filter-group">
              <h4>Khoảng giờ</h4>
              <div className="changeroom-filter-options">
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('timeRange', '7-9')}
                    checked={filters.timeRange.includes('7-9')}
                  />
                  <span>7h - 9h</span>
                  <span className="changeroom-count">92</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('timeRange', '9-11')}
                    checked={filters.timeRange.includes('9-11')}
                  />
                  <span>9h - 11h</span>
                  <span className="changeroom-count">85</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('timeRange', '11-13')}
                    checked={filters.timeRange.includes('11-13')}
                  />
                  <span>11h - 13h</span>
                  <span className="changeroom-count">90</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('timeRange', '13-15')}
                    checked={filters.timeRange.includes('13-15')}
                  />
                  <span>13h - 15h</span>
                  <span className="changeroom-count">88</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('timeRange', '15-17')}
                    checked={filters.timeRange.includes('15-17')}
                  />
                  <span>15h - 17h</span>
                  <span className="changeroom-count">95</span>
                </label>
              </div>
            </div>
            
            {/* Bộ lọc sức chứa tối đa */}
            <div className="changeroom-filter-group">
              <h4>Sức chứa tối đa</h4>
              <div className="changeroom-filter-options">
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('capacity', '50')}
                    checked={filters.capacity.includes('50')}
                  />
                  <span>50</span>
                  <span className="changeroom-count">30</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('capacity', '100')}
                    checked={filters.capacity.includes('100')}
                  />
                  <span>100</span>
                  <span className="changeroom-count">42</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('capacity', '150')}
                    checked={filters.capacity.includes('150')}
                  />
                  <span>150</span>
                  <span className="changeroom-count">38</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('capacity', '200')}
                    checked={filters.capacity.includes('200')}
                  />
                  <span>200</span>
                  <span className="changeroom-count">25</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('capacity', '250')}
                    checked={filters.capacity.includes('250')}
                  />
                  <span>250</span>
                  <span className="changeroom-count">15</span>
                </label>
              </div>
            </div>
            
            {/* Bộ lọc thời gian sử dụng */}
            <div className="changeroom-filter-group">
              <h4>Thời gian sử dụng</h4>
              <div className="changeroom-filter-options">
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('duration', '1')}
                    checked={filters.duration.includes('1')}
                  />
                  <span>1 tiếng</span>
                  <span className="changeroom-count">200</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('duration', '2')}
                    checked={filters.duration.includes('2')}
                  />
                  <span>2 tiếng</span>
                  <span className="changeroom-count">180</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('duration', '3')}
                    checked={filters.duration.includes('3')}
                  />
                  <span>3 tiếng</span>
                  <span className="changeroom-count">150</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('duration', '4')}
                    checked={filters.duration.includes('4')}
                  />
                  <span>4 tiếng</span>
                  <span className="changeroom-count">120</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('duration', '5')}
                    checked={filters.duration.includes('5')}
                  />
                  <span>5 tiếng</span>
                  <span className="changeroom-count">100</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('duration', '6+')}
                    checked={filters.duration.includes('6+')}
                  />
                  <span>6+ tiếng</span>
                  <span className="changeroom-count">80</span>
                </label>
              </div>
            </div>
            
            {/* Bộ lọc vật chất */}
            <div className="changeroom-filter-group">
              <h4>Vật chất</h4>
              <div className="changeroom-filter-options">
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('amenities', 'projector')}
                    checked={filters.amenities.includes('projector')}
                  />
                  <span>Máy chiếu</span>
                  <span className="changeroom-count">150</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('amenities', 'aircon')}
                    checked={filters.amenities.includes('aircon')}
                  />
                  <span>Máy lạnh</span>
                  <span className="changeroom-count">200</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Danh sách phòng khả dụng để đổi */}
          <div className="changeroom-room-list">
            <h3>Phòng khả dụng để đổi</h3>
            <p className="changeroom-result-count">{filteredRooms.length} kết quả được tìm thấy</p>
            
            <div className="changeroom-rooms-container">
              {filteredRooms.map(room => (
                <div className="changeroom-room-card" key={room.id}>
                  <div className="changeroom-room-image">
                    <img src={room.image} alt={room.name} />
                  </div>
                  <div className="changeroom-room-info">
                    <h4>{room.name}</h4>
                    <p className="changeroom-room-description">{room.description}</p>
                    <p className="changeroom-room-amenities">{room.amenities}</p>
                    <div className="changeroom-room-actions">
                      <button 
                        className="changeroom-change-btn" 
                        onClick={() => handleChangeRoom(room.id)}
                      >
                        Đổi
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangeRoomPage;