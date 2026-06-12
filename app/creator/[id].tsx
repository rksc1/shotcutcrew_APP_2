import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import Animated, { FadeInDown } from "react-native-reanimated";
import { creatorsApi } from "@/api/creators";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge, getVerifyLevel } from "@/components/ui/VerifiedBadge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency } from "@/utils/format";
import { useAuthStore } from "@/store/authStore";

export default function PublicCreatorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const isClient = user?.account_type === "client";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["creator-profile", id],
    queryFn: () => creatorsApi.getProfile(id),
    enabled: !!id,
  });

  const { data: portfolioData } = useQuery({
    queryKey: ["creator-portfolio", id],
    queryFn: () => creatorsApi.getPortfolio(id),
    enabled: !!id,
  });

  const creator = data?.creator;
  const portfolio = portfolioData?.items ?? [];
  const level = getVerifyLevel(creator?.parichay_verified, creator?.verified);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center">
        <ActivityIndicator size="large" color="#6C5CE7" />
      </SafeAreaView>
    );
  }

  if (isError || !creator) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center rounded-2xl bg-surface-elevated m-4"
          accessibilityLabel="Go back"
        >
          <Text className="text-text-primary text-xl">←</Text>
        </TouchableOpacity>
        <EmptyState emoji="😕" title="Creator not found" description="This creator profile may no longer be available." ctaLabel="Go Back" onCta={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cover image */}
        <View className="h-48 bg-dark-700 relative">
          {creator.cover_image_url ? (
            <Image
              source={{ uri: creator.cover_image_url }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              transition={400}
            />
          ) : (
            <View className="flex-1 bg-gradient-to-b from-brand-500/30 to-dark-900" />
          )}

          {/* Back button */}
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
              <Avatar uri={creator.profile_image_url} name={creator.full_name} size={80} />
            </View>
            {creator.available_for_booking && (
              <View className="flex-row items-center gap-1.5 bg-success/20 border border-success/40 rounded-full px-3 py-1.5 mb-2">
                <View className="w-2 h-2 rounded-full bg-success" />
                <Text className="text-success font-inter-medium text-xs">Available</Text>
              </View>
            )}
          </View>

          <Animated.View entering={FadeInDown.delay(100)}>
            <Text className="text-text-primary font-inter-bold text-2xl">
              {creator.full_name || "Creator"}
            </Text>
            <Text className="text-text-muted font-inter text-base mt-0.5">
              {creator.role?.replace(/_/g, " ")}
            </Text>

            <View className="flex-row items-center gap-2 mt-2 flex-wrap">
              {level !== "none" && <VerifiedBadge level={level} size="md" />}
              {creator.city && (
                <Text className="text-text-muted font-inter text-sm">📍 {creator.city}</Text>
              )}
            </View>
          </Animated.View>

          {/* Stats row */}
          <Animated.View entering={FadeInDown.delay(160)}>
            <View className="flex-row gap-3 mt-4">
              {creator.day_rate && (
                <View className="flex-1 bg-surface-elevated rounded-2xl p-3 items-center border border-surface-border">
                  <Text className="text-brand-400 font-inter-bold text-lg">
                    {formatCurrency(creator.day_rate)}
                  </Text>
                  <Text className="text-text-muted font-inter text-xs mt-0.5">Day Rate</Text>
                </View>
              )}
              {creator.completed_projects != null && creator.completed_projects > 0 && (
                <View className="flex-1 bg-surface-elevated rounded-2xl p-3 items-center border border-surface-border">
                  <Text className="text-text-primary font-inter-bold text-lg">
                    {creator.completed_projects}
                  </Text>
                  <Text className="text-text-muted font-inter text-xs mt-0.5">Projects Done</Text>
                </View>
              )}
              {creator.rating != null && (
                <View className="flex-1 bg-surface-elevated rounded-2xl p-3 items-center border border-surface-border">
                  <Text className="text-text-primary font-inter-bold text-lg">
                    ⭐ {creator.rating.toFixed(1)}
                  </Text>
                  <Text className="text-text-muted font-inter text-xs mt-0.5">Rating</Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* Bio */}
          {creator.bio && (
            <Animated.View entering={FadeInDown.delay(220)} className="mt-4">
              <Text className="text-text-secondary font-inter-semibold text-sm mb-2">About</Text>
              <Text className="text-text-muted font-inter text-sm leading-relaxed">
                {creator.bio}
              </Text>
            </Animated.View>
          )}

          {/* Service tags */}
          {creator.service_tags && creator.service_tags.length > 0 && (
            <Animated.View entering={FadeInDown.delay(280)} className="mt-4">
              <Text className="text-text-secondary font-inter-semibold text-sm mb-2">
                Specialties
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {creator.service_tags.map((tag) => (
                  <View
                    key={tag}
                    className="bg-surface-elevated border border-surface-border rounded-xl px-3 py-1.5"
                  >
                    <Text className="text-text-secondary font-inter text-xs">
                      {tag.replace(/_/g, " ")}
                    </Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Portfolio Gallery */}
          {portfolio.length > 0 && (
            <Animated.View entering={FadeInDown.delay(340)} className="mt-6">
              <Text className="text-text-secondary font-inter-semibold text-sm mb-3">
                Portfolio
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {portfolio.slice(0, 9).map((item, idx) => (
                  <View
                    key={item.id}
                    className="rounded-2xl overflow-hidden"
                    style={{ width: "31.5%", aspectRatio: 1 }}
                  >
                    <Image
                      source={{ uri: item.thumbnail_url || item.media_url }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                      transition={300}
                      placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                    />
                    {item.media_type === "video" && (
                      <View className="absolute inset-0 items-center justify-center bg-dark-900/30">
                        <Text className="text-white text-2xl">▶</Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {portfolio.length === 0 && (
            <Animated.View entering={FadeInDown.delay(340)} className="mt-6">
              <Text className="text-text-secondary font-inter-semibold text-sm mb-2">
                Portfolio
              </Text>
              <View className="bg-surface-elevated rounded-2xl p-6 items-center border border-surface-border">
                <Text className="text-text-muted font-inter text-sm text-center">
                  No portfolio items yet
                </Text>
              </View>
            </Animated.View>
          )}
        </View>
      </ScrollView>

      {/* Sticky Book CTA — clients only */}
      {isClient && (
        <View className="absolute bottom-0 left-0 right-0 bg-dark-900/95 border-t border-surface-border px-5 pb-8 pt-4">
          <Button
            variant="primary"
            size="xl"
            fullWidth
            onPress={() => router.push("/(client)/book")}
          >
            Book {creator.full_name?.split(" ")[0] || "Creator"} →
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
