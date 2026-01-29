import { StyleSheet, Dimensions } from "react-native";
import { Colors } from "../constants/colors";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  /* SCREEN */
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },

  container: {
    padding: 20,
    paddingTop: 60,
  },

  /* BACK */
  back: {
    color: Colors.muted,
    fontSize: 14,
    marginBottom: 20,
  },

  /* HEADER */
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.text,
  },

  subtitle: {
    fontSize: 14,
    color: Colors.muted,
    marginTop: 6,
    marginBottom: 24,
  },

  /* CARD */
  card: {
    backgroundColor: Colors.card,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  /* LABEL */
  label: {
    color: Colors.text,
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "500",
  },

  /* INPUT */
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111827",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#1E293B",
    marginBottom: 16,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: Colors.text,
  },

  /* BUTTON */
  button: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* LOGIN TEXT */
  loginText: {
    marginTop: 24,
    textAlign: "center",
    color: Colors.muted,
    fontSize: 13,
  },

  login: {
    color: Colors.primary,
    fontWeight: "600",
  },
});
