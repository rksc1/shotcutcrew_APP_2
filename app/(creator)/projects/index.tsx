import React from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Stub — full implementation in Phase 5
export default function CreatorProjectsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center px-8">
      <Text className="text-5xl mb-4">📋</Text>
      <Text className="text-text-primary font-inter-bold text-xl text-center">Projects</Text>
      <Text className="text-text-muted font-inter text-base text-center mt-2">
        Your active and completed projects will appear here.
      </Text>
    </SafeAreaView>
  );
}
