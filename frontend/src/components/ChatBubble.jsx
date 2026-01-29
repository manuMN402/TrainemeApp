import { View, Text } from "react-native";

export default function ChatBubble({ message, isUser }) {
  return (
    <View
      style={{
        flexDirection: isUser ? "row-reverse" : "row",
        marginBottom: 12,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          maxWidth: "70%",
          backgroundColor: isUser ? "#8b5cf6" : "#1a1d2e",
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderTopLeftRadius: isUser ? 16 : 0,
          borderTopRightRadius: isUser ? 0 : 16,
        }}
      >
        <Text style={{ color: "white", fontSize: 14 }}>
          {message.text}
        </Text>
        <Text
          style={{
            color: isUser ? "rgba(255,255,255,0.7)" : "#666",
            fontSize: 11,
            marginTop: 4,
          }}
        >
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
}
