import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "../contexts/AuthContext";

// SPLASH SCREEN
import SplashScreen from "../screens/SplashScreen";

// AUTH SCREENS
import RoleSelectScreen from "../screens/RoleSelectScreen";
import LoginScreen from "../screens/LoginScreen_API";
import RegisterScreen from "../screens/RegisterScreen_API";
import TrainerRegisterScreen from "../screens/TrainerRegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import OTPVerificationScreen from "../screens/OTPVerificationScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

// USER FLOW
import UserDashboard from "../dashboard/UserDashboard";
import TrainerDetail from "../user/TrainerDetail";

// TRAINER FLOW
import TrainerDashboard from "../trainer/TrainerDashboard";

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" }}>
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );
}

export default function AppNavigator() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          contentStyle: { backgroundColor: "#070B1A" },
        }}
      >
        {/* ================= SPLASH ================= */}
        {!isAuthenticated && (
          <Stack.Screen name="Splash" component={SplashScreen} />
        )}

        {/* ================= AUTH FLOW ================= */}
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="TrainerRegister" component={TrainerRegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
          </>
        ) : user?.role === "TRAINER" ? (
          /* ================= TRAINER FLOW ================= */
          <>
            <Stack.Screen name="TrainerDashboard" component={TrainerDashboard} />
          </>
        ) : (
          /* ================= USER FLOW ================= */
          <>
            <Stack.Screen name="UserDashboard" component={UserDashboard} />
            {/* TrainerDetail is reachable from Home/User tabs via navigation.navigate('TrainerDetail') */}
            <Stack.Screen name="TrainerDetail" component={TrainerDetail} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
