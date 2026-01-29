import { Dimensions, Platform } from "react-native";

const { width, height } = Dimensions.get("window");

/**
 * BREAKPOINTS for responsive design
 * - Small: < 375px (iPhone SE, small phones)
 * - Medium: 375-667px (iPhone 8, standard phones)
 * - Large: 668-896px (iPhone 12, larger phones)
 * - Extra Large: > 896px (Tablets, iPads)
 */
export const BREAKPOINTS = {
  SMALL: 375,
  MEDIUM: 375,
  LARGE: 668,
  EXTRA_LARGE: 896,
};

/**
 * SCREEN SIZES
 */
export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;
export const IS_SMALL_DEVICE = width < 375;
export const IS_MEDIUM_DEVICE = width >= 375 && width < 668;
export const IS_LARGE_DEVICE = width >= 668 && width < 896;
export const IS_EXTRA_LARGE_DEVICE = width >= 896;

/**
 * RESPONSIVE FONT SIZES
 * Auto-scales based on device width
 */
export const responsiveFontSize = (baseSize) => {
  const scalingFactor = width / 375; // Base reference width is 375px
  return baseSize * scalingFactor;
};

/**
 * PREDEFINED RESPONSIVE FONT SIZES
 */
export const FONT_SIZES = {
  // Headings
  HEADING_XL: responsiveFontSize(32), // Hero/Main title
  HEADING_L: responsiveFontSize(28), // Screen titles
  HEADING_M: responsiveFontSize(24), // Section titles
  HEADING_S: responsiveFontSize(20), // Subsection titles
  
  // Body text
  BODY_L: responsiveFontSize(16), // Primary body text
  BODY_M: responsiveFontSize(14), // Secondary body text
  BODY_S: responsiveFontSize(12), // Small text
  BODY_XS: responsiveFontSize(11), // Extra small text (labels, captions)

  // Labels
  LABEL: responsiveFontSize(13),
};

/**
 * RESPONSIVE SPACING
 * Scales padding, margins, and gaps
 */
export const responsiveSpacing = (baseSize) => {
  const scalingFactor = width / 375;
  return baseSize * scalingFactor;
};

/**
 * PREDEFINED SPACING VALUES
 */
export const SPACING = {
  // Padding & Margins
  XS: responsiveSpacing(4),     // 4px base
  S: responsiveSpacing(8),      // 8px base
  M: responsiveSpacing(12),     // 12px base
  L: responsiveSpacing(16),     // 16px base
  XL: responsiveSpacing(20),    // 20px base
  XXL: responsiveSpacing(24),   // 24px base
  XXXL: responsiveSpacing(32),  // 32px base

  // Screen padding
  SCREEN_PADDING_H: IS_EXTRA_LARGE_DEVICE ? responsiveSpacing(40) : responsiveSpacing(20),
  SCREEN_PADDING_V: responsiveSpacing(20),

  // Border radius
  RADIUS_S: responsiveSpacing(8),
  RADIUS_M: responsiveSpacing(14),
  RADIUS_L: responsiveSpacing(16),
  RADIUS_XL: responsiveSpacing(20),
  RADIUS_XXL: responsiveSpacing(22),
};

/**
 * RESPONSIVE DIMENSIONS
 */
export const DIMENSIONS = {
  // Button sizing
  BUTTON_HEIGHT: IS_SMALL_DEVICE ? responsiveSpacing(44) : responsiveSpacing(48),
  BUTTON_PADDING_H: responsiveSpacing(16),
  BUTTON_PADDING_V: responsiveSpacing(12),

  // Input sizing
  INPUT_HEIGHT: responsiveSpacing(48),
  INPUT_PADDING_H: responsiveSpacing(14),
  INPUT_PADDING_V: responsiveSpacing(14),

  // Icon sizing
  ICON_SMALL: 16,
  ICON_MEDIUM: 20,
  ICON_LARGE: 24,
  ICON_XL: 32,

  // Card sizing
  CARD_PADDING: responsiveSpacing(16),
  CARD_BORDER_RADIUS: responsiveSpacing(16),

  // Container max width (for tablets/desktop)
  CONTAINER_MAX_WIDTH: IS_EXTRA_LARGE_DEVICE ? 800 : "100%",
};

/**
 * LAYOUT HELPERS
 */
export const getFlexDirection = () => {
  // For very small screens, stack items vertically
  if (IS_SMALL_DEVICE) return "column";
  return "row"; // Default is row
};

export const getGridColumns = () => {
  // Number of columns for grid layouts
  if (IS_SMALL_DEVICE) return 1;
  if (IS_MEDIUM_DEVICE) return 2;
  if (IS_LARGE_DEVICE) return 3;
  return 4; // Extra large devices
};

export const getImageWidth = (maxWidth = width) => {
  const padding = SPACING.SCREEN_PADDING_H * 2;
  return Math.min(maxWidth - padding, DIMENSIONS.CONTAINER_MAX_WIDTH);
};

/**
 * PLATFORM-SPECIFIC HELPERS
 */
export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";

/**
 * SAFE AREA PADDING (for notches, status bar)
 */
export const getSafePadding = () => ({
  paddingTop: isIOS ? 0 : 0,
  paddingBottom: 0,
  paddingHorizontal: SPACING.SCREEN_PADDING_H,
});

/**
 * RESPONSIVE SHADOW (depth styling)
 */
export const SHADOWS = {
  LIGHT: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  MEDIUM: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  HEAVY: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};

export default {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  IS_SMALL_DEVICE,
  IS_MEDIUM_DEVICE,
  IS_LARGE_DEVICE,
  IS_EXTRA_LARGE_DEVICE,
  FONT_SIZES,
  SPACING,
  DIMENSIONS,
  SHADOWS,
  responsiveFontSize,
  responsiveSpacing,
  getFlexDirection,
  getGridColumns,
  getImageWidth,
  isIOS,
  isAndroid,
  getSafePadding,
};
