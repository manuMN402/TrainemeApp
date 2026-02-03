# TraineMe Integration - Visual Quick Reference

## 🎯 At a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                    TraineMe App Architecture                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Components/Screens                    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │ LoginScreen  │  │BookingCard   │  │UserDashboard │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓ uses                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              React Context Providers                     │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │AuthContext   │  │TrainerContext│  │BookingContext│   │   │
│  │  │useAuth()     │  │useTrainer()  │  │useBooking()  │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓ calls                               │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API Service Layer (apiService.js)           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │   │
│  │  │api.auth.     │  │api.trainer.  │  │api.booking.  │   │   │
│  │  │login()       │  │search()      │  │create()      │   │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓ HTTP REST                           │
├─────────────────────────────────────────────────────────────────┤
│                        Backend (Express)                         │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         API Routes & Controllers                         │   │
│  │  POST /auth/login      PUT /trainers/profile            │   │
│  │  GET /trainers/search  POST /bookings                   │   │
│  │  ... (21 total endpoints)                               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         Database (PostgreSQL via Prisma)                │   │
│  │                                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📚 Documentation Map

```
START HERE
    ↓
┌─────────────────────────────────────────┐
│ QUICK_START.md                          │ ← 5 min setup
│ - Environment setup                     │
│ - Basic examples                        │
│ - Common patterns                       │
└─────────────────────────────────────────┘
    ↓ Want to know details?
┌─────────────────────────────────────────┐
│ BACKEND_API_INTEGRATION.md              │ ← All API endpoints
│ - Request/response examples             │
│ - cURL testing commands                 │
│ - Error codes                           │
└─────────────────────────────────────────┘
    ↓ Want to implement?
┌─────────────────────────────────────────┐
│ FRONTEND_INTEGRATION_GUIDE.md           │ ← How to use
│ - Context usage                         │
│ - Complete examples                     │
│ - Best practices                        │
└─────────────────────────────────────────┘
    ↓ Want the big picture?
┌─────────────────────────────────────────┐
│ INTEGRATION_SUMMARY.md                  │ ← Architecture
│ - Data flow diagrams                    │
│ - File structure                        │
│ - Security features                     │
└─────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

```
User enters email & password
    ↓
LoginScreen calls: useAuth().login(email, password)
    ↓
AuthContext calls: api.auth.login({email, password})
    ↓
apiService sends: POST /auth/login with credentials
    ↓
Backend validates email & password
    ↓
Backend generates JWT token
    ↓
Backend returns: {user, token}
    ↓
AuthContext saves token to AsyncStorage
    ↓
AuthContext updates user state
    ↓
Component receives {user, token}
    ↓
Navigate to appropriate dashboard
    ↓
