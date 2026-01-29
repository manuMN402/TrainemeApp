import { View, Text, TouchableOpacity, FlatList, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const SAMPLE_MESSAGES = [
  {
    id: "1",
    trainerName: "John Fitness",
    lastMessage: "Great workout session yesterday!",
    timestamp: "2h ago",
    avatar: "👨‍🏫",
  },
  {
    id: "2",
    trainerName: "Sarah Yoga",
    lastMessage: "See you tomorrow at 6 PM",
    timestamp: "1d ago",
    avatar: "👩‍🏫",
  },
  {
    id: "3",
    trainerName: "Mike Coding",
    lastMessage: "Your code is looking good",
    timestamp: "2d ago",
    avatar: "👨‍💻",
  },
];

export default function UserMessages({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMessages = SAMPLE_MESSAGES.filter((msg) =>
    msg.trainerName.toLowerCase().includes(searchQuery.toLowerCase())
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
          Messages
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

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1a1d2e",
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search messages..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 8,
              color: "white",
              fontSize: 14,
            }}
          />
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#1a1d2e",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#8b5cf6",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 24 }}>{item.avatar}</Text>
            </View>

            {/* Message Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                }}
              >
                {item.trainerName}
              </Text>
              <Text style={{ fontSize: 13, color: "#999", marginTop: 4 }}>
                {item.lastMessage}
              </Text>
            </View>

            {/* Timestamp */}
            <Text style={{ fontSize: 12, color: "#666" }}>
              {item.timestamp}
            </Text>
          </TouchableOpacity>
        )}
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
