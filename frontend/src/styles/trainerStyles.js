import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import {
  FONT_SIZES,
  SPACING,
  DIMENSIONS,
  SHADOWS,
} from "../utils/responsiveDesign";

export const trainerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: SPACING.SCREEN_PADDING_H,
    paddingVertical: SPACING.SCREEN_PADDING_V,
  },

  section: {
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_L,
    padding: SPACING.L,
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: Colors.border,
    ...SHADOWS.LIGHT,
  },

  sectionWithoutMargin: {
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_L,
    padding: SPACING.L,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  heading: {
    color: Colors.text,
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    marginBottom: SPACING.L,
  },

  subHeading: {
    color: Colors.text,
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
    marginBottom: SPACING.M,
    marginTop: SPACING.M,
  },

  text: {
    color: Colors.muted,
    fontSize: FONT_SIZES.BODY_M,
    lineHeight: FONT_SIZES.BODY_M * 1.5,
  },

  textBold: {
    color: Colors.text,
    fontSize: FONT_SIZES.BODY_M,
    fontWeight: "600",
    lineHeight: FONT_SIZES.BODY_M * 1.5,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: SPACING.L,
    paddingHorizontal: SPACING.L,
    borderRadius: SPACING.RADIUS_L,
    alignItems: "center",
    justifyContent: "center",
    minHeight: DIMENSIONS.BUTTON_HEIGHT,
    marginTop: SPACING.L,
    ...SHADOWS.MEDIUM,
  },

  buttonSecondary: {
    backgroundColor: Colors.card,
    paddingVertical: SPACING.L,
    paddingHorizontal: SPACING.L,
    borderRadius: SPACING.RADIUS_L,
    alignItems: "center",
    justifyContent: "center",
    minHeight: DIMENSIONS.BUTTON_HEIGHT,
    marginTop: SPACING.L,
    borderWidth: 2,
    borderColor: Colors.primary,
  },

  buttonText: {
    color: "#fff",
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
  },

  buttonSecondaryText: {
    color: Colors.primary,
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  rowLast: {
    borderBottomWidth: 0,
  },

  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderRadius: SPACING.RADIUS_S,
    alignSelf: "flex-start",
  },

  badgeText: {
    color: "#fff",
    fontSize: FONT_SIZES.BODY_XS,
    fontWeight: "600",
  },
});
