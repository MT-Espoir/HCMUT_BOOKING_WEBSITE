import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Headermanager from '../../components/common/Headermanager';
import roomMainImg from '../../assets/room-main.png';
import roomSide1Img from '../../assets/room-side1.jpg';
import roomSide2Img from '../../assets/room-side2.jpg';
import logoImg from '../../assets/logo.png';
import { FaArrowLeft } from 'react-icons/fa';
import './quanlythietbi.css';
import { getDevicesByRoom, getRoomDetails } from '../../services/api';

const QuanLyThietBi = () => {
    const [expandedDetails, setExpandedDetails] = useState({});
    const [roomId, setRoomId] = useState(null);
    const [roomData, setRoomData] = useState(null);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy tham số phòng từ URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const roomIdParam = searchParams.get('room');
        if (roomIdParam) {
            setRoomId(roomIdParam);
        }
    }, [location]);

    // Lấy thông tin phòng và thiết bị khi roomId thay đổi
    useEffect(() => {
        const fetchRoomAndDevices = async () => {
            if (!roomId) return;
            
            setLoading(true);
            try {
                // Lấy thông tin phòng
                const roomResponse = await getRoomDetails(roomId);
                console.log("Room details response:", roomResponse);
                
                // Đảm bảo chúng ta có dữ liệu phòng
                if (roomResponse && roomResponse.data) {
                    setRoomData(roomResponse.data);
                } else if (roomResponse && roomResponse.room) {
                    setRoomData(roomResponse.room);
                } else if (roomResponse) {
                    // Trường hợp API trả về dữ liệu trực tiếp
                    setRoomData(roomResponse);
                }
                
                // Lấy danh sách thiết bị của phòng
                const devicesResponse = await getDevicesByRoom(roomId);
                console.log("Devices by room response:", devicesResponse);
                
                // Xử lý nhiều định dạng response có thể có
                let devicesList = [];
                if (devicesResponse && devicesResponse.devices) {
                    devicesList = devicesResponse.devices;
                } else if (devicesResponse && Array.isArray(devicesResponse)) {
                    devicesList = devicesResponse;
                }
                
                setDevices(devicesList);
                setError(null);
            } catch (err) {
                console.error("Error fetching room data:", err);
                setError("Không thể tải dữ liệu phòng và thiết bị. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchRoomAndDevices();
    }, [roomId]);

    const toggleDetails = (detailsId) => {
        setExpandedDetails(prevState => ({
            ...prevState,
            [detailsId]: !prevState[detailsId]
        }));
    };

    const bookRepair = () => {
        alert(`Chuyển đến giao diện đặt lịch sửa cho Phòng ${roomId}`);
    };
    
    const goBackToRoomList = () => {
        navigate('/manager-device/quanlythietbipage');
    };

    // Map trạng thái thiết bị từ API sang hiển thị UI
    const mapDeviceStatus = (status) => {
        switch (status) {
            case 'OK':
                return { status: 'normal', display: 'Bình thường' };
            case 'WARNING':
                return { status: 'warning', display: 'Cảnh báo' };
            case 'ERROR':
                return { status: 'broken', display: 'Hỏng' };
            case 'OFFLINE':
                return { status: 'offline', display: 'Ngoại tuyến' };
            case 'MAINTENANCE':
                return { status: 'maintenance', display: 'Bảo trì' };
            default:
                return { status: 'unknown', display: 'Không xác định' };
        }
    };

    // Hiển thị loading state
    if (loading) {
        return (
            <div>
                <Headermanager />
                <div className="MD-container">
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <p>Đang tải dữ liệu phòng và thiết bị...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị error state
    if (error) {
        return (
            <div>
                <Headermanager />
                <div className="MD-container">
                    <div style={{ textAlign: 'center', padding: '50px 0', color: 'red' }}>
                        <p>{error}</p>
                        <button 
                            onClick={goBackToRoomList}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#1976D2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '20px'
                            }}
                        >
                            Quay lại danh sách phòng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị khi không có dữ liệu phòng
    if (!roomData) {
        return (
            <div>
                <Headermanager />
                <div className="MD-container">
                    <div style={{ textAlign: 'center', padding: '50px 0' }}>
                        <p>Không tìm thấy thông tin phòng.</p>
                        <button 
                            onClick={goBackToRoomList}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: '#1976D2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '20px'
                            }}
                        >
                            Quay lại danh sách phòng
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Headermanager />
            
            <div className="MD-container">
                <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                    <button 
                        onClick={goBackToRoomList} 
                        style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            background: 'none', 
                            border: 'none', 
                            cursor: 'pointer',
                            color: '#1976D2',
                            fontSize: '16px'
                        }}
                    >
                        <FaArrowLeft style={{ marginRight: '8px' }} />
                        Quay lại danh sách phòng
                    </button>
                </div>
                
                <div className="MD-image-section">
                    <div className="MD-main-image">
                        <img src={roomData.room_image ? roomData.room_image : roomMainImg} alt="Main view of room" />
                    </div>
                    <div className="MD-sub-images">
                        <img src={roomSide1Img} alt="Side view 1 of room" />
                        <img src={roomSide2Img} alt="Side view 2 of room" />
                    </div>
                </div>
                
                <div className="MD-details-section">
                    <div className="MD-room-info">
                        <div>
                            <div className="MD-name">{roomData.name}</div>
                            <div className="MD-type">
                                <div className="MD-dot"></div>
                                <div>{roomData.room_type === 'STUDY' ? 'Phòng học' : 
                                      roomData.room_type === 'MEETING' ? 'Phòng họp' : 
                                      roomData.room_type === 'LAB' ? 'Phòng thực hành' : 
                                      roomData.room_type === 'LECTURE' ? 'Phòng thuyết trình' : 'Khác'}</div>
                            </div>
                        </div>
                        <button className="MD-repair-btn" onClick={bookRepair}>Đặt lịch sửa</button>
                    </div>
                    
                    <div className="MD-equipment-list">
                        {devices.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                                <p>Không có thiết bị nào trong phòng này.</p>
                            </div>
                        ) : (
                            devices.map((device, index) => {
                                const deviceStatus = mapDeviceStatus(device.status);
                                return (
                                    <React.Fragment key={device.device_id}>
                                        <div className="MD-equipment-item" onClick={() => toggleDetails(`details${index}`)}>
                                            <img src={logoImg} alt={device.name} />
                                            <div className="MD-name">{device.name}</div>
                                            <div className={`MD-status MD-${deviceStatus.status}`}>
                                                {deviceStatus.display}
                                            </div>
                                            <div className="MD-expand-icon">{expandedDetails[`details${index}`] ? '⬆️' : '⬇️'}</div>
                                        </div>
                                        <div 
                                            id={`details${index}`} 
                                            className="MD-equipment-details"
                                            style={{ display: expandedDetails[`details${index}`] ? 'block' : 'none' }}
                                        >
                                            <p><strong>Mã thiết bị:</strong> {device.device_id}</p>
                                            <p><strong>Loại thiết bị:</strong> {device.device_type}</p>
                                            <p><strong>Model:</strong> {device.model || 'Không có thông tin'}</p>
                                            <p><strong>Số sê-ri:</strong> {device.serial_number || 'Không có thông tin'}</p>
                                            <p><strong>Địa chỉ MAC:</strong> {device.mac_address || 'Không có thông tin'}</p>
                                            <p><strong>Ghi chú:</strong> {device.notes || 'Không có ghi chú'}</p>
                                            <p><strong>Bảo trì cuối:</strong> {device.last_maintained ? new Date(device.last_maintained).toLocaleDateString('vi-VN') : 'Chưa có thông tin'}</p>
                                        </div>
                                    </React.Fragment>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuanLyThietBi;