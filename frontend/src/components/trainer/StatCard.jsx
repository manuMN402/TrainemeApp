import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/colors";
import { FONT_SIZES, SPACING, DIMENSIONS } from "../../utils/responsiveDesign";

export default function StatCard({
  title,
  value,
  icon,
  iconColor = Colors.primary,
  backgroundColor = "#1a1a2e",
  textColor = "#fff",
}) {
  return (
    <View style={[styles.card, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>
        <Ionicons name={icon} size={24} color={iconColor} />
      </View>
      <Text style={[styles.value, { color: iconColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: SPACING.L,
    marginVertical: SPACING.M,
    marginHorizontal: SPACING.M,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.M,
  },
  title: {
    fontSize: FONT_SIZES.BODY_M,
    fontWeight: "600",
  },
  value: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    marginTop: SPACING.S,
  },
});
