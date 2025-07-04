import React, { useEffect } from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { useLayoutEffect } from "react";
import { useAuth } from "../hooks/useAuth";

import HomePage from "../components/ui/HomePage.jsx";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AboutUs from "../components/pages/AboutUs";
import Contact from "../components/pages/Contact";
import Collection from "../components/ui/Collection.jsx";
import { Rotate3D } from "lucide-react";
import PgrList from "../components/pages/pgr/PgrList.jsx";
import OrganicList from "../components/pages/organicproduct/OrganicList.jsx"
import OrganicDetails from "../components/pages/organicproduct/OrganicDetails.jsx"
import CropList from "../components/pages/crop/CropList.jsx";
import CropOptions from "../components/pages/crop/CropOptions.jsx";
import SignUp from "../components/pages/SignUp.jsx";
import Login from "../components/pages/Login.jsx";
import Cart from "../components/pages/Cart.jsx";
import Wishlist from "../components/pages/Wishlist.jsx";
import Profile from "../components/pages/Profile.jsx";
import MicronutrientsList from "../components/pages/micronutrients/MicronutrientsList.jsx";
import InsecticideList from "../components/pages/Insecticide/InsecticideList.jsx";
import FungicideList from "../components/pages/fungicide/FungicideList.jsx";
import Checkout from "../components/pages/Checkout.jsx";
import OrderSuccess from "../components/pages/OrderSuccess.jsx";
import Orders from "../components/pages/Orders.jsx";
import ReviewableOrders from "../components/pages/ReviewableOrders.jsx";
import PgrDetails from "../components/pages/pgr/PgrDetails.jsx";
import MicroNutrientDetails from "../components/pages/micronutrients/MicroNutrientDetails.jsx";
import InsecticideDetails from "../components/pages/Insecticide/InsecticideDetails.jsx";
import FungicideDetails from "../components/pages/fungicide/FungicideDetails.jsx";
import Settings from "../components/pages/Settings.jsx";
import AllProducts from "../components/pages/AllProducts.jsx";
import AllProductDetail from "../components/pages/AllProductDetail.jsx";
import FAQ from "../components/pages/FAQ.jsx";
import Dashboard from "../components/admin/Dashboard.jsx";
import AddProduct from "../components/admin/AddProduct.jsx";
import ProtectedAdminRoute from "../components/admin/ProtectedAdminRoute.jsx";
import AdminAllProducts from "../components/admin/AdminAllProducts.jsx";
import OrderTracking from '../components/pages/OrderTracking';
import SustainabilityTips from "../components/ui/SustainabilityTips.jsx";
import Messenger from "../components/Messenger.jsx";
import AdminMessenger from "../components/admin/AdminMessenger.jsx";
import MessageBox from "../components/ui/MessageBox.jsx";

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
        <MessageBox />
        <SustainabilityTips />
    </>
);

const AppRoutes = () => {
    const { checkAuth } = useAuth();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <Router>
            <Header />
            <ScrollToTop />
            <Routes>
                <Route element={<ScrollToTop />} />
                <Route path="/" element={<HomeWithExtras />} />

                {/* Admin Routes */}
                <Route element={<ProtectedAdminRoute />}>
                    <Route path="/admin" element={<Dashboard />} />
                    <Route path="/admin/add-product" element={<AddProduct />} />
                    <Route path="/admin/all-products" element={<AdminAllProducts />} />
                    <Route path="/admin/messages" element={<AdminMessenger />} />
                </Route>

                <Route path="/products" element={<AllProducts />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/reviewable-orders" element={<ReviewableOrders />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/order-tracking/:orderId" element={<OrderTracking />} />
                <Route path="/messages" element={<Messenger />} />

                <Route path="/products/:id" element={<AllProductDetail />} />
                {/* Crops */}
                <Route path="/crops" element={<CropList />} />
                <Route path="/crops/:name" element={<CropOptions />} />

                {/* For PGR */}
                <Route path="/pgrs" element={<PgrList />} />
                <Route path="/pgrs/:id" element={<PgrDetails />} />

                {/* For organic products */}
                <Route path="/organicproducts" element={<OrganicList />} />
                <Route path="/organicproducts/:id" element={<OrganicDetails />} />

                {/* For micronutrients */}
                <Route path="micronutrients" element={<MicronutrientsList />} />
                <Route path="/micronutrients/:id" element={<MicroNutrientDetails />} />

                {/* For insecticides */}
                <Route path="/insecticides" element={<InsecticideList />} />
                <Route path="/insecticides/:id" element={<InsecticideDetails />} />

                {/* For fungicides */}
                <Route path="/fungicides" element={<FungicideList />} />
                <Route path="/fungicides/:id" element={<FungicideDetails />} />

                <Route path="/faq" element={<FAQ />} />
            </Routes>

            <Footer />
        </Router>
    );
};

export default AppRoutes;