import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import BookingCard from "../components/trainer/BookingCard";
import { Colors } from "../constants/colors";
import { FONT_SIZES, SPACING } from "../utils/responsiveDesign";
import { bookingsData } from "../data/trainer/bookings";

export default function BookingsScreen() {
  const [bookings, setBookings] = useState(bookingsData);
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filters = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

  const filteredBookings = bookings.filter((booking) => {
    if (selectedFilter === "All") return true;
    return booking.status === selectedFilter;
  });

  const handleAcceptBooking = (id) => {
    Alert.alert(
      "Accept Booking",
      "Are you sure you want to accept this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: () => {
            setBookings(
              bookings.map((b) =>
                b.id === id ? { ...b, status: "Confirmed" } : b
              )
            );
            Alert.alert("Success", "Booking accepted!");
          },
        },
      ]
    );
  };

  const handleRejectBooking = (id) => {
    Alert.alert(
      "Reject Booking",
      "Are you sure you want to reject this booking?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          onPress: () => {
            setBookings(
              bookings.map((b) =>
                b.id === id ? { ...b, status: "Cancelled" } : b
              )
            );
            Alert.alert("Success", "Booking rejected!");
          },
        },
      ]
    );
  };

  const handleCompleteBooking = (id) => {
    Alert.alert(
      "Complete Booking",
      "Mark this booking as completed?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: () => {
            setBookings(
              bookings.map((b) =>
                b.id === id ? { ...b, status: "Completed" } : b
              )
            );
            Alert.alert("Success", "Booking marked as completed!");
          },
        },
      ]
    );
  };

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    completed: bookings.filter((b) => b.status === "Completed").length,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Bookings</Text>
          <Text style={styles.subtitle}>{stats.totalBookings} total</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* STATS */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: "#6366f1" }]}>
            <Ionicons name="calendar-outline" size={24} color="#fff" />
            <Text style={styles.statValue}>{stats.totalBookings}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: "#f59e0b" }]}>
            <Ionicons name="time-outline" size={24} color="#fff" />
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: "#10b981" }]}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
            <Text style={styles.statValue}>{stats.confirmed}</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: "#8b5cf6" }]}>
            <Ionicons name="checkmark-done-circle-outline" size={24} color="#fff" />
            <Text style={styles.statValue}>{stats.completed}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* FILTER TABS */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterTab,
                selectedFilter === filter && styles.filterTabActive,
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  selectedFilter === filter && styles.filterTabTextActive,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* BOOKINGS LIST */}
        <View style={styles.listContainer}>
          {filteredBookings.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="calendar-outline"
                size={64}
                color={Colors.muted}
              />
              <Text style={styles.emptyStateTitle}>No {selectedFilter} Bookings</Text>
              <Text style={styles.emptyStateText}>
                You don't have any {selectedFilter.toLowerCase()} bookings yet
              </Text>
            </View>
          ) : (
            filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onAccept={handleAcceptBooking}
                onReject={handleRejectBooking}
                onComplete={handleCompleteBooking}
              />
            ))
          )}
        </View>
      </ScrollView>
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
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: SPACING.S,
    marginVertical: SPACING.M,
  },
  statBox: {
    width: "48%",
    alignItems: "center",
    paddingVertical: SPACING.M,
    borderRadius: 12,
    marginHorizontal: SPACING.S,
    marginVertical: SPACING.S,
  },
  statValue: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
    marginVertical: SPACING.S,
  },
  statLabel: {
    fontSize: FONT_SIZES.BODY_S,
    color: "#fff",
    opacity: 0.8,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: SPACING.M,
    marginVertical: SPACING.L,
    gap: SPACING.S,
  },
  filterTab: {
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderRadius: 20,
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    fontWeight: "500",
  },
  filterTabTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  listContainer: {
    paddingBottom: SPACING.XXL,
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
});
