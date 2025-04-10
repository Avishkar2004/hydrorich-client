import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { useLayoutEffect } from "react";


import Home from "../components/pages/Home";
import Header from "../components/Header";
import Footer from "../components/Footer"; // Make sure this exists
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import AboutUs from "../components/pages/AboutUs";
import Contact from "../components/pages/Contact";
import ProductDetails from "../components/pages/ProductsDetails.jsx";
import Products from "../components/pages/Products.jsx";

// Scroll to top on route change
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
};

const HomeWithExtras = () => (
    <>
        <BackgroundBeamsWithCollision />
    </>
);

const AppRoutes = () => {
    return (
        <Router>
            <Header />
            <ScrollToTop />
            <Routes>
                <Route element={<ScrollToTop />} />
                <Route path="/" element={<HomeWithExtras />} />
                <Route path="/home" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>

            <Footer />
        </Router>
    );
};

export default AppRoutes;
