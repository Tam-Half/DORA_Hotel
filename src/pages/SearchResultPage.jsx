// src/features/search/pages/SearchResultPage.jsx
import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { vi } from 'date-fns/locale';
import { Search, MapPin, Calendar, ChevronDown } from 'lucide-react'; // Bỏ import Users, Minus, Plus vì không dùng ở đây nữa

import FilterSidebar from '../components/FilterSidebar';
import RoomCard from '../components/searchroom/RoomCard';
import Container from '../components/layout/Container';

// --- MOCK DATA ---
const ROOMS_DATA = [
  { id: 1, name: 'Phòng Deluxe View Núi',maxAdults: 2, type: 'Deluxe King', image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop', rating: 4.8, reviewCount: 124, area: 35, bed: '1 King', capacity: '2 NL, 1 TE', price: 1200000, oldPrice: 1500000, discount: '-20%' },
  { id: 2, name: 'Phòng Suite Gia Đình',maxAdults: 4, type: 'Suite', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop', rating: 5.0, reviewCount: 85, area: 55, bed: '2 Queen', capacity: '4 Người', price: 2800000, oldPrice: null, discount: null },
  { id: 3, name: 'Phòng Đôi Tiêu Chuẩn',maxAdults: 7, type: 'Standard', image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=2070&auto=format&fit=crop', rating: 4.2, reviewCount: 203, area: 28, bed: '1 Queen', capacity: '2 Người', price: 850000, oldPrice: null, tag: 'BÁN CHẠY' },
  { id: 4, name: 'Phòng 2 Giường Đơn',maxAdults: 5, type: 'Standard', image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop', rating: 4.4, reviewCount: 98, area: 30, bed: '2 Single', capacity: '2 Người', price: 950000, oldPrice: null, tag: 'Free Wifi' },
  { id: 5, name: 'Penthouse Hoàng Gia', maxAdults: 4,type: 'Suite', image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop', rating: 5.0, reviewCount: 42, area: 120, bed: '2 King', capacity: '6 Người', price: 5500000, oldPrice: null, tag: 'PREMIUM' },
  { id: 6, name: 'Phòng Áp Mái Gỗ',maxAdults: 2, type: 'Standard', image: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=2070&auto=format&fit=crop', rating: 4.0, reviewCount: 56, area: 25, bed: '1 Queen', capacity: '2 Người', price: 750000, oldPrice: null, tag: null },
];

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

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      
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
              Tìm thấy <strong className="text-gray-900">{ROOMS_DATA.length}</strong> phòng phù hợp 
              {startDate && endDate && (
                 <span> cho <strong className="text-gray-900">{totalGuests} người</strong> từ <strong>{startDate.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}</strong> đến <strong>{endDate.toLocaleDateString('vi-VN', {day: '2-digit', month: '2-digit'})}</strong></span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ROOMS_DATA.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
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
    </div>
  );
}