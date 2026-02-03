/**
 * TraineMe Backend API Service
 * Centralized API calls for all backend endpoints
 *
 * ENVIRONMENT NOTES:
 * - iOS Simulator / Expo Web → http://localhost:3000
 * - Android Emulator → http://10.0.2.2:3000
 * - Real Phone (Expo Go) → http://YOUR_PC_IP:3000
 */

const API_BASE_URL = 'http://192.168.0.78:3000';
const API_TIMEOUT = 15000; // 15 seconds

// ============================
// CORE API CALL HELPER
// ============================
const apiCall = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    console.log(`[API] ${method} ${endpoint} - Starting request`);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    console.log(
      `[API] ${method} ${endpoint} - Response status: ${response.status}`
    );

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('[API] Invalid response type:', contentType, text);
      throw new Error('Invalid response format');
    }

    const data = await response.json();

    if (!response.ok) {
      console.error('[API] Error response:', data);
      const err = new Error(
        data?.error || data?.message || `HTTP Error ${response.status}`
      );
      // attach status and original body for callers that need to react to 401/403
      err.status = response.status;
      err.response = data;
      throw err;
    }

    console.log(`[API] ${method} ${endpoint} - Success`);
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`API Timeout [${method} ${endpoint}]`);
      throw new Error('Request timeout. Please try again.');
    }

    console.error(
      `[API] ${method} ${endpoint} - Failed`,
      error.message || error
    );
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

// ============================
// SYSTEM / HEALTH
// ============================
export const systemAPI = {
  health: () => apiCall('/health'),
};

// ============================
// AUTH
// ============================
export const authAPI = {
  register: (data) => apiCall('/api/auth/register', 'POST', data),
  login: (data) => apiCall('/api/auth/login', 'POST', data),
  getProfile: (token) => apiCall('/api/auth/profile', 'GET', null, token),
  updateProfile: (data, token) =>
    apiCall('/api/auth/profile', 'PUT', data, token),
  getUserById: (id) => apiCall(`/api/auth/users/${id}`),
  updateUserById: (id, data, token) =>
    apiCall(`/api/auth/users/${id}`, 'PUT', data, token),
};

// ============================
// TRAINERS
// ============================
export const trainerAPI = {
  createProfile: (data, token) =>
    apiCall('/api/trainers/profile', 'POST', data, token),
  getProfile: (id) => apiCall(`/api/trainers/profile/${id}`),
  updateProfile: (data, token) =>
    apiCall('/api/trainers/profile', 'PUT', data, token),
  deleteProfile: (token) =>
    apiCall('/api/trainers/profile', 'DELETE', null, token),
  getAllTrainers: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(`/api/trainers/search${params ? `?${params}` : ''}`);
  },
};

// ============================
// AVAILABILITY
// ============================
export const availabilityAPI = {
  addAvailability: (data, token) =>
    apiCall('/api/availability', 'POST', data, token),
  getAvailabilities: (trainerId) =>
    apiCall(`/api/availability/${trainerId}`),
  deleteAvailability: (id, token) =>
    apiCall(`/api/availability/${id}`, 'DELETE', null, token),
};

// ============================
// BOOKINGS
// ============================
export const bookingAPI = {
  createBooking: (data, token) =>
    apiCall('/api/bookings', 'POST', data, token),

  getUserBookings: (filters = {}, token) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(
      `/api/bookings/user/history${params ? `?${params}` : ''}`,
      'GET',
      null,
      token
    );
  },

  getTrainerBookings: (filters = {}, token) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(
      `/api/bookings/trainer/requests${params ? `?${params}` : ''}`,
      'GET',
      null,
      token
    );
  },

  updateBookingStatus: (id, status, token) =>
    apiCall(`/api/bookings/${id}/status`, 'PUT', { status }, token),

  cancelBooking: (id, token) =>
    apiCall(`/api/bookings/${id}/cancel`, 'PUT', {}, token),
};

// ============================
// REVIEWS
// ============================
export const reviewAPI = {
  createReview: (data, token) =>
    apiCall('/api/reviews', 'POST', data, token),

  getTrainerReviews: (trainerId, filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return apiCall(
      `/api/reviews/trainer/${trainerId}${params ? `?${params}` : ''}`
    );
  },

  updateReview: (id, data, token) =>
    apiCall(`/api/reviews/${id}`, 'PUT', data, token),

  deleteReview: (id, token) =>
    apiCall(`/api/reviews/${id}`, 'DELETE', null, token),
};

// ============================
// COMBINED EXPORT
// ============================
export const api = {
  system: systemAPI,
  auth: authAPI,
  trainer: trainerAPI,
  availability: availabilityAPI,
  booking: bookingAPI,
  review: reviewAPI,
};

export default api;
