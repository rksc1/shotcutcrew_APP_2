import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  type TouchableOpacityProps,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg" | "xl";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:   "bg-brand-500 border border-brand-400",
  secondary: "bg-surface-elevated border border-surface-border",
  ghost:     "bg-transparent border border-transparent",
  danger:    "bg-error border border-error",
  outline:   "bg-transparent border border-brand-500",
};

const VARIANT_TEXT: Record<Variant, string> = {
  primary:   "text-white font-inter-semibold",
  secondary: "text-text-primary font-inter-medium",
  ghost:     "text-text-secondary font-inter-medium",
  danger:    "text-white font-inter-semibold",
  outline:   "text-brand-400 font-inter-semibold",
};

const SIZE_STYLES: Record<Size, string> = {
  sm: "h-9 px-4 rounded-xl",
  md: "h-11 px-5 rounded-2xl",
  lg: "h-13 px-6 rounded-2xl",
  xl: "h-14 px-8 rounded-3xl",
};

const SIZE_TEXT: Record<Size, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-base",
  xl: "text-lg",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon,
  iconRight,
  fullWidth = false,
  disabled,
  onPress,
  children,
  ...props
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.96, { damping: 15, stiffness: 400 });
  };
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 400 });
  };

  const isDisabled = disabled || loading;

  return (
    <AnimatedTouchable
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      activeOpacity={0.9}
      className={[
        "flex-row items-center justify-center",
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        fullWidth ? "w-full" : "",
        isDisabled ? "opacity-50" : "",
      ].join(" ")}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "primary" || variant === "danger" ? "#FFFFFF" : "#6C5CE7"}
        />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={[VARIANT_TEXT[variant], SIZE_TEXT[size]].join(" ")}>
            {children}
          </Text>
          {iconRight && <View className="ml-2">{iconRight}</View>}
        </>
      )}
    </AnimatedTouchable>
  );
};
