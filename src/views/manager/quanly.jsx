import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './quanly.css';
import Headermanager from '../../components/common/Headermanager';
import { FaUserAlt } from "react-icons/fa";
import { getUsersAndTheirActiveStatus, getUserProfile, updateUserStatus } from '../../services/api';

const QuanLy = () => {
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserIndex, setSelectedUserIndex] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);

    // Fetch users from API
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await getUsersAndTheirActiveStatus();
                setUsers(response.data || []);
                setLoading(false);
                
                // Select first user by default if users exist
                if (response.data && response.data.length > 0) {
                    showUserDetails(0, response.data[0].id);
                }
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const showUserDetails = async (index, userId) => {
        try {
            setSelectedUserIndex(index);
            setLoading(true);
            
            // Fetch user detailed profile including booking history
            const userProfileResponse = await getUserProfile(userId);
            setSelectedUser(userProfileResponse.data);
            setLoading(false);
        } catch (error) {
            console.error(`Error fetching user profile for ID ${userId}:`, error);
            setError('Không thể tải thông tin chi tiết người dùng. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };
    
    const handleStatusChange = async (userId, newStatus) => {
        try {
            await updateUserStatus(userId, newStatus);
            
            // Update local state to reflect the change
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId 
                        ? { ...user, status: newStatus } 
                        : user
                )
            );
            
            if (selectedUser && selectedUser.id === userId) {
                setSelectedUser(prev => ({ ...prev, status: newStatus }));
            }
            
            alert(`Trạng thái người dùng đã được cập nhật thành ${newStatus}`);
        } catch (error) {
            console.error(`Error updating user status for ID ${userId}:`, error);
            alert('Không thể cập nhật trạng thái người dùng. Vui lòng thử lại sau.');
        }
    };

    if (loading && users.length === 0) {
        return (
            <div>
                <Headermanager />
                <div className="quanly-container">
                    <div className="loading">Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }

    if (error && users.length === 0) {
        return (
            <div>
                <Headermanager />
                <div className="quanly-container">
                    <div className="error">{error}</div>
                    <button onClick={() => window.location.reload()}>Thử lại</button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Headermanager />
            
            <div className="quanly-container">
                <div className="quanly-user-list">
                    <h2>Danh sách người dùng</h2>
                    {users.map((user, index) => (
                        <div 
                            key={user.id} 
                            className={`quanly-user-item ${selectedUserIndex === index ? 'selected' : ''}`}
                            onClick={() => showUserDetails(index, user.id)}
                        >
                            <FaUserAlt className='manager-usericon'/>
                            <div className="quanly-info">
                                <div className="quanly-name">{user.name}</div>
                                <div className="quanly-email">{user.email}</div>
                            </div>
                            <div className={`quanly-status ${user.status.toLowerCase() === 'online' ? 'quanly-verified' : 'quanly-unverified'}`}>
                                {user.status.toLowerCase() === 'online' ? '✓' : '✗'}
                            </div>
                        </div>
                    ))}
                </div>

                {selectedUser ? (
                    <div className="quanly-user-details" id="user-details">
                        {loading ? (
                            <div className="loading">Đang tải thông tin...</div>
                        ) : (
                            <>
                                <div className="quanly-header">
                                    <div className="quanly-name">{selectedUser.name}</div>
                                    <div className="quanly-email">{selectedUser.email}</div>
                                </div>
                                <div className="quanly-info">
                                    <p><strong>Chức vụ:</strong> {selectedUser.role}</p>
                                    <p><strong>Lần đăng nhập gần nhất:</strong> {selectedUser.lastLogin || 'Chưa có thông tin'}</p>
                                    <p>
                                        <strong>Trạng thái:</strong> {selectedUser.status}
                                        <button 
                                            onClick={() => handleStatusChange(
                                                selectedUser.id, 
                                                selectedUser.status.toLowerCase() === 'online' ? 'offline' : 'online'
                                            )}
                                            className="status-toggle-btn"
                                        >
                                            {selectedUser.status.toLowerCase() === 'online' ? 'Đặt Offline' : 'Đặt Online'}
                                        </button>
                                    </p>
                                    <p><strong>Ghi chú:</strong> {selectedUser.note || '(Trống)'}</p>
                                </div>
                                <div className="quanly-booking-history">
                                    <h3>Lịch sử đặt phòng</h3>
                                    {selectedUser.bookings && selectedUser.bookings.length > 0 ? (
                                        selectedUser.bookings.map((booking, index) => (
                                            <div className="quanly-booking-item" key={booking.id || index}>
                                                <img src={booking.image || 'https://picsum.photos/50/50?1'} alt="Room" />
                                                <div className="quanly-info">
                                                    <div className="quanly-room-id">{booking.roomId}</div>
                                                    <div className="quanly-description">{booking.description}</div>
                                                </div>
                                                <div className="quanly-time">{booking.time}</div>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Không có lịch sử đặt phòng</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="quanly-user-details">
                        <p>Vui lòng chọn một người dùng để xem chi tiết</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuanLy;