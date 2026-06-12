import React from "react";
import { Tabs } from "expo-router";
import { View, Text, type StyleProp, type ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
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
      className={`font-inter text-center ${focused ? "text-brand-400 font-inter-medium" : "text-text-muted"}`}
      style={{ fontSize: 9 }}
    >
      {label}
    </Text>
  </View>
);

export default function ClientLayout() {
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
        tabBarActiveTintColor: "#6C5CE7",
        tabBarInactiveTintColor: "rgba(255,255,255,0.4)",
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" label="Home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" label="Explore" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="book"
        options={{
          title: "Book",
          tabBarIcon: ({ focused }) => (
            <View
              className="bg-brand-500 rounded-2xl"
              style={{ width: 48, height: 48, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={{ fontSize: 22 }}>➕</Text>
            </View>
          ),
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
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" label="Profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}
