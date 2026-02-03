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
  const { login, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // ==================== VALIDATION ====================

  const validateEmail = useCallback((value) => {
    if (!value.trim()) return 'Email is required';
    if (!EMAIL_REGEX.test(value)) return 'Enter a valid email address';
    return '';
  }, []);

  const validatePassword = useCallback((value) => {
    if (!value) return 'Password is required';
    if (value.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }
    return '';
  }, []);

  const handleFieldChange = useCallback(
    (fieldName, value) => {
      setFormData((prev) => ({ ...prev, [fieldName]: value }));

      let fieldError = '';
      if (fieldName === 'email') fieldError = validateEmail(value);
      if (fieldName === 'password') fieldError = validatePassword(value);

      setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
    },
    [validateEmail, validatePassword]
  );

  const isFormValid = useCallback(() => {
    return (
      formData.email.trim().length > 0 &&
      formData.password.length > 0 &&
      !errors.email &&
      !errors.password
    );
  }, [formData, errors]);

  const handleBack = useCallback(() => {
    if (navigation?.canGoBack?.()) {
      navigation.goBack();
    } else {
      navigation.navigate('RoleSelect');
    }
  }, [navigation]);

  // ==================== LOGIN HANDLER ====================
  const handleLogin = useCallback(async () => {
    if (!isFormValid()) {
      Alert.alert('Validation Error', 'Please check all fields and fix errors.');
      return;
    }

    if (loading || authLoading) return;

    setLoading(true);
    try {
      await login(
        formData.email.toLowerCase().trim(),
        formData.password
      );
      // ✅ NO MANUAL NAVIGATION HERE
    } catch (error) {
      let errorMessage = 'Login failed. Please try again.';
      if (
        error.message?.toLowerCase().includes('invalid') ||
        error.message?.toLowerCase().includes('credentials')
      ) {
        errorMessage = 'Invalid email or password.';
      }

      Alert.alert('Login Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isFormValid, formData, loading, authLoading, login]);

  const handleForgotPassword = useCallback(() => {
    navigation.navigate('ForgotPassword');
  }, [navigation]);

  const handleSignUp = useCallback(() => {
    navigation.navigate('RoleSelect');
  }, [navigation]);

  // ==================== RENDER ====================
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', padding: 16 }}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="whitesmoke" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
          <View style={{ marginBottom: 32 }}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Login to your account to continue
            </Text>
          </View>

          <View style={styles.card}>
            {/* Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Enter your email"
                placeholderTextColor="#999"
                value={formData.email}
                onChangeText={(v) => handleFieldChange('email', v)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
                  value={formData.password}
                  onChangeText={(v) => handleFieldChange('password', v)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
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

            {/* Forgot */}
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={{ color: Colors.primary, textAlign: 'right' }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Button */}
            <TouchableOpacity
              style={[
                styles.button,
                (!isFormValid() || loading || authLoading) && { opacity: 0.6 },
              ]}
              onPress={handleLogin}
              disabled={!isFormValid() || loading || authLoading}
            >
              {loading || authLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sign up */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
            <Text style={{ color: '#ccc' }}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={{ color: Colors.primary, fontWeight: '600' }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
