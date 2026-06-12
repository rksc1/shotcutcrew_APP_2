import React from "react";
import { View, Text, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { initials } from "@/utils/format";

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  style?: ViewStyle;
}

const GRADIENT_COLORS = [
  ["#6C5CE7", "#a38dff"],
  ["#FF7043", "#ffa76f"],
  ["#00B894", "#55EFC4"],
  ["#0984E3", "#74B9FF"],
  ["#E84393", "#fd79a8"],
];

function getGradientIndex(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % GRADIENT_COLORS.length;
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 44,
  style,
}) => {
  const text = initials(name);
  const colorIndex = getGradientIndex(name ?? "SC");
  const [bg] = GRADIENT_COLORS[colorIndex];

  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
        contentFit="cover"
        transition={200}
        placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Text
        style={{
          color: "#fff",
          fontWeight: "600",
          fontSize: size * 0.36,
        }}
      >
        {text}
      </Text>
    </View>
  );
};
