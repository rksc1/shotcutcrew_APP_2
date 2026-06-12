import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import Animated, { FadeInDown } from "react-native-reanimated";
import { creatorsApi } from "@/api/creators";
import { CreatorCardHorizontal } from "@/components/creator/CreatorCard";
import { EmptyState, SkeletonCreatorCard } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/authStore";
import { BOOKING_EVENT_CATEGORIES } from "@/lib/constants";
import { NotificationBell } from "@/components/shared/NotificationBell";

// ─── Quick Categories ─────────────────────────────────────────────────────────
const QUICK_CATEGORIES = BOOKING_EVENT_CATEGORIES.slice(0, 5).map((c) => ({
  id: c.id,
  label: c.label,
  emoji: c.emoji,
}));

export default function ClientHomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: featuredData, isLoading: loadingFeatured, refetch: refetchFeatured } = useQuery({
    queryKey: ["creators", "featured"],
    queryFn: () => creatorsApi.getFeatured(),
  });

  const { data: topRatedData, isLoading: loadingTopRated } = useQuery({
    queryKey: ["creators", "top-rated"],
    queryFn: () => creatorsApi.list({ verified: true, limit: 8 }),
  });

  const featuredCreators = featuredData?.creators ?? [];
  const topRatedCreators = topRatedData?.creators ?? [];

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/(client)/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loadingFeatured}
            onRefresh={refetchFeatured}
            tintColor="#6C5CE7"
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ─── Header ─────────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(0).duration(400)} className="px-5 pt-4 pb-2">
          <View className="flex-row items-center justify-between mb-1">
            <View>
              <Text className="text-text-muted font-inter text-sm">
                {greeting()}, {user?.full_name?.split(" ")[0] || "there"} 👋
              </Text>
              <Text className="text-text-primary font-inter-bold text-2xl mt-0.5">
                Find Your Crew
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <NotificationBell />
              <TouchableOpacity
                onPress={() => router.push("/(client)/profile")}
                className="w-11 h-11 rounded-full bg-brand-500/20 border border-brand-500/30 items-center justify-center"
                accessibilityLabel="View profile"
              >
                <Text className="text-brand-300 font-inter-semibold">
                  {user?.full_name?.[0] || "U"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* ─── Search Bar ──────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(60).duration(400)} className="px-5 mb-4">
          <TouchableOpacity
            onPress={() => router.push("/(client)/explore")}
            className="flex-row items-center bg-surface-elevated border border-surface-border rounded-2xl px-4 h-12 gap-3"
            accessibilityLabel="Search creators and services"
            accessibilityRole="search"
          >
            <Text className="text-lg">🔍</Text>
            <Text className="text-text-muted font-inter text-base flex-1">
              Search photographers, videographers...
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ─── Quick Booking Banner ─────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(120).duration(400)} className="px-5 mb-6">
          <TouchableOpacity
            onPress={() => router.push("/(client)/book")}
            className="bg-brand-500 rounded-3xl p-5 overflow-hidden"
            accessibilityLabel="Start a quick booking"
            accessibilityRole="button"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white/70 font-inter text-sm mb-1">
                  Need a crew fast?
                </Text>
                <Text className="text-white font-inter-bold text-xl mb-3">
                  Book in 3 Minutes
                </Text>
                <View className="bg-white/20 rounded-2xl px-4 py-2 self-start">
                  <Text className="text-white font-inter-semibold text-sm">
                    Quick Book →
                  </Text>
                </View>
              </View>
              <Text className="text-6xl ml-4">⚡</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* ─── Popular Categories ───────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(180).duration(400)} className="mb-6">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <Text className="text-text-primary font-inter-semibold text-lg">Categories</Text>
            <TouchableOpacity onPress={() => router.push("/(client)/explore")}>
              <Text className="text-brand-400 font-inter-medium text-sm">See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
            {QUICK_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => router.push(`/(client)/explore?category=${cat.id}`)}
                className="bg-surface-elevated border border-surface-border rounded-2xl px-4 py-3 items-center gap-1 min-w-[80px]"
                accessibilityLabel={`Browse ${cat.label}`}
                accessibilityRole="button"
              >
                <Text className="text-2xl">{cat.emoji}</Text>
                <Text className="text-text-secondary font-inter text-xs text-center" numberOfLines={2}>
                  {cat.label.split(" ")[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* ─── Featured Creators ────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(240).duration(400)} className="mb-6">
          <View className="px-5 flex-row items-center justify-between mb-3">
            <Text className="text-text-primary font-inter-semibold text-lg">
              Featured Creators
            </Text>
            <TouchableOpacity onPress={() => router.push("/(client)/explore?verified=true")}>
              <Text className="text-brand-400 font-inter-medium text-sm">See all</Text>
            </TouchableOpacity>
          </View>

          {loadingFeatured ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {[...Array(4)].map((_, i) => <SkeletonCreatorCard key={i} />)}
            </ScrollView>
          ) : featuredCreators.length === 0 ? (
            <View className="px-5">
              <EmptyState
                emoji="🎬"
                title="Creators coming soon"
                description="Be the first to sign up and get featured."
                compact
              />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
              {featuredCreators.map((creator) => (
                <CreatorCardHorizontal key={creator.id} creator={creator} />
              ))}
            </ScrollView>
          )}
        </Animated.View>

        {/* ─── Equipment Marketplace ───────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-5 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-primary font-inter-semibold text-lg">
              Equipment Rental
            </Text>
            <TouchableOpacity>
              <Text className="text-brand-400 font-inter-medium text-sm">Browse</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-surface-elevated border border-surface-border rounded-3xl p-5 flex-row items-center gap-4"
            onPress={() => router.push("/(client)/explore?type=equipment")}
            accessibilityLabel="Browse equipment rental"
            accessibilityRole="button"
          >
            <View className="w-14 h-14 bg-accent-500/20 rounded-2xl items-center justify-center">
              <Text className="text-3xl">📷</Text>
            </View>
            <View className="flex-1">
              <Text className="text-text-primary font-inter-semibold text-base mb-1">
                Rent Pro Equipment
              </Text>
              <Text className="text-text-muted font-inter text-sm">
                Cameras, lights, drones & more from verified vendors
              </Text>
            </View>
            <Text className="text-text-muted text-xl">›</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ─── Top Rated ───────────────────────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(360).duration(400)} className="px-5 mb-6">
          <Text className="text-text-primary font-inter-semibold text-lg mb-3">
            Top Rated Creators
          </Text>
          {loadingTopRated ? (
            <View className="gap-3">
              {[...Array(3)].map((_, i) => (
                <View key={i} className="bg-surface-elevated rounded-3xl p-4 flex-row items-center gap-4">
                  <View className="w-12 h-12 rounded-full bg-surface-overlay" />
                  <View className="flex-1 gap-2">
                    <View className="h-3 bg-surface-overlay rounded-lg w-1/2" />
                    <View className="h-2.5 bg-surface-overlay rounded-lg w-3/4" />
                  </View>
                </View>
              ))}
            </View>
          ) : topRatedCreators.length === 0 ? (
            <EmptyState emoji="⭐" title="No top creators yet" description="Ratings will appear after project completions." compact />
          ) : (
            <View className="gap-3">
              {topRatedCreators.slice(0, 5).map((creator, idx) => (
                <TouchableOpacity
                  key={creator.id}
                  onPress={() => router.push(`/creator/${creator.id}`)}
                  className="bg-surface-elevated rounded-3xl p-4 flex-row items-center gap-4"
                  accessibilityLabel={`View ${creator.full_name || "creator"} profile`}
                  accessibilityRole="button"
                >
                  <View className="w-8 items-center">
                    <Text className="text-text-muted font-inter-bold text-base">
                      #{idx + 1}
                    </Text>
                  </View>
                  <View className="w-12 h-12 rounded-full bg-brand-500/20 items-center justify-center">
                    <Text className="text-text-primary font-inter-bold">
                      {creator.full_name?.[0] || "C"}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-text-primary font-inter-semibold text-sm" numberOfLines={1}>
                      {creator.full_name || "Creator"}
                    </Text>
                    <Text className="text-text-muted font-inter text-xs">
                      {creator.role?.replace(/_/g, " ")} • {creator.city}
                    </Text>
                  </View>
                  {creator.parichay_verified && (
                    <View className="bg-brand-500/20 px-2 py-0.5 rounded-lg">
                      <Text className="text-brand-300 text-xs font-inter-medium">Verified</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>

        {/* ─── Recent Opportunities / CTA ──────────────────────────────────── */}
        <Animated.View entering={FadeInDown.delay(420).duration(400)} className="px-5 mb-6">
          <View className="bg-surface-elevated border border-surface-border rounded-3xl p-6 items-center">
            <Text className="text-4xl mb-3">🚀</Text>
            <Text className="text-text-primary font-inter-bold text-xl text-center mb-2">
              Ready to start a project?
            </Text>
            <Text className="text-text-muted font-inter text-sm text-center mb-5">
              Tell us what you need and we'll match you with the perfect crew.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(client)/book")}
              className="bg-brand-500 rounded-2xl px-8 py-3.5"
              accessibilityLabel="Start booking"
              accessibilityRole="button"
            >
              <Text className="text-white font-inter-semibold text-base">
                Start Booking
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
