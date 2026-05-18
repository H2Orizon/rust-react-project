import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f4f4f5",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 24,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
    color: "#18181b",
  },

  group: {
    marginBottom: 18,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#18181b",
  },

  input: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 10,
  },

  pickerWrapper: {
    backgroundColor: "#f4f4f5",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },

  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  errorText: {
    color: "#dc2626",
    marginBottom: 10,
    fontSize: 13,
  },

  serverError: {
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 12,
    fontSize: 14,
  },

  locationText: {
    marginTop: 8,
    color: "#6b7280",
  },
});