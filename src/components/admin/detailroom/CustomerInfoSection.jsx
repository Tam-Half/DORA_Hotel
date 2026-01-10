import React, { useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Nhớ import CSS
import { vi } from 'date-fns/locale'; // Tiếng Việt
import { Search, RotateCcw, Calendar, Users, ChevronLeft, ChevronRight } from 'lucide-react';

// Mock Data
const CUSTOMERS = [
  {
    id: 1,
    code: '#1231',
    name: 'Nguyễn Văn Tâm',
    email: 'tam@gmail.com',
    phone: '0312312xxx',
    checkIn: '22/12/2025',
    checkOut: '24/12/2025',
    status: 'ACTIVE',
  },
  {
    id: 2,
    code: '#1210',
    name: 'Lê Thị Hoa',
    email: 'hoa.le@email.com',
    phone: '0905667xxx',
    checkIn: '15/12/2025',
    checkOut: '17/12/2025',
    status: 'COMPLETED',
  },
];

// Custom Input cho DatePicker để giao diện giống hệt Input text cũ
const DateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <div className="relative w-full">
    <input 
      type="text" 
      onClick={onClick} 
      ref={ref}
      value={value} 
      placeholder={placeholder}
      readOnly // Chặn nhập tay, bắt buộc chọn lịch
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer bg-white" 
    />
    <Calendar className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
  </div>
));

export default function CustomerInfoSection() {
  // State quản lý ngày tìm kiếm
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  return (
    <div className="space-y-6">
      
      {/* --- 1. FILTER BOX (TÌM KIẾM ĐẶT PHÒNG) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="flex items-center gap-2 font-bold text-lg text-gray-900 mb-6">
          <Search size={20} className="text-blue-600" /> Tìm kiếm đặt phòng
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Mã đặt phòng */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Mã đặt phòng</label>
            <input type="text" placeholder="VD: #1231" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Email khách hàng</label>
            <input type="email" placeholder="example@gmail.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          {/* Tên khách */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500">Tên khách hàng</label>
            <input type="text" placeholder="Nhập tên khách..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* Ngày bắt đầu (Dùng DatePicker) */}
          <div className="space-y-1.5 w-full">
            <label className="text-xs font-semibold text-gray-500">Ngày bắt đầu</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              locale={vi}
              customInput={<DateInput />} // Input đẹp
              wrapperClassName="w-full"   // Để full width
            />
          </div>
          
          {/* Ngày kết thúc (Dùng DatePicker) */}
          <div className="space-y-1.5 w-full">
            <label className="text-xs font-semibold text-gray-500">Ngày kết thúc</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd/MM/yyyy"
              placeholderText="dd/mm/yyyy"
              locale={vi}
              minDate={startDate} // Ngày kết thúc phải sau ngày bắt đầu
              customInput={<DateInput />}
              wrapperClassName="w-full"
            />
          </div>
          
          {/* Buttons */}
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors shadow-sm shadow-blue-200">
              <Search size={16} /> Tìm kiếm
            </button>
            <button 
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
              onClick={() => { setStartDate(null); setEndDate(null); }}
            >
              <RotateCcw size={16} /> Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* --- 2. TABLE BOX (THÔNG TIN KHÁCH HÀNG) --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          {/* Sửa tiêu đề thành Thông tin khách hàng */}
          <h3 className="flex items-center gap-2 font-bold text-lg text-gray-900">
            <Users size={20} className="text-blue-600" /> Thông tin khách hàng
          </h3>
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded border border-blue-100">Tổng cộng: 02</span>
        </div>
        
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
              {CUSTOMERS.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="p-4 text-gray-500 font-medium">{index + 1}</td>
                  <td className="p-4">
                    <span className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded text-xs">
                      {item.code}
                    </span>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.email}</p>
                  </td>
                  <td className="p-4 text-gray-600 font-medium">{item.phone}</td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400"/> 
                      <span>{item.checkIn}</span> 
                      <span className="text-gray-400">→</span> 
                      <span>{item.checkOut}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    {item.status === 'ACTIVE' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <span className="w-1.5 h-1.5 mr-1.5 bg-green-600 rounded-full animate-pulse"></span>
                        Đang ở
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Đã trả phòng
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    {item.status === 'ACTIVE' ? (
                      <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm transition-all hover:shadow">
                        Thanh toán
                      </button>
                    ) : (
                      <button className="text-gray-400 text-xs font-semibold px-3 py-1.5 cursor-default">
                        Đã thanh toán
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-500">
          <span>Hiển thị 1 đến 2 của 2 khách hàng</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded font-bold shadow-sm">1</button>
            <button className="w-8 h-8 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}