import React, { useState, useEffect } from 'react';
import './quanlythietbipage.css';
import Headermanager from '../../components/common/Headermanager';
import roomMainImg from '../../assets/room-main.png';
import roomSide1Img from '../../assets/room-side1.jpg';
import roomSide2Img from '../../assets/room-side2.jpg';
import { FaSearch, FaBuilding, FaChartPie, FaTable, FaTh, FaMap, FaChevronRight } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRooms, getAllDevices } from '../../services/api';

const QuanLyThietBiPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // State
  const [buildings, setBuildings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [devices, setDevices] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalRooms: 0,
    normalRooms: 0,
    issueRooms: 0,
    maintenanceDevices: 0
  });
  const [expandedBuilding, setExpandedBuilding] = useState('');
  const [selectedFloor, setSelectedFloor] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table', 'grid', or 'map'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    building: '',
    floor: '',
    roomType: '',
    status: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State cho popup đặt lịch bảo trì
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [maintenanceData, setMaintenanceData] = useState({
    date: '',
    time: '',
    description: ''
  });
  
  // Fetch rooms, devices and organize by building/floor
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch rooms
        const roomsResponse = await getRooms();
        const roomsData = roomsResponse.data || [];
        console.log("Rooms data from API:", roomsData);
        
        // Fetch devices
        const devicesResponse = await getAllDevices();
        let devicesData = [];
        
        if (devicesResponse && devicesResponse.devices) {
          devicesData = devicesResponse.devices;
        } else if (devicesResponse && Array.isArray(devicesResponse)) {
          devicesData = devicesResponse;
        }
        console.log("Devices data from API:", devicesData);
        
        setDevices(devicesData);
        
        // Count devices per room - Sửa phần này để đếm chính xác
        const deviceCountByRoom = {};
        devicesData.forEach(device => {
          if (device && device.room_id) {
            // Chuyển đổi room_id thành chuỗi để đảm bảo khớp với phòng
            const roomIdStr = device.room_id.toString();
            if (!deviceCountByRoom[roomIdStr]) {
              deviceCountByRoom[roomIdStr] = 0;
            }
            deviceCountByRoom[roomIdStr]++;
          }
        });
        console.log("Device count by room:", deviceCountByRoom);
        
        // Add device count to rooms
        const roomsWithDeviceCount = roomsData.map(room => {
          if (!room) return null;
          
          // Đảm bảo sử dụng room.id hoặc room.room_id nếu có
          // Ưu tiên room.id vì thấy trong log dữ liệu phòng có trường id
          const roomId = room.id || room.room_id;
          
          if (!roomId) {
            console.error("Room without ID:", room);
            return null;
          }
          
          const roomIdStr = roomId.toString();
          
          // Tìm thiết bị trong phòng - so sánh chuỗi với ID phòng
          const roomDevices = devicesData.filter(device => 
            device && device.room_id && device.room_id.toString() === roomIdStr);
          
          let roomStatus = 'normal';
          
          if (roomDevices.some(device => 
            device && device.status && (device.status === 'ERROR' || device.status === 'OFFLINE'))) {
            roomStatus = 'issue';
          } else if (roomDevices.some(device => device && device.status && device.status === 'MAINTENANCE')) {
            roomStatus = 'maintenance';
          } else if (roomDevices.some(device => device && device.status && device.status === 'WARNING')) {
            roomStatus = 'warning';
          }
          
          return {
            ...room,
            // Sử dụng ID từ phòng
            id: roomIdStr,
            // Lấy số thiết bị từ deviceCountByRoom dựa trên ID phòng
            deviceCount: deviceCountByRoom[roomIdStr] || 0,
            status: roomStatus,
            type: room.room_type === 'STUDY' ? 'Phòng học' : 
                  room.room_type === 'MEETING' ? 'Phòng họp' : 
                  room.room_type === 'LAB' ? 'Phòng thí nghiệm' : 
                  room.room_type === 'LECTURE' ? 'Phòng thuyết trình' : 'Khác',
            capacity: room.capacity || 0,
            image: room.room_image
          };
        }).filter(Boolean); // Lọc bỏ các phần tử null
        
        console.log("Rooms with device count:", roomsWithDeviceCount);
        setRooms(roomsWithDeviceCount);
        
        // Process buildings and floors from rooms data
        const buildingsMap = {};
        
        // Group rooms by building and floor
        roomsWithDeviceCount.forEach(room => {
          if (!room || !room.building || room.floor === undefined) return;
          
          if (!buildingsMap[room.building]) {
            buildingsMap[room.building] = {
              id: room.building,
              name: `Tòa nhà ${room.building}`,
              floors: {}
            };
          }
          
          if (!buildingsMap[room.building].floors[room.floor]) {
            buildingsMap[room.building].floors[room.floor] = {
              id: `${room.building}${room.floor}`,
              name: `Tầng ${room.floor}`,
              hasIssue: false
            };
          }
          
          // Mark floors with issues
          if (room.status === 'issue' || room.status === 'maintenance') {
            buildingsMap[room.building].floors[room.floor].hasIssue = true;
          }
        });
        
        // Convert to array format needed for UI
        const buildingsArray = Object.values(buildingsMap).map(building => ({
          ...building,
          floors: Object.values(building.floors || {})
        }));
        
        setBuildings(buildingsArray);
        
        // Set default expanded building and selected floor if available
        if (buildingsArray.length > 0) {
          setExpandedBuilding(buildingsArray[0].id);
          if (buildingsArray[0].floors && buildingsArray[0].floors.length > 0) {
            setSelectedFloor(buildingsArray[0].floors[0].id);
          }
        }
        
        // Calculate dashboard data
        const totalRooms = roomsWithDeviceCount.length;
        const normalRooms = roomsWithDeviceCount.filter(room => room.status === 'normal').length;
        const issueRooms = roomsWithDeviceCount.filter(room => room.status === 'issue').length;
        const maintenanceDevices = devicesData.filter(
          device => device && device.status && device.status === 'MAINTENANCE'
        ).length;
        
        setDashboardData({
          totalRooms,
          normalRooms,
          issueRooms,
          maintenanceDevices
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handlers
  const toggleBuilding = (buildingId) => {
    setExpandedBuilding(expandedBuilding === buildingId ? null : buildingId);
  };

  const selectFloor = (floorId) => {
    setSelectedFloor(floorId);
    
    // Giả sử floorId có format là: [tòa nhà][số tầng] (ví dụ: "B11" cho tòa B1 tầng 1)
    // Để đảm bảo xử lý đúng, chúng ta cần kiểm tra format của floorId
    
    if (floorId && floorId.length >= 2) {
      // Tìm trong danh sách buildings để biết chính xác floorId thuộc tòa nhà và tầng nào
      for (const building of buildings) {
        const floor = building.floors.find(f => f.id === floorId);
        if (floor) {
          console.log(`Đã tìm thấy tầng: ${floor.name} thuộc tòa nhà ${building.name}`);
          
          // Cập nhật filters để khớp với tòa nhà và tầng đã chọn
          setFilters(prevFilters => ({
            ...prevFilters,
            building: building.id,
            // Lấy phần số từ tên tầng (Tầng X -> X)
            floor: floor.name.replace('Tầng ', '')
          }));
          
          // Log để kiểm tra giá trị filter
          console.log(`Đã cập nhật filter: building=${building.id}, floor=${floor.name.replace('Tầng ', '')}`);
          break;
        }
      }
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const handleViewRoomDetails = (roomId) => {
    navigate(`/manager-device/quanlythietbi?room=${roomId}`);
  };
  
  const handleScheduleMaintenance = (room) => {
    setSelectedRoom(room);
    setShowMaintenanceModal(true);
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    
    setMaintenanceData({
      date: formattedDate,
      time: '09:00',
      description: ''
    });
  };
  
  const handleCloseMaintenanceModal = () => {
    setShowMaintenanceModal(false);
    setSelectedRoom(null);
  };
  
  const handleMaintenanceDataChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmitMaintenance = () => {
    // Đây là phiên bản hardcode, không cần gọi API thực tế
    console.log('Maintenance scheduled:', {
      room: selectedRoom,
      ...maintenanceData
    });
    
    // Thông báo thành công
    alert(`Đã đặt lịch bảo trì thành công cho phòng ${selectedRoom.name} vào ngày ${maintenanceData.date} lúc ${maintenanceData.time}`);
    
    // Đóng modal
    handleCloseMaintenanceModal();
  };

  // Filter rooms based on search and filter criteria
  const filteredRooms = rooms.filter(room => {
    // Filter by search term
    if (searchTerm && 
        !room.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !room.id.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by building
    if (filters.building && room.building !== filters.building) {
      return false;
    }
    
    // Filter by floor
    if (filters.floor && room.floor.toString() !== filters.floor) {
      return false;
    }
    
    // Filter by room type
    if (filters.roomType && room.type !== filters.roomType) {
      return false;
    }
    
    // Filter by status
    if (filters.status && room.status !== filters.status) {
      return false;
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="DMP-device-management-container">
        <Headermanager />
        <div className="DMP-loading">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="DMP-device-management-container">
        <Headermanager />
        <div className="DMP-error">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="DMP-device-management-container">
      <Headermanager />
      
      {/* Sidebar */}
      <div className="DMP-sidebar">
        <div className="DMP-sidebar-title">Danh sách tòa nhà</div>
        <ul className="DMP-building-list">
          {buildings.map(building => (
            <li key={building.id} className="DMP-building-item">
              <div 
                className={`DMP-building-header ${expandedBuilding === building.id ? 'active' : ''}`}
                onClick={() => toggleBuilding(building.id)}
              >
                <span className="DMP-icon">
                  <FaChevronRight />
                </span>
                <span>{building.name}</span>
              </div>
              <ul className={`DMP-floor-list ${expandedBuilding === building.id ? 'active' : ''}`}>
                {building.floors.map(floor => (
                  <li 
                    key={floor.id}
                    className={`DMP-floor-item ${selectedFloor === floor.id ? 'active' : ''}`}
                    onClick={() => selectFloor(floor.id)}
                  >
                    <div className={`DMP-status-indicator ${floor.hasIssue ? 'red' : 'green'}`}></div>
                    <span>{floor.name}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Main Content */}
      <div className="DMP-main-content">
        {/* Search and Filter Area */}
        <div className="DMP-search-filter-area">
          {/* Search Bar */}
          <div className="DMP-search-bar">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên phòng, mã phòng, loại thiết bị..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button>
              <FaSearch />
            </button>
          </div>
          
          {/* Filter Options */}
          <div className="DMP-filter-options">
            <div className="DMP-filter-group">
              <label className="DMP-filter-label">Tòa nhà</label>
              <select 
                className="DMP-filter-select"
                value={filters.building}
                onChange={(e) => handleFilterChange('building', e.target.value)}
              >
                <option value="">Tất cả</option>
                {buildings.map(building => (
                  <option key={building.id} value={building.id}>
                    {building.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="DMP-filter-group">
              <label className="DMP-filter-label">Tầng</label>
              <select 
                className="DMP-filter-select"
                value={filters.floor}
                onChange={(e) => handleFilterChange('floor', e.target.value)}
              >
                <option value="">Tất cả</option>
                {/* Generate options for floors 1-10 */}
                {Array.from({length: 10}, (_, i) => i + 1).map(floor => (
                  <option key={floor} value={floor.toString()}>Tầng {floor}</option>
                ))}
              </select>
            </div>
            
            <div className="DMP-filter-group">
              <label className="DMP-filter-label">Loại phòng</label>
              <select 
                className="DMP-filter-select"
                value={filters.roomType}
                onChange={(e) => handleFilterChange('roomType', e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="Phòng học">Phòng học</option>
                <option value="Phòng thí nghiệm">Phòng thí nghiệm</option>
                <option value="Phòng hội thảo">Phòng hội thảo</option>
                <option value="Phòng thuyết trình">Phòng thuyết trình</option>
              </select>
            </div>
            
            <div className="DMP-filter-group">
              <label className="DMP-filter-label">Trạng thái</label>
              <select 
                className="DMP-filter-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Tất cả</option>
                <option value="normal">Hoạt động tốt</option>
                <option value="warning">Cảnh báo</option>
                <option value="issue">Có vấn đề</option>
                <option value="maintenance">Đang bảo trì</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Dashboard Overview */}
        <div className="DMP-dashboard-overview">
          <div className="DMP-dashboard-card blue">
            <div className="DMP-card-title">Tổng số phòng</div>
            <div className="DMP-card-value">{dashboardData.totalRooms}</div>
            <div className="DMP-card-info">Trên toàn trường</div>
          </div>
          
          <div className="DMP-dashboard-card green">
            <div className="DMP-card-title">Phòng hoạt động tốt</div>
            <div className="DMP-card-value">{dashboardData.normalRooms}</div>
            <div className="DMP-card-info">Tất cả thiết bị hoạt động bình thường</div>
          </div>
          
          <div className="DMP-dashboard-card red">
            <div className="DMP-card-title">Phòng có vấn đề</div>
            <div className="DMP-card-value">{dashboardData.issueRooms}</div>
            <div className="DMP-card-info">Cần sửa chữa thiết bị</div>
          </div>
          
          <div className="DMP-dashboard-card yellow">
            <div className="DMP-card-title">Thiết bị đang bảo trì</div>
            <div className="DMP-card-value">{dashboardData.maintenanceDevices}</div>
            <div className="DMP-card-info">Đang trong quá trình bảo trì</div>
          </div>
        </div>
        
        {/* View Mode Toggle */}
        <div className="DMP-view-toggle">
          <button 
            className={viewMode === 'table' ? 'active' : ''}
            onClick={() => setViewMode('table')}
          >
            <FaTable style={{ marginRight: '8px' }} /> Bảng
          </button>
          <button 
            className={viewMode === 'grid' ? 'active' : ''}
            onClick={() => setViewMode('grid')}
          >
            <FaTh style={{ marginRight: '8px' }} /> Lưới
          </button>
          <button 
            className={viewMode === 'map' ? 'active' : ''}
            onClick={() => setViewMode('map')}
          >
            <FaMap style={{ marginRight: '8px' }} /> Bản đồ
          </button>
        </div>
        
        {/* Room List - Table View */}
        {viewMode === 'table' && (
          <table className="DMP-room-list-table">
            <thead>
              <tr>
                <th>Mã phòng</th>
                <th>Tên phòng</th>
                <th>Loại phòng</th>
                <th>Vị trí</th>
                <th>Sức chứa</th>
                <th>Số thiết bị</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.length > 0 ? (
                filteredRooms.map(room => (
                  <tr key={room.id}>
                    <td>{room.id}</td>
                    <td>{room.name}</td>
                    <td>{room.type}</td>
                    <td>Tòa {room.building} - Tầng {room.floor}</td>
                    <td>{room.capacity} người</td>
                    <td>{room.deviceCount}</td>
                    <td>
                      <span className={`DMP-status-badge ${
                        room.status === 'normal' ? 'green' : 
                        room.status === 'warning' ? 'yellow' :
                        room.status === 'issue' ? 'red' : 'yellow'
                      }`}>
                        {room.status === 'normal' ? 'Tốt' : 
                        room.status === 'warning' ? 'Cần chú ý' :
                        room.status === 'issue' ? 'Có vấn đề' : 'Đang bảo trì'}
                      </span>
                    </td>
                    <td>
                      <div className="DMP-action-buttons">
                        <button className="DMP-action-button view" onClick={() => handleViewRoomDetails(room.id)}>
                          Xem
                        </button>
                        <button 
                          className="DMP-action-button schedule"
                          onClick={() => handleScheduleMaintenance(room)}
                        >
                          {room.status === 'issue' ? 'Đặt bảo trì' : 'Kiểm tra'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="DMP-no-results">
                    Không tìm thấy phòng nào phù hợp với điều kiện lọc
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        
        {/* Room List - Grid View */}
        {viewMode === 'grid' && (
          <div className="DMP-room-grid">
            {filteredRooms.length > 0 ? (
              filteredRooms.map(room => (
                <div key={room.id} className="DMP-room-card">
                  <div className="DMP-room-card-image">
                    <img src={room.image || (
                      room.status === 'normal' ? roomMainImg : 
                      room.status === 'issue' ? roomSide2Img : roomSide1Img
                    )} alt={room.name} />
                    <div className={`DMP-room-card-badge ${
                      room.status === 'normal' ? 'green' : 
                      room.status === 'warning' ? 'yellow' :
                      room.status === 'issue' ? 'red' : 'yellow'
                    }`}>
                      {room.status === 'normal' ? 'Tốt' : 
                      room.status === 'warning' ? 'Cần chú ý' :
                      room.status === 'issue' ? 'Có vấn đề' : 'Đang bảo trì'}
                    </div>
                  </div>
                  <div className="DMP-room-card-content">
                    <div className="DMP-room-card-title">{room.name} ({room.id})</div>
                    <div className="DMP-room-card-info">
                      <span>
                        <FaBuilding /> {room.type}
                      </span>
                      <span>
                        <FaBuilding /> Tòa {room.building} - Tầng {room.floor}
                      </span>
                      <span>
                        <FaBuilding /> Sức chứa: {room.capacity} người
                      </span>
                      <span>
                        <FaBuilding /> Thiết bị: {room.deviceCount}
                      </span>
                    </div>
                    <div className="DMP-room-card-actions">
                      <button className="DMP-action-button view" onClick={() => handleViewRoomDetails(room.id)}>
                        Xem chi tiết
                      </button>
                      <button 
                        className="DMP-action-button schedule"
                        onClick={() => handleScheduleMaintenance(room)}
                      >
                        {room.status === 'issue' ? 'Đặt bảo trì' : 'Kiểm tra thiết bị'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="DMP-no-results">
                Không tìm thấy phòng nào phù hợp với điều kiện lọc
              </div>
            )}
          </div>
        )}
        
        {/* Room List - Map View */}
        {viewMode === 'map' && (
          <div className="DMP-chart-card" style={{ height: 'auto', padding: '20px' }}>
            <div className="DMP-chart-title">Bản đồ tòa nhà</div>
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p>Chức năng bản đồ sẽ được phát triển trong giai đoạn tiếp theo.</p>
              <p>Sẽ hiển thị sơ đồ các tầng dạng blueprint với các phòng được tô màu theo trạng thái thiết bị.</p>
            </div>
          </div>
        )}
        
        {/* Pagination */}
        <div className="DMP-pagination">
          <div className="DMP-page-info">
            Hiển thị 1-{filteredRooms.length} trong tổng số {filteredRooms.length} phòng
          </div>
          <div className="DMP-page-controls">
            <button disabled>&lt;</button>
            <button className="active">1</button>
            <button disabled>&gt;</button>
          </div>
        </div>
      </div>
      
      {/* Maintenance Modal */}
      {showMaintenanceModal && (
        <div className="DMP-maintenance-modal">
          <div className="DMP-modal-content">
            <h2>Đặt lịch bảo trì</h2>
            <div className="DMP-modal-field">
              <label>Phòng:</label>
              <span>{selectedRoom.name} ({selectedRoom.id})</span>
            </div>
            <div className="DMP-modal-field">
              <label>Ngày:</label>
              <input 
                type="date" 
                name="date" 
                value={maintenanceData.date} 
                onChange={handleMaintenanceDataChange} 
              />
            </div>
            <div className="DMP-modal-field">
              <label>Thời gian:</label>
              <input 
                type="time" 
                name="time" 
                value={maintenanceData.time} 
                onChange={handleMaintenanceDataChange} 
              />
            </div>
            <div className="DMP-modal-field">
              <label>Mô tả:</label>
              <textarea 
                name="description" 
                value={maintenanceData.description} 
                onChange={handleMaintenanceDataChange} 
              />
            </div>
            <div className="DMP-modal-actions">
              <button onClick={handleSubmitMaintenance}>Xác nhận</button>
              <button onClick={handleCloseMaintenanceModal}>Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuanLyThietBiPage;


