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
  container: {
    flex: 1,
    backgroundColor: "#070B1A",
  },

  /* HEADER */
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E293B",
  },

  backButton: {
    padding: 8,
  },

  /* SCROLL CONTENT */
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  /* TITLE SECTION */
  titleSection: {
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },

  /* FORM CONTAINER */
  formContainer: {
    marginBottom: 24,
  },

  /* INPUT GROUP */
  inputGroup: {
    marginBottom: 16,
  },

  label: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#1a1d2e",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#333",
    fontSize: 14,
    color: "white",
    minHeight: 48,
  },

  inputError: {
    borderColor: "#ef4444",
    backgroundColor: "#1a1d2e",
  },

  errorText: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
  },

  /* PASSWORD INPUT */
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1d2e",
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#333",
    minHeight: 48,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "white",
  },

  /* PASSWORD STRENGTH */
  strengthContainer: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },

  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginRight: 8,
  },

  strengthText: {
    fontSize: 12,
    fontWeight: "600",
  },

  /* BUTTON */
  button: {
    backgroundColor: "#8b5cf6",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    minHeight: 48,
    justifyContent: "center",
    marginTop: 24,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  /* LOGIN LINK */
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },

  loginLinkText: {
    color: "#999",
    fontSize: 14,
  },

  loginLink: {
    color: "#8b5cf6",
    fontWeight: "600",
    fontSize: 14,
  },
});
