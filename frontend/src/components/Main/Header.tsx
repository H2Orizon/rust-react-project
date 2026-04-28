import { Link } from "react-router-dom";
import "../../styles/layout.css";
import { useAuth } from "../../context/AuthContext";

export default function Header() {
    const {logout, user} = useAuth()

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
            to: `profile/${user?.id}`,
            show: !!user
        }
    ]

    return (
        <header className="header">
            <div className="header-container">

                <Link to="/" className="logo">
                    BookingApp
                </Link>
                
                <nav className="nav" >
                    {menu
                        .filter(iten => iten.show)
                        .map(item => (
                            <Link key={item.to} to={item.to}>{item.label}</Link>
                        ))
                    
                    }
                </nav>

                <div className="header-actions">
                    {user ? (
                        <button className="btn-danger" onClick={logout}>
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link to="/auth/login" className="btn-outline">
                                Login
                            </Link>
                            <Link to="/auth/register" className="btn-primary">
                                Register
                            </Link>
                        </>
                    )}
                    
                </div>

            </div>
        </header>
    );
}