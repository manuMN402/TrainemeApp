import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { trainerStyles } from "../styles/trainerStyles";
import { Colors } from "../constants/colors";
import { SPACING, FONT_SIZES } from "../utils/responsiveDesign";
import { isProfileReadyForBookings, calculateProfileCompletion } from "../utils/profileCompletion";

export default function BookingRequests({ navigation, route }) {
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load profile data from route or storage
    const profileData = route?.params?.profileData || {};
    const completionPercentage = calculateProfileCompletion(profileData);
    setProfileCompletion(completionPercentage);
    setIsProfileComplete(isProfileReadyForBookings(profileData));

    // Load booking requests
    loadBookingRequests();
  }, [route?.params?.profileData]);

  const loadBookingRequests = async () => {
    setLoading(true);
    try {
      // Placeholder for API call to fetch booking requests
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const mockRequests = [
        {
          id: 1,
          clientName: "John Doe",
          service: "Personal Training",
          date: "2026-01-31",
          time: "6:00 AM - 7:00 AM",
          status: "pending",
        },
        {
          id: 2,
          clientName: "Jane Smith",
          service: "Yoga",
          date: "2026-02-01",
          time: "9:00 AM - 10:00 AM",
          status: "pending",
        },
      ];
      setBookingRequests(mockRequests);
    } catch (error) {
      console.error("Error loading booking requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = (bookingId) => {
    if (!isProfileComplete) {
      Alert.alert(
        "Complete Your Profile",
        `Your profile is ${profileCompletion}% complete. Complete at least 70% to accept bookings.`,
        [
          { text: "Cancel", onPress: () => {} },
          {
            text: "Complete Profile",
            onPress: () => navigation.navigate("TrainerProfile"),
          },
        ]
      );
      return;
    }

    Alert.alert("Booking Accepted", "You have accepted this booking request", [
      { text: "OK", onPress: () => loadBookingRequests() },
    ]);
  };

  const handleRejectBooking = (bookingId) => {
    Alert.alert(
      "Reject Booking",
      "Are you sure you want to reject this booking?",
      [
        { text: "Cancel", onPress: () => {} },
        {
          text: "Reject",
          onPress: () => {
            setBookingRequests(bookingRequests.filter((b) => b.id !== bookingId));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bg }}>
      {/* Profile Completion Warning */}
      {!isProfileComplete && (
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
              Profile {profileCompletion}% Complete
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
          <TouchableOpacity
            onPress={() => navigation.navigate("TrainerProfile")}
            style={{
              backgroundColor: "rgba(255,255,255,0.2)",
              paddingHorizontal: SPACING.M,
              paddingVertical: SPACING.S,
              borderRadius: SPACING.RADIUS_M,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 12 }}>
              Complete
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Profile Complete Success */}
      {isProfileComplete && (
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
          paddingHorizontal: SPACING.L,
          paddingVertical: SPACING.M,
        }}
      >
        <Text style={{ color: Colors.text, fontSize: FONT_SIZES.HEADING_L, fontWeight: "700" }}>
          Booking Requests
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SPACING.L,
          paddingBottom: SPACING.XXL,
        }}
      >
        {bookingRequests.length === 0 ? (
          <View
            style={{
              backgroundColor: Colors.card,
              borderRadius: SPACING.RADIUS_L,
              padding: SPACING.XXL,
              alignItems: "center",
              justifyContent: "center",
              minHeight: 300,
              borderWidth: 1,
              borderColor: Colors.border,
            }}
          >
            <Ionicons name="calendar-clear-outline" size={48} color={Colors.muted} />
            <Text
              style={{
                color: Colors.text,
                fontSize: FONT_SIZES.BODY_L,
                fontWeight: "600",
                marginTop: SPACING.L,
              }}
            >
              No Booking Requests
            </Text>
            <Text
              style={{
                color: Colors.muted,
                fontSize: FONT_SIZES.BODY_M,
                marginTop: SPACING.S,
                textAlign: "center",
              }}
            >
              Bookings will appear here when clients request your services
            </Text>
          </View>
        ) : (
          bookingRequests.map((booking) => (
            <View
              key={booking.id}
              style={{
                backgroundColor: Colors.card,
                borderRadius: SPACING.RADIUS_L,
                padding: SPACING.L,
                marginBottom: SPACING.L,
                borderWidth: 1,
                borderColor: Colors.border,
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: SPACING.L,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={trainerStyles.heading}>{booking.clientName}</Text>
                  <Text
                    style={{
                      color: Colors.primary,
                      fontSize: FONT_SIZES.BODY_M,
                      fontWeight: "600",
                      marginTop: 4,
                    }}
                  >
                    {booking.service}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: "#fef3c7",
                    paddingHorizontal: SPACING.M,
                    paddingVertical: SPACING.S,
                    borderRadius: SPACING.RADIUS_M,
                  }}
                >
                  <Text
                    style={{
                      color: "#b45309",
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    Pending
                  </Text>
                </View>
              </View>

              {/* Details */}
              <View
                style={{
                  backgroundColor: Colors.bg,
                  borderRadius: SPACING.RADIUS_M,
                  padding: SPACING.M,
                  marginBottom: SPACING.L,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.S }}>
                  <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
                  <Text
                    style={{
                      color: Colors.text,
                      marginLeft: SPACING.S,
                      fontSize: FONT_SIZES.BODY_M,
                      fontWeight: "500",
                    }}
                  >
                    {booking.date}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="time-outline" size={16} color={Colors.primary} />
                  <Text
                    style={{
                      color: Colors.text,
                      marginLeft: SPACING.S,
                      fontSize: FONT_SIZES.BODY_M,
                      fontWeight: "500",
                    }}
                  >
                    {booking.time}
                  </Text>
                </View>
              </View>

              {/* Action Buttons */}
              <View
                style={{
                  flexDirection: "row",
                  gap: SPACING.M,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: isProfileComplete ? Colors.primary : Colors.border,
                    paddingVertical: SPACING.M,
                    borderRadius: SPACING.RADIUS_M,
                    alignItems: "center",
                    opacity: isProfileComplete ? 1 : 0.5,
                  }}
                  onPress={() => handleAcceptBooking(booking.id)}
                  disabled={!isProfileComplete}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: FONT_SIZES.BODY_M,
                    }}
                  >
                    Accept
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: Colors.border,
                    paddingVertical: SPACING.M,
                    borderRadius: SPACING.RADIUS_M,
                    alignItems: "center",
                  }}
                  onPress={() => handleRejectBooking(booking.id)}
                >
                  <Text
                    style={{
                      color: Colors.text,
                      fontWeight: "700",
                      fontSize: FONT_SIZES.BODY_M,
                    }}
                  >
                    Reject
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
