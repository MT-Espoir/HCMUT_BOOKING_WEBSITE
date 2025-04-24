import React, { useState } from 'react';
import roomImage from '../../assests/room-main.png';

import { FaSearch, FaBell } from 'react-icons/fa';
import './RoomSearchPage.css';
import Header from '../Shared/Header/Header';


const RoomSelectionPage = ({ navigateTo, selectRoom }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ size: [], capacity: [], timeRange: [], duration: [], amenities: [] });

  const roomsData = [
    {
      id: 1,
      name: 'Phòng B1-201',
      description: 'Tầng 2, toà B1',
      amenities: 'Máy chiếu, bảng trắng, điều hòa',
      image: roomImage,
      size: 2,
      capacity: 100
    },
    {
      id: 2,
      name: 'Phòng B1-202',
      description: 'Tầng 2, toà B1',
      amenities: 'Máy chiếu, bảng trắng',
      image: roomImage,
      size: 1,
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
    if (filters.size.length > 0 && !filters.size.includes(room.size)) return false;
    if (filters.capacity.length > 0 && !filters.capacity.includes(String(room.capacity))) return false;
    return true;
  });

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
      {/* Header Component */}
      <Header navigateTo={navigateTo} />


      <main className="main-content">
        <h2>Tìm kiếm phòng</h2>

        <div className="search-container">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Têm phòng..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="content-container">
          <div className="filter-panel">
            <h3>Bộ lọc</h3>
            {checkboxFilter('Cỡ phòng', [
              { key: 'size', value: 1, label: '1 người' },
              { key: 'size', value: 2, label: '2 người' },
            ])}
            {checkboxFilter('Sức chứa', [
              { key: 'capacity', value: '50', label: '50 người' },
              { key: 'capacity', value: '100', label: '100 người' },
            ])}
            {checkboxFilter('Khoảng giờ', [
              { key: 'timeRange', value: '7-9', label: '7h - 9h' },
              { key: 'timeRange', value: '9-11', label: '9h - 11h' },
              { key: 'timeRange', value: '11-13', label: '11h - 13h' },
              { key: 'timeRange', value: '13-15', label: '13h - 15h' },
              { key: 'timeRange', value: '15-17', label: '15h - 17h' },
            ])}
            {checkboxFilter('Thời lượng', [
              { key: 'duration', value: '1', label: '1 tiếng' },
              { key: 'duration', value: '2', label: '2 tiếng' },
              { key: 'duration', value: '3', label: '3 tiếng' },
              { key: 'duration', value: '4', label: '4 tiếng' },
              { key: 'duration', value: '5', label: '5 tiếng' },
              { key: 'duration', value: '6+', label: '6+ tiếng' },
            ])}
            {checkboxFilter('Tiện nghi', [
              { key: 'amenities', value: 'projector', label: 'Máy chiếu' },
              { key: 'amenities', value: 'aircon', label: 'Máy lạnh' },
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
                      <button className="change-btn" onClick={() => selectRoom(room.id)}>Chọn</button>
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

export default RoomSelectionPage;
