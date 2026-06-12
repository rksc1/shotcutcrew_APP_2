import React from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { projectsApi } from "@/api/projects";
import { EmptyState, SkeletonProjectCard } from "@/components/ui/EmptyState";
import { formatDate, formatCurrency } from "@/utils/format";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";

function StatusBadge({ status }: { status: string | null }) {
  const label = PROJECT_STATUS_LABELS[status ?? ""] ?? status ?? "Unknown";
  const colorMap: Record<string, string> = {
    pending_review: "bg-warning/20 text-warning",
    confirmed: "bg-info/20 text-info",
    in_progress: "bg-brand-500/20 text-brand-400",
    delivered: "bg-success/20 text-success",
    completed: "bg-success/20 text-success",
    cancelled: "bg-error/20 text-error",
    pending_payment: "bg-accent-500/20 text-accent-500",
  };
  const cls = colorMap[status ?? ""] ?? "bg-dark-500/50 text-text-muted";
  return (
    <View className={`px-2.5 py-1 rounded-full ${cls.split(" ")[0]}`}>
      <Text className={`text-xs font-inter-medium ${cls.split(" ")[1]}`}>{label}</Text>
    </View>
  );
}

export default function ClientProjectsScreen() {
  const router = useRouter();

  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["client-projects"],
    queryFn: () => projectsApi.list(),
  });

  const projects = data?.projects ?? [];

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <View className="px-5 pt-4 pb-3 flex-row items-center justify-between">
        <Text className="text-text-primary font-inter-bold text-2xl">My Projects</Text>
        <TouchableOpacity
          onPress={() => router.push("/(client)/book")}
          className="bg-brand-500 rounded-2xl px-4 py-2"
          accessibilityLabel="Create new booking"
        >
          <Text className="text-white font-inter-semibold text-sm">+ New</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ScrollView className="px-5">
          {[...Array(4)].map((_, i) => <SkeletonProjectCard key={i} />)}
        </ScrollView>
      ) : projects.length === 0 ? (
        <EmptyState
          emoji="📋"
          title="No projects yet"
          description="Your bookings and projects will appear here once you create them."
          ctaLabel="Create Your First Booking"
          onCta={() => router.push("/(client)/book")}
        />
      ) : (
        <ScrollView
          className="px-5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#6C5CE7" />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {projects.map((project) => (
            <TouchableOpacity
              key={project.id}
              onPress={() => router.push(`/(client)/projects/${project.id}`)}
              className="bg-surface-elevated rounded-3xl p-4 mb-3 gap-2"
              accessibilityLabel={`Open project ${project.title}`}
              accessibilityRole="button"
            >
              <View className="flex-row items-start justify-between gap-2">
                <Text
                  className="text-text-primary font-inter-semibold text-base flex-1"
                  numberOfLines={1}
                >
                  {project.title}
                </Text>
                <StatusBadge status={project.status} />
              </View>

              <View className="flex-row items-center gap-4">
                {project.event_date && (
                  <Text className="text-text-muted font-inter text-sm">
                    📅 {formatDate(project.event_date)}
                  </Text>
                )}
                {project.booking_location && (
                  <Text className="text-text-muted font-inter text-sm" numberOfLines={1}>
                    📍 {project.booking_location}
                  </Text>
                )}
              </View>

              <View className="flex-row items-center justify-between">
                {project.budget ? (
                  <Text className="text-brand-400 font-inter-medium text-sm">
                    {formatCurrency(project.budget)}
                  </Text>
                ) : (
                  <Text className="text-text-muted font-inter text-sm">Budget TBD</Text>
                )}
                {project.booking_type && (
                  <Text className="text-text-muted font-inter text-xs capitalize">
                    {project.booking_type.replace(/_/g, " ")}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
