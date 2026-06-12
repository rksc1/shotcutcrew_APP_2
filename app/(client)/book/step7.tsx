import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeIn, FadeInDown, ZoomIn } from "react-native-reanimated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/api/bookings";
import { useBookingStore } from "@/store/bookingStore";
import { Button } from "@/components/ui/Button";
import { ApiError } from "@/api/client";

export default function BookStep7() {
  const router = useRouter();
  const store = useBookingStore();
  const queryClient = useQueryClient();
  const [projectId, setProjectId] = useState<string | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      bookingsApi.create({
        title: store.getTitle(),
        description: store.getDescription(),
        bookingType: store.eventType ?? "custom_requirement",
        bookingLocation: store.bookingLocation,
        eventDate: store.eventDate,
        estimatedDays: store.estimatedDays,
        budget: store.getBudget(),
        requirementSummary: store.getRequirementSummary(),
        crewRequirements: store.crewRequirements,
        equipmentRequirements: store.equipmentRequirements,
        postProductionServices: store.postProductionServices,
        setupType: store.setupType ?? undefined,
        budgetTier: store.budgetTier ?? undefined,
        customEventType: store.customEventType ?? undefined,
      }),
    onSuccess: (data) => {
      setProjectId(data.project_id);
      queryClient.invalidateQueries({ queryKey: ["client-projects"] });
      store.reset();
    },
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : "Booking failed. Please try again.";
      Alert.alert("Booking Failed", msg, [
        { text: "Try Again", onPress: () => mutate() },
        { text: "Cancel", style: "cancel" },
      ]);
    },
  });

  useEffect(() => {
    // Auto-submit on mount
    mutate();
  }, [mutate]);

  if (isPending) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center px-8">
        <ActivityIndicator size="large" color="#6C5CE7" />
        <Text className="text-text-primary font-inter-semibold text-lg mt-6 text-center">
          Creating your booking...
        </Text>
        <Text className="text-text-muted font-inter text-sm mt-2 text-center">
          Matching with verified creators in your area
        </Text>
      </SafeAreaView>
    );
  }

  if (projectId) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center px-8">
        <Animated.View entering={ZoomIn.delay(100)} className="mb-6">
          <View className="w-24 h-24 rounded-full bg-success/20 border-2 border-success items-center justify-center">
            <Text className="text-5xl">✅</Text>
          </View>
        </Animated.View>
        <Animated.Text
          entering={FadeInDown.delay(200)}
          className="text-text-primary font-inter-bold text-2xl text-center mb-3"
        >
          Booking Submitted!
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(280)}
          className="text-text-muted font-inter text-base text-center mb-8"
        >
          We're notifying verified creators in your area. You'll receive updates as they respond.
        </Animated.Text>

        <Animated.View entering={FadeInDown.delay(360)} className="gap-3 w-full">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.replace(`/(client)/projects/${projectId}`)}
          >
            View Project
          </Button>
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onPress={() => router.replace("/(client)/")}
          >
            Back to Home
          </Button>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return null;
}
