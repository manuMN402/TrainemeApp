import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import {
  FONT_SIZES,
  SPACING,
  SHADOWS,
  IS_EXTRA_LARGE_DEVICE,
} from "../utils/responsiveDesign";

export const userStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    paddingHorizontal: SPACING.SCREEN_PADDING_H,
    paddingVertical: SPACING.SCREEN_PADDING_V,
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

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: SPACING.L,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  cardRowLast: {
    paddingBottom: 0,
    borderBottomWidth: 0,
  },

  name: {
    color: Colors.text,
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "600",
    marginBottom: SPACING.S,
  },

  skill: {
    color: Colors.muted,
    marginTop: SPACING.S,
    fontSize: FONT_SIZES.BODY_S,
    lineHeight: FONT_SIZES.BODY_S * 1.4,
  },

  fee: {
    color: Colors.primary,
    marginTop: SPACING.M,
    fontWeight: "700",
    fontSize: FONT_SIZES.BODY_L,
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

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.L,
  },

  emptyStateText: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: FONT_SIZES.BODY_M * 1.5,
  },
});
