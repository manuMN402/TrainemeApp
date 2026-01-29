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
  const [loading, setLoading] = useState(false);

  /* 🔍 REAL-TIME VALIDATION */
  const validate = (field, value) => {
    let error = "";

    // First Name Validation
    if (field === "firstName") {
      if (!value || value.trim().length === 0) {
        error = "First name is required";
      } else if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = "First name can only contain letters";
      } else if (value.trim().length < 2) {
        error = "First name must be at least 2 characters";
      }
    }

    // Last Name Validation
    if (field === "lastName") {
      if (!value || value.trim().length === 0) {
        error = "Last name is required";
      } else if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = "Last name can only contain letters";
      } else if (value.trim().length < 1) {
        error = "Last name must be at least 1 character";
      }
    }

    // Email Validation
    if (field === "email") {
      if (!value || value.trim().length === 0) {
        error = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Please enter a valid email (e.g., user@gmail.com)";
      }
    }

    // Phone Validation
    if (field === "phone") {
      if (!value) {
        error = "Phone number is required";
      } else if (!/^\d*$/.test(value)) {
        error = "Phone can only contain numbers";
      } else if (value.length !== 10) {
        error = `Phone must be exactly 10 digits (${value.length}/10)`;
      }
    }

    // Password Validation
    if (field === "password") {
      if (!value || value.length === 0) {
        error = "Password is required";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters";
      } else if (!/[A-Z]/.test(value)) {
        error = "Password must contain at least 1 uppercase letter";
      } else if (!/[a-z]/.test(value)) {
        error = "Password must contain at least 1 lowercase letter";
      } else if (!/\d/.test(value)) {
        error = "Password must contain at least 1 number";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  // Check if form is valid (all fields filled and no errors)
  const isFormValid =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.length > 0 &&
    password.length > 0 &&
    Object.values(errors).every((e) => e === "");

  // Get password strength indicator
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    
    if (strength <= 2) return { text: "Weak", color: "#ef4444" };
    if (strength === 3 || strength === 4) return { text: "Medium", color: "#f59e0b" };
    return { text: "Strong", color: "#10b981" };
  };

  const handleRegister = async () => {
    if (!isFormValid) {
      console.log("Form not valid", { firstName, lastName, email, phone, password, errors });
      Alert.alert("Form Error", "Please fill all fields correctly and fix any errors.");
      setLoading(false);
      return;
    }

    if (loading) {
      console.log("Already registering, ignoring duplicate click");
      return;
    }

    setLoading(true);

    try {
      console.log("Starting registration...");
      
      // Check if email already exists
      const userExists = await emailExists(email);
      console.log("Email exists check:", userExists);
      
      if (userExists) {
        setLoading(false);
        // Get the user ID for this email
        const existingUser = await getUserByEmail(email);
        const userIdText = existingUser ? `\n\nYour User ID: ${existingUser.userId}` : "";
        
        // Use setTimeout to ensure Alert is shown after loading is set to false
        setTimeout(() => {
          Alert.alert(
            "Email Already Exists",
            `This email is already registered. Please login instead.${userIdText}`,
            [
              { text: "Cancel", onPress: () => {} },
              {
                text: "Go to Login",
                onPress: () => {
                  navigation.navigate("Login");
                },
              },
            ]
          );
        }, 100);
        return;
      }

      // Generate unique user ID
      const generatedUserId = generateUniqueUserId();
      console.log("Generated User ID:", generatedUserId);

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
      console.log("User saved:", saved);
      
      if (saved) {
        // Show success alert with User ID
        const nextScreen = role === "Trainer" ? "TrainerHome" : "UserDashboard";
        
        Alert.alert(
          "Registration Successful!",
          `Your User ID: ${generatedUserId}\n\nSave this ID to login.`,
          [
            {
              text: "Continue",
              onPress: () => {
                navigation.navigate(nextScreen, {
                  userData: {
                    userId: generatedUserId,
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                  },
                  role,
                });
              },
            },
          ]
        );
      } else {
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", error.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
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
                (!isFormValid || loading) && { opacity: 0.5 },
              ]}
              disabled={!isFormValid || loading}
              onPress={handleRegister}
            >
              <Text style={RegisterStyles.buttonText}>
                {loading ? "Registering..." : "Register"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  const isPhoneField = keyboardType === "numeric";

  return (
    <View style={{ marginBottom: 18 }}>
      {/* Label with character count for phone */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={RegisterStyles.label}>{label}</Text>
        {isPhoneField && value && (
          <Text style={{
            fontSize: 11,
            color: value.length === 10 ? "#10b981" : "#ef4444",
            fontWeight: "600"
          }}>
            {value.length}/10
          </Text>
        )}
      </View>

      <View
        style={[
          RegisterStyles.inputBox,
          error && { borderColor: "red", borderWidth: 1.5 },
          !error && value && { borderColor: "#10b981", borderWidth: 1 },
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
          maxLength={isPhoneField ? 10 : undefined}
        />
        {/* Green checkmark for valid fields */}
        {!error && value && (
          <Ionicons name="checkmark-circle" size={18} color="#10b981" />
        )}
      </View>

      {/* Error Message */}
      {error ? (
        <Text style={{ color: "red", fontSize: 12, marginTop: 6 }}>{error}</Text>
      ) : null}
    </View>
  );
}

/* PASSWORD INPUT COMPONENT WITH TOGGLE & STRENGTH */
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
  // Get password strength
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    
    if (strength <= 2) return { text: "Weak", color: "#ef4444" };
    if (strength === 3 || strength === 4) return { text: "Medium", color: "#f59e0b" };
    return { text: "Strong", color: "#10b981" };
  };

  const strength = getPasswordStrength(value);

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

      {/* Password Strength Indicator */}
      {value && !error && strength && (
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6 }}>
          <View
            style={{
              height: 4,
              borderRadius: 2,
              flex: 1,
              backgroundColor: strength.color,
              marginRight: 8,
            }}
          />
          <Text style={{ fontSize: 11, color: strength.color, fontWeight: "600" }}>
            {strength.text}
          </Text>
        </View>
      )}

      {/* Error Message */}
      {error ? (
        <Text style={{ color: "red", fontSize: 12, marginTop: 6 }}>{error}</Text>
      ) : null}
    </View>
  );
}
