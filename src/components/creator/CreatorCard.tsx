import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { Avatar } from "@/components/ui/Avatar";
import { VerifiedBadge, getVerifyLevel } from "@/components/ui/VerifiedBadge";
import { formatCurrency } from "@/utils/format";
import type { Creator } from "@/api/creators";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface CreatorCardProps {
  creator: Creator;
  style?: "horizontal" | "vertical";
}

// Horizontal card — for homepage featured scroll
export const CreatorCardHorizontal: React.FC<{ creator: Creator }> = ({ creator }) => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const level = getVerifyLevel(creator.parichay_verified, creator.verified);

  return (
    <AnimatedTouchable
      style={animStyle}
      onPressIn={() => { scale.value = withSpring(0.96); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={() => router.push(`/creator/${creator.id}`)}
      activeOpacity={0.95}
      className="bg-surface-elevated rounded-3xl overflow-hidden w-44 mr-3"
      accessibilityLabel={`View ${creator.full_name || "creator"} profile`}
      accessibilityRole="button"
    >
      {/* Cover / image area */}
      <View className="h-32 bg-dark-700 relative">
        {creator.profile_image_url ? (
          <Image
            source={{ uri: creator.profile_image_url }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            transition={300}
            placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
          />
        ) : (
          <View className="w-full h-full items-center justify-center">
            <Text className="text-4xl">🎬</Text>
          </View>
        )}
        {/* Gradient overlay */}
        <View className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface-elevated" />
        {level !== "none" && (
          <View className="absolute top-2 right-2">
            <VerifiedBadge level={level} size="sm" showLabel={false} />
          </View>
        )}
      </View>

      {/* Info */}
      <View className="p-3 gap-1">
        <Text className="text-text-primary font-inter-semibold text-sm" numberOfLines={1}>
          {creator.full_name || "Creator"}
        </Text>
        <Text className="text-text-muted font-inter text-xs" numberOfLines={1}>
          {creator.role?.replace(/_/g, " ") || "Filmmaker"}
        </Text>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-text-secondary font-inter text-xs">
            📍 {creator.city || "Remote"}
          </Text>
          {creator.day_rate && (
            <Text className="text-brand-400 font-inter-semibold text-xs">
              {formatCurrency(creator.day_rate)}/day
            </Text>
          )}
        </View>
      </View>
    </AnimatedTouchable>
  );
};

// Full list card — for explore/search
export const CreatorCardFull: React.FC<{ creator: Creator }> = ({ creator }) => {
  const router = useRouter();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const level = getVerifyLevel(creator.parichay_verified, creator.verified);

  return (
    <AnimatedTouchable
      style={animStyle}
      onPressIn={() => { scale.value = withSpring(0.98); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      onPress={() => router.push(`/creator/${creator.id}`)}
      activeOpacity={0.95}
      className="bg-surface-elevated rounded-3xl p-4 mb-3 flex-row items-center gap-4"
      accessibilityLabel={`View ${creator.full_name || "creator"} profile`}
      accessibilityRole="button"
    >
      <Avatar uri={creator.profile_image_url} name={creator.full_name} size={60} />

      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-text-primary font-inter-semibold text-base flex-1" numberOfLines={1}>
            {creator.full_name || "Creator"}
          </Text>
          {level !== "none" && <VerifiedBadge level={level} size="sm" showLabel={level === "parichay"} />}
        </View>
        <Text className="text-text-muted font-inter text-sm" numberOfLines={1}>
          {creator.role?.replace(/_/g, " ")} • {creator.city || "Remote"}
        </Text>
        <View className="flex-row items-center gap-3 mt-1">
          {creator.day_rate && (
            <Text className="text-brand-400 font-inter-medium text-sm">
              {formatCurrency(creator.day_rate)}/day
            </Text>
          )}
          {creator.available_for_booking ? (
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-success" />
              <Text className="text-success text-xs font-inter">Available</Text>
            </View>
          ) : (
            <View className="flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 rounded-full bg-text-muted" />
              <Text className="text-text-muted text-xs font-inter">Busy</Text>
            </View>
          )}
        </View>
      </View>

      <Text className="text-text-muted text-lg">›</Text>
    </AnimatedTouchable>
  );
};
