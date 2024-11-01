import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { Private } from "./pages/Private";
import Navbar from "./component/navbar";
import { Footer } from "./component/footer";
import injectContext from "./store/appContext";

const Layout = () => {
    const basename = process.env.BASENAME || "";
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Signup />} path="/Signup" />
                        <Route element={<Login onLogin={() => setIsAuthenticated(true)} />} path="/Login" />
                        <Route element={<Private />} path="/Private" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<h1>Not found!</h1>} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout); 