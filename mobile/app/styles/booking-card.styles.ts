import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#18181b",
  },

  username: {
    marginTop: 4,
    color: "#71717a",
    marginBottom: 14,
  },

  section: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    color: "#52525b",
    marginBottom: 4,
  },

  value: {
    fontWeight: "600",
    color: "#18181b",
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  infoBox: {
    flex: 1,
    backgroundColor: "#f4f4f5",
    padding: 12,
    borderRadius: 12,
  },

  infoLabel: {
    fontSize: 12,
    color: "#71717a",
    marginBottom: 4,
  },

  infoText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18181b",
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  statusLabel: {
    marginRight: 8,
    fontWeight: "600",
    color: "#18181b",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  statusPending: {
    backgroundColor: "#facc15",
  },

  statusApproved: {
    backgroundColor: "#22c55e",
  },

  statusRejected: {
    backgroundColor: "#ef4444",
  },

  statusCancelled: {
    backgroundColor: "#6b7280",
  },

  statusText: {
    color: "#fff",
    fontWeight: "700",
    textTransform: "capitalize",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  approveButton: {
    backgroundColor: "#22c55e",
  },

  rejectButton: {
    backgroundColor: "#ef4444",
  },

  cancelButton: {
    backgroundColor: "#6b7280",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
});

export default styles;