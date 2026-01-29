import { View, Text } from "react-native";
import { Colors } from "../constants/colors";
import componentStyles from "../styles/componentStyles";
import { SPACING, FONT_SIZES } from "../utils/responsiveDesign";

export default function ChatBubble({ message, isUser }) {
  return (
    <View
      style={{
        flexDirection: isUser ? "row-reverse" : "row",
        marginBottom: SPACING.L,
        paddingHorizontal: SPACING.SCREEN_PADDING_H,
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <View
        style={[
          componentStyles.chatBubble,
          isUser
            ? componentStyles.chatBubbleSender
            : componentStyles.chatBubbleReceiver,
        ]}
      >
        <Text
          style={[
            componentStyles.chatBubbleText,
            isUser
              ? componentStyles.chatBubbleTextSender
              : componentStyles.chatBubbleTextReceiver,
          ]}
        >
          {message.text}
        </Text>
        <Text style={componentStyles.chatBubbleTime}>
          {message.timestamp}
        </Text>
      </View>
    </View>
  );
}
