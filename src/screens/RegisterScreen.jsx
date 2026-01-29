import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import RegisterStyles from "../styles/registerStyles";
import { Colors } from "../constants/colors";

export default function RegisterScreen({ route, navigation }) {
  const role = route?.params?.role || "User";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});

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

  const handleRegister = () => {
    if (!isFormValid) return;

    const nextScreen = role === "Trainer" ? "TrainerHome" : "UserDashboard";
    navigation.navigate(nextScreen, {
      userData: {
        firstName,
        lastName,
      //enter
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
      <View style={{ flexDirection: "row", justifyContent: "flex-end", paddingRight: 16, paddingVertical: 10, marginTop: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 20 }}
          scrollEnabled={true}
        >
          {/* CENTERED HEADER TEXT */}
          <View style={{ alignItems: "center", marginBottom: 10, paddingHorizontal: 20 }}>
            <Text style={RegisterStyles.title}>{role} Registration</Text>
            <Text style={RegisterStyles.subtitle}>
              Create your account to find trainers
            </Text>
          </View>

          {/* FORM CARD WITH BORDER */}
          <View style={[RegisterStyles.card, { borderWidth: 1, borderColor: "#6366F1", width: "100%", marginTop: 10 }]}>

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

      {error ? <Text style={{ color: "red", fontSize: 12 }}>{error}</Text> : null}
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

      {error ? <Text style={{ color: "red", fontSize: 12 }}>{error}</Text> : null}
    </View>
  );
}
