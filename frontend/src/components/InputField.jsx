import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../constants/colors";
import { SPACING, FONT_SIZES } from "../utils/responsiveDesign";

export default function InputField({ icon, error, isValid, ...props }) {
  return (
    <View style={styles.box}>
      <Ionicons name={icon} size={20} color={Colors.muted} />
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.muted}
        {...props}
      />
      {isValid && <Ionicons name="checkmark-circle" size={20} color="#10b981" />}
      {error && <Ionicons name="alert-circle" size={20} color="#ef4444" />}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    borderRadius: SPACING.RADIUS_M,
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: "#1E293B",
    minHeight: 48,
  },
  input: {
    marginLeft: SPACING.M,
    marginRight: SPACING.M,
    color: Colors.text,
    flex: 1,
    fontSize: FONT_SIZES.BODY_M,
  },
});
