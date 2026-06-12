import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { creatorsApi } from "@/api/creators";
import { CreatorCardFull } from "@/components/creator/CreatorCard";
import { EmptyState, SkeletonCreatorCard } from "@/components/ui/EmptyState";
import { BOOKING_CREW_CATEGORIES, POPULAR_CITIES } from "@/lib/constants";
import type { Creator } from "@/api/creators";

const ROLES = BOOKING_CREW_CATEGORIES.flatMap((c) => c.options.map((o) => ({ id: o.id, label: o.label })));

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string; category?: string; verified?: string }>();

  const [search, setSearch] = useState(params.q ?? "");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(params.verified === "true");

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["creators", "explore", search, selectedCity, selectedRole, verifiedOnly],
    queryFn: () =>
      creatorsApi.list({
        city: selectedCity ?? undefined,
        role: selectedRole ?? undefined,
        verified: verifiedOnly || undefined,
        limit: 30,
      }),
  });

  const creators: Creator[] = data?.creators ?? [];

  const filtered = search
    ? creators.filter(
        (c) =>
          c.full_name?.toLowerCase().includes(search.toLowerCase()) ||
          c.role?.toLowerCase().includes(search.toLowerCase()) ||
          c.city?.toLowerCase().includes(search.toLowerCase()),
      )
    : creators;

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      {/* Search */}
      <View className="px-5 pt-4 pb-3 gap-3">
        <View className="flex-row items-center bg-surface-elevated border border-surface-border rounded-2xl px-4 h-12 gap-3">
          <Text className="text-lg">🔍</Text>
          <TextInput
            className="flex-1 text-text-primary font-inter text-base"
            placeholder="Search creators by name, role, city..."
            placeholderTextColor="rgba(255,255,255,0.30)"
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            selectionColor="#6C5CE7"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Text className="text-text-muted text-lg">✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          <TouchableOpacity
            onPress={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-3 py-1.5 rounded-full border flex-row items-center gap-1 ${
              verifiedOnly ? "bg-brand-500/20 border-brand-500" : "bg-surface-elevated border-surface-border"
            }`}
          >
            <Text className="text-sm">✅</Text>
            <Text className={`font-inter-medium text-xs ${verifiedOnly ? "text-brand-300" : "text-text-secondary"}`}>
              Verified
            </Text>
          </TouchableOpacity>

          {POPULAR_CITIES.slice(0, 6).map((city) => (
            <TouchableOpacity
              key={city}
              onPress={() => setSelectedCity(selectedCity === city ? null : city)}
              className={`px-3 py-1.5 rounded-full border ${
                selectedCity === city ? "bg-brand-500/20 border-brand-500" : "bg-surface-elevated border-surface-border"
              }`}
            >
              <Text className={`font-inter text-xs ${selectedCity === city ? "text-brand-300" : "text-text-secondary"}`}>
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Results header */}
      <View className="px-5 mb-2">
        <Text className="text-text-muted font-inter text-xs">
          {isLoading ? "Loading..." : `${filtered.length} creator${filtered.length !== 1 ? "s" : ""} found`}
        </Text>
      </View>

      {isLoading ? (
        <ScrollView className="px-5" contentContainerStyle={{ gap: 12 }}>
          {[...Array(5)].map((_, i) => (
            <View key={i} className="bg-surface-elevated rounded-3xl p-4 flex-row items-center gap-4">
              <View className="w-14 h-14 rounded-full bg-surface-overlay" />
              <View className="flex-1 gap-2">
                <View className="h-3 bg-surface-overlay rounded-lg w-1/2" />
                <View className="h-2.5 bg-surface-overlay rounded-lg w-3/4" />
              </View>
            </View>
          ))}
        </ScrollView>
      ) : filtered.length === 0 ? (
        <EmptyState
          emoji="🔍"
          title="No creators found"
          description="Try adjusting your filters or search for a different role."
          ctaLabel="Clear Filters"
          onCta={() => { setSearch(""); setSelectedCity(null); setSelectedRole(null); setVerifiedOnly(false); }}
        />
      ) : (
        <FlashList
          data={filtered}
          renderItem={({ item }) => (
            <View className="px-5">
              <CreatorCardFull creator={item} />
            </View>
          )}
          keyExtractor={(item) => item.id}
          estimatedItemSize={90}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6C5CE7" />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </SafeAreaView>
  );
}
