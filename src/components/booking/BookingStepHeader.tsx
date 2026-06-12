import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";

interface BookingStepHeaderProps {
  step: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
  onBack?: () => void;
}

export const BookingStepHeader: React.FC<BookingStepHeaderProps> = ({
  step,
  totalSteps,
  title,
  subtitle,
  onBack,
}) => {
  const router = useRouter();
  const progress = step / totalSteps;

  const progressStyle = useAnimatedStyle(() => ({
    width: `${withTiming(progress * 100, { duration: 300 })}%` as unknown as number,
  }));

  return (
    <View className="px-5 pt-4 pb-2">
      {/* Back + Step indicator */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={onBack ?? (() => router.back())}
          className="w-11 h-11 rounded-2xl bg-surface-elevated items-center justify-center"
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text className="text-text-primary text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-text-muted font-inter text-sm">
          Step {step} of {totalSteps}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/(client)")}
          className="w-11 h-11 rounded-2xl bg-surface-elevated items-center justify-center"
          accessibilityLabel="Cancel booking"
        >
          <Text className="text-text-muted text-lg">✕</Text>
        </TouchableOpacity>
      </View>

      {/* Progress bar */}
      <View className="h-1 bg-surface-overlay rounded-full mb-5 overflow-hidden">
        <Animated.View
          style={progressStyle}
          className="h-full bg-brand-500 rounded-full"
        />
      </View>

      {/* Title */}
      <Text className="text-text-primary font-inter-bold text-2xl mb-1">{title}</Text>
      {subtitle && (
        <Text className="text-text-muted font-inter text-sm">{subtitle}</Text>
      )}
    </View>
  );
};

interface StickyCtaProps {
  onNext: () => void;
  disabled?: boolean;
  label?: string;
  loading?: boolean;
}

export const StickyCta: React.FC<StickyCtaProps> = ({
  onNext,
  disabled,
  label = "Continue →",
  loading,
}) => (
  <View className="absolute bottom-0 left-0 right-0 bg-dark-900/95 border-t border-surface-border px-5 pb-8 pt-4">
    <TouchableOpacity
      onPress={onNext}
      disabled={disabled || loading}
      className={[
        "h-14 rounded-3xl items-center justify-center",
        disabled ? "bg-surface-overlay" : "bg-brand-500",
      ].join(" ")}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text
        className={[
          "font-inter-semibold text-base",
          disabled ? "text-text-muted" : "text-white",
        ].join(" ")}
      >
        {loading ? "Submitting..." : label}
      </Text>
    </TouchableOpacity>
  </View>
);
