import React from "react";
import { View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
export default function VendorWallet() {
  return <SafeAreaView className="flex-1 bg-dark-900 items-center justify-center px-8"><Text className="text-5xl mb-4">💰</Text><Text className="text-text-primary font-inter-bold text-xl text-center">Wallet</Text></SafeAreaView>;
}
