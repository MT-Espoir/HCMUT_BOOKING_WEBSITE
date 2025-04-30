import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomSearchPage.css';
import Header from '../../components/common/Header';
import { FaSearch } from 'react-icons/fa';
import { getRooms, searchRooms, filterRooms } from '../../services/api';

const RoomSearchPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    capacity: [],
    timeRange: [],
    duration: []
  });

  useEffect(() => {
    // Load rooms from backend when component mounts
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await getRooms();
        if (response.success) {
          setRooms(response.data);
        } else {
          setError('Failed to load rooms');
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
        setError('Failed to load rooms. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) {
      // If search query is empty, fetch all rooms
      try {
        setLoading(true);
        const response = await getRooms();
        if (response.success) {
          setRooms(response.data);
        }
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      setLoading(true);
      const response = await searchRooms(searchQuery);
      if (response.success) {
        setRooms(response.data);
      }
    } catch (err) {
      console.error('Error searching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters };
      
      if (updatedFilters[filterType].includes(value)) {
        // If value already exists, remove it
        updatedFilters[filterType] = updatedFilters[filterType].filter(item => item !== value);
      } else {
        // Otherwise add it
        updatedFilters[filterType] = [...updatedFilters[filterType], value];
      }
      
      return updatedFilters;
    });
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      // Convert filters to format expected by API
      const apiFilters = {
        capacity: filters.capacity.length ? Math.min(...filters.capacity) : undefined,
        // Add other filters as needed
      };
      
      const response = await filterRooms(apiFilters);
      if (response.success) {
        setRooms(response.data);
      }
    } catch (err) {
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters when they change
    if (Object.values(filters).some(filterArray => filterArray.length > 0)) {
      applyFilters();
    }
  }, [filters]);

  const handleBookRoom = (room) => {
    // Navigate to booking confirmation page with room data
    navigate('/confirm-booking', { state: { roomData: room } });
  };

  const filteredRooms = searchQuery
    ? rooms.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (room.location && room.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (room.description && room.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : rooms;

  return (
    <div className="room-search-layout">
      <Header />

      <div className="room-search-wrapper">
        {/* Sidebar */}
        <aside className="filter-sidebar">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by room name"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit()}
            />
            <button onClick={handleSearchSubmit} className="search-button">
              <FaSearch />
            </button>
          </div>

          <h4>Filter by</h4>

          <div className="filter-group">
            <h5>Cơ sở</h5>
            <label>
              <input 
                type="checkbox" 
                onChange={() => handleFilterChange('size', '1')} 
                checked={filters.size?.includes('1')}
              /> 1 người
            </label>
            <label>
              <input 
                type="checkbox" 
                onChange={() => handleFilterChange('size', '2')} 
                checked={filters.size?.includes('2')}
              /> 2 người
            </label>
          </div>

          <div className="filter-group">
            <h5>Khoảng giờ</h5>
            {['7h - 9h', '9h - 11h', '11h - 13h', '13h - 15h', '15h - 17h'].map((t, i) => (
              <label key={i}>
                <input 
                  type="checkbox"
                  onChange={() => handleFilterChange('timeRange', t)} 
                  checked={filters.timeRange?.includes(t)}
                /> {t}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h5>Sức chứa tối đa</h5>
            {[50, 100, 150, 200, 250].map((c) => (
              <label key={c}>
                <input 
                  type="checkbox" 
                  onChange={() => handleFilterChange('capacity', c)} 
                  checked={filters.capacity?.includes(c)}
                /> {c}
              </label>
            ))}
          </div>

          <div className="filter-group">
            <h5>Thời gian sử dụng</h5>
            {['1 tiếng', '2 tiếng', '3 tiếng', '4 tiếng'].map((d, i) => (
              <label key={i}>
                <input 
                  type="checkbox" 
                  onChange={() => handleFilterChange('duration', d)} 
                  checked={filters.duration?.includes(d)}
                /> {d}
              </label>
            ))}
          </div>
          
        </aside>

        {/* Main content */}
        <section className="room-listing">
          <h2>Phòng khả dụng để đặt </h2>
          
          {loading ? (
            <div className="loading">Loading rooms...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <>
              <p>{filteredRooms.length} kết quả được tìm thấy</p>
              <div className="room-grid">
                {filteredRooms.map((room) => (
                  <div key={room.id} className="room-card-modern">
                    <img src={room.image_url || "https://via.placeholder.com/350x200?text=Room+Image"} alt={room.name} />
                    <div className="card-body">
                      <h4>{room.name}</h4>
                      <p>{room.location}</p>
                      <p>{room.description}</p>
                      <div className="room-amenities">
                        {room.amenities && room.amenities.length > 0 && (
                          <p>Tiện nghi: {Array.isArray(room.amenities) ? room.amenities.join(', ') : room.amenities}</p>
                        )}
                      </div>
                      <button className="btn-primary" onClick={() => handleBookRoom(room)}>Đặt</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default RoomSearchPage;
