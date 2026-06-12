import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useBookingStore } from "@/store/bookingStore";
import { BookingStepHeader, StickyCta } from "@/components/booking/BookingStepHeader";

const SETUP_OPTIONS = [
  {
    id: "on_location" as const,
    label: "On Location",
    emoji: "📍",
    desc: "Client's venue, office, or event space",
  },
  {
    id: "outdoor" as const,
    label: "Outdoor / Open Air",
    emoji: "🌅",
    desc: "Parks, streets, open spaces",
  },
  {
    id: "studio" as const,
    label: "Studio Setup",
    emoji: "🏠",
    desc: "Professional studio or controlled environment",
  },
];

export default function BookStep2() {
  const router = useRouter();
  const { setupType, setSetupType, nextStep, currentStep, totalSteps } = useBookingStore();

  const handleContinue = () => {
    nextStep();
    router.push("/(client)/book/step3");
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <BookingStepHeader
        step={currentStep}
        totalSteps={totalSteps}
        title="Setup type?"
        subtitle="Where will the shoot take place?"
      />

      <View className="flex-1 px-5 gap-4 pt-2">
        {SETUP_OPTIONS.map((option, idx) => {
          const selected = setupType === option.id;
          return (
            <Animated.View
              key={option.id}
              entering={FadeInDown.delay(idx * 80).duration(350)}
            >
              <TouchableOpacity
                onPress={() => setSetupType(option.id)}
                className={[
                  "rounded-3xl p-5 border flex-row items-center gap-4",
                  selected
                    ? "bg-brand-500/15 border-brand-500"
                    : "bg-surface-elevated border-surface-border",
                ].join(" ")}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                accessibilityLabel={option.label}
              >
                <View
                  className={[
                    "w-14 h-14 rounded-2xl items-center justify-center",
                    selected ? "bg-brand-500/30" : "bg-surface-overlay",
                  ].join(" ")}
                >
                  <Text className="text-3xl">{option.emoji}</Text>
                </View>
                <View className="flex-1">
                  <Text
                    className={[
                      "font-inter-semibold text-lg",
                      selected ? "text-brand-300" : "text-text-primary",
                    ].join(" ")}
                  >
                    {option.label}
                  </Text>
                  <Text className="text-text-muted font-inter text-sm mt-0.5">
                    {option.desc}
                  </Text>
                </View>
                <View
                  className={[
                    "w-6 h-6 rounded-full border-2 items-center justify-center",
                    selected ? "border-brand-500 bg-brand-500" : "border-surface-overlay",
                  ].join(" ")}
                >
                  {selected && <Text className="text-white text-xs">✓</Text>}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      <StickyCta
        onNext={handleContinue}
        disabled={!setupType}
      />
    </SafeAreaView>
  );
}
