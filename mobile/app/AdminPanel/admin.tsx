import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import CreateCategory from "./CreateCategory";

export default function AdminePanel(){
    const {user} = useAuth()

    if (!user || user.role !== "admine".toLowerCase()){
        router.push("/")
    }

    return(
        <CreateCategory />
    )
}