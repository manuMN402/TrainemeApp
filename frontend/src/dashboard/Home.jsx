import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import trainers from "../data/trainers";
import TrainerCard from "../components/TrainerCard";

const CATEGORIES = ["All", "Fitness", "Coding", "Yoga"];

export default function Home({ navigation, route }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Get user data from route params
  const userData = route?.params?.userData || {};
  const firstName = userData.firstName || "User";
  const lastName = userData.lastName || "";

  const filteredTrainers = trainers.filter((trainer) => {
    const matchesCategory =
      selectedCategory === "All" || trainer.specialty === selectedCategory;
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainer.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#070B1A" }}>
      {/* Header */}
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
          {firstName} {lastName}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
            backgroundColor: "#1a1d2e",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#8b5cf6" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1a1d2e",
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: "#333",
            marginBottom: 16,
          }}
        >
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search trainers..."
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

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 16 }}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor:
                  selectedCategory === category ? "#8b5cf6" : "#1a1d2e",
                borderWidth: selectedCategory === category ? 0 : 1,
                borderColor: "#333",
                marginRight: 8,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: 13,
                }}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Top Trainers Title */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "white",
            marginBottom: 12,
          }}
        >
          Top Trainers
        </Text>
      </View>

      {/* Trainer List */}
      <FlatList
        data={filteredTrainers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TrainerCard
            trainer={item}
            onPress={() =>
              navigation.navigate("TrainerDetail", { trainer: item })
            }
          />
        )}
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
