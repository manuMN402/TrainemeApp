import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import BookingCard from "../components/BookingCard";
import { bookingsData } from "../data/bookings";

export default function Bookings({ navigation }) {
  const [bookings, setBookings] = useState(bookingsData);

  const handleCancelBooking = (bookingId) => {
    setBookings((prevBookings) =>
      prevBookings.map((booking) =>
        booking.booking_id === bookingId
          ? { ...booking, status: "Cancelled" }
          : booking
      )
    );
    Alert.alert("Success", "Booking cancelled successfully!");
  };

  const upcomingBookings = bookings.filter(
    (b) => b.status === "Pending" || b.status === "Confirmed"
  );
  const pastBookings = bookings.filter(
    (b) => b.status === "Completed" || b.status === "Cancelled"
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#070B1A" }}>
      {/* Header with Back Button */}
      
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
          My Bookings
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
          }}
        >
          <Ionicons name="arrow-back" size={15} color="whitesmoke" />
        </TouchableOpacity>
      </View>

      {bookings.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 16,
          }}
        >
          <Ionicons name="calendar-outline" size={60} color="#666" />
          <Text
            style={{
              color: "#999",
              fontSize: 16,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            No bookings yet
          </Text>
          <Text
            style={{
              color: "#666",
              fontSize: 13,
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Book a trainer to get started!
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.booking_id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onCancel={handleCancelBooking}
            />
          )}
          scrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 8 }}
        />
      )}
    </SafeAreaView>
  );
}
//vjhxzutz