import React, { useState, useEffect } from 'react';
import './roomselection.css';
// Import API service
import { getRooms, searchRooms, filterRooms } from '../../../services/api';

const RoomSelectionPage = ({ navigateTo, selectRoom }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCapacity, setFilterCapacity] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rooms on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await getRooms();
        if (response.success) {
          setRooms(response.data);
        } else {
          setError('Failed to fetch rooms');
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Error loading rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Search and filter rooms
  useEffect(() => {
    const searchAndFilterRooms = async () => {
      try {
        setLoading(true);
        
        // Create filter object based on capacity
        const capacityFilter = {};
        if (filterCapacity === 'small') {
          capacityFilter.maxCapacity = 50;
        } else if (filterCapacity === 'medium') {
          capacityFilter.minCapacity = 51;
          capacityFilter.maxCapacity = 100;
        } else if (filterCapacity === 'large') {
          capacityFilter.minCapacity = 101;
        }
        
        // If search term exists, use search API
        let response;
        if (searchTerm) {
          response = await searchRooms(searchTerm);
        } else {
          // Otherwise use filters or get all rooms
          response = filterCapacity 
            ? await filterRooms(capacityFilter) 
            : await getRooms();
        }
        
        if (response.success) {
          setRooms(response.data);
        }
      } catch (err) {
        console.error('Error searching/filtering rooms:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce to avoid too many API calls while typing
    const timeoutId = setTimeout(() => {
      searchAndFilterRooms();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterCapacity]);

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
            <option value="large">Lớn (over 100 người)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">
          <p>Đang tải danh sách phòng...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : (
        <div className="room-grid">
          {rooms.length > 0 ? (
            rooms.map((room) => (
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
      )}
    </div>
  );
};

export default RoomSelectionPage;