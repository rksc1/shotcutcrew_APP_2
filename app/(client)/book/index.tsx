import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useBookingStore } from "@/store/bookingStore";
import { BOOKING_EVENT_CATEGORIES, CUSTOM_EVENT_TYPE_ID } from "@/lib/constants";
import { BookingStepHeader, StickyCta } from "@/components/booking/BookingStepHeader";

export default function BookStep1() {
  const router = useRouter();
  const { eventType, setEventType, isStepValid, currentStep, totalSteps } = useBookingStore();

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <BookingStepHeader
        step={currentStep}
        totalSteps={totalSteps}
        title="What are you shooting?"
        subtitle="Select the type of event or project"
        onBack={() => router.replace("/(client)")}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 16 }}
      >
        {BOOKING_EVENT_CATEGORIES.map((category, catIdx) => (
          <Animated.View
            key={category.id}
            entering={FadeInDown.delay(catIdx * 40).duration(300)}
          >
            {/* Category header */}
            <View className="flex-row items-center gap-2 mb-3">
              <Text className="text-xl">{category.emoji}</Text>
              <Text className="text-text-secondary font-inter-semibold text-sm">
                {category.label}
              </Text>
            </View>

            {/* Options grid */}
            <View className="flex-row flex-wrap gap-2">
              {category.options.map((option) => {
                const selected = eventType === option.id;
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => setEventType(option.id)}
                    className={[
                      "px-4 py-2.5 rounded-2xl border",
                      selected
                        ? "bg-brand-500 border-brand-400"
                        : "bg-surface-elevated border-surface-border",
                    ].join(" ")}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={option.label}
                  >
                    <Text
                      className={[
                        "font-inter-medium text-sm",
                        selected ? "text-white" : "text-text-secondary",
                      ].join(" ")}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </Animated.View>
        ))}
      </ScrollView>

      <StickyCta
        onNext={() => router.push("/(client)/book/step2")}
        disabled={!isStepValid()}
      />
    </SafeAreaView>
  );
}
