import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function Profile({ navigation, route }) {
  const userData = route?.params?.userData || {};
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [email, setEmail] = useState(userData.email || "");
  const [phone, setPhone] = useState(userData.phone || "");

  const handleSave = () => {
    Alert.alert("Success", "Profile updated successfully!");
    setIsEditing(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", onPress: () => {} },
      {
        text: "Logout",
        onPress: () => {
          // Navigate to login screen
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
      },
    ]);
  };

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
            backgroundColor: "#1a1d2e",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#8b5cf6" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 20,
          paddingBottom: 100,
        }}
      >
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
          {!isEditing && (
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: "white",
              }}
            >
              {firstName} {lastName}
            </Text>
          )}
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
          {/* First Name */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
              First Name
            </Text>
            {isEditing ? (
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor="#666"
                style={{
                  backgroundColor: "#0f1419",
                  borderWidth: 1,
                  borderColor: "#333",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: "white",
                  fontSize: 14,
                }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "500",
                }}
              >
                {firstName}
              </Text>
            )}
          </View>

          {/* Last Name */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
              Last Name
            </Text>
            {isEditing ? (
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor="#666"
                style={{
                  backgroundColor: "#0f1419",
                  borderWidth: 1,
                  borderColor: "#333",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: "white",
                  fontSize: 14,
                }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "500",
                }}
              >
                {lastName}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
              Email
            </Text>
            {isEditing ? (
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#666"
                style={{
                  backgroundColor: "#0f1419",
                  borderWidth: 1,
                  borderColor: "#333",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: "white",
                  fontSize: 14,
                }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "500",
                }}
              >
                {email}
              </Text>
            )}
          </View>

          {/* Phone */}
          <View>
            <Text style={{ fontSize: 12, color: "#999", marginBottom: 8 }}>
              Phone
            </Text>
            {isEditing ? (
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone"
                placeholderTextColor="#666"
                style={{
                  backgroundColor: "#0f1419",
                  borderWidth: 1,
                  borderColor: "#333",
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: "white",
                  fontSize: 14,
                }}
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: "white",
                  fontWeight: "500",
                }}
              >
                {phone}
              </Text>
            )}
          </View>
        </View>

        {/* Edit/Save Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#8b5cf6",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
            marginBottom: 12,
          }}
          onPress={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            {isEditing ? "Save Changes" : "Edit Profile"}
          </Text>
        </TouchableOpacity>

        {/* Cancel Button (only show when editing) */}
        {isEditing && (
          <TouchableOpacity
            style={{
              backgroundColor: "#374151",
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
            onPress={() => setIsEditing(false)}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#ef4444",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 12,
          }}
          onPress={handleLogout}
        >
          <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
            Logout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
