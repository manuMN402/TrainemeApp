# How to Access Trainer Dashboard - Integration Examples

## 🎯 Method 1: Quick Test Button (Easiest)

Add this button to your **LoginScreen.jsx** temporarily:

```jsx
// Add after the login form, before closing </ScrollView>

<TouchableOpacity
  style={{
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#6366f1",
    borderRadius: 8,
    alignItems: "center",
  }}
  onPress={() => navigation.navigate("TrainerDashboard")}
>
  <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
    🧑‍🏫 Test Trainer Dashboard
  </Text>
</TouchableOpacity>
```

**Result**: A purple button that takes you directly to the trainer dashboard.

---

## 🎯 Method 2: Role-Based Navigation

Update your **RoleSelectScreen.jsx** to navigate based on selected role:

```jsx
import { View, Text, TouchableOpacity, SafeAreaView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { FONT_SIZES, SPACING } from "../utils/responsiveDesign";

export default function RoleSelectScreen({ navigation }) {
  const handleSelectRole = (role) => {
    if (role === "trainer") {
      // Navigate to Trainer Dashboard
      navigation.navigate("TrainerDashboard");
    } else {
      // Navigate to User Dashboard
      navigation.navigate("UserDashboard");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Your Role</Text>

        {/* Trainer Role Button */}
        <TouchableOpacity
          style={[styles.roleButton, styles.trainerButton]}
          onPress={() => handleSelectRole("trainer")}
        >
          <Ionicons name="person-circle-outline" size={48} color="#fff" />
          <Text style={styles.roleTitle}>Trainer</Text>
          <Text style={styles.roleDescription}>
            Manage availability, bookings, and clients
          </Text>
        </TouchableOpacity>

        {/* User Role Button */}
        <TouchableOpacity
          style={[styles.roleButton, styles.userButton]}
          onPress={() => handleSelectRole("user")}
        >
          <Ionicons name="person-outline" size={48} color="#fff" />
          <Text style={styles.roleTitle}>User</Text>
          <Text style={styles.roleDescription}>
            Search trainers and book sessions
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1e",
  },
  content: {
    flex: 1,
    padding: SPACING.L,
    justifyContent: "center",
    gap: SPACING.L,
  },
  title: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: SPACING.L,
  },
  roleButton: {
    paddingVertical: SPACING.XXL,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: SPACING.M,
  },
  trainerButton: {
    backgroundColor: Colors.primary,
  },
  userButton: {
    backgroundColor: "#10b981",
  },
  roleTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: "#fff",
  },
  roleDescription: {
    fontSize: FONT_SIZES.BODY_S,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
});
```

---

## 🎯 Method 3: Authentication-Based Navigation

In your main **App.js** or **index.js**, add role checking:

```jsx
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const role = await AsyncStorage.getItem("userRole");
      setUserRole(role);
    } catch (error) {
      console.error("Error checking user role:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return <AppNavigator initialRoute={userRole} />;
}
```

Then update **AppNavigator.jsx**:

