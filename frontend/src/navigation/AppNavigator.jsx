import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RoleSelectScreen from "../screens/RoleSelectScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TrainerRegisterScreen from "../screens/TrainerRegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import OTPVerificationScreen from "../screens/OTPVerificationScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";

import UserDashboard from "../dashboard/UserDashboard";
import UserHome from "../user/UserHome";
import UserProfile from "../user/UserProfile";
import UserMessages from "../user/UserMessages";
import SearchTrainer from "../user/SearchTrainer";
import TrainerDetail from "../user/TrainerDetail";
import BookingHistory from "../user/BookingHistory";

import TrainerDashboard from "../trainer/TrainerDashboard";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="TrainerRegister" component={TrainerRegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />

        {/* USER SCREENS - Using UserDashboard with tab navigation */}
        <Stack.Screen 
          name="UserDashboard" 
          component={UserDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="UserHome" component={UserHome} />
        <Stack.Screen name="UserProfile" component={UserProfile} />
        <Stack.Screen name="UserMessages" component={UserMessages} />
        <Stack.Screen name="SearchTrainer" component={SearchTrainer} />
        <Stack.Screen name="TrainerDetail" component={TrainerDetail} />
        <Stack.Screen name="BookingHistory" component={BookingHistory} />

        {/* TRAINER SCREENS - Using TrainerDashboard with tab navigation */}
        <Stack.Screen 
          name="TrainerDashboard" 
          component={TrainerDashboard}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
