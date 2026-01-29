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
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import RegisterStyles from "../styles/registerStyles";
import { Colors } from "../constants/colors";
import { FONT_SIZES, SPACING } from "../utils/responsiveDesign";

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, phone, inputType } = route.params;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation rules for password
  const validatePassword = (value) => {
    let passwordErrors = {};

    if (!value || value.trim().length === 0) {
      passwordErrors.required = "Password is required";
    } else {
      if (value.length < 6) {
        passwordErrors.length = "At least 6 characters required";
      }
      if (!/[A-Z]/.test(value)) {
        passwordErrors.uppercase = "At least 1 uppercase letter (A-Z) required";
      }
      if (!/[a-z]/.test(value)) {
        passwordErrors.lowercase = "At least 1 lowercase letter (a-z) required";
      }
      if (!/\d/.test(value)) {
        passwordErrors.number = "At least 1 number (0-9) required";
      }
    }

    return passwordErrors;
  };

  // Check password strength
  const getPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength += 1;
    if (password.length >= 10) strength += 1;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[^a-zA-Z\d]/.test(password)) strength += 1;

    return strength;
  };

  const getStrengthLabel = (strength) => {
    if (strength < 2) return { label: "Weak", color: "#ef4444" };
    if (strength < 4) return { label: "Medium", color: "#f59e0b" };
    return { label: "Strong", color: "#10b981" };
  };

  const handlePasswordChange = (text) => {
    setNewPassword(text);
    const passwordErrors = validatePassword(text);
    setErrors((prev) => ({
      ...prev,
      password: passwordErrors,
      mismatch: "",
    }));
  };

  const handleConfirmChange = (text) => {
    setConfirmPassword(text);

    if (text !== newPassword) {
      setErrors((prev) => ({
        ...prev,
        mismatch: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        mismatch: "",
      }));
    }
  };

  const isFormValid =
    newPassword.length >= 6 &&
    confirmPassword === newPassword &&
    Object.keys(errors.password || {}).length === 0 &&
    !errors.mismatch;

  const strength = getPasswordStrength(newPassword);
  const strengthInfo = getStrengthLabel(strength);

  const handleResetPassword = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please fix all validation errors before proceeding");
      return;
    }

    setLoading(true);
    try {
      // Simulate password reset
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In production, you would call an API to reset the password
      // For now, we'll just show a success message
      console.log("Password reset for:", email || phone);
      console.log("New password:", newPassword);

      Alert.alert(
        "Success",
        "Your password has been reset successfully. Please log in with your new password.",
        [
          {
            text: "Go to Login",
            onPress: () => {
              // Navigate back to login
              navigation.navigate("Login");
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert("Error", "Failed to reset password. Please try again.");
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={RegisterStyles.safe}>
      {/* BACK BUTTON */}
      <View
        style={{
          flexDirection: "row",
          paddingLeft: 16,
          paddingVertical: 10,
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Ionicons name="arrow-back" size={15} color="whitesmoke" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingVertical: 12,
            paddingHorizontal: 16,
          }}
          scrollEnabled={true}
        >
          {/* HEADER */}
          <View style={{ alignItems: "center", marginBottom: 12 }}>
            <Text style={RegisterStyles.title}>Reset Password</Text>
            <Text style={RegisterStyles.subtitle}>
              Create a new secure password
            </Text>
          </View>

          {/* CARD */}
          <View
            style={[
              RegisterStyles.card,
              {
                borderWidth: 1,
                borderColor: "#6366F1",
                width: "100%",
                marginTop: 8,
              },
            ]}
          >
            {/* NEW PASSWORD FIELD */}
            <Text style={RegisterStyles.label}>New Password</Text>

            <View
              style={[
                RegisterStyles.inputBox,
                errors.password && Object.keys(errors.password).length > 0
                  ? { borderColor: "red", borderWidth: 1.5 }
                  : newPassword && Object.keys(errors.password || {}).length === 0
                  ? { borderColor: "#10b981", borderWidth: 1 }
                  : {},
              ]}
            >
              <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} />
              <TextInput
                value={newPassword}
                onChangeText={handlePasswordChange}
                placeholder="Enter your new password"
                placeholderTextColor={Colors.muted}
                secureTextEntry={!showPassword}
                style={RegisterStyles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color={Colors.muted}
                />
              </TouchableOpacity>
            </View>

            {/* PASSWORD STRENGTH INDICATOR */}
            {newPassword && (
              <View style={{ marginTop: SPACING.M }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: SPACING.S,
                  }}
                >
                  <View style={{ flex: 1, marginRight: SPACING.M }}>
                    <View
                      style={{
                        height: 4,
                        backgroundColor: Colors.border,
                        borderRadius: 2,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          height: "100%",
                          width: `${(strength / 5) * 100}%`,
                          backgroundColor: strengthInfo.color,
                        }}
                      />
                    </View>
                  </View>
                  <Text
                    style={{
                      fontSize: FONT_SIZES.BODY_XS,
                      color: strengthInfo.color,
                      fontWeight: "600",
                    }}
                  >
                    {strengthInfo.label}
                  </Text>
                </View>

                {/* PASSWORD VALIDATION CHECKLIST */}
                <View style={{ gap: SPACING.S }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name={newPassword.length >= 6 ? "checkmark-circle" : "close-circle"}
                      size={14}
                      color={newPassword.length >= 6 ? "#10b981" : Colors.muted}
                      style={{ marginRight: SPACING.S }}
                    />
                    <Text
                      style={{
                        fontSize: FONT_SIZES.BODY_XS,
                        color:
                          newPassword.length >= 6 ? "#10b981" : Colors.muted,
                      }}
                    >
                      At least 6 characters
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name={/[A-Z]/.test(newPassword) ? "checkmark-circle" : "close-circle"}
                      size={14}
                      color={/[A-Z]/.test(newPassword) ? "#10b981" : Colors.muted}
                      style={{ marginRight: SPACING.S }}
                    />
                    <Text
                      style={{
                        fontSize: FONT_SIZES.BODY_XS,
                        color: /[A-Z]/.test(newPassword)
                          ? "#10b981"
                          : Colors.muted,
                      }}
                    >
                      At least 1 uppercase letter (A-Z)
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name={/[a-z]/.test(newPassword) ? "checkmark-circle" : "close-circle"}
                      size={14}
                      color={/[a-z]/.test(newPassword) ? "#10b981" : Colors.muted}
                      style={{ marginRight: SPACING.S }}
                    />
                    <Text
                      style={{
                        fontSize: FONT_SIZES.BODY_XS,
                        color: /[a-z]/.test(newPassword)
                          ? "#10b981"
                          : Colors.muted,
                      }}
                    >
                      At least 1 lowercase letter (a-z)
                    </Text>
                  </View>

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name={/\d/.test(newPassword) ? "checkmark-circle" : "close-circle"}
                      size={14}
                      color={/\d/.test(newPassword) ? "#10b981" : Colors.muted}
                      style={{ marginRight: SPACING.S }}
                    />
                    <Text
                      style={{
                        fontSize: FONT_SIZES.BODY_XS,
                        color: /\d/.test(newPassword)
                          ? "#10b981"
                          : Colors.muted,
                      }}
                    >
                      At least 1 number (0-9)
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* CONFIRM PASSWORD FIELD */}
            <Text style={[RegisterStyles.label, { marginTop: SPACING.L }]}>
              Confirm Password
            </Text>

            <View
              style={[
                RegisterStyles.inputBox,
                errors.mismatch
                  ? { borderColor: "red", borderWidth: 1.5 }
                  : confirmPassword === newPassword && newPassword
                  ? { borderColor: "#10b981", borderWidth: 1 }
                  : {},
              ]}
            >
              <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} />
              <TextInput
                value={confirmPassword}
                onChangeText={handleConfirmChange}
                placeholder="Confirm your password"
                placeholderTextColor={Colors.muted}
                secureTextEntry={!showConfirm}
                style={RegisterStyles.input}
              />
              <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                <Ionicons
                  name={showConfirm ? "eye-outline" : "eye-off-outline"}
                  size={18}
                  color={Colors.muted}
                />
              </TouchableOpacity>
            </View>

            {/* MISMATCH ERROR */}
            {errors.mismatch ? (
              <Text
                style={{
                  color: "red",
                  fontSize: FONT_SIZES.BODY_XS,
                  marginTop: SPACING.S,
                  marginBottom: SPACING.L,
                }}
              >
                ❌ {errors.mismatch}
              </Text>
            ) : confirmPassword && confirmPassword === newPassword ? (
              <Text
                style={{
                  color: "#10b981",
                  fontSize: FONT_SIZES.BODY_XS,
                  marginTop: SPACING.S,
                  marginBottom: SPACING.L,
                }}
              >
                ✅ Passwords match
              </Text>
            ) : null}

            {/* RESET BUTTON */}
            <TouchableOpacity
              style={[
                RegisterStyles.button,
                (!isFormValid || loading) && { opacity: 0.6 },
              ]}
              disabled={!isFormValid || loading}
              onPress={handleResetPassword}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={RegisterStyles.buttonText}>Reset Password</Text>
              )}
            </TouchableOpacity>

            {/* BACK TO LOGIN */}
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              disabled={loading}
              style={{
                marginTop: SPACING.L,
                paddingVertical: SPACING.M,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: FONT_SIZES.BODY_S,
                  color: Colors.muted,
                }}
              >
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
