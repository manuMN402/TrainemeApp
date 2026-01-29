import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import componentStyles from "../styles/componentStyles";
import { SPACING, FONT_SIZES } from "../utils/responsiveDesign";

export default function BookingCard({ booking, onCancel }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f59e0b";
      case "Confirmed":
        return "#10b981";
      case "Completed":
        return "#3b82f6";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Booking",
      "Are you sure you want to cancel this booking?",
      [
        { text: "No", onPress: () => {} },
        { text: "Yes, Cancel", onPress: () => onCancel(booking.booking_id) },
      ]
    );
  };

  return (
    <View
      style={[
        componentStyles.bookingCard,
        {
          borderLeftWidth: 4,
          borderLeftColor: getStatusColor(booking.status),
        },
      ]}
    >
      {/* Header: Trainer Name and Status */}
      <View style={componentStyles.bookingCardHeader}>
        <View style={{ flex: 1, marginRight: SPACING.L }}>
          <Text style={componentStyles.bookingCardTitle}>
            {booking.trainer_name}
          </Text>
          <Text style={componentStyles.bookingCardDetail}>
            {booking.trainer_specialty}
          </Text>
        </View>
        <View
          style={[
            componentStyles.bookingCardStatus,
            getStatusColor(booking.status) === "#f59e0b"
              ? componentStyles.bookingCardStatusPending
              : getStatusColor(booking.status) === "#10b981"
              ? componentStyles.bookingCardStatusConfirmed
              : componentStyles.bookingCardStatusCancelled,
          ]}
        >
          <Text style={{ color: "white", fontSize: FONT_SIZES.BODY_XS, fontWeight: "600" }}>
            {booking.status}
          </Text>
        </View>
      </View>

      {/* Date and Time */}
      <View
        style={{
          backgroundColor: "#0f1419",
          borderRadius: SPACING.RADIUS_M,
          padding: SPACING.L,
          marginBottom: SPACING.L,
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", marginBottom: SPACING.M }}
        >
          <Ionicons name="calendar" size={18} color={Colors.primary} />
          <Text style={[componentStyles.bookingCardDetail, { marginBottom: 0, marginLeft: SPACING.M }]}>
            {booking.booking_date}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="time" size={18} color={Colors.primary} />
          <Text style={[componentStyles.bookingCardDetail, { marginBottom: 0, marginLeft: SPACING.M }]}>
            {booking.start_time} - {booking.end_time}
          </Text>
        </View>
      </View>

      {/* Cancel Button - Only show if Pending */}
      {booking.status === "Pending" && (
        <TouchableOpacity
          onPress={handleCancel}
          style={{
            backgroundColor: "#ef4444",
            paddingVertical: SPACING.L,
            borderRadius: SPACING.RADIUS_M,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: FONT_SIZES.BODY_M }}>
            Cancel Booking
          </Text>
        </TouchableOpacity>
      )}

      {/* Other Status Actions */}
      {booking.status === "Confirmed" && (
        <View style={componentStyles.bookingCardActions}>
          <TouchableOpacity
            style={[
              componentStyles.bookingCardActionButton,
              { backgroundColor: Colors.primary },
            ]}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: FONT_SIZES.BODY_S }}>
              Message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              componentStyles.bookingCardActionButton,
              { backgroundColor: "#374151" },
            ]}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: FONT_SIZES.BODY_S }}>
              Calendar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
