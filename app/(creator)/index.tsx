import React from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { opportunitiesApi } from "@/api/notifications";
import { projectsApi } from "@/api/projects";
import { EmptyState, SkeletonProjectCard } from "@/components/ui/EmptyState";
import { useAuthStore } from "@/store/authStore";
import { formatCurrency, formatDate, formatRelative } from "@/utils/format";
import { VerifiedBadge, getVerifyLevel } from "@/components/ui/VerifiedBadge";
import { NotificationBell } from "@/components/shared/NotificationBell";

export default function CreatorDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const level = getVerifyLevel(user?.parichay_verified, user?.verified);

  const { data: oppData, isLoading: loadingOpp, refetch } = useQuery({
    queryKey: ["creator-opportunities"],
    queryFn: () => opportunitiesApi.list(),
  });

  const { data: projectData, isLoading: loadingProjects } = useQuery({
    queryKey: ["creator-projects"],
    queryFn: () => projectsApi.list(),
  });

  const pendingOpportunities = (oppData?.opportunities ?? []).filter(
    (o) => o.invite_status === "sent" || o.invite_status === "pending"
  );
  const activeProjects = (projectData?.projects ?? []).filter(
    (p) => ["confirmed", "in_progress", "delivered"].includes(p.status ?? "")
  );

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loadingOpp} onRefresh={refetch} tintColor="#00B894" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0)} className="px-5 pt-4 pb-4">
          <View className="flex-row items-center justify-between mb-3">
            <View>
              <Text className="text-text-muted font-inter text-sm">Creator Dashboard</Text>
              <Text className="text-text-primary font-inter-bold text-2xl mt-0.5">
                {user?.full_name?.split(" ")[0] || "Creator"}
              </Text>
            </View>
            <View className="flex-row items-center gap-3">
              <NotificationBell />
              <TouchableOpacity
                onPress={() => router.push("/(creator)/profile")}
                className="w-11 h-11 rounded-full bg-success/20 border border-success/30 items-center justify-center"
              >
                <Text className="text-success font-inter-semibold">
                  {user?.full_name?.[0] || "C"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {level !== "none" && <VerifiedBadge level={level} size="md" />}
        </Animated.View>

        {/* Stat Cards */}
        <Animated.View entering={FadeInDown.delay(60)} className="px-5 mb-6">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/(creator)/opportunities")}
              className="flex-1 bg-surface-elevated rounded-3xl p-4 border border-surface-border"
              accessibilityLabel={`${pendingOpportunities.length} pending opportunities`}
            >
              <Text className="text-2xl mb-2">🔔</Text>
              <Text className="text-text-primary font-inter-bold text-2xl">
                {pendingOpportunities.length}
              </Text>
              <Text className="text-text-muted font-inter text-xs mt-0.5">New Invites</Text>
              {pendingOpportunities.length > 0 && (
                <View className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent-500" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(creator)/projects")}
              className="flex-1 bg-surface-elevated rounded-3xl p-4 border border-surface-border"
              accessibilityLabel={`${activeProjects.length} active projects`}
            >
              <Text className="text-2xl mb-2">📋</Text>
              <Text className="text-text-primary font-inter-bold text-2xl">
                {activeProjects.length}
              </Text>
              <Text className="text-text-muted font-inter text-xs mt-0.5">Active Projects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(creator)/wallet")}
              className="flex-1 bg-surface-elevated rounded-3xl p-4 border border-surface-border"
              accessibilityLabel="View wallet balance"
            >
              <Text className="text-2xl mb-2">💰</Text>
              <Text className="text-text-primary font-inter-bold text-xl">₹—</Text>
              <Text className="text-text-muted font-inter text-xs mt-0.5">Wallet</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Pending Opportunities */}
        {pendingOpportunities.length > 0 && (
          <Animated.View entering={FadeInDown.delay(120)} className="px-5 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-text-primary font-inter-semibold text-lg">New Invites</Text>
              <TouchableOpacity onPress={() => router.push("/(creator)/opportunities")}>
                <Text className="text-success font-inter-medium text-sm">See all</Text>
              </TouchableOpacity>
            </View>
            <View className="gap-3">
              {pendingOpportunities.slice(0, 3).map((opp) => (
                <TouchableOpacity
                  key={opp.id}
                  onPress={() => router.push(`/(creator)/opportunities/${opp.project_id}`)}
                  className="bg-surface-elevated rounded-3xl p-4 border border-success/20 gap-2"
                  accessibilityLabel={`View opportunity for ${opp.title}`}
                  accessibilityRole="button"
                >
                  <View className="flex-row items-start justify-between">
                    <Text className="text-text-primary font-inter-semibold text-base flex-1" numberOfLines={1}>
                      {opp.title}
                    </Text>
                    <View className="bg-success/20 px-2 py-0.5 rounded-full">
                      <Text className="text-success text-xs font-inter-medium">New</Text>
                    </View>
                  </View>
                  <Text className="text-text-muted font-inter text-sm" numberOfLines={1}>
                    {opp.booking_type?.replace(/_/g, " ")}
                    {opp.booking_location ? ` • ${opp.booking_location}` : ""}
                  </Text>
                  {opp.budget && (
                    <Text className="text-success font-inter-medium text-sm">
                      Budget: {formatCurrency(opp.budget)}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}

        {/* Active Projects */}
        <Animated.View entering={FadeInDown.delay(180)} className="px-5 mb-6">
          <Text className="text-text-primary font-inter-semibold text-lg mb-3">
            Active Projects
          </Text>
          {loadingProjects ? (
            <View className="gap-3">{[...Array(2)].map((_, i) => <SkeletonProjectCard key={i} />)}</View>
          ) : activeProjects.length === 0 ? (
            <EmptyState
              emoji="📋"
              title="No active projects"
              description="Accept opportunities to get started"
              ctaLabel="Browse Opportunities"
              onCta={() => router.push("/(creator)/opportunities")}
              compact
            />
          ) : (
            <View className="gap-3">
              {activeProjects.slice(0, 3).map((project) => (
                <TouchableOpacity
                  key={project.id}
                  onPress={() => router.push(`/(creator)/projects/${project.id}`)}
                  className="bg-surface-elevated rounded-3xl p-4 gap-2"
                  accessibilityRole="button"
                >
                  <Text className="text-text-primary font-inter-semibold text-base" numberOfLines={1}>
                    {project.title}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className="text-text-muted font-inter text-sm capitalize">
                      {project.status?.replace(/_/g, " ")}
                    </Text>
                    {project.event_date && (
                      <Text className="text-text-muted font-inter text-xs">
                        {formatDate(project.event_date)}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </Animated.View>

        {/* Profile completion prompt */}
        {!user?.verified && (
          <Animated.View entering={FadeInDown.delay(240)} className="px-5">
            <TouchableOpacity
              onPress={() => router.push("/(creator)/profile")}
              className="bg-brand-500/10 border border-brand-500/30 rounded-3xl p-5 flex-row items-center gap-4"
              accessibilityLabel="Complete your profile"
            >
              <Text className="text-3xl">⭐</Text>
              <View className="flex-1">
                <Text className="text-brand-300 font-inter-semibold text-base">
                  Complete Your Profile
                </Text>
                <Text className="text-text-muted font-inter text-sm mt-0.5">
                  Get verified and appear in search results
                </Text>
              </View>
              <Text className="text-text-muted text-xl">›</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
