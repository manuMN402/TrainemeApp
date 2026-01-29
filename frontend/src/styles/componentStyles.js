import { StyleSheet } from "react-native";
import { Colors } from "../constants/colors";
import {
  FONT_SIZES,
  SPACING,
  DIMENSIONS,
  SHADOWS,
} from "../utils/responsiveDesign";

export const componentStyles = StyleSheet.create({
  /* CARD COMPONENTS */
  trainerCard: {
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_L,
    padding: SPACING.L,
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: Colors.border,
    ...SHADOWS.LIGHT,
  },

  trainerCardImage: {
    width: "100%",
    height: 200,
    borderRadius: SPACING.RADIUS_M,
    marginBottom: SPACING.M,
    backgroundColor: "#1E293B",
  },

  trainerCardName: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: SPACING.S,
  },

  trainerCardSpecialty: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    marginBottom: SPACING.M,
    lineHeight: FONT_SIZES.BODY_S * 1.4,
  },

  trainerCardPrice: {
    fontSize: FONT_SIZES.HEADING_S,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: SPACING.M,
  },

  trainerCardButton: {
    backgroundColor: Colors.primary,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    borderRadius: SPACING.RADIUS_M,
    alignItems: "center",
    ...SHADOWS.LIGHT,
  },

  trainerCardButtonText: {
    color: "#fff",
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
  },

  /* BOOKING CARD */
  bookingCard: {
    backgroundColor: Colors.card,
    borderRadius: SPACING.RADIUS_L,
    padding: SPACING.L,
    marginBottom: SPACING.L,
    borderWidth: 1,
    borderColor: Colors.border,
    ...SHADOWS.LIGHT,
  },

  bookingCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: SPACING.M,
    paddingBottom: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  bookingCardTitle: {
    fontSize: FONT_SIZES.BODY_L,
    fontWeight: "700",
    color: Colors.text,
  },

  bookingCardStatus: {
    fontSize: FONT_SIZES.BODY_XS,
    fontWeight: "700",
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderRadius: SPACING.RADIUS_S,
  },

  bookingCardStatusConfirmed: {
    backgroundColor: "#10b981",
    color: "#fff",
  },

  bookingCardStatusPending: {
    backgroundColor: "#f59e0b",
    color: "#fff",
  },

  bookingCardStatusCancelled: {
    backgroundColor: "#ef4444",
    color: "#fff",
  },

  bookingCardDetail: {
    fontSize: FONT_SIZES.BODY_S,
    color: Colors.muted,
    marginBottom: SPACING.S,
    lineHeight: FONT_SIZES.BODY_S * 1.4,
  },

  bookingCardActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.M,
    paddingTop: SPACING.M,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },

  bookingCardActionButton: {
    flex: 1,
    paddingVertical: SPACING.M,
    paddingHorizontal: SPACING.L,
    borderRadius: SPACING.RADIUS_M,
    alignItems: "center",
    marginHorizontal: SPACING.S,
  },

  /* MESSAGE/CHAT BUBBLE */
  chatBubble: {
    maxWidth: "80%",
    paddingHorizontal: SPACING.L,
    paddingVertical: SPACING.M,
    borderRadius: SPACING.RADIUS_L,
    marginVertical: SPACING.S,
  },

  chatBubbleSender: {
    backgroundColor: Colors.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: SPACING.RADIUS_S,
  },

  chatBubbleReceiver: {
    backgroundColor: Colors.card,
    alignSelf: "flex-start",
    borderBottomLeftRadius: SPACING.RADIUS_S,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  chatBubbleText: {
    fontSize: FONT_SIZES.BODY_M,
    lineHeight: FONT_SIZES.BODY_M * 1.4,
  },

  chatBubbleTextSender: {
    color: "#fff",
  },

  chatBubbleTextReceiver: {
    color: Colors.text,
  },

  chatBubbleTime: {
    fontSize: FONT_SIZES.BODY_XS,
    color: Colors.muted,
    marginTop: SPACING.S,
  },

  /* INPUT FIELD */
  inputField: {
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

  inputFieldError: {
    borderColor: "#ef4444",
    borderWidth: 1.5,
  },

  inputFieldValid: {
    borderColor: "#10b981",
    borderWidth: 1,
  },

  inputFieldText: {
    flex: 1,
    marginLeft: SPACING.M,
    fontSize: FONT_SIZES.BODY_M,
    color: Colors.text,
  },

  inputFieldIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },

  inputLabel: {
    fontSize: FONT_SIZES.LABEL,
    color: Colors.text,
    fontWeight: "600",
    marginBottom: SPACING.S,
  },

  inputError: {
    fontSize: FONT_SIZES.BODY_XS,
    color: "#ef4444",
    marginTop: SPACING.S,
  },

  /* LOGO COMPONENT */
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    /* resizeMode applied via Image component prop */
  },

  logoLarge: {
    width: 150,
    height: 150,
    borderRadius: 75,
    /* resizeMode applied via Image component prop */
  },

  logoSmall: {
    width: 80,
    height: 80,
    borderRadius: 40,
    /* resizeMode applied via Image component prop */
  },

  /* SEPARATOR/DIVIDER */
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: SPACING.L,
  },

  dividerThick: {
    height: 2,
    backgroundColor: Colors.border,
    marginVertical: SPACING.L,
  },

  /* LOADING SKELETON */
  skeleton: {
    backgroundColor: "#1E293B",
    borderRadius: SPACING.RADIUS_M,
    marginBottom: SPACING.L,
  },

  skeletonText: {
    height: FONT_SIZES.BODY_M,
    borderRadius: SPACING.RADIUS_S,
    backgroundColor: "#1E293B",
    marginBottom: SPACING.S,
  },

  /* ACCESSIBILITY */
  touchableOpacity: {
    opacity: 0.7,
  },

  focusedInput: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
});

export default componentStyles;
