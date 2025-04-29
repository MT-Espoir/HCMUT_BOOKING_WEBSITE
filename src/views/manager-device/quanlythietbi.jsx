import React, { useState } from 'react';
import './quanlythietbi.css';
import Headermanager from '../../components/common/Headermanager';
import { FaUserAlt } from "react-icons/fa";
import roomMainImg from '../../assets/room-main.png';
import roomSide1Img from '../../assets/room-side1.jpg';
import roomSide2Img from '../../assets/room-side2.jpg';
import logoImg from '../../assets/logo.png';

const QuanLyThietBi = () => {
    const [expandedDetails, setExpandedDetails] = useState({});

    const toggleDetails = (detailsId) => {
        setExpandedDetails(prevState => ({
            ...prevState,
            [detailsId]: !prevState[detailsId]
        }));
    };

    const bookRepair = () => {
        alert('Chuyển đến giao diện đặt lịch sửa cho Phòng T1');
    };

    return (
        <div>
            <Headermanager />
            
            <div className="MD-container">
                <div className="MD-image-section">
                    <div className="MD-main-image">
                        <img src={roomMainImg} alt="Main room view" />
                    </div>
                    <div className="MD-sub-images">
                        <img src={roomSide1Img} alt="Room side view 1" />
                        <img src={roomSide2Img} alt="Room side view 2" />
                    </div>
                </div>
                
                <div className="MD-details-section">
                    <div className="MD-room-info">
                        <div>
                            <div className="MD-name">Phòng T1</div>
                            <div className="MD-type">
                                <div className="MD-dot"></div>
                                <div>Phòng hội thảo</div>
                            </div>
                        </div>
                        <button className="MD-repair-btn" onClick={bookRepair}>Đặt lịch sửa</button>
                    </div>
                    
                    <div className="MD-equipment-list">
                        {/* Thiết bị 1 */}
                        <div className="MD-equipment-item" onClick={() => toggleDetails('details1')}>
                            <img src={logoImg} alt="Device" />
                            <div className="MD-name">Máy chiếu</div>
                            <div className="MD-status MD-broken">Hỏng</div>
                            <div className="MD-expand-icon">{expandedDetails['details1'] ? '⬆️' : '⬇️'}</div>
                        </div>
                        <div 
                            id="details1" 
                            className="MD-equipment-details"
                            style={{ display: expandedDetails['details1'] ? 'block' : 'none' }}
                        >
                            <p><strong>Mã thiết bị:</strong> MC001</p>
                            <p><strong>Nhãn hiệu:</strong> Sony</p>
                            <p><strong>Tình trạng:</strong> Bóng đèn hỏng</p>
                            <p><strong>Báo cáo cuối:</strong> 27/04/2025 bởi Giảng viên A</p>
                        </div>
                        
                        {/* Thiết bị 2 */}
                        <div className="MD-equipment-item" onClick={() => toggleDetails('details2')}>
                            <img src={logoImg} alt="Device" />
                            <div className="MD-name">Máy lạnh</div>
                            <div className="MD-status MD-normal">Bình thường</div>
                            <div className="MD-expand-icon">{expandedDetails['details2'] ? '⬆️' : '⬇️'}</div>
                        </div>
                        <div 
                            id="details2" 
                            className="MD-equipment-details"
                            style={{ display: expandedDetails['details2'] ? 'block' : 'none' }}
                        >
                            <p><strong>Mã thiết bị:</strong> ML001</p>
                            <p><strong>Nhãn hiệu:</strong> Panasonic</p>
                            <p><strong>Tình trạng:</strong> Hoạt động tốt</p>
                            <p><strong>Báo cáo cuối:</strong> 20/04/2025 bởi Nhân viên kỹ thuật B</p>
                        </div>
                        
                        {/* Thiết bị 3 */}
                        <div className="MD-equipment-item" onClick={() => toggleDetails('details3')}>
                            <img src={logoImg} alt="Device" />
                            <div className="MD-name">Hệ thống âm thanh</div>
                            <div className="MD-status MD-normal">Bình thường</div>
                            <div className="MD-expand-icon">{expandedDetails['details3'] ? '⬆️' : '⬇️'}</div>
                        </div>
                        <div 
                            id="details3" 
                            className="MD-equipment-details"
                            style={{ display: expandedDetails['details3'] ? 'block' : 'none' }}
                        >
                            <p><strong>Mã thiết bị:</strong> AT001</p>
                            <p><strong>Nhãn hiệu:</strong> JBL</p>
                            <p><strong>Tình trạng:</strong> Hoạt động tốt</p>
                            <p><strong>Báo cáo cuối:</strong> 15/04/2025 bởi Sinh viên C</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuanLyThietBi;