# TraineMe Backend API Integration Documentation

## Overview
This document provides a complete reference for all backend APIs and their integration with the frontend.

## Base URL
```
http://localhost:3000/api
```

## Environment Setup
Add to your `.env` file (or `.env.local` for frontend):
```
REACT_APP_API_URL=http://localhost:3000/api
```

---

## API Endpoints Reference

### Authentication Endpoints

#### 1. Register User/Trainer
- **Method**: POST
- **Endpoint**: `/auth/register`
- **Auth Required**: No
- **Body**:
```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "role": "USER" | "TRAINER"
}
```
- **Response**:
```json
{
  "message": "User registered successfully",
  "user": { "id", "email", "firstName", "lastName", "phone", "role" },
  "token": "jwt_token"
}
```

#### 2. Login
- **Method**: POST
- **Endpoint**: `/auth/login`
- **Auth Required**: No
- **Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**:
```json
{
  "message": "Login successful",
  "user": { "id", "email", "firstName", "lastName", "role", "trainerProfile?" },
  "token": "jwt_token"
}
```

#### 3. Get Current User Profile
- **Method**: GET
- **Endpoint**: `/auth/profile`
- **Auth Required**: Yes
- **Headers**: `Authorization: Bearer {token}`
- **Response**: User profile with trainer details if applicable

#### 4. Update User Profile
- **Method**: PUT
- **Endpoint**: `/auth/profile`
- **Auth Required**: Yes
- **Body**:
```json
{
  "firstName": "string?",
  "lastName": "string?",
  "phone": "string?",
  "profileImage": "string?"
}
```

#### 5. Get User by ID
- **Method**: GET
- **Endpoint**: `/auth/users/:userId`
- **Auth Required**: No

#### 6. Update User by ID
- **Method**: PUT
- **Endpoint**: `/auth/users/:userId`
- **Auth Required**: Yes (owner only)

---

### Trainer Endpoints

#### 1. Create Trainer Profile
- **Method**: POST
- **Endpoint**: `/trainers/profile`
- **Auth Required**: Yes (TRAINER role)
- **Body**:
```json
{
  "bio": "string",
  "specialty": "string",
  "experience": "number",
  "certification": "string",
  "certifications": "string[]",
  "experienceText": "string",
  "hourlyRate": "number",
  "profileImage": "string?",
  "bannerImage": "string?",
  "isVerified": "boolean?",
  "isOnline": "boolean?"
}
```

#### 2. Get Trainer Profile
- **Method**: GET
- **Endpoint**: `/trainers/profile/:trainerId`
- **Auth Required**: No
- **Response**: Trainer profile with user details and availabilities

#### 3. Update Trainer Profile
- **Method**: PUT
- **Endpoint**: `/trainers/profile`
- **Auth Required**: Yes (TRAINER role)
- **Body**: Same as Create (all fields optional)

#### 4. Delete Trainer Profile
- **Method**: DELETE
- **Endpoint**: `/trainers/profile`
- **Auth Required**: Yes (TRAINER role)

#### 5. Get All Trainers (Search)
- **Method**: GET
- **Endpoint**: `/trainers/search`
- **Auth Required**: No
- **Query Parameters**:
  - `specialty`: string (search by specialty)
  - `minPrice`: number (filter by minimum hourly rate)
  - `maxPrice`: number (filter by maximum hourly rate)
  - `rating`: number (filter by minimum rating)
  - `page`: number (default: 1)
  - `limit`: number (default: 10)
- **Response**:
```json
{
  "trainers": [],
  "pagination": { "total", "page", "limit", "pages" }
}
```

---

### Availability Endpoints

#### 1. Add Availability
- **Method**: POST
- **Endpoint**: `/availability`
- **Auth Required**: Yes (TRAINER role)
- **Body**:
```json
{
  "day": "string (e.g., 'Monday')",
  "startTime": "string (e.g., '09:00')",
  "endTime": "string (e.g., '17:00')"
}
```

#### 2. Get Availabilities
- **Method**: GET
- **Endpoint**: `/availability/:trainerId`
- **Auth Required**: No
- **Response**: Array of availability slots

#### 3. Delete Availability
- **Method**: DELETE
- **Endpoint**: `/availability/:availabilityId`
- **Auth Required**: Yes (TRAINER role, owner only)

---

### Booking Endpoints

#### 1. Create Booking
- **Method**: POST
- **Endpoint**: `/bookings`
- **Auth Required**: Yes (USER role)
- **Body**:
```json
{
  "trainerId": "string",
  "sessionDate": "ISO Date string",
  "startTime": "string (e.g., '10:00')",
  "endTime": "string (e.g., '11:00')",
  "notes": "string?"
}
```

