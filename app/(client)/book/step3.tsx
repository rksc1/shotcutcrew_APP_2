import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookingStore } from "@/store/bookingStore";
import { BOOKING_CREW_CATEGORIES } from "@/lib/constants";
import { BookingStepHeader, StickyCta } from "@/components/booking/BookingStepHeader";

function Counter({
  value,
  onIncrement,
  onDecrement,
}: {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <TouchableOpacity
        onPress={onDecrement}
        disabled={value === 0}
        className={`w-9 h-9 rounded-full items-center justify-center border ${
          value === 0 ? "border-surface-border bg-surface-overlay" : "border-brand-500 bg-brand-500/20"
        }`}
        accessibilityLabel="Decrease count"
        accessibilityRole="button"
      >
        <Text className={`text-lg font-inter-semibold ${value === 0 ? "text-text-muted" : "text-brand-400"}`}>
          −
        </Text>
      </TouchableOpacity>
      <Text className="text-text-primary font-inter-bold text-lg w-5 text-center">{value}</Text>
      <TouchableOpacity
        onPress={onIncrement}
        className="w-9 h-9 rounded-full items-center justify-center border border-brand-500 bg-brand-500/20"
        accessibilityLabel="Increase count"
        accessibilityRole="button"
      >
        <Text className="text-brand-400 text-lg font-inter-semibold">+</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function BookStep3() {
  const router = useRouter();
  const { crewRequirements, setCrewCount, isStepValid, nextStep, currentStep, totalSteps } = useBookingStore();

  const totalCrew = Object.values(crewRequirements).reduce((a, b) => a + b, 0);

  const handleContinue = () => {
    nextStep();
    router.push("/(client)/book/step4");
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <BookingStepHeader
        step={currentStep}
        totalSteps={totalSteps}
        title="Who do you need?"
        subtitle={totalCrew > 0 ? `${totalCrew} crew member${totalCrew !== 1 ? "s" : ""} selected` : "Select crew roles and quantities"}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 8 }}
      >
        {BOOKING_CREW_CATEGORIES.map((category) => (
          <View key={category.id} className="mb-2">
            <View className="flex-row items-center gap-2 py-2">
              <Text className="text-lg">{category.emoji}</Text>
              <Text className="text-text-secondary font-inter-semibold text-sm">
                {category.label}
              </Text>
            </View>
            <View className="gap-2">
              {category.options.map((option) => {
                const count = crewRequirements[option.id] ?? 0;
                return (
                  <View
                    key={option.id}
                    className={`bg-surface-elevated rounded-2xl px-4 py-3 flex-row items-center justify-between border ${
                      count > 0 ? "border-brand-500/50" : "border-surface-border"
                    }`}
                  >
                    <View className="flex-1 mr-4">
                      <Text className="text-text-primary font-inter-medium text-sm">
                        {option.label}
                      </Text>
                      {option.description && (
                        <Text className="text-text-muted font-inter text-xs mt-0.5">
                          {option.description}
                        </Text>
                      )}
                    </View>
                    <Counter
                      value={count}
                      onIncrement={() => setCrewCount(option.id, count + 1)}
                      onDecrement={() => setCrewCount(option.id, Math.max(0, count - 1))}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <StickyCta
        onNext={handleContinue}
        disabled={!isStepValid()}
      />
    </SafeAreaView>
  );
}
