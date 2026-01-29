import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RoleSelectScreen from "../screens/RoleSelectScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";

import UserDashboard from "../dashboard/UserDashboard";
import UserHome from "../user/UserHome";
import UserProfile from "../user/UserProfile";
import UserMessages from "../user/UserMessages";
import SearchTrainer from "../user/SearchTrainer";
import TrainerDetail from "../user/TrainerDetail";
import BookingHistory from "../user/BookingHistory";

import TrainerHome from "../trainer/TrainerHome";
import TrainerProfile from "../trainer/TrainerProfile";
import Availability from "../trainer/Availability";
import BookingRequests from "../trainer/BookingRequests";

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

        {/* TRAINER SCREENS */}
        <Stack.Screen name="TrainerHome" component={TrainerHome} />
        <Stack.Screen name="TrainerProfile" component={TrainerProfile} />
        <Stack.Screen name="Availability" component={Availability} />
        <Stack.Screen name="BookingRequests" component={BookingRequests} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
