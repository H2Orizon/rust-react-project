import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: "#f3f4f6",
    },

    /* =========================
       SEARCH
    ========================= */

    searchContainer: {
        paddingHorizontal: 18,
        paddingTop: 18,
        paddingBottom: 10,
    },

    searchInput: {
        backgroundColor: "#ffffff",

        height: 58,

        borderRadius: 20,

        paddingHorizontal: 20,

        fontSize: 16,

        color: "#111827",

        borderWidth: 1,
        borderColor: "#e5e7eb",

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4
        },

        elevation: 3,
    },

    /* =========================
       PRICE FILTER
    ========================= */

    priceContainer: {
        flexDirection: "row",

        gap: 12,

        paddingHorizontal: 18,

        marginBottom: 14,
    },

    priceInput: {
        flex: 1,

        backgroundColor: "#fff",

        height: 52,

        borderRadius: 16,

        paddingHorizontal: 18,

        borderWidth: 1,
        borderColor: "#e5e7eb",

        fontSize: 15,

        shadowColor: "#000",
        shadowOpacity: 0.03,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 2
        },

        elevation: 1,
    },

    /* =========================
       CATEGORY
    ========================= */

    categoryContainer: {
        paddingHorizontal: 18,
        gap: 10,
        paddingBottom: 18,
    },

    categoryButton: {
        backgroundColor: "#ffffff",

        paddingHorizontal: 18,
        paddingVertical: 11,

        borderRadius: 999,

        borderWidth: 1,
        borderColor: "#e5e7eb",

        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2
        },

        elevation: 1,
    },

    categoryButtonActive: {
        backgroundColor: "#2563eb",
        borderColor: "#2563eb",
    },

    categoryText: {
        color: "#374151",
        fontWeight: "600",
        fontSize: 14,
    },

    categoryTextActive: {
        color: "#ffffff",
    },

    /* =========================
       RESOURCES
    ========================= */

    resourcesContainer: {
        paddingHorizontal: 18,
        paddingBottom: 20,
        gap: 18,
    },

    emptyText: {
        textAlign: "center",

        marginTop: 60,

        fontSize: 16,

        color: "#6b7280",

        fontWeight: "500",
    },

    /* =========================
       PAGINATION
    ========================= */

    paginationContainer: {
        flexDirection: "row",

        justifyContent: "center",
        alignItems: "center",

        gap: 18,

        paddingTop: 6,
        paddingBottom: 30,
    },

    paginationButton: {
        backgroundColor: "#2563eb",

        minWidth: 90,

        alignItems: "center",

        paddingVertical: 14,

        borderRadius: 16,

        shadowColor: "#2563eb",
        shadowOpacity: 0.25,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4
        },

        elevation: 3,
    },

    paginationButtonDisabled: {
        backgroundColor: "#9ca3af",

        shadowOpacity: 0,
        elevation: 0,
    },

    paginationText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 15,
    },

    pageText: {
        fontSize: 16,
        fontWeight: "700",
        color: "#111827",
    },
})