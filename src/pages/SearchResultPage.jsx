import React, { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { vi } from 'date-fns/locale';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react'; // Bỏ import Users, Minus, Plus vì không dùng ở đây nữa

import FilterSidebar from '../components/FilterSidebar';
import RoomCard from '../components/searchroom/RoomCard';
import Container from '../components/layout/Container';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import roomTypeAPI from '../services/roomType';
import { Loader2 } from 'lucide-react';

// --- MOCK DATA ---
// Removed ROOMS_DATA as it will be replaced by API data

// Custom Input cho DatePicker
const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 px-3 py-2 rounded-md transition select-none h-full"
  >
    <Calendar size={18} className="text-gray-500" />
    <span className="whitespace-nowrap font-medium text-gray-700 text-sm">
      {value || "Chọn ngày"}
    </span>
  </div>
));

export default function SearchResultPage() {
  // --- STATE ---
  const [dateRange, setDateRange] = useState([new Date(), new Date(new Date().setDate(new Date().getDate() + 2))]);
  const [startDate, endDate] = dateRange;

  // State quản lý khách vẫn giữ ở đây để hiển thị Total Summary
  const [guests, setGuests] = useState({ adults: 2, children: 0 });
  const totalGuests = guests.adults + guests.children;

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await roomTypeAPI.getAll();
        setRooms(response.data || []);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
        setError('Không thể tải danh sách phòng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header />
      {/* --- HEADER TÌM KIẾM --- */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <Container>

          <div className="py-4">

            {/* SEARCH BAR CONTAINER */}
            <div className="bg-gray-100 rounded-lg p-1.5 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">

              {/* INPUT GROUPS - ĐÃ BỎ PHẦN CHỌN USER */}
              <div className="flex items-center gap-2 md:gap-4 px-2 md:px-4 text-sm text-gray-700 w-full md:w-auto overflow-x-auto no-scrollbar">

                {/* 1. LOCATION */}
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 px-3 py-2 rounded-md transition min-w-fit h-full">
                  <MapPin size={18} className="text-gray-500" />
                  <span className="font-medium text-gray-700">Vũng Tàu</span>
                </div>

                <div className="w-px h-6 bg-gray-300 hidden md:block"></div>

                {/* 2. DATE PICKER */}
                <div className="min-w-fit">
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => setDateRange(update)}
                    locale={vi}
                    dateFormat="dd/MM"
                    minDate={new Date()}
                    customInput={<CustomDateInput />}
                    monthsShown={2}
                    withPortal
                    popperPlacement="bottom-start"
                    className="w-full"
                  />
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition w-full md:w-auto justify-center shadow-md shadow-blue-200 active:scale-95">
                <Search size={16} />
                <span className="md:hidden">Tìm kiếm</span>
                <span className="hidden md:inline">Tìm kiếm</span>
              </button>

            </div>
          </div>
        </Container>
      </div>

      {/* --- MAIN CONTENT --- */}
      <Container>
        {/* Breadcrumb & Title */}
        <div className="py-6">
          <p className="text-sm text-gray-500 mb-2">Trang chủ / Kết quả tìm kiếm</p>
          <h1 className="text-2xl font-bold text-gray-900">Kết quả tìm kiếm</h1>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-2 gap-4">
            <p className="text-gray-600">
              Tìm thấy <strong className="text-gray-900">{rooms.length}</strong> phòng phù hợp
              {startDate && endDate && (
                <span> cho <strong className="text-gray-900">{totalGuests} người</strong> từ <strong>{startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</strong> đến <strong>{endDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</strong></span>
              )}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sắp xếp theo:</span>
              <div className="bg-white border border-gray-300 px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 cursor-pointer hover:border-blue-500">
                Đề xuất <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* --- GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="hidden lg:block lg:col-span-1">
            {/* TRUYỀN PROPS XUỐNG SIDEBAR */}
            <FilterSidebar guests={guests} setGuests={setGuests} />
          </div>
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium text-lg">Đang tìm kiếm phòng tốt nhất cho bạn...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-red-100">
                <p className="text-red-500 font-medium mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Thử lại
                </button>
              </div>
            ) : rooms.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg">Không tìm thấy phòng nào phù hợp với yêu cầu của bạn.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            )}
            <div className="flex justify-center mt-10 gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 hover:bg-gray-50 text-gray-600">«</button>
              <button className="w-10 h-10 flex items-center justify-center rounded bg-blue-500 text-white font-bold">1</button>
              <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 hover:bg-gray-50 text-gray-600">2</button>
              <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
              <button className="w-10 h-10 flex items-center justify-center rounded bg-white border border-gray-200 hover:bg-gray-50 text-gray-600">»</button>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </div>
  );
}