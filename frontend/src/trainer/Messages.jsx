import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import ChatBubble from "../components/trainer/ChatBubble";
import { Colors } from "../constants/colors";
import { FONT_SIZES, SPACING } from "../utils/responsiveDesign";
import { messagesData } from "../data/trainer/reviews";

export default function MessagesScreen() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState(
    messagesData.messageHistory["chat_001"] || []
  );
  const [chats, setChats] = useState(messagesData.chats);
  const [loading, setLoading] = useState(false);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    const chatMessages = messagesData.messageHistory[chat.id] || [];
    setMessages(chatMessages);
    setMessageText("");
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newMessage = {
        id: `msg_${Date.now()}`,
        sender: "trainer",
        content: messageText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages([...messages, newMessage]);
      setMessageText("");

      // Update last message
      setChats(
        chats.map((chat) =>
          chat.id === selectedChat.id
            ? { ...chat, lastMessage: messageText, timestamp: new Date().toLocaleTimeString() }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.container}>
        {/* CHAT HEADER */}
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <View style={styles.userAvatarContainer}>
              <Image
                source={{ uri: selectedChat.userProfilePicture }}
                style={styles.userAvatar}
              />
              {selectedChat.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatHeaderName}>{selectedChat.userName}</Text>
              <Text style={styles.chatHeaderStatus}>
                {selectedChat.isOnline ? "Online" : "Offline"}
              </Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="call-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* MESSAGES */}
        <ScrollView
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: SPACING.L }}
        >
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              message={message}
              isFromTrainer={message.sender === "trainer"}
              userProfilePicture={selectedChat.userProfilePicture}
            />
          ))}
        </ScrollView>

        {/* INPUT */}
        <View style={styles.inputContainer}>
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor={Colors.muted}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="attach-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.sendButton, loading && { opacity: 0.6 }]}
            onPress={handleSendMessage}
            disabled={loading || !messageText.trim()}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.subtitle}>{chats.length} conversations</Text>
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={chats}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatItem}
            onPress={() => handleSelectChat(item)}
          >
            <View style={styles.chatItemContent}>
              <View style={styles.userAvatarContainer}>
                <Image source={{ uri: item.userProfilePicture }} style={styles.chatAvatar} />
                {item.isOnline && <View style={styles.onlineIndicator} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.chatItemName}>{item.userName}</Text>
                <Text style={styles.chatItemMessage} numberOfLines={1}>
                  {item.lastMessage}
                </Text>
              </View>
            </View>
            <View style={styles.chatItemRight}>
              <Text style={styles.chatItemTime}>{item.timestamp.substring(0, 5)}</Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: SPACING.XXL }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.L,
  },
  title: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: "#fff",
  },
  subtitle: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    marginTop: SPACING.S,
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  chatItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  chatAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: SPACING.M,
  },
  chatItemName: {
    fontSize: FONT_SIZES.BODY_M,
    fontWeight: "600",
    color: "#fff",
  },
  chatItemMessage: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    marginTop: 4,
  },
  chatItemRight: {
    alignItems: "flex-end",
    gap: SPACING.S,
  },
  chatItemTime: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
  },
  unreadBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: {
    fontSize: FONT_SIZES.BODY_XS,
    color: "#fff",
    fontWeight: "700",
  },
  userAvatarContainer: {
    position: "relative",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#0f0f1e",
  },
  chatHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  chatHeaderInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginHorizontal: SPACING.M,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: SPACING.M,
  },
  chatHeaderName: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
    color: "#fff",
  },
  chatHeaderStatus: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: SPACING.M,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    gap: SPACING.M,
  },
  inputBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#1a1a2e",
    borderRadius: 20,
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.S,
    gap: SPACING.M,
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: FONT_SIZES.BODY_S,
    maxHeight: 100,
  },
  attachmentButton: {
    paddingVertical: SPACING.S,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
});
