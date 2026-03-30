import Header from "../components/Main/Header";
import Footer from "../components/Main/Footer";
import { Outlet } from "react-router";

export default function MainLayout() {
    return (
        <>
            <Header />

            <main className="page-container">
                <Outlet />
            </main>

            <Footer />
        </>
    );
}