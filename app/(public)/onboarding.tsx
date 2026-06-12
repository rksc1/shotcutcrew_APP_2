import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  type ListRenderItem,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import { Video, Package, ShieldCheck, type LucideIcon } from "lucide-react-native";
import { Button } from "@/components/ui/Button";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

interface Slide {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accent: string;
}

const SLIDES: Slide[] = [
  {
    id: "1",
    icon: Video,
    title: "Assemble the\nPerfect Crew",
    subtitle: "Book vetted directors, videographers, and production crew for your next project.",
    accent: "#6C5CE7",
  },
  {
    id: "2",
    icon: Package,
    title: "Vast Equipment\nCatalog",
    subtitle: "Rent camera packages, lighting kits, and grip gear from verified studios.",
    accent: "#00B894",
  },
  {
    id: "3",
    icon: ShieldCheck,
    title: "Secure Escrow\n& Progress",
    subtitle: "Milestone-based project management, timeline tracking, and secure payouts.",
    accent: "#FF7043",
  },
];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<Slide>);

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<Slide>>(null);
  const scrollX = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const renderSlide: ListRenderItem<Slide> = ({ item, index }) => {
    const animStyle = useAnimatedStyle(() => {
      const inputRange = [
        (index - 1) * SCREEN_WIDTH,
        index * SCREEN_WIDTH,
        (index + 1) * SCREEN_WIDTH,
      ];
      const opacity = interpolate(scrollX.value, inputRange, [0.4, 1, 0.4]);
      const scale = interpolate(scrollX.value, inputRange, [0.85, 1, 0.85]);
      return { opacity, transform: [{ scale }] };
    });

    return (
      <Animated.View
        style={[{ width: SCREEN_WIDTH }, animStyle]}
        className="px-8 items-center justify-center"
      >
        <View className="w-32 h-32 rounded-full border-2 border-surface-border bg-surface-elevated items-center justify-center mb-8">
          <item.icon size={64} color={item.accent} strokeWidth={1.5} />
        </View>
        <Text className="text-3xl font-inter-bold text-text-primary text-center leading-tight mb-4">
          {item.title}
        </Text>
        <Text className="text-base font-inter text-text-secondary text-center leading-relaxed">
          {item.subtitle}
        </Text>
      </Animated.View>
    );
  };

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next });
      setCurrentIndex(next);
    } else {
      router.push("/(public)/login");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900">
      <View className="flex-row justify-between items-center px-6 pt-4">
        <Text className="text-text-primary font-inter-bold text-xl tracking-tight">ShotcutCrew</Text>
        <TouchableOpacity onPress={() => router.push("/(public)/login")} hitSlop={8}>
          <Text className="text-text-muted font-inter-medium">Skip</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 justify-center">
        <AnimatedFlatList
          ref={flatListRef as any}
          data={SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
          style={{ flexGrow: 0, height: 400 }}
        />
      </View>

      {/* Dots */}
      <View className="flex-row justify-center gap-2 mb-6">
        {SLIDES.map((_, i) => {
          const dotStyle = useAnimatedStyle(() => {
            const inputRange = [
              (i - 1) * SCREEN_WIDTH,
              i * SCREEN_WIDTH,
              (i + 1) * SCREEN_WIDTH,
            ];
            const width = interpolate(scrollX.value, inputRange, [8, 24, 8], "clamp");
            return { width };
          });
          return (
            <Animated.View
              key={i}
              style={dotStyle}
              className={`h-2 rounded-full ${i === currentIndex ? "bg-brand-500" : "bg-dark-400"}`}
            />
          );
        })}
      </View>

      {/* ShotcutCrew Assurance Banner (Legacy Inspiration) */}
      <View className="flex-row items-center justify-center bg-brand-500/10 py-3 mx-6 rounded-xl mb-6 border border-brand-500/20">
        <ShieldCheck size={18} color="#6C5CE7" strokeWidth={2.5} />
        <Text className="text-brand-300 font-inter-bold text-sm ml-2">ShotcutCrew Crew Assurance Included</Text>
      </View>

      {/* CTA */}
      <View className="px-6 pb-8 gap-3">
        <Button variant="primary" size="xl" fullWidth onPress={goNext}>
          {currentIndex < SLIDES.length - 1 ? "Next" : "Get Started"}
        </Button>
      </View>
    </SafeAreaView>
  );
}
