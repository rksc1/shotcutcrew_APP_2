import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookingStore } from "@/store/bookingStore";
import { BUDGET_TIER_OPTIONS, POPULAR_CITIES } from "@/lib/constants";
import { Input, TextArea } from "@/components/ui/Input";
import { BookingStepHeader, StickyCta } from "@/components/booking/BookingStepHeader";

export default function BookStep5() {
  const router = useRouter();
  const {
    bookingLocation,
    eventDate,
    estimatedDays,
    budgetTier,
    additionalNotes,
    setLogistics,
    nextStep,
    isStepValid,
    currentStep,
    totalSteps,
  } = useBookingStore();

  const [showCities, setShowCities] = useState(false);

  const handleContinue = () => {
    nextStep();
    router.push("/(client)/book/step6");
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <BookingStepHeader
          step={currentStep}
          totalSteps={totalSteps}
          title="Logistics"
          subtitle="When, where, and what budget?"
        />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 140, gap: 20 }}
        >
          {/* Location */}
          <View className="gap-2">
            <Input
              label="Location / City"
              placeholder="e.g. Mumbai, Delhi..."
              value={bookingLocation ?? ""}
              onChangeText={(v) => setLogistics({ bookingLocation: v })}
              onFocus={() => setShowCities(true)}
              onBlur={() => setTimeout(() => setShowCities(false), 200)}
              required
            />
            {showCities && (
              <View className="bg-surface-elevated rounded-2xl border border-surface-border overflow-hidden">
                {POPULAR_CITIES.filter((c) =>
                  c.toLowerCase().startsWith((bookingLocation ?? "").toLowerCase())
                )
                  .slice(0, 6)
                  .map((city) => (
                    <TouchableOpacity
                      key={city}
                      onPress={() => {
                        setLogistics({ bookingLocation: city });
                        setShowCities(false);
                      }}
                      className="px-4 py-3 border-b border-surface-border"
                    >
                      <Text className="text-text-primary font-inter text-sm">📍 {city}</Text>
                    </TouchableOpacity>
                  ))}
              </View>
            )}
          </View>

          {/* Event Date */}
          <Input
            label="Event Date (Optional)"
            placeholder="YYYY-MM-DD"
            value={eventDate ?? ""}
            onChangeText={(v) => setLogistics({ eventDate: v || null })}
            keyboardType="numeric"
          />

          {/* Duration */}
          <View>
            <Text className="text-text-secondary font-inter-medium text-sm mb-3">
              Duration <Text className="text-error">*</Text>
            </Text>
            <View className="flex-row gap-2">
              {[1, 2, 3, 5, 7].map((days) => (
                <TouchableOpacity
                  key={days}
                  onPress={() => setLogistics({ estimatedDays: days })}
                  className={`flex-1 py-3 rounded-2xl border items-center ${
                    estimatedDays === days
                      ? "bg-brand-500/20 border-brand-500"
                      : "bg-surface-elevated border-surface-border"
                  }`}
                  accessibilityLabel={`${days} day${days !== 1 ? "s" : ""}`}
                >
                  <Text
                    className={`font-inter-semibold text-sm ${
                      estimatedDays === days ? "text-brand-300" : "text-text-secondary"
                    }`}
                  >
                    {days}d
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Budget Tier */}
          <View>
            <Text className="text-text-secondary font-inter-medium text-sm mb-3">
              Budget Range
            </Text>
            <View className="gap-3">
              {BUDGET_TIER_OPTIONS.map((tier) => {
                const selected = budgetTier === tier.id;
                return (
                  <TouchableOpacity
                    key={tier.id}
                    onPress={() => setLogistics({ budgetTier: tier.id })}
                    className={`rounded-3xl p-4 border flex-row items-center justify-between ${
                      selected ? "bg-brand-500/15 border-brand-500" : "bg-surface-elevated border-surface-border"
                    }`}
                    accessibilityRole="radio"
                    accessibilityState={{ selected }}
                    accessibilityLabel={`${tier.label} budget: ${tier.range}`}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-2xl">{tier.emoji}</Text>
                      <View>
                        <View className="flex-row items-center gap-2">
                          <Text className={`font-inter-semibold text-base ${selected ? "text-brand-300" : "text-text-primary"}`}>
                            {tier.label}
                          </Text>
                          {"badge" in tier && (
                            <View className="bg-accent-500/20 px-2 py-0.5 rounded-full">
                              <Text className="text-accent-400 font-inter-medium text-xs">
                                {(tier as { badge: string }).badge}
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-text-muted font-inter text-xs">{tier.description}</Text>
                      </View>
                    </View>
                    <Text className={`font-inter-semibold text-sm ${selected ? "text-brand-400" : "text-text-muted"}`}>
                      {tier.range}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Additional Notes */}
          <TextArea
            label="Additional Notes (Optional)"
            placeholder="Any specific requirements, special instructions, or details..."
            value={additionalNotes}
            onChangeText={(v) => setLogistics({ additionalNotes: v })}
            rows={4}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <StickyCta onNext={handleContinue} disabled={!isStepValid()} />
    </SafeAreaView>
  );
}
