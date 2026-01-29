import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import RegisterStyles from "../styles/registerStyles";
import { Colors } from "../constants/colors";
import { generateUniqueUserId } from "../utils/idGenerator";
import { emailExists, saveUser, getUserByEmail } from "../utils/userStorage";

export default function RegisterScreen({ route, navigation }) {
  const role = route?.params?.role || "User";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔍 LIVE VALIDATION */
  const validate = (field, value) => {
    let error = "";

    if (field === "firstName") {
      if (value.trim().length < 2) {
        error = "First name must be at least 2 characters";
      } else if (/\s{2,}/.test(value)) {
        error = "First name cannot have multiple spaces";
      }
    }

    if (field === "lastName" && value.trim().length < 2) {
      error = "Last name must be at least 2 characters";
    }

    if (
      field === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Enter a valid email";
    }

    if (field === "phone" && value.length !== 10) {
      error = "Phone must be 10 digits";
    }

    if (field === "password" && value.length < 6) {
      error = "Password must be at least 6 characters";
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const isFormValid =
    firstName &&
    lastName &&
    email &&
    phone &&
    password &&
    Object.values(errors).every((e) => e === "");

  const handleRegister = async () => {
    if (!isFormValid) return;

    setLoading(true);

    try {
      // Check if email already exists
      const userExists = await emailExists(email);
      
      if (userExists) {
        // Get the user ID for this email
        const existingUser = await getUserByEmail(email);
        const userIdText = existingUser ? `\n\nYour User ID: ${existingUser.userId}` : "";
        
        Alert.alert(
          "Email Already Exists",
          `This email is already registered. Please login instead.${userIdText}`,
          [
            { text: "Cancel", onPress: () => setLoading(false) },
            {
              text: "Go to Login",
              onPress: () => {
                setLoading(false);
                navigation.navigate("Login");
              },
            },
          ]
        );
        return;
      }

      // Generate unique user ID
      const generatedUserId = generateUniqueUserId();
      setUserId(generatedUserId);

      // Save user data to local storage
      const userData = {
        userId: generatedUserId,
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
        createdAt: new Date().toISOString(),
      };

      const saved = await saveUser(userData);
      
      if (saved) {
        setShowSuccessModal(true);
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAfterSuccess = () => {
    const nextScreen = role === "Trainer" ? "TrainerHome" : "UserDashboard";
    navigation.navigate(nextScreen, {
      userData: {
        userId,
        firstName,
        lastName,
        email,
        phone,
        password,
      },
      role,
    });
  };

  return (
    <SafeAreaView style={RegisterStyles.safe}>
      {/* HEADER WITH BACK BUTTON - TOP RIGHT */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          paddingRight: 16,
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
          contentContainerStyle={{
            paddingVertical: 20,
            paddingHorizontal: 20,
          }}
          scrollEnabled={true}
        >
          {/* CENTERED HEADER TEXT */}
          <View
            style={{
              alignItems: "center",
              marginBottom: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text style={RegisterStyles.title}>{role} Registration</Text>
            <Text style={RegisterStyles.subtitle}>
              Create your account to find trainers
            </Text>
          </View>

          {/* FORM CARD WITH BORDER */}
          <View
            style={[
              RegisterStyles.card,
              {
                borderWidth: 1,
                borderColor: "#6366F1",
                width: "100%",
                marginTop: 10,
              },
            ]}
          >
            <Input
              label="First Name"
              icon="person-outline"
              value={firstName}
              onChange={setFirstName}
              onValidate={(v) => validate("firstName", v)}
              error={errors.firstName}
            />

            <Input
              label="Last Name"
              icon="person-outline"
              value={lastName}
              onChange={setLastName}
              onValidate={(v) => validate("lastName", v)}
              error={errors.lastName}
            />

            <Input
              label="Email"
              icon="mail-outline"
              value={email}
              onChange={setEmail}
              onValidate={(v) => validate("email", v)}
              error={errors.email}
            />

            <Input
              label="Phone"
              icon="call-outline"
              value={phone}
              onChange={setPhone}
              onValidate={(v) => validate("phone", v)}
              error={errors.phone}
              keyboardType="numeric"
            />

            <PasswordInput
              label="Password"
              icon="lock-closed-outline"
              value={password}
              onChange={setPassword}
              onValidate={(v) => validate("password", v)}
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity
              style={[
                RegisterStyles.button,
                !isFormValid && { opacity: 0.5 },
              ]}
              disabled={!isFormValid}
              onPress={handleRegister}
            >
              <Text style={RegisterStyles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* SUCCESS MODAL - SHOW USER ID */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#0f1419",
              borderRadius: 16,
              padding: 24,
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#333",
              position: "relative",
            }}
          >
            {/* CLOSE BUTTON */}
            <TouchableOpacity
              onPress={() => setShowSuccessModal(false)}
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "#1a1d2e",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              }}
            >
              <Ionicons name="close" size={24} color="whitesmoke" />
            </TouchableOpacity>

            {/* SUCCESS ICON */}
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: "#10b981",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Ionicons name="checkmark" size={40} color="white" />
            </View>

            {/* TITLE */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "white",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              Registration Successful!
            </Text>

            {/* SUBTITLE */}
            <Text
              style={{
                fontSize: 14,
                color: "#999",
                marginBottom: 24,
                textAlign: "center",
              }}
            >
              Your account has been created. Save your unique ID to login.
            </Text>

            {/* USER ID SECTION */}
            <View
              style={{
                backgroundColor: "#1a1d2e",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
                width: "100%",
                borderWidth: 1,
                borderColor: "#6366f1",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#999",
                  marginBottom: 8,
                  textAlign: "center",
                }}
              >
                Your Unique User ID
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#6366f1",
                  textAlign: "center",
                  fontFamily: "monospace",
                  letterSpacing: 1,
                }}
              >
                {userId}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: "#666",
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                Use this ID to login next time
              </Text>
            </View>

            {/* USER DETAILS SUMMARY */}
            <View
              style={{
                width: "100%",
                backgroundColor: "#1a1d2e",
                borderRadius: 12,
                padding: 16,
                marginBottom: 24,
              }}
            >
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 11, color: "#999" }}>Name</Text>
                <Text style={{ fontSize: 14, color: "white", fontWeight: "600" }}>
                  {firstName} {lastName}
                </Text>
              </View>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 11, color: "#999" }}>Email</Text>
                <Text style={{ fontSize: 14, color: "white", fontWeight: "600" }}>
                  {email}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: 11, color: "#999" }}>Role</Text>
                <Text style={{ fontSize: 14, color: "white", fontWeight: "600" }}>
                  {role}
                </Text>
              </View>
            </View>

            {/* CONTINUE BUTTON */}
            <TouchableOpacity
              onPress={handleContinueAfterSuccess}
              style={{
                backgroundColor: "#6366f1",
                paddingVertical: 14,
                paddingHorizontal: 24,
                borderRadius: 12,
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "700",
                  textAlign: "center",
                }}
              >
                Continue to Dashboard
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/* INPUT COMPONENT */
function Input({
  label,
  icon,
  value,
  onChange,
  onValidate,
  error,
  secure,
  keyboardType,
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
          secureTextEntry={secure}
          keyboardType={keyboardType}
          style={RegisterStyles.input}
        />
      </View>

      {error ? (
        <Text style={{ color: "red", fontSize: 12 }}>{error}</Text>
      ) : null}
    </View>
  );
}

/* PASSWORD INPUT COMPONENT WITH TOGGLE */
function PasswordInput({
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
          secureTextEntry={showPassword ? false : true}
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
