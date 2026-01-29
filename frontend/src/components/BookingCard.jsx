import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
      style={{
        backgroundColor: "#1a1d2e",
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderLeftWidth: 4,
        borderLeftColor: getStatusColor(booking.status),
      }}
    >
      {/* Header: Trainer Name and Status */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <View>
          <Text
            style={{ fontSize: 16, fontWeight: "700", color: "white" }}
          >
            {booking.trainer_name}
          </Text>
          <Text style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
            {booking.trainer_specialty}
          </Text>
        </View>
        <View
          style={{
            backgroundColor: getStatusColor(booking.status),
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 11, fontWeight: "600" }}>
            {booking.status}
          </Text>
        </View>
      </View>

      {/* Date and Time */}
      <View
        style={{
          backgroundColor: "#0f1419",
          borderRadius: 8,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <View
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
        >
          <Ionicons name="calendar" size={16} color="#8b5cf6" />
          <Text style={{ color: "#ccc", fontSize: 13, marginLeft: 8 }}>
            {booking.booking_date}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="time" size={16} color="#8b5cf6" />
          <Text style={{ color: "#ccc", fontSize: 13, marginLeft: 8 }}>
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
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
            Cancel Booking
          </Text>
        </TouchableOpacity>
      )}

      {/* Other Status Actions */}
      {booking.status === "Confirmed" && (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#8b5cf6",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
              Message Trainer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "#374151",
              paddingVertical: 10,
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
              Add to Calendar
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
