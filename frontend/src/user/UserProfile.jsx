import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function UserProfile({ navigation, route }) {
  const userData = route?.params?.userData || {};
  const firstName = userData.firstName || "User";
  const lastName = userData.lastName || "";
  const email = userData.email || "No email";
  const phone = userData.phone || "No phone";

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
          Profile
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

      {/* Profile Content */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 20 }}>
        {/* Profile Avatar */}
        <View style={{ alignItems: "center", marginBottom: 30 }}>
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#8b5cf6",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="person" size={50} color="white" />
          </View>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "white",
            }}
          >
            {firstName} {lastName}
          </Text>
        </View>

        {/* Profile Information */}
        <View
          style={{
            backgroundColor: "#1a1d2e",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
              Email
            </Text>
            <Text style={{ fontSize: 16, color: "white", fontWeight: "500" }}>
              {email}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 12, color: "#999", marginBottom: 4 }}>
              Phone
            </Text>
            <Text style={{ fontSize: 16, color: "white", fontWeight: "500" }}>
              {phone}
            </Text>
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#8b5cf6",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
