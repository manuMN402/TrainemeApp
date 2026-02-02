import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import RegisterStyles from '../styles/registerStyles';
import { Colors } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';

// Enable this to test without backend
const MOCK_MODE = true;

// ==================== REGISTER SCREEN COMPONENT ====================
export default function RegisterScreen({ route, navigation }) {
  const role = route?.params?.role || 'USER';
  const { register, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==================== MOCK REGISTRATION ====================
  const mockRegister = useCallback(async (data) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      user: {
        id: 'user-' + Date.now(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
      },
      token: 'token-' + Date.now(),
      message: 'User registered successfully',
    };
  }, []);

  // ==================== VALIDATION LOGIC ====================

  /**
   * Real-time field validation
   */
  const validate = useCallback((field, value) => {
    let error = '';

    // First Name Validation
    if (field === 'firstName') {
      if (!value || value.trim().length === 0) {
        error = 'First name is required';
      } else if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = 'First name can only contain letters';
      } else if (value.trim().length < 2) {
        error = 'First name must be at least 2 characters';
      }
    }

    // Last Name Validation
    if (field === 'lastName') {
      if (!value || value.trim().length === 0) {
        error = 'Last name is required';
      } else if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = 'Last name can only contain letters';
      } else if (value.trim().length < 1) {
        error = 'Last name must be at least 1 character';
      }
    }

    // Email Validation
    if (field === 'email') {
      if (!value || value.trim().length === 0) {
        error = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = 'Please enter a valid email (e.g., user@gmail.com)';
      }
    }

    // Phone Validation
    if (field === 'phone') {
      if (!value) {
        error = 'Phone number is required';
      } else if (!/^\d+$/.test(value)) {
        error = 'Phone can only contain numbers';
      } else if (value.length < 7 || value.length > 15) {
        error = 'Phone must be 7-15 digits';
      }
    }

    // Password Validation
    if (field === 'password') {
      if (!value || value.length === 0) {
        error = 'Password is required';
      } else if (value.length < 6) {
        error = 'Password must be at least 6 characters';
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  /**
   * Handle field change
   */
  const handleFieldChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      validate(field, value);
    },
    [validate]
  );

  /**
   * Check if form is valid
   */
  const isFormValid =
    formData.firstName.trim().length > 0 &&
    formData.lastName.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.email.includes('@') &&
    formData.phone.length >= 7 &&
    formData.password.length >= 6;

  /**
   * Get password strength indicator
   */
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;

    if (strength <= 2) return { text: 'Weak', color: '#ef4444' };
    if (strength === 3 || strength === 4)
      return { text: 'Medium', color: '#f59e0b' };
    return { text: 'Strong', color: '#10b981' };
  };

  /**
   * Handle registration with API
   */
  const handleRegister = useCallback(async () => {
    console.log('🔵 Register button pressed - Form valid:', isFormValid);

    if (!isFormValid) {
      console.log('❌ Form is invalid');
      Alert.alert(
        'Form Error',
        'Please fill all fields correctly and fix any errors.'
      );
      return;
    }

    if (loading || authLoading) {
      console.log('⚠️ Already registering, ignoring duplicate click');
      return;
    }

    setLoading(true);

    try {
      console.log('🚀 Starting registration with role:', role);
      console.log('📝 Registration data:', {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
      });

      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone,
        password: formData.password,
      };

      console.log('📤 Sending registration request...');
      
      let response;
      
      if (MOCK_MODE) {
        // Use mock registration for testing
        console.log('🧪 MOCK MODE: Using mock response');
        response = await mockRegister(registrationData);
      } else {
        // Use real backend API
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout after 10 seconds')), 10000)
        );
        response = await Promise.race([
          register(registrationData),
          timeoutPromise
        ]);
      }

      console.log('✅ Response received:', response);

      if (response && response.user) {
        console.log('✨ Registration successful:', response.user);

        Alert.alert(
          'Success',
          'Registration successful! Welcome to TrainMe!',
          [
            {
              text: 'OK',
              onPress: () => {
                console.log('🔄 Navigating based on role:', role);
                if (role === 'TRAINER') {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'TrainerRegister',
                      },
                    ],
                  });
                } else {
                  // Navigate to UserDashboard
                  navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: 'UserDashboard',
                        params: {
                          userData: response.user,
                        },
                      },
                    ],
                  });
                }
              },
            },
          ]
        );
      } else {
        console.error('❌ Invalid registration response:', response);
        throw new Error('Registration failed: No user data received');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('❌ Error message:', error.message);
      
      let errorMessage = error.message || 'Registration failed. Please try again.';
      
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Network error: Cannot reach server. Make sure backend is running on 192.168.0.228:3000';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout: Backend server is not responding. Please check if it\'s running.';
      } else if (error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please use a different email.';
      }

      Alert.alert('Registration Failed', errorMessage);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  }, [isFormValid, formData, loading, authLoading, role, register, mockRegister, navigation]);

  /**
   * Handle back navigation
   */
  const handleBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    }
  }, [navigation]);

  // ==================== RENDER ====================
  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <SafeAreaView style={RegisterStyles.container} edges={['top']}>
      {/* Header */}
      <View style={RegisterStyles.header}>
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          style={RegisterStyles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="whitesmoke" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={RegisterStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={RegisterStyles.titleSection}>
            <Text style={RegisterStyles.title}>Create Account</Text>
            <Text style={RegisterStyles.subtitle}>
              Register as {role === 'TRAINER' ? 'a Trainer' : 'a User'}
            </Text>
          </View>

          {/* Form Container */}
          <View style={RegisterStyles.formContainer}>
            {/* First Name */}
            <View style={RegisterStyles.inputGroup}>
              <Text style={RegisterStyles.label}>First Name</Text>
              <TextInput
                style={[
                  RegisterStyles.input,
                  errors.firstName && RegisterStyles.inputError,
                ]}
                placeholder="John"
                placeholderTextColor="#999"
                value={formData.firstName}
                onChangeText={(value) =>
                  handleFieldChange('firstName', value)
                }
                editable={!loading && !authLoading}
              />
              {errors.firstName && (
                <Text style={RegisterStyles.errorText}>
                  {errors.firstName}
                </Text>
              )}
            </View>

            {/* Last Name */}
            <View style={RegisterStyles.inputGroup}>
              <Text style={RegisterStyles.label}>Last Name</Text>
              <TextInput
                style={[
                  RegisterStyles.input,
                  errors.lastName && RegisterStyles.inputError,
                ]}
                placeholder="Doe"
                placeholderTextColor="#999"
                value={formData.lastName}
                onChangeText={(value) => handleFieldChange('lastName', value)}
                editable={!loading && !authLoading}
              />
              {errors.lastName && (
                <Text style={RegisterStyles.errorText}>{errors.lastName}</Text>
              )}
            </View>

            {/* Email */}
            <View style={RegisterStyles.inputGroup}>
              <Text style={RegisterStyles.label}>Email</Text>
              <TextInput
                style={[
                  RegisterStyles.input,
                  errors.email && RegisterStyles.inputError,
                ]}
                placeholder="john@example.com"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(value) => handleFieldChange('email', value)}
                editable={!loading && !authLoading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={RegisterStyles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Phone */}
            <View style={RegisterStyles.inputGroup}>
              <Text style={RegisterStyles.label}>Phone Number</Text>
              <TextInput
                style={[
                  RegisterStyles.input,
                  errors.phone && RegisterStyles.inputError,
                ]}
                placeholder="1234567890"
                placeholderTextColor="#999"
                value={formData.phone}
                onChangeText={(value) => handleFieldChange('phone', value)}
                editable={!loading && !authLoading}
                keyboardType="numeric"
                maxLength={10}
              />
              {errors.phone && (
                <Text style={RegisterStyles.errorText}>{errors.phone}</Text>
              )}
            </View>

            {/* Password */}
            <View style={RegisterStyles.inputGroup}>
              <Text style={RegisterStyles.label}>Password</Text>
              <View
                style={[
                  RegisterStyles.passwordInputContainer,
                  errors.password && RegisterStyles.inputError,
                ]}
              >
                <TextInput
                  style={RegisterStyles.passwordInput}
                  placeholder="Enter password"
                  placeholderTextColor="#999"
                  value={formData.password}
                  onChangeText={(value) =>
                    handleFieldChange('password', value)
                  }
                  editable={!loading && !authLoading}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading || authLoading}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={RegisterStyles.errorText}>{errors.password}</Text>
              )}

              {/* Password Strength */}
              {passwordStrength && (
                <View style={RegisterStyles.strengthContainer}>
                  <View
                    style={[
                      RegisterStyles.strengthBar,
                      { backgroundColor: passwordStrength.color },
                    ]}
                  />
                  <Text
                    style={[
                      RegisterStyles.strengthText,
                      { color: passwordStrength.color },
                    ]}
                  >
                    Strength: {passwordStrength.text}
                  </Text>
                </View>
              )}
            </View>

            {/* Register Button */}
            <TouchableOpacity
              style={[
                RegisterStyles.button,
                (!isFormValid || loading || authLoading) && {
                  opacity: 0.6,
                },
              ]}
              onPress={handleRegister}
              disabled={!isFormValid || loading || authLoading}
              activeOpacity={0.85}
            >
              {loading || authLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={RegisterStyles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={RegisterStyles.loginLinkContainer}>
              <Text style={RegisterStyles.loginLinkText}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                disabled={loading || authLoading}
              >
                <Text style={RegisterStyles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
