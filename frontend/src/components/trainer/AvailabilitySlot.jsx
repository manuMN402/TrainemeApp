import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { FONT_SIZES, SPACING } from "../../utils/responsiveDesign";

export default function AvailabilitySlot({
  slot,
  onToggle,
  onEdit,
  onDelete,
}) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const getDayIndex = (dayName) => {
    return days.indexOf(dayName);
  };

  const dayIndex = getDayIndex(slot.day);
  const dayColor = [
    "#6366f1",
    "#f59e0b",
    "#10b981",
    "#8b5cf6",
    "#ec4899",
    "#f43f5e",
    "#06b6d4",
  ][dayIndex];

  return (
    <View style={[styles.card, { borderLeftColor: dayColor }]}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.daySection}>
          <View style={[styles.dayBadge, { backgroundColor: dayColor }]}>
            <Text style={styles.dayText}>{slot.day.substring(0, 3)}</Text>
          </View>
          <View>
            <Text style={styles.dayName}>{slot.day}</Text>
          </View>
        </View>
        <Switch
          value={slot.isActive}
          onValueChange={() => onToggle?.(slot.id)}
          trackColor={{ false: "#767577", true: "#81c784" }}
          thumbColor={slot.isActive ? "#4caf50" : "#f4f3f4"}
        />
      </View>

      {/* TIME */}
      <View style={styles.timeSection}>
        <View style={styles.timeBlock}>
          <Ionicons name="time-outline" size={16} color={dayColor} />
          <Text style={styles.timeText}>
            {slot.startTime} - {slot.endTime}
          </Text>
        </View>
      </View>

      {/* STATUS */}
      <View style={styles.statusRow}>
        <View style={styles.statusBadge}>
          <Ionicons
            name={slot.isActive ? "checkmark-circle" : "close-circle"}
            size={14}
            color={slot.isActive ? "#10b981" : Colors.muted}
          />
          <Text
            style={[
              styles.statusText,
              { color: slot.isActive ? "#10b981" : Colors.muted },
            ]}
          >
            {slot.isActive ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>

      {/* ACTION BUTTONS */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={() => onEdit?.(slot)}
        >
          <Ionicons name="pencil" size={16} color="#fff" />
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={() =>
            Alert.alert(
              "Delete Slot",
              "Are you sure you want to delete this availability slot?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  onPress: () => onDelete?.(slot.id),
                  style: "destructive",
                },
              ]
            )
          }
        >
          <Ionicons name="trash" size={16} color="#fff" />
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
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
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.M,
  },
  daySection: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.M,
  },
  dayBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: FONT_SIZES.BODY_S,
    color: "#fff",
    fontWeight: "700",
  },
  dayName: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
    color: "#fff",
  },
  timeSection: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
    padding: SPACING.M,
    marginVertical: SPACING.M,
  },
  timeBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.M,
  },
  timeText: {
    fontSize: FONT_SIZES.BODY_M,
    color: "#fff",
    fontWeight: "600",
  },
  statusRow: {
    marginVertical: SPACING.M,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.S,
  },
  statusText: {
    fontSize: FONT_SIZES.BODY_S,
    fontWeight: "600",
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
  editButton: {
    backgroundColor: "#6366f1",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  buttonText: {
    fontSize: FONT_SIZES.BODY_S,
    color: "#fff",
    fontWeight: "600",
  },
});
