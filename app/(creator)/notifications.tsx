import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { NotificationsList } from "@/components/shared/NotificationsList";

export default function CreatorNotificationsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between border-b border-surface-border">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-2xl bg-surface-elevated items-center justify-center"
        >
          <Text className="text-text-primary text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-text-primary font-inter-semibold text-lg">Notifications</Text>
        <View className="w-11" />
      </View>
      <NotificationsList />
    </SafeAreaView>
  );
}
