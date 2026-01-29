import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import {
  FONT_SIZES,
  SPACING,
  DIMENSIONS,
  SHADOWS,
  IS_EXTRA_LARGE_DEVICE,
} from "../utils/responsiveDesign";

export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: SPACING.SCREEN_PADDING_H,
    justifyContent: "center",
    alignItems: IS_EXTRA_LARGE_DEVICE ? "center" : "stretch",
  },

  back: {
    color: Colors.muted,
    marginBottom: SPACING.L,
    fontSize: FONT_SIZES.BODY_M,
  },

  title: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: SPACING.S,
  },

  subtitle: {
    color: Colors.muted,
    marginTop: SPACING.S,
    marginBottom: SPACING.XXL,
    fontSize: FONT_SIZES.BODY_M,
    lineHeight: FONT_SIZES.BODY_M * 1.4,
  },

  card: {
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_L,
    padding: SPACING.L,
    borderWidth: 1,
    borderColor: Colors.border,
    maxWidth: IS_EXTRA_LARGE_DEVICE ? 600 : "100%",
    alignSelf: IS_EXTRA_LARGE_DEVICE ? "center" : "auto",
    width: IS_EXTRA_LARGE_DEVICE ? 600 : "100%",
  },

  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: SPACING.RADIUS_M,
    padding: SPACING.L,
    marginBottom: SPACING.L,
    minHeight: DIMENSIONS.INPUT_HEIGHT,
  },

  input: {
    flex: 1,
    marginLeft: SPACING.M,
    color: Colors.text,
    fontSize: FONT_SIZES.BODY_M,
  },

  button: {
    backgroundColor: Colors.primary,
    paddingVertical: SPACING.L,
    paddingHorizontal: SPACING.L,
    borderRadius: SPACING.RADIUS_L,
    alignItems: "center",
    marginTop: SPACING.M,
    minHeight: DIMENSIONS.BUTTON_HEIGHT,
    justifyContent: "center",
    ...SHADOWS.MEDIUM,
  },

  buttonText: {
    color: "#fff",
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
  },
});
