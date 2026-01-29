import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import {
  FONT_SIZES,
  SPACING,
  DIMENSIONS,
  SHADOWS,
} from "../utils/responsiveDesign";

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  screenWithPadding: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: SPACING.SCREEN_PADDING_H,
    paddingVertical: SPACING.SCREEN_PADDING_V,
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: SPACING.M,
  },

  subtitle: {
    color: Colors.muted,
    fontSize: FONT_SIZES.BODY_M,
    lineHeight: FONT_SIZES.BODY_M * 1.4,
  },

  sectionTitle: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: SPACING.L,
    marginTop: SPACING.L,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_L,
    padding: SPACING.L,
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: Colors.border,
    ...SHADOWS.LIGHT,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: SPACING.L,
    paddingHorizontal: SPACING.L,
    borderRadius: SPACING.RADIUS_L,
    alignItems: "center",
    justifyContent: "center",
    minHeight: DIMENSIONS.BUTTON_HEIGHT,
    ...SHADOWS.MEDIUM,
  },

  buttonText: {
    color: "#fff",
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
  },

  rowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
