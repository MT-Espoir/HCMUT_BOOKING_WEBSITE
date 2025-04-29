import React, { useState } from 'react';
import './RoomSearchPage.css';
import Header from '../../components/common/Header';
import roomImage from '../../assets/room-main.png';
import { FaSearch } from 'react-icons/fa';

const RoomSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const rooms = [
    {
      id: 1,
      name: 'Phòng B1-201',
      location: 'Tọa lạc tầng 2 tòa B1',
      amenities: 'Tiện nghi: máy chiếu, bảng trắng, điều hòa',
      image: roomImage
    },
    {
      id: 2,
      name: 'Phòng B1-202',
      location: 'Tọa lạc tầng 2 tòa B1',
      amenities: 'Tiện nghi: máy chiếu, bảng trắng, điều hòa, âm thanh',
      image: roomImage
    },
    {
      id: 3,
      name: 'Phòng B1-301',
      location: 'Tọa lạc tầng 3 tòa B1',
      amenities: 'Tiện nghi: bảng trắng, điều hòa',
      image: roomImage
    }
  ];

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredRooms = rooms.filter((room) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="room-search-layout">
      <Header />

      <div className="room-search-wrapper">
        {/* Sidebar */}
        <aside className="filter-sidebar">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by room name"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>

          <h4>Filter by</h4>

          <div className="filter-group">
            <h5>Cơ sở</h5>
            <label><input type="checkbox" /> 1 người</label>
            <label><input type="checkbox" /> 2 người</label>
          </div>

          <div className="filter-group">
            <h5>Khoảng giờ</h5>
            {['7h - 9h', '9h - 11h', '11h - 13h', '13h - 15h', '15h - 17h'].map((t, i) => (
              <label key={i}><input type="checkbox" /> {t}</label>
            ))}
          </div>

          <div className="filter-group">
            <h5>Sức chứa tối đa</h5>
            {[50, 100, 150, 200, 250].map((c) => (
              <label key={c}><input type="checkbox" /> {c}</label>
            ))}
          </div>

          <div className="filter-group">
            <h5>Thời gian sử dụng</h5>
            {['1 tiếng', '2 tiếng', '3 tiếng', '4 tiếng'].map((d, i) => (
              <label key={i}><input type="checkbox" /> {d}</label>
            ))}
          </div>
          
        </aside>

        {/* Main content */}
        <section className="room-listing">
          <h2>Phòng khả dụng để đặt </h2>
          <p>{filteredRooms.length} kết quả được tìm thấy</p>

          <div className="room-grid">
            {filteredRooms.map((room) => (
              <div key={room.id} className="room-card-modern">
                <img src={room.image} alt={room.name} />
                <div className="card-body">
                  <h4>{room.name}</h4>
                  <p>{room.location}</p>
                  <p>{room.amenities}</p>
                  <button className="btn-primary">Đặt</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RoomSearchPage;
