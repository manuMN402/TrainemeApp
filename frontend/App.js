import { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/contexts/AuthContext";
import { systemAPI } from "./src/services/apiService";

export default function App() {

  useEffect(() => {
    // Backend health check (dev only)
    systemAPI.health()
      .then(res => {
        console.log("✅ Backend connected:", res);
      })
      .catch(err => {
        console.log("❌ Backend connection failed:", err.message);
      });
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
