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
import { emailExists } from "../utils/userStorage";
import { FONT_SIZES, SPACING } from "../utils/responsiveDesign";

export default function ForgotPasswordScreen({ navigation }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState(null); // "email" or "phone"

  // Validate email or phone
  const validate = (value) => {
    let errorMsg = "";

    if (!value || value.trim().length === 0) {
      errorMsg = "Email or phone number is required";
      setInputType(null);
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      // Valid email format
      setInputType("email");
      errorMsg = "";
    } else if (/^\d{10}$/.test(value.replace(/\D/g, ""))) {
      // Valid 10-digit phone
      setInputType("phone");
      errorMsg = "";
    } else {
      // Invalid format
      setInputType(null);
      const isEmail = value.includes("@");
      if (isEmail) {
        errorMsg = "Please enter a valid email (e.g., user@gmail.com)";
      } else {
        const digits = value.replace(/\D/g, "").length;
        errorMsg = `Please enter exactly 10 digits (${digits}/10)`;
      }
    }

    setError(errorMsg);
  };

  const handleInputChange = (text) => {
    // Auto-format phone number
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      setInput(text);
      validate(text);
    }
  };

  const isFormValid = input.trim().length > 0 && !error;

  const handleSendOTP = async () => {
    if (!isFormValid) {
      Alert.alert("Error", "Please enter a valid email or phone number");
      return;
    }

    setLoading(true);
    try {
      // Check if user exists with this email/phone
      if (inputType === "email") {
        const userExists = await emailExists(input);
        if (!userExists) {
          Alert.alert(
            "User Not Found",
            "No account found with this email. Please check and try again or register a new account."
          );
          setLoading(false);
          return;
        }
      }

      // Simulate sending OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Generate random OTP for demo (in real app, backend would send via email/SMS)
      const demoOTP = Math.floor(100000 + Math.random() * 900000).toString();
      console.log("Demo OTP (for testing):", demoOTP);

      Alert.alert(
        "OTP Sent",
        `A 6-digit OTP has been sent to your ${inputType}.\n\nDemo OTP: ${demoOTP}`,
        [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("OTPVerification", {
                input,
                inputType,
                demoOTP, // Only for demo - remove in production
              });
            },
          },
        ]
      );
    } catch (err) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
      console.error("Send OTP error:", err);
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
            <Text style={RegisterStyles.title}>Forgot Password?</Text>
            <Text style={RegisterStyles.subtitle}>
              Enter your registered email or phone number to reset your password
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
            {/* INFO MESSAGE */}
            <View
              style={{
                backgroundColor: "rgba(99, 102, 241, 0.1)",
                borderRadius: SPACING.RADIUS_M,
                padding: SPACING.L,
                marginBottom: SPACING.L,
                borderLeftWidth: 4,
                borderLeftColor: Colors.primary,
              }}
            >
              <Text
                style={{
                  fontSize: FONT_SIZES.BODY_S,
                  color: Colors.text,
                  lineHeight: FONT_SIZES.BODY_S * 1.4,
                }}
              >
                📧 We'll send you a 6-digit code to verify your identity.
              </Text>
            </View>

            {/* INPUT LABEL */}
            <Text style={RegisterStyles.label}>Email or Phone Number</Text>

            {/* INPUT FIELD */}
            <View
              style={[
                RegisterStyles.inputBox,
                error && { borderColor: "red", borderWidth: 1.5 },
                !error && input && { borderColor: "#10b981", borderWidth: 1 },
              ]}
            >
              <Ionicons
                name={inputType === "phone" ? "call-outline" : "mail-outline"}
                size={18}
                color={Colors.muted}
              />
              <TextInput
                value={input}
                onChangeText={handleInputChange}
                placeholder="example@gmail.com or 9876543210"
                placeholderTextColor={Colors.muted}
                keyboardType={inputType === "phone" ? "numeric" : "email-address"}
                style={RegisterStyles.input}
              />
              {!error && input && (
                <Ionicons name="checkmark-circle" size={18} color="#10b981" />
              )}
            </View>

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

            {/* SEND OTP BUTTON */}
            <TouchableOpacity
              style={[
                RegisterStyles.button,
                (!isFormValid || loading) && { opacity: 0.6 },
              ]}
              disabled={!isFormValid || loading}
              onPress={handleSendOTP}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={RegisterStyles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>

            {/* BACK TO LOGIN */}
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
                  color: Colors.primary,
                  fontWeight: "600",
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
