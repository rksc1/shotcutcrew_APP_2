import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { loginSchema, type LoginFormData } from "@/utils/validation";
import { ApiError } from "@/api/client";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password);
      // Navigation handled automatically by root layout
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : "Login failed. Please check your credentials and try again.";
      Alert.alert("Sign In Failed", msg);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-8 pb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-11 h-11 items-center justify-center rounded-2xl bg-surface-elevated mb-6"
              accessibilityLabel="Go back"
            >
              <Text className="text-text-primary text-xl">←</Text>
            </TouchableOpacity>
            <Text className="text-4xl mb-2">👋</Text>
            <Text className="text-3xl font-inter-bold text-text-primary mb-2">
              Welcome back
            </Text>
            <Text className="text-base font-inter text-text-muted">
              Sign in to your ShotcutCrew account
            </Text>
          </View>

          {/* Form */}
          <View className="px-6 gap-4 flex-1">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Email"
                  placeholder="your@email.com"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                  required
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value, onBlur } }) => (
                <Input
                  label="Password"
                  placeholder="Your password"
                  secureTextEntry={!showPassword}
                  textContentType="password"
                  autoComplete="current-password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                  required
                  rightIcon={
                    <TouchableOpacity onPress={() => setShowPassword((s) => !s)}>
                      <Text className="text-text-muted text-sm font-inter">
                        {showPassword ? "Hide" : "Show"}
                      </Text>
                    </TouchableOpacity>
                  }
                />
              )}
            />

            <TouchableOpacity
              onPress={() => router.push("/(public)/forgot-password")}
              className="self-end"
              accessibilityRole="link"
            >
              <Text className="text-brand-400 font-inter-medium text-sm">
                Forgot password?
              </Text>
            </TouchableOpacity>

            <View className="mt-2">
              <Button
                variant="primary"
                size="xl"
                fullWidth
                loading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              >
                Sign In
              </Button>
            </View>

            {/* Divider */}
            <View className="flex-row items-center gap-4 my-2">
              <View className="flex-1 h-px bg-surface-border" />
              <Text className="text-text-muted font-inter text-sm">or</Text>
              <View className="flex-1 h-px bg-surface-border" />
            </View>

            <Button
              variant="outline"
              size="xl"
              fullWidth
              onPress={() => router.push("/(public)/signup")}
            >
              Create Account
            </Button>
          </View>

          {/* Footer */}
          <View className="px-6 py-8">
            <Text className="text-text-muted font-inter text-xs text-center">
              By signing in, you agree to our{" "}
              <Text className="text-text-secondary underline">Terms of Service</Text>
              {" "}and{" "}
              <Text className="text-text-secondary underline">Privacy Policy</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
