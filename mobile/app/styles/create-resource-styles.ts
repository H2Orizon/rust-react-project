import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({

    container: {
        padding: 20
    },

    card: {
        backgroundColor: "white",

        borderRadius: 28,

        padding: 22,

        gap: 18,

        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 20,

        elevation: 4
    },

    title: {
        fontSize: 30,
        fontWeight: "700",
        marginBottom: 6,
        color: "#111827"
    },

    subtitle: {
        color: "#6b7280",
        fontSize: 14
    },

    group: {
        gap: 8
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#111827"
    },

    input: {
        height: 54,

        borderWidth: 1,
        borderColor: "#e5e7eb",

        borderRadius: 16,

        paddingHorizontal: 16,

        backgroundColor: "#fafafa",

        fontSize: 15,

        color: "#111827"
    },

    textarea: {
        minHeight: 120,

        paddingTop: 14,

        textAlignVertical: "top"
    },

    row: {
        flexDirection: "row",
        gap: 14
    },

    flex: {
        flex: 1,
        gap: 8
    },

    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#e5e7eb",

        borderRadius: 16,

        overflow: "hidden",

        backgroundColor: "#fafafa"
    },

    switchCard: {
        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between",

        padding: 16,

        borderRadius: 18,

        backgroundColor: "#f9fafb"
    },

    switchTitle: {
        fontWeight: "700",
        marginBottom: 4,
        color: "#111827"
    },

    switchText: {
        color: "#6b7280",
        fontSize: 13
    },

    button: {
        height: 56,

        borderRadius: 18,

        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "#007bff",

        shadowColor: "#007bff",
        shadowOpacity: 0.3,
        shadowRadius: 18,

        elevation: 4
    },

    buttonText: {
        color: "white",

        fontSize: 16,

        fontWeight: "700"
    },

    errorBox: {
        backgroundColor: "rgba(239,68,68,0.1)",

        borderRadius: 14,

        padding: 14
    },

    errorText: {
        color: "#dc2626",
        fontWeight: "600"
    },

    fieldError: {
        color: "#dc2626",
        fontSize: 13,
        fontWeight: "500"
    }
})