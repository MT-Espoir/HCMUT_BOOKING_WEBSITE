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
    
    // Lưu token vào localStorage
    localStorage.setItem('token', data.token);
    
    try {
      // Fetch user profile with the token
      const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const userData = {
          name: profileData.username,
          email: profileData.email,
          role: profileData.role,
          mssv: profileData.mssv,
          faculty: profileData.faculty
        };
        
        // Lưu thông tin user vào localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        return {
          token: data.token,
          user: userData
        };
      }
    } catch (profileError) {
      console.error('Failed to fetch user profile:', profileError);
    }
    
    // Fallback if profile fetch fails
    const fallbackUser = {
      name: account,
      email: account,
      role: 'student'
    };
    
    // Lưu thông tin fallback user vào localStorage
    localStorage.setItem('user', JSON.stringify(fallbackUser));
    
    return {
      token: data.token,
      user: fallbackUser
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

    // Lấy token từ localStorage
    const token = localStorage.getItem('token');
    
    // Kiểm tra token có tồn tại không
    if (!token) {
      console.warn('No authentication token found, request may fail if endpoint requires authentication');
    }
    
    // Chuẩn bị headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    
    // Make the actual request
    const response = await fetch(url, {
      headers: headers,
      ...options,
    });
    
    // Xử lý các lỗi liên quan đến xác thực
    if (response.status === 401) {
      console.error('Authentication failed: Token expired or invalid');
      // Có thể thực hiện refresh token hoặc logout tại đây
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error('Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.');
    }
    
    if (response.status === 403) {
      console.error('Authorization failed: Insufficient permissions');
      throw new Error('Forbidden: Admin access required');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Something went wrong');
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
    const response = await apiRequest('/booking/user', { method: 'GET' });
    
    // Transform the data to match what the frontend expects
    if (response.success && response.data) {
      // Map backend field names to what the frontend component expects
      const transformedData = {
        success: true,
        data: response.data.map(booking => {
          console.log('Booking data from API:', booking);
          
          // Xác định đường dẫn hình ảnh dựa trên roomName
          let roomImage;
          // Lấy tên phòng từ booking hoặc từ phòng được liên kết
          const roomName = booking.room_name || booking.roomName || '';
          
          // Xác định tòa nhà từ tên phòng
          if (roomName.includes('B1') || roomName.includes('B 1') || roomName.toLowerCase().includes('b1')) {
            roomImage = '/uploads/rooms/B1.png';
          } else if (roomName.includes('H6') || roomName.includes('H 6') || roomName.toLowerCase().includes('h6')) {
            roomImage = '/uploads/rooms/H6.jpg';
          } else if (roomName.includes('B') || roomName.toLowerCase().includes('b')) {
            // Nếu tên phòng chỉ chứa ký tự B
            roomImage = '/uploads/rooms/B1.png';
          } else if (roomName.includes('H') || roomName.toLowerCase().includes('h')) {
            // Nếu tên phòng chỉ chứa ký tự H
            roomImage = '/uploads/rooms/H6.jpg';
          } else {
            // Mặc định sử dụng hình ảnh B1.png
            roomImage = '/uploads/rooms/B1.png';
          }
          
          return {
            ...booking,
            checkIn: booking.startTime ? new Date(booking.startTime).toLocaleString() : '',
            checkOut: booking.endTime ? new Date(booking.endTime).toLocaleString() : '',
            status: booking.status || (booking.bookingStatus 
              ? booking.bookingStatus.toLowerCase() === 'confirmed' 
                ? 'upcoming' 
                : booking.bookingStatus.toLowerCase() === 'completed'
                  ? 'past'
                  : booking.bookingStatus.toLowerCase() === 'cancelled' || booking.bookingStatus.toLowerCase() === 'auto_cancelled'
                    ? 'canceled'
                    : 'upcoming'
              : 'upcoming'),
            roomImage: roomImage,
            roomName: roomName || `Phòng ${booking.room_id || 'không xác định'}`
          };
        })
      };
      return transformedData;
    }
    
    return response;
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
 * Register a new user
 * @param {string} username - Username
 * @param {string} email - Email
 * @param {string} password - Password
 * @param {string} fullName - Full name (optional)
 * @param {string} phoneNumber - Phone number (optional)
 * @param {string} faculty - Faculty/Department (optional)
 * @param {string} mssv - Student ID (optional)
 * @returns {Promise<Object>} - Registration result
 */
export async function registerAPI(username, email, password, fullName = '', phoneNumber = '', faculty = '', mssv = '') {
  try {
    console.log('Registration attempt:', { username, email, password: "***" });
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username,
        email,
        password,
        fullName: fullName || username,
        phoneNumber,
        faculty,
        mssv,
        role: 'student' // Default role for new registrations
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error('Registration failed with status:', response.status);
      throw new Error(data.error || 'Registration failed');
    }
    
    console.log('Registration successful');
    return {
      success: true,
      message: data.message || 'Registration successful',
      user: data.user
    };
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

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

// --------------------------------
// Admin-related API functions
// --------------------------------

/**
 * Get all users with their active status (Admin only)
 * @returns {Promise<Array>} - List of users with their status
 */
export const getUsersAndTheirActiveStatus = async () => {
  try {
    const response = await apiRequest('/admin/user', { method: 'GET' });
    
    // Chuyển đổi dữ liệu từ backend để phù hợp với frontend
    const transformedData = {
      success: true,
      data: response.map(user => ({
        id: user.user_id,
        name: user.username,
        email: user.email,
        role: user.role.toLowerCase(),
        mssv: user.mssv,
        faculty: user.faculty,
        status: user.active ? 'online' : 'offline',
        lastLogin: user.last_login || null,
        note: user.notes || '',
        bookings: [] // Sẽ được điền sau khi lấy thông tin chi tiết
      }))
    };
    
    return transformedData;
  } catch (error) {
    console.error('Failed to fetch users and their status:', error);
    throw error;
  }
};

/**
 * Get user profile with booking history (Admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - User profile with booking history
 */
export const getUserProfile = async (userId) => {
  try {
    const userData = await apiRequest(`/admin/user/${userId}`, { method: 'GET' });
    
    // Lấy thêm lịch sử đặt phòng của người dùng
    let bookings = [];
    try {
      const bookingData = await apiRequest(`/admin/booking/user/${userId}`, { method: 'GET' });
      bookings = bookingData.map(booking => ({
        id: booking.booking_id,
        roomId: booking.room_id,
        description: booking.title || booking.purpose,
        time: `${new Date(booking.start_time).toLocaleTimeString()} - ${new Date(booking.end_time).toLocaleTimeString()}`,
        date: new Date(booking.start_time).toLocaleDateString(),
        image: 'https://picsum.photos/50/50?1' // Placeholder
      }));
    } catch (bookingError) {
      console.error(`Could not fetch bookings for user ${userId}:`, bookingError);
      // Không làm gián đoạn luồng chính nếu không lấy được lịch sử đặt phòng
    }
    
    // Chuyển đổi dữ liệu từ backend để phù hợp với frontend
    const transformedData = {
      success: true,
      data: {
        id: userData.user_id,
        name: userData.username,
        email: userData.email,
        role: userData.role.toLowerCase(),
        mssv: userData.mssv,
        faculty: userData.faculty,
        status: userData.status === 'ACTIVE' ? 'verified' : 
                userData.status === 'RESTRICTED' ? 'rejected' : 'pending',
        lastLogin: userData.last_login || null,
        note: userData.notes || '',
        bookings: bookings
      }
    };
    
    return transformedData;
  } catch (error) {
    console.error(`Failed to fetch user profile ${userId}:`, error);
    throw error;
  }
};

/**
 * Update user status (Admin only)
 * @param {string} userId - User ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated user
 */
export const updateUserStatus = async (userId, status) => {
  try {
    return await apiRequest(`/admin/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  } catch (error) {
    console.error(`Failed to update user status ${userId}:`, error);
    throw error;
  }
};

/**
 * Get all bookings (Admin only)
 * @param {Object} filters - Filters for bookings (optional)
 * @returns {Promise<Array>} - List of bookings
 */
export const getAllBookings = async (filters = {}) => {
  try {
    return await apiRequest('/admin/booking', {
      method: 'GET',
      params: filters
    });
  } catch (error) {
    console.error('Failed to fetch all bookings:', error);
    throw error;
  }
};

/**
 * Approve or reject a booking (Admin only)
 * @param {string} bookingId - Booking ID
 * @param {string} status - New status ('approved' or 'rejected')
 * @param {string} reason - Reason for rejection (optional)
 * @returns {Promise<Object>} - Updated booking
 */
export const updateBookingStatus = async (bookingId, status, reason = '') => {
  try {
    return await apiRequest(`/admin/booking/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, reason })
    });
  } catch (error) {
    console.error(`Failed to update booking status ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Get all devices (Admin only)
 * @returns {Promise<Array>} - List of devices
 */
export const getAllDevices = async () => {
  try {
    return await apiRequest('/device', { method: 'GET' });
  } catch (error) {
    console.error('Failed to fetch all devices:', error);
    throw error;
  }
};

/**
 * Get devices by room (Admin only)
 * @param {string} roomId - Room ID
 * @returns {Promise<Array>} - List of devices in the room
 */
export const getDevicesByRoom = async (roomId) => {
  try {
    return await apiRequest(`/device/room/${roomId}`, { method: 'GET' });
  } catch (error) {
    console.error(`Failed to fetch devices for room ${roomId}:`, error);
    throw error;
  }
};

/**
 * Update device status (Admin only)
 * @param {string} deviceId - Device ID
 * @param {string} status - New status
 * @returns {Promise<Object>} - Updated device
 */
export const updateDeviceStatus = async (deviceId, status) => {
  try {
    return await apiRequest(`/device/${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  } catch (error) {
    console.error(`Failed to update device status ${deviceId}:`, error);
    throw error;
  }
};

/**
 * Update user role (Admin only)
 * @param {string} userId - User ID
 * @param {string} role - New role
 * @returns {Promise<Object>} - Updated user
 */
export const updateUserRole = async (userId, role) => {
  try {
    return await apiRequest(`/admin/user/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role })
    });
  } catch (error) {
    console.error(`Failed to update user role ${userId}:`, error);
    throw error;
  }
};

/**
 * Get role change history for a user (Admin only)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - History of role changes
 */
export const getUserRoleHistory = async (userId) => {
  try {
    return await apiRequest(`/admin/user/${userId}/role-history`, { method: 'GET' });
  } catch (error) {
    console.error(`Failed to fetch role history for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Get users pending verification (Admin only)
 * @returns {Promise<Array>} - List of users pending verification
 */
export const getUsersForVerification = async () => {
  try {
    const response = await apiRequest('/admin/user', { method: 'GET' });
    
    // Chuyển đổi dữ liệu từ backend để phù hợp với frontend
    const transformedData = {
      success: true,
      data: response.map(user => ({
        id: user.user_id,
        name: user.username,
        email: user.email,
        role: user.role,
        mssv: user.mssv,
        faculty: user.faculty,
        status: user.status === 'ACTIVE' ? 'verified' : 'pending',
        lastLogin: user.last_login || null,
        note: user.notes || ''
      }))
    };
    
    return transformedData;
  } catch (error) {
    console.error('Failed to fetch users for verification:', error);
    throw error;
  }
};

/**
 * Verify user (Admin only)
 * @param {string} userId - User ID
 * @param {string} verificationStatus - New verification status ('verified', 'rejected', 'pending')
 * @param {string} notes - Verification notes (optional)
 * @returns {Promise<Object>} - Updated user
 */
export const updateUserVerification = async (userId, verificationStatus, notes = '') => {
  try {
    // Chuyển đổi trạng thái từ frontend sang backend
    let backendStatus;
    switch (verificationStatus) {
      case 'verified':
        backendStatus = 'ACTIVE';
        break;
      case 'rejected':
        backendStatus = 'RESTRICTED';
        break;
      case 'pending':
        backendStatus = 'PENDING';
        break;
      default:
        backendStatus = 'PENDING';
    }
    
    return await apiRequest(`/admin/user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ 
        status: backendStatus,
        notes: notes
      })
    });
  } catch (error) {
    console.error(`Failed to update user verification ${userId}:`, error);
    throw error;
  }
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
  registerAPI,
  getCurrentUser,
  logoutUser,
  initializeMockData,
  getUsersAndTheirActiveStatus,
  getUserProfile,
  updateUserStatus,
  getAllBookings,
  updateBookingStatus,
  getAllDevices,
  getDevicesByRoom,
  updateDeviceStatus,
  updateUserRole,
  getUserRoleHistory,
  getUsersForVerification,
  updateUserVerification
};