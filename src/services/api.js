// Base API URL - change this when backend is available
const API_BASE_URL = 'https://api.example.com/v1';

/**
 * Helper function to simulate API delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Returns a promise that resolves after the delay
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper function to make API requests
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<Object>} - API response
 */
async function apiRequest(endpoint, options = {}) {
  try {
    // When backend is ready, uncomment the following code
    // const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     // Add auth token if user is logged in
    //     ...(localStorage.getItem('authToken') && {
    //       'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    //     }),
    //   },
    //   ...options,
    // });
    
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || 'Something went wrong');
    // }
    
    // return await response.json();
    
    // For now, simulate API delay
    await delay(500);
    return { success: true, data: [] };
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// --------------------------------
// Room-related API functions
// --------------------------------

/**
 * Get all available rooms
 * @param {Object} filters - Filters for rooms (optional)
 * @returns {Promise<Array>} - List of rooms
 */
export const getRooms = async (filters = {}) => {
  try {
    // In the future, pass filters to API
    // return await apiRequest('/rooms', { method: 'GET', params: filters });
    
    // For now, return mock data from App.js
    await delay(500);
    return { 
      success: true,
      data: window.mockRoomData || [] 
    };
  } catch (error) {
    console.error('Failed to fetch rooms:', error);
    throw error;
  }
};

/**
 * Get details for a specific room
 * @param {string} roomId - Room ID
 * @returns {Promise<Object>} - Room details
 */
export const getRoomDetails = async (roomId) => {
  try {
    // return await apiRequest(`/rooms/${roomId}`, { method: 'GET' });
    
    // For now, return mock data
    await delay(300);
    const mockData = window.mockRoomData || [];
    const room = mockData.find(room => room.id === roomId);
    
    if (!room) {
      throw new Error('Room not found');
    }
    
    return {
      success: true,
      data: room
    };
  } catch (error) {
    console.error(`Failed to fetch room ${roomId}:`, error);
    throw error;
  }
};

/**
 * Search rooms by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} - List of matching rooms
 */
export const searchRooms = async (query) => {
  try {
    // return await apiRequest('/rooms/search', { 
    //   method: 'GET', 
    //   params: { query } 
    // });
    
    // For now, search mock data
    await delay(300);
    const mockData = window.mockRoomData || [];
    const results = mockData.filter(room => 
      room.name.toLowerCase().includes(query.toLowerCase()) ||
      room.location.toLowerCase().includes(query.toLowerCase()) ||
      room.description.toLowerCase().includes(query.toLowerCase())
    );
    
    return {
      success: true,
      data: results
    };
  } catch (error) {
    console.error('Failed to search rooms:', error);
    throw error;
  }
};

/**
 * Filter rooms by criteria
 * @param {Object} filters - Filter criteria
 * @returns {Promise<Array>} - List of filtered rooms
 */
export const filterRooms = async (filters) => {
  try {
    // return await apiRequest('/rooms/filter', { 
    //   method: 'POST', 
    //   body: JSON.stringify(filters)
    // });
    
    // For now, filter mock data
    await delay(400);
    const mockData = window.mockRoomData || [];
    
    const filteredRooms = mockData.filter(room => {
      // Apply filters
      if (filters.size && filters.size.length > 0 && !filters.size.includes(room.size)) {
        return false;
      }
      if (filters.capacity && filters.capacity.length > 0) {
        const capacities = filters.capacity.map(cap => parseInt(cap));
        if (!capacities.some(cap => room.capacity >= cap)) {
          return false;
        }
      }
      // More filters can be added here
      return true;
    });
    
    return {
      success: true,
      data: filteredRooms
    };
  } catch (error) {
    console.error('Failed to filter rooms:', error);
    throw error;
  }
};

// --------------------------------
// Booking-related API functions
// --------------------------------

/**
 * Create a new booking
 * @param {Object} bookingData - Booking details
 * @returns {Promise<Object>} - Created booking
 */
export const createBooking = async (bookingData) => {
  try {
    // return await apiRequest('/bookings', { 
    //   method: 'POST', 
    //   body: JSON.stringify(bookingData)
    // });
    
    // For now, simulate success
    await delay(700);
    
    return {
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000),
        ...bookingData,
        status: 'upcoming',
        createdAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error('Failed to create booking:', error);
    throw error;
  }
};

/**
 * Get all bookings for the current user
 * @returns {Promise<Array>} - List of user bookings
 */
export const getUserBookings = async () => {
  try {
    // return await apiRequest('/bookings/user', { method: 'GET' });
    
    // For now, return mock data
    await delay(600);
    const mockBookings = [
      {
        id: 1,
        roomId: 'B1',
        roomName: 'Phòng B1',
        checkIn: 'Sunday, April 24, 2025 - 09:00',
        checkOut: 'Sunday, April 24, 2025 - 10:00',
        duration: '1 tiếng',
        status: 'upcoming'
      },
      {
        id: 2,
        roomId: 'B2',
        roomName: 'Phòng B2',
        checkIn: 'Monday, March 19, 2023 - 13:00',
        checkOut: 'Monday, March 19, 2023 - 15:00',
        duration: '2 tiếng',
        status: 'past'
      },
      {
        id: 3,
        roomId: 'T3',
        roomName: 'Phòng T3',
        checkIn: 'Tuesday, February 15, 2023 - 10:00',
        checkOut: 'Tuesday, February 15, 2023 - 11:30',
        duration: '1.5 tiếng',
        status: 'canceled'
      }
    ];
    
    return {
      success: true,
      data: mockBookings
    };
  } catch (error) {
    console.error('Failed to fetch user bookings:', error);
    throw error;
  }
};

/**
 * Get details for a specific booking
 * @param {number} bookingId - Booking ID
 * @returns {Promise<Object>} - Booking details
 */
export const getBookingDetails = async (bookingId) => {
  try {
    // return await apiRequest(`/bookings/${bookingId}`, { method: 'GET' });
    
    // For now, find in mock data
    await delay(300);
    const mockBookings = [
      {
        id: 1,
        roomId: 'B1',
        roomName: 'Phòng B1',
        checkIn: 'Sunday, April 24, 2025 - 09:00',
        checkOut: 'Sunday, April 24, 2025 - 10:00',
        duration: '1 tiếng',
        status: 'upcoming'
      },
      {
        id: 2,
        roomId: 'B2',
        roomName: 'Phòng B2',
        checkIn: 'Monday, March 19, 2023 - 13:00',
        checkOut: 'Monday, March 19, 2023 - 15:00',
        duration: '2 tiếng',
        status: 'past'
      }
    ];
    
    const booking = mockBookings.find(b => b.id === bookingId);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return {
      success: true,
      data: booking
    };
  } catch (error) {
    console.error(`Failed to fetch booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Cancel a booking
 * @param {number} bookingId - Booking ID
 * @returns {Promise<Object>} - Canceled booking
 */
export const cancelBooking = async (bookingId) => {
  try {
    // return await apiRequest(`/bookings/${bookingId}/cancel`, { method: 'POST' });
    
    // For now, simulate success
    await delay(500);
    
    return {
      success: true,
      data: {
        id: bookingId,
        status: 'canceled',
        canceledAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error(`Failed to cancel booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Change room for an existing booking
 * @param {number} bookingId - Booking ID
 * @param {string} newRoomId - New room ID
 * @returns {Promise<Object>} - Updated booking
 */
export const changeBookingRoom = async (bookingId, newRoomId) => {
  try {
    // return await apiRequest(`/bookings/${bookingId}/change-room`, { 
    //   method: 'POST',
    //   body: JSON.stringify({ newRoomId })
    // });
    
    // For now, simulate success
    await delay(600);
    
    return {
      success: true,
      data: {
        id: bookingId,
        roomId: newRoomId,
        updatedAt: new Date().toISOString()
      }
    };
  } catch (error) {
    console.error(`Failed to change room for booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Delete booking history (for past or canceled bookings)
 * @param {number} bookingId - Booking ID
 * @returns {Promise<Object>} - Response
 */
export const deleteBookingHistory = async (bookingId) => {
  try {
    // return await apiRequest(`/bookings/${bookingId}`, { method: 'DELETE' });
    
    // For now, simulate success
    await delay(400);
    
    return {
      success: true,
      message: 'Booking history deleted successfully'
    };
  } catch (error) {
    console.error(`Failed to delete booking history ${bookingId}:`, error);
    throw error;
  }
};

// --------------------------------
// User-related API functions
// --------------------------------

/**
 * User login
 * @param {Object} credentials - User credentials
 * @returns {Promise<Object>} - Auth token and user info
 */
export const loginUser = async (credentials) => {
  try {
    // return await apiRequest('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify(credentials)
    // });
    
    // For now, simulate login
    await delay(800);
    
    // Basic validation
    if (!credentials.password || credentials.password.length < 6) {
      throw new Error('Invalid credentials');
    }
    
    const mockUser = {
      id: 1,
      firstName: credentials.firstName || 'Test',
      lastName: credentials.lastName || 'User',
      email: 'test@example.com',
      studentId: credentials.studentId || '123456789'
    };
    
    // Store auth token in localStorage (simulated)
    localStorage.setItem('authToken', 'mock-token-abc123');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return {
      success: true,
      data: {
        token: 'mock-token-abc123',
        user: mockUser
      }
    };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

/**
 * Get current user info
 * @returns {Promise<Object>} - User info
 */
export const getCurrentUser = async () => {
  try {
    // return await apiRequest('/users/me', { method: 'GET' });
    
    // For now, get from localStorage
    await delay(200);
    
    const user = localStorage.getItem('user');
    if (!user) {
      throw new Error('User not logged in');
    }
    
    return {
      success: true,
      data: JSON.parse(user)
    };
  } catch (error) {
    console.error('Failed to get current user:', error);
    throw error;
  }
};

/**
 * Logout user
 * @returns {Promise<Object>} - Response
 */
export const logoutUser = async () => {
  try {
    // return await apiRequest('/auth/logout', { method: 'POST' });
    
    // For now, just clear localStorage
    await delay(300);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};

/**
 * Function to initialize mock data from App.js
 * This function should be called when the app starts
 * @param {Array} roomsData - Mock room data from App.js
 */
export const initializeMockData = (roomsData) => {
  // Store mock data in window object for access by other functions
  window.mockRoomData = roomsData;
};

export default {
  getRooms,
  getRoomDetails,
  searchRooms,
  filterRooms,
  createBooking,
  getUserBookings,
  getBookingDetails,
  cancelBooking,
  changeBookingRoom,
  deleteBookingHistory,
  loginUser,
  getCurrentUser,
  logoutUser,
  initializeMockData
};