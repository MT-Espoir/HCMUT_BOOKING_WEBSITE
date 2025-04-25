// src/views/main/MainPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import './MainPage.css';
import bannerImage from '../../assets/B1.jpg';
import sampleImage from '../../assets/H23.jpg';

const roomSamples = [
  { id: 1, name: 'Phòng đọc với xyz', location: 'Tại phòng học NI', image: sampleImage },
  { id: 2, name: 'Phòng học với xyz', location: 'Tại phòng máy NI', image: sampleImage },
  { id: 3, name: 'Phòng học với xyz', location: 'Tại phòng tầng 3', image: sampleImage },
  { id: 4, name: 'Phòng học với xyz', location: 'Tại phòng tầng 4', image: sampleImage },
];

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <Header />

      <div className="hero-section">
        <img src={bannerImage} alt="HCMUT" className="hero-image" />
        <div className="hero-content">
          <h2>Bạn cần phòng để làm đồ án, tự học?</h2>
          <p>Hãy sử dụng dịch vụ thuê phòng chất lượng, hiện đại, tiện nghi</p>
          <button className="cta-button" onClick={() => navigate('/room-search')}>Tìm hiểu</button>
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
    </div>
  );
};

export default MainPage;
