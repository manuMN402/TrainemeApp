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
import { useCallback, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { authStyles as styles } from '../styles/authStyles';
import { Colors } from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';

// ==================== CONSTANTS ====================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 6;

// ==================== LOGIN SCREEN COMPONENT ====================
export default function LoginScreen({ navigation }) {
  // Authentication context
  const { login, loading: authLoading } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // UI state
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==================== VALIDATION LOGIC ====================

  /**
   * Real-time email validation
   */
  const validateEmail = useCallback((value) => {
    if (!value.trim()) {
      return 'Email is required';
    }

    if (!EMAIL_REGEX.test(value)) {
      return 'Enter a valid email address';
    }

    return '';
  }, []);

  /**
   * Real-time password validation
   */
  const validatePassword = useCallback((value) => {
    if (!value) {
      return 'Password is required';
    }

    if (value.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }

    return '';
  }, []);

  /**
   * Handle field changes with real-time validation
   */
  const handleFieldChange = useCallback(
    (fieldName, value) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));

      // Real-time validation
      let fieldError = '';
      if (fieldName === 'email') {
        fieldError = validateEmail(value);
      } else if (fieldName === 'password') {
        fieldError = validatePassword(value);
      }

      setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
    },
    [validateEmail, validatePassword]
  );

  /**
   * Check if form is valid
   */
  const isFormValid = useCallback(() => {
    return (
      formData.email.trim().length > 0 &&
      formData.password.length > 0 &&
      !errors.email &&
      !errors.password
    );
  }, [formData, errors]);

  /**
   * Handle back navigation safely
   */
  const handleBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('RoleSelect');
    }
  }, [navigation]);

  /**
   * Handle navigation based on user role
   */
  const navigateByRole = useCallback(
    (user) => {
      try {
        const role = user?.role || 'USER';
        const navigationTarget = role === 'TRAINER' ? 'TrainerRegister' : 'UserDashboard';

        navigation.reset({
          index: 0,
          routes: [
            {
              name: navigationTarget,
              params: {
                userData: user,
                role: role,
              },
            },
          ],
        });
      } catch (error) {
        console.error('Navigation error:', error);
        Alert.alert(
          'Navigation Error',
          'Could not navigate to dashboard. Please try again.'
        );
      }
    },
    [navigation]
  );

  /**
   * Main login handler with API integration
   */
  const handleLogin = useCallback(async () => {
    if (!isFormValid()) {
      Alert.alert('Validation Error', 'Please check all fields and fix errors.');
      return;
    }

    if (loading || authLoading) return; // Prevent duplicate submissions

    setLoading(true);

    try {
      // Call API login with normalized email
      const response = await login(formData.email.toLowerCase().trim(), formData.password);

      if (response && response.user) {
        // Login successful - navigate based on role
        navigateByRole(response.user);
      }
    } catch (error) {
      console.error('Login error:', error);

      // Provide user-friendly error messages
      let errorMessage = 'An error occurred during login. Please try again.';
      if (error.message.includes('Invalid') || error.message.includes('credentials')) {
        errorMessage = 'Invalid email or password. Please check and try again, or register if you\'re new.';
      } else if (error.message.includes('not found')) {
        errorMessage = 'User account not found. Please register first.';
      }

      Alert.alert('Login Failed', errorMessage, [
        { text: 'OK', style: 'default' },
      ]);
    } finally {
      setLoading(false);
    }
  }, [isFormValid, formData, loading, authLoading, login, navigateByRole]);

  /**
   * Handle forgot password navigation
   */
  const handleForgotPassword = useCallback(() => {
    try {
      navigation.navigate('ForgotPassword');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Could not navigate to password reset.');
    }
  }, [navigation]);

  /**
   * Handle sign up navigation
   */
  const handleSignUp = useCallback(() => {
    try {
      navigation.navigate('RoleSelect');
    } catch (error) {
      console.error('Navigation error:', error);
      Alert.alert('Navigation Error', 'Could not navigate to sign up.');
    }
  }, [navigation]);

  // ==================== RENDER ====================
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with back button */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 8,
        }}
      >
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.7}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={24} color="whitesmoke" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingVertical: 20,
            paddingHorizontal: 16,
            flexGrow: 1,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title section */}
          <View style={{ marginBottom: 32 }}>
            <Text style={[styles.title, { marginBottom: 8 }]}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Login to your account to continue
            </Text>
          </View>

          {/* Form card */}
          <View style={[styles.card, { paddingBottom: 24 }]}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(value) => handleFieldChange('email', value)}
                editable={!loading && !authLoading}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View
                style={[
                  styles.passwordContainer,
                  errors.password && styles.passwordContainerError,
                ]}
              >
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={formData.password}
                  onChangeText={(value) => handleFieldChange('password', value)}
                  editable={!loading && !authLoading}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={loading || authLoading}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={20}
                    color={Colors.primary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              style={{ marginBottom: 24, alignSelf: 'flex-end' }}
              onPress={handleForgotPassword}
              disabled={loading || authLoading}
              activeOpacity={0.7}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.button,
                (!isFormValid() || loading || authLoading) && { opacity: 0.6 },
              ]}
              onPress={handleLogin}
              disabled={!isFormValid() || loading || authLoading}
              activeOpacity={0.85}
              accessibilityLabel="Login button"
            >
              {loading || authLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 24,
            }}
          >
            <Text style={{ color: '#ccc', fontSize: 14 }}>
              Don't have an account?{' '}
            </Text>
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading || authLoading}
            >
              <Text
                style={{
                  color: Colors.primary,
                  fontSize: 14,
                  fontWeight: '600',
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
