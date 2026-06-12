import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { projectsApi } from "@/api/projects";
import { Button } from "@/components/ui/Button";

export default function WorkProofScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("");

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!imageUri) throw new Error("Please select a file first");

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: fileName || "work_proof.jpg",
        type: mimeType || "image/jpeg",
      } as any);

      const uploadRes = await projectsApi.uploadWorkProof(id, formData);
      if (!uploadRes.success) throw new Error("Upload failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["creator-projects", id] });
      Alert.alert("Success", "Work proof submitted successfully!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    },
    onError: (err: any) => {
      Alert.alert("Error", err.message || "Failed to submit work proof");
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Simplified MVP: images only
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setFileName(result.assets[0].fileName ?? "work_proof.jpg");
      setMimeType(result.assets[0].mimeType ?? "image/jpeg");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark-900" edges={["top"]}>
      <View className="px-5 pt-4 pb-2 flex-row items-center border-b border-surface-border">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-11 h-11 rounded-2xl bg-surface-elevated items-center justify-center mr-4"
        >
          <Text className="text-text-primary text-xl">←</Text>
        </TouchableOpacity>
        <Text className="text-text-primary font-inter-semibold text-lg flex-1">
          Upload Work Proof
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100, gap: 24 }}>
        <View className="bg-surface-elevated border border-surface-border rounded-3xl p-5 gap-3">
          <Text className="text-text-primary font-inter-semibold text-lg">Instructions</Text>
          <Text className="text-text-muted font-inter text-sm leading-relaxed">
            Please upload a low-resolution or watermarked screenshot/image representing the final delivered work. 
            Do not upload full-resolution source files here.
          </Text>
        </View>

        <View className="gap-4">
          <Text className="text-text-primary font-inter-semibold text-lg">Your Submission</Text>
          
          <TouchableOpacity 
            onPress={pickImage}
            className="h-48 rounded-2xl border-2 border-dashed border-surface-border bg-surface-elevated items-center justify-center overflow-hidden"
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-full opacity-80" resizeMode="cover" />
            ) : (
              <View className="items-center gap-2">
                <Text className="text-3xl">📤</Text>
                <Text className="text-text-muted font-inter-medium text-sm">
                  Tap to pick image from gallery
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Button
            variant="primary"
            size="xl"
            fullWidth
            loading={uploadMutation.isPending}
            disabled={!imageUri}
            onPress={() => uploadMutation.mutate()}
            className="mt-6"
          >
            Submit for Approval
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
