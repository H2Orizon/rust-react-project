import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({

    container: {
        width: "100%",
        backgroundColor: "#f9fafb",
        padding: 16,
    },

    tableContainer: {
        marginTop: 24,

        backgroundColor: "#fff",

        borderRadius: 20,

        overflow: "hidden",

        shadowColor: "#000",

        shadowOffset: {
            width: 0,
            height: 4,
        },

        shadowOpacity: 0.08,
        shadowRadius: 10,

        elevation: 4,
    },

    tableHeader: {
        flexDirection: "row",

        backgroundColor: "#111827",

        paddingVertical: 14,
        paddingHorizontal: 12,
    },

    headerText: {
        color: "#fff",

        fontSize: 14,
        fontWeight: "700",
    },

    idColumn: {
        flex: 1,
    },

    nameColumn: {
        flex: 2,
    },

    movableColumn: {
        flex: 2,
    },

    actionsColumn: {
        flex: 2,
        alignItems: "center",
    },

    tableRow: {
        flexDirection: "row",

        alignItems: "center",

        paddingVertical: 16,
        paddingHorizontal: 12,

        borderBottomWidth: 1,
        borderBottomColor: "#f3f4f6",

        backgroundColor: "#fff",
    },

    rowText: {
        fontSize: 14,
        color: "#111827",
    },

    categoryName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#111827",
    },

    movableBadge: {
        alignSelf: "flex-start",

        paddingHorizontal: 12,
        paddingVertical: 6,

        borderRadius: 999,
    },

    movableBadgeActive: {
        backgroundColor: "#dcfce7",
    },

    movableBadgeInactive: {
        backgroundColor: "#fee2e2",
    },

    movableTextActive: {
        color: "#166534",
        fontWeight: "700",
        fontSize: 13,
    },

    movableTextInactive: {
        color: "#b91c1c",
        fontWeight: "700",
        fontSize: 13,
    },

    actionButtons: {
        flexDirection: "row",
        gap: 10,
    },

    updateButton: {
        backgroundColor: "#2563eb",

        paddingVertical: 8,
        paddingHorizontal: 14,

        borderRadius: 12,
    },

    deleteButton: {
        backgroundColor: "#dc2626",

        paddingVertical: 8,
        paddingHorizontal: 14,

        borderRadius: 12,
    },

    actionButtonText: {
        color: "#fff",

        fontSize: 13,
        fontWeight: "700",
    },

    emptyContainer: {
        paddingVertical: 50,

        justifyContent: "center",
        alignItems: "center",
    },

    emptyTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",

        marginBottom: 8,
    },

    emptyText: {
        fontSize: 14,
        color: "#6b7280",
    },

    modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.45)",

    justifyContent: "center",
    alignItems: "center",

    padding: 20,

    position: "absolute",

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,

    zIndex: 1000,
},

modalContainer: {
    width: "100%",

    maxHeight: "90%",

    backgroundColor: "#fff",

    borderRadius: 24,

    overflow: "hidden",

    shadowColor: "#000",

    shadowOffset: {
        width: 0,
        height: 6,
    },

    shadowOpacity: 0.2,
    shadowRadius: 12,

    elevation: 8,
},

modalHeader: {
    flexDirection: "row",

    justifyContent: "space-between",
    alignItems: "center",

    paddingHorizontal: 20,
    paddingVertical: 18,

    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",

    backgroundColor: "#f9fafb",
},

modalTitle: {
    fontSize: 20,
    fontWeight: "700",

    color: "#111827",
},

closeButton: {
    width: 36,
    height: 36,

    borderRadius: 18,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#ef4444",
},

closeButtonText: {
    color: "#fff",

    fontSize: 18,
    fontWeight: "700",
},

modalContent: {
    padding: 20,
    maxHeight: "85%",
},

createButton: {
    backgroundColor: "#2563eb",

    paddingVertical: 14,
    paddingHorizontal: 20,

    borderRadius: 16,

    alignItems: "center",

    marginBottom: 20,

    shadowColor: "#2563eb",

    shadowOffset: {
        width: 0,
        height: 4,
    },

    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 5,
},

createButtonText: {
    color: "#fff",

    fontSize: 16,
    fontWeight: "700",
},
})