```jsx
export default function AppNavigator({ initialRoute }) {
  const getInitialScreen = () => {
    if (initialRoute === "trainer") return "TrainerDashboard";
    if (initialRoute === "user") return "UserDashboard";
    return "RoleSelect";
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false, animationEnabled: true }}
        initialRouteName={getInitialScreen()}
      >
        {/* All screens here... */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

---

## 🎯 Method 4: Navigation from LoginScreen

Update **LoginScreen.jsx** to navigate to TrainerDashboard after login:

```jsx
const handleLogin = async () => {
  if (!validateForm()) return;

  setLoading(true);
  try {
    // Simulate login API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if user is a trainer
    const userRole = await getUserRole(email); // Your API call
    
    if (userRole === "trainer") {
      // Save role and navigate to trainer dashboard
      await AsyncStorage.setItem("userRole", "trainer");
      navigation.navigate("TrainerDashboard");
    } else {
      // Navigate to user dashboard
      await AsyncStorage.setItem("userRole", "user");
      navigation.navigate("UserDashboard");
    }

    Alert.alert("Success", `Welcome back!`);
  } catch (error) {
    Alert.alert("Error", "Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

---

## 🎯 Method 5: Deep Linking (Advanced)

Set up deep links to navigate directly to trainer dashboard:

```jsx
// In AppNavigator.jsx

const linking = {
  prefixes: ["traineme://", "https://traineme.app"],
  config: {
    screens: {
      TrainerDashboard: "trainer/dashboard",
      UserDashboard: "user/dashboard",
      Login: "auth/login",
      Register: "auth/register",
    },
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      {/* Navigation content */}
    </NavigationContainer>
  );
}
```

Then you can navigate using:
```jsx
// From anywhere in the app
navigation.navigate("TrainerDashboard");

// Or using deep link
Linking.openURL("traineme://trainer/dashboard");
```

---

## 🎯 Quick Setup Checklist

- [ ] Choose a method above (Method 1 is easiest for testing)
- [ ] Add the code to your chosen file
- [ ] Run `npx expo start`
- [ ] Test the navigation
- [ ] Explore all 6 tabs in the trainer dashboard
- [ ] Test adding/editing/deleting data
- [ ] Verify responsive design on different devices

---

## 📝 Code Snippets for Quick Integration

### Copy-Paste: Add Test Button to LoginScreen

```jsx
{/* Add this before the closing </ScrollView> in LoginScreen */}
<View style={{ marginTop: 20, paddingBottom: 40 }}>
  <TouchableOpacity
    style={{
      backgroundColor: "#6366f1",
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
    }}
    onPress={() => navigation.navigate("TrainerDashboard")}
  >
    <Text style={{ color: "#fff", fontWeight: "600" }}>
      🧑‍🏫 Test Trainer Dashboard
    </Text>
  </TouchableOpacity>
</View>
```

### Copy-Paste: Add Test Button to RegisterScreen

```jsx
{/* Add this before the closing </ScrollView> in RegisterScreen */}
<TouchableOpacity
  style={{
    backgroundColor: "#6366f1",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  }}
  onPress={() => navigation.navigate("TrainerDashboard")}
>
  <Text style={{ color: "#fff", fontWeight: "600" }}>
    View Trainer Dashboard
  </Text>
</TouchableOpacity>
```

---

## 🎬 Testing Quick Commands

Once the trainer dashboard is accessible, test:

```
1. Click Home tab → See stats and earnings chart
2. Click Availability tab → Add a new time slot
3. Click Bookings tab → Accept/Reject/Complete bookings
4. Click Messages tab → Send a message
5. Click Reviews tab → See review analytics
6. Click Profile tab → Edit trainer information
```

---

## ✅ Verification Steps

After integration, verify:

- [ ] App runs without errors
- [ ] Navigation to TrainerDashboard works
- [ ] All 6 tabs are visible and clickable
- [ ] Bottom tab bar shows all icons
- [ ] Mock data loads correctly
- [ ] Can interact with all screens
- [ ] Responsive on different screen sizes
- [ ] Dark theme displays correctly

---

## 🔧 Troubleshooting

### Issue: "TrainerDashboard is not defined"
**Solution**: Make sure you imported it in AppNavigator:
```jsx
import TrainerDashboard from "../trainer/TrainerDashboard";
```

### Issue: "Navigation is undefined"
**Solution**: Ensure you're inside a screen component:
```jsx
// Correct:
export default function LoginScreen({ navigation }) {
  // navigation is available
}

// Wrong:
function SomeComponent() {
  // navigation is NOT available
  // Use: const navigation = useNavigation();
}
```

### Issue: Bottom tabs not showing
**Solution**: Check that TrainerDashboard.jsx has:
```jsx
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
const Tab = createBottomTabNavigator();
```

### Issue: Mock data not loading
**Solution**: Verify import path in each screen:
```jsx
import { bookingsData } from "../data/trainer/bookings";
```

---

## 🎉 You're All Set!

Choose your preferred integration method and start using the trainer dashboard. The easiest method for quick testing is **Method 1** (add a button).

For production, use **Method 3** (authentication-based) or **Method 4** (post-login navigation).

Enjoy! 🚀
