import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/authStore";
import { VerifiedBadge, getVerifyLevel } from "@/components/ui/VerifiedBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";

export default function CreatorProfileScreen() {
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
        {/* Cover */}
        <View className="h-32 bg-gradient-to-b from-success/20 to-dark-900" />

        {/* Avatar + info */}
        <View className="px-5 -mt-10">
          <View className="flex-row items-end justify-between mb-4">
            <Avatar uri={user?.profile_image_url} name={user?.full_name} size={80} />
            <TouchableOpacity
              className="bg-surface-elevated border border-surface-border rounded-2xl px-4 py-2"
              accessibilityLabel="Edit profile"
            >
              <Text className="text-text-primary font-inter-medium text-sm">Edit Profile</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-text-primary font-inter-bold text-2xl">
            {user?.full_name || "Creator"}
          </Text>
          <Text className="text-text-muted font-inter text-sm mt-0.5">
            {user?.email}
          </Text>
          <View className="mt-2">
            {level !== "none" ? (
              <VerifiedBadge level={level} size="md" />
            ) : (
              <Text className="text-text-muted font-inter text-xs">Verification pending</Text>
            )}
          </View>
        </View>

        {/* Menu items */}
        <View className="px-5 mt-6 gap-2">
          {[
            { emoji: "🎨", label: "Portfolio", onPress: () => {} },
            { emoji: "⚙️", label: "Account Settings", onPress: () => {} },
            { emoji: "💬", label: "Support", onPress: () => {} },
            { emoji: "📄", label: "Creator Agreement", onPress: () => {} },
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

        <View className="px-5 mt-4 gap-3">
          <Button variant="outline" size="lg" fullWidth onPress={handleLogout}>
            Sign Out
          </Button>
          <Button 
            variant="danger" 
            size="lg" 
            fullWidth 
            onPress={() => {
              Alert.alert(
                "Delete Account",
                "Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Delete My Account", 
                    style: "destructive", 
                    onPress: async () => {
                      try {
                        const { authApi } = await import("@/api/auth");
                        await authApi.deleteAccount();
                        logout();
                      } catch (e: any) {
                        Alert.alert("Error", e.message || "Failed to delete account");
                      }
                    }
                  },
                ]
              );
            }}
          >
            Delete Account
          </Button>
        </View>

        <View className="px-5 mt-6">
          <Text className="text-text-muted font-inter text-xs text-center">
            ShotcutCrew V2 • Creator App
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
