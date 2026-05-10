import { useState } from "react"
import {View,Text,TouchableOpacity} from "react-native"
import { Link } from "expo-router"
import { useAuth } from "@/context/AuthContext"
import { styles } from "./styles/header.styles"

export default function Header() {

    const { logout, user } = useAuth()

    const [menuOpen, setMenuOpen] = useState(false)

    const menu = [
        {
            label: "Create Resource",
            to: "/resources/create",
            show: !!user
        },
        {
            label: "Admin panel",
            to: "/admin",
            show: !!user
        },
        {
            label: "Profile",
            to: `/profile/${user?.id}`,
            show: !!user
        }
    ]

    return (
        <View style={styles.container}>

            <View style={styles.topBar}>

                <Link href={"/"}>
                    <Text style={styles.logo}>
                        Booking App
                    </Text>
                </Link>

                <TouchableOpacity
                    onPress={() =>setMenuOpen(!menuOpen)}
                    style={styles.burgerButton}
                >

                    <Text style={styles.burgerText}>
                        ☰
                    </Text>

                </TouchableOpacity>

            </View>

            {menuOpen && (

                <View style={styles.mobileMenu}>

                    {menu
                        .filter(item => item.show)
                        .map(item => (
                            <Link key={item.to}href={item.to as any} asChild>
                                <TouchableOpacity style={styles.menuItem}>
                                    <Text style={styles.menuText}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            </Link>

                        ))}

                    {user ? (
                        <TouchableOpacity onPress={logout} 
                            style={ styles.logoutButton}
                        >
                            <Text style={styles.logoutText}>
                                Logout
                            </Text>

                        </TouchableOpacity>

                    ) : (

                        <View style={styles.authButtons}> 
                            <Link href={"/user/login"} asChild>
                                <TouchableOpacity style={styles.loginButton}>
                                    <Text style={ styles.loginText}>
                                        Login
                                    </Text>

                                </TouchableOpacity>

                            </Link>

                            <Link href={"/user/register"} asChild>

                                <TouchableOpacity style={styles.registerButton}>
                                    <Text style={styles.registerText}>
                                        Register
                                    </Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}