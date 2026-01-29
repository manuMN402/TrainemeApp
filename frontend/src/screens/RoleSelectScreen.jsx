import React from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { roleSelectStyles as styles } from "../styles/roleSelectStyles";

export default function RoleSelectScreen({ navigation }) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>

        {/* LOGO */}
        <View style={styles.logoCircle}>
          <Image 
            source={require("../../assets/images/logo.png")}
            style={{ 
              width: 120, 
              height: 120, 
              borderRadius: 60
            }}
            resizeMode="contain"
          />
        </View>

        {/* TITLE */}
        <Text style={styles.title}>TrainMe</Text>
        <Text style={styles.subtitle}>
          Connect with trainers or share your expertise
        </Text>

        {/* USER CARD */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Register", { role: "User" })}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="person-outline" size={24} color={Colors.primary} />
          </View>

          <View>
            <Text style={styles.cardTitle}>Continue as User</Text>
            <Text style={styles.cardSub}>
              Find and book training sessions
            </Text>
          </View>
        </TouchableOpacity>

        {/* TRAINER CARD */}
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.85}
          onPress={() => {
            console.log("Trainer button pressed");
            try {
              navigation.navigate("TrainerRegister");
            } catch (error) {
              console.error("Navigation error:", error);
              Alert.alert("Error", "Failed to navigate to trainer registration");
            }
          }}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="people" size={24} color={Colors.primary} />
          </View>

          <View>
            <Text style={styles.cardTitle}>Continue as Trainer</Text>
            <Text style={styles.cardSub}>
              Share your skills and earn
            </Text>
          </View>
        </TouchableOpacity>

        {/* LOGIN */}
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text
            style={styles.login}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </Text>
        </Text>

      </View>
    </View>
  );
}