#### 2. Get User Bookings
- **Method**: GET
- **Endpoint**: `/bookings/user/history`
- **Auth Required**: Yes (USER role)
- **Query Parameters**:
  - `status`: "Pending" | "Confirmed" | "Completed" | "Cancelled"
  - `page`: number (default: 1)
  - `limit`: number (default: 10)

#### 3. Get Trainer Bookings
- **Method**: GET
- **Endpoint**: `/bookings/trainer/requests`
- **Auth Required**: Yes (TRAINER role)
- **Query Parameters**:
  - `status`: "Pending" | "Confirmed" | "Completed" | "Cancelled"
  - `page`: number (default: 1)
  - `limit`: number (default: 10)

#### 4. Update Booking Status
- **Method**: PUT
- **Endpoint**: `/bookings/:bookingId/status`
- **Auth Required**: Yes (TRAINER role, owner only)
- **Body**:
```json
{
  "status": "Pending" | "Confirmed" | "Completed" | "Cancelled"
}
```

#### 5. Cancel Booking
- **Method**: PUT
- **Endpoint**: `/bookings/:bookingId/cancel`
- **Auth Required**: Yes
- **Body**: {} (empty)

---

### Review Endpoints

#### 1. Create Review
- **Method**: POST
- **Endpoint**: `/reviews`
- **Auth Required**: Yes
- **Body**:
```json
{
  "bookingId": "string",
  "rating": "number (1-5)",
  "comment": "string?"
}
```

#### 2. Get Trainer Reviews
- **Method**: GET
- **Endpoint**: `/reviews/trainer/:trainerId`
- **Auth Required**: No
- **Query Parameters**:
  - `page`: number (default: 1)
  - `limit`: number (default: 10)

#### 3. Update Review
- **Method**: PUT
- **Endpoint**: `/reviews/:reviewId`
- **Auth Required**: Yes (owner only)
- **Body**:
```json
{
  "rating": "number?",
  "comment": "string?"
}
```

#### 4. Delete Review
- **Method**: DELETE
- **Endpoint**: `/reviews/:reviewId`
- **Auth Required**: Yes (owner only)

---

## Usage Examples

### Frontend API Service Usage

```javascript
import api from './services/apiService';

// Authentication
const loginResponse = await api.auth.login({
  email: 'user@example.com',
  password: 'password123'
});
const token = loginResponse.token;

// Store token in localStorage or AsyncStorage
localStorage.setItem('authToken', token);

// Get current user
const user = await api.auth.getProfile(token);

// Search trainers
const trainers = await api.trainer.searchTrainers(
  'Yoga', // specialty
  20,      // minPrice
  100,     // maxPrice
  1,       // page
  10       // limit
);

// Create booking
const booking = await api.booking.createBooking({
  trainerId: 'trainer123',
  sessionDate: '2026-02-15',
  startTime: '10:00',
  endTime: '11:00',
  notes: 'Beginner friendly'
}, token);

// Get user bookings
const userBookings = await api.booking.getUserBookings({
  status: 'Confirmed',
  page: 1,
  limit: 10
}, token);

// Create review
const review = await api.review.createReview({
  bookingId: 'booking123',
  rating: 5,
  comment: 'Great session!'
}, token);
```

---

## Error Handling

All API calls include error handling. Errors are thrown with descriptive messages.

```javascript
try {
  const result = await api.auth.login(credentials);
} catch (error) {
  console.error('Login failed:', error.message);
  // Handle error (show toast, update UI, etc.)
}
```

---

## Authentication Token Management

Implement token storage and refresh:

```javascript
// In a context or store
const saveToken = (token) => {
  localStorage.setItem('authToken', token);
  // Or for React Native:
  // AsyncStorage.setItem('authToken', token);
};

const getToken = () => {
  return localStorage.getItem('authToken');
  // Or for React Native:
  // return AsyncStorage.getItem('authToken');
};

const clearToken = () => {
  localStorage.removeItem('authToken');
};
```

---

## Common Response Codes

- `200 OK` - Request succeeded
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid input data
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - User doesn't have permission
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists (e.g., duplicate email)
- `500 Internal Server Error` - Server error

---

## Testing the APIs

Use Postman or cURL to test endpoints:

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123",
    "role": "USER"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get profile (with token)
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Next Steps

1. ✅ Backend API routes created and documented
2. ✅ Frontend API service layer created
3. Integrate API calls in frontend screens:
   - LoginScreen.jsx
   - RegisterScreen.jsx
   - TrainerRegisterScreen.jsx
   - SearchTrainer.jsx
   - TrainerDetail.jsx
   - BookingCard.jsx
   - UserDashboard.jsx
   - TrainerDashboard.jsx
4. Implement token storage and retrieval
5. Add error handling and loading states
6. Test all endpoints
