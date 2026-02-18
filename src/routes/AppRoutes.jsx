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


import DashboardPage from "../pages/DashboardPage";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<Navigate to="/login" />} /> */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/rooms/:id" element={<RoomDetail />} />
                <Route path="/searchrooms" element={<SearchResultPage />} />
                <Route path="/user/historybooking" element={<BookingHistoryPage />} />
                <Route path="/admin/detailroom" element={<RoomManagePage />} />
                <Route path="/admin" element={<RoomMapPage />} />
                <Route path="/user/historybooking" element={<BookingHistoryPage />} />
                <Route path="/payment/success" element={<PaymentSuccessPage />} />
                <Route path="/payment/cancel" element={<PaymentCancelPage />} />
                {/* Có thể thêm route khác sau này */}
                <Route path="/admin/dashboard" element={<DashboardPage />} />

            </Routes>
        </BrowserRouter>
    );
}
