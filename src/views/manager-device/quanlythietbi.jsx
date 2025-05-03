import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Headermanager from '../../components/common/Headermanager';
import roomMainImg from '../../assets/room-main.png';
import roomSide1Img from '../../assets/room-side1.jpg';
import roomSide2Img from '../../assets/room-side2.jpg';
import logoImg from '../../assets/logo.png';
import { FaArrowLeft } from 'react-icons/fa';
import './quanlythietbi.css';

// Dữ liệu mẫu cho các phòng
const MOCK_ROOM_DATA = {
    'T1': {
        name: 'Phòng T1-101',
        type: 'Phòng học',
        equipment: [
            { id: 'DH001', name: 'Máy lạnh', status: 'normal', brand: 'Panasonic', condition: 'Mới 90%', lastReport: '20/04/2025' },
            { id: 'DH002', name: 'Máy chiếu', status: 'broken', brand: 'Sony', condition: 'Hỏng phần kết nối HDMI', lastReport: '18/04/2025' },
            { id: 'DH003', name: 'Đèn LED', status: 'normal', brand: 'Philips', condition: 'Mới thay tháng trước', lastReport: '01/04/2025' },
            { id: 'DH004', name: 'Bàn ghế', status: 'normal', brand: 'Hòa Phát', condition: 'Sử dụng tốt', lastReport: '15/03/2025' }
        ]
    },
    'B1': {
        name: 'Phòng B1-202',
        type: 'Phòng Lab',
        equipment: [
            { id: 'BL001', name: 'Máy tính', status: 'normal', brand: 'Dell', condition: 'Mới nâng cấp RAM', lastReport: '25/04/2025' },
            { id: 'BL002', name: 'Màn hình', status: 'normal', brand: 'LG', condition: 'Sử dụng tốt', lastReport: '25/04/2025' },
            { id: 'BL003', name: 'Máy lạnh', status: 'broken', brand: 'Daikin', condition: 'Yếu, không đủ lạnh', lastReport: '22/04/2025' }
        ]
    },
    'H6': {
        name: 'Phòng H6-303',
        type: 'Phòng hội thảo',
        equipment: [
            { id: 'HT001', name: 'Hệ thống âm thanh', status: 'normal', brand: 'JBL', condition: 'Hoạt động tốt', lastReport: '28/04/2025' },
            { id: 'HT002', name: 'Micro không dây', status: 'broken', brand: 'Shure', condition: 'Hỏng pin', lastReport: '27/04/2025' },
            { id: 'HT003', name: 'Máy chiếu', status: 'normal', brand: 'Epson', condition: 'Mới 95%', lastReport: '26/04/2025' }
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