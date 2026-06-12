import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
export default function VendorInventory() {
  return <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center px-8"><Text className="text-5xl mb-4">📦</Text><Text className="text-text-primary font-inter-bold text-xl text-center">Inventory</Text><Text className="text-text-muted font-inter text-sm mt-2 text-center">Manage your equipment catalog</Text></SafeAreaView>;
}
