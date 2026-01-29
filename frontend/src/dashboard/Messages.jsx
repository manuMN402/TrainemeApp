import { View, Text, TouchableOpacity, FlatList, SafeAreaView, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { messagesData } from "../data/messages";

export default function Messages({ navigation }) {
  const [messages, setMessages] = useState(messagesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  const filteredMessages = messages.filter((msg) =>
    msg.trainer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedChat) {
      const updatedMessages = messages.map((msg) => {
        if (msg.chat_id === selectedChat.chat_id) {
          return {
            ...msg,
            messages: [
              ...msg.messages,
              {
                id: (msg.messages.length + 1).toString(),
                sender: "user",
                text: newMessage,
                timestamp: "now",
              },
            ],
            lastMessage: newMessage,
            timestamp: "now",
          };
        }
        return msg;
      });
      setMessages(updatedMessages);
      setNewMessage("");
    }
  };

  if (selectedChat) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#070B1A" }}>
        {/* Chat Header */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#0f1419",
            borderBottomWidth: 1,
            borderBottomColor: "#1a1d2e",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <TouchableOpacity onPress={() => setSelectedChat(null)}>
              <Ionicons name="arrow-back" size={24} color="#8b5cf6" />
            </TouchableOpacity>
            <View style={{ marginLeft: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "white",
                }}
              >
                {selectedChat.trainer_name}
              </Text>
              <Text style={{ fontSize: 12, color: "#999" }}>
                {selectedChat.trainer_specialty}
              </Text>
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        <FlatList
          data={selectedChat.messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: item.sender === "user" ? "row-reverse" : "row",
                marginBottom: 12,
                paddingHorizontal: 16,
              }}
            >
              <View
                style={{
                  maxWidth: "70%",
                  backgroundColor:
                    item.sender === "user" ? "#8b5cf6" : "#1a1d2e",
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderTopLeftRadius: item.sender === "user" ? 16 : 0,
                  borderTopRightRadius: item.sender === "user" ? 0 : 16,
                }}
              >
                <Text style={{ color: "white", fontSize: 14 }}>
                  {item.text}
                </Text>
                <Text
                  style={{
                    color:
                      item.sender === "user"
                        ? "rgba(255,255,255,0.7)"
                        : "#666",
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  {item.timestamp}
                </Text>
              </View>
            </View>
          )}
          scrollEnabled={true}
          contentContainerStyle={{ paddingVertical: 16 }}
        />

        {/* Message Input */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: "#0f1419",
            borderTopWidth: 1,
            borderTopColor: "#1a1d2e",
          }}
        >
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor="#666"
            value={newMessage}
            onChangeText={setNewMessage}
            style={{
              flex: 1,
              backgroundColor: "#1a1d2e",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 10,
              color: "white",
              fontSize: 14,
              marginRight: 8,
            }}
          />
          <TouchableOpacity
            onPress={handleSendMessage}
            style={{
              backgroundColor: "#8b5cf6",
              borderRadius: 20,
              paddingHorizontal: 16,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#070B1A" }}>
      {/* Header with Back Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", color: "white" }}>
          Messages
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            padding: 8,
            backgroundColor: "#1a1d2e",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <Ionicons name="arrow-back" size={20} color="#8b5cf6" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1a1d2e",
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: "#333",
          }}
        >
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            placeholder="Search trainers..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              paddingVertical: 12,
              paddingHorizontal: 8,
              color: "white",
              fontSize: 14,
            }}
          />
        </View>
      </View>

      {/* Messages List */}
      <FlatList
        data={filteredMessages}
        keyExtractor={(item) => item.chat_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setSelectedChat(item)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#1a1d2e",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* Avatar */}
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#8b5cf6",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 24 }}>{item.avatar}</Text>
            </View>

            {/* Message Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  color: "white",
                }}
              >
                {item.trainer_name}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: "#999",
                  marginTop: 4,
                }}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            </View>

            {/* Timestamp & Unread Badge */}
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#666",
                  marginBottom: 4,
                }}
              >
                {item.timestamp}
              </Text>
              {item.unread && (
                <View
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "#8b5cf6",
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        )}
        scrollEnabled={true}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
