import React, { useState, useEffect } from 'react';
import './App.css';
import BookingPage from './components/views/Confirmbookingpage/confirmbooking';
import CheckingPage from './components/views/Checkingpage/checkingpage';
import ChangeRoomPage from './components/views/Changeroompage/changeroom';
import MyRoomPage from './components/views/myroom/myroom';
import RoomSelectionPage from './components/views/RoomSelectionPage/roomselection';
// Import API service
import apiService, { initializeMockData } from './services/api';

// Import hình ảnh mẫu
import roomMainImg from './components/assests/room-main.png';
import roomSide1Img from './components/assests/room-side1.jpg';
import roomSide2Img from './components/assests/room-side2.jpg';

function App() {
  // Dữ liệu mẫu cho các phòng
  const roomsData = [
    {
      id: 'B1',
      name: 'Phòng B1',
      description: 'Phòng học cỡ nhỏ phù hợp cho các buổi thảo luận nhóm hoặc học tập cá nhân.',
      overview: 'Phòng B1 là phòng học cỡ nhỏ tọa lạc tầng 1 khu B, phù hợp cho các buổi thảo luận nhóm hoặc học tập cá nhân. Phòng được trang bị đầy đủ tiện nghi cơ bản, ánh sáng tự nhiên và view nhìn ra khu vực cây xanh.',
      location: 'Tầng 1 khu B',
      size: 2,
      capacity: 50,
      area: '25 m²',
      amenities: ['Bàn học tiêu chuẩn', '2 ghế ngồi thoải mái', 'Điều hòa nhiệt độ', 'Wifi tốc độ cao', 'Bảng trắng và bút viết', 'Ổ cắm điện đầy đủ'],
      features: ['Khu vực yên tĩnh', 'Đầy đủ ánh sáng', 'Wifi tốc độ cao'],
      images: {
        main: roomMainImg,
        side1: roomSide1Img,
        side2: roomSide2Img
      }
    },
    {
      id: 'B2',
      name: 'Phòng B2',
      description: 'Phòng học lớn dành cho các lớp học hoặc hội thảo nhỏ.',
      overview: 'Phòng B2 là phòng học lớn tọa lạc tầng 1 khu B, thích hợp cho các lớp học hoặc hội thảo nhỏ. Phòng được thiết kế với không gian mở, ánh sáng tự nhiên và hệ thống âm thanh hiện đại.',
      location: 'Tầng 1 khu B',
      size: 4,
      capacity: 100,
      area: '50 m²',
      amenities: ['Bàn học dài', '4 ghế ngồi thoải mái', 'Điều hòa nhiệt độ', 'Wifi tốc độ cao', 'Máy chiếu', 'Hệ thống âm thanh', 'Ổ cắm điện đầy đủ'],
      features: ['Không gian mở', 'Âm thanh tốt', 'Máy chiếu hiện đại'],
      images: {
        main: roomMainImg,
        side1: roomSide1Img,
        side2: roomSide2Img
      }
    },
    {
      id: 'T3',
      name: 'Phòng T3',
      description: 'Phòng thảo luận cho nhóm nhỏ với thiết kế hiện đại.',
      overview: 'Phòng T3 là phòng thảo luận hiện đại tọa lạc tầng 3 khu T, được thiết kế với phong cách tối giản và công nghệ thông minh. Phòng phù hợp cho các buổi họp nhóm hoặc thảo luận chuyên đề.',
      location: 'Tầng 3 khu T',
      size: 3,
      capacity: 30,
      area: '35 m²',
      amenities: ['Bàn thảo luận tròn', '6 ghế ergonomic', 'Điều hòa nhiệt độ', 'Wifi tốc độ cao', 'Màn hình thông minh', 'Hệ thống họp trực tuyến'],
      features: ['Thiết kế hiện đại', 'Cách âm tốt', 'Công nghệ họp thông minh'],
      images: {
        main: roomMainImg,
        side1: roomSide1Img,
        side2: roomSide2Img
      }
    },
    {
      id: 'T5',
      name: 'Phòng T5',
      description: 'Phòng hội thảo lớn với sức chứa lớn và trang thiết bị hiện đại.',
      overview: 'Phòng T5 là phòng hội thảo lớn tọa lạc tầng 5 khu T, có sức chứa lên đến 200 người, phù hợp cho các sự kiện lớn, hội thảo hoặc buổi thuyết trình. Phòng được trang bị đầy đủ hệ thống âm thanh, ánh sáng và thiết bị trình chiếu chuyên nghiệp.',
      location: 'Tầng 5 khu T',
      size: 6,
      capacity: 200,
      area: '150 m²',
      amenities: ['200 ghế ngồi', 'Sân khấu', 'Điều hòa nhiệt độ', 'Wifi tốc độ cao', 'Hệ thống âm thanh chuyên nghiệp', 'Máy chiếu độ phân giải cao', 'Bàn nước và tiếp tân'],
      features: ['Không gian rộng rãi', 'Hệ thống âm thanh chuyên nghiệp', 'Sân khấu cho thuyết trình'],
      images: {
        main: roomMainImg,
        side1: roomSide1Img,
        side2: roomSide2Img
      }
    }
  ];

  // Initialize mock data for API service
  useEffect(() => {
    initializeMockData(roomsData);
  }, []);

  // State để quản lý trang hiện tại và các tham số truyền giữa các trang
  const [currentPage, setCurrentPage] = useState('roomselection');
  const [pageParams, setPageParams] = useState({});
  
  // State để lưu phòng đang được chọn, mặc định là B1
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Lấy thông tin phòng hiện tại dựa trên id được chọn
  const currentRoom = selectedRoom 
    ? roomsData.find(room => room.id === selectedRoom) || roomsData[0]
    : null;

  // Hàm xử lý chuyển trang
  const navigateTo = (page, params = {}) => {
    setCurrentPage(page);
    setPageParams(params);
  };

  // Hàm để chọn phòng khác
  const selectRoom = (roomId) => {
    setSelectedRoom(roomId);
    // Sau khi chọn phòng, chuyển đến trang booking
    navigateTo('booking');
  };

  // Lắng nghe các sự kiện chuyển trang
  useEffect(() => {
    // Xử lý sự kiện chuyển trang qua custom events
    const handleNavigation = (event) => {
      if (event.detail) {
        const { page, params = {} } = event.detail;
        navigateTo(page, params);
      }
    };

    // Đăng ký cho tất cả các sự kiện điều hướng
    window.addEventListener('navigate', handleNavigation);

    // Các sự kiện cũ (để duy trì khả năng tương thích ngược)
    window.addEventListener('showCheckingPage', () => navigateTo('checking'));
    window.addEventListener('showBookingPage', () => navigateTo('booking'));
    window.addEventListener('showChangeRoomPage', (event) => 
      navigateTo('changeroom', event.detail?.params || {}));
    window.addEventListener('showMyRoomPage', () => navigateTo('myroom'));

    // Hủy đăng ký khi component unmount
    return () => {
      window.removeEventListener('navigate', handleNavigation);
      window.removeEventListener('showCheckingPage', () => {});
      window.removeEventListener('showBookingPage', () => {});
      window.removeEventListener('showChangeRoomPage', () => {});
      window.removeEventListener('showMyRoomPage', () => {});
    };
  }, []);

  // Render trang tương ứng dựa vào state currentPage
  const renderPage = () => {
    switch(currentPage) {
      case 'roomselection':
        return (
          <RoomSelectionPage 
            navigateTo={navigateTo} 
            roomsData={roomsData} 
            selectRoom={selectRoom}
          />
        );
      case 'booking':
        if (!currentRoom) {
          // Nếu chưa chọn phòng, chuyển về trang chọn phòng
          navigateTo('roomselection');
          return null;
        }
        return (
          <BookingPage 
            navigateTo={navigateTo} 
            currentRoom={currentRoom}
          />
        );
      case 'checking':
        return (
          <CheckingPage 
            navigateTo={navigateTo} 
            currentRoom={currentRoom}
          />
        );
      case 'changeroom':
        return (
          <ChangeRoomPage 
            navigateTo={navigateTo} 
            params={pageParams} 
            roomsData={roomsData}
            currentRoom={currentRoom}
          />
        );
      case 'myroom':
        return (
          <MyRoomPage 
            navigateTo={navigateTo} 
            roomsData={roomsData}
          />
        );
      default:
        return (
          <RoomSelectionPage 
            navigateTo={navigateTo} 
            roomsData={roomsData} 
            selectRoom={selectRoom}
          />
        );
    }
  };

  return (
    <div className="App">
      {renderPage()}
    </div>
  );
}

export default App;
