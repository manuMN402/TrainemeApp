/**
 * TraineMe Backend API Service
 * Centralized API calls for all backend endpoints
 */

// Use PC's IP for mobile/Expo testing
const API_BASE_URL = 'http://192.168.0.228:3000/api';
const API_TIMEOUT = 15000; // 15 second timeout

// Helper function to handle requests with timeout
const apiCall = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    // Create an AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    console.log(`[API] ${method} ${endpoint} - Starting request`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log(`[API] ${method} ${endpoint} - Response status: ${response.status}`);

    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error(`[API] Unexpected response type: ${contentType}, body: ${text}`);
      throw new Error(`Invalid response format: ${contentType}`);
    }

    if (!response.ok) {
      console.error(`[API] Error response:`, data);
      throw new Error(data.error || data.message || `HTTP Error: ${response.status}`);
    }

    console.log(`[API] ${method} ${endpoint} - Success`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`API Timeout [${method} ${endpoint}]: Request took longer than ${API_TIMEOUT}ms`);
      throw new Error(`Request timeout. Please check your connection and try again.`);
    }
    console.error(`API Error [${method} ${endpoint}]:`, error.message || error);
    throw error;
  }
};

// =============================================
// AUTH ENDPOINTS
// =============================================

export const authAPI = {
  /**
   * Register user or trainer
   * POST /api/auth/register
   */
  register: async (userData) => {
    return apiCall('/auth/register', 'POST', userData);
  },

  /**
   * Login user
   * POST /api/auth/login
   * Note: Login endpoint appears to be in controller but not in routes file
   * We need to add this to authRoutes.js or use register response
   */
  login: async (credentials) => {
    // If login is not exposed in routes, this would need to be added
    return apiCall('/auth/login', 'POST', credentials);
  },

  /**
   * Get current user profile
   * GET /api/auth/profile (requires token)
   */
  getProfile: async (token) => {
    return apiCall('/auth/profile', 'GET', null, token);
  },

  /**
   * Update user profile
   * PUT /api/auth/profile (requires token)
   */
  updateProfile: async (userData, token) => {
    return apiCall('/auth/profile', 'PUT', userData, token);
  },

  /**
   * Get user by ID
   * GET /api/auth/users/:userId
   */
  getUserById: async (userId) => {
    return apiCall(`/auth/users/${userId}`, 'GET');
  },

  /**
   * Update user by ID
   * PUT /api/auth/users/:userId (requires token)
   */
  updateUserById: async (userId, userData, token) => {
    return apiCall(`/auth/users/${userId}`, 'PUT', userData, token);
  },
};

// =============================================
// TRAINER ENDPOINTS
// =============================================

export const trainerAPI = {
  /**
   * Create trainer profile
   * POST /api/trainers/profile (requires token, isTrainer)
   */
  createProfile: async (trainerData, token) => {
    return apiCall('/trainers/profile', 'POST', trainerData, token);
  },

  /**
   * Get trainer profile
   * GET /api/trainers/profile/:trainerId
   */
  getProfile: async (trainerId) => {
    return apiCall(`/trainers/profile/${trainerId}`, 'GET');
  },

  /**
   * Update trainer profile
   * PUT /api/trainers/profile (requires token, isTrainer)
   */
  updateProfile: async (trainerData, token) => {
    return apiCall('/trainers/profile', 'PUT', trainerData, token);
  },

  /**
   * Delete trainer profile
   * DELETE /api/trainers/profile (requires token, isTrainer)
   */
  deleteProfile: async (token) => {
    return apiCall('/trainers/profile', 'DELETE', null, token);
  },

  /**
   * Get all trainers with filters
   * GET /api/trainers/search?specialty=&minPrice=&maxPrice=&rating=&page=&limit=
   */
  getAllTrainers: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/trainers/search${params ? '?' + params : ''}`, 'GET');
  },

  /**
   * Search trainers with specific criteria
   */
  searchTrainers: async (specialty, minPrice, maxPrice, page = 1, limit = 10) => {
    return trainerAPI.getAllTrainers({
      specialty,
      minPrice,
      maxPrice,
      page,
      limit,
    });
  },
};

// =============================================
// AVAILABILITY ENDPOINTS
// =============================================

export const availabilityAPI = {
  /**
   * Add trainer availability
   * POST /api/availability (requires token, isTrainer)
   */
  addAvailability: async (availabilityData, token) => {
    return apiCall('/availability', 'POST', availabilityData, token);
  },

  /**
   * Get trainer availabilities
   * GET /api/availability/:trainerId
   */
  getAvailabilities: async (trainerId) => {
    return apiCall(`/availability/${trainerId}`, 'GET');
  },

  /**
   * Delete availability slot
   * DELETE /api/availability/:availabilityId (requires token, isTrainer)
   */
  deleteAvailability: async (availabilityId, token) => {
    return apiCall(`/availability/${availabilityId}`, 'DELETE', null, token);
  },
};

// =============================================
// BOOKING ENDPOINTS
// =============================================

export const bookingAPI = {
  /**
   * Create new booking
   * POST /api/bookings (requires token, isUser)
   */
  createBooking: async (bookingData, token) => {
    return apiCall('/bookings', 'POST', bookingData, token);
  },

  /**
   * Get user bookings
   * GET /api/bookings/user/history?status=&page=&limit= (requires token, isUser)
   */
  getUserBookings: async (filters = {}, token) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/bookings/user/history${params ? '?' + params : ''}`, 'GET', null, token);
  },

  /**
   * Get trainer booking requests
   * GET /api/bookings/trainer/requests?status=&page=&limit= (requires token, isTrainer)
   */
  getTrainerBookings: async (filters = {}, token) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/bookings/trainer/requests${params ? '?' + params : ''}`, 'GET', null, token);
  },

  /**
   * Update booking status
   * PUT /api/bookings/:bookingId/status (requires token, isTrainer)
   */
  updateBookingStatus: async (bookingId, status, token) => {
    return apiCall(`/bookings/${bookingId}/status`, 'PUT', { status }, token);
  },

  /**
   * Cancel booking
   * PUT /api/bookings/:bookingId/cancel (requires token)
   */
  cancelBooking: async (bookingId, token) => {
    return apiCall(`/bookings/${bookingId}/cancel`, 'PUT', {}, token);
  },
};

// =============================================
// REVIEW ENDPOINTS
// =============================================

export const reviewAPI = {
  /**
   * Create review
   * POST /api/reviews (requires token)
   */
  createReview: async (reviewData, token) => {
    return apiCall('/reviews', 'POST', reviewData, token);
  },

  /**
   * Get trainer reviews
   * GET /api/reviews/trainer/:trainerId?page=&limit=
   */
  getTrainerReviews: async (trainerId, filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/reviews/trainer/${trainerId}${params ? '?' + params : ''}`, 'GET');
  },

  /**
   * Update review
   * PUT /api/reviews/:reviewId (requires token)
   */
  updateReview: async (reviewId, reviewData, token) => {
    return apiCall(`/reviews/${reviewId}`, 'PUT', reviewData, token);
  },

  /**
   * Delete review
   * DELETE /api/reviews/:reviewId (requires token)
   */
  deleteReview: async (reviewId, token) => {
    return apiCall(`/reviews/${reviewId}`, 'DELETE', null, token);
  },
};

// =============================================
// COMBINED API EXPORTS
// =============================================

export const api = {
  auth: authAPI,
  trainer: trainerAPI,
  availability: availabilityAPI,
  booking: bookingAPI,
  review: reviewAPI,
};

export default api;
