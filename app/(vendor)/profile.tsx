import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";
export default function VendorProfile() {
  const { user, logout } = useAuthStore();
  return (
    <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center px-8">
      <Text className="text-text-primary font-inter-bold text-xl text-center mb-2">{user?.full_name}</Text>
      <Text className="text-text-muted font-inter text-sm mb-8">{user?.email}</Text>
      <Button variant="danger" size="lg" fullWidth onPress={() => Alert.alert("Sign Out", "Sure?", [{ text: "Cancel" }, { text: "Sign Out", onPress: logout }])}>Sign Out</Button>
    </SafeAreaView>
  );
}
