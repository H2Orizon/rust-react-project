import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f7fb",
    },

    content: {
        padding: 16,
        paddingBottom: 40,
    },

    loaderContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f7fb",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#6b7280",
    },

    profileCard: {
        backgroundColor: "#fff",
        borderRadius: 24,
        padding: 24,
        alignItems: "center",
        marginBottom: 24,

        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: {
            width: 0,
            height: 4,
        },

        elevation: 3,
    },

    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: "#2563eb",

        justifyContent: "center",
        alignItems: "center",

        marginBottom: 16,
    },

    avatarText: {
        color: "#fff",
        fontSize: 34,
        fontWeight: "700",
    },

    username: {
        fontSize: 26,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 6,
    },

    email: {
        fontSize: 15,
        color: "#6b7280",
        marginBottom: 24,
    },

    infoContainer: {
        width: "100%",
        gap: 14,
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",

        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        color: "#6b7280",
    },

    value: {
        fontSize: 15,
        color: "#111827",
        fontWeight: "500",
    },

    status: {
        fontSize: 14,
        fontWeight: "700",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        overflow: "hidden",
    },

    active: {
        backgroundColor: "#dcfce7",
        color: "#166534",
    },

    inactive: {
        backgroundColor: "#fee2e2",
        color: "#991b1b",
    },

    tabsContainer: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 6,
        marginBottom: 20,

        shadowColor: "#000",
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: {
            width: 0,
            height: 2,
        },

        elevation: 2,
    },

    tabButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: "center",
    },

    activeTabButton: {
        backgroundColor: "#2563eb",
    },

    tabText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#6b7280",
    },

    activeTabText: {
        color: "#fff",
    },

    section: {
        marginBottom: 28,
    },

    sectionTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 14,
    },
})