import React, { useState, useRef } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, FlatList, 
  KeyboardAvoidingView, Platform, ActivityIndicator 
} from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi, type Message } from "@/api/projects";
import { useAuthStore } from "@/store/authStore";

interface ProjectChatProps {
  projectId: string;
}

export function ProjectChat({ projectId }: ProjectChatProps) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["project-messages", projectId],
    queryFn: () => projectsApi.getMessages(projectId),
    refetchInterval: 3000, // Poll every 3 seconds for new messages
  });

  const sendMutation = useMutation({
    mutationFn: (text: string) => projectsApi.sendMessage(projectId, text),
    onSuccess: () => {
      setInputText("");
      queryClient.invalidateQueries({ queryKey: ["project-messages", projectId] });
    },
  });

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMutation.mutate(inputText.trim());
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = item.sender_id === user?.id;
    return (
      <View className={`mb-4 max-w-[80%] ${isMe ? "self-end" : "self-start"}`}>
        {!isMe && (
          <Text className="text-text-muted text-xs mb-1 ml-1 font-inter">
            {item.sender_name || "User"}
          </Text>
        )}
        <View 
          className={`px-4 py-3 rounded-2xl ${
            isMe 
              ? "bg-brand-500 rounded-tr-sm" 
              : "bg-surface-elevated border border-surface-border rounded-tl-sm"
          }`}
        >
          <Text className={`font-inter text-sm ${isMe ? "text-white" : "text-text-primary"}`}>
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-dark-900"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#6C5CE7" />
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={data?.messages || []}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={{ padding: 20, flexGrow: 1, justifyContent: "flex-end" }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <Text className="text-text-muted font-inter text-center">
                No messages yet. Say hello! 👋
              </Text>
            </View>
          }
        />
      )}

      <View className="px-5 py-3 border-t border-surface-border bg-dark-900 flex-row items-end gap-3">
        <TextInput
          className="flex-1 min-h-[48px] max-h-[120px] bg-surface-elevated border border-surface-border rounded-2xl px-4 pt-3 pb-3 text-text-primary font-inter"
          placeholder="Type a message..."
          placeholderTextColor="#A0AEC0"
          multiline
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity 
          onPress={handleSend}
          disabled={!inputText.trim() || sendMutation.isPending}
          className={`h-12 w-12 rounded-full items-center justify-center ${
            inputText.trim() && !sendMutation.isPending ? "bg-brand-500" : "bg-dark-500"
          }`}
        >
          {sendMutation.isPending ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text className="text-white text-xl">➤</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
