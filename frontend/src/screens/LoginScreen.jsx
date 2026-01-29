import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import RegisterStyles from "../styles/registerStyles";
import { Colors } from "../constants/colors";
import { findUser } from "../utils/userStorage";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* 🔍 LIVE VALIDATION */
  const validate = (field, value) => {
    let error = "";

    if (field === "email" && value) {
      // Allow both email and user ID format
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUserId = /^USER-[0-9]{6}$/.test(value);
      if (!isEmail && !isUserId) {
        error = "Enter a valid email or User ID (USER-XXXXXX)";
      }
    }

    if (field === "password" && value) {
      if (value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const isFormValid =
    email &&
    password &&
    Object.values(errors).every((e) => e === "");

  const handleLogin = async () => {
    if (!isFormValid) return;

    setLoading(true);
    try {
      // Find user by email or user ID with password validation
      const user = await findUser(email, password);
      
      if (user) {
        // Login successful
        const nextScreen = user.role === "Trainer" ? "TrainerHome" : "UserDashboard";
        navigation.navigate(nextScreen, {
          userData: user,
          role: user.role,
        });
      } else {
        // User not found or password incorrect
        Alert.alert(
          "Login Failed",
          "Invalid User ID/Email or password. Please check and try again or register if you're new."
        );
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred during login. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
  };

  return (
    <SafeAreaView style={RegisterStyles.safe}>
      {/* HEADER WITH BACK BUTTON - TOP LEFT */}
      <View
        style={{
          flexDirection: "row",
          paddingLeft: 16,
          paddingVertical: 10,
          marginTop: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={15} color="whitesmoke" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={RegisterStyles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* TITLE */}
          <Text style={RegisterStyles.title}>Welcome Back</Text>
          <Text style={RegisterStyles.subtitle}>
            Login to your account to continue
          </Text>

          {/* ERROR MESSAGE */}
          {errors.general && (
            <View
              style={{
                backgroundColor: "#ff4444",
                padding: 12,
                borderRadius: 8,
                marginBottom: 20,
              }}
            >
              <Text style={{ color: "white", fontSize: 14 }}>
                {errors.general}
              </Text>
            </View>
          )}

          {/* EMAIL INPUT */}
          <InputField
            label="Email or User ID"
            icon="mail"
            value={email}
            onChange={setEmail}
            onValidate={(v) => validate("email", v)}
            error={errors.email}
          />

          {/* PASSWORD INPUT */}
          <PasswordInputField
            label="Password"
            icon="lock-closed"
            value={password}
            onChange={setPassword}
            onValidate={(v) => validate("password", v)}
            error={errors.password}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          {/* FORGOT PASSWORD LINK */}
          <TouchableOpacity 
            style={{ marginBottom: 24 }}
            onPress={handleForgotPassword}
          >
            <Text style={{ color: Colors.primary, fontSize: 14, fontWeight: "600" }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>

          {/* LOGIN BUTTON */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={!isFormValid || loading}
            style={[
              RegisterStyles.button,
              (!isFormValid || loading) && { opacity: 0.5 },
            ]}
          >
            <Text style={RegisterStyles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* SIGN UP LINK */}
          <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
            <Text style={{ color: Colors.muted }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("RoleSelect")}>
              <Text style={{ color: Colors.primary, fontWeight: "600" }}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* 📝 INPUT FIELD COMPONENT */
function InputField({ label, icon, value, onChange, onValidate, error }) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={RegisterStyles.label}>{label}</Text>

      <View
        style={[
          RegisterStyles.inputBox,
          error && { borderColor: "red", borderWidth: 1 },
        ]}
      >
        <Ionicons name={icon} size={18} color={Colors.muted} />
        <TextInput
          value={value}
          onChangeText={(v) => {
            onChange(v);
            onValidate(v);
          }}
          placeholder={label}
          placeholderTextColor={Colors.muted}
          style={RegisterStyles.input}
        />
      </View>

      {error ? (
        <Text style={{ color: "red", fontSize: 12 }}>{error}</Text>
      ) : null}
    </View>
  );
}

/* 🔐 PASSWORD INPUT COMPONENT */
function PasswordInputField({
  label,
  icon,
  value,
  onChange,
  onValidate,
  error,
  showPassword,
  onTogglePassword,
}) {
  return (
    <View style={{ marginBottom: 18 }}>
      <Text style={RegisterStyles.label}>{label}</Text>

      <View
        style={[
          RegisterStyles.inputBox,
          error && { borderColor: "red", borderWidth: 1 },
        ]}
      >
        <Ionicons name={icon} size={18} color={Colors.muted} />
        <TextInput
          value={value}
          onChangeText={(v) => {
            onChange(v);
            onValidate(v);
          }}
          placeholder={label}
          placeholderTextColor={Colors.muted}
          secureTextEntry={!showPassword}
          style={RegisterStyles.input}
        />
        <TouchableOpacity onPress={onTogglePassword}>
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={18}
            color={Colors.muted}
          />
        </TouchableOpacity>
      </View>

      {error ? (
        <Text style={{ color: "red", fontSize: 12 }}>{error}</Text>
      ) : null}
    </View>
  );
}
