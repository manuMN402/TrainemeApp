import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import {
  FONT_SIZES,
  SPACING,
  DIMENSIONS,
  SHADOWS,
  IS_EXTRA_LARGE_DEVICE,
  getGridColumns,
} from "../utils/responsiveDesign";

export const dashboardStyles = StyleSheet.create({
  /* SCREEN CONTAINERS */
  screen: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  safeContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  container: {
    flex: 1,
    paddingHorizontal: SPACING.SCREEN_PADDING_H,
    paddingVertical: SPACING.SCREEN_PADDING_V,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.XXL,
    paddingTop: SPACING.L,
  },

  headerTitle: {
    fontSize: FONT_SIZES.HEADING_L,
    fontWeight: "700",
    color: Colors.text,
  },

  headerSubtitle: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.muted,
    marginTop: SPACING.S,
  },

  /* TAB NAVIGATION */
  tabContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_L,
    padding: SPACING.S,
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  tab: {
    flex: 1,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    alignItems: "center",
    borderRadius: SPACING.RADIUS_M,
  },

  tabActive: {
    backgroundColor: Colors.primary,
  },

  tabText: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.muted,
    fontWeight: "600",
  },

  tabTextActive: {
    color: "#fff",
  },

  /* CARDS & LIST ITEMS */
  card: {
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_L,
    padding: SPACING.L,
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: Colors.border,
    ...SHADOWS.LIGHT,
  },

  cardCompact: {
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_M,
    padding: SPACING.M,
    marginBottom: SPACING.M,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  cardRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  cardRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },

  /* TEXT STYLES */
  cardTitle: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: SPACING.S,
  },

  cardSubtitle: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    marginBottom: SPACING.S,
    lineHeight: FONT_SIZES.BODY_S * 1.4,
  },

  label: {
    fontSize: FONT_SIZES.LABEL,
    color: Colors.text,
    fontWeight: "600",
    marginBottom: SPACING.S,
  },

  value: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.text,
    marginBottom: SPACING.M,
  },

  /* BADGES & TAGS */
  badge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderRadius: SPACING.RADIUS_S,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: FONT_SIZES.BODY_XS,
    color: "#fff",
    fontWeight: "700",
  },

  badgeSecondary: {
    backgroundColor: "#1E293B",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderRadius: SPACING.RADIUS_S,
  },

  badgeSecondaryText: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    fontWeight: "600",
  },

  /* BUTTONS */
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
    borderWidth: 2,
    borderColor: Colors.primary,
    marginTop: SPACING.L,
  },

  buttonSmall: {
    backgroundColor: Colors.primary,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    borderRadius: SPACING.RADIUS_M,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
  },

  buttonSecondaryText: {
    color: Colors.primary,
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
  },

  /* GRID & LIST */
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: SPACING.L,
  },

  gridItem: {
    width: IS_EXTRA_LARGE_DEVICE ? "31%" : "48%",
    marginBottom: SPACING.L,
  },

  listItem: {
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  listItemLast: {
    borderBottomWidth: 0,
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
    marginBottom: SPACING.L,
    minHeight: DIMENSIONS.INPUT_HEIGHT,
  },

  input: {
    flex: 1,
    marginLeft: SPACING.M,
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.text,
  },

  /* EMPTY STATE */
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.L,
  },

  emptyStateIcon: {
    fontSize: 48,
    marginBottom: SPACING.L,
  },

  emptyStateText: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: FONT_SIZES.BODY_M * 1.5,
  },

  /* MODAL/OVERLAY */
  modal: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: SPACING.RADIUS_XL,
    borderTopRightRadius: SPACING.RADIUS_XL,
    paddingHorizontal: SPACING.SCREEN_PADDING_H,
    paddingVertical: SPACING.XXL,
    paddingBottom: SPACING.XXXL,
  },

  modalHeader: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: SPACING.XXL,
  },

  /* PROFILE SECTION */
  profileContainer: {
    alignItems: "center",
    marginBottom: SPACING.XXXL,
  },

  profileAvatar: {
    width: IS_EXTRA_LARGE_DEVICE ? 120 : 100,
    height: IS_EXTRA_LARGE_DEVICE ? 120 : 100,
    borderRadius: IS_EXTRA_LARGE_DEVICE ? 60 : 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.L,
    ...SHADOWS.MEDIUM,
  },

  profileName: {
    fontSize: FONT_SIZES.HEADING_M,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: SPACING.S,
    textAlign: "center",
  },

  profileRole: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.muted,
    marginBottom: SPACING.M,
    textAlign: "center",
  },

  /* RATING */
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: SPACING.M,
  },

  star: {
    marginRight: SPACING.S,
  },

  ratingText: {
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.text,
    fontWeight: "600",
    marginLeft: SPACING.S,
  },

  /* ROW LAYOUTS */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  rowStart: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  /* SPACING UTILITIES */
  sectionSpacer: {
    height: SPACING.XXXL,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: SPACING.L,
  },
});

export default dashboardStyles;
