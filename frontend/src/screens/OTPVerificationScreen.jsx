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
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import RegisterStyles from "../styles/registerStyles";
import { Colors } from "../constants/colors";
import { FONT_SIZES, SPACING } from "../utils/responsiveDesign";

export default function OTPVerificationScreen({ route, navigation }) {
  const { input, inputType, demoOTP } = route.params;
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Timer for resend OTP
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Validate OTP
  const validate = (value) => {
    let errorMsg = "";

    if (!value || value.trim().length === 0) {
      errorMsg = "OTP is required";
    } else if (!/^\d*$/.test(value)) {
      errorMsg = "OTP must contain only numbers";
    } else if (value.length < 6) {
      errorMsg = `OTP must be 6 digits (${value.length}/6)`;
    } else if (value.length > 6) {
      errorMsg = "OTP must be exactly 6 digits";
    }

    setError(errorMsg);
  };

  const handleOTPChange = (text) => {
    // Only allow numbers and max 6 digits
    const cleaned = text.replace(/\D/g, "").slice(0, 6);
    setOtp(cleaned);
    validate(cleaned);
  };

  const isFormValid = otp.length === 6 && !error;

  const handleVerifyOTP = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      // Simulate OTP verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo: check against demoOTP
      if (otp !== demoOTP) {
        setError("OTP is incorrect. Please try again.");
        Alert.alert("Verification Failed", "The OTP you entered is incorrect.");
        setLoading(false);
        return;
      }

      // OTP verified successfully
      Alert.alert(
        "OTP Verified",
        "Your identity has been verified. You can now reset your password.",
        [
          {
            text: "Continue",
            onPress: () => {
              navigation.navigate("ResetPassword", {
                email: inputType === "email" ? input : "",
                phone: inputType === "phone" ? input : "",
                inputType,
              });
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert("Error", "Failed to verify OTP. Please try again.");
      console.error("Verify OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    setLoading(true);
    try {
      // Simulate resending OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate new OTP
      const newDemoOTP = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("New Demo OTP (for testing):", newDemoOTP);

      Alert.alert(
        "OTP Resent",
        `A new 6-digit OTP has been sent.\n\nDemo OTP: ${newDemoOTP}`
      );

      // Reset timer
      setTimeLeft(30);
      setCanResend(false);
      setOtp("");
      setError("");
    } catch (err) {
      Alert.alert("Error", "Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    return seconds < 10 ? `0${seconds}` : seconds;
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
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
            <Text style={RegisterStyles.title}>Verify OTP</Text>
            <Text style={RegisterStyles.subtitle}>
              We've sent a 6-digit code to your {inputType}
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZES.BODY_S,
                color: Colors.muted,
                marginTop: SPACING.M,
              }}
            >
              {inputType === "email" ? "📧" : "📱"} {input}
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
            {/* INPUT LABEL */}
            <Text style={RegisterStyles.label}>Enter 6-Digit OTP</Text>

            {/* OTP INPUT */}
            <View
              style={[
                RegisterStyles.inputBox,
                error && { borderColor: "red", borderWidth: 1.5 },
                !error && otp && { borderColor: "#10b981", borderWidth: 1 },
              ]}
            >
              <Ionicons name="key-outline" size={18} color={Colors.muted} />
              <TextInput
                value={otp}
                onChangeText={handleOTPChange}
                placeholder="000000"
                placeholderTextColor={Colors.muted}
                keyboardType="numeric"
                maxLength={6}
                style={[
                  RegisterStyles.input,
                  { letterSpacing: 4, fontSize: FONT_SIZES.BODY_L },
                ]}
              />
              {!error && otp.length === 6 && (
                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              )}
            </View>

            {/* OTP COUNTER */}
            {otp.length > 0 && otp.length < 6 && (
              <Text
                style={{
                  fontSize: FONT_SIZES.BODY_XS,
                  color: Colors.muted,
                  marginTop: SPACING.S,
                  marginBottom: SPACING.L,
                }}
              >
                {otp.length}/6 digits
              </Text>
            )}

            {/* ERROR MESSAGE */}
            {error ? (
              <Text
                style={{
                  color: "red",
                  fontSize: FONT_SIZES.BODY_XS,
                  marginTop: SPACING.S,
                  marginBottom: SPACING.L,
                }}
              >
                ❌ {error}
              </Text>
            ) : null}

            {/* VERIFY BUTTON */}
            <TouchableOpacity
              style={[
                RegisterStyles.button,
                (!isFormValid || loading) && { opacity: 0.6 },
              ]}
              disabled={!isFormValid || loading}
              onPress={handleVerifyOTP}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={RegisterStyles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            {/* RESEND OTP SECTION */}
            <View
              style={{
                marginTop: SPACING.L,
                paddingTop: SPACING.L,
                borderTopWidth: 1,
                borderTopColor: Colors.border,
                alignItems: "center",
              }}
            >
              {!canResend ? (
                <Text style={{ fontSize: FONT_SIZES.BODY_S, color: Colors.muted }}>
                  Resend OTP in{" "}
                  <Text style={{ color: Colors.primary, fontWeight: "700" }}>
                    {formatTime(timeLeft)}s
                  </Text>
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={handleResendOTP}
                  disabled={loading}
                  style={{
                    paddingVertical: SPACING.M,
                    paddingHorizontal: SPACING.L,
                  }}
                >
                  <Text
                    style={{
                      fontSize: FONT_SIZES.BODY_M,
                      color: Colors.primary,
                      fontWeight: "700",
                    }}
                  >
                    {loading ? "Resending..." : "Resend OTP"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* BACK BUTTON */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
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
                Try a different {inputType}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
