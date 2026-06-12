import React from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notifications";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatRelative } from "@/utils/format";
import { useRouter } from "expo-router";

export const NotificationsList = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isRefetching, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationsApi.list(),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });

  const markAllRead = useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["unread-notifications-count"] });
    },
  });

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unread_count ?? 0;

  const handleNotificationPress = (notification: any) => {
    if (!notification.read) {
      markRead.mutate(notification.id);
    }
    
    // Simple deep link handling if backend provided a URL
    if (notification.data?.url) {
      router.push(notification.data.url as any);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center pt-10">
        <Text className="text-text-muted font-inter">Loading notifications...</Text>
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        emoji="📭"
        title="No notifications yet"
        description="When you get updates about bookings or opportunities, they will appear here."
      />
    );
  }

  return (
    <ScrollView
      className="flex-1"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6C5CE7" />
      }
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="px-5 mb-4 mt-2 flex-row items-center justify-between">
        <Text className="text-text-secondary font-inter-semibold text-sm">
          {unreadCount > 0 ? `${unreadCount} Unread` : "All caught up!"}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={() => markAllRead.mutate()}>
            <Text className="text-brand-400 font-inter-medium text-sm">Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="px-5 gap-3">
        {notifications.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            onPress={() => handleNotificationPress(notif)}
            className={`rounded-3xl p-4 flex-row items-start gap-4 border ${
              notif.read
                ? "bg-surface-elevated border-surface-border opacity-70"
                : "bg-brand-500/10 border-brand-500/30"
            }`}
          >
            <View className="w-12 h-12 rounded-full bg-dark-700 items-center justify-center">
              <Text className="text-xl">
                {notif.type === "booking" ? "📅" : notif.type === "payment" ? "💰" : "🔔"}
              </Text>
            </View>
            <View className="flex-1 pt-1">
              <Text
                className={`font-inter-semibold text-base mb-1 ${
                  notif.read ? "text-text-primary" : "text-brand-300"
                }`}
              >
                {notif.title}
              </Text>
              <Text className="text-text-muted font-inter text-sm leading-relaxed mb-2">
                {notif.message}
              </Text>
              <Text className="text-text-secondary font-inter text-xs">
                {formatRelative(notif.created_at)}
              </Text>
            </View>
            {!notif.read && <View className="w-2 h-2 rounded-full bg-brand-500 mt-2" />}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};
