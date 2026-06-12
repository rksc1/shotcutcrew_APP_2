import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import { vendorsApi } from "@/api/vendors"; // We'll need to make this stub
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/format";
import { useAuthStore } from "@/store/authStore";

export default function PublicVendorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const isClient = user?.account_type === "client";

  const { data, isLoading } = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => vendorsApi.get(id as string),
  });

  const vendor = data?.vendor;
  const inventory = data?.inventory ?? [];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center">
        <ActivityIndicator size="large" color="#00B894" />
      </SafeAreaView>
    );
  }

  if (!vendor) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center">
        <Text className="text-4xl mb-4">😕</Text>
        <Text className="text-text-primary font-inter-bold text-xl text-center mb-6">
          Vendor not found
        </Text>
        <Button variant="secondary" size="lg" onPress={() => router.back()}>
          Go Back
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cover image */}
        <View className="h-48 bg-dark-700 relative">
          <View className="flex-1 bg-gradient-to-b from-brand-500/30 to-dark-900" />
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 w-11 h-11 rounded-2xl bg-dark-900/70 items-center justify-center"
            accessibilityLabel="Go back"
          >
            <Text className="text-white text-xl">←</Text>
          </TouchableOpacity>
        </View>

        {/* Profile header */}
        <View className="px-5 -mt-12">
          <View className="flex-row items-end justify-between mb-4">
            <View className="border-4 border-dark-900 rounded-full">
              <Avatar uri={vendor.profile_image_url} name={vendor.business_name} size={80} />
            </View>
            <View className="flex-row items-center gap-1.5 bg-success/20 border border-success/40 rounded-full px-3 py-1.5 mb-2">
              <View className="w-2 h-2 rounded-full bg-success" />
              <Text className="text-success font-inter-medium text-xs">Accepting Orders</Text>
            </View>
          </View>

          <Animated.View entering={FadeInDown.delay(100)}>
            <Text className="text-text-primary font-inter-bold text-2xl">
              {vendor.business_name}
            </Text>
            <Text className="text-text-muted font-inter text-base mt-0.5">
              Equipment Rental House
            </Text>

            <View className="flex-row items-center gap-2 mt-2 flex-wrap">
              <VerifiedBadge level="parichay" size="md" />
              <Text className="text-text-muted font-inter text-sm">📍 {vendor.city}</Text>
            </View>
          </Animated.View>

          {vendor.bio && (
            <Animated.View entering={FadeInDown.delay(220)} className="mt-4">
              <Text className="text-text-secondary font-inter-semibold text-sm mb-2">About</Text>
              <Text className="text-text-muted font-inter text-sm leading-relaxed">
                {vendor.bio}
              </Text>
            </Animated.View>
          )}

          {/* Inventory */}
          <Animated.View entering={FadeInDown.delay(340)} className="mt-8">
            <Text className="text-text-primary font-inter-bold text-xl mb-4">Inventory</Text>
            <View className="gap-3">
              {inventory.map((item) => (
                <View key={item.id} className="bg-surface-elevated border border-surface-border rounded-3xl p-4 flex-row items-center gap-4">
                  <View className="w-16 h-16 rounded-2xl bg-dark-700 items-center justify-center">
                    <Text className="text-2xl">{item.category === "Camera" ? "📷" : item.category === "Lighting" ? "💡" : "🚁"}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary font-inter-semibold text-base mb-1">{item.name}</Text>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-text-muted font-inter text-sm">{item.category}</Text>
                      <Text className="text-text-muted text-xs">•</Text>
                      <Text className={item.available ? "text-success text-xs font-inter-medium" : "text-error text-xs font-inter-medium"}>
                        {item.available ? "Available" : "Currently Rented"}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-brand-400 font-inter-bold text-base">{formatCurrency(item.daily_rate)}</Text>
                    <Text className="text-text-muted font-inter text-xs">/ day</Text>
                  </View>
                </View>
              ))}
            </View>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Sticky Book CTA — clients only */}
      {isClient && (
        <View className="absolute bottom-0 left-0 right-0 bg-dark-900/95 border-t border-surface-border px-5 pb-8 pt-4">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            onPress={() => {}}
          >
            Request Rental Quote →
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
