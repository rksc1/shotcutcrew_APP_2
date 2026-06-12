import React from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { opportunitiesApi } from "@/api/notifications";
import { EmptyState, SkeletonProjectCard } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate, formatRelative } from "@/utils/format";

function InviteBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; style: string }> = {
    sent:       { label: "New",      style: "bg-success/20 text-success" },
    pending:    { label: "Pending",  style: "bg-warning/20 text-warning" },
    interested: { label: "Applied",  style: "bg-brand-500/20 text-brand-400" },
    accepted:   { label: "Accepted", style: "bg-success/20 text-success" },
    rejected:   { label: "Declined", style: "bg-error/20 text-error" },
  };
  const c = config[status] ?? { label: status, style: "bg-dark-500 text-text-muted" };
  return (
    <View className={`px-2.5 py-1 rounded-full ${c.style.split(" ")[0]}`}>
      <Text className={`text-xs font-inter-medium ${c.style.split(" ")[1]}`}>{c.label}</Text>
    </View>
  );
}

export default function OpportunitiesScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["creator-opportunities"],
    queryFn: () => opportunitiesApi.list(),
  });

  const opportunities = data?.opportunities ?? [];
  const pending = opportunities.filter((o) => ["sent", "pending"].includes(o.invite_status));
  const others = opportunities.filter((o) => !["sent", "pending"].includes(o.invite_status));

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <View className="px-5 pt-4 pb-3">
        <Text className="text-text-primary font-inter-bold text-2xl">Opportunities</Text>
        {pending.length > 0 && (
          <Text className="text-text-muted font-inter text-sm mt-1">
            {pending.length} invite{pending.length !== 1 ? "s" : ""} awaiting your response
          </Text>
        )}
      </View>

      {isLoading ? (
        <ScrollView className="px-5">
          {[...Array(3)].map((_, i) => <SkeletonProjectCard key={i} />)}
        </ScrollView>
      ) : opportunities.length === 0 ? (
        <EmptyState
          emoji="🔔"
          title="No opportunities yet"
          description="When clients need a crew matching your skills, you'll be invited here."
        />
      ) : (
        <ScrollView
          className="px-5"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#00B894" />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Pending section */}
          {pending.length > 0 && (
            <View className="mb-4">
              <Text className="text-text-secondary font-inter-semibold text-sm mb-3">
                Awaiting Response
              </Text>
              {pending.map((opp) => (
                <TouchableOpacity
                  key={opp.id}
                  onPress={() => router.push(`/(creator)/opportunities/${opp.project_id}`)}
                  className="bg-surface-elevated rounded-3xl p-4 mb-3 border border-success/20 gap-2"
                  accessibilityLabel={`View opportunity: ${opp.title}`}
                  accessibilityRole="button"
                >
                  <View className="flex-row items-start justify-between gap-2">
                    <Text className="text-text-primary font-inter-semibold text-base flex-1" numberOfLines={1}>
                      {opp.title}
                    </Text>
                    <InviteBadge status={opp.invite_status} />
                  </View>
                  <Text className="text-text-muted font-inter text-sm" numberOfLines={1}>
                    {opp.booking_type?.replace(/_/g, " ")}
                    {opp.booking_location ? ` • ${opp.booking_location}` : ""}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    {opp.budget ? (
                      <Text className="text-success font-inter-medium text-sm">
                        Budget: {formatCurrency(opp.budget)}
                      </Text>
                    ) : <View />}
                    {opp.event_date && (
                      <Text className="text-text-muted font-inter text-xs">
                        📅 {formatDate(opp.event_date)}
                      </Text>
                    )}
                  </View>
                  {opp.match_reason && (
                    <Text className="text-brand-400 font-inter text-xs">
                      🎯 {opp.match_reason}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Past section */}
          {others.length > 0 && (
            <View>
              <Text className="text-text-secondary font-inter-semibold text-sm mb-3">
                Past Invites
              </Text>
              {others.map((opp) => (
                <TouchableOpacity
                  key={opp.id}
                  onPress={() => router.push(`/(creator)/opportunities/${opp.project_id}`)}
                  className="bg-surface-elevated rounded-3xl p-4 mb-3 opacity-70 gap-2"
                  accessibilityRole="button"
                >
                  <View className="flex-row items-start justify-between gap-2">
                    <Text className="text-text-primary font-inter-medium text-base flex-1" numberOfLines={1}>
                      {opp.title}
                    </Text>
                    <InviteBadge status={opp.invite_status} />
                  </View>
                  <Text className="text-text-muted font-inter text-sm">
                    {formatRelative(opp.responded_at ?? opp.created_at)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
