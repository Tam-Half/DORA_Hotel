import React, { useState, useMemo } from 'react';
import { Calendar } from 'lucide-react';
import DashboardLayout from '../components/admin/layout/DashboardLayout';
import StatsGrid from '../components/admin/revenueReport/StatsGrid';
import CompareChart from '../components/admin/revenueReport/CompareChart';
import RevenueChart from '../components/admin/revenueReport/RevenueChart';
import BookingChart from '../components/admin/revenueReport/BookingChart';
import RoomTypePieChart from '../components/admin/revenueReport/RoomTypePieChart'; 
import RecentTransactions from '../components/admin/revenueReport/RecentTransactions'; 

const formatCurrency = (value) => new Intl.NumberFormat('vi-VN').format(value) + 'đ';

// --- 1. DỮ LIỆU MẪU CHO CHẾ ĐỘ XEM BÌNH THƯỜNG ---
const NORMAL_DASHBOARD_DATA = {
  today: [
    { name: '08:00', revenue: 5000000, bookings: 2, occupancy: 10, revPar: 500000 },
    { name: '12:00', revenue: 12000000, bookings: 5, occupancy: 25, revPar: 1200000 },
    { name: '16:00', revenue: 8000000, bookings: 3, occupancy: 15, revPar: 800000 },
  ],
  month: [
    { name: 'Tuần 1', revenue: 85000000, bookings: 35, occupancy: 75, revPar: 1300000 },
    { name: 'Tuần 2', revenue: 95000000, bookings: 42, occupancy: 80, revPar: 1400000 },
    { name: 'Tuần 3', revenue: 110000000, bookings: 48, occupancy: 85, revPar: 1500000 },
    { name: 'Tuần 4', revenue: 90000000, bookings: 38, occupancy: 78, revPar: 1350000 },
  ],
  quarter: [
    { name: 'Tháng 1', revenue: 290000000, bookings: 125, occupancy: 80, revPar: 1400000 },
    { name: 'Tháng 2', revenue: 360000000, bookings: 158, occupancy: 86, revPar: 1583000 },
    { name: 'Tháng 3', revenue: 410000000, bookings: 180, occupancy: 92, revPar: 1700000 },
  ]
};

// Hàm sinh dữ liệu ngẫu nhiên khi người dùng chọn "Từ ngày -> Đến ngày"
const generateCustomData = (start, end) => {
  if (!start || !end) return [];
  const d1 = new Date(start);
  const d2 = new Date(end);
  const data = [];
  let current = new Date(d1);
  while (current <= d2) {
    data.push({
      name: current.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
      revenue: Math.floor(Math.random() * 20000000) + 5000000,
      bookings: Math.floor(Math.random() * 15) + 2,
      occupancy: 60 + Math.floor(Math.random() * 30),
      revPar: 1200000
    });
    current.setDate(current.getDate() + 1);
  }
  return data;
};

// --- 2. DỮ LIỆU TỔNG HỢP CHO CHẾ ĐỘ SO SÁNH 2 THÁNG ---
const DATABASE_MONTHLY_TOTALS = {
  '2026-03': { name: 'Tháng 03/2026', revenue: 210000000, bookings: 120, occupancy: 70, revPar: 1300000 },
  '2026-04': { name: 'Tháng 04/2026', revenue: 280000000, bookings: 165, occupancy: 85, revPar: 1500000 },
  '2026-05': { name: 'Tháng 05/2026', revenue: 150000000, bookings: 90,  occupancy: 65, revPar: 1100000 },
};


