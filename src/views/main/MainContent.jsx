// src/views/main/MainContent.jsx
import React from 'react';
import bannerImage from '../../assets/B1.jpg';
import sampleImage from '../../assets/H23.jpg';

const roomSamples = [
  { id: 1, name: 'Phòng đọc với xyz', location: 'Tại phòng học NI', image: sampleImage },
  { id: 2, name: 'Phòng học với xyz', location: 'Tại phòng máy NI', image: sampleImage },
  { id: 3, name: 'Phòng học với xyz', location: 'Tại phòng tầng 3', image: sampleImage },
];

const MainContent = () => {
  return (
    <>
      <div className="hero-section">
        <img src={bannerImage} alt="HCMUT" className="hero-image" />
        <div className="hero-content">
          <h2>Bạn cần phòng để làm đồ án, tự học?</h2>
          <p>Hãy sử dụng dịch vụ thuê phòng chất lượng, hiện đại, tiện nghi</p>
        </div>
      </div>

      <div className="highlight-section">
        <h3>Enjoy your time in our room</h3>
        <p>Hãy đến và tận hưởng những phòng chức năng chất lượng tại trường mình</p>

        <div className="room-cards">
          {roomSamples.map(room => (
            <div className="room-card" key={room.id}>
              <img src={room.image} alt={room.name} />
              <h4>{room.name}</h4>
              <p>{room.location}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainContent;
