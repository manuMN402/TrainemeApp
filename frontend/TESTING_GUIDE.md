# TraineMe App - Testing Guide

## 🎬 Quick Start - Test the Application

### Current Status
- ✅ Backend running at `http://192.168.0.228:3000`
- ✅ Frontend running at `exp://192.168.0.228:8082`
- ✅ All APIs integrated and configured

---

## 📱 Testing on Mobile/Emulator

### 1. Open Expo Go App
1. Download Expo Go from App Store or Play Store
2. Open Expo Go
3. Scan the QR code shown in your terminal
4. App will load

### 2. Test Registration
1. Navigate to Register screen
2. Enter test data:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Phone: `1234567890`
   - Password: `TestPass123`
3. Click Register
4. Should see success message and navigate to next screen

### 3. Test Login
1. Navigate to Login screen
2. Enter credentials from registration:
   - Email: `john@example.com`
   - Password: `TestPass123`
3. Click Login
4. Should navigate to home/dashboard

---

## 🌐 Testing via Browser

### Access Web Version
```bash
# In terminal, press 'w' to open web version
```

Or navigate to: `http://localhost:8082`

---

## 🔍 API Testing with cURL/Postman

### Test 1: Register User
```bash
curl -X POST http://192.168.0.228:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "password": "Password123"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id_here",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "phone": "9876543210"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Test 2: Login User
```bash
curl -X POST http://192.168.0.228:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "Password123"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": "user_id_here",
    "email": "jane@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "trainerProfile": null
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### Test 3: Get User Profile (Requires Authentication)
```bash
# Replace TOKEN with the token from login response
curl -X GET http://192.168.0.228:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response:**
```json
{
  "id": "user_id_here",
  "email": "jane@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "9876543210",
  "trainerProfile": null
}
```

---

### Test 4: Create Trainer Profile (Requires Auth)
```bash
curl -X POST http://192.168.0.228:3000/api/trainers/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "bio": "Professional fitness trainer with 5 years experience",
    "specialty": "Fitness",
    "experience": 5,
    "certification": "NASM CPT",
    "hourlyRate": 50,
    "experienceText": "5 years in fitness training",
    "isVerified": true,
    "isOnline": true
  }'
