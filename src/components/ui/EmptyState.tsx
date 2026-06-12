import React from "react";
import { View, Text } from "react-native";
import { Button } from "./Button";

interface EmptyStateProps {
  emoji?: string;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
  compact?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  emoji = "📭",
  title,
  description,
  ctaLabel,
  onCta,
  compact = false,
}) => {
  return (
    <View
      className={[
        "items-center justify-center",
        compact ? "py-8 px-6" : "py-16 px-8",
      ].join(" ")}
    >
      {!compact && (
        <Text className="text-5xl mb-4">{emoji}</Text>
      )}
      <Text
        className={[
          "text-text-primary font-inter-semibold text-center",
          compact ? "text-base" : "text-xl",
        ].join(" ")}
      >
        {title}
      </Text>
      {description && (
        <Text
          className={[
            "text-text-muted font-inter text-center mt-2",
            compact ? "text-sm" : "text-base",
          ].join(" ")}
        >
          {description}
        </Text>
      )}
      {ctaLabel && onCta && (
        <View className="mt-6">
          <Button variant="primary" size="md" onPress={onCta}>
            {ctaLabel}
          </Button>
        </View>
      )}
    </View>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated";
import { useEffect } from "react";

export const SkeletonBox: React.FC<{
  width?: number | string;
  height?: number;
  rounded?: string;
  className?: string;
}> = ({ width = "100%", height = 16, rounded = "rounded-xl", className }) => {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      true,
    );
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[animStyle, { width: width as number, height }]}
      className={`bg-surface-overlay ${rounded} ${className ?? ""}`}
    />
  );
};

export const SkeletonCreatorCard: React.FC = () => (
  <View className="bg-surface-elevated rounded-3xl p-4 mr-3 w-44 gap-3">
    <SkeletonBox height={80} rounded="rounded-2xl" />
    <SkeletonBox height={12} width="70%" />
    <SkeletonBox height={10} width="50%" />
    <SkeletonBox height={10} width="60%" />
  </View>
);

export const SkeletonProjectCard: React.FC = () => (
  <View className="bg-surface-elevated rounded-3xl p-4 mb-3 gap-3">
    <View className="flex-row justify-between items-start">
      <SkeletonBox height={14} width="60%" />
      <SkeletonBox height={24} width={80} rounded="rounded-full" />
    </View>
    <SkeletonBox height={12} width="40%" />
    <SkeletonBox height={10} width="80%" />
  </View>
);
