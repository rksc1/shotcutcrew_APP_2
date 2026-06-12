import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { projectsApi } from "@/api/projects";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/utils/format";

export default function PaymentProofScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [mimeType, setMimeType] = useState<string>("");
  const [reference, setReference] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["qr-payment", id],
    queryFn: () => projectsApi.getQrPayment(id),
    enabled: !!id,
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!imageUri) throw new Error("Please select a screenshot first");
      if (!reference.trim()) throw new Error("Please enter a transaction reference");

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: fileName || "payment_proof.jpg",
        type: mimeType || "image/jpeg",
      } as any);

      // 1. Upload the image
      const uploadRes = await projectsApi.uploadPaymentProof(id, formData);
      if (!uploadRes.success) throw new Error("Upload failed");

      // 2. Submit the payment record
      await projectsApi.submitPaymentProof(id, {
        paymentReference: reference,
        proofUrl: uploadRes.proofUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-projects", id] });
      Alert.alert("Success", "Payment proof submitted successfully. Waiting for admin verification.", [
        { text: "OK", onPress: () => router.back() }
      ]);
    },
    onError: (err: any) => {
      Alert.alert("Error", err.message || "Failed to submit payment proof");
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      setFileName(result.assets[0].fileName ?? "upload.jpg");
      setMimeType(result.assets[0].mimeType ?? "image/jpeg");
    }
  };

  const payment = data?.payment;

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
          Complete Payment
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#6C5CE7" />
        </View>
      ) : !payment ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-text-primary text-center">Payment details not found.</Text>
        </View>
      ) : (
        <ScrollView className="flex-1 px-5 pt-6" contentContainerStyle={{ paddingBottom: 100, gap: 24 }}>
          {/* Instructions */}
          <View className="bg-surface-elevated rounded-3xl p-5 border border-surface-border gap-4 items-center">
            <Text className="text-text-secondary font-inter-medium text-sm text-center">
              Scan this QR code with any UPI app to pay
            </Text>
            
            <View className="bg-white p-4 rounded-2xl">
              {/* Dummy QR placeholder for MVP UI purposes */}
              <View className="w-48 h-48 bg-gray-200 rounded-xl items-center justify-center">
                <Text className="text-gray-500 font-inter-bold text-lg text-center px-4">
                  QR Image {"\n"}(Simulated)
                </Text>
              </View>
            </View>

            <View className="w-full gap-2 mt-2">
              <View className="flex-row justify-between">
                <Text className="text-text-muted font-inter text-sm">Amount due:</Text>
                <Text className="text-text-primary font-inter-bold text-base">
                  {formatCurrency(payment.amount)}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-muted font-inter text-sm">UPI ID:</Text>
                <Text className="text-text-primary font-inter-medium text-sm">{payment.upiId}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-text-muted font-inter text-sm">Payee Name:</Text>
                <Text className="text-text-primary font-inter-medium text-sm">{payment.payeeName}</Text>
              </View>
            </View>
          </View>

          {/* Upload Form */}
          <View className="gap-4">
            <Text className="text-text-primary font-inter-semibold text-lg">Upload Proof</Text>
            
            <Input
              label="Transaction Reference Number"
              placeholder="e.g. UTR / Ref No."
              value={reference}
              onChangeText={setReference}
            />

            <TouchableOpacity 
              onPress={pickImage}
              className="h-32 rounded-2xl border-2 border-dashed border-surface-border bg-surface-elevated items-center justify-center overflow-hidden"
            >
              {imageUri ? (
                <Image source={{ uri: imageUri }} className="w-full h-full opacity-80" resizeMode="cover" />
              ) : (
                <View className="items-center gap-2">
                  <Text className="text-2xl">📸</Text>
                  <Text className="text-text-muted font-inter-medium text-sm">
                    Tap to upload screenshot
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <Button
              variant="primary"
              size="xl"
              fullWidth
              loading={uploadMutation.isPending}
              disabled={!imageUri || !reference.trim()}
              onPress={() => uploadMutation.mutate()}
              className="mt-4"
            >
              Submit Payment
            </Button>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
