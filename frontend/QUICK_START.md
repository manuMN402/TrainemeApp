# TraineMe Frontend-Backend Integration Quick Start

## 🚀 Get Started in 5 Minutes

### Step 1: Set Environment Variables

**Frontend** (create `.env` in frontend folder):
```
REACT_APP_API_URL=http://localhost:3000/api
```

For React Native with physical device:
```
REACT_APP_API_URL=http://192.168.1.XXX:3000/api
```
(Replace XXX with your machine's IP)

### Step 2: Start the Backend

```bash
cd backend
npm install
npm start
```

You should see:
```
✅ Server running on http://localhost:3000
```

### Step 3: Set Up Frontend Providers

In your main App.js/index.js:

```jsx
import { AuthProvider } from './contexts/AuthContext';
import { TrainerProvider } from './contexts/TrainerContext';
import { BookingProvider } from './contexts/BookingContext';
import { AvailabilityProvider } from './contexts/AvailabilityContext';
import { ReviewProvider } from './contexts/ReviewContext';

export default function App() {
  return (
    <AuthProvider>
      <TrainerProvider>
        <BookingProvider>
          <AvailabilityProvider>
            <ReviewProvider>
              <YourApp />
            </ReviewProvider>
          </AvailabilityProvider>
        </BookingProvider>
      </TrainerProvider>
    </AuthProvider>
  );
}
```

### Step 4: Use in Your Screens

```jsx
import { useAuth } from './contexts/AuthContext';
import { useTrainer } from './contexts/TrainerContext';

export default function MyScreen() {
  const { login, user } = useAuth();
  const { searchTrainers, trainers } = useTrainer();
  
  // Your logic here
}
```

### Step 5: Test It Out

#### Register a User:
```jsx
const { register } = useAuth();

const response = await register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '1234567890',
  password: 'Secure123!',
  role: 'USER'
});
```

#### Login:
```jsx
const { login } = useAuth();

const response = await login('john@example.com', 'Secure123!');
console.log('User:', response.user);
console.log('Token:', response.token);
```

#### Search Trainers:
```jsx
const { searchTrainers } = useTrainer();

await searchTrainers(
  'Yoga',  // specialty
  20,      // minPrice
  100,     // maxPrice
  1,       // page
  10       // limit
);
```

#### Create Booking:
```jsx
const { createBooking } = useBooking();

const response = await createBooking({
  trainerId: 'trainer-123',
  sessionDate: '2026-02-15',
  startTime: '10:00',
  endTime: '11:00',
  notes: 'Beginner friendly'
});
```

---

## 📚 Complete API Reference

### Auth API
```jsx
// Register
api.auth.register({ firstName, lastName, email, phone, password, role })

// Login
api.auth.login({ email, password })

// Get profile
api.auth.getProfile(token)

// Update profile
api.auth.updateProfile({ firstName, lastName, phone, profileImage }, token)

// Get user by ID
api.auth.getUserById(userId)

// Update user by ID
api.auth.updateUserById(userId, userData, token)
```

### Trainer API
```jsx
// Create profile
api.trainer.createProfile(trainerData, token)

// Get profile
api.trainer.getProfile(trainerId)

// Update profile
api.trainer.updateProfile(trainerData, token)

// Delete profile
api.trainer.deleteProfile(token)

// Search trainers
api.trainer.getAllTrainers({ specialty, minPrice, maxPrice, page, limit })

// Search with helper
api.trainer.searchTrainers(specialty, minPrice, maxPrice, page, limit)
```

### Booking API
```jsx
// Create booking
api.booking.createBooking(bookingData, token)

// Get user bookings
api.booking.getUserBookings({ status, page, limit }, token)

// Get trainer bookings
api.booking.getTrainerBookings({ status, page, limit }, token)

// Update status
api.booking.updateBookingStatus(bookingId, status, token)

// Cancel booking
api.booking.cancelBooking(bookingId, token)
```

### Availability API
```jsx
// Add slot
api.availability.addAvailability(availabilityData, token)

// Get availabilities
api.availability.getAvailabilities(trainerId)

// Delete slot
api.availability.deleteAvailability(availabilityId, token)
```

### Review API
```jsx
// Create review
api.review.createReview(reviewData, token)

// Get reviews
api.review.getTrainerReviews(trainerId, { page, limit })

// Update review
api.review.updateReview(reviewId, reviewData, token)

// Delete review
api.review.deleteReview(reviewId, token)
```

---

## 🔥 Common Patterns

### Loading & Error Handling
```jsx
const { searchTrainers, trainers, loading } = useTrainer();

useEffect(() => {
  const search = async () => {
    try {
      await searchTrainers('Yoga', 20, 100);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  search();
}, []);

if (loading) return <ActivityIndicator />;

return <FlatList data={trainers} ... />;
```

### Form Submission
```jsx
const { createBooking, loading } = useBooking();
const [form, setForm] = useState({...});

const handleSubmit = async () => {
  try {
    await createBooking(form);
    Alert.alert('Success', 'Booking created!');
    navigation.goBack();
  } catch (error) {
    Alert.alert('Error', error.message);
  }
};

return (
  <TouchableOpacity 
    disabled={loading}
    onPress={handleSubmit}
  >
    <Text>{loading ? 'Creating...' : 'Create Booking'}</Text>
  </TouchableOpacity>
);
```

### User Dependent Operations
```jsx
const { user, token } = useAuth();

if (!token) {
  return <LoginScreen />;
}

// User is logged in, safe to make requests
```

### Role-Based UI
```jsx
const { user } = useAuth();

if (user?.role === 'TRAINER') {
  return <TrainerDashboard />;
}

return <UserDashboard />;
```

---

## ✅ Checklist

- [ ] Backend is running (`npm start` in backend folder)
- [ ] `.env` file created with API URL
- [ ] All contexts wrapped around your app
- [ ] Context imports added to screens
- [ ] First API call tested (e.g., login)
- [ ] Token is being stored/retrieved
- [ ] Error handling working properly

---

## 🐛 Troubleshooting

### "Cannot find module 'contexts/AuthContext'"
**Fix**: Check that context files exist in `frontend/src/contexts/`

### "API call returns 404"
**Fix**: Backend not running. Run `npm start` in backend folder.

### "CORS error"
**Fix**: Verify API URL in `.env` matches backend server address

### "Token not persisting"
**Fix**: Check AsyncStorage permissions in app.json

### "Login fails with 'Invalid credentials'"
**Fix**: Create an account first or check backend database

---

## 📖 Learn More

- **Full API Docs**: See `BACKEND_API_INTEGRATION.md`
- **Implementation Guide**: See `FRONTEND_INTEGRATION_GUIDE.md`
- **Complete Status**: See `INTEGRATION_COMPLETE.md`

---

## 💡 Pro Tips

1. **Always wrap requests in try-catch**
```jsx
try {
  await api.call();
} catch (error) {
  // Handle error
}
```

2. **Use loading states to prevent duplicate requests**
```jsx
const { loading } = useContext();
disabled={loading}
```

3. **Store token securely**
```jsx
// AuthContext handles this automatically with AsyncStorage
```

4. **Handle network errors gracefully**
```jsx
catch (error) {
  if (error.message.includes('network')) {
    Alert.alert('Network Error', 'Check your connection');
  }
}
```

5. **Validate user input before API calls**
```jsx
if (!email.includes('@')) {
  Alert.alert('Error', 'Invalid email');
  return;
}
```

---

## 🎯 Next: Replace Screens

Now that integration is ready, update your screens:

1. **LoginScreen** → Use API login
2. **RegisterScreen** → Use API register
3. **SearchTrainers** → Use useTrainer hook
4. **TrainerDetail** → Use getTrainerProfile
5. **BookingCard** → Use createBooking
6. **UserDashboard** → Use getUserBookings
7. **TrainerDashboard** → Use getTrainerBookings

Template examples are in `LoginScreen_API.jsx` and `RegisterScreen_API.jsx`

---

## 🎉 You're Ready!

Start integrating the API calls into your screens. Refer to the documentation files for detailed examples and patterns.

**Happy coding!** 🚀

---

*Last Updated: January 30, 2026*
*For detailed help, see the documentation files*
