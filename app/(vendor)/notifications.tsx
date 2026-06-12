import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VendorNotificationsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-900 justify-center items-center">
      <Text className="text-text-primary text-xl">Vendor Notifications</Text>
    </SafeAreaView>
  );
}
