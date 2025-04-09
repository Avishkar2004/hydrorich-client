import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";

import Home from "../components/pages/Home";
import Header from "../components/Header";
import Footer from "../components/Footer"; // Make sure this exists
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import AboutUs from "../components/pages/AboutUs";
import Contact from "../components/pages/Contact";

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

// Common background beam only on home route
const HomeWithExtras = () => (
    <>
        <BackgroundBeamsWithCollision />
        {/* <Home /> */}
    </>
);

const AppRoutes = () => {
    return (
        <Router>
            <Header />
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomeWithExtras />} />
                {/* Add more routes below */}
                <Route path="/home" element={<Home />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default AppRoutes;
