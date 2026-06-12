import React from "react";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ emoji, label, focused }) => (
  <View className="items-center gap-0.5" style={{ minWidth: 44, minHeight: 44, justifyContent: "center" }}>
    <Text style={{ fontSize: focused ? 24 : 22, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
    <Text
      className={`font-inter text-center ${focused ? "text-success font-inter-medium" : "text-text-muted"}`}
      style={{ fontSize: 9 }}
    >
      {label}
    </Text>
  </View>
);

export default function CreatorLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(20,20,33,0.95)",
          borderTopColor: "rgba(255,255,255,0.06)",
          borderTopWidth: 1,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: "#00B894",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" label="Dashboard" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="opportunities"
        options={{
          title: "Opportunities",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔔" label="Opportunities" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="projects"
        options={{
          title: "Projects",
          tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Projects" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({ focused }) => <TabIcon emoji="💰" label="Wallet" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
