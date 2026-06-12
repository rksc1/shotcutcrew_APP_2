import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, TextInput } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { opportunitiesApi } from "@/api/notifications";
import { formatCurrency, formatDate, formatRelative } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/api/client";

export default function CreatorOpportunityDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [quoteAmount, setQuoteAmount] = useState("");
  const [quoteNote, setQuoteNote] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["creator-opportunity", id],
    queryFn: () => opportunitiesApi.get(id),
    enabled: !!id,
  });

  const acceptMutation = useMutation({
    mutationFn: () => opportunitiesApi.accept(id, opp!.invite_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-opportunities"] });
      Alert.alert("Success", "You have accepted this opportunity.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    },
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : "Failed to accept.";
      Alert.alert("Error", msg);
    }
  });

  const rejectMutation = useMutation({
    mutationFn: () => opportunitiesApi.reject(id, opp!.invite_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-opportunities"] });
      Alert.alert("Declined", "You have declined this opportunity.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    },
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : "Failed to decline.";
      Alert.alert("Error", msg);
    }
  });

  const quoteMutation = useMutation({
    mutationFn: () => opportunitiesApi.submitQuote(id, { amount: parseInt(quoteAmount, 10), note: quoteNote }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-opportunities"] });
      Alert.alert("Success", "Quote submitted.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    },
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : "Failed to submit quote.";
      Alert.alert("Error", msg);
    }
  });

  const opp = data?.opportunity;

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center">
        <ActivityIndicator size="large" color="#00B894" />
      </SafeAreaView>
    );
  }

  if (!opp) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center px-8">
        <Text className="text-4xl mb-4">😕</Text>
        <Text className="text-text-primary font-inter-bold text-xl text-center mb-6">Opportunity not found</Text>
        <Button variant="secondary" size="lg" onPress={() => router.back()}>Go Back</Button>
      </SafeAreaView>
    );
  }

  const isPending = opp.invite_status === "sent" || opp.invite_status === "pending";
  const canQuote = opp.invite_status === "interested" && !opp.budget;

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <View className="px-5 pt-4 pb-2 flex-row items-center justify-between border-b border-surface-border">
        <TouchableOpacity onPress={() => router.back()} className="w-11 h-11 rounded-2xl bg-surface-elevated items-center justify-center">
          <Text className="text-text-primary text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-text-primary font-inter-semibold text-lg">Opportunity Details</Text>
        <View className="w-11" />
      </View>

      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 120, gap: 20 }}>
        {opp.match_reason && (
          <View className="bg-brand-500/10 border border-brand-500/30 rounded-2xl p-4 flex-row items-start gap-3">
            <Text className="text-2xl">🎯</Text>
            <View className="flex-1">
              <Text className="text-brand-300 font-inter-semibold text-sm">Why you were matched</Text>
              <Text className="text-text-primary font-inter text-sm mt-1 leading-relaxed">{opp.match_reason}</Text>
            </View>
          </View>
        )}

        <View className="gap-2">
          <Text className="text-text-primary font-inter-bold text-2xl">{opp.title}</Text>
          <Text className="text-text-muted font-inter text-sm capitalize">{opp.booking_type?.replace(/_/g, " ")}</Text>
        </View>

        <View className="bg-surface-elevated rounded-3xl p-5 border border-surface-border gap-4">
          <Text className="text-text-secondary font-inter-semibold text-sm">Logistics</Text>
          <View className="flex-row items-center justify-between">
            <Text className="text-text-muted font-inter text-sm">Location</Text>
            <Text className="text-text-primary font-inter-medium text-sm text-right flex-1 ml-4" numberOfLines={2}>{opp.booking_location || "TBD"}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-text-muted font-inter text-sm">Date</Text>
            <Text className="text-text-primary font-inter-medium text-sm">{opp.event_date ? formatDate(opp.event_date) : "TBD"}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-text-muted font-inter text-sm">Duration</Text>
            <Text className="text-text-primary font-inter-medium text-sm">{opp.estimated_days ? `${opp.estimated_days} Days` : "TBD"}</Text>
          </View>
          <View className="flex-row items-center justify-between pt-4 border-t border-surface-border">
            <Text className="text-text-muted font-inter text-sm">Budget</Text>
            <Text className="text-success font-inter-bold text-lg">{opp.budget ? formatCurrency(opp.budget) : "To Be Quoted"}</Text>
          </View>
        </View>

        <View className="bg-surface-elevated rounded-3xl p-5 border border-surface-border gap-2">
          <Text className="text-text-secondary font-inter-semibold text-sm mb-1">Requirements</Text>
          <Text className="text-text-primary font-inter text-sm leading-relaxed">{opp.requirement_summary || "No specific requirements provided."}</Text>
        </View>

        {!isPending && !canQuote && (
          <View className="items-center py-4">
            <Text className="text-text-muted font-inter text-sm text-center">
              You marked this as {opp.invite_status} {formatRelative(opp.responded_at)}.
            </Text>
          </View>
        )}

        {canQuote && (
          <View className="bg-surface-elevated rounded-3xl p-5 border border-surface-border gap-4">
            <Text className="text-text-secondary font-inter-semibold text-sm">Submit Quote</Text>
            <View className="flex-row items-center bg-dark-900 border border-surface-border rounded-2xl px-4 h-12">
              <Text className="text-text-muted font-inter-medium text-base mr-2">₹</Text>
              <TextInput
                className="flex-1 text-text-primary font-inter-semibold text-base"
                placeholder="Enter amount"
                placeholderTextColor="rgba(255,255,255,0.30)"
                keyboardType="numeric"
                value={quoteAmount}
                onChangeText={setQuoteAmount}
              />
            </View>
            <TextInput
              className="bg-dark-900 border border-surface-border rounded-2xl px-4 py-3 text-text-primary font-inter text-sm"
              placeholder="Any notes for the client? (Optional)"
              placeholderTextColor="rgba(255,255,255,0.30)"
              multiline
              numberOfLines={3}
              style={{ minHeight: 80 }}
              textAlignVertical="top"
              value={quoteNote}
              onChangeText={setQuoteNote}
            />
            <Button
              variant="primary"
              size="lg"
              fullWidth
              loading={quoteMutation.isPending}
              disabled={!quoteAmount.trim()}
              onPress={() => quoteMutation.mutate()}
            >
              Submit Quote
            </Button>
          </View>
        )}

      </ScrollView>

      {isPending && (
        <View className="absolute bottom-0 left-0 right-0 bg-dark-900/95 border-t border-surface-border px-5 pb-8 pt-4 flex-row gap-3">
          <View className="flex-1">
            <Button variant="danger" size="xl" fullWidth loading={rejectMutation.isPending} disabled={acceptMutation.isPending} onPress={() => rejectMutation.mutate()}>
              Decline
            </Button>
          </View>
          <View className="flex-1">
            <Button variant="primary" size="xl" fullWidth loading={acceptMutation.isPending} disabled={rejectMutation.isPending} onPress={() => acceptMutation.mutate()} className="!bg-success !border-success">
              Accept
            </Button>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
