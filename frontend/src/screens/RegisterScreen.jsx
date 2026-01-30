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
import { API_BASE_URL } from "../config/api";

export default function RegisterScreen({ navigation }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* VALIDATION */
  const validate = (field, value) => {
    let error = "";

    if (field === "firstName" && value.trim().length < 2) {
      error = "First name must be at least 2 characters";
    }

    if (field === "lastName" && value.trim().length < 1) {
      error = "Last name is required";
    }

    if (
      field === "email" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ) {
      error = "Invalid email";
    }

    if (field === "phone" && !/^\d{10}$/.test(value)) {
      error = "Phone must be exactly 10 digits";
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
    /^\d{10}$/.test(phone) &&
    password &&
    Object.values(errors).every((e) => !e);

  // 🔥 REGISTER API CALL
  const handleRegister = async () => {
    if (!isFormValid || loading) {
      Alert.alert("Error", "Please fill all fields correctly");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      Alert.alert(
        "Success",
        "Registration successful",
        [
          {
            text: "Go to Login",
            onPress: () => navigation.navigate("Login"),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={RegisterStyles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={RegisterStyles.title}>Register</Text>

          <Input
            label="First Name"
            value={firstName}
            onChange={setFirstName}
            onValidate={(v) => validate("firstName", v)}
            error={errors.firstName}
            icon="person-outline"
          />

          <Input
            label="Last Name"
            value={lastName}
            onChange={setLastName}
            onValidate={(v) => validate("lastName", v)}
            error={errors.lastName}
            icon="person-outline"
          />

          <Input
            label="Email"
            value={email}
            onChange={setEmail}
            onValidate={(v) => validate("email", v)}
            error={errors.email}
            icon="mail-outline"
          />

          <Input
            label="Phone"
            value={phone}
            onChange={setPhone}
            onValidate={(v) => validate("phone", v)}
            error={errors.phone}
            icon="call-outline"
            keyboardType="numeric"
          />

          <PasswordInput
            label="Password"
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
  keyboardType,
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={RegisterStyles.label}>{label}</Text>
      <View
        style={[
          RegisterStyles.inputBox,
          error && { borderColor: "red" },
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
          keyboardType={keyboardType}
          style={RegisterStyles.input}
        />
      </View>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}

/* PASSWORD INPUT */
function PasswordInput({
  label,
  value,
  onChange,
  onValidate,
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
          error && { borderColor: "red" },
        ]}
      >
        <Ionicons name="lock-closed-outline" size={18} color={Colors.muted} />
        <TextInput
          value={value}
          onChangeText={(v) => {
            onChange(v);
            onValidate(v);
          }}
          secureTextEntry={!showPassword}
          placeholder={label}
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
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}
