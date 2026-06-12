import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookingStore } from "@/store/bookingStore";
import { EQUIPMENT_REQUIREMENT_CATEGORIES, POST_PRODUCTION_OPTIONS } from "@/lib/constants";
import { BookingStepHeader, StickyCta } from "@/components/booking/BookingStepHeader";

export default function BookStep4() {
  const router = useRouter();
  const {
    equipmentRequirements,
    postProductionServices,
    toggleEquipment,
    togglePostProduction,
    nextStep,
    currentStep,
    totalSteps,
  } = useBookingStore();

  const equipmentCount = Object.values(equipmentRequirements).filter(Boolean).length;
  const postCount = postProductionServices.length;
  const totalSelected = equipmentCount + postCount;

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <BookingStepHeader
        step={currentStep}
        totalSteps={totalSteps}
        title="Equipment & Post-Production"
        subtitle={totalSelected > 0 ? `${totalSelected} item${totalSelected !== 1 ? "s" : ""} selected` : "Optional — skip if not needed"}
      />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 16 }}
      >
        {/* Equipment categories */}
        {EQUIPMENT_REQUIREMENT_CATEGORIES.map((category) => (
          <View key={category.id}>
            <View className="flex-row items-center gap-2 mb-3">
              <Text className="text-lg">{category.emoji}</Text>
              <Text className="text-text-secondary font-inter-semibold text-sm">
                {category.label}
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2">
              {category.options.map((option) => {
                const selected = equipmentRequirements[option.id] === true;
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => toggleEquipment(option.id)}
                    className={`px-4 py-2.5 rounded-2xl border ${
                      selected ? "bg-accent-500/20 border-accent-500" : "bg-surface-elevated border-surface-border"
                    }`}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={option.label}
                  >
                    <Text className={`font-inter-medium text-sm ${selected ? "text-accent-400" : "text-text-secondary"}`}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Post Production */}
        <View>
          <View className="flex-row items-center gap-2 mb-3">
            <Text className="text-lg">✂️</Text>
            <Text className="text-text-secondary font-inter-semibold text-sm">Post-Production</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {POST_PRODUCTION_OPTIONS.map((option) => {
              const selected = postProductionServices.includes(option.id);
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => togglePostProduction(option.id)}
                  className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-2xl border ${
                    selected ? "bg-success/15 border-success" : "bg-surface-elevated border-surface-border"
                  }`}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={option.label}
                >
                  <Text className="text-sm">{option.emoji}</Text>
                  <Text className={`font-inter-medium text-sm ${selected ? "text-success" : "text-text-secondary"}`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <StickyCta
        onNext={() => { nextStep(); router.push("/(client)/book/step5"); }}
        label={totalSelected === 0 ? "Skip →" : "Continue →"}
      />
    </SafeAreaView>
  );
}
