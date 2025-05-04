import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './quanly.css';
import Headermanager from '../../components/common/Headermanager';
import { FaUserAlt, FaCalendar, FaClock } from "react-icons/fa";
import { getUsersAndTheirActiveStatus, getUserProfile, updateUserStatus } from '../../services/api';

const QuanLy = () => {
    const navigate = useNavigate();
    
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedUserIndex, setSelectedUserIndex] = useState(0);
    const [selectedUser, setSelectedUser] = useState(null);

    // Hàm chuẩn hóa dữ liệu booking để đảm bảo tính nhất quán 
    const standardizeBookingData = (booking) => {
        console.log('Original booking before standardization:', booking);
        
        // Dựa theo cách xử lý của Myroom.jsx
        const standardizedBooking = {
            ...booking,
            id: booking.id || booking.booking_id, // Đảm bảo id luôn có
            roomId: booking.roomId || booking.room_id || "Không xác định", // Đảm bảo roomId luôn có
            title: booking.title || booking.description || "Đặt phòng học",
            // Đảm bảo startTime và endTime được định dạng thống nhất
            startTime: booking.startTime || booking.start_time || booking.checkIn,
            endTime: booking.endTime || booking.end_time || booking.checkOut,
            roomName: booking.roomName || booking.room_name || `Phòng ${booking.roomId || booking.room_id || "không xác định"}`,
            duration: booking.duration,
            // Thêm các trạng thái theo myroom
            status: booking.status || booking.booking_status || 'pending',
        };

        // Debug log trong môi trường development
        console.log('Standardized booking:', standardizedBooking);

        return standardizedBooking;
    };

    // Format thời gian theo định dạng ngày/tháng/năm và giờ:phút
    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'Chưa đặt phòng';
        
        try {
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return 'Ngày không hợp lệ';
            
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (err) {
            console.error('Error formatting date:', err);
            return 'Ngày không hợp lệ';
        }
    };
    
    // Format khoảng thời gian (chỉ giờ phút)
    const formatTimeRange = (startTimeStr, endTimeStr) => {
        if (!startTimeStr || !endTimeStr) return 'Không có thông tin';
        
        try {
            const startTime = new Date(startTimeStr);
            const endTime = new Date(endTimeStr);
            
            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                return 'Thời gian không hợp lệ';
            }
            
            const startHours = startTime.getHours().toString().padStart(2, '0');
            const startMinutes = startTime.getMinutes().toString().padStart(2, '0');
            const endHours = endTime.getHours().toString().padStart(2, '0');
            const endMinutes = endTime.getMinutes().toString().padStart(2, '0');
            
            return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
        } catch (err) {
            console.error('Error formatting time range:', err);
            return 'Thời gian không hợp lệ';
        }
    };

    const formatBookingTime = (isoStartTime, isoEndTime) => {
        if (!isoStartTime || !isoEndTime) {
            return 'Không có thông tin thời gian';
        }
        
        try {
            if (isoStartTime.includes('-') && !isoStartTime.includes('T') && !isoStartTime.includes(' ')) {
                return isoStartTime;
            }
            
            const startDate = new Date(isoStartTime);
            const endDate = new Date(isoEndTime);
            
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                console.log('Debug invalid dates:', {isoStartTime, isoEndTime});
                
                if (typeof isoStartTime === 'string' && isoStartTime.includes(' ')) {
                    const [datePart, timePart] = isoStartTime.split(' ');
                    if (datePart && timePart) {
                        return `${datePart.split('-').reverse().join('/')} ${timePart.substring(0, 5)}`;
                    }
                }
                
                return isoStartTime && isoEndTime 
                    ? `${isoStartTime} - ${isoEndTime}` 
                    : 'Không có thông tin thời gian';
            }
            
            const day = startDate.getDate().toString().padStart(2, '0');
            const month = (startDate.getMonth() + 1).toString().padStart(2, '0');
            const year = startDate.getFullYear();
            
            const startHours = startDate.getHours().toString().padStart(2, '0');
            const startMinutes = startDate.getMinutes().toString().padStart(2, '0');
            const endHours = endDate.getHours().toString().padStart(2, '0');
            const endMinutes = endDate.getMinutes().toString().padStart(2, '0');
            
            return `${day}/${month}/${year} ${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
        } catch (err) {
            console.error('Error formatting booking time:', err, {isoStartTime, isoEndTime});
            
            return 'Không có thông tin thời gian';
        }
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await getUsersAndTheirActiveStatus();
                setUsers(response.data || []);
                setLoading(false);
                
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
            const response = await updateUserStatus(userId, newStatus);

            if (response.success) {
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
            } else {
                alert('Không thể cập nhật trạng thái người dùng. Vui lòng thử lại sau.');
            }
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
                                    </p>
                                    <p><strong>Ghi chú:</strong> {selectedUser.note || '(Trống)'}</p>
                                </div>
                                <div className="quanly-booking-history">
                                    <h3>Lịch sử đặt phòng</h3>
                                    {selectedUser.bookings && selectedUser.bookings.length > 0 ? (
                                        selectedUser.bookings.map((booking, index) => {
                                            const standardizedBooking = standardizeBookingData(booking);
                                            return (
                                                <div className="quanly-booking-item" key={standardizedBooking.id || index}>
                                                    <img src={standardizedBooking.image || standardizedBooking.roomImage || 'https://picsum.photos/50/50?1'} alt="Room" />
                                                    <div className="quanly-info">
                                                        <div className="quanly-room-id">Phòng {standardizedBooking.roomId || standardizedBooking.roomName || "Không xác định"}</div>
                                                        <div className="quanly-description">{standardizedBooking.title}</div>
                                                    </div>
                                                    <div className="quanly-booking-time">
                                                        <div className="quanly-date">
                                                            <FaCalendar className="quanly-icon" />
                                                            {standardizedBooking.startTime ? formatDateTime(standardizedBooking.startTime) : standardizedBooking.date || 'Không có thông tin'}
                                                        </div>
                                                        <div className="quanly-time">
                                                            <FaClock className="quanly-icon" />
                                                            {standardizedBooking.startTime && standardizedBooking.endTime ? 
                                                                formatTimeRange(standardizedBooking.startTime, standardizedBooking.endTime) : 
                                                                standardizedBooking.time || 'Không có thông tin'}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
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