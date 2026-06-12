import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";

// Minimal splash — routes to correct destination immediately
// No animations, no delays — target <1s startup
export default function SplashScreen() {
  const router = useRouter();
  const { user, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) return;

    if (user) {
      const target = getRoleRoute(user.account_type);
      router.replace(target as never);
    } else {
      router.replace("/(public)/onboarding");
    }
  }, [user, isInitialized, router]);

  return (
    <View className="flex-1 bg-dark-900 items-center justify-center">
      <ActivityIndicator size="large" color="#6C5CE7" />
    </View>
  );
}

function getRoleRoute(accountType: string | null): string {
  switch (accountType) {
    case "creator":              return "/(creator)/";
    case "vendor":               return "/(vendor)/";
    case "parichay_coordinator": return "/(coordinator)/";
    case "admin":                return "/(admin)/";
    default:                     return "/(client)/";
  }
}
