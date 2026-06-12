import { Stack } from "expo-router";

export default function PublicLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="login" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="signup" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="forgot-password" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}
