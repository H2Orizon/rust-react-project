import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f3f4f6"
    },

    card: {
        backgroundColor: "#ffffff",

        borderRadius: 28,

        padding: 24,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 6
        },
        shadowOpacity: 0.08,
        shadowRadius: 14,

        elevation: 6
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111827",

        marginBottom: 8
    },

    subtitle: {
        fontSize: 14,
        color: "#6b7280",

        marginBottom: 24
    },

    group: {
        marginBottom: 20
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#374151",

        marginBottom: 8
    },

    input: {
        backgroundColor: "#f9fafb",

        borderWidth: 1,
        borderColor: "#e5e7eb",

        borderRadius: 16,

        paddingHorizontal: 16,
        paddingVertical: 14,

        fontSize: 15,
        color: "#111827"
    },

    textarea: {
        minHeight: 120,
        textAlignVertical: "top"
    },

    error: {
        color: "#dc2626",
        marginTop: 6,
        fontSize: 13
    },

    serverError: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",

        padding: 14,

        borderRadius: 14,

        marginBottom: 20
    },

    button: {
        marginTop: 10,

        backgroundColor: "#007bff",

        borderRadius: 18,

        paddingVertical: 16,

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

    buttonDisabled: {
        opacity: 0.7
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700"
    }
})