```

**Expected Response:**
```json
{
  "message": "Trainer profile created successfully",
  "trainerProfile": {
    "id": "trainer_id_here",
    "userId": "user_id_here",
    "bio": "Professional fitness trainer with 5 years experience",
    "specialty": "Fitness",
    "experience": 5,
    "hourlyRate": 50,
    "isVerified": true,
    "isOnline": true,
    "rating": 0,
    "reviewCount": 0
  }
}
```

---

### Test 5: Get All Trainers
```bash
curl -X GET "http://192.168.0.228:3000/api/trainers/search?specialty=Fitness&minPrice=30&maxPrice=100&page=1&limit=10"
```

**Expected Response:**
```json
{
  "trainers": [
    {
      "id": "trainer_id_here",
      "bio": "Professional fitness trainer...",
      "specialty": "Fitness",
      "experience": 5,
      "hourlyRate": 50,
      "rating": 0,
      "user": {
        "id": "user_id_here",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com"
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### Test 6: Add Availability (Trainer Only)
```bash
curl -X POST http://192.168.0.228:3000/api/availability \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TRAINER_TOKEN" \
  -d '{
    "day": "Monday",
    "startTime": "09:00",
    "endTime": "17:00"
  }'
```

**Expected Response:**
```json
{
  "message": "Availability added successfully",
  "availability": {
    "id": "availability_id_here",
    "trainerId": "trainer_id_here",
    "day": "Monday",
    "startTime": "09:00",
    "endTime": "17:00"
  }
}
```

---

### Test 7: Create Booking (User Only)
```bash
curl -X POST http://192.168.0.228:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "trainerId": "trainer_id_here",
    "sessionDate": "2026-02-15",
    "startTime": "10:00",
    "endTime": "11:00",
    "notes": "Personal training session"
  }'
```

**Expected Response:**
```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "booking_id_here",
    "userId": "user_id_here",
    "trainerId": "trainer_id_here",
    "sessionDate": "2026-02-15T00:00:00.000Z",
    "startTime": "10:00",
    "endTime": "11:00",
    "price": 50,
    "status": "Pending",
    "trainer": {
      "user": {
        "firstName": "Jane",
        "lastName": "Smith"
      }
    }
  }
}
```

---

### Test 8: Get User Bookings
```bash
curl -X GET "http://192.168.0.228:3000/api/bookings/user/history?status=Pending&page=1&limit=10" \
  -H "Authorization: Bearer USER_TOKEN"
```

**Expected Response:**
```json
{
  "bookings": [
    {
      "id": "booking_id_here",
      "userId": "user_id_here",
      "trainerId": "trainer_id_here",
      "sessionDate": "2026-02-15T00:00:00.000Z",
      "startTime": "10:00",
      "endTime": "11:00",
      "status": "Pending",
      "trainer": {
        "user": {
          "firstName": "Jane",
          "lastName": "Smith"
        }
      }
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### Test 9: Accept Booking (Trainer Only)
```bash
curl -X PUT http://192.168.0.228:3000/api/bookings/BOOKING_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TRAINER_TOKEN" \
  -d '{
    "status": "Confirmed"
  }'
```

**Expected Response:**
```json
{
  "message": "Booking status updated successfully",
  "booking": {
    "id": "booking_id_here",
    "status": "Confirmed"
  }
}
```

---

### Test 10: Create Review
```bash
curl -X POST http://192.168.0.228:3000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer USER_TOKEN" \
  -d '{
    "trainerId": "trainer_id_here",
    "rating": 5,
    "comment": "Great trainer! Very professional and knowledgeable."
  }'
```

**Expected Response:**
```json
{
  "message": "Review created successfully",
  "review": {
    "id": "review_id_here",
    "trainerId": "trainer_id_here",
    "userId": "user_id_here",
    "rating": 5,
    "comment": "Great trainer! Very professional and knowledgeable."
  }
}
```

---

## 🧪 Testing Checklist

- [ ] User Registration
- [ ] User Login
- [ ] Get User Profile
- [ ] Create Trainer Profile
- [ ] Search Trainers
- [ ] Add Availability
- [ ] Create Booking
- [ ] Get User Bookings
- [ ] Update Booking Status (Trainer)
- [ ] Cancel Booking
- [ ] Create Review
- [ ] Get Trainer Reviews

---

## 📊 Sample Test Data

### Test User 1 (Regular User)
- Email: `user@example.com`
- Password: `UserPass123`
- Name: John Doe

### Test User 2 (Trainer)
- Email: `trainer@example.com`
- Password: `TrainerPass123`
- Name: Jane Smith
- Specialty: Fitness
- Hourly Rate: $50

---

## 🐛 Debugging Tips

### Enable Console Logs
Open developer console in Expo to see API requests and responses.

### Check Network Tab
View HTTP requests and responses in Expo debugger.

### Verify Token
Token should be in format: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Common Errors
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - User doesn't have required role
- `404 Not Found` - Resource doesn't exist
- `400 Bad Request` - Missing or invalid request data

---

## 📈 Performance Monitoring

### Backend Response Times
- Auth endpoints: < 200ms
- Trainer search: < 500ms (depends on database size)
- Booking operations: < 300ms

### Frontend Load Times
- App startup: < 3 seconds
- Screen transitions: < 1 second
- API calls: < 2 seconds

---

## ✅ Verification Checklist

- [x] Backend running on port 3000
- [x] Frontend running on port 8082
- [x] API Base URL configured correctly
- [x] JWT authentication implemented
- [x] All routes accessible
- [x] Database connected
- [x] CORS enabled
- [x] Error handling in place

---

**Happy Testing! 🎉**
