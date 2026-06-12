import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/authStore";
import { VerifiedBadge, getVerifyLevel } from "@/components/ui/VerifiedBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";

export default function ClientProfileScreen() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const level = getVerifyLevel(user?.parichay_verified, user?.verified);

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 pb-4 items-center gap-4">
          <Avatar uri={user?.profile_image_url} name={user?.full_name} size={88} />
          <View className="items-center gap-1">
            <Text className="text-text-primary font-inter-bold text-2xl">
              {user?.full_name || "Client"}
            </Text>
            <Text className="text-text-muted font-inter text-sm">{user?.email}</Text>
            {level !== "none" && <VerifiedBadge level={level} size="md" />}
          </View>
        </View>

        <View className="px-5 gap-2">
          {[
            { emoji: "📋", label: "My Projects", onPress: () => router.push("/(client)/projects") },
            { emoji: "⚙️", label: "Account Settings", onPress: () => {} },
            { emoji: "💬", label: "Support", onPress: () => {} },
            { emoji: "⭐", label: "Rate the App", onPress: () => {} },
          ].map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onPress}
              className="flex-row items-center gap-4 bg-surface-elevated rounded-2xl px-4 py-4 border border-surface-border"
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <Text className="text-xl">{item.emoji}</Text>
              <Text className="text-text-primary font-inter-medium text-base flex-1">{item.label}</Text>
              <Text className="text-text-muted text-lg">›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View className="px-5 mt-4">
          <Button variant="danger" size="lg" fullWidth onPress={handleLogout}>
            Sign Out
          </Button>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-text-muted font-inter text-xs text-center">
            ShotcutCrew V2 • Client App
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
