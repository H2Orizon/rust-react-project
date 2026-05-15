import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9fafb",
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        fontSize: 18,
        color: "#6b7280",
    },

    error: {
        backgroundColor: "#fee2e2",
        color: "#b91c1c",
        padding: 12,
        margin: 16,
        borderRadius: 12,
        fontSize: 14,
    },

    imagePlaceholder: {
        height: 250,
        backgroundColor: "#e5e7eb",
        justifyContent: "center",
        alignItems: "center",
    },

    imageText: {
        fontSize: 18,
        color: "#6b7280",
    },

    content: {
        padding: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 16,
    },

    infoContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },

    infoTag: {
        backgroundColor: "#e0e7ff",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
    },

    infoText: {
        color: "#3730a3",
        fontSize: 14,
        fontWeight: "500",
    },

    available: {
        color: "#166534",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 16,
    },

    unavailable: {
        color: "#b91c1c",
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 16,
        lineHeight: 24,
    },

    description: {
        fontSize: 16,
        lineHeight: 26,
        color: "#374151",
        marginBottom: 30,
    },

    deleteButton: {
        backgroundColor: "#dc2626",
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: "center",
    },

    deleteButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    actionGroup: {
    marginTop: 24,
    gap: 14
},

updateButton: {
    height: 54,

    borderRadius: 16,

    backgroundColor: "#007bff",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#007bff",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: {
        width: 0,
        height: 4
    },

    elevation: 5
},

updateButtonText: {
    color: "white",

    fontSize: 16,
    fontWeight: "700"
},

modalOverlay: {
    flex: 1,

    backgroundColor: "rgba(0,0,0,0.45)",

    justifyContent: "center",

    padding: 16
},

modalContainer: {
    maxHeight: "92%",

    backgroundColor: "white",

    borderRadius: 24,

    overflow: "hidden"
},

modalHeader: {
    paddingHorizontal: 22,
    paddingVertical: 18,

    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
},

modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827"
},

modalClose: {
    fontSize: 22,
    fontWeight: "700",
    color: "#6b7280"
},

bookButton: {
    marginTop: 24,

    backgroundColor: "#007bff",

    paddingVertical: 16,

    borderRadius: 18,

    alignItems: "center",

    shadowColor: "#007bff",
    shadowOffset: {
        width: 0,
        height: 6
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,

    elevation: 5
},

bookButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700"
},

carouselContainer: {
    position: "relative",
    width: "100%",
    height: 260,
    marginBottom: 16,
},

carouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
},

carouselButton: {
    position: "absolute",
    top: "45%",
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
},

carouselLeft: {
    left: 12,
},

carouselRight: {
    right: 12,
},

carouselButtonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
},

dotsContainer: {
    position: "absolute",
    bottom: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
},

dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.5)",
},

activeDot: {
    backgroundColor: "#fff",
},

})