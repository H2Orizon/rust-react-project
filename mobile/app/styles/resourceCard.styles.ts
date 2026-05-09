import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 16,

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,

        elevation: 4,
    },

    imagePlaceholder: {
        height: 180,
        backgroundColor: "#e5e7eb",
        justifyContent: "center",
        alignItems: "center",
    },

    imageText: {
        color: "#6b7280",
        fontSize: 16,
    },

    content: {
        padding: 16,
    },

    title: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 12,
        color: "#111827",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    price: {
        fontSize: 18,
        fontWeight: "700",
        color: "#2563eb",
    },

    capacity: {
        fontSize: 16,
        color: "#374151",
    },

    tags: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    tag: {
        backgroundColor: "#f3f4f6",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
    },

    tagText: {
        fontSize: 13,
        color: "#374151",
    },
})

export default styles