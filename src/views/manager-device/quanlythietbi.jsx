import React, { useState, useEffect } from 'react';
import './quanlythietbi.css';
import Headermanager from '../../components/common/Headermanager';
import { FaArrowLeft, FaUserAlt } from "react-icons/fa";
import roomMainImg from '../../assets/room-main.png';
import roomSide1Img from '../../assets/room-side1.jpg';
import roomSide2Img from '../../assets/room-side2.jpg';
import logoImg from '../../assets/logo.png';
import { useLocation, useNavigate } from 'react-router-dom';

// Dữ liệu mẫu cho các phòng
const MOCK_ROOM_DATA = {
    'A101': {
        id: 'A101',
        name: 'Phòng A101',
        type: 'Phòng học',
        building: 'A',
        floor: '1',
        equipment: [
            {
                id: 'MC001',
                name: 'Máy chiếu',
                brand: 'Sony',
                status: 'normal',
                condition: 'Hoạt động tốt',
                lastReport: '15/04/2025 bởi Giảng viên B'
            },
            {
                id: 'ML001',
                name: 'Máy lạnh',
                brand: 'Panasonic',
                status: 'normal',
                condition: 'Hoạt động tốt',
                lastReport: '20/04/2025 bởi Nhân viên kỹ thuật C'
            },
            {
                id: 'AT001',
                name: 'Hệ thống âm thanh',
                brand: 'JBL',
                status: 'normal',
                condition: 'Hoạt động tốt',
                lastReport: '10/04/2025 bởi Nhân viên kỹ thuật D'
            }
        ]
    },
    'A102': {
        id: 'A102',
        name: 'Phòng A102',
        type: 'Phòng học',
        building: 'A',
        floor: '1',
        equipment: [
            {
                id: 'MC002',
                name: 'Máy chiếu',
                brand: 'Epson',
                status: 'broken',
                condition: 'Hình ảnh không rõ nét',
                lastReport: '25/04/2025 bởi Giảng viên E'
            },
            {
                id: 'ML002',
                name: 'Máy lạnh',
                brand: 'Daikin',
                status: 'normal',
                condition: 'Hoạt động tốt',
                lastReport: '18/04/2025 bởi Nhân viên kỹ thuật F'
            }
        ]
    },
    'B201': {
        id: 'B201',
        name: 'Phòng B201',
        type: 'Phòng thí nghiệm',
        building: 'B',
        floor: '2',
        equipment: [
            {
                id: 'MC003',
                name: 'Máy chiếu',
                brand: 'BenQ',
                status: 'broken',
                condition: 'Không bật được',
                lastReport: '27/04/2025 bởi Giảng viên G'
            },
            {
                id: 'ML003',
                name: 'Máy lạnh',
                brand: 'LG',
                status: 'broken',
                condition: 'Kêu to, không mát',
                lastReport: '26/04/2025 bởi Sinh viên H'
            }
        ]
    },
    'T1': {
        id: 'T1',
        name: 'Phòng T1',
        type: 'Phòng hội thảo',
        building: 'T',
        floor: '1',
        equipment: [
            {
                id: 'MC001',
                name: 'Máy chiếu',
                brand: 'Sony',
                status: 'broken',
                condition: 'Bóng đèn hỏng',
                lastReport: '27/04/2025 bởi Giảng viên A'
            },
            {
                id: 'ML001',
                name: 'Máy lạnh',
                brand: 'Panasonic',
                status: 'normal',
                condition: 'Hoạt động tốt',
                lastReport: '20/04/2025 bởi Nhân viên kỹ thuật B'
            },
            {
                id: 'AT001',
                name: 'Hệ thống âm thanh',
                brand: 'JBL',
                status: 'normal',
                condition: 'Hoạt động tốt',
                lastReport: '15/04/2025 bởi Sinh viên C'
            }
        ]
    }
};

const QuanLyThietBi = () => {
    const [expandedDetails, setExpandedDetails] = useState({});
    const [selectedRoom, setSelectedRoom] = useState('T1'); // Mặc định là phòng T1
    
    const navigate = useNavigate();
    const location = useLocation();
    
    // Lấy tham số phòng từ URL
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const roomParam = searchParams.get('room');
        if (roomParam && MOCK_ROOM_DATA[roomParam]) {
            setSelectedRoom(roomParam);
        }
    }, [location]);

    const toggleDetails = (detailsId) => {
        setExpandedDetails(prevState => ({
            ...prevState,
            [detailsId]: !prevState[detailsId]
        }));
    };

    const bookRepair = () => {
        alert(`Chuyển đến giao diện đặt lịch sửa cho Phòng ${selectedRoom}`);
    };
    
    const goBackToRoomList = () => {
        navigate('/manager-device/quanlythietbipage');
    };

    // Lấy dữ liệu của phòng đang được chọn
    const roomData = MOCK_ROOM_DATA[selectedRoom] || MOCK_ROOM_DATA['T1'];

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
                        <img src={roomMainImg} alt="Main view of room" />
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
                                <div>{roomData.type}</div>
                            </div>
                        </div>
                        <button className="MD-repair-btn" onClick={bookRepair}>Đặt lịch sửa</button>
                    </div>
                    
                    <div className="MD-equipment-list">
                        {roomData.equipment.map((equipment, index) => (
                            <React.Fragment key={equipment.id}>
                                <div className="MD-equipment-item" onClick={() => toggleDetails(`details${index}`)}>
                                    <img src={logoImg} alt={equipment.name} />
                                    <div className="MD-name">{equipment.name}</div>
                                    <div className={`MD-status ${equipment.status === 'normal' ? 'MD-normal' : 'MD-broken'}`}>
                                        {equipment.status === 'normal' ? 'Bình thường' : 'Hỏng'}
                                    </div>
                                    <div className="MD-expand-icon">{expandedDetails[`details${index}`] ? '⬆️' : '⬇️'}</div>
                                </div>
                                <div 
                                    id={`details${index}`} 
                                    className="MD-equipment-details"
                                    style={{ display: expandedDetails[`details${index}`] ? 'block' : 'none' }}
                                >
                                    <p><strong>Mã thiết bị:</strong> {equipment.id}</p>
                                    <p><strong>Nhãn hiệu:</strong> {equipment.brand}</p>
                                    <p><strong>Tình trạng:</strong> {equipment.condition}</p>
                                    <p><strong>Báo cáo cuối:</strong> {equipment.lastReport}</p>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuanLyThietBi;