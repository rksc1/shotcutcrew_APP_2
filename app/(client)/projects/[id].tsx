import React from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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

export default function ClientProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["client-projects", id],
    queryFn: () => projectsApi.get(id),
    enabled: !!id,
  });

  const project = data?.project;

  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: () => projectsApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-projects", id] });
    },
  });

  const handleApprove = () => {
    import("react-native").then(({ Alert }) => {
      Alert.alert("Approve Work", "Are you sure you want to approve this work? The final payout will be released to the creator.", [
        { text: "Cancel", style: "cancel" },
        { text: "Approve", onPress: () => approveMutation.mutate() }
      ]);
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center">
        <ActivityIndicator size="large" color="#6C5CE7" />
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
        <TouchableOpacity 
          className="w-10 h-10 rounded-full bg-dark-700 items-center justify-center border border-surface-border"
          onPress={() => router.push(`/(client)/projects/${id}/chat`)}
        >
          <Text className="text-text-muted text-lg">💬</Text>
        </TouchableOpacity>
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
            <Text className="text-text-muted font-inter text-sm">Agreed Budget</Text>
            <Text className="text-brand-400 font-inter-bold text-lg">
              {formatCurrency(project.budget)}
            </Text>
          </View>
        </View>

        {/* Requirements */}
        <View className="bg-surface-elevated rounded-3xl p-5 border border-surface-border gap-2">
          <Text className="text-text-secondary font-inter-semibold text-sm mb-1">Requirements</Text>
          <Text className="text-text-primary font-inter text-sm leading-relaxed">
            {project.requirement_summary || "No specific requirements provided."}
          </Text>
        </View>

        {/* Actions based on status */}
        {project.status === "pending_payment" && (
          <View className="bg-accent-500/10 border border-accent-500/30 rounded-3xl p-5 items-center gap-3">
            <Text className="text-accent-500 font-inter-bold text-lg">Payment Required</Text>
            <Text className="text-text-muted font-inter text-sm text-center">
              Please complete your payment via QR to start this project.
            </Text>
            <Button variant="primary" size="lg" fullWidth onPress={() => router.push(`/(client)/projects/${id}/payment`)}>
              View Payment QR
            </Button>
          </View>
        )}

        {project.status === "delivered" && (
          <View className="bg-success/10 border border-success/30 rounded-3xl p-5 items-center gap-3">
            <Text className="text-success font-inter-bold text-lg">Work Delivered</Text>
            <Text className="text-text-muted font-inter text-sm text-center">
              The creator has submitted the final work proofs. Please review and approve.
            </Text>
            <Button 
              variant="primary" 
              size="lg" 
              fullWidth 
              loading={approveMutation.isPending}
              onPress={handleApprove}
            >
              Review & Approve Work
            </Button>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
