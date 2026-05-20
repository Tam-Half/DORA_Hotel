import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoomDetail from "../pages/RoomDetail";
import SearchResultPage from "../pages/SearchResultPage";
import RoomManagePage from "../pages/RoomManagePage";
import RoomMapPage from "../pages/RoomMapPage";
import BookingHistoryPage from "../pages/BookingHistoryPage";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import PaymentCancelPage from "../pages/PaymentCancelPage";
import CheckoutPage from "../pages/CheckoutPage";
import CheckoutPageAdmin from "../pages/CheckoutPageAdmin";
import BookingPage from "../pages/BookingPage";
import AdminRoute from "../components/admin/routesadmin/AdminRoute"

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- CÁC ROUTE PUBLIC --- */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/rooms/:id" element={<RoomDetail />} />
                <Route path="/searchrooms" element={<SearchResultPage />} />
                <Route path="/user/historybooking" element={<BookingHistoryPage />} />
                <Route path="/payment/success" element={<PaymentSuccessPage />} />
                <Route path="/payment/cancel" element={<PaymentCancelPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />

                {/* --- CÁC ROUTE ADMIN --- */}
                <Route 
                    path="/admin" 
                    element={
                        <AdminRoute>
                            <RoomMapPage />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/admin/detailroom" 
                    element={
                        <AdminRoute>
                            <RoomManagePage />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/admin/bookings" 
                    element={
                        <AdminRoute>
                            <BookingPage />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/admin/dashboard" 
                    element={
                        <AdminRoute>
                            <DashboardPage />
                        </AdminRoute>
                    } 
                />
                <Route 
                    path="/admin/checkout/" 
                    element={
                        <AdminRoute>
                            <CheckoutPageAdmin />
                        </AdminRoute>
                    } 
                />
            </Routes>
        </BrowserRouter>
    );
}