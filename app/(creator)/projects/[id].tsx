import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { projectsApi } from "@/api/projects";
import { formatCurrency, formatDate } from "@/utils/format";
import { PROJECT_STATUS_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

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
    <View className={`px-3 py-1.5 rounded-full ${cls.split(" ")[0]}`}>
      <Text className={`text-sm font-inter-semibold ${cls.split(" ")[1]}`}>{label}</Text>
    </View>
  );
}

export default function CreatorProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["creator-projects", id],
    queryFn: () => projectsApi.get(id),
    enabled: !!id,
  });

  const project = data?.project;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center">
        <ActivityIndicator size="large" color="#00B894" />
      </SafeAreaView>
    );
  }

  if (!project) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center px-8">
        <Text className="text-4xl mb-4">😕</Text>
        <Text className="text-text-primary font-inter-bold text-xl text-center mb-6">
          Project not found
        </Text>
        <Button variant="secondary" size="lg" onPress={() => router.back()}>
          Go Back
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between border-b border-surface-border">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-2xl bg-surface-elevated items-center justify-center"
        >
          <Text className="text-text-primary text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-text-primary font-inter-semibold text-lg">Project Details</Text>
        <View className="w-11" />
      </View>

      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100, gap: 20 }}>
        {/* Header */}
        <View className="gap-2">
          <View className="flex-row items-start justify-between gap-4">
            <Text className="text-text-primary font-inter-bold text-2xl flex-1">
              {project.title}
            </Text>
            <StatusBadge status={project.status} />
          </View>
          <Text className="text-text-muted font-inter text-sm capitalize">
            {project.booking_type?.replace(/_/g, " ")}
          </Text>
        </View>

        {/* Client details (simplified for MVP) */}
        <View className="bg-surface-elevated border border-surface-border rounded-3xl p-4 flex-row items-center gap-4">
          <View className="w-12 h-12 rounded-full bg-brand-500/20 items-center justify-center">
            <Text className="text-brand-300 font-inter-semibold text-lg">C</Text>
          </View>
          <View className="flex-1">
            <Text className="text-text-primary font-inter-semibold text-base">Client</Text>
            <Text className="text-text-muted font-inter text-sm">ShotcutCrew Assured</Text>
          </View>
          <TouchableOpacity 
            className="w-10 h-10 rounded-full bg-dark-700 items-center justify-center border border-surface-border"
            onPress={() => router.push(`/(creator)/projects/${id}/chat`)}
          >
            <Text className="text-text-muted text-lg">💬</Text>
          </TouchableOpacity>
        </View>

        {/* Logistics */}
        <View className="bg-surface-elevated rounded-3xl p-5 border border-surface-border gap-4">
          <Text className="text-text-secondary font-inter-semibold text-sm">Logistics</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-text-muted font-inter text-sm">Location</Text>
            <Text className="text-text-primary font-inter-medium text-sm text-right flex-1 ml-4" numberOfLines={2}>
              {project.booking_location || "TBD"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-text-muted font-inter text-sm">Date</Text>
            <Text className="text-text-primary font-inter-medium text-sm">
              {project.event_date ? formatDate(project.event_date) : "TBD"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-text-muted font-inter text-sm">Duration</Text>
            <Text className="text-text-primary font-inter-medium text-sm">
              {project.estimated_days ? `${project.estimated_days} Days` : "TBD"}
            </Text>
          </View>
          <View className="flex-row items-center justify-between pt-4 border-t border-surface-border">
            <Text className="text-text-muted font-inter text-sm">Your Payout</Text>
            <Text className="text-success font-inter-bold text-lg">
              {formatCurrency(project.budget)}
            </Text>
          </View>
        </View>

        {/* Actions based on status */}
        {project.status === "in_progress" && (
          <View className="bg-brand-500/10 border border-brand-500/30 rounded-3xl p-5 items-center gap-3">
            <Text className="text-brand-300 font-inter-bold text-lg">Work in Progress</Text>
            <Text className="text-text-muted font-inter text-sm text-center">
              Submit your work proofs (watermarked) when ready for client review.
            </Text>
            <Button variant="primary" size="lg" fullWidth onPress={() => router.push(`/(creator)/projects/${id}/work-proof`)}>
              Upload Work Proof
            </Button>
          </View>
        )}

        {project.status === "delivered" && (
          <View className="bg-success/10 border border-success/30 rounded-3xl p-5 items-center gap-3">
            <Text className="text-success font-inter-bold text-lg">Awaiting Client Approval</Text>
            <Text className="text-text-muted font-inter text-sm text-center">
              You've submitted the work. Once the client approves, the final payment will be released to your wallet.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
