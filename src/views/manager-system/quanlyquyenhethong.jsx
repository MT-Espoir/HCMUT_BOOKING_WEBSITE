import React, { useState, useEffect } from 'react';
import './quanlyquyenhethong.css';
import Headermanager from '../../components/common/Headermanager';
import { FaUserAlt } from "react-icons/fa";
import { getUsersAndTheirActiveStatus, updateUserRole, getUserRoleHistory } from '../../services/api';

const QuanLyQuyenHeThong = () => {
    const [usersByRole, setUsersByRole] = useState({
        student: [],
        admin: [],
        it: [],
        technician: []
    });
    const [loading, setLoading] = useState(true);
    const [roleHistoryLoading, setRoleHistoryLoading] = useState(false);
    const [error, setError] = useState(null);
    const [histories, setHistories] = useState({});
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedRole, setSelectedRole] = useState('');
    const [activeRoleTab, setActiveRoleTab] = useState('student');
    const [activeHistoryUser, setActiveHistoryUser] = useState(null);

    // Fetch users from API and organize them by role
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await getUsersAndTheirActiveStatus();
                
                // Group users by their roles
                const users = response.data || [];
                const grouped = {
                    student: users.filter(user => user.role === 'student'),
                    admin: users.filter(user => user.role === 'admin'),
                    it: users.filter(user => user.role === 'it'),
                    technician: users.filter(user => user.role === 'technician')
                };
                
                setUsersByRole(grouped);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching users:', error);
                setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const loadUsers = (role, event) => {
        setActiveRoleTab(role);
    };

    const selectUser = (user, role, event) => {
        setSelectedUser(user);
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

    const confirmRoleChange = async (userId) => {
        if (!selectedRole || selectedRole === selectedUser.role) {
            alert('Vui lòng chọn một vai trò khác với vai trò hiện tại');
            return;
        }
        
        try {
            const response = await updateUserRole(userId, selectedRole);
            
            // Update the local state to reflect the change
            const updatedUsersByRole = { ...usersByRole };
            
            // Remove user from current role array
            updatedUsersByRole[selectedUser.role] = updatedUsersByRole[selectedUser.role].filter(
                u => u.id !== userId
            );
            
            // Update user's role and add to new role array
            const updatedUser = { ...selectedUser, role: selectedRole };
            updatedUsersByRole[selectedRole] = [...updatedUsersByRole[selectedRole], updatedUser];
            
            setUsersByRole(updatedUsersByRole);
            
            // Reset selected user
            setSelectedUser(null);
            
            // Fetch updated role history for this user
            await fetchRoleHistory(userId);
            
            alert('Đã thay đổi chức vụ thành: ' + convertRole(selectedRole));
        } catch (error) {
            console.error(`Error updating role for user ${userId}:`, error);
            alert('Không thể cập nhật chức vụ người dùng. Vui lòng thử lại sau.');
        }
    };

    const fetchRoleHistory = async (userId) => {
        try {
            setRoleHistoryLoading(true);
            const historyResponse = await getUserRoleHistory(userId);
            
            // Update histories state
            setHistories(prevHistories => ({
                ...prevHistories,
                [userId]: historyResponse.data || []
            }));
            
            setRoleHistoryLoading(false);
        } catch (error) {
            console.error(`Error fetching role history for user ${userId}:`, error);
            setRoleHistoryLoading(false);
        }
    };

    const selectHistoryUser = async (user) => {
        setActiveHistoryUser(user.id);
        
        // Only fetch history if we don't already have it
        if (!histories[user.id]) {
            await fetchRoleHistory(user.id);
        }
    };

    // Flatten all users for the history panel
    const allUsers = [
        ...usersByRole.student, 
        ...usersByRole.admin, 
        ...usersByRole.it, 
        ...usersByRole.technician
    ];

    if (loading && allUsers.length === 0) {
        return (
            <div>
                <Headermanager />
                <div className="container">
                    <div className="loading">Đang tải dữ liệu...</div>
                </div>
            </div>
        );
    }

    if (error && allUsers.length === 0) {
        return (
            <div>
                <Headermanager />
                <div className="container">
                    <div className="error">{error}</div>
                    <button onClick={() => window.location.reload()}>Thử lại</button>
                </div>
            </div>
        );
    }

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
                        {usersByRole[activeRoleTab].length > 0 ? (
                            usersByRole[activeRoleTab].map((user) => (
                                <div 
                                    key={user.id}
                                    className={`user-item ${selectedUser && selectedUser.id === user.id ? 'active' : ''}`} 
                                    id={`user-${user.id}`}
                                    onClick={() => selectUser(user, user.role)}
                                >
                                    <div className="left-info">
                                        <FaUserAlt />

                                        <div className="info">
                                            <div className="name">{user.name}</div>
                                            <div className="email">{user.email}</div>
                                            
                                            {selectedUser && selectedUser.id === user.id && (
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
                                    
                                    {selectedUser && selectedUser.id === user.id && (
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
                            ))
                        ) : (
                            <p>Không có người dùng nào trong nhóm này</p>
                        )}
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
                                onClick={() => selectHistoryUser(user)}
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
                        {roleHistoryLoading ? (
                            <div className="loading">Đang tải lịch sử...</div>
                        ) : activeHistoryUser && histories[activeHistoryUser] ? (
                            histories[activeHistoryUser].length > 0 ? (
                                histories[activeHistoryUser].map((history, index) => (
                                    <div className="history-item" key={index}>
                                        <p className="title"><strong>Chức vụ:</strong> {convertRole(history.role)}</p>
                                        <p><strong>Thời gian:</strong> {new Date(history.timestamp).toLocaleString()}</p>
                                        <p><strong>Trạng thái:</strong> {history.status || 'Thay đổi chức vụ'}</p>
                                        <p><strong>Ghi chú:</strong> {history.note || 'Cập nhật bởi Admin'}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Chưa có lịch sử thay đổi</p>
                            )
                        ) : (
                            <p>Chọn một người dùng để xem lịch sử</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuanLyQuyenHeThong;