import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserVerification1.css';
import Headermanager from '../../components/common/Headermanager';

const UserVerification1 = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Dữ liệu cứng cho thông tin người dùng và phòng đã đặt
  const userDetails = {
    4: {
      name: 'Hồ Hoàng D',
      email: 'email@gamil.com',
      role: 'Sinh viên',
      mssv: '1234567',
      lastLogin: '12/03/2025',
      status: 'rejected',
      note: 'lớp abcxyz',
      bookings: [
        { date: '01/02/2025', room: 'H1 - 201', time: '15:00 - 17:00', description: 'Description' },
        { date: '18/01/2025', room: 'H3 - 405', time: '12:00 - 16:00', description: 'Description' },
      ],
    },
    // Bạn có thể thêm dữ liệu cho các người dùng khác nếu cần
  };

  const user = userDetails[userId] || {
    name: 'Không tìm thấy',
    email: '',
    role: '',
    mssv: '',
    lastLogin: '',
    status: '',
    note: '',
    bookings: [],
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'verified':
        return 'Đã xác thực';
      case 'pending':
        return 'Chưa xác thực';
      case 'rejected':
        return 'Bị từ chối';
      default:
        return 'Không xác định';
    }
  };

  return (
    <div className="user-verification-detail-page">
      <Headermanager />

      <main className="main-content">
        <h2 className="page-title">Quản lý xác thực người dùng</h2>

        <div className="user-details">
          <div className="user-header">
            <h3>{user.name}</h3>
            <span className={`status-badge ${user.status}`}>
              {getStatusText(user.status)}
            </span>
          </div>

          <div className="info-section">
            <div className="info-item">
              <label>Chức vụ</label>
              <p>{user.role}</p>
            </div>
            <div className="info-item">
              <label>MSSV</label>
              <p>{user.mssv}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Lần đăng nhập gần nhất</label>
              <p>{user.lastLogin}</p>
            </div>
            <div className="info-item">
              <label>Trạng thái</label>
              <p>{getStatusText(user.status)}</p>
            </div>
            <div className="info-item">
              <label>Ghi chú</label>
              <p>{user.note}</p>
            </div>
          </div>

          <div className="booking-list">
            <h3>Phòng đã đặt</h3>
            {user.bookings.length > 0 ? (
              user.bookings.map((booking, index) => (
                <div className="booking-item" key={index}>
                  <img
                    src="https://via.placeholder.com/80x80"
                    alt="Room"
                    className="booking-image"
                  />
                  <div className="booking-details">
                    <p className="booking-date">{booking.date}</p>
                    <p className="booking-room">{booking.room}</p>
                    <p className="booking-time">{booking.time}</p>
                    <p className="booking-description">{booking.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có phòng nào được đặt.</p>
            )}
          </div>
        </div>

        <button className="back-btn" onClick={() => navigate('/user-verification')}>
          Quay lại
        </button>
      </main>
    </div>
  );
};

export default UserVerification1;