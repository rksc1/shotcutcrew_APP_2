import React from "react";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VendorLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: "rgba(20,20,33,0.95)", height: 60 + insets.bottom, paddingBottom: insets.bottom }, tabBarShowLabel: false }}>
      <Tabs.Screen name="index" options={{ title: "Dashboard", tabBarIcon: ({ focused }) => <View className="items-center" style={{ minHeight: 44, justifyContent: "center" }}><Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>📊</Text><Text className="text-2xs text-text-muted">Dashboard</Text></View> }} />
      <Tabs.Screen name="inventory" options={{ title: "Inventory", tabBarIcon: ({ focused }) => <View className="items-center" style={{ minHeight: 44, justifyContent: "center" }}><Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>📦</Text><Text className="text-2xs text-text-muted">Inventory</Text></View> }} />
      <Tabs.Screen name="requests" options={{ title: "Requests", tabBarIcon: ({ focused }) => <View className="items-center" style={{ minHeight: 44, justifyContent: "center" }}><Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>📋</Text><Text className="text-2xs text-text-muted">Requests</Text></View> }} />
      <Tabs.Screen name="wallet" options={{ title: "Wallet", tabBarIcon: ({ focused }) => <View className="items-center" style={{ minHeight: 44, justifyContent: "center" }}><Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>💰</Text><Text className="text-2xs text-text-muted">Wallet</Text></View> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ focused }) => <View className="items-center" style={{ minHeight: 44, justifyContent: "center" }}><Text style={{ fontSize: 22, opacity: focused ? 1 : 0.5 }}>👤</Text><Text className="text-2xs text-text-muted">Profile</Text></View> }} />
    </Tabs>
  );
}
