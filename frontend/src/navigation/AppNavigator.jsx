import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, ActivityIndicator } from "react-native";

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

// USER DASHBOARD & SCREENS
import UserDashboard from "../dashboard/UserDashboard";
import UserHome from "../user/UserHome";
import UserProfile from "../user/UserProfile";
import UserMessages from "../user/UserMessages";
import SearchTrainer from "../user/SearchTrainer";
import TrainerDetail from "../user/TrainerDetail";
import BookingHistory from "../user/BookingHistory";

// TRAINER DASHBOARD & SCREENS
import TrainerDashboard from "../trainer/TrainerDashboard";
import TrainerHome from "../trainer/TrainerHome";
import TrainerProfile from "../trainer/TrainerProfile";
import TrainerAvailability from "../trainer/Availability";
import TrainerBookings from "../trainer/Bookings";
import TrainerMessages from "../trainer/Messages";
import BookingRequests from "../trainer/BookingRequests";
import TrainerReviews from "../trainer/Reviews";

// DASHBOARD SCREENS
import DashboardHome from "../dashboard/Home";
import DashboardBookings from "../dashboard/Bookings";
import DashboardMessages from "../dashboard/Messages";
import DashboardProfile from "../dashboard/Profile";

const Stack = createNativeStackNavigator();

function LoadingScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f172a" }}>
      <ActivityIndicator size="large" color="#6366f1" />
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer
      fallback={<LoadingScreen />}
      onReady={() => {
        console.log("Navigation container ready");
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          cardStyle: { backgroundColor: "#070B1A" },
        }}
        initialRouteName="Splash"
      >
        {/* ===== SPLASH SCREEN ===== */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* ===== AUTHENTICATION FLOW ===== */}
        <Stack.Screen 
          name="RoleSelect" 
          component={RoleSelectScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TrainerRegister" 
          component={TrainerRegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ForgotPassword" 
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="OTPVerification" 
          component={OTPVerificationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ResetPassword" 
          component={ResetPasswordScreen}
          options={{ headerShown: false }}
        />

        {/* ===== USER FLOW ===== */}
        <Stack.Screen 
          name="UserDashboard" 
          component={UserDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="UserHome" 
          component={UserHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="UserProfile" 
          component={UserProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="UserMessages" 
          component={UserMessages}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SearchTrainer" 
          component={SearchTrainer}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TrainerDetail" 
          component={TrainerDetail}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="BookingHistory" 
          component={BookingHistory}
          options={{ headerShown: false }}
        />

        {/* ===== TRAINER FLOW ===== */}
        <Stack.Screen 
          name="TrainerDashboard" 
          component={TrainerDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TrainerHome" 
          component={TrainerHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TrainerProfile" 
          component={TrainerProfile}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TrainerAvailability" 
          component={TrainerAvailability}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TrainerBookings" 
          component={TrainerBookings}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TrainerMessages" 
          component={TrainerMessages}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="BookingRequests" 
          component={BookingRequests}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="TrainerReviews" 
          component={TrainerReviews}
          options={{ headerShown: false }}
        />

        {/* ===== DASHBOARD SCREENS ===== */}
        <Stack.Screen 
          name="DashboardHome" 
          component={DashboardHome}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DashboardBookings" 
          component={DashboardBookings}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DashboardMessages" 
          component={DashboardMessages}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="DashboardProfile" 
          component={DashboardProfile}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
