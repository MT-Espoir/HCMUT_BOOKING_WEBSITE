import React, { useState, useEffect } from 'react';
import './Changeroom.css';
import roomImage from '../../assets/room-main.png';
import { FaUser, FaSearch } from 'react-icons/fa';
import Header from '../../components/common/Header';
import { getRooms, getBookingDetails, changeBookingRoom } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';

const ChangeRoomPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams(); // Get booking ID from URL parameters
  
  // State for current booking and room data
  const [currentBooking, setCurrentBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  const [processingChange, setProcessingChange] = useState(false);
  
  // State for room search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    size: [],
    timeRange: [],
    capacity: [],
    duration: [],
    amenities: []
  });

  // Fetch booking details and available rooms when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch current booking details
        if (bookingId) {
          const bookingResponse = await getBookingDetails(bookingId);
          if (bookingResponse.success) {
            setCurrentBooking(bookingResponse.data);
          } else {
            setError('Failed to load booking details');
            return;
          }
        } else {
          setError('No booking ID provided');
          return;
        }
        
        // Fetch available rooms
        const roomsResponse = await getRooms();
        if (roomsResponse.success) {
          setRooms(roomsResponse.data);
        } else {
          setError('Failed to load available rooms');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load necessary data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [bookingId]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle filter changes
  const handleFilterChange = (category, value) => {
    setFilters(prevFilters => {
      const updatedFilters = {...prevFilters};
      
      if (updatedFilters[category].includes(value)) {
        // If already in filters, remove it
        updatedFilters[category] = updatedFilters[category].filter(item => item !== value);
      } else {
        // If not in filters, add it
        updatedFilters[category] = [...updatedFilters[category], value];
      }
      
      return updatedFilters;
    });
  };
  
  // Filter rooms based on search query and filters
  const filteredRooms = rooms.filter(room => {
    // Filter by search query
    if (searchQuery && !room.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by size
    if (filters.size.length > 0 && !filters.size.includes(room.size)) {
      return false;
    }
    
    // Filter by capacity
    if (filters.capacity.length > 0) {
      let capacityMatch = false;
      for (const cap of filters.capacity) {
        if (room.capacity === parseInt(cap) || room.capacity >= parseInt(cap)) {
          capacityMatch = true;
          break;
        }
      }
      if (!capacityMatch) return false;
    }
    
    // Exclude the currently booked room from results
    if (currentBooking && room.id === currentBooking.roomId) {
      return false;
    }
    
    return true;
  });
  
  // Handle room change request
  const handleChangeRoom = async (newRoomId) => {
    if (!bookingId || !newRoomId) {
      setError('Missing required information to change room');
      return;
    }
    
    try {
      setProcessingChange(true);
      setError('');
      
      const response = await changeBookingRoom(bookingId, newRoomId);
      
      if (response.success) {
        setChangeSuccess(true);
        setTimeout(() => {
          navigate('/myroom'); // Redirect back to My Room page after showing success message
        }, 2000);
      } else {
        setError(response.error || 'Failed to change room');
      }
    } catch (err) {
      console.error('Error changing room:', err);
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setProcessingChange(false);
    }
  };

  // Handle navigation back to My Room page
  const handleMyRooms = () => {
    navigate('/myroom');
  };

  // Display loading state
  if (loading) {
    return (
      <div className="changeroom-page">
        <Header />
        <main className="changeroom-main-content">
          <div className="changeroom-loading">Loading room options...</div>
        </main>
      </div>
    );
  }

  // Display error state
  if (error) {
    return (
      <div className="changeroom-page">
        <Header />
        <main className="changeroom-main-content">
          <div className="changeroom-error">{error}</div>
          <button className="changeroom-back-btn" onClick={handleMyRooms}>Back to My Rooms</button>
        </main>
      </div>
    );
  }

  // Display success state
  if (changeSuccess) {
    return (
      <div className="changeroom-page">
        <Header />
        <main className="changeroom-main-content">
          <div className="changeroom-success">
            <h3>Room changed successfully!</h3>
            <p>Redirecting back to your bookings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="changeroom-page">
      <Header />
      
      <main className="changeroom-main-content">
        {/* Current booking information */}
        <div className="changeroom-current-room-info">
          <h2>Đổi phòng cho đơn đặt phòng</h2>
          {currentBooking && (
            <div className="changeroom-current-room-card">
              <div className="changeroom-room-image">
                <img src={currentBooking.image || roomImage} alt="Current Room" />
              </div>
              <div className="changeroom-room-details">
                <h3>Phòng hiện tại: {currentBooking.roomName || 'Unknown Room'}</h3>
                <p>Thời gian: {new Date(currentBooking.checkIn).toLocaleString()} - {new Date(currentBooking.checkOut).toLocaleString()}</p>
                <p>Thời lượng: {Math.round((new Date(currentBooking.checkOut) - new Date(currentBooking.checkIn)) / (1000 * 60 * 60))} tiếng</p>
                <p>Sức chứa: {currentBooking.capacity || '?'} người</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Search bar */}
        <div className="changeroom-search-container">
          <div className="changeroom-search-box">
            <FaSearch className="changeroom-search-icon" />
            <input 
              type="text" 
              placeholder="Search by room name" 
              value={searchQuery}
              onChange={handleSearchChange}
              className="changeroom-search-input"
            />
          </div>
        </div>
        
        {/* Main content with filters and room list */}
        <div className="changeroom-content-container">
          {/* Left filter panel */}
          <div className="changeroom-filter-panel">
            <h3>Filter by</h3>
            
            {/* Size filters */}
            <div className="changeroom-filter-group">
              <h4>Cỡ số</h4>
              <div className="changeroom-filter-options">
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('size', 1)}
                    checked={filters.size.includes(1)}
                  />
                  <span>1 người</span>
                  <span className="changeroom-count">{rooms.filter(r => r.size === 1).length}</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('size', 2)}
                    checked={filters.size.includes(2)}
                  />
                  <span>2 người</span>
                  <span className="changeroom-count">{rooms.filter(r => r.size === 2).length}</span>
                </label>
              </div>
            </div>
            
            {/* Capacity filters */}
            <div className="changeroom-filter-group">
              <h4>Sức chứa tối đa</h4>
              <div className="changeroom-filter-options">
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('capacity', '50')}
                    checked={filters.capacity.includes('50')}
                  />
                  <span>50</span>
                  <span className="changeroom-count">{rooms.filter(r => r.capacity >= 50).length}</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('capacity', '100')}
                    checked={filters.capacity.includes('100')}
                  />
                  <span>100</span>
                  <span className="changeroom-count">{rooms.filter(r => r.capacity >= 100).length}</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('capacity', '150')}
                    checked={filters.capacity.includes('150')}
                  />
                  <span>150</span>
                  <span className="changeroom-count">{rooms.filter(r => r.capacity >= 150).length}</span>
                </label>
              </div>
            </div>
            
            {/* Amenities filters */}
            <div className="changeroom-filter-group">
              <h4>Vật chất</h4>
              <div className="changeroom-filter-options">
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('amenities', 'projector')}
                    checked={filters.amenities.includes('projector')}
                  />
                  <span>Máy chiếu</span>
                </label>
                <label className="changeroom-filter-option">
                  <input 
                    type="checkbox" 
                    onChange={() => handleFilterChange('amenities', 'aircon')}
                    checked={filters.amenities.includes('aircon')}
                  />
                  <span>Máy lạnh</span>
                </label>
              </div>
            </div>
          </div>
          
          {/* Available rooms to change to */}
          <div className="changeroom-room-list">
            <h3>Phòng khả dụng để đổi</h3>
            <p className="changeroom-result-count">{filteredRooms.length} kết quả được tìm thấy</p>
            
            {processingChange ? (
              <div className="changeroom-processing">Processing your room change request...</div>
            ) : filteredRooms.length > 0 ? (
              <div className="changeroom-rooms-container">
                {filteredRooms.map(room => (
                  <div className="changeroom-room-card" key={room.id}>
                    <div className="changeroom-room-image">
                      <img src={room.image_url || roomImage} alt={room.name} />
                    </div>
                    <div className="changeroom-room-info">
                      <h4>{room.name}</h4>
                      <p className="changeroom-room-description">{room.description}</p>
                      <p className="changeroom-room-amenities">
                        {room.amenities && 
                          (typeof room.amenities === 'string' 
                            ? room.amenities 
                            : Array.isArray(room.amenities) 
                              ? room.amenities.join(', ') 
                              : 'No amenities listed')}
                      </p>
                      <div className="changeroom-room-actions">
                        <button 
                          className="changeroom-change-btn" 
                          onClick={() => handleChangeRoom(room.id)}
                          disabled={processingChange}
                        >
                          Đổi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="changeroom-no-results">No available rooms match your criteria</div>
            )}

            <div className="changeroom-back-button-container">
              <button className="changeroom-back-button" onClick={handleMyRooms}>
                Back to My Bookings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChangeRoomPage;