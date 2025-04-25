import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomSearchPage.css';
import roomImage from '../../assets/room-main.png';
import Header from '../../components/common/Header';
import { FaSearch } from 'react-icons/fa';

const RoomSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ branch: [], capacity: [], timeRange: [], duration: [], amenities: [] });
  const navigate = useNavigate();

  const roomsData = [
    {
      id: 1,
      name: 'Phòng B1-201',
      description: 'Tầng 2, toà B1',
      amenities: 'Máy chiếu, bảng trắng, điều hòa',
      image: roomImage,
      branch: 2,
      capacity: 100
    },
    {
      id: 2,
      name: 'Phòng B1-202',
      description: 'Tầng 2, toà B1',
      amenities: 'Máy chiếu, bảng trắng',
      image: roomImage,
      branch: 1,
      capacity: 50
    }
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (category, value) => {
    setFilters(prev => {
      const updated = { ...prev };
      updated[category] = updated[category].includes(value)
        ? updated[category].filter(item => item !== value)
        : [...updated[category], value];
      return updated;
    });
  };

  const filteredRooms = roomsData.filter(room => {
    if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (filters.branch.length > 0 && !filters.branch.includes(room.branch)) return false;
    if (filters.capacity.length > 0 && !filters.capacity.includes(String(room.capacity))) return false;
    return true;
  });

  const handleSelectRoom = (roomId) => {
    // Lưu ID phòng được chọn nếu cần
    navigate('/confirm-booking');
  };

  const checkboxFilter = (category, options) => (
    <div className="filter-group">
      <h4>{category}</h4>
      {options.map(opt => (
        <label className="filter-option" key={opt.value}>
          <input
            type="checkbox"
            onChange={() => handleFilterChange(opt.key, opt.value)}
            checked={filters[opt.key].includes(opt.value)}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="change-room-page">
      <Header />

      <main className="main-content">
        <h2>Tìm kiếm phòng</h2>

        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tên phòng..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="content-container">
          <div className="filter-panel">
            <h3>Bộ lọc</h3>
            {checkboxFilter('Cơ sở', [
              { key: 'branch', value: 1, label: '1 người' },
              { key: 'branch', value: 2, label: '2 người' },
            ])}
            {checkboxFilter('Sức chứa', [
              { key: 'capacity', value: '50', label: '50 người' },
              { key: 'capacity', value: '100', label: '100 người' },
            ])}
          </div>

          <div className="room-list">
            <h3>Danh sách phòng</h3>
            <div className="rooms-container">
              {filteredRooms.map(room => (
                <div className="room-card" key={room.id}>
                  <div className="room-image">
                    <img src={room.image} alt={room.name} />
                  </div>
                  <div className="room-info">
                    <h4>{room.name}</h4>
                    <p>{room.description}</p>
                    <p>{room.amenities}</p>
                    <div className="room-actions">
                      <button className="change-btn" onClick={() => handleSelectRoom(room.id)}>Chọn</button>
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

export default RoomSearchPage;
