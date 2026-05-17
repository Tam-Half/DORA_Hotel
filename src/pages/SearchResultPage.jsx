import React, { useState, useEffect, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { vi } from 'date-fns/locale';
import { Search, MapPin, Calendar, ChevronDown, Bed, Loader2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import FilterSidebar from '../components/FilterSidebar';
import RoomCard from '../components/searchroom/RoomCard';
import Container from '../components/layout/Container';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { roomTypeApi } from '../services/roomType';
import { useSearchAvailabilityMutation } from '../services/availability';
import { toast } from 'react-toastify';

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
  const location = useLocation();
  const initialResults = location.state?.results;
  const initialParams = location.state?.searchParams;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 3);

  // --- STATE ---
  const [dateRange, setDateRange] = useState(
    initialParams
      ? [new Date(initialParams.checkIn), new Date(initialParams.checkOut)]
      : [tomorrow, dayAfterTomorrow]
  );
  const [startDate, endDate] = dateRange;
  const [roomsCount, setRoomsCount] = useState(initialParams?.rooms || 1);

  const [rooms, setRooms] = useState(initialResults || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- FILTER STATE ---
  const [filters, setFilters] = useState({
    price: 3000000, // Default max price
    roomTypes: [], // Selected room type names
    amenities: [],
    rating: 0
  });

  const [searchAvailability, { isLoading: searchLoading }] = useSearchAvailabilityMutation();

  // RTK Query for all rooms (if no initial results)
  const {
    data: allRoomsResponse,
    isLoading: allRoomsLoading,
    error: allRoomsError
  } = roomTypeApi.useGetAllRoomTypesQuery(undefined, {
    skip: !!initialResults
  });

  useEffect(() => {
    if (initialResults) {
      setRooms(initialResults);
    } else if (allRoomsResponse?.data) {
      setRooms(allRoomsResponse.data);
    }
  }, [initialResults, allRoomsResponse]);

  useEffect(() => {
    if (allRoomsError) {
      setError('Không thể tải danh sách phòng. Vui lòng thử lại sau.');
    }
  }, [allRoomsError]);

  const isLoading = loading || searchLoading || allRoomsLoading;

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.warning("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }

    try {
      setLoading(true);
      const searchParams = {
        checkIn: startDate.toISOString(),
        checkOut: endDate.toISOString(),
        rooms: parseInt(roomsCount)
      };

      const result = await searchAvailability(searchParams).unwrap();
      setRooms(result.availableRoomTypes || []);
      setError(null);
    } catch (err) {
      console.error("Search Error:", err);
      toast.error(err?.data?.message || "Có lỗi xảy ra khi tìm kiếm phòng.");
    } finally {
      setLoading(false);
    }
  };

  // --- FILTERING LOGIC ---
  const filteredRooms = rooms.filter(room => {
    const price = room.basePrice || room.base_price || 0;
    const matchesPrice = price <= filters.price;
    const matchesType = filters.roomTypes.length === 0 ||
      filters.roomTypes.includes(room.name);
    const matchesRating = (room.average_rating || 0) >= filters.rating;

    // For amenities, assuming room.amenities is an array of strings or objects
    const roomAmenities = room.amenities || [];
    const matchesAmenities = filters.amenities.length === 0 ||
      filters.amenities.every(a =>
        roomAmenities.some(ra => (typeof ra === 'string' ? ra : ra.name) === a)
      );

    return matchesPrice && matchesType && matchesRating && matchesAmenities;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      price: 5000000,
      roomTypes: [],
      amenities: [],
      rating: 0
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <Header />
      {/* --- HEADER TÌM KIẾM --- */}
      <div className="bg-white sticky top-0 z-30">
        <Container>
          <div className="py-4">
            {/* SEARCH BAR CONTAINER */}
            <div className="bg-gray-100 rounded-lg p-1.5 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-0">
              {/* INPUT GROUPS */}
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
                    onChange={(update) => {
                      const [start, end] = update;
                      if (start && end && start.getTime() === end.getTime()) {
                        const nextDay = new Date(start);
                        nextDay.setDate(nextDay.getDate() + 1);
                        setDateRange([start, nextDay]);
                      } else {
                        setDateRange(update);
                      }
                    }}
                    locale={vi}
                    dateFormat="dd/MM"
                    minDate={tomorrow}
                    customInput={<CustomDateInput />}
                    monthsShown={2}
                    withPortal
                    popperPlacement="bottom-start"
                    className="w-full"
                  />
                </div>

                <div className="w-px h-6 bg-gray-300 hidden md:block"></div>

                {/* 3. ROOM COUNT */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-200 transition min-w-fit cursor-pointer">
                  <Bed size={18} className="text-gray-500" />
                  <select
                    value={roomsCount}
                    onChange={(e) => setRoomsCount(e.target.value)}
                    className="bg-transparent font-medium text-gray-700 text-sm focus:outline-none cursor-pointer appearance-none"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} phòng</option>
                    ))}
                  </select>

                </div>
              </div>

              {/* SEARCH BUTTON */}
              <button
                onClick={handleSearch}
                disabled={loading || searchLoading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md text-sm font-bold flex items-center gap-2 transition w-full md:w-auto justify-center shadow-md shadow-blue-200 active:scale-95 disabled:opacity-70"
              >
                {loading || searchLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                <span>Tìm kiếm</span>
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
              Tìm thấy <strong className="text-gray-900">{filteredRooms.length}</strong> phòng phù hợp
              {startDate && endDate && (
                <span> từ <strong>{startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</strong> đến <strong>{endDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</strong></span>
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
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              availableRoomTypes={[...new Set(rooms.map(r => r.name).filter(Boolean))]}
            />
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
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Thử lại
                </button>
              </div>
            ) : filteredRooms.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg">Không tìm thấy phòng nào phù hợp với bộ lọc của bạn.</p>
                <button onClick={handleResetFilters} className="text-blue-600 font-medium hover:underline mt-2">Xóa tất cả bộ lọc</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRooms.map((room) => (
                  <RoomCard
                    key={room.roomTypeId || room.id}
                    room={room}
                    startDate={startDate}
                    endDate={endDate}
                  />
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
