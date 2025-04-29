import React, { useState, useEffect } from 'react';
import './quanlyquyenhethong.css';
import Headermanager from '../../components/common/Headermanager';
import { FaUserAlt } from "react-icons/fa";
const QuanLyQuyenHeThong = () => {
    const [users, setUsers] = useState({
        student: [
            { id: 1, name: 'Sinh viên 1', email: 'sv1@gmail.com', role: 'student' },
            { id: 2, name: 'Sinh viên 2', email: 'sv2@gmail.com', role: 'student' }
        ],
        admin: [
            { id: 3, name: 'Quản lý 1', email: 'admin1@gmail.com', role: 'admin' }
        ],
        it: [
            { id: 4, name: 'IT 1', email: 'it1@gmail.com', role: 'it' }
        ],
        technician: [
            { id: 5, name: 'Kỹ thuật 1', email: 'kt1@gmail.com', role: 'technician' }
        ]
    });

    const [histories, setHistories] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [activeRoleTab, setActiveRoleTab] = useState('student');
    const [activeHistoryUser, setActiveHistoryUser] = useState(null);

    const loadUsers = (role, event) => {
        setActiveRoleTab(role);
    };

    const selectUser = (id, role, event) => {
        setSelectedUser(id);
        setSelectedRole(role);
    };

    const convertRole = (r) => {
        return r === 'student' ? 'Sinh viên' : 
               r === 'admin' ? 'Quản lý HT' : 
               r === 'it' ? 'Nhân viên IT' : 'Nhân viên KT';
    };

    const handleChangeRole = (role) => {
        setSelectedRole(role);
    };

    const confirmRoleChange = (userId) => {
        const newHistories = { ...histories };
        
        if (!newHistories[userId]) {
            newHistories[userId] = [];
        }
        
        newHistories[userId].push({
            title: convertRole(selectedRole),
            time: new Date().toLocaleString(),
            status: 'Thay đổi chức vụ',
            note: 'Cập nhật bởi Admin'
        });
        
        setHistories(newHistories);
        alert('Đã thay đổi chức vụ thành: ' + convertRole(selectedRole));
    };

    const selectHistoryUser = (id) => {
        setActiveHistoryUser(id);
    };

    // Flatten all users for the history panel
    const allUsers = [
        ...users.student, 
        ...users.admin, 
        ...users.it, 
        ...users.technician
    ];

    return (
        <div>
            <Headermanager />
            <div className="container">
                <div className="user-management">
                    <h2>Quản lý người dùng</h2>
                    <div className="role-buttons">
                        <button 
                            className={activeRoleTab === 'student' ? 'active' : ''} 
                            onClick={() => loadUsers('student')}
                        >
                            Sinh viên
                        </button>
                        <button 
                            className={activeRoleTab === 'admin' ? 'active' : ''} 
                            onClick={() => loadUsers('admin')}
                        >
                            Quản lý hệ thống
                        </button>
                        <button 
                            className={activeRoleTab === 'it' ? 'active' : ''} 
                            onClick={() => loadUsers('it')}
                        >
                            Nhân viên IT
                        </button>
                        <button 
                            className={activeRoleTab === 'technician' ? 'active' : ''} 
                            onClick={() => loadUsers('technician')}
                        >
                            Nhân viên kỹ thuật
                        </button>
                    </div>
                    <div className="user-list" id="user-list">
                        {users[activeRoleTab] && users[activeRoleTab].map((user) => (
                            <div 
                                key={user.id}
                                className={`user-item ${selectedUser === user.id ? 'active' : ''}`} 
                                id={`user-${user.id}`}
                                onClick={() => selectUser(user.id, user.role)}
                            >
                                <div className="left-info">
                                    <FaUserAlt />

                                    <div className="info">
                                        <div className="name">{user.name}</div>
                                        <div className="email">{user.email}</div>
                                        
                                        {selectedUser === user.id && (
                                            <div className="change-role">
                                                {['student', 'admin', 'it', 'technician'].map((r) => (
                                                    <button 
                                                        key={r}
                                                        className={selectedRole === r ? 'selected' : ''}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleChangeRole(r);
                                                        }}
                                                    >
                                                        {convertRole(r)}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {selectedUser === user.id && (
                                    <button 
                                        className="confirm-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            confirmRoleChange(user.id);
                                        }}
                                    >
                                        Thay đổi
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="history-section">
                    <h2>Lịch sử thay đổi</h2>
                    <div className="user-scroll" id="history-users">
                        {allUsers.map((user) => (
                            <div 
                                key={user.id}
                                className={`user-item ${activeHistoryUser === user.id ? 'active' : ''}`} 
                                id={`history-user-${user.id}`}
                                onClick={() => selectHistoryUser(user.id)}
                            >
                                <div className="left-info">
                                <FaUserAlt />
                                    <div className="info">
                                        <div className="name">{user.name}</div>
                                        <div className="email">{user.email}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="history-list" id="history-list">
                        {activeHistoryUser && histories[activeHistoryUser] ? (
                            histories[activeHistoryUser].map((history, index) => (
                                <div className="history-item" key={index}>
                                    <p className="title"><strong>Chức vụ:</strong> {history.title}</p>
                                    <p><strong>Thời gian:</strong> {history.time}</p>
                                    <p><strong>Trạng thái:</strong> {history.status}</p>
                                    <p><strong>Ghi chú:</strong> {history.note}</p>
                                </div>
                            ))
                        ) : (
                            <p>Chưa có lịch sử</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuanLyQuyenHeThong;