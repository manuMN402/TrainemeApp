import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { FONT_SIZES, SPACING } from "../../utils/responsiveDesign";

export default function ChatBubble({
  message,
  isFromTrainer = true,
  userProfilePicture,
}) {
  return (
    <View
      style={[
        styles.container,
        isFromTrainer ? styles.trainerContainer : styles.userContainer,
      ]}
    >
      {!isFromTrainer && (
        <Image source={{ uri: userProfilePicture }} style={styles.profilePic} />
      )}

      <View
        style={[
          styles.bubble,
          isFromTrainer ? styles.trainerBubble : styles.userBubble,
        ]}
      >
        <Text style={[styles.messageText, isFromTrainer && { color: "#1a1a2e" }]}>
          {message.content}
        </Text>
        <Text
          style={[
            styles.timestamp,
            isFromTrainer ? { color: "rgba(26, 26, 46, 0.6)" } : {},
          ]}
        >
          {message.timestamp}
        </Text>
      </View>

      {isFromTrainer && (
        <Image source={{ uri: userProfilePicture }} style={styles.profilePic} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
    alignItems: "flex-end",
  },
  trainerContainer: {
    justifyContent: "flex-end",
  },
  userContainer: {
    justifyContent: "flex-start",
  },
  profilePic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: SPACING.S,
  },
  bubble: {
    maxWidth: "70%",
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    borderRadius: 16,
  },
  trainerBubble: {
    backgroundColor: "#6366f1",
    borderBottomRightRadius: 4,
  },
  userBubble: {
    backgroundColor: "#2a2a3e",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: FONT_SIZES.BODY_S,
    color: "#fff",
  },
  timestamp: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    marginTop: SPACING.S,
  },
});
