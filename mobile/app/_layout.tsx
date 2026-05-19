import { AuthProvider } from "@/context/AuthContext";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./Header";
import Toast from "react-native-toast-message"

export default function Layout(){
    return(
        <>
        <Toast />
            <AuthProvider>
                <SafeAreaView style={{flex:1}}>
                    <Header />
                    <Slot />
                </SafeAreaView>
            </AuthProvider>
        </>
    )
}