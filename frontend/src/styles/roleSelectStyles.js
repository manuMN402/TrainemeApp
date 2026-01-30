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
    width: IS_EXTRA_LARGE_DEVICE ? 600 : Platform.OS === "web" ? 420 : "90%",
    maxWidth: 500,
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.XL,
    paddingTop: IS_SMALL_DEVICE ? SPACING.L : SPACING.XL,
    paddingBottom: SPACING.XL,
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
    marginBottom: SPACING.XL,
    fontSize: FONT_SIZES.BODY_M,
    lineHeight: FONT_SIZES.BODY_M * 1.5,
    fontWeight: "500",
  },

  card: {
    width: "100%",
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_L,
    padding: SPACING.M,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.M,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    ...SHADOWS.LIGHT,
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: SPACING.RADIUS_M,
    backgroundColor: "#1f2937",
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.M,
    flexShrink: 0,
  },

  cardTitle: {
    color: Colors.text,
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
    marginBottom: SPACING.XS,
  },

  cardSub: {
    color: Colors.muted,
    fontSize: FONT_SIZES.BODY_S,
    lineHeight: FONT_SIZES.BODY_S * 1.5,
    flex: 1,
    flexWrap: "wrap",
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
