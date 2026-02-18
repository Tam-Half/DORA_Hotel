import React from 'react';
import DashboardLayout from '../components/admin/layout/DashboardLayout';
import StatsGrid from '../components/admin/revenueReport/StatsGrid';
import RevenueChart from '../components/admin/revenueReport/RevenueChart';
import RoomTypePieChart from '../components/admin/revenueReport/RoomTypePieChart';
import RecentTransactions from '../components/admin/revenueReport/RecentTransactions';
import { Calendar } from 'lucide-react';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      
      {/* Page Title & Filter (Dòng trên cùng) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Báo cáo Doanh thu</h1>
          <p className="text-gray-500 text-sm mt-1">Theo dõi hiệu suất tài chính và tăng trưởng của khách sạn</p>
        </div>

        {/* Time Filter Buttons */}
        <div className="bg-white border border-gray-200 p-1 rounded-lg flex items-center">
          <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-md">Hôm nay</button>
          <button className="px-4 py-1.5 text-sm font-bold text-blue-700 bg-blue-50 rounded-md shadow-sm">Tháng này</button>
          <button className="px-4 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-md">Năm nay</button>
          <div className="w-px h-5 bg-gray-200 mx-1"></div>
          <button className="px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center gap-2">
            <Calendar size={16} /> Tùy chọn
          </button>
        </div>
      </div>

      {/* 1. Các thẻ thống kê */}
      <StatsGrid />

      {/* 2. Biểu đồ (Grid chia 3: 2 phần cho Chart, 1 phần cho Pie) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[400px]">
          <RevenueChart />
        </div>
        <div className="lg:col-span-1 h-[400px]">
          <RoomTypePieChart />
        </div>
      </div>

      {/* 3. Bảng giao dịch */}
      <RecentTransactions />

    </DashboardLayout>
  );
}