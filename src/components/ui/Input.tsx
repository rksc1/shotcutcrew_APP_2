import React from "react";
import { View, Text, TextInput, type TextInputProps } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  required,
  ...props
}) => {
  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-text-secondary font-inter-medium text-sm">
          {label}
          {required && <Text className="text-error"> *</Text>}
        </Text>
      )}
      <View
        className={[
          "flex-row items-center bg-surface-elevated rounded-2xl border px-4 h-12",
          error ? "border-error" : "border-surface-border focus:border-brand-500",
        ].join(" ")}
      >
        {leftIcon && <View className="mr-3">{leftIcon}</View>}
        <TextInput
          className="flex-1 text-text-primary font-inter text-base"
          placeholderTextColor="rgba(255,255,255,0.30)"
          selectionColor="#6C5CE7"
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {rightIcon && <View className="ml-3">{rightIcon}</View>}
      </View>
      {error && (
        <Text className="text-error text-xs font-inter">{error}</Text>
      )}
      {!error && hint && (
        <Text className="text-text-muted text-xs font-inter">{hint}</Text>
      )}
    </View>
  );
};

interface TextAreaProps extends TextInputProps {
  label?: string;
  error?: string;
  rows?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  rows = 4,
  ...props
}) => {
  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-text-secondary font-inter-medium text-sm">{label}</Text>
      )}
      <TextInput
        multiline
        numberOfLines={rows}
        textAlignVertical="top"
        className={[
          "bg-surface-elevated rounded-2xl border px-4 py-3 text-text-primary font-inter text-base",
          error ? "border-error" : "border-surface-border",
        ].join(" ")}
        placeholderTextColor="rgba(255,255,255,0.30)"
        selectionColor="#6C5CE7"
        style={{ minHeight: rows * 24 }}
        {...props}
      />
      {error && <Text className="text-error text-xs font-inter">{error}</Text>}
    </View>
  );
};
