import React, { useState } from 'react';
import './roomselection.css';

const RoomSelectionPage = ({ navigateTo, roomsData, selectRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');

  // Lọc phòng dựa trên tìm kiếm và bộ lọc
  const filteredRooms = roomsData.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCapacity = filterCapacity === '' || 
                          (filterCapacity === 'small' && room.capacity <= 50) ||
                          (filterCapacity === 'medium' && room.capacity > 50 && room.capacity <= 100) ||
                          (filterCapacity === 'large' && room.capacity > 100);
    
    return matchesSearch && matchesCapacity;
  });

  // Xử lý khi chọn phòng
  const handleSelectRoom = (roomId) => {
    selectRoom(roomId);
  };

  // Biểu tượng người (dùng cho hiển thị sức chứa)
  const PersonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="#555"/>
    </svg>
  );

  // Biểu tượng vị trí
  const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="#555"/>
    </svg>
  );

  return (
    <div className="room-selection-container">
      <div className="room-selection-title">
        <h1>Chọn phòng học</h1>
        <p>Duyệt qua các phòng học có sẵn và chọn phòng phù hợp với nhu cầu của bạn</p>
      </div>

      <div className="room-filter">
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc vị trí phòng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '8px', width: '300px' }}
          />
        </div>
        
        <div>
          <select 
            value={filterCapacity} 
            onChange={(e) => setFilterCapacity(e.target.value)}
            style={{ padding: '8px', width: '200px' }}
          >
            <option value="">Tất cả sức chứa</option>
            <option value="small">Nhỏ (≤ 50 người)</option>
            <option value="medium">Trung bình (51-100 người)</option>
            <option value="large">Lớn ( 100 người)</option>
          </select>
        </div>
      </div>

      <div className="room-grid">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-card-image">
                <img src={room.images.main} alt={room.name} />
              </div>
              <div className="room-card-content">
                <h3 className="room-card-title">{room.name}</h3>
                <p className="room-card-desc">{room.description}</p>
                
                <div className="room-card-details">
                  <div className="room-card-capacity">
                    <PersonIcon /> <span>{room.capacity} người</span>
                  </div>
                  <div className="room-card-location">
                    <LocationIcon /> <span>{room.location}</span>
                  </div>
                </div>
                
                <button 
                  className="select-button"
                  onClick={() => handleSelectRoom(room.id)}
                >
                  Chọn phòng này
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '20px' }}>
            <p>Không tìm thấy phòng nào phù hợp với bộ lọc của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomSelectionPage;