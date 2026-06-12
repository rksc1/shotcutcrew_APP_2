import "../global.css";
import React, { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { QueryClientProvider } from "@tanstack/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/authStore";
import { usePushNotifications } from "@/hooks/usePushNotifications";

function RootNavigator() {
  const router = useRouter();
  const segments = useSegments();
  const { user, isInitialized, initialize } = useAuthStore();
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    // Optionally: if user and expoPushToken are both present, we could sync it to the backend here.
    // E.g., notificationsApi.registerPushToken(expoPushToken)
  }, [user, expoPushToken]);

  useEffect(() => {
    if (!isInitialized) return;

    const inPublic = segments[0] === "(public)";

    if (!user && !inPublic) {
      router.replace("/(public)");
      return;
    }

    if (user) {
      const target = getRoleRoute(user.account_type);
      if (inPublic) {
        router.replace(target as never);
      }
    }
  }, [user, isInitialized, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="(public)" />
      <Stack.Screen name="(client)" />
      <Stack.Screen name="(creator)" />
      <Stack.Screen name="(vendor)" />
      <Stack.Screen name="(coordinator)" />
      <Stack.Screen name="(admin)" />
      <Stack.Screen
        name="creator/[id]"
        options={{ animation: "slide_from_right", presentation: "card" }}
      />
      <Stack.Screen
        name="vendor/[id]"
        options={{ animation: "slide_from_right", presentation: "card" }}
      />
    </Stack>
  );
}

function getRoleRoute(accountType: string | null): string {
  switch (accountType) {
    case "creator":            return "/(creator)/";
    case "vendor":             return "/(vendor)/";
    case "parichay_coordinator": return "/(coordinator)/";
    case "admin":              return "/(admin)/";
    default:                   return "/(client)/";
  }
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
