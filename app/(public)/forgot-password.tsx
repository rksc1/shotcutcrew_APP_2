import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/api/auth";
import { ApiError } from "@/api/client";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email.trim().toLowerCase());
      setDone(true);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Failed to send reset email.";
      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center px-8">
        <Text className="text-6xl mb-4">📧</Text>
        <Text className="text-2xl font-inter-bold text-text-primary text-center mb-3">
          Check Your Email
        </Text>
        <Text className="text-base font-inter text-text-muted text-center mb-8">
          If an account exists for {email}, you'll receive a password reset link shortly.
        </Text>
        <Button variant="primary" size="lg" fullWidth onPress={() => router.replace("/(public)/login")}>
          Back to Sign In
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View className="px-6 pt-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-11 h-11 items-center justify-center rounded-2xl bg-surface-elevated mb-6"
            >
              <Text className="text-text-primary text-xl">←</Text>
            </TouchableOpacity>
            <Text className="text-4xl mb-2">🔐</Text>
            <Text className="text-3xl font-inter-bold text-text-primary mb-2">Forgot Password</Text>
            <Text className="text-base font-inter text-text-muted mb-8">
              Enter your email and we'll send you a reset link.
            </Text>
            <Input
              label="Email"
              placeholder="your@email.com"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              required
            />
            <View className="mt-6">
              <Button variant="primary" size="xl" fullWidth loading={loading} onPress={handleSubmit}>
                Send Reset Link
              </Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
