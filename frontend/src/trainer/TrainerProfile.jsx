import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { trainerStyles } from "../styles/trainerStyles";
import { Colors } from "../constants/colors";
import { SPACING, FONT_SIZES } from "../utils/responsiveDesign";
import {
  validateField,
  validateExpertiseSelection,
  validateAvailabilityDays,
  validateTimeSlots,
  validateTrainerProfileForm,
} from "../utils/validationRules";

const EXPERTISE_OPTIONS = [
  "Fitness",
  "Yoga",
  "Zumba",
  "Personal Training",
  "Weight Loss",
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TIME_SLOTS = [
  "6:00 AM - 9:00 AM",
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM",
];

export default function TrainerProfile({ route, navigation }) {
  const trainerData = route?.params?.userData || {};

  // Basic Info
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState(trainerData.firstName
    ? `${trainerData.firstName} ${trainerData.lastName}`
    : "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  // Expertise
  const [selectedExpertise, setSelectedExpertise] = useState([]);
  const [yearsExperience, setYearsExperience] = useState("");
  const [certification, setCertification] = useState(null);

  // Availability
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  // Pricing
  const [pricePerSession, setPricePerSession] = useState("");
  const [monthlyPlan, setMonthlyPlan] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Calculate weighted completion percentage (Basic=30%, Expertise=30%, Availability=20%, Pricing=20%)
  const getCompletionPercentage = () => {
    // Basic Info: 30% (Name, Bio, Location, Profile Image)
    const basicInfoComplete =
      (fullName.trim() ? 0.25 : 0) +
      (bio.trim() ? 0.25 : 0) +
      (location.trim() ? 0.25 : 0) +
      (profileImage ? 0.25 : 0);
    const basicInfoPercentage = basicInfoComplete * 30;

    // Expertise: 30% (Selected Expertise, Years of Experience, optional Certification)
    const expertiseComplete =
      (selectedExpertise.length > 0 ? 0.5 : 0) +
      (yearsExperience.trim() ? 0.5 : 0);
    const expertisePercentage = expertiseComplete * 30;

    // Availability: 20% (Selected Days, Time Slots)
    const availabilityComplete =
      (selectedDays.length > 0 ? 0.5 : 0) +
      (selectedTimeSlots.length > 0 ? 0.5 : 0);
    const availabilityPercentage = availabilityComplete * 20;

    // Pricing: 20% (Price per Session, optional Monthly Plan)
    const pricingComplete = pricePerSession.trim() ? 1 : 0;
    const pricingPercentage = pricingComplete * 20;

    const totalPercentage =
      basicInfoPercentage + expertisePercentage + availabilityPercentage + pricingPercentage;

    return Math.round(totalPercentage);
  };

  // Check if profile is ready for accepting bookings
  const isProfileCompleted = getCompletionPercentage() >= 70;

  // Real-time field validation
  const handleFieldChange = (fieldName, value, stateSetter) => {
    stateSetter(value);
    const error = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  // Validate entire form before submission
  const validateBeforeSubmit = () => {
    const profileData = {
      fullName,
      bio,
      location,
      selectedExpertise,
      yearsExperience,
      selectedDays,
      selectedTimeSlots,
      pricePerSession,
    };

    const { errors: validationErrors, isValid } = validateTrainerProfileForm(profileData);
    setErrors(validationErrors);
    return isValid;
  };

  const toggleExpertise = (skill) => {
    setSelectedExpertise((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleTimeSlot = (slot) => {
    setSelectedTimeSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  const handleProfileImageUpload = () => {
    // Placeholder for image picker
    setProfileImage("https://via.placeholder.com/150");
    Alert.alert("Image Uploaded", "Profile photo updated successfully");
  };

  const handleCertificationUpload = () => {
    // Placeholder for file upload
    setCertification("certificate.pdf");
    Alert.alert("File Uploaded", "Certification uploaded successfully");
  };

  const handleSaveProfile = async () => {
    if (!validateBeforeSubmit()) {
      Alert.alert("Validation Error", "Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const profileData = {
        fullName,
        bio,
        location,
        expertise: selectedExpertise,
        yearsExperience,
        certification,
        availableDays: selectedDays,
        timeSlots: selectedTimeSlots,
        isOnline,
        pricePerSession,
        monthlyPlan,
        profileImage,
      };

      console.log("Profile Data:", profileData);

      setLoading(false);
      Alert.alert("Success", "Profile updated successfully!", [
        {
          text: "Continue",
          onPress: () => {
            navigation.navigate("TrainerHome");
          },
        },
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", error.message || "Failed to save profile");
    }
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      {/* Warning Banner for Incomplete Profile */}
      {!isProfileCompleted && (
        <View
          style={{
            backgroundColor: "#f59e0b",
            paddingHorizontal: SPACING.L,
            paddingVertical: SPACING.M,
            flexDirection: "row",
            alignItems: "center",
            gap: SPACING.M,
          }}
        >
          <Ionicons name="alert-circle" size={20} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: FONT_SIZES.BODY_M,
              }}
            >
              Profile Incomplete
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: FONT_SIZES.BODY_S,
                opacity: 0.9,
              }}
            >
              Complete 70% to accept bookings
            </Text>
          </View>
        </View>
      )}

      {/* Success Banner for Complete Profile */}
      {isProfileCompleted && (
        <View
          style={{
            backgroundColor: "#10b981",
            paddingHorizontal: SPACING.L,
            paddingVertical: SPACING.M,
            flexDirection: "row",
            alignItems: "center",
            gap: SPACING.M,
          }}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "#fff",
                fontWeight: "700",
                fontSize: FONT_SIZES.BODY_M,
              }}
            >
              Profile Complete
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: FONT_SIZES.BODY_S,
                opacity: 0.9,
              }}
            >
              Ready to accept bookings
            </Text>
          </View>
        </View>
      )}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: SPACING.L,
          paddingVertical: SPACING.M,
        }}
      >
        <Text style={{ color: Colors.text, fontSize: FONT_SIZES.HEADING_L, fontWeight: "700" }}>
          Complete Profile
        </Text>
        <View style={{ alignItems: "center" }}>
          <Text style={{ color: Colors.primary, fontSize: FONT_SIZES.BODY_L, fontWeight: "700" }}>
            {completionPercentage}%
          </Text>
          <View
            style={{
              width: 50,
              height: 6,
              backgroundColor: Colors.border,
              borderRadius: 3,
              marginTop: 4,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${completionPercentage}%`,
                height: "100%",
                backgroundColor: isProfileCompleted ? "#10b981" : Colors.primary,
              }}
            />
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: SPACING.L,
            paddingBottom: SPACING.XXL,
          }}
          scrollEnabled={true}
        >
          {/* BASIC INFO SECTION */}
          <View style={trainerStyles.section}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: SPACING.L,
              }}
            >
              <Ionicons name="person-circle" size={24} color={Colors.primary} />
              <Text style={trainerStyles.heading}>Basic Information</Text>
            </View>

            {/* Profile Photo */}
            <View style={{ marginBottom: SPACING.L, alignItems: "center" }}>
              <View
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 50,
                  backgroundColor: Colors.border,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: SPACING.M,
                }}
              >
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={{ width: 100, height: 100, borderRadius: 50 }}
                  />
                ) : (
                  <Ionicons name="camera" size={40} color={Colors.muted} />
                )}
              </View>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.primary,
                  paddingHorizontal: SPACING.L,
                  paddingVertical: SPACING.S,
                  borderRadius: SPACING.RADIUS_M,
                }}
                onPress={handleProfileImageUpload}
              >
                <Text style={trainerStyles.buttonText}>Upload Photo</Text>
              </TouchableOpacity>
            </View>

            {/* Full Name */}
            <View style={{ marginBottom: SPACING.L }}>
              <Text style={trainerStyles.subHeading}>Full Name</Text>
              <TextInput
                style={{
                  backgroundColor: Colors.bg,
                  color: Colors.text,
                  padding: SPACING.M,
                  borderRadius: SPACING.RADIUS_M,
                  borderWidth: 1,
                  borderColor: errors.fullName ? "#ef4444" : Colors.border,
                  fontSize: FONT_SIZES.BODY_M,
                }}
                placeholder="Enter full name"
                placeholderTextColor={Colors.muted}
                value={fullName}
                onChangeText={(v) => handleFieldChange("fullName", v, setFullName)}
              />
              {errors.fullName && (
                <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                  {errors.fullName}
                </Text>
              )}
            </View>

            {/* Bio */}
            <View style={{ marginBottom: SPACING.L }}>
              <Text style={trainerStyles.subHeading}>Bio / About Me</Text>
              <TextInput
                style={{
                  backgroundColor: Colors.bg,
                  color: Colors.text,
                  padding: SPACING.M,
                  borderRadius: SPACING.RADIUS_M,
                  borderWidth: 1,
                  borderColor: errors.bio ? "#ef4444" : Colors.border,
                  fontSize: FONT_SIZES.BODY_M,
                  minHeight: 100,
                  textAlignVertical: "top",
                }}
                placeholder="Tell trainers about yourself"
                placeholderTextColor={Colors.muted}
                value={bio}
                onChangeText={(v) => handleFieldChange("bio", v, setBio)}
                multiline
                numberOfLines={4}
              />
              {errors.bio && (
                <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                  {errors.bio}
                </Text>
              )}
            </View>

            {/* Location */}
            <View>
              <Text style={trainerStyles.subHeading}>Location (City)</Text>
              <TextInput
                style={{
                  backgroundColor: Colors.bg,
                  color: Colors.text,
                  padding: SPACING.M,
                  borderRadius: SPACING.RADIUS_M,
                  borderWidth: 1,
                  borderColor: errors.location ? "#ef4444" : Colors.border,
                  fontSize: FONT_SIZES.BODY_M,
                }}
                placeholder="Enter your city"
                placeholderTextColor={Colors.muted}
                value={location}
                onChangeText={(v) => handleFieldChange("location", v, setLocation)}
              />
              {errors.location && (
                <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                  {errors.location}
                </Text>
              )}
            </View>
          </View>

          {/* EXPERTISE SECTION */}
          <View style={trainerStyles.section}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: SPACING.L,
              }}
            >
              <Ionicons name="school" size={24} color={Colors.primary} />
              <Text style={trainerStyles.heading}>Expertise</Text>
            </View>

            {/* Multi-select Expertise */}
            <View style={{ marginBottom: SPACING.L }}>
              <Text style={trainerStyles.subHeading}>Select Expertise Areas</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SPACING.S }}>
                {EXPERTISE_OPTIONS.map((skill) => (
                  <TouchableOpacity
                    key={skill}
                    style={{
                      backgroundColor: selectedExpertise.includes(skill)
                        ? Colors.primary
                        : Colors.bg,
                      borderWidth: 1,
                      borderColor: selectedExpertise.includes(skill)
                        ? Colors.primary
                        : Colors.border,
                      paddingHorizontal: SPACING.M,
                      paddingVertical: SPACING.S,
                      borderRadius: SPACING.RADIUS_L,
                    }}
                    onPress={() => toggleExpertise(skill)}
                  >
                    <Text
                      style={{
                        color: selectedExpertise.includes(skill)
                          ? "#fff"
                          : Colors.text,
                        fontWeight: "600",
                        fontSize: FONT_SIZES.BODY_M,
                      }}
                    >
                      {skill}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.expertise && (
                <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>
                  {errors.expertise}
                </Text>
              )}
            </View>

            {/* Years of Experience */}
            <View style={{ marginBottom: SPACING.L }}>
              <Text style={trainerStyles.subHeading}>Years of Experience</Text>
              <TextInput
                style={{
                  backgroundColor: Colors.bg,
                  color: Colors.text,
                  padding: SPACING.M,
                  borderRadius: SPACING.RADIUS_M,
                  borderWidth: 1,
                  borderColor: errors.yearsExperience ? "#ef4444" : Colors.border,
                  fontSize: FONT_SIZES.BODY_M,
                }}
                placeholder="e.g., 5"
                placeholderTextColor={Colors.muted}
                value={yearsExperience}
                onChangeText={(v) => handleFieldChange("yearsExperience", v, setYearsExperience)}
                keyboardType="numeric"
              />
              {errors.yearsExperience && (
                <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                  {errors.yearsExperience}
                </Text>
              )}
            </View>

            {/* Certification Upload */}
            <View>
              <Text style={trainerStyles.subHeading}>Certification (Optional)</Text>
              <TouchableOpacity
                style={{
                  backgroundColor: Colors.bg,
                  borderWidth: 2,
                  borderColor: Colors.border,
                  borderStyle: "dashed",
                  borderRadius: SPACING.RADIUS_M,
                  padding: SPACING.L,
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={handleCertificationUpload}
              >
                <Ionicons
                  name={certification ? "checkmark-circle" : "cloud-upload-outline"}
                  size={32}
                  color={certification ? "#10b981" : Colors.primary}
                />
                <Text
                  style={{
                    color: Colors.text,
                    marginTop: SPACING.S,
                    fontWeight: "600",
                  }}
                >
                  {certification ? certification : "Upload Certificate"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* AVAILABILITY SECTION */}
          <View style={trainerStyles.section}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: SPACING.L,
              }}
            >
              <Ionicons name="calendar" size={24} color={Colors.primary} />
              <Text style={trainerStyles.heading}>Availability</Text>
            </View>

            {/* Available Days */}
            <View style={{ marginBottom: SPACING.L }}>
              <Text style={trainerStyles.subHeading}>Available Days</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: SPACING.S }}>
                {DAYS_OF_WEEK.map((day) => (
                  <TouchableOpacity
                    key={day}
                    style={{
                      backgroundColor: selectedDays.includes(day)
                        ? Colors.primary
                        : Colors.bg,
                      borderWidth: 1,
                      borderColor: selectedDays.includes(day)
                        ? Colors.primary
                        : Colors.border,
                      width: "22%",
                      paddingVertical: SPACING.M,
                      borderRadius: SPACING.RADIUS_M,
                      alignItems: "center",
                    }}
                    onPress={() => toggleDay(day)}
                  >
                    <Text
                      style={{
                        color: selectedDays.includes(day)
                          ? "#fff"
                          : Colors.text,
                        fontWeight: "600",
                        fontSize: FONT_SIZES.BODY_M,
                      }}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {errors.availability && (
                <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 8 }}>
                  {errors.availability}
                </Text>
              )}
            </View>

            {/* Time Slots */}
            <View style={{ marginBottom: SPACING.L }}>
              <Text style={trainerStyles.subHeading}>Preferred Time Slots</Text>
              {TIME_SLOTS.map((slot) => (
                <TouchableOpacity
                  key={slot}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: Colors.bg,
                    borderWidth: 1,
                    borderColor: selectedTimeSlots.includes(slot)
                      ? Colors.primary
                      : Colors.border,
                    padding: SPACING.M,
                    borderRadius: SPACING.RADIUS_M,
                    marginBottom: SPACING.S,
                  }}
                  onPress={() => toggleTimeSlot(slot)}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      borderWidth: 2,
                      borderColor: selectedTimeSlots.includes(slot)
                        ? Colors.primary
                        : Colors.border,
                      backgroundColor: selectedTimeSlots.includes(slot)
                        ? Colors.primary
                        : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {selectedTimeSlots.includes(slot) && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                  <Text
                    style={{
                      color: Colors.text,
                      marginLeft: SPACING.M,
                      fontWeight: "500",
                      fontSize: FONT_SIZES.BODY_M,
                    }}
                  >
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
              {errors.timeSlots && (
                <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                  {errors.timeSlots}
                </Text>
              )}
            </View>

            {/* Online/Offline Toggle */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: Colors.bg,
                padding: SPACING.M,
                borderRadius: SPACING.RADIUS_M,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name={isOnline ? "wifi" : "location"}
                  size={20}
                  color={Colors.primary}
                />
                <Text
                  style={{
                    color: Colors.text,
                    marginLeft: SPACING.M,
                    fontWeight: "600",
                    fontSize: FONT_SIZES.BODY_M,
                  }}
                >
                  {isOnline ? "Online" : "Offline"} Sessions
                </Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: Colors.border, true: Colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* PRICING SECTION */}
          <View style={trainerStyles.sectionWithoutMargin}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: SPACING.L,
              }}
            >
              <Ionicons name="cash" size={24} color={Colors.primary} />
              <Text style={trainerStyles.heading}>Pricing</Text>
            </View>

            {/* Price Per Session */}
            <View style={{ marginBottom: SPACING.L }}>
              <Text style={trainerStyles.subHeading}>Price Per Session ($)</Text>
              <TextInput
                style={{
                  backgroundColor: Colors.bg,
                  color: Colors.text,
                  padding: SPACING.M,
                  borderRadius: SPACING.RADIUS_M,
                  borderWidth: 1,
                  borderColor: errors.pricing ? "#ef4444" : Colors.border,
                  fontSize: FONT_SIZES.BODY_M,
                }}
                placeholder="e.g., 50"
                placeholderTextColor={Colors.muted}
                value={pricePerSession}
                onChangeText={(v) => handleFieldChange("pricePerSession", v, setPricePerSession)}
                keyboardType="numeric"
              />
              {errors.pricing && (
                <Text style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                  {errors.pricing}
                </Text>
              )}
            </View>

            {/* Monthly Plan */}
            <View>
              <Text style={trainerStyles.subHeading}>
                Monthly Plan (Optional)
              </Text>
              <TextInput
                style={{
                  backgroundColor: Colors.bg,
                  color: Colors.text,
                  padding: SPACING.M,
                  borderRadius: SPACING.RADIUS_M,
                  borderWidth: 1,
                  borderColor: Colors.border,
                  fontSize: FONT_SIZES.BODY_M,
                }}
                placeholder="e.g., 400 for 4 sessions"
                placeholderTextColor={Colors.muted}
                value={monthlyPlan}
                onChangeText={(v) => handleFieldChange("monthlyPlan", v, setMonthlyPlan)}
              />
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            style={[
              trainerStyles.button,
              { marginTop: SPACING.L, marginBottom: SPACING.L },
              loading && { opacity: 0.6 },
            ]}
            disabled={loading}
            onPress={handleSaveProfile}
          >
            <Text style={trainerStyles.buttonText}>
              {loading ? "Saving..." : "Save Profile"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
