// Base API URL - change this when backend is available
const API_BASE_URL = 'http://localhost:5000/api';

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
// src/services/api.js
export async function loginAPI(account, password) {
  try {
    console.log('Login attempt:', { email: account, password: "***" });
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        user: {
          email: account,
          password: password
        } 
      }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      const data = await response.json();
      console.error('Login failed with status:', response.status);
      throw new Error(data.error || 'Sai tài khoản hoặc mật khẩu!');
    }
    
    const data = await response.json();
    console.log('Login successful, token received');
    
    try {
      // Fetch user profile with the token
      const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        return {
          token: data.token,
          user: {
            name: profileData.username,
            email: profileData.email,
            role: profileData.role,
            mssv: profileData.mssv,
            faculty: profileData.faculty
          }
        };
      }
    } catch (profileError) {
      console.error('Failed to fetch user profile:', profileError);
    }
    
    // Fallback if profile fetch fails
    return {
      token: data.token,
      user: {
        name: account,
        email: account,
        role: 'student'
      }
    };
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

async function apiRequest(endpoint, options = {}) {
  try {
    // Prepare URL and query parameters
    let url = `${API_BASE_URL}${endpoint}`;
    
    // Add query parameters if provided
    if (options.params) {
      const queryParams = new URLSearchParams();
      Object.entries(options.params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      url += `?${queryParams.toString()}`;
      delete options.params;
    }

    const token = localStorage.getItem('token');
    
    // Make the actual request
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // Add auth token if available
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }
    
    return data;
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
    return await apiRequest('/room', { 
      method: 'GET', 
      params: filters 
    });
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
    return await apiRequest(`/room/${roomId}`, { 
      method: 'GET' 
    });
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
    return await apiRequest('/room/search', { 
      method: 'GET', 
      params: { query } 
    });
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
    return await apiRequest('/room', { 
      method: 'GET', 
      params: filters 
    });
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
    return await apiRequest('/booking', { 
      method: 'POST', 
      body: JSON.stringify(bookingData)
    });
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
    return await apiRequest('/booking/user', { method: 'GET' });
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
    return await apiRequest(`/booking/${bookingId}`, { method: 'GET' });
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
    return await apiRequest(`/booking/${bookingId}/cancel`, { method: 'POST' });
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
    return await apiRequest(`/booking/${bookingId}/change-room`, { 
      method: 'POST',
      body: JSON.stringify({ newRoomId })
    });
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
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
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
    const token = localStorage.getItem('token');
    
    if (token) {
      // Call the actual logout API endpoint
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    // Clear local storage regardless of API result
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  } catch (error) {
    console.error('Logout failed:', error);
    // Still clear the local storage even if the API call fails
    localStorage.removeItem('token');
    localStorage.removeItem('user');
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