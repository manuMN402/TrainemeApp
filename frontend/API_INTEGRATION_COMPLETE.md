# TraineMe App - API Integration Complete ✅

## Project Status
Both backend and frontend are now fully configured, running, and ready for testing!

---

## 🚀 Current Running Services

### Backend Server
- **Status**: ✅ Running
- **Address**: `http://192.168.0.228:3000`
- **Port**: 3000
- **Environment**: Development
- **Database**: PostgreSQL (configured in .env)

### Frontend Server
- **Status**: ✅ Running
- **Address**: `exp://192.168.0.228:8082`
- **Port**: 8082
- **Technology**: React Native with Expo

---

## 📡 API Integration Summary

### Configuration Fixed
✅ API Base URL updated to `http://192.168.0.228:3000/api` (uses your machine IP)
✅ Authentication middleware properly implemented with JWT token validation
✅ API service fully centralized in `frontend/src/services/apiService.js`

---

## 🔌 Backend API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/profile       - Get current user profile (requires auth)
PUT    /api/auth/profile       - Update user profile (requires auth)
GET    /api/auth/users/:userId - Get user by ID
PUT    /api/auth/users/:userId - Update user by ID (requires auth)
```

### Trainer Endpoints
```
POST   /api/trainers/profile           - Create trainer profile (requires auth, trainer)
GET    /api/trainers/profile/:trainerId - Get trainer profile details
PUT    /api/trainers/profile           - Update trainer profile (requires auth, trainer)
DELETE /api/trainers/profile           - Delete trainer profile (requires auth, trainer)
GET    /api/trainers/search            - Get all trainers with filters (optional)
```

**Filter Parameters for Search:**
- `specialty` - Filter by specialty (e.g., "Fitness", "Yoga")
- `minPrice` - Minimum hourly rate
- `maxPrice` - Maximum hourly rate
- `rating` - Minimum rating
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 10)

### Availability Endpoints
```
POST   /api/availability              - Add trainer availability (requires auth, trainer)
GET    /api/availability/:trainerId   - Get trainer availabilities
DELETE /api/availability/:availabilityId - Delete availability (requires auth, trainer)
```

### Booking Endpoints
```
POST   /api/bookings                   - Create new booking (requires auth, user)
GET    /api/bookings/user/history      - Get user bookings (requires auth, user)
GET    /api/bookings/trainer/requests  - Get trainer booking requests (requires auth, trainer)
PUT    /api/bookings/:bookingId/status - Update booking status (requires auth, trainer)
PUT    /api/bookings/:bookingId/cancel - Cancel booking (requires auth)
```

**Booking Status Values:**
- `Pending` - Awaiting trainer approval
- `Confirmed` - Trainer accepted the booking
- `Completed` - Session finished
- `Cancelled` - Booking cancelled

### Review Endpoints
```
POST   /api/reviews                 - Create review (requires auth)
GET    /api/reviews/trainer/:trainerId - Get trainer reviews
PUT    /api/reviews/:reviewId       - Update review (requires auth)
DELETE /api/reviews/:reviewId       - Delete review (requires auth)
```

---

## 🔐 Authentication Flow

### Token Management
1. User registers or logs in
2. Backend returns JWT token valid for 7 days
3. Token stored in AsyncStorage on mobile
4. Token sent in `Authorization: Bearer <token>` header for protected routes

### Middleware Checks
- `authMiddleware` - Verifies JWT token
- `isTrainer` - Checks if user has trainer profile
- `isUser` - Allows any authenticated user (regular users don't need trainer profile)

---

## 📊 Data Models

### User
```javascript
{
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  createdAt: datetime,
  updatedAt: datetime,
  trainerProfile: TrainerProfile | null
}
```

### TrainerProfile
```javascript
{
  id: string,
  userId: string,
  bio: string,
  specialty: string,
  experience: number,
  certification: string,
  certifications: string,
  experienceText: string,
  hourlyRate: number,
  profileImage: string,
  bannerImage: string,
  isVerified: boolean,
  isOnline: boolean,
  rating: number,
  reviewCount: number,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Booking
```javascript
{
  id: string,
  userId: string,
  trainerId: string,
  sessionDate: datetime,
  startTime: string,
  endTime: string,
  price: number,
  notes: string,
  status: string,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Availability
```javascript
{
  id: string,
  trainerId: string,
  day: string,
  startTime: string,
  endTime: string,
  createdAt: datetime,
  updatedAt: datetime
}
```

### Review
```javascript
{
  id: string,
  trainerId: string,
  userId: string,
  rating: number,
  comment: string,
  createdAt: datetime,
  updatedAt: datetime
}
```

---

## 🎯 Frontend API Service Usage

### Import the API Service
```javascript
import api from '../services/apiService';
```

### Available API Objects
- `api.auth` - Authentication methods
- `api.trainer` - Trainer profile methods
- `api.availability` - Availability methods
- `api.booking` - Booking methods
- `api.review` - Review methods

### Example: Register User
```javascript
try {
  const response = await api.auth.register({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '1234567890',
    password: 'SecurePass123'
  });
  
  console.log('User registered:', response.user);
  console.log('Token:', response.token);
} catch (error) {
  console.error('Registration failed:', error);
}
```

### Example: Get All Trainers
```javascript
try {
  const trainers = await api.trainer.getAllTrainers({
    specialty: 'Fitness',
    minPrice: 20,
    maxPrice: 100,
    page: 1,
    limit: 10
  });
  
  console.log('Trainers:', trainers);
} catch (error) {
  console.error('Failed to fetch trainers:', error);
}
```

### Example: Create Booking (with auth token)
```javascript
try {
  const booking = await api.booking.createBooking({
    trainerId: 'trainer_id_here',
    sessionDate: '2026-02-15',
    startTime: '10:00',
    endTime: '11:00',
    notes: 'Personal training session'
  }, authToken);
  
  console.log('Booking created:', booking);
} catch (error) {
  console.error('Failed to create booking:', error);
}
```

---

## 🧪 Testing the APIs

### Using Postman or cURL

#### Register User
```bash
curl -X POST http://192.168.0.228:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "SecurePass123"
  }'