export default function DashboardPage() {
  // --- STATE: QUẢN LÝ CHẾ ĐỘ ---
  const [isCompareMode, setIsCompareMode] = useState(false);
  
  // --- STATE: CHO CHẾ ĐỘ BÌNH THƯỜNG ---
  const [activeFilter, setActiveFilter] = useState('month'); 
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- STATE: CHO CHẾ ĐỘ SO SÁNH ---
  const [month1, setMonth1] = useState('2026-03');
  const [month2, setMonth2] = useState('2026-04');

  // --- LOGIC: CHẾ ĐỘ BÌNH THƯỜNG ---
  // Lấy dữ liệu mảng dựa trên bộ lọc
  const normalData = useMemo(() => {
    if (isCustomDate && startDate && endDate) {
      return generateCustomData(startDate, endDate);
    }
    return NORMAL_DASHBOARD_DATA[activeFilter] || [];
  }, [activeFilter, isCustomDate, startDate, endDate]);

  // Tính tổng số liệu cho StatsGrid
  const calculatedStats = useMemo(() => {
    if (!normalData || normalData.length === 0) {
      return { totalRevenue: 0, totalBookings: 0, avgOccupancy: 0, avgRevPar: 0 };
    }
    const totalRev = normalData.reduce((sum, item) => sum + item.revenue, 0);
    const totalBook = normalData.reduce((sum, item) => sum + item.bookings, 0);
    const avgOcc = normalData.reduce((sum, item) => sum + item.occupancy, 0) / normalData.length;
    const avgRevP = normalData.reduce((sum, item) => sum + item.revPar, 0) / normalData.length;
    return { totalRevenue: totalRev, totalBookings: totalBook, avgOccupancy: avgOcc.toFixed(1), avgRevPar: Math.round(avgRevP) };
  }, [normalData]);

  // Xử lý khi click vào Today/Month/Quarter
  const handleFilterClick = (filterName) => {
    setIsCustomDate(false);
    setActiveFilter(filterName);
    setStartDate('');
    setEndDate('');
  };

  const getFilterClass = (filterName) => {
    const isActive = !isCustomDate && activeFilter === filterName;
    return isActive 
      ? "px-4 py-1.5 text-sm font-bold text-blue-700 bg-blue-50 rounded-md shadow-sm" 
      : "px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-md";
  };

  // --- LOGIC: CHẾ ĐỘ SO SÁNH ---
  const compareData = useMemo(() => {
    if (!isCompareMode) return [];
    const data1 = DATABASE_MONTHLY_TOTALS[month1] || { name: month1, revenue: 0, bookings: 0 };
    const data2 = DATABASE_MONTHLY_TOTALS[month2] || { name: month2, revenue: 0, bookings: 0 };
    return [data1, data2];
  }, [isCompareMode, month1, month2]);


  return (
    <DashboardLayout>
      {/* --- HEADER TỔNG CỦA TRANG --- */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo Doanh thu</h1>
          <p className="text-sm text-gray-500 mt-1">Theo dõi và phân tích hiệu quả kinh doanh</p>
        </div>

        {/* --- KHU VỰC ĐIỀU KHIỂN BỘ LỌC TỔNG HỢP --- */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
          
          {/* Nút Toggle Bật/Tắt So sánh luôn hiện */}
          <button 
            onClick={() => setIsCompareMode(!isCompareMode)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition shadow-sm whitespace-nowrap ${isCompareMode ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
          >
            {isCompareMode ? 'Trở về Mặc định' : 'So sánh 2 tháng'}
          </button>

          {/* Nếu ĐANG MỞ So Sánh -> Hiện thanh chọn 2 tháng */}
          {isCompareMode && (
            <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg flex items-center gap-2 animate-fade-in">
              <input type="month" value={month1} onChange={(e) => setMonth1(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 text-sm outline-none focus:border-blue-500 bg-white" />
              <span className="text-gray-500 text-sm font-bold">Vs</span>
              <input type="month" value={month2} onChange={(e) => setMonth2(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 text-sm outline-none focus:border-blue-500 bg-white" />
            </div>
          )}

          {/* Nếu ĐANG TẮT So Sánh (Mặc định) -> Hiện thanh chọn Ngày/Tháng/Quý/Tùy chọn */}
          {!isCompareMode && (
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 animate-fade-in">
              {/* Dải nút Filter */}
              <div className="bg-white border border-gray-200 p-1 rounded-lg flex items-center">
                <button onClick={() => handleFilterClick('today')} className={getFilterClass('today')}>Hôm nay</button>
                <button onClick={() => handleFilterClick('month')} className={getFilterClass('month')}>Tháng này</button>
                <button onClick={() => handleFilterClick('quarter')} className={getFilterClass('quarter')}>Quý này</button>
                <div className="w-px h-5 bg-gray-200 mx-1 hidden sm:block"></div>
                <button 
                  onClick={() => setIsCustomDate(true)}
                  className={`px-3 py-1.5 text-sm font-medium flex items-center gap-2 rounded-md ${isCustomDate ? 'text-blue-700 bg-blue-50 font-bold shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  <Calendar size={16} /> Tùy chọn
                </button>
              </div>

              {/* Ô nhập Tùy chọn ngày (Chỉ hiện khi bấm nút Tùy chọn) */}
              {isCustomDate && (
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="text-sm border-none outline-none bg-transparent px-2" />
                  <span className="text-gray-400">→</span>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="text-sm border-none outline-none bg-transparent px-2" />
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* --- NỘI DUNG BODY DASHBOARD --- */}
      {isCompareMode ? (
        
        /* ================= GIAO DIỆN KHI BẬT SO SÁNH ================= */
        <div className="animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="h-[350px]">
              <CompareChart title="So sánh Tổng Doanh Thu" data={compareData} dataKey="revenue" color="#3B82F6" formatValue={formatCurrency} />
            </div>
            <div className="h-[350px]">
              <CompareChart title="So sánh Tổng Lượt Đặt Phòng" data={compareData} dataKey="bookings" color="#8B5CF6" />
            </div>
          </div>
        </div>

      ) : (

        /* ================= GIAO DIỆN KHI TẮT SO SÁNH (MẶC ĐỊNH) ================= */
        <div className="animate-fade-in">
          {/* Thẻ hiển thị số tổng */}
          <StatsGrid stats={calculatedStats} />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 h-[350px]">
              {/* Biểu đồ đường (Area) hiển thị Doanh Thu */}
              <RevenueChart data={normalData} /> 
            </div>
            <div className="lg:col-span-1 h-[350px]">
              {/* Biểu đồ tròn hiển thị loại phòng */}
              <RoomTypePieChart />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="h-[350px]">
              {/* Biểu đồ cột (Bar) hiển thị lượt Đặt Phòng */}
              <BookingChart data={normalData} />
            </div>
          </div>

          <RecentTransactions />
        </div>
      )}
    </DashboardLayout>
  );
}