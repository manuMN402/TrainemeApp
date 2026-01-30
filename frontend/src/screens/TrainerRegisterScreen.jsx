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
import { validateField, validatePasswordMatch, validateRegistrationForm } from "../utils/validationRules";

export default function TrainerRegisterScreen({ navigation }) {
  const role = "Trainer";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Real-time field validation using validation utilities
  const handleFieldChange = (fieldName, value, stateSetter) => {
    stateSetter(value);
    const fieldError = validateField(fieldName, value, {
      password,
      confirmPassword,
    });
    setErrors((prev) => ({ ...prev, [fieldName]: fieldError }));
  };

  // Validate entire form before submission
  const validateBeforeSubmit = () => {
    const formData = {
      firstName,
      lastName,
      email,
      phone,
      password,
      confirmPassword,
    };

    const { errors: validationErrors, isValid } = validateRegistrationForm(formData);
    setErrors(validationErrors);
    return isValid;
  };

  // Check if form is valid (no errors and all required fields filled)
  const isFormValid = Object.values(errors).every((e) => e === "") &&
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    phone.length > 0 &&
    password.length > 0 &&
    confirmPassword.length > 0;

  const handleRegister = async () => {
    if (!validateBeforeSubmit()) {
      Alert.alert("Form Error", "Please fill all fields correctly and fix any errors.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const userExists = await emailExists(email);
      
      if (userExists) {
        setLoading(false);
        const existingUser = await getUserByEmail(email);
        const userIdText = existingUser ? `\n\nYour User ID: ${existingUser.userId}` : "";
        
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

      const generatedUserId = generateUniqueUserId();

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
        Alert.alert(
          "Registration Successful!",
          `Your User ID: ${generatedUserId}\n\nSave this ID to login.`,
          [
            {
              text: "Continue",
              onPress: () => {
                navigation.navigate("TrainerDashboard", {
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
        setLoading(false);
        Alert.alert("Error", "Failed to create account. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <SafeAreaView style={RegisterStyles.safe}>
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
          <Ionicons name="arrow-back" size={25} color="whitesmoke" />
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
          <View
            style={{
              alignItems: "center",
              marginBottom: 12,
              paddingHorizontal: 16,
            }}
          >
            <Text style={RegisterStyles.title}>{role} Registration</Text>
            <Text style={RegisterStyles.subtitle}>
              Join as a trainer and start earning
            </Text>
          </View>

          <View
            style={[
              RegisterStyles.card,
              {
                borderWidth: 1,
                borderColor: "#6366F1",
                width: "100%",
                marginTop: 8,
                paddingHorizontal: 14,
                paddingVertical: 16,
              },
            ]}
          >
            <Input
              label="First Name"
              icon="person-outline"
              value={firstName}
              onChange={(v) => handleFieldChange("firstName", v, setFirstName)}
              error={errors.firstName}
            />

            <Input
              label="Last Name"
              icon="person-outline"
              value={lastName}
              onChange={(v) => handleFieldChange("lastName", v, setLastName)}
              error={errors.lastName}
            />

            <Input
              label="Email"
              icon="mail-outline"
              value={email}
              onChange={(v) => handleFieldChange("email", v, setEmail)}
              error={errors.email}
            />

            <Input
              label="Phone"
              icon="call-outline"
              value={phone}
              onChange={(v) => handleFieldChange("phone", v, setPhone)}
              error={errors.phone}
              keyboardType="numeric"
            />

            <PasswordInput
              label="Password"
              icon="lock-closed-outline"
              value={password}
              onChange={(v) => handleFieldChange("password", v, setPassword)}
              error={errors.password}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            <PasswordInput
              label="Confirm Password"
              icon="lock-closed-outline"
              value={confirmPassword}
              onChange={(v) => handleFieldChange("confirmPassword", v, setConfirmPassword)}
              error={errors.confirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <TouchableOpacity
              style={[
                RegisterStyles.button,
                (!isFormValid || loading) && { opacity: 0.5 },
              ]}
              disabled={!isFormValid || loading}
              activeOpacity={0.8}
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

function Input({
  label,
  icon,
  value,
  onChange,
  error,
  secure,
  keyboardType,
}) {
  const isPhoneField = keyboardType === "numeric";

  return (
    <View style={{ marginBottom: 12 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={RegisterStyles.label}>{label}</Text>
        {isPhoneField && value ? (
          <Text style={{
            fontSize: 11,
            color: value.length === 10 ? "#10b981" : "#ef4444",
            fontWeight: "600"
          }}>
            {value.length}/10
          </Text>
        ) : null}
      </View>

      <View
        style={[
          RegisterStyles.inputBox,
          {
            borderColor: error ? "#ef4444" : "#6366F1",
          },
        ]}
      >
        <Ionicons name={icon} size={20} color={Colors.primary} />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 12,
            color: "#fff",
            fontSize: 14,
          }}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          value={value}
          onChangeText={onChange}
          secureTextEntry={secure}
          keyboardType={keyboardType}
        />
      </View>

      {error && (
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 4 }}>
          <Ionicons name="alert-circle" size={12} color="#ef4444" />
          <Text style={{ color: "#ef4444", fontSize: 11 }}>{error}</Text>
        </View>
      )}
    </View>
  );
}

function PasswordInput({
  label,
  icon,
  value,
  onChange,
  error,
  showPassword,
  onTogglePassword,
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={RegisterStyles.label}>{label}</Text>

      <View
        style={[
          RegisterStyles.inputBox,
          {
            borderColor: error ? "#ef4444" : "#6366F1",
          },
        ]}
      >
        <Ionicons name={icon} size={20} color={Colors.primary} />
        <TextInput
          style={{
            flex: 1,
            marginLeft: 12,
            color: "#fff",
            fontSize: 14,
          }}
          placeholder={`Enter ${label.toLowerCase()}`}
          placeholderTextColor="rgba(255, 255, 255, 0.3)"
          value={value}
          onChangeText={onChange}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={onTogglePassword}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            color="rgba(255, 255, 255, 0.5)"
          />
        </TouchableOpacity>
      </View>

      {error && (
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 4 }}>
          <Ionicons name="alert-circle" size={12} color="#ef4444" />
          <Text style={{ color: "#ef4444", fontSize: 11 }}>{error}</Text>
        </View>
      )}
    </View>
  );
}