✅ User is logged in with token for future requests
```

---

## 🎯 Using Contexts - 3 Simple Steps

### Step 1: Import
```jsx
import { useAuth } from './contexts/AuthContext';
```

### Step 2: Call Hook
```jsx
const { user, token, login, logout } = useAuth();
```

### Step 3: Use Methods
```jsx
await login(email, password);
```

That's it! 🎉

---

## 📋 All Available Hooks

```
┌─────────────────────────────────────────┐
│ useAuth() from AuthContext              │
├─────────────────────────────────────────┤
│ Methods:                                │
│ - login(email, password)                │
│ - register(userData)                    │
│ - logout()                              │
│ - getProfile()                          │
│ - updateProfile(data)                   │
│                                         │
│ State:                                  │
│ - user                                  │
│ - token                                 │
│ - loading                               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ useTrainer() from TrainerContext        │
├─────────────────────────────────────────┤
│ Methods:                                │
│ - searchTrainers(...)                   │
│ - getTrainerProfile(id)                 │
│ - createTrainerProfile(data)            │
│ - updateTrainerProfile(data)            │
│ - deleteTrainerProfile()                │
│                                         │
│ State:                                  │
│ - trainers                              │
│ - currentTrainer                        │
│ - pagination                            │
│ - loading                               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ useBooking() from BookingContext        │
├─────────────────────────────────────────┤
│ Methods:                                │
│ - createBooking(data)                   │
│ - getUserBookings(filters)              │
│ - getTrainerBookings(filters)           │
│ - updateBookingStatus(id, status)       │
│ - cancelBooking(id)                     │
│                                         │
│ State:                                  │
│ - userBookings                          │
│ - trainerBookings                       │
│ - pagination                            │
│ - loading                               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ useAvailability() from AvailabilityCtx  │
├─────────────────────────────────────────┤
│ Methods:                                │
│ - addAvailability(data)                 │
│ - getAvailabilities(trainerId)          │
│ - deleteAvailability(id)                │
│                                         │
│ State:                                  │
│ - availabilities                        │
│ - loading                               │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ useReview() from ReviewContext          │
├─────────────────────────────────────────┤
│ Methods:                                │
│ - createReview(data)                    │
│ - getTrainerReviews(trainerId, filters) │
│ - updateReview(id, data)                │
│ - deleteReview(id)                      │
│                                         │
│ State:                                  │
│ - reviews                               │
│ - pagination                            │
│ - loading                               │
└─────────────────────────────────────────┘
```

---

## 🔄 Common Use Cases

### Use Case 1: Login User
```jsx
const { login } = useAuth();
await login('user@email.com', 'password');
```

### Use Case 2: Search Trainers
```jsx
const { searchTrainers } = useTrainer();
await searchTrainers('Yoga', 20, 100);
```

### Use Case 3: Create Booking
```jsx
const { createBooking } = useBooking();
await createBooking({
  trainerId: '123',
  sessionDate: '2026-02-15',
  startTime: '10:00',
  endTime: '11:00'
});
```

### Use Case 4: Accept Booking (Trainer)
```jsx
const { updateBookingStatus } = useBooking();
await updateBookingStatus(bookingId, 'Confirmed');
```

### Use Case 5: Leave Review
```jsx
const { createReview } = useReview();
await createReview({
  bookingId: '123',
  rating: 5,
  comment: 'Excellent session!'
});
```

---

## 📊 API Endpoints at a Glance

```
AUTHENTICATION (6 endpoints)
├── POST   /auth/register           Register new user
├── POST   /auth/login              Login user
├── GET    /auth/profile            Get current profile
├── PUT    /auth/profile            Update profile
├── GET    /auth/users/:id          Get user by ID
└── PUT    /auth/users/:id          Update user by ID

TRAINERS (5 endpoints)
├── POST   /trainers/profile        Create trainer profile
├── GET    /trainers/profile/:id    Get trainer
├── PUT    /trainers/profile        Update trainer
├── DELETE /trainers/profile        Delete trainer
└── GET    /trainers/search         Search trainers

BOOKINGS (5 endpoints)
├── POST   /bookings                Create booking
├── GET    /bookings/user/history   Get user bookings
├── GET    /bookings/trainer/requests Get trainer bookings
├── PUT    /bookings/:id/status     Update status
└── PUT    /bookings/:id/cancel     Cancel booking

AVAILABILITY (3 endpoints)
├── POST   /availability            Add slot
├── GET    /availability/:trainerId Get slots
└── DELETE /availability/:id        Delete slot

REVIEWS (4 endpoints)
├── POST   /reviews                 Create review
├── GET    /reviews/trainer/:id     Get reviews
├── PUT    /reviews/:id             Update review
└── DELETE /reviews/:id             Delete review

TOTAL: 21 endpoints
```

---

## 🚀 Implementation Timeline

```
Today: Setup & Learn
  ├─ Read QUICK_START.md
  ├─ Setup environment
  ├─ Start backend
  └─ Test first endpoint

Day 1: Basic Screens
  ├─ Update LoginScreen
  ├─ Update RegisterScreen
  └─ Test auth flows

Day 2-3: Trainer Features
  ├─ Implement SearchTrainer
  ├─ Implement TrainerDetail
  └─ Add trainer profile

Day 4-5: Booking Features
  ├─ Implement BookingCard
  ├─ Implement UserBookings
  └─ Implement TrainerRequests

