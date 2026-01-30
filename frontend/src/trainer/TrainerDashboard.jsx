import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Text } from "react-native";
import { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

import TrainerHomeScreen from "./Home";
import BookingsScreen from "./Bookings";
import MessagesScreen from "./Messages";
import TrainerProfileScreen from "./TrainerProfile";
import BookingRequestsScreen from "./BookingRequests";

import { Colors } from "../constants/colors";
import { calculateProfileCompletion } from "../utils/profileCompletion";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TrainerDashboardTabs({ route, profileData }) {
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [isProfileComplete, setIsProfileComplete] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (profileData) {
        const completion = calculateProfileCompletion(profileData);
        setProfileCompletion(completion);
        setIsProfileComplete(completion >= 70);
      }
    }, [profileData])
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.bg,
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.1)",
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={TrainerHomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
          tabBarLabel: "Bookings",
        }}
      />
      <Tab.Screen
        name="BookingRequests"
        component={BookingRequestsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: "relative" }}>
              <Ionicons name="checkmark-circle" color={color} size={size} />
              <View
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  backgroundColor: "#ef4444",
                  borderRadius: 10,
                  width: 18,
                  height: 18,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
                  2
                </Text>
              </View>
            </View>
          ),
          tabBarLabel: "Requests",
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble" color={color} size={size} />
          ),
          tabBarLabel: "Messages",
        }}
      />
      <Tab.Screen
        name="TrainerProfile"
        component={TrainerProfileScreen}
        initialParams={{ userData: profileData }}
        options={{
          tabBarIcon: ({ color, size }) => (
            <View style={{ position: "relative" }}>
              <Ionicons name="person" color={color} size={size} />
              {!isProfileComplete && (
                <View
                  style={{
                    position: "absolute",
                    top: -4,
                    right: -4,
                    backgroundColor: "#f59e0b",
                    borderRadius: 10,
                    width: 20,
                    height: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: "700",
                    }}
                  >
                    !
                  </Text>
                </View>
              )}
            </View>
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

export default function TrainerDashboard({ route, navigation }) {
  const profileData = route?.params?.userData || {};
  const [profileCompletion, setProfileCompletion] = useState(0);

  useEffect(() => {
    if (profileData) {
      const completion = calculateProfileCompletion(profileData);
      setProfileCompletion(completion);

      // Redirect to profile if incomplete (less than 70%)
      if (completion < 70) {
        setTimeout(() => {
          navigation.navigate("TrainerTabs", {
            screen: "TrainerProfile",
          });
        }, 500);
      }
    }
  }, [profileData, navigation]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="TrainerTabs"
        component={TrainerDashboardTabs}
        initialParams={{ profileData }}
        options={{
          animationEnabled: false,
          params: { profileData },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    position: "relative",
  },
});
