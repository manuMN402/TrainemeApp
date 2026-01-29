import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import {
  FONT_SIZES,
  SPACING,
  DIMENSIONS,
  SHADOWS,
  IS_SMALL_DEVICE,
  IS_EXTRA_LARGE_DEVICE,
} from "../utils/responsiveDesign";

export default StyleSheet.create({
  /* SCREEN */
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  container: {
    padding: SPACING.SCREEN_PADDING_H,
    paddingTop: IS_SMALL_DEVICE ? SPACING.XXXL : SPACING.XXXL,
  },

  /* BACK */
  back: {
    color: Colors.muted,
    fontSize: FONT_SIZES.BODY_M,
    marginBottom: SPACING.L,
  },

  /* HEADER */
  title: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: SPACING.S,
  },

  subtitle: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.muted,
    marginTop: SPACING.S,
    marginBottom: SPACING.XXL,
    lineHeight: FONT_SIZES.BODY_M * 1.4,
  },

  /* CARD */
  card: {
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_XXL,
    padding: SPACING.M,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: 0,
    maxWidth: IS_EXTRA_LARGE_DEVICE ? 600 : "100%",
    alignSelf: IS_EXTRA_LARGE_DEVICE ? "center" : "auto",
    width: IS_EXTRA_LARGE_DEVICE ? 600 : "100%",
  },

  /* LABEL */
  label: {
    color: Colors.text,
    fontSize: FONT_SIZES.LABEL,
    marginBottom: SPACING.S,
    fontWeight: "500",
  },

  /* INPUT */
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: SPACING.RADIUS_M,
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: SPACING.M,
    minHeight: DIMENSIONS.INPUT_HEIGHT,
  },

  input: {
    flex: 1,
    marginLeft: SPACING.M,
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.text,
  },

  /* BUTTON */
  button: {
    marginTop: SPACING.M,
    backgroundColor: Colors.primary,
    paddingVertical: SPACING.L,
    paddingHorizontal: SPACING.L,
    borderRadius: SPACING.RADIUS_L,
    alignItems: "center",
    minHeight: DIMENSIONS.BUTTON_HEIGHT,
    justifyContent: "center",
    ...SHADOWS.MEDIUM,
  },

  buttonText: {
    color: "#fff",
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
  },

  /* LOGIN TEXT */
  loginText: {
    marginTop: SPACING.XXL,
    textAlign: "center",
    color: Colors.muted,
    fontSize: FONT_SIZES.BODY_S,
    lineHeight: FONT_SIZES.BODY_S * 1.5,
  },

  login: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