Day 6-7: Additional Features
  ├─ Add Reviews
  ├─ Add Availability
  └─ Testing & bug fixes

Day 8: Deploy & Launch
  ├─ Final testing
  ├─ Deploy backend
  └─ Deploy frontend
```

---

## ✅ Testing Checklist

```
Authentication
  ☐ Register user
  ☐ Register trainer
  ☐ Login user
  ☐ Login trainer
  ☐ Get profile
  ☐ Update profile
  ☐ Logout

Trainers
  ☐ Create trainer profile
  ☐ Update trainer profile
  ☐ Search trainers
  ☐ Filter by specialty
  ☐ Filter by price
  ☐ Get trainer details

Bookings
  ☐ Create booking
  ☐ Get user bookings
  ☐ Get trainer requests
  ☐ Accept booking
  ☐ Cancel booking
  ☐ Pagination works

Availability
  ☐ Add availability
  ☐ Get availabilities
  ☐ Delete availability

Reviews
  ☐ Create review
  ☐ Get reviews
  ☐ Update review
  ☐ Delete review
```

---

## 🎯 Key Files to Know

```
MUST UNDERSTAND:
  ├─ apiService.js              ← How API calls work
  ├─ AuthContext.jsx            ← How auth works
  ├─ LoginScreen_API.jsx        ← Example screen

REFERENCE OFTEN:
  ├─ QUICK_START.md            ← Quick answers
  ├─ BACKEND_API_INTEGRATION.md ← API details
  ├─ FRONTEND_INTEGRATION_GUIDE ← How to implement

COPY PATTERNS FROM:
  ├─ TrainerContext.jsx        ← Context pattern
  ├─ BookingContext.jsx        ← Context pattern
  ├─ RegisterScreen_API.jsx    ← Screen pattern
```

---

## 💡 Pro Tips

```
✓ Always wrap API calls in try-catch
✓ Show loading states during requests
✓ Validate input before API calls
✓ Use constants for API URLs
✓ Handle errors with user-friendly messages
✓ Test with real device if possible
✓ Check backend console for errors
✓ Use browser DevTools for network debugging
```

---

## 🔗 Quick Links

| Need | File | Section |
|------|------|---------|
| Quick Start | QUICK_START.md | All |
| How to use hooks | FRONTEND_INTEGRATION_GUIDE.md | Using Contexts |
| API reference | BACKEND_API_INTEGRATION.md | API Endpoints |
| Example code | LoginScreen_API.jsx | Entire file |
| Architecture | INTEGRATION_SUMMARY.md | Data Flow |

---

## 📱 Screens to Update

Priority: **HIGH TO LOW**

```
HIGH PRIORITY
  1. LoginScreen
     ├─ Add useAuth hook
     ├─ Call login() on submit
     └─ Handle response

  2. RegisterScreen
     ├─ Add useAuth hook
     ├─ Call register() on submit
     └─ Handle response

MEDIUM PRIORITY
  3. SearchTrainer
     ├─ Add useTrainer hook
     ├─ Call searchTrainers()
     └─ Display results

  4. TrainerDetail
     ├─ Add useTrainer hook
     ├─ Get trainer profile
     └─ Show availability

  5. BookingCard
     ├─ Add useBooking hook
     ├─ Call createBooking()
     └─ Handle response

LOW PRIORITY
  6. UserDashboard
     ├─ Get user bookings
     └─ Display list

  7. TrainerDashboard
     ├─ Get trainer bookings
     └─ Display requests

  8. ReviewScreen
     ├─ Create/view reviews
     └─ Display ratings
```

---

## 🎉 You're All Set!

Everything is ready. Just:

1. ✅ Read QUICK_START.md
2. ✅ Start backend
3. ✅ Add contexts to App.js
4. ✅ Update screens one by one
5. ✅ Test features
6. ✅ Deploy!

---

**Status**: ✅ Complete
**Created**: Jan 30, 2026
**Last Updated**: Jan 30, 2026
