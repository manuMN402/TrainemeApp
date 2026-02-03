# Frontend-Backend Integration Guide

## Overview
This guide explains how to use the API service and context providers to connect the frontend with the backend APIs.

## Table of Contents
1. [Setup](#setup)
2. [Authentication Context](#authentication-context)
3. [Other Contexts](#other-contexts)
4. [Using Contexts in Screens](#using-contexts-in-screens)
5. [Example Implementations](#example-implementations)

---

## Setup

### 1. Wrap App with Providers

In your main `App.js` or `index.js`, wrap your app with all providers:

```jsx
import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { TrainerProvider } from './contexts/TrainerContext';
import { BookingProvider } from './contexts/BookingContext';
import { AvailabilityProvider } from './contexts/AvailabilityContext';
import { ReviewProvider } from './contexts/ReviewContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <AuthProvider>
      <TrainerProvider>
        <BookingProvider>
          <AvailabilityProvider>
            <ReviewProvider>
              <AppNavigator />
            </ReviewProvider>
          </AvailabilityProvider>
        </BookingProvider>
      </TrainerProvider>
    </AuthProvider>
  );
}
```

### 2. Environment Setup

Create `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:3000/api
```

For React Native (frontend), add to `app.json` or create `.env`:
```
REACT_APP_API_URL=http://192.168.1.100:3000/api
```
(Replace IP with your machine's actual IP for physical devices)

---

## Authentication Context

### Usage in Components

```jsx
import { useAuth } from '../contexts/AuthContext';

export default function MyScreen() {
  const { user, token, login, register, logout, loading } = useAuth();

  // Your component code
}
```

### Available Methods

#### Login
```jsx
const { login } = useAuth();

const handleLogin = async () => {
  try {
    const response = await login('user@example.com', 'password123');
    console.log('Logged in user:', response.user);
    // Token is automatically saved
  } catch (error) {
    Alert.alert('Login Failed', error.message);
  }
};
```

#### Register
```jsx
const { register } = useAuth();

const handleRegister = async () => {
  try {
    const response = await register({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '1234567890',
      password: 'SecurePass123',
      role: 'USER' // or 'TRAINER'
    });
    console.log('Registered user:', response.user);
  } catch (error) {
    Alert.alert('Registration Failed', error.message);
  }
};
```

#### Get Current User Profile
```jsx
const { getProfile, token } = useAuth();

useEffect(() => {
  const fetchProfile = async () => {
    try {
      const profile = await getProfile();
      console.log('User profile:', profile);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };
  
  if (token) {
    fetchProfile();
  }
}, [token]);
```

#### Update Profile
```jsx
const { updateProfile } = useAuth();

const handleUpdateProfile = async () => {
  try {
    const response = await updateProfile({
      firstName: 'Jane',
      profileImage: 'image_url'
    });
    console.log('Profile updated:', response);
  } catch (error) {
    Alert.alert('Update Failed', error.message);
  }
};
```

#### Logout
```jsx
const { logout } = useAuth();

const handleLogout = async () => {
  await logout();
  // Navigate to login screen
  navigation.reset({
    index: 0,
    routes: [{ name: 'Login' }]
  });
};
```

---

## Other Contexts

### Trainer Context

```jsx
import { useTrainer } from '../contexts/TrainerContext';

const MyTrainerScreen = () => {
  const { 
    trainers, 
    currentTrainer, 
    loading, 
    searchTrainers,
    getTrainerProfile,
    createTrainerProfile,
    updateTrainerProfile
  } = useTrainer();

  // Search trainers
  useEffect(() => {
    const search = async () => {
      try {
        await searchTrainers(
          'Yoga',  // specialty
          20,      // minPrice
          100,     // maxPrice
          1,       // page
          10       // limit
        );
      } catch (error) {
        console.error('Search failed:', error);
      }
    };
    search();
  }, []);

  // Create trainer profile (TRAINER role)
  const handleCreateProfile = async () => {
    try {
      await createTrainerProfile({
        bio: 'Experienced yoga instructor',
        specialty: 'Yoga',
        experience: 5,
        hourlyRate: 50,
        certification: 'Certified Yoga Instructor'
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      {loading && <ActivityIndicator />}
      {trainers.map((trainer) => (
        <TrainerCard key={trainer.id} trainer={trainer} />
      ))}
    </View>
  );
};
```

### Booking Context

```jsx
import { useBooking } from '../contexts/BookingContext';

const BookingScreen = () => {
  const {
    userBookings,
    trainerBookings,
    createBooking,
    getUserBookings,
    getTrainerBookings,
    updateBookingStatus,
    cancelBooking,
    loading
  } = useBooking();

  // Fetch user bookings
  useEffect(() => {
    const fetch = async () => {
      try {
        await getUserBookings({ status: 'Confirmed' });
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };
    fetch();
  }, []);

  // Create booking
  const handleCreateBooking = async () => {
    try {
      const response = await createBooking({
        trainerId: 'trainer123',
        sessionDate: '2026-02-15',
        startTime: '10:00',
        endTime: '11:00',
        notes: 'Beginner friendly session'
      });
      Alert.alert('Success', 'Booking created successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Accept booking (for trainer)
  const handleAcceptBooking = async (bookingId) => {
    try {
      await updateBookingStatus(bookingId, 'Confirmed');
      Alert.alert('Success', 'Booking confirmed!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Cancel booking
  const handleCancelBooking = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      Alert.alert('Success', 'Booking cancelled!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <FlatList
      data={userBookings}
      renderItem={({ item }) => (
        <BookingCard
          booking={item}
          onCancel={() => handleCancelBooking(item.id)}
        />
      )}
    />
  );
};
```

### Availability Context

```jsx
import { useAvailability } from '../contexts/AvailabilityContext';

const AvailabilityScreen = () => {
  const {
    availabilities,
    addAvailability,
    getAvailabilities,
    deleteAvailability,
    loading
  } = useAvailability();

  // Add availability
  const handleAddAvailability = async () => {
    try {
      await addAvailability({
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00'
      });
      Alert.alert('Success', 'Availability added!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Delete availability
  const handleDeleteAvailability = async (availabilityId) => {
    try {
      await deleteAvailability(availabilityId);
      Alert.alert('Success', 'Availability deleted!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View>
      {availabilities.map((slot) => (
        <AvailabilitySlot
          key={slot.id}
          slot={slot}
          onDelete={() => handleDeleteAvailability(slot.id)}
        />
      ))}
    </View>
  );
};
```

### Review Context

```jsx
import { useReview } from '../contexts/ReviewContext';

const ReviewScreen = () => {
  const {
    reviews,
    createReview,
    getTrainerReviews,
    updateReview,
    deleteReview,
    loading
  } = useReview();

  // Fetch trainer reviews
  useEffect(() => {
    const fetch = async () => {
      try {
        await getTrainerReviews('trainer123', { page: 1, limit: 10 });
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
    fetch();
  }, []);

  // Create review
  const handleCreateReview = async () => {
    try {
      await createReview({
        bookingId: 'booking123',
        rating: 5,
        comment: 'Great session! Highly recommended.'
      });
      Alert.alert('Success', 'Review posted!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Update review
  const handleUpdateReview = async (reviewId) => {
    try {
      await updateReview(reviewId, {
        rating: 4,
        comment: 'Good session'
      });
      Alert.alert('Success', 'Review updated!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Delete review
  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      Alert.alert('Success', 'Review deleted!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => (
        <ReviewCard
          review={item}
          onUpdate={() => handleUpdateReview(item.id)}
          onDelete={() => handleDeleteReview(item.id)}
        />
      )}
    />
  );
};
```

---

## Using Contexts in Screens

### Complete Example: Search Trainers Screen

```jsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useTrainer } from '../contexts/TrainerContext';
import TrainerCard from '../components/TrainerCard';

export default function SearchTrainersScreen({ navigation }) {
  const { searchTrainers, trainers, loading } = useTrainer();
  const [specialty, setSpecialty] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearch = async () => {
    try {
      await searchTrainers(specialty, minPrice, maxPrice, 1, 10);
    } catch (error) {
      Alert.alert('Error', 'Failed to search trainers: ' + error.message);
    }
  };

  const handleSelectTrainer = (trainer) => {
    navigation.navigate('TrainerDetail', { trainerId: trainer.id });
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Search filters */}
      <View style={{ padding: 16 }}>
        <TextInput
          placeholder="Search by specialty"
          value={specialty}
          onChangeText={setSpecialty}
          style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
        />
        <TextInput
          placeholder="Min Price"
          value={minPrice}
          onChangeText={setMinPrice}
          keyboardType="numeric"
          style={{ borderWidth: 1, padding: 8, marginBottom: 8 }}
        />
        <TextInput
          placeholder="Max Price"
          value={maxPrice}
          onChangeText={setMaxPrice}
          keyboardType="numeric"
          style={{ borderWidth: 1, padding: 8, marginBottom: 16 }}
        />
        <TouchableOpacity
          onPress={handleSearch}
          style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8 }}
        >
          <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={trainers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TrainerCard
              trainer={item}
              onPress={() => handleSelectTrainer(item)}
            />
          )}
        />
      )}
    </View>
  );
}
```

### Complete Example: Create Booking Screen

```jsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';

export default function BookingScreen({ route, navigation }) {
  const { trainerId } = route.params;
  const { user } = useAuth();
  const { createBooking, loading } = useBooking();

  const [formData, setFormData] = useState({
    sessionDate: '',
    startTime: '',
    endTime: '',
    notes: ''
  });

  const handleBooking = async () => {
    try {
      if (!formData.sessionDate || !formData.startTime || !formData.endTime) {
        Alert.alert('Error', 'Please fill all required fields');
        return;
      }

      const response = await createBooking({
        trainerId,
        sessionDate: formData.sessionDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        notes: formData.notes
      });

      Alert.alert('Success', 'Booking request sent successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
        Book a Session
      </Text>

      <TextInput
        placeholder="Session Date (YYYY-MM-DD)"
        value={formData.sessionDate}
        onChangeText={(text) => setFormData({ ...formData, sessionDate: text })}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Start Time (HH:MM)"
        value={formData.startTime}
        onChangeText={(text) => setFormData({ ...formData, startTime: text })}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="End Time (HH:MM)"
        value={formData.endTime}
        onChangeText={(text) => setFormData({ ...formData, endTime: text })}
        style={{ borderWidth: 1, padding: 12, marginBottom: 12, borderRadius: 8 }}
      />

      <TextInput
        placeholder="Additional Notes"
        value={formData.notes}
        onChangeText={(text) => setFormData({ ...formData, notes: text })}
        multiline
        numberOfLines={4}
        style={{ borderWidth: 1, padding: 12, marginBottom: 16, borderRadius: 8 }}
      />

      <TouchableOpacity
        onPress={handleBooking}
        disabled={loading}
        style={{
          backgroundColor: '#007AFF',
          padding: 16,
          borderRadius: 8,
          opacity: loading ? 0.6 : 1
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          {loading ? 'Booking...' : 'Confirm Booking'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
```

---

## Error Handling Best Practices

```jsx
const { login } = useAuth();

const handleLogin = async () => {
  try {
    const response = await login(email, password);
    // Handle success
  } catch (error) {
    // Handle different error types
    if (error.message.includes('Invalid credentials')) {
      Alert.alert('Login Failed', 'Email or password is incorrect');
    } else if (error.message.includes('not found')) {
      Alert.alert('Account Not Found', 'Please register first');
    } else {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    }
  }
};
```

---

## Token Management

The `AuthContext` automatically handles token storage and retrieval using AsyncStorage:

- Token is saved when user logs in or registers
- Token is automatically included in API requests (via headers)
- Token persists across app sessions
- Token is cleared when user logs out

To check if user is authenticated:

```jsx
const { token, user } = useAuth();

if (!token) {
  // User is not logged in
  return <LoginScreen />;
}

if (user?.role === 'TRAINER') {
  // Show trainer UI
}
```

---

## Next Steps

1. Replace old auth screens with new API-integrated versions
2. Update all data-fetching screens to use contexts
3. Implement proper error handling and loading states
4. Test all API integrations with a running backend server
5. Add data caching and offline support (optional)

