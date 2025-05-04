import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { useLayoutEffect } from "react";


import HomePage from "../components/pages/HomePage.jsx";
import Header from "../components/Header";
import Footer from "../components/Footer"; // Make sure this exists
import { BackgroundBeamsWithCollision } from "../components/ui/background-beams-with-collision";
import AboutUs from "../components/pages/AboutUs";
import Contact from "../components/pages/Contact";
import ProductDetails from "../components/pages/ProductsDetails.jsx";
import Products from "../components/pages/Products.jsx";
import Collection from "../components/ui/Collection.jsx";
import { Rotate3D } from "lucide-react";
import PgrList from "../components/pages/pgr/PgrList.jsx";
import CropList from "../components/pages/crop/CropList.jsx";
import CropOptions from "../components/pages/crop/CropOptions.jsx";
import SignUp from "../components/pages/SignUp.jsx";
import Login from "../components/pages/LogIn.jsx";

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
        <HomePage />
        <Collection />
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
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />

                {/* Crops */}
                <Route path="/crops" element={<CropList />} />
                <Route path="/crops/:name" element={<CropOptions />} />

                {/* For PGR */}
                <Route path="/pgr" element={<PgrList />} />
                <Route path="/pgr/:id" element={<ProductDetails />} />
            </Routes>

            <Footer />
        </Router>
    );
};

export default AppRoutes;
