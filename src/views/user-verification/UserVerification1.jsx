import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './UserVerification1.css';
import Headermanager from '../../components/common/Headermanager';
import { getUserProfile, updateUserVerification } from '../../services/api';

const UserVerification1 = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const response = await getUserProfile(userId);
        setUser(response.data);
        setVerificationStatus(response.data.status || 'pending');
        setVerificationNotes(response.data.note || '');
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching user details for user ${userId}:`, error);
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleVerificationChange = (status) => {
    setVerificationStatus(status);
  };

  const handleNotesChange = (e) => {
    setVerificationNotes(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateUserVerification(userId, verificationStatus, verificationNotes);
      setIsSubmitting(false);
      
      alert(`Trạng thái xác thực người dùng đã được cập nhật thành ${getStatusText(verificationStatus)}`);
      
      // Cập nhật lại thông tin người dùng sau khi thay đổi
      const updatedUserResponse = await getUserProfile(userId);
      setUser(updatedUserResponse.data);
    } catch (error) {
      console.error(`Error updating verification for user ${userId}:`, error);
      setIsSubmitting(false);
      alert('Không thể cập nhật trạng thái xác thực. Vui lòng thử lại sau.');
    }
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

  if (loading) {
    return (
      <div className="user-verification-detail-page">
        <Headermanager />
        <main className="main-content">
          <h2 className="page-title">Quản lý xác thực người dùng</h2>
          <div className="loading">Đang tải thông tin người dùng...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-verification-detail-page">
        <Headermanager />
        <main className="main-content">
          <h2 className="page-title">Quản lý xác thực người dùng</h2>
          <div className="error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
          </div>
          <button className="back-btn" onClick={() => navigate('/user-verification')}>
            Quay lại
          </button>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="user-verification-detail-page">
        <Headermanager />
        <main className="main-content">
          <h2 className="page-title">Quản lý xác thực người dùng</h2>
          <div className="user-details">
            <p>Không tìm thấy thông tin người dùng.</p>
          </div>
          <button className="back-btn" onClick={() => navigate('/user-verification')}>
            Quay lại
          </button>
        </main>
      </div>
    );
  }

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
              <p>{user.mssv || 'Không có'}</p>
            </div>
            <div className="info-item">
              <label>Email</label>
              <p>{user.email}</p>
            </div>
            <div className="info-item">
              <label>Lần đăng nhập gần nhất</label>
              <p>{user.lastLogin || 'Chưa có thông tin'}</p>
            </div>
            <div className="info-item">
              <label>Trạng thái</label>
              <p>{getStatusText(user.status)}</p>
            </div>
            <div className="info-item">
              <label>Ghi chú</label>
              <p>{user.note || '(Trống)'}</p>
            </div>
          </div>

          <div className="verification-actions">
            <h3>Cập nhật trạng thái xác thực</h3>
            <div className="status-buttons">
              <button 
                className={`status-button ${verificationStatus === 'verified' ? 'active' : ''}`}
                onClick={() => handleVerificationChange('verified')}
              >
                Xác thực
              </button>
              <button 
                className={`status-button ${verificationStatus === 'pending' ? 'active' : ''}`}
                onClick={() => handleVerificationChange('pending')}
              >
                Chờ xác thực
              </button>
              <button 
                className={`status-button ${verificationStatus === 'rejected' ? 'active' : ''}`}
                onClick={() => handleVerificationChange('rejected')}
              >
                Từ chối
              </button>
            </div>
            
            <div className="notes-input">
              <label>Ghi chú xác thực:</label>
              <textarea 
                value={verificationNotes} 
                onChange={handleNotesChange}
                placeholder="Nhập lý do xác thực hoặc từ chối..."
              ></textarea>
            </div>
            
            <button 
              className="save-button" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>

          <div className="booking-list">
            <h3>Phòng đã đặt</h3>
            {user.bookings && user.bookings.length > 0 ? (
              user.bookings.map((booking, index) => (
                <div className="booking-item" key={booking.id || index}>
                  <img
                    src={booking.image || "https://via.placeholder.com/80x80"}
                    alt="Room"
                    className="booking-image"
                  />
                  <div className="booking-details">
                    <p className="booking-date">{booking.date || (new Date(booking.timestamp)).toLocaleDateString()}</p>
                    <p className="booking-room">{booking.room || booking.roomId}</p>
                    <p className="booking-time">{booking.time || `${booking.startTime} - ${booking.endTime}`}</p>
                    <p className="booking-description">{booking.description || booking.purpose || 'Không có mô tả'}</p>
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