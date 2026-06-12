import React from "react";
import { View, Text } from "react-native";

type VerifyLevel = "parichay" | "verified" | "pending" | "none";

interface VerifiedBadgeProps {
  level: VerifyLevel;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const BADGE_CONFIG: Record<
  VerifyLevel,
  { label: string; emoji: string; bg: string; text: string; border: string } | null
> = {
  parichay: {
    label: "Parichay Verified",
    emoji: "🔵",
    bg: "bg-brand-500/20",
    text: "text-brand-300",
    border: "border-brand-500/50",
  },
  verified: {
    label: "Verified",
    emoji: "✅",
    bg: "bg-success/20",
    text: "text-success",
    border: "border-success/50",
  },
  pending: {
    label: "Pending",
    emoji: "🕐",
    bg: "bg-dark-500/50",
    text: "text-text-muted",
    border: "border-dark-400/50",
  },
  none: null,
};

const SIZE_STYLES = {
  sm: { container: "px-2 py-0.5 rounded-lg gap-0.5", text: "text-2xs", emoji: "text-xs" },
  md: { container: "px-2.5 py-1 rounded-xl gap-1", text: "text-xs", emoji: "text-sm" },
  lg: { container: "px-3 py-1.5 rounded-xl gap-1", text: "text-sm", emoji: "text-base" },
};

export function getVerifyLevel(
  parichayVerified: boolean | null | undefined,
  verified: boolean | null | undefined,
): VerifyLevel {
  if (parichayVerified) return "parichay";
  if (verified) return "verified";
  return "none";
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({
  level,
  size = "md",
  showLabel = true,
}) => {
  const config = BADGE_CONFIG[level];
  if (!config) return null;

  const s = SIZE_STYLES[size];

  return (
    <View
      className={`flex-row items-center border ${config.bg} ${config.border} ${s.container}`}
    >
      <Text className={s.emoji}>{config.emoji}</Text>
      {showLabel && (
        <Text className={`${config.text} font-inter-medium ${s.text}`}>
          {config.label}
        </Text>
      )}
    </View>
  );
};
