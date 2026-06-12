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
import Animated, { FadeIn, FadeOut, LinearTransition } from "react-native-reanimated";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/api/auth";
import {
  signupClientSchema,
  signupCreatorSchema,
  type SignupClientFormData,
  type SignupCreatorFormData,
} from "@/utils/validation";
import { ApiError } from "@/api/client";

type RoleType = "client" | "creator";

export default function SignupScreen() {
  const router = useRouter();
  const [role, setRole] = useState<RoleType>("client");
  const [creatorType, setCreatorType] = useState<"freelancer" | "studio_owner">("freelancer");
  const [done, setDone] = useState(false);

  const clientForm = useForm<SignupClientFormData>({
    resolver: zodResolver(signupClientSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const creatorForm = useForm<SignupCreatorFormData>({
    resolver: zodResolver(signupCreatorSchema) as any,
    defaultValues: {
      name: "", email: "", password: "",
      role: "", phone: "", city: "", creatorType: "freelancer", dayRate: 0,
    },
  });

  const isSubmitting =
    role === "client" ? clientForm.formState.isSubmitting : creatorForm.formState.isSubmitting;

  const onSubmitClient = async (data: SignupClientFormData) => {
    try {
      await authApi.signupClient(data);
      setDone(true);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Signup failed. Please try again.";
      Alert.alert("Sign Up Failed", msg);
    }
  };

  const onSubmitCreator = async (data: SignupCreatorFormData) => {
    try {
      await authApi.signupCreator({ ...data, creatorType });
      setDone(true);
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : "Signup failed. Please try again.";
      Alert.alert("Sign Up Failed", msg);
    }
  };

  if (done) {
    return (
      <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center px-8">
        <Text className="text-6xl mb-6">📧</Text>
        <Text className="text-2xl font-inter-bold text-text-primary text-center mb-3">
          Check Your Email
        </Text>
        <Text className="text-base font-inter text-text-muted text-center mb-8">
          We've sent a verification link to your email address. Please verify your account before signing in.
        </Text>
        <Button variant="primary" size="lg" fullWidth onPress={() => router.replace("/(public)/login")}>
          Go to Sign In
        </Button>
      </SafeAreaView>
    );
  }

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
            <Text className="text-3xl font-inter-bold text-text-primary mb-2">
              Create Account
            </Text>
            <Text className="text-base font-inter text-text-muted">
              Join India's top creative marketplace
            </Text>
          </View>

          {/* Role selector */}
          <View className="px-6 mb-4">
            <Text className="text-text-secondary font-inter-medium text-sm mb-3">
              I am joining as:
            </Text>
            <View className="flex-row gap-3">
              {[
                { id: "client" as RoleType, label: "Client", emoji: "🎯", desc: "Hire creators" },
                { id: "creator" as RoleType, label: "Creator", emoji: "🎬", desc: "Get hired" },
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => setRole(option.id)}
                  className={[
                    "flex-1 rounded-3xl p-4 border",
                    role === option.id
                      ? "bg-brand-500/20 border-brand-500"
                      : "bg-surface-elevated border-surface-border",
                  ].join(" ")}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: role === option.id }}
                >
                  <Text className="text-2xl mb-1">{option.emoji}</Text>
                  <Text className={`font-inter-semibold text-base ${role === option.id ? "text-brand-300" : "text-text-primary"}`}>
                    {option.label}
                  </Text>
                  <Text className="text-text-muted font-inter text-xs mt-0.5">{option.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Form fields */}
          <View className="px-6 gap-4">
            {role === "client" ? (
              <Animated.View entering={FadeIn} exiting={FadeOut} layout={LinearTransition} className="gap-4">
                <Controller
                  control={clientForm.control}
                  name="name"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input label="Full Name" placeholder="Your full name" value={value} onChangeText={onChange} onBlur={onBlur} error={clientForm.formState.errors.name?.message} required />
                  )}
                />
                <Controller
                  control={clientForm.control}
                  name="email"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input label="Email" placeholder="your@email.com" keyboardType="email-address" autoComplete="email" value={value} onChangeText={onChange} onBlur={onBlur} error={clientForm.formState.errors.email?.message} required />
                  )}
                />
                <Controller
                  control={clientForm.control}
                  name="password"
                  render={({ field: { onChange, value, onBlur } }) => (
                    <Input label="Password" placeholder="Min 10 chars, uppercase, number" secureTextEntry value={value} onChangeText={onChange} onBlur={onBlur} error={clientForm.formState.errors.password?.message} required />
                  )}
                />
                <Button variant="primary" size="xl" fullWidth loading={isSubmitting} onPress={clientForm.handleSubmit(onSubmitClient)}>
                  Create Account
                </Button>
              </Animated.View>
            ) : (
              <Animated.View entering={FadeIn} exiting={FadeOut} layout={LinearTransition} className="gap-4">
                {/* Creator type */}
                <View>
                  <Text className="text-text-secondary font-inter-medium text-sm mb-2">Creator Type</Text>
                  <View className="flex-row gap-3">
                    {[
                      { id: "freelancer" as const, label: "Freelancer", emoji: "🤝" },
                      { id: "studio_owner" as const, label: "Studio Owner", emoji: "🏠" },
                    ].map((ct) => (
                      <TouchableOpacity
                        key={ct.id}
                        onPress={() => { setCreatorType(ct.id); creatorForm.setValue("creatorType", ct.id); }}
                        className={[
                          "flex-1 rounded-2xl px-4 py-3 border flex-row items-center gap-2",
                          creatorType === ct.id ? "bg-brand-500/20 border-brand-500" : "bg-surface-elevated border-surface-border",
                        ].join(" ")}
                      >
                        <Text>{ct.emoji}</Text>
                        <Text className={`font-inter-medium text-sm ${creatorType === ct.id ? "text-brand-300" : "text-text-primary"}`}>{ct.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Controller control={creatorForm.control} name="name" render={({ field: { onChange, value, onBlur } }) => (
                  <Input label="Full Name" placeholder="Your full name" value={value} onChangeText={onChange} onBlur={onBlur} error={creatorForm.formState.errors.name?.message} required />
                )} />
                <Controller control={creatorForm.control} name="email" render={({ field: { onChange, value, onBlur } }) => (
                  <Input label="Email" placeholder="your@email.com" keyboardType="email-address" value={value} onChangeText={onChange} onBlur={onBlur} error={creatorForm.formState.errors.email?.message} required />
                )} />
                <Controller control={creatorForm.control} name="password" render={({ field: { onChange, value, onBlur } }) => (
                  <Input label="Password" placeholder="Min 10 chars, uppercase, number" secureTextEntry value={value} onChangeText={onChange} onBlur={onBlur} error={creatorForm.formState.errors.password?.message} required />
                )} />
                <Controller control={creatorForm.control} name="role" render={({ field: { onChange, value, onBlur } }) => (
                  <Input label="Primary Role" placeholder="e.g. Photographer, Videographer" value={value} onChangeText={onChange} onBlur={onBlur} error={creatorForm.formState.errors.role?.message} required />
                )} />
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Controller control={creatorForm.control} name="phone" render={({ field: { onChange, value, onBlur } }) => (
                      <Input label="Phone" placeholder="10-digit number" keyboardType="phone-pad" value={value} onChangeText={onChange} onBlur={onBlur} error={creatorForm.formState.errors.phone?.message} required />
                    )} />
                  </View>
                  <View className="flex-1">
                    <Controller control={creatorForm.control} name="city" render={({ field: { onChange, value, onBlur } }) => (
                      <Input label="City" placeholder="Mumbai" value={value} onChangeText={onChange} onBlur={onBlur} error={creatorForm.formState.errors.city?.message} required />
                    )} />
                  </View>
                </View>
                <Button variant="primary" size="xl" fullWidth loading={isSubmitting} onPress={creatorForm.handleSubmit(onSubmitCreator)}>
                  Create Creator Account
                </Button>
              </Animated.View>
            )}

            <TouchableOpacity
              onPress={() => router.push("/(public)/login")}
              className="items-center py-4"
            >
              <Text className="text-text-muted font-inter text-base">
                Already have an account?{" "}
                <Text className="text-brand-400 font-inter-medium">Sign in</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
