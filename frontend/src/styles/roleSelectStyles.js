import { StyleSheet, Platform } from "react-native";
import { Colors } from "../constants/colors";
import {
  FONT_SIZES,
  SPACING,
  SHADOWS,
  IS_SMALL_DEVICE,
  IS_EXTRA_LARGE_DEVICE,
} from "../utils/responsiveDesign";

export const roleSelectStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.bg,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: IS_EXTRA_LARGE_DEVICE ? 600 : Platform.OS === "web" ? 420 : "100%",
    paddingHorizontal: SPACING.SCREEN_PADDING_H,
    paddingTop: IS_SMALL_DEVICE ? SPACING.XXXL : SPACING.XXXL,
    alignItems: "center",
  },

  logoCircle: {
    width: IS_SMALL_DEVICE ? 110 : 140,
    height: IS_SMALL_DEVICE ? 110 : 140,
    borderRadius: IS_SMALL_DEVICE ? 55 : 70,
    backgroundColor: "#070B1A",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.L,
    borderWidth: SPACING.M,
    borderColor: "#6366f1",
    ...SHADOWS.HEAVY,
  },

  title: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: SPACING.S,
  },

  subtitle: {
    color: Colors.muted,
    textAlign: "center",
    marginBottom: SPACING.XXXL,
    fontSize: FONT_SIZES.BODY_M,
    lineHeight: FONT_SIZES.BODY_M * 1.4,
  },

  card: {
    width: "100%",
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_L,
    padding: SPACING.L,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: Colors.border,
    ...SHADOWS.LIGHT,
  },

  iconCircle: {
    width: SPACING.XXXL,
    height: SPACING.XXXL,
    borderRadius: SPACING.RADIUS_M,
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.L,
  },

  cardTitle: {
    color: Colors.text,
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
    marginBottom: SPACING.S,
  },

  cardSub: {
    color: Colors.muted,
    fontSize: FONT_SIZES.BODY_S,
    lineHeight: FONT_SIZES.BODY_S * 1.4,
  },

  loginText: {
    color: Colors.muted,
    marginTop: SPACING.XXXL,
    fontSize: FONT_SIZES.BODY_S,
    textAlign: "center",
  },

  login: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
