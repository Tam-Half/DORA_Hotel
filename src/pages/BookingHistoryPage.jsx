import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Headphones, Bell, User } from 'lucide-react';

// --- 1. MOCK DATA (Dữ liệu giả lập) ---
const BOOKING_HISTORY = [
  {
    id: 1,
    roomName: 'Deluxe Ocean View',
    roomImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop',
    code: '#DH1024',
    dateRange: '12/10/2023 - 15/10/2023',
    totalPrice: 4500000,
    status: 'COMPLETED', // Hoàn thành
  },
  {
    id: 2,
    roomName: 'Suite City View',
    roomImage: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
    code: '#DH1056',
    dateRange: '05/11/2023 - 07/11/2023',
    totalPrice: 3200000,
    status: 'CONFIRMED', // Đã xác nhận
  },
  {
    id: 3,
    roomName: 'Standard Room',
    roomImage: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=2074&auto=format&fit=crop',
    code: '#DH1089',
    dateRange: '20/12/2023 - 22/12/2023',
    totalPrice: 1800000,
    status: 'CANCELLED', // Đã hủy
  },
  {
    id: 4,
    roomName: 'Presidential Suite',
    roomImage: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop',
    code: '#DH1102',
    dateRange: '01/01/2024 - 05/01/2024',
    totalPrice: 15000000,
    status: 'PENDING', // Chờ thanh toán
  },
];

// --- 2. HELPER COMPONENTS ---

// Component hiển thị Trạng thái (Badge)
const StatusBadge = ({ status }) => {
  const styles = {
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hoàn thành' },
    CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đã xác nhận' },
    CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã hủy' },
    PENDING:   { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Chờ thanh toán' },
  };

  const style = styles[status] || styles.PENDING;

  return (
    <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap`}>
      {style.label}
    </span>
  );
};

// Component định dạng tiền tệ
const formatCurrency = (amount) => 
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);


// --- 3. MAIN PAGE COMPONENT ---
export default function BookingHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">
      
      {/* HEADER (Giả lập Header chung của trang) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center text-white font-bold">D</div>
          <span className="text-xl font-bold text-gray-900">DORA HOTEL</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <a href="#" className="hover:text-blue-600">Trang chủ</a>
          <a href="#" className="hover:text-blue-600">Phòng</a>
          <a href="#" className="hover:text-blue-600">Dịch vụ</a>
          <a href="#" className="text-blue-600 font-bold">Lịch sử</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><Bell size={18} /></button>
          <div className="w-9 h-9 bg-yellow-200 rounded-full overflow-hidden border border-gray-300">
            <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
          </div>
        </div>
      </header>

      {/* CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch Sử Đặt Phòng</h1>
          <p className="text-gray-500">Quản lý và xem lại tất cả các giao dịch đặt phòng của bạn tại hệ thống DORA HOTEL.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo mã đặt phòng hoặc tên phòng..." 
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors shadow-sm shadow-blue-200">
            <Filter size={18} /> Lọc kết quả
          </button>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                  <th className="p-5">Phòng</th>
                  <th className="p-5">Mã đặt</th>
                  <th className="p-5">Ngày nhận/trả</th>
                  <th className="p-5">Tổng tiền</th>
                  <th className="p-5">Trạng thái</th>
                  <th className="p-5 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {BOOKING_HISTORY.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                    {/* Column: Phòng */}
                    <td className="p-5">
                      <div className="flex items-center gap-4">
                        <img src={item.roomImage} alt={item.roomName} className="w-16 h-12 rounded-lg object-cover shadow-sm" />
                        <span className="font-bold text-gray-900 text-base">{item.roomName}</span>
                      </div>
                    </td>
                    
                    {/* Column: Mã đặt */}
                    <td className="p-5 text-gray-500 font-medium">{item.code}</td>
                    
                    {/* Column: Ngày */}
                    <td className="p-5 text-gray-600">{item.dateRange}</td>
                    
                    {/* Column: Tổng tiền */}
                    <td className="p-5 font-bold text-blue-600 text-base">{formatCurrency(item.totalPrice)}</td>
                    
                    {/* Column: Trạng thái */}
                    <td className="p-5">
                      <StatusBadge status={item.status} />
                    </td>
                    
                    {/* Column: Hành động */}
                    <td className="p-5 text-right">
                      <div className="flex items-center justify-end gap-3">
                         {item.status === 'PENDING' ? (
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition shadow-sm">
                              Thanh toán ngay
                            </button>
                         ) : (
                           <>
                            <button className="text-blue-600 font-bold hover:underline">Chi tiết</button>
                            {item.status === 'COMPLETED' && (
                               <>
                                <span className="text-gray-300">|</span>
                                <button className="text-gray-600 font-medium hover:text-black">Đánh giá</button>
                               </>
                            )}
                           </>
                         )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-5 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
            <span>Hiển thị 4 trên 12 kết quả</span>
            <div className="flex gap-2">
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"><ChevronLeft size={18} /></button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-600 text-white font-bold shadow-sm">1</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">2</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition">3</button>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition"><ChevronRight size={18} /></button>
            </div>
          </div>
        </div>

        {/* SUPPORT BANNER (Phần dưới cùng của ảnh) */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full text-blue-600 shadow-sm">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Cần hỗ trợ về việc đặt phòng?</h4>
              <p className="text-gray-600 text-sm">Đội ngũ CSKH của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>
            </div>
          </div>
          <button className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold px-6 py-3 rounded-lg shadow-sm w-full md:w-auto">
            Liên hệ ngay
          </button>
        </div>

      </div>
    </div>
  );
}