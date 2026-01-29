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
import { Colors } from "../constants/colors";
import { generateUniqueUserId } from "../utils/idGenerator";
import { emailExists, saveUser } from "../utils/userStorage";
import { SPACING, FONT_SIZES } from "../utils/responsiveDesign";

export default function TrainerRegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    expertise: "",
    hourlyRate: "",
    certifications: "",
    yearsOfExperience: "",
    bio: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* 🔍 REAL-TIME VALIDATION */
  const validate = (field, value) => {
    let error = "";

    // Full Name (First Name) Validation
    if (field === "firstName") {
      if (!value || value.trim().length === 0) {
        error = "Full name is required";
      } else if (value.trim().length < 2) {
        error = "Name must be at least 2 characters";
      } else if (value.trim().length > 50) {
        error = "Name must not exceed 50 characters";
      } else if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = "Name can only contain letters and spaces";
      }
    }

    // Email Validation
    if (field === "email") {
      if (!value || value.trim().length === 0) {
        error = "Email is required";
      } else if (value.trim().length > 100) {
        error = "Email is too long";
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          error = "Please enter a valid email address";
        } else if (!value.includes(".com") && !value.includes(".org") && !value.includes(".net") && !value.includes(".co")) {
          error = "Email must have a valid domain";
        }
      }
    }

    // Phone Validation
    if (field === "phone") {
      if (!value || value.trim().length === 0) {
        error = "Phone number is required";
      } else {
        const cleanPhone = value.replace(/\D/g, "");
        if (cleanPhone.length !== 10) {
          error = "Phone number must be 10 digits";
        } else if (!/^[6-9]/.test(cleanPhone)) {
          error = "Phone number must start with 6-9";
        }
      }
    }

    // Skill Category / Expertise Validation
    if (field === "expertise") {
      if (!value || value.trim().length === 0) {
        error = "Skill category is required";
      } else if (value.trim().length < 2) {
        error = "Skill category must be at least 2 characters";
      } else if (value.trim().length > 50) {
        error = "Skill category must not exceed 50 characters";
      } else if (!/^[a-zA-Z\s]*$/.test(value)) {
        error = "Skill category can only contain letters";
      }
    }

    // Experience Validation
    if (field === "yearsOfExperience") {
      if (!value || value.trim().length === 0) {
        error = "Experience is required";
      } else {
        const experience = parseInt(value);
        if (isNaN(experience)) {
          error = "Please enter a valid number";
        } else if (experience < 0) {
          error = "Experience cannot be negative";
        } else if (experience > 60) {
          error = "Please enter a realistic number";
        }
      }
    }

    // Price Validation
    if (field === "hourlyRate") {
      if (!value || value.trim().length === 0) {
        error = "Price per session is required";
      } else {
        const price = parseFloat(value);
        if (isNaN(price)) {
          error = "Please enter a valid number";
        } else if (price <= 0) {
          error = "Price must be greater than 0";
        } else if (price < 10) {
          error = "Minimum price should be $10";
        } else if (price > 10000) {
          error = "Price seems too high";
        }
      }
    }

    // Password Validation
    if (field === "password") {
      if (!value || value.length === 0) {
        error = "Password is required";
      } else if (value.length < 8) {
        error = "Password must be at least 8 characters";
      } else if (value.length > 50) {
        error = "Password must not exceed 50 characters";
      } else if (!/[A-Z]/.test(value)) {
        error = "Password must contain at least one uppercase letter (A-Z)";
      } else if (!/[a-z]/.test(value)) {
        error = "Password must contain at least one lowercase letter (a-z)";
      } else if (!/[0-9]/.test(value)) {
        error = "Password must contain at least one number (0-9)";
      } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        error = "Password must contain at least one special character (!@#$%^&*)";
      }
    }

    // Certifications Validation (Optional)
    if (field === "certifications" && value) {
      if (value.length > 200) {
        error = "Certifications text is too long";
      }
    }

    return error;
  };

  /* ✅ VALIDATE ALL FIELDS */
  const validateAllFields = () => {
    const newErrors = {};

    const requiredFields = [
      "firstName",
      "email",
      "phone",
      "expertise",
      "yearsOfExperience",
      "hourlyRate",
      "password",
    ];

    requiredFields.forEach((field) => {
      const error = validate(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* 🔄 UPDATE FORM FIELD */
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field if it exists
    if (errors[field]) {
      const newError = validate(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: newError,
      }));
    }
  };

  /* 📝 HANDLE REGISTRATION */
  const handleRegister = async () => {
    if (!validateAllFields()) {
      const errorList = Object.values(errors).filter(e => e).join("\n• ");
      Alert.alert(
        "❌ Validation Error",
        "Please fix the following errors:\n\n• " + errorList,
        [{ text: "OK" }]
      );
      return;
    }

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check if email already exists
      if (await emailExists(formData.email)) {
        Alert.alert(
          "⚠️ Email Already Registered",
          "This email is already registered. Please login with your credentials or use a different email."
        );
        setLoading(false);
        return;
      }

      // Create trainer user object
      const trainerId = generateUniqueUserId();
      const trainerUser = {
        id: trainerId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: "trainer",
        expertise: formData.expertise,
        hourlyRate: parseFloat(formData.hourlyRate),
        certifications: formData.certifications || "Not provided",
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        bio: formData.bio || "",
        registeredAt: new Date().toISOString(),
        profilePicture: "https://via.placeholder.com/150?text=Trainer",
        rating: 5.0,
        totalReviews: 0,
        isVerified: false,
        isOnline: false,
      };

      // Save trainer to storage
      await saveUser(trainerUser);

      // Success message
      Alert.alert(
        "✅ Registration Successful",
        `Welcome to TraineMe!\n\nYour trainer profile has been created.\n\nTrainer ID: ${trainerId}`,
        [
          {
            text: "Go to Dashboard",
            onPress: () => {
              setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                password: "",
                expertise: "",
                hourlyRate: "",
                certifications: "",
                yearsOfExperience: "",
                bio: "",
              });
              navigation.replace("TrainerDashboard");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.");
      console.error("Registration error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* 🎨 HELPER FUNCTION: Render Input Field */
  const renderInput = (label, field, placeholder, keyboardType = "default", multiline = false) => {
    const isError = !!errors[field];
    return (
      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: "#fff", fontWeight: "600", marginBottom: 8, fontSize: FONT_SIZES.BODY_M }}>
          {label}
        </Text>
        <TextInput
          style={{
            backgroundColor: "#1a1a2e",
            borderWidth: 1.5,
            borderColor: isError ? "#ef4444" : "#6366f1",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            color: "#fff",
            fontSize: FONT_SIZES.BODY_S,
          }}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={formData[field]}
          onChangeText={(value) => handleFieldChange(field, value)}
          keyboardType={keyboardType}
          secureTextEntry={field === "password" && !showPassword}
          editable={!loading}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
        />
        {isError && (
          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 6 }}>
            <Ionicons name="alert-circle" size={14} color="#ef4444" />
            <Text style={{ color: "#ef4444", fontSize: FONT_SIZES.BODY_XS }}>{errors[field]}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f0f1e" }}>
      <ScrollView
        contentContainerStyle={{ paddingVertical: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Card */}
        <View style={{ marginHorizontal: 16, marginBottom: 24 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginBottom: 16 }}>
            <Ionicons name="chevron-back" size={28} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={{ fontSize: FONT_SIZES.HEADING_L, fontWeight: "700", color: "#fff", marginBottom: 8 }}>
            Trainer Registration
          </Text>
          <Text style={{ fontSize: FONT_SIZES.BODY_M, color: "rgba(255,255,255,0.6)" }}>
            Join as a trainer and start earning
          </Text>
        </View>

        {/* Form Card Container */}
        <View style={{ marginHorizontal: 16, paddingHorizontal: 20, paddingVertical: 24, backgroundColor: "#1a1a2e", borderRadius: 20, gap: 16 }}>
          
          {/* Full Name */}
          <View>
            <Text style={{ fontSize: FONT_SIZES.BODY_M, fontWeight: "600", color: "#fff", marginBottom: 8 }}>
              Full Name
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f0f1e", borderRadius: 12, borderWidth: 1.5, borderColor: errors.firstName ? "#ef4444" : "rgba(99, 102, 241, 0.3)", paddingHorizontal: 12, height: 48 }}>
              <Ionicons name="person-outline" size={20} color={Colors.primary} />
              <TextInput
                style={{ flex: 1, marginLeft: 10, color: "#fff", fontSize: FONT_SIZES.BODY_S }}
                placeholder="e.g., Jane Smith"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.firstName}
                onChangeText={(value) => handleFieldChange("firstName", value)}
                editable={!loading}
              />
            </View>
            {errors.firstName && <Text style={{ color: "#ef4444", fontSize: FONT_SIZES.BODY_XS, marginTop: 4 }}>{errors.firstName}</Text>}
          </View>

          {/* Email */}
          <View>
            <Text style={{ fontSize: FONT_SIZES.BODY_M, fontWeight: "600", color: "#fff", marginBottom: 8 }}>
              Email
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f0f1e", borderRadius: 12, borderWidth: 1.5, borderColor: errors.email ? "#ef4444" : "rgba(99, 102, 241, 0.3)", paddingHorizontal: 12, height: 48 }}>
              <Ionicons name="mail-outline" size={20} color={Colors.primary} />
              <TextInput
                style={{ flex: 1, marginLeft: 10, color: "#fff", fontSize: FONT_SIZES.BODY_S }}
                placeholder="jane@example.com"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.email}
                onChangeText={(value) => handleFieldChange("email", value)}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
            {errors.email && <Text style={{ color: "#ef4444", fontSize: FONT_SIZES.BODY_XS, marginTop: 4 }}>{errors.email}</Text>}
          </View>

          {/* Phone */}
          <View>
            <Text style={{ fontSize: FONT_SIZES.BODY_M, fontWeight: "600", color: "#fff", marginBottom: 8 }}>
              Phone
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f0f1e", borderRadius: 12, borderWidth: 1.5, borderColor: errors.phone ? "#ef4444" : "rgba(99, 102, 241, 0.3)", paddingHorizontal: 12, height: 48 }}>
              <Ionicons name="call-outline" size={20} color={Colors.primary} />
              <TextInput
                style={{ flex: 1, marginLeft: 10, color: "#fff", fontSize: FONT_SIZES.BODY_S }}
                placeholder="+1 234 567 8900"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.phone}
                onChangeText={(value) => handleFieldChange("phone", value)}
                keyboardType="phone-pad"
                editable={!loading}
              />
            </View>
            {errors.phone && <Text style={{ color: "#ef4444", fontSize: FONT_SIZES.BODY_XS, marginTop: 4 }}>{errors.phone}</Text>}
          </View>

          {/* Skill Category / Expertise */}
          <View>
            <Text style={{ fontSize: FONT_SIZES.BODY_M, fontWeight: "600", color: "#fff", marginBottom: 8 }}>
              Skill Category
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f0f1e", borderRadius: 12, borderWidth: 1.5, borderColor: errors.expertise ? "#ef4444" : "rgba(99, 102, 241, 0.3)", paddingHorizontal: 12, height: 48 }}>
              <Ionicons name="school-outline" size={20} color={Colors.primary} />
              <TextInput
                style={{ flex: 1, marginLeft: 10, color: "#fff", fontSize: FONT_SIZES.BODY_S }}
                placeholder="Fitness"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.expertise}
                onChangeText={(value) => handleFieldChange("expertise", value)}
                editable={!loading}
              />
            </View>
            {errors.expertise && <Text style={{ color: "#ef4444", fontSize: FONT_SIZES.BODY_XS, marginTop: 4 }}>{errors.expertise}</Text>}
          </View>

          {/* Experience */}
          <View>
            <Text style={{ fontSize: FONT_SIZES.BODY_M, fontWeight: "600", color: "#fff", marginBottom: 8 }}>
              Experience (years)
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f0f1e", borderRadius: 12, borderWidth: 1.5, borderColor: errors.yearsOfExperience ? "#ef4444" : "rgba(99, 102, 241, 0.3)", paddingHorizontal: 12, height: 48 }}>
              <Ionicons name="medal-outline" size={20} color={Colors.primary} />
              <TextInput
                style={{ flex: 1, marginLeft: 10, color: "#fff", fontSize: FONT_SIZES.BODY_S }}
                placeholder="5"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.yearsOfExperience}
                onChangeText={(value) => handleFieldChange("yearsOfExperience", value)}
                keyboardType="number-pad"
                editable={!loading}
              />
            </View>
            {errors.yearsOfExperience && <Text style={{ color: "#ef4444", fontSize: FONT_SIZES.BODY_XS, marginTop: 4 }}>{errors.yearsOfExperience}</Text>}
          </View>

          {/* Location */}
          <View>
            <Text style={{ fontSize: FONT_SIZES.BODY_M, fontWeight: "600", color: "#fff", marginBottom: 8 }}>
              Location
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f0f1e", borderRadius: 12, borderWidth: 1.5, borderColor: "rgba(99, 102, 241, 0.3)", paddingHorizontal: 12, height: 48 }}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
              <TextInput
                style={{ flex: 1, marginLeft: 10, color: "#fff", fontSize: FONT_SIZES.BODY_S }}
                placeholder="Online"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.bio}
                onChangeText={(value) => handleFieldChange("bio", value)}
                editable={!loading}
              />
            </View>
          </View>

          {/* Price per Session */}
          <View>
            <Text style={{ fontSize: FONT_SIZES.BODY_M, fontWeight: "600", color: "#fff", marginBottom: 8 }}>
              Price per Session ($)
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f0f1e", borderRadius: 12, borderWidth: 1.5, borderColor: errors.hourlyRate ? "#ef4444" : "rgba(99, 102, 241, 0.3)", paddingHorizontal: 12, height: 48 }}>
              <Ionicons name="cash-outline" size={20} color={Colors.primary} />
              <TextInput
                style={{ flex: 1, marginLeft: 10, color: "#fff", fontSize: FONT_SIZES.BODY_S }}
                placeholder="50"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.hourlyRate}
                onChangeText={(value) => handleFieldChange("hourlyRate", value)}
                keyboardType="decimal-pad"
                editable={!loading}
              />
            </View>
            {errors.hourlyRate && <Text style={{ color: "#ef4444", fontSize: FONT_SIZES.BODY_XS, marginTop: 4 }}>{errors.hourlyRate}</Text>}
          </View>

          {/* Password */}
          <View>
            <Text style={{ fontSize: FONT_SIZES.BODY_M, fontWeight: "600", color: "#fff", marginBottom: 8 }}>
              Password
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f0f1e", borderRadius: 12, borderWidth: 1.5, borderColor: errors.password ? "#ef4444" : "rgba(99, 102, 241, 0.3)", paddingHorizontal: 12, height: 48 }}>
              <Ionicons name="lock-closed-outline" size={20} color={Colors.primary} />
              <TextInput
                style={{ flex: 1, marginLeft: 10, color: "#fff", fontSize: FONT_SIZES.BODY_S }}
                placeholder="••••••••"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={formData.password}
                onChangeText={(value) => handleFieldChange("password", value)}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={18} color="rgba(255,255,255,0.5)" />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={{ color: "#ef4444", fontSize: FONT_SIZES.BODY_XS, marginTop: 4 }}>{errors.password}</Text>}
            
            {/* Password Requirements Checklist */}
            {formData.password && (
              <View style={{ marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: "rgba(99, 102, 241, 0.1)", borderRadius: 8, borderLeftWidth: 3, borderLeftColor: Colors.primary }}>
                <Text style={{ fontSize: FONT_SIZES.BODY_XS, color: "rgba(255,255,255,0.7)", marginBottom: 6 }}>Password Requirements:</Text>
                
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <Ionicons name={formData.password.length >= 8 ? "checkmark-circle" : "radio-button-off"} size={14} color={formData.password.length >= 8 ? "#10b981" : "rgba(255,255,255,0.3)"} />
                  <Text style={{ fontSize: FONT_SIZES.BODY_XS, color: formData.password.length >= 8 ? "#10b981" : "rgba(255,255,255,0.5)", marginLeft: 6 }}>At least 8 characters</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <Ionicons name={/[A-Z]/.test(formData.password) ? "checkmark-circle" : "radio-button-off"} size={14} color={/[A-Z]/.test(formData.password) ? "#10b981" : "rgba(255,255,255,0.3)"} />
                  <Text style={{ fontSize: FONT_SIZES.BODY_XS, color: /[A-Z]/.test(formData.password) ? "#10b981" : "rgba(255,255,255,0.5)", marginLeft: 6 }}>One uppercase letter (A-Z)</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <Ionicons name={/[a-z]/.test(formData.password) ? "checkmark-circle" : "radio-button-off"} size={14} color={/[a-z]/.test(formData.password) ? "#10b981" : "rgba(255,255,255,0.3)"} />
                  <Text style={{ fontSize: FONT_SIZES.BODY_XS, color: /[a-z]/.test(formData.password) ? "#10b981" : "rgba(255,255,255,0.5)", marginLeft: 6 }}>One lowercase letter (a-z)</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                  <Ionicons name={/[0-9]/.test(formData.password) ? "checkmark-circle" : "radio-button-off"} size={14} color={/[0-9]/.test(formData.password) ? "#10b981" : "rgba(255,255,255,0.3)"} />
                  <Text style={{ fontSize: FONT_SIZES.BODY_XS, color: /[0-9]/.test(formData.password) ? "#10b981" : "rgba(255,255,255,0.5)", marginLeft: 6 }}>One number (0-9)</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? "checkmark-circle" : "radio-button-off"} size={14} color={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? "#10b981" : "rgba(255,255,255,0.3)"} />
                  <Text style={{ fontSize: FONT_SIZES.BODY_XS, color: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? "#10b981" : "rgba(255,255,255,0.5)", marginLeft: 6 }}>One special character (!@#$)</Text>
                </View>
              </View>
            )}
          </View>

          {/* Additional Fields in Collapsed Mode */}
          {(formData.firstName && formData.email) && (
            <>
              {/* Certifications */}
              <View>
                <Text style={{ fontSize: FONT_SIZES.BODY_M, fontWeight: "600", color: "#fff", marginBottom: 8 }}>
                  Certifications (Optional)
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#0f0f1e", borderRadius: 12, borderWidth: 1.5, borderColor: "rgba(99, 102, 241, 0.3)", paddingHorizontal: 12, height: 48 }}>
                  <Ionicons name="document-outline" size={20} color={Colors.primary} />
                  <TextInput
                    style={{ flex: 1, marginLeft: 10, color: "#fff", fontSize: FONT_SIZES.BODY_S }}
                    placeholder="ISSA, ACE"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={formData.certifications}
                    onChangeText={(value) => handleFieldChange("certifications", value)}
                    editable={!loading}
                  />
                </View>
              </View>
            </>
          )}

          {/* Register Button */}
          <TouchableOpacity
            style={{
              backgroundColor: Colors.primary,
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 8,
              opacity: loading ? 0.6 : 1,
            }}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: FONT_SIZES.BODY_M }}>
                Register
              </Text>
            )}
          </TouchableOpacity>

          {/* Already have account */}
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 4, marginTop: 8 }}>
            <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: FONT_SIZES.BODY_S }}>
              Already have account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: Colors.primary, fontSize: FONT_SIZES.BODY_S, fontWeight: "600" }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms Text */}
        <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: FONT_SIZES.BODY_XS, textAlign: "center", marginTop: 20, marginHorizontal: 16 }}>
          By registering, you agree to our Terms & Conditions
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