```

#### Login User
```bash
curl -X POST http://192.168.0.228:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

#### Get User Profile (with token)
```bash
curl -X GET http://192.168.0.228:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📦 Project Structure

```
TrainemeApp/
├── backend/
│   ├── src/
│   │   ├── controllers/       # Route handlers
│   │   ├── middleware/        # Auth & error handling
│   │   ├── routes/            # API route definitions
│   │   ├── config/            # Configuration files
│   │   └── server.js          # Express server setup
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── services/          # API service layer
    │   ├── contexts/          # React contexts (Auth, etc)
    │   ├── screens/           # Screen components
    │   ├── components/        # Reusable components
    │   ├── navigation/        # Navigation setup
    │   └── styles/            # Style files
    ├── package.json
    └── app.json
```

---

## 🔧 Environment Setup

### Backend .env
```
DATABASE_URL=postgresql://user:password@localhost:5432/traineme
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://192.168.0.228:8082
```

### Frontend Configuration
- API URL: `http://192.168.0.228:3000/api`
- Automatically uses AsyncStorage for token persistence
- All API calls include proper error handling

---

## ✨ Key Features Implemented

✅ User registration and login with JWT authentication
✅ Trainer profile creation and management
✅ Availability scheduling for trainers
✅ Booking system with status management
✅ Review system for trainers
✅ Search and filter trainers
✅ Centralized API service with error handling
✅ Async token storage on mobile
✅ Proper CORS configuration
✅ Database relationships and constraints

---

## 🚨 Common Issues & Solutions

### Issue: "Network request failed"
**Solution**: Ensure backend is running on `http://192.168.0.228:3000` and frontend API URL is configured correctly.

### Issue: "No token provided"
**Solution**: Make sure you're logged in and the token is saved to AsyncStorage before accessing protected routes.

### Issue: "Only trainers can access this route"
**Solution**: Create a trainer profile first via the trainer onboarding process.

### Issue: CORS errors
**Solution**: Verify CORS_ORIGIN in backend .env matches your frontend address.

---

## 📝 Next Steps

1. **Test Registration**: Create a new user account
2. **Create Trainer Profile**: If user is a trainer, set up trainer details
3. **Test Bookings**: Create a booking from a user account
4. **Accept Bookings**: Accept bookings as a trainer
5. **Leave Reviews**: Leave reviews for completed sessions
6. **Search Trainers**: Test trainer search with filters

---

## 🛠️ Development Commands

### Backend
```bash
# Start server
npm start

# Start with nodemon (watch mode)
npm run dev

# Run database migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Seed database
npm run seed
```

### Frontend
```bash
# Start Expo
npm start

# Open Android emulator
npm run android

# Open iOS simulator
npm run ios

# Open web version
npm run web
```

---

## 📞 Support & Troubleshooting

For detailed endpoint documentation, see individual route files:
- Authentication: `backend/src/routes/authRoutes.js`
- Trainers: `backend/src/routes/trainerRoutes.js`
- Bookings: `backend/src/routes/bookingRoutes.js`
- Availability: `backend/src/routes/availabilityRoutes.js`
- Reviews: `backend/src/routes/reviewRoutes.js`

---

**Last Updated**: January 30, 2026
**Status**: ✅ All systems operational
