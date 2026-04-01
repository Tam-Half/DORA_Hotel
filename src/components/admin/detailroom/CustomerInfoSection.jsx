import React, { useState, forwardRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Search, Calendar, Users, ChevronLeft, ChevronRight, Filter, Clock, CheckCircle, Hourglass } from 'lucide-react';
import roomAPI from '../../../services/room'; // Đảm bảo đường dẫn đúng
import BookingDetailModal from '../Model/BookingModalDetail'; // Đảm bảo đường dẫn đúng

const ITEMS_PER_PAGE = 5;

const DateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="relative w-full">
    <input type="text" onClick={onClick} ref={ref} value={value} placeholder={placeholder} readOnly className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer bg-white" />
    <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
  </div>
));

export default function CustomerInfoSection({ room }) {
  console.log('Received room prop in CustomerInfoSection:', room);

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // State phân trang & lọc
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'CURRENT' | 'FUTURE' | 'PAST'
  const [loading, setLoading] = useState(false);

  // Dữ liệu đã được làm phẳng (gộp tất cả lại thành 1 mảng để dễ filter)
  const [allBookings, setAllBookings] = useState([]);

  // State BookingModalDetail 
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Thêm state refreshKey để kích hoạt render lại khi Nhận/Trả phòng thành công
  const [refreshKey, setRefreshKey] = useState(0);

  const handleViewDetail = (bookingData) => {
    setSelectedBooking(bookingData);
    setIsModalOpen(true);
  };

  // Hàm xử lý API Check-in (Nhận callback từ Modal)
  const handleCheckIn = () => {
    setIsModalOpen(false); // Đóng modal
    setRefreshKey(prev => prev + 1); // Thay đổi key để useEffect gọi lại API fetch data mới
  };

  // Hàm xử lý API Check-out (Nhận callback từ Modal)
  const handleCheckOut = () => {
    setIsModalOpen(false); // Đóng modal
    setRefreshKey(prev => prev + 1); // Thay đổi key để useEffect gọi lại API fetch data mới
  };

  // Hàm xử lý dữ liệu trả về từ API
  const processTimelineData = (data) => {
    if (!data) return [];

    const processedList = [];

    // 1. Xử lý Current Booking (Đang ở) -> Gán type 'CURRENT'
    if (data.current_booking) {
      processedList.push({
        ...data.current_booking,
        display_type: 'CURRENT'
      });
    }

    // 2. Xử lý Future Bookings (Lịch đặt) -> Gán type 'FUTURE'
    if (Array.isArray(data.future_bookings)) {
      data.future_bookings.forEach(item => {
        processedList.push({
          ...item,
          display_type: 'FUTURE'
        });
      });
    }

    // 3. Xử lý Past Bookings (Đã trả) -> Gán type 'PAST'
    if (Array.isArray(data.past_bookings)) {
      data.past_bookings.forEach(item => {
        processedList.push({
          ...item,
          display_type: 'PAST'
        });
      });
    }

    return processedList;
  };

  useEffect(() => {
    const fetchRoomsTimeline = async () => {
      // Nếu không có room ID thì không gọi (hoặc mặc định là 5 như bạn test)
      const roomIdToFetch = room?.id || 5;

      try {
        setLoading(true);

        const response = await roomAPI.getTimeLine(roomIdToFetch);
        console.log('API Response:', response);

        // Gọi hàm xử lý làm phẳng dữ liệu
        const flatList = processTimelineData(response);
        setAllBookings(flatList);

      } catch (err) {
        console.error('Failed to fetch rooms timeline:', err);
        setAllBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomsTimeline();
  }, [room, refreshKey]); // Thêm refreshKey vào dependency để nó tự chạy lại

  // --- 1. LỌC DỮ LIỆU ---
  const filteredData = allBookings.filter(item => {
    if (filterStatus === 'ALL') return true;
    return item.display_type === filterStatus;
  });

  // --- 2. PHÂN TRANG ---
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentCustomers = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6">

      {/* FILTER BOX */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-6">
          <Search size={20} className="text-blue-600" /> Tìm kiếm đặt phòng
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-500">Mã đặt phòng</label><input type="text" placeholder="VD: #1231" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-500">Email</label><input type="email" placeholder="example@gmail.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
          <div className="space-y-1.5"><label className="text-xs font-semibold text-gray-500">Tên khách</label><input type="text" placeholder="Tên khách..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="space-y-1.5 w-full"><label className="text-xs font-semibold text-gray-500">Ngày bắt đầu</label><DatePicker selected={startDate} onChange={setStartDate} customInput={<DateInput />} /></div>
          <div className="space-y-1.5 w-full"><label className="text-xs font-semibold text-gray-500">Ngày kết thúc</label><DatePicker selected={endDate} onChange={setEndDate} customInput={<DateInput />} /></div>
          <div className="flex gap-2"><button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm">Tìm kiếm</button><button className="flex-1 border py-2 rounded-lg text-sm">Làm mới</button></div>
        </div>
      </div>

      {/* --- TABLE BOX --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">

        {/* HEADER CỦA BẢNG */}
        <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h3 className="flex items-center gap-2 font-bold text-lg text-gray-900">
              <Users size={20} className="text-blue-600" /> Thông tin khách hàng
            </h3>
            <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2 py-1 rounded">
              {totalItems} Đơn
            </span>
          </div>

          {/* --- CÁC NÚT LỌC STATUS --- */}
          <div className="flex bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
            {[
              { id: 'ALL', label: 'Tất cả' },
              { id: 'CURRENT', label: 'Đang ở' },      // current_booking
              { id: 'FUTURE', label: 'Lịch đặt' },     // future_bookings
              { id: 'PAST', label: 'Đã trả' },         // past_bookings
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleFilterChange(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${filterStatus === tab.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE CONTENT */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
                <th className="p-4 font-semibold w-12">STT</th>
                <th className="p-4 font-semibold">Mã đặt</th>
                <th className="p-4 font-semibold">Khách hàng</th>
                <th className="p-4 font-semibold">Liên hệ</th>
                <th className="p-4 font-semibold">Thời gian lưu trú</th>
                <th className="p-4 font-semibold text-center">Trạng thái</th>
                <th className="p-4 font-semibold text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Đang tải dữ liệu...</td></tr>
              ) : currentCustomers.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 text-gray-500 font-medium">{indexOfFirstItem + index + 1}</td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">
                      {item.booking_code}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{item.guest_name}</p>
                    <p className="text-xs text-gray-500">{item.guest_email || 'Chưa có email'}</p>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{item.guest_phone}</td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      <span className="font-medium">
                        {item.check_in
                          ? new Date(item.check_in).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </span>
                      <span className="text-gray-400">→</span>
                      <span className="font-medium">
                        {item.check_out
                          ? new Date(item.check_out).toLocaleDateString('vi-VN')
                          : 'N/A'}
                      </span>
                    </div>
                  </td>

                  {/* CỘT TRẠNG THÁI HIỂN THỊ THEO DISPLAY_TYPE */}
                  <td className="p-4 text-center">
                    {item.display_type === 'CURRENT' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 mr-1.5 bg-green-600 rounded-full animate-pulse"></span> Đang ở
                      </span>
                    )}
                    {item.display_type === 'FUTURE' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Clock size={12} className="mr-1.5" /> Lịch đặt
                      </span>
                    )}
                    {item.display_type === 'PAST' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                        <CheckCircle size={12} className="mr-1.5" /> Đã trả
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    {item.display_type === 'CURRENT' ? (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm transition-all hover:shadow" onClick={() => handleViewDetail(item)}>Chi tiết</button>
                    ) : (
                      <button className="text-gray-400 text-xs font-semibold px-3 py-1.5 border border-gray-200 rounded hover:bg-gray-50" onClick={() => handleViewDetail(item)}>Xem lại</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && currentCustomers.length === 0 && (
            <div className="text-center py-12 flex flex-col items-center gap-3">
              <div className="bg-gray-100 p-3 rounded-full"><Filter className="text-gray-400" size={24} /></div>
              <p className="text-gray-500 text-sm">Không tìm thấy dữ liệu nào.</p>
            </div>
          )}
        </div>

        {/* PAGINATION FOOTER */}
        {totalItems > 0 && (
          <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500 gap-4">
            <span>
              Hiển thị {indexOfFirstItem + 1} đến {Math.min(indexOfLastItem, totalItems)} của {totalItems} kết quả
            </span>
            <div className="flex gap-1">
              <button
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded font-bold shadow-sm transition-colors ${currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <BookingDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        booking={selectedBooking}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
      />
    </div>
  );
}