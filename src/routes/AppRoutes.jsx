import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoomDetail from "../pages/RoomDetail";
import SearchResultPage from "../pages/SearchResultPage";
import RoomManagePage from "../pages/RoomManagePage";
import RoomMapPage from "../pages/RoomMapPage";
import BookingHistoryPage from "../pages/BookingHistoryPage";
import HomePage from "../pages/HomePage";
export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<Navigate to="/login" />} /> */}
                 <Route path="/" element={<HomePage />} />
                <Route path="/rooms" element={<RoomDetail />} />
                <Route path="/searchrooms" element={<SearchResultPage />} />
                <Route path="/admin/detailroom" element={<RoomManagePage />} />
                <Route path="/admin" element={<RoomMapPage />} />
                <Route path="/user/historybooking" element={<BookingHistoryPage />} />
                {/* Có thể thêm route khác sau này */}
            </Routes>
        </BrowserRouter>
    ); 
}
