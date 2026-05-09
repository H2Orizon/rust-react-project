import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",

        borderBottomWidth: 1,
        borderBottomColor: "#eee"
    },

    topBar: {
        height: 70,

        paddingHorizontal: 20,

        flexDirection: "row",

        alignItems: "center",

        justifyContent: "space-between"
    },

    logo: {
        fontSize: 22,
        fontWeight: "700"
    },

    burgerButton: {
        width: 42,
        height: 42,

        borderRadius: 12,

        backgroundColor: "#f3f4f6",

        alignItems: "center",
        justifyContent: "center"
    },

    burgerText: {
        fontSize: 20
    },

    mobileMenu: {
        padding: 20,

        gap: 18,

        borderTopWidth: 1,
        borderTopColor: "#f3f4f6"
    },

    menuItem: {
        paddingVertical: 12,

        paddingHorizontal: 14,

        borderRadius: 12,

        backgroundColor: "#f8f8f8"
    },

    menuText: {
        fontSize: 16,
        fontWeight: "500"
    },

    logoutButton: {
        backgroundColor: "#ff4d4f",

        padding: 14,

        borderRadius: 12,

        alignItems: "center"
    },

    logoutText: {
        color: "white",
        fontWeight: "600"
    },

    authButtons: {
        gap: 12
    },

    loginButton: {
        backgroundColor: "#007bff",

        padding: 14,

        borderRadius: 12,

        alignItems: "center"
    },

    loginText: {
        color: "white",

        fontWeight: "600"
    },

    registerButton: {
        backgroundColor: "#f3f4f6",

        padding: 14,

        borderRadius: 12,

        alignItems: "center"
    },

    registerText: {
        fontWeight: "600"
    }
})