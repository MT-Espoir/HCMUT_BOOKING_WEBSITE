import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserVerificationPage.css';
import Headermanager from '../../components/common/Headermanager';
import { FaUser, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getUsersForVerification } from '../../services/api';

const UserVerificationPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsersForVerification();
        setUsers(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users for verification:', error);
        setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  if (loading) {
    return (
      <div className="user-verification-page">
        <Headermanager />
        <main className="main-content">
          <h2 className="page-title">Quản lý xác thực người dùng</h2>
          <div className="loading">Đang tải dữ liệu...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-verification-page">
        <Headermanager />
        <main className="main-content">
          <h2 className="page-title">Quản lý xác thực người dùng</h2>
          <div className="error">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="user-verification-page">
      <Headermanager />

      <main className="main-content">
        <h2 className="page-title">Quản lý xác thực người dùng</h2>

        <div className="user-list">
          <h3>Danh sách người dùng</h3>
          {users.length > 0 ? (
            users.map(user => (
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
            ))
          ) : (
            <p className="no-users">Không có người dùng nào cần xác thực</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserVerificationPage;