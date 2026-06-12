import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookingStore } from "@/store/bookingStore";
import { formatCurrency, formatDate } from "@/utils/format";
import { getEventTypeLabel } from "@/lib/constants";
import { BookingStepHeader, StickyCta } from "@/components/booking/BookingStepHeader";

interface ReviewRowProps {
  label: string;
  value: string;
  onEdit?: () => void;
}

const ReviewRow: React.FC<ReviewRowProps> = ({ label, value, onEdit }) => (
  <View className="flex-row items-start justify-between py-3 border-b border-surface-border">
    <View className="flex-1">
      <Text className="text-text-muted font-inter text-xs mb-0.5">{label}</Text>
      <Text className="text-text-primary font-inter-medium text-sm">{value}</Text>
    </View>
    {onEdit && (
      <TouchableOpacity onPress={onEdit} accessibilityLabel={`Edit ${label}`}>
        <Text className="text-brand-400 font-inter text-sm">Edit</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default function BookStep6() {
  const router = useRouter();
  const store = useBookingStore();

  const crewSummary = Object.entries(store.crewRequirements)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${v}× ${k.replace(/_/g, " ")}`)
    .join(", ") || "None selected";

  const equipmentSummary =
    Object.entries(store.equipmentRequirements)
      .filter(([, v]) => v)
      .map(([k]) => k.replace(/_/g, " "))
      .join(", ") || "None";

  const postSummary = store.postProductionServices.join(", ") || "None";

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <BookingStepHeader
        step={store.currentStep}
        totalSteps={store.totalSteps}
        title="Review your booking"
        subtitle="Confirm the details before submitting"
      />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="bg-surface-elevated rounded-3xl p-4 mb-4">
          <ReviewRow
            label="Event Type"
            value={getEventTypeLabel(store.eventType ?? "", store.customEventType)}
            onEdit={() => router.push("/(client)/book")}
          />
          <ReviewRow
            label="Setup Type"
            value={store.setupType?.replace(/_/g, " ") ?? "—"}
            onEdit={() => router.push("/(client)/book/step2")}
          />
          <ReviewRow
            label="Crew Required"
            value={crewSummary}
            onEdit={() => router.push("/(client)/book/step3")}
          />
          <ReviewRow
            label="Equipment"
            value={equipmentSummary}
            onEdit={() => router.push("/(client)/book/step4")}
          />
          <ReviewRow
            label="Post-Production"
            value={postSummary}
            onEdit={() => router.push("/(client)/book/step4")}
          />
          <ReviewRow
            label="Location"
            value={store.bookingLocation ?? "—"}
            onEdit={() => router.push("/(client)/book/step5")}
          />
          {store.eventDate && (
            <ReviewRow
              label="Event Date"
              value={formatDate(store.eventDate)}
              onEdit={() => router.push("/(client)/book/step5")}
            />
          )}
          <ReviewRow
            label="Duration"
            value={`${store.estimatedDays} day${store.estimatedDays !== 1 ? "s" : ""}`}
            onEdit={() => router.push("/(client)/book/step5")}
          />
          <View className="flex-row items-start justify-between py-3">
            <View className="flex-1">
              <Text className="text-text-muted font-inter text-xs mb-0.5">Budget (Estimated)</Text>
              <Text className="text-brand-400 font-inter-bold text-xl">
                {formatCurrency(store.getBudget())}
              </Text>
              <Text className="text-text-muted font-inter text-xs mt-0.5">
                Final price set by ShotcutCrew team
              </Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(client)/book/step5")}>
              <Text className="text-brand-400 font-inter text-sm">Edit</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* What happens next */}
        <View className="bg-brand-500/10 border border-brand-500/20 rounded-3xl p-4 gap-3">
          <Text className="text-brand-300 font-inter-semibold text-sm">What happens next?</Text>
          {[
            { num: "1", text: "We match you with verified creators in your city" },
            { num: "2", text: "Creators submit quotes for your review" },
            { num: "3", text: "Our team finalizes the price with you" },
            { num: "4", text: "Work begins after payment is confirmed" },
          ].map((step) => (
            <View key={step.num} className="flex-row items-start gap-3">
              <View className="w-6 h-6 rounded-full bg-brand-500/30 items-center justify-center">
                <Text className="text-brand-300 font-inter-bold text-xs">{step.num}</Text>
              </View>
              <Text className="text-text-muted font-inter text-sm flex-1">{step.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <StickyCta
        onNext={() => { store.nextStep(); router.push("/(client)/book/step7"); }}
        label="Submit Booking →"
      />
    </SafeAreaView>
  );
}
