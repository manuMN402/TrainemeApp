import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { FONT_SIZES, SPACING } from "../../utils/responsiveDesign";

export default function BookingCard({
  booking,
  onAccept,
  onReject,
  onComplete,
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f59e0b";
      case "Confirmed":
        return "#10b981";
      case "Completed":
        return "#6366f1";
      case "Cancelled":
        return "#ef4444";
      default:
        return Colors.muted;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return "time-outline";
      case "Confirmed":
        return "checkmark-circle";
      case "Completed":
        return "checkmark-done-circle";
      case "Cancelled":
        return "close-circle";
      default:
        return "ellipsis-horizontal";
    }
  };

  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: booking.userProfilePicture }}
            style={styles.profilePic}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{booking.userName}</Text>
            <Text style={styles.sessionType}>{booking.sessionType}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(booking.status) },
          ]}
        >
          <Ionicons
            name={getStatusIcon(booking.status)}
            size={14}
            color="#fff"
          />
          <Text style={styles.statusText}>{booking.status}</Text>
        </View>
      </View>

      {/* DETAILS */}
      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={Colors.muted} />
          <Text style={styles.detailText}>
            {booking.date} at {booking.time}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="time-outline" size={16} color={Colors.muted} />
          <Text style={styles.detailText}>{booking.duration} minutes</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="cash-outline" size={16} color={Colors.muted} />
          <Text style={styles.detailText}>${booking.price}</Text>
        </View>
      </View>

      {/* ACTIONS */}
      {booking.status === "Pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => onAccept?.(booking.id)}
          >
            <Ionicons name="checkmark" size={18} color="#fff" />
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => onReject?.(booking.id)}
          >
            <Ionicons name="close" size={18} color="#fff" />
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}

      {booking.status === "Confirmed" && (
        <TouchableOpacity
          style={[styles.button, styles.completeButton]}
          onPress={() => onComplete?.(booking.id)}
        >
          <Ionicons name="checkmark-done" size={18} color="#fff" />
          <Text style={styles.buttonText}>Mark Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2a2a3e",
    borderRadius: 12,
    padding: SPACING.L,
    marginVertical: SPACING.M,
    marginHorizontal: SPACING.M,
    borderLeftWidth: 4,
    borderLeftColor: "#6366f1",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.M,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: SPACING.M,
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: SPACING.M,
  },
  userName: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
    color: "#fff",
  },
  sessionType: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: FONT_SIZES.BODY_XS,
    color: "#fff",
    fontWeight: "600",
  },
  details: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: SPACING.M,
    marginVertical: SPACING.M,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.S,
    gap: SPACING.M,
  },
  detailText: {
    fontSize: FONT_SIZES.BODY_S,
    color: "#fff",
  },
  actionButtons: {
    flexDirection: "row",
    gap: SPACING.M,
    marginTop: SPACING.M,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.M,
    borderRadius: 8,
    gap: SPACING.S,
  },
  acceptButton: {
    backgroundColor: "#10b981",
  },
  rejectButton: {
    backgroundColor: "#ef4444",
  },
  completeButton: {
    backgroundColor: "#6366f1",
    paddingVertical: SPACING.M,
  },
  buttonText: {
    fontSize: FONT_SIZES.BODY_S,
    color: "#fff",
    fontWeight: "600",
  },
});
