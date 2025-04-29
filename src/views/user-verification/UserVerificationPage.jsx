import React from 'react';
import { Link } from 'react-router-dom';
import './UserVerificationPage.css';
import Headermanager from '../../components/common/Headermanager';
import { FaUser, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const UserVerificationPage = () => {
  const users = [
    { id: 1, name: 'Nguyễn Văn A', email: 'email@gamil.com', status: 'verified' },
    { id: 2, name: 'Trần Thanh B', email: 'email@gamil.com', status: 'verified' },
    { id: 3, name: 'Ngô Thị C', email: 'email@gamil.com', status: 'pending' },
    { id: 4, name: 'Hồ Hoàng D', email: 'email@gamil.com', status: 'rejected' },
    { id: 5, name: 'Phan Tố E', email: 'email@gamil.com', status: 'verified' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <FaCheckCircle className="status-icon verified" />;
      case 'pending':
      case 'rejected':
        return <FaTimesCircle className="status-icon not-verified" />;
      default:
        return null;
    }
  };

  return (
    <div className="user-verification-page">
      <Headermanager />

      <main className="main-content">
        <h2 className="page-title">Quản lý xác thực người dùng</h2>

        <div className="user-list">
          <h3>Danh sách người dùng</h3>
          {users.map(user => (
            <Link to={`/user-verification/${user.id}`} key={user.id} className="user-item-link">
              <div className="user-item">
                <FaUser className="user-icon" />
                <div className="user-details">
                  <p className="user-name">{user.name}</p>
                  <p className="user-email">{user.email}</p>
                </div>
                <div className="user-status">
                  {getStatusIcon(user.status)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default UserVerificationPage;