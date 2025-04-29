import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './quanly.css';
import Headermanager from '../../components/common/Headermanager';
import { FaUserAlt } from "react-icons/fa";

const QuanLy = () => {
    const navigate = useNavigate();
    
    const [users] = useState([
        {
            name: "Nguyễn Văn A",
            email: "nva@example.com",
            role: "Sinh viên - 2012345",
            lastLogin: "10:30 27/04/2025",
            status: "Online",
            note: "(Trống)",
            bookings: [
                { roomId: "P101", description: "Phòng họp lớn", time: "15:00-17:00", image: "https://picsum.photos/50/50?1" },
                { roomId: "P102", description: "Phòng học nhóm", time: "12:00-18:00", image: "https://picsum.photos/50/50?2" }
            ]
        },
        {
            name: "Trần Thị B",
            email: "ttb@example.com",
            role: "Sinh viên - 2015678",
            lastLogin: "09:00 26/04/2025",
            status: "Offline",
            note: "(Trống)",
            bookings: []
        },
        {
            name: "Ngô Thị C",
            email: "ntc@example.com",
            role: "Sinh viên - 2019876",
            lastLogin: "11:00 25/04/2025",
            status: "Online",
            note: "(Trống)",
            bookings: []
        },
        {
            name: "Hồ Hoàng D",
            email: "hhd@example.com",
            role: "Sinh viên - 2016543",
            lastLogin: "16:00 24/04/2025",
            status: "Offline",
            note: "(Trống)",
            bookings: []
        },
        {
            name: "Phạm Thế E",
            email: "pte@example.com",
            role: "Sinh viên - 2014321",
            lastLogin: "17:00 23/04/2025",
            status: "Online",
            note: "(Trống)",
            bookings: []
        },
    ]);

    const [selectedUserIndex, setSelectedUserIndex] = useState(0);

    const showUserDetails = (index) => {
        setSelectedUserIndex(index);
    };
    
    useEffect(() => {
        // Khởi tạo hiển thị người dùng đầu tiên
        showUserDetails(0);
    }, []);

    const selectedUser = users[selectedUserIndex];

    return (
        <div>
            <Headermanager />
            
            <div className="quanly-container">
                <div className="quanly-user-list">
                    <h2>Danh sách người dùng</h2>
                    {users.map((user, index) => (
                        <div 
                            key={index} 
                            className={`quanly-user-item ${selectedUserIndex === index ? 'selected' : ''}`}
                            onClick={() => showUserDetails(index)}
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

                <div className="quanly-user-details" id="user-details">
                    <div className="quanly-header">
                        <div className="quanly-name">{selectedUser.name}</div>
                        <div className="quanly-email">{selectedUser.email}</div>
                    </div>
                    <div className="quanly-info">
                        <p><strong>Chức vụ:</strong> {selectedUser.role}</p>
                        <p><strong>Lần đăng nhập gần nhất:</strong> {selectedUser.lastLogin}</p>
                        <p><strong>Trạng thái:</strong> {selectedUser.status}</p>
                        <p><strong>Ghi chú:</strong> {selectedUser.note}</p>
                    </div>
                    <div className="quanly-booking-history">
                        <h3>Lịch sử đặt phòng</h3>
                        {selectedUser.bookings.length > 0 ? (
                            selectedUser.bookings.map((booking, index) => (
                                <div className="quanly-booking-item" key={index}>
                                    <img src={booking.image} alt="Room" />
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
                </div>
            </div>
        </div>
    );
};

export default QuanLy;