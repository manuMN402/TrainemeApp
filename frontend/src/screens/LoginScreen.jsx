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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { authStyles as styles } from "../styles/authStyles";
import { Colors } from "../constants/colors";
import { findUser } from "../utils/userStorage";

// ==================== CONSTANTS ====================
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_ID_REGEX = /^USER-[0-9]{6}$/;
const PASSWORD_MIN_LENGTH = 6;

// ==================== LOGIN SCREEN COMPONENT ====================
export default function LoginScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // ==================== VALIDATION ====================
  const validateEmail = useCallback((value) => {
    if (!value.trim()) return "Email or User ID is required";

    const isEmail = EMAIL_REGEX.test(value);
    const isUserId = USER_ID_REGEX.test(value);

    if (!isEmail && !isUserId) {
      return "Enter a valid email or User ID (USER-XXXXXX)";
    }
    return "";
  }, []);

  const validatePassword = useCallback((value) => {
    if (!value) return "Password is required";
    if (value.length < PASSWORD_MIN_LENGTH) {
      return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
    }
    return "";
  }, []);

  const handleFieldChange = useCallback(
    (field, value) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      let error = "";
      if (field === "email") error = validateEmail(value);
      if (field === "password") error = validatePassword(value);

      setErrors((prev) => ({ ...prev, [field]: error }));
    },
    [validateEmail, validatePassword]
  );

  const isFormValid = useCallback(() => {
    return (
      formData.email.trim() &&
      formData.password &&
      !errors.email &&
      !errors.password
    );
  }, [formData, errors]);

  // ==================== FIXED NAVIGATION ====================
  const navigateByRole = useCallback(
    (user) => {
      const role = user?.role || "USER";

      if (role === "TRAINER") {
        navigation.navigate("TrainerDashboard", { userData: user });
      } else {
        navigation.navigate("UserDashboard", { userData: user });
      }
    },
    [navigation]
  );

  // ==================== LOGIN ====================
  const handleLogin = useCallback(async () => {
    if (!isFormValid()) {
      Alert.alert("Validation Error", "Please fix the errors.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const user = await findUser(formData.email, formData.password);

      if (!user) {
        Alert.alert("Login Failed", "Invalid credentials");
        return;
      }

      navigateByRole(user);
    } catch (err) {
      Alert.alert("Error", err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }, [formData, loading, isFormValid, navigateByRole]);

  // ==================== RENDER ====================
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.title}>Welcome Back</Text>

          {/* EMAIL */}
          <TextInput
            style={styles.input}
            placeholder="Email or User ID"
            value={formData.email}
            onChangeText={(v) => handleFieldChange("email", v)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* PASSWORD */}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(v) => handleFieldChange("password", v)}
          />
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
