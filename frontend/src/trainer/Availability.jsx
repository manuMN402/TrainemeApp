import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import AvailabilitySlot from "../components/trainer/AvailabilitySlot";
import { Colors } from "../constants/colors";
import { FONT_SIZES, SPACING } from "../utils/responsiveDesign";
import { availabilityData } from "../data/trainer/bookings";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const TIMES = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];

export default function AvailabilityScreen() {
  const [slots, setSlots] = useState(availabilityData);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    day: "Monday",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
  });
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleOpenModal = (slot = null) => {
    if (slot) {
      setEditingSlot(slot);
      setFormData({
        day: slot.day,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });
    } else {
      setEditingSlot(null);
      setFormData({
        day: "Monday",
        startTime: "08:00 AM",
        endTime: "12:00 PM",
      });
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setShowDayPicker(false);
    setShowStartTimePicker(false);
    setShowEndTimePicker(false);
  };

  const validateForm = () => {
    if (!formData.day || !formData.startTime || !formData.endTime) {
      Alert.alert("Error", "Please fill all fields");
      return false;
    }

    const startIdx = TIMES.indexOf(formData.startTime);
    const endIdx = TIMES.indexOf(formData.endTime);

    if (startIdx >= endIdx) {
      Alert.alert("Error", "End time must be after start time");
      return false;
    }

    // Check for overlapping slots
    const daySlots = slots.filter(
      (s) =>
        s.day === formData.day && s.id !== editingSlot?.id
    );
    for (let slot of daySlots) {
      const existingStart = TIMES.indexOf(slot.startTime);
      const existingEnd = TIMES.indexOf(slot.endTime);

      if (
        (startIdx >= existingStart && startIdx < existingEnd) ||
        (endIdx > existingStart && endIdx <= existingEnd) ||
        (startIdx <= existingStart && endIdx >= existingEnd)
      ) {
        Alert.alert(
          "Overlap Error",
          `Time slot overlaps with existing availability (${slot.startTime} - ${slot.endTime})`
        );
        return false;
      }
    }

    return true;
  };

  const handleSaveSlot = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingSlot) {
        // Update existing slot
        setSlots(
          slots.map((s) =>
            s.id === editingSlot.id ? { ...s, ...formData } : s
          )
        );
        Alert.alert("Success", "Availability slot updated successfully!");
      } else {
        // Add new slot
        const newSlot = {
          id: `avail_${Date.now()}`,
          ...formData,
          isActive: true,
        };
        setSlots([...slots, newSlot]);
        Alert.alert("Success", "Availability slot added successfully!");
      }

      handleCloseModal();
    } catch (error) {
      Alert.alert("Error", "Failed to save availability slot");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSlot = async (id) => {
    setSlots(
      slots.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleDeleteSlot = (id) => {
    setSlots(slots.filter((s) => s.id !== id));
    Alert.alert("Success", "Availability slot deleted");
  };

  const groupedSlots = DAYS.reduce((acc, day) => {
    acc[day] = slots.filter((s) => s.day === day);
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Manage Availability</Text>
          <Text style={styles.subtitle}>
            {slots.filter((s) => s.isActive).length} active slots
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => handleOpenModal()}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: SPACING.XXL }}
      >
        {/* WEEKLY OVERVIEW */}
        <View style={styles.weeklyOverview}>
          {DAYS.map((day, index) => {
            const daySlots = groupedSlots[day];
            const isActive = daySlots.some((s) => s.isActive);
            return (
              <View key={index} style={styles.dayOverviewCard}>
                <Text style={styles.dayOverviewLabel}>{day.substring(0, 3)}</Text>
                <View
                  style={[
                    styles.dayOverviewIndicator,
                    isActive && { backgroundColor: "#10b981" },
                  ]}
                />
                <Text style={styles.dayOverviewCount}>{daySlots.length}</Text>
              </View>
            );
          })}
        </View>

        {/* AVAILABILITY SLOTS BY DAY */}
        {DAYS.map((day) => {
          const daySlots = groupedSlots[day];
          if (daySlots.length === 0) return null;

          return (
            <View key={day} style={styles.daySection}>
              <Text style={styles.dayTitle}>{day}</Text>
              {daySlots.map((slot) => (
                <AvailabilitySlot
                  key={slot.id}
                  slot={slot}
                  onToggle={handleToggleSlot}
                  onEdit={() => handleOpenModal(slot)}
                  onDelete={handleDeleteSlot}
                />
              ))}
            </View>
          );
        })}

        {/* EMPTY STATE */}
        {slots.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={Colors.muted} />
            <Text style={styles.emptyStateTitle}>No Availability Slots</Text>
            <Text style={styles.emptyStateText}>
              Add your first availability slot to start accepting bookings
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => handleOpenModal()}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.emptyStateButtonText}>Add Slot</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* ADD/EDIT MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* HEADER */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={handleCloseModal}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {editingSlot ? "Edit Slot" : "Add Slot"}
              </Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.modalForm}>
              {/* DAY PICKER */}
              <Text style={styles.label}>Select Day</Text>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => setShowDayPicker(!showDayPicker)}
              >
                <Ionicons name="calendar-outline" size={18} color={Colors.muted} />
                <Text style={styles.pickerText}>{formData.day}</Text>
                <Ionicons name="chevron-down" size={18} color={Colors.muted} />
              </TouchableOpacity>

              {showDayPicker && (
                <View style={styles.dropdownList}>
                  {DAYS.map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dropdownItem,
                        formData.day === day && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, day });
                        setShowDayPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          formData.day === day && styles.dropdownItemTextActive,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* START TIME PICKER */}
              <Text style={[styles.label, { marginTop: SPACING.L }]}>
                Start Time
              </Text>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => setShowStartTimePicker(!showStartTimePicker)}
              >
                <Ionicons name="time-outline" size={18} color={Colors.muted} />
                <Text style={styles.pickerText}>{formData.startTime}</Text>
                <Ionicons name="chevron-down" size={18} color={Colors.muted} />
              </TouchableOpacity>

              {showStartTimePicker && (
                <View style={styles.dropdownList}>
                  {TIMES.slice(0, -1).map((time, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.dropdownItem,
                        formData.startTime === time && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, startTime: time });
                        setShowStartTimePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          formData.startTime === time &&
                            styles.dropdownItemTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* END TIME PICKER */}
              <Text style={[styles.label, { marginTop: SPACING.L }]}>
                End Time
              </Text>
              <TouchableOpacity
                style={styles.picker}
                onPress={() => setShowEndTimePicker(!showEndTimePicker)}
              >
                <Ionicons name="time-outline" size={18} color={Colors.muted} />
                <Text style={styles.pickerText}>{formData.endTime}</Text>
                <Ionicons name="chevron-down" size={18} color={Colors.muted} />
              </TouchableOpacity>

              {showEndTimePicker && (
                <View style={styles.dropdownList}>
                  {TIMES.slice(1).map((time, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={[
                        styles.dropdownItem,
                        formData.endTime === time && styles.dropdownItemActive,
                      ]}
                      onPress={() => {
                        setFormData({ ...formData, endTime: time });
                        setShowEndTimePicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          formData.endTime === time &&
                            styles.dropdownItemTextActive,
                        ]}
                      >
                        {time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* DURATION DISPLAY */}
              <View style={styles.durationBox}>
                <Ionicons name="hourglass-outline" size={18} color={Colors.primary} />
                <Text style={styles.durationText}>
                  Duration:{" "}
                  {TIMES.indexOf(formData.endTime) -
                    TIMES.indexOf(formData.startTime)}{" "}
                  hours
                </Text>
              </View>

              {/* SAVE BUTTON */}
              <TouchableOpacity
                style={[styles.saveButton, loading && { opacity: 0.6 }]}
                onPress={handleSaveSlot}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                    <Text style={styles.saveButtonText}>
                      {editingSlot ? "Update Slot" : "Add Slot"}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.L,
  },
  title: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    marginTop: SPACING.S,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  weeklyOverview: {
    flexDirection: "row",
    paddingHorizontal: SPACING.M,
    marginVertical: SPACING.L,
    gap: SPACING.S,
  },
  dayOverviewCard: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: SPACING.M,
    alignItems: "center",
    gap: SPACING.S,
  },
  dayOverviewLabel: {
    fontSize: FONT_SIZES.BODY_S,
    fontWeight: "600",
    color: "#fff",
  },
  dayOverviewIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.muted,
  },
  dayOverviewCount: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
    color: Colors.primary,
  },
  daySection: {
    marginVertical: SPACING.M,
  },
  dayTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
    marginHorizontal: SPACING.L,
    marginBottom: SPACING.M,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.XXL,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
    marginTop: SPACING.L,
  },
  emptyStateText: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    textAlign: "center",
    marginVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
  },
  emptyStateButton: {
    flexDirection: "row",
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    marginTop: SPACING.L,
    gap: SPACING.M,
  },
  emptyStateButtonText: {
    fontSize: FONT_SIZES.BODY_M,
    fontWeight: "600",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a2e",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.L,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  modalTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
  },
  modalForm: {
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.L,
  },
  label: {
    fontSize: FONT_SIZES.BODY_M,
    fontWeight: "600",
    color: "#fff",
    marginBottom: SPACING.S,
  },
  picker: {
    backgroundColor: "#0f0f1e",
    borderRadius: 12,
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.M,
    marginBottom: SPACING.M,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  pickerText: {
    flex: 1,
    fontSize: FONT_SIZES.BODY_M,
    color: "#fff",
    fontWeight: "500",
  },
  dropdownList: {
    backgroundColor: "#0f0f1e",
    borderRadius: 12,
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: Colors.primary,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  dropdownItemActive: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
  },
  dropdownItemText: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.muted,
  },
  dropdownItemTextActive: {
    color: Colors.primary,
    fontWeight: "600",
  },
  durationBox: {
    flexDirection: "row",
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    borderRadius: 12,
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    marginVertical: SPACING.L,
    gap: SPACING.M,
    alignItems: "center",
  },
  durationText: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.primary,
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: SPACING.L,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.M,
    marginVertical: SPACING.L,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
    color: "#fff",
  },
});
