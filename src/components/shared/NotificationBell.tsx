import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications";

import { useAuthStore } from "@/store/authStore";

export const NotificationBell = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data } = useQuery({
    queryKey: ["unread-notifications-count"],
    queryFn: () => notificationsApi.list(),
    refetchInterval: 30000, // poll every 30s
  });

  const unreadCount = data?.unread_count ?? 0;

  const handlePress = () => {
    if (user?.account_type === "creator") {
      router.push("/(creator)/notifications" as any);
    } else if (user?.account_type === "vendor") {
      router.push("/(vendor)/notifications" as any);
    } else {
      router.push("/(client)/notifications" as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-11 h-11 items-center justify-center relative rounded-full bg-surface-elevated"
      accessibilityLabel="Notifications"
    >
      <Text className="text-xl">🔔</Text>
      {unreadCount > 0 && (
        <View className="absolute top-2 right-2 min-w-[18px] h-[18px] rounded-full bg-error items-center justify-center px-1">
          <Text className="text-white font-inter-bold" style={{ fontSize: 10 }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
