import { AuthProvider } from "@/context/AuthContext";
import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "./Header";

export default function Layout(){
    return(
        <AuthProvider>
            <SafeAreaView style={{flex:1}}>
                <Header />
                <Slot />
            </SafeAreaView>
        </AuthProvider>
    )
}