import { View, TouchableOpacity, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState } from "react";
import Home from "./Home";
import Bookings from "./Bookings";
import Messages from "./Messages";
import Profile from "./Profile";
import { useAuth } from "../contexts/AuthContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs({ route }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0f1419",
          borderTopColor: "#2a2f3f",
          borderTopWidth: 1,
          paddingVertical: 8,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: "#8b5cf6",
        tabBarInactiveTintColor: "#666",
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 4,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={Home}
        initialParams={{ userData: route?.params?.userData }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="BookingsTab"
        component={Bookings}
        initialParams={{ userData: route?.params?.userData }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar" size={24} color={color} />
          ),
          tabBarLabel: "Bookings",
        }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={Messages}
        initialParams={{ userData: route?.params?.userData }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble" size={24} color={color} />
          ),
          tabBarLabel: "Messages",
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={Profile}
        initialParams={{ userData: route?.params?.userData }}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

export default function UserDashboard({ route }) {
  const { user } = useAuth();
  const userData = route?.params?.userData ?? user;

  console.log(
    "UserDashboard userData (source):",
    route?.params?.userData ? "route" : user ? "auth" : "none",
    userData
  );

  // always pass a resolved `route.params` to the tabs so child screens can keep
  // using `route.params.userData` without changing their implementation
  return <DashboardTabs route={{ params: { userData } }} />;
}
