import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({

    container: {
        marginTop: 24,
        backgroundColor: "#ffffff",
        borderRadius: 24,
        padding: 20,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,

        elevation: 4
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 20
    },

    group: {
        marginBottom: 18
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

    dateButton: {
        backgroundColor: "#f9fafb",
        borderWidth: 1,
        borderColor: "#e5e7eb",

        borderRadius: 16,

        padding: 16,

        marginBottom: 12
    },

    dateText: {
        color: "#111827",
        fontSize: 15,
        fontWeight: "500"
    },

    button: {
        marginTop: 12,

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
        opacity: 0.6
    },

    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700"
    },

    error: {
        color: "#dc2626",
        marginTop: 6,
        fontSize: 13
    },

    serverError: {
        backgroundColor: "#fee2e2",
        color: "#dc2626",

        padding: 12,
        borderRadius: 14,

        marginBottom: 18
    }
})