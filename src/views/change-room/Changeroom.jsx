import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Changeroom.css';
import Header from '../../components/common/Header';
import roomImage from '../../assets/room-main.png';

const ChangeRoomPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();
  const [searchQuery, setSearchQuery] = useState('');

  const roomsData = [
    {
      id: 1,
      name: 'Phòng B1-201',
      description: 'Tọa lạc tầng 2 tòa B1',
      amenities: 'Máy chiếu, bảng trắng, điều hòa',
      image: roomImage,
      size: 2,
      capacity: 100
    },
    {
      id: 2,
      name: 'Phòng B1-202',
      description: 'Tọa lạc tầng 2 tòa B1',
      amenities: 'Máy chiếu, bảng trắng',
      image: roomImage,
      size: 1,
      capacity: 50
    }
  ];

  const filteredRooms = roomsData.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangeRoom = (roomId) => {
    alert(`Đã đổi sang phòng ID: ${roomId} cho booking ${bookingId}`);
    navigate('/myroom');
  };

  return (
    <div className="change-room-page">
      <Header />

      <main className="main-content">
        <h2>Đổi phòng cho booking #{bookingId}</h2>

        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm phòng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="rooms-container">
          {filteredRooms.map(room => (
            <div className="room-card" key={room.id}>
              <img src={room.image} alt={room.name} />
              <h4>{room.name}</h4>
              <p>{room.description}</p>
              <button onClick={() => handleChangeRoom(room.id)} className="change-btn">
                Đổi sang phòng này
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ChangeRoomPage;
