// src/features/search/components/FilterSidebar.jsx
import React from 'react';
import { Filter } from 'lucide-react';

export default function FilterSidebar() {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-200 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Filter size={20} /> Bộ lọc
        </h3>
        <button className="text-sm text-blue-600 hover:underline font-medium">
          Đặt lại
        </button>
      </div>

      {/* --- KHOẢNG GIÁ --- */}
      <div className="mb-8">
        <h4 className="font-semibold text-sm mb-4">Khoảng giá (mỗi đêm)</h4>
        {/* Thanh trượt giả lập (Thực tế nên dùng thư viện rc-slider) */}
        <input type="range" className="w-full accent-blue-500 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-3" />
        <div className="flex items-center gap-2">
          <div className="bg-gray-50 border border-gray-200 p-2 rounded text-sm w-1/2 text-center">500.000</div>
          <span>-</span>
          <div className="bg-gray-50 border border-gray-200 p-2 rounded text-sm w-1/2 text-center">2.500.000</div>
        </div>
      </div>

      {/* --- HẠNG PHÒNG --- */}
      <div className="mb-6 border-t border-gray-100 pt-6">
        <h4 className="font-semibold text-sm mb-3">Hạng phòng</h4>
        <div className="space-y-3">
          {['Standard (Tiêu chuẩn)', 'Deluxe (Sang trọng)', 'Suite (Cao cấp)', 'Family (Gia đình)'].map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-600 text-sm group-hover:text-gray-900">{item}</span>
            </label>
          ))}
        </div>
      </div>

      {/* --- TIỆN NGHI --- */}
      <div className="mb-6 border-t border-gray-100 pt-6">
        <h4 className="font-semibold text-sm mb-3">Tiện nghi</h4>
        <div className="space-y-3">
          {['Wifi miễn phí', 'Bữa sáng miễn phí', 'Bể bơi', 'Ban công / View đẹp'].map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-600 text-sm group-hover:text-gray-900">{item}</span>
            </label>
          ))}
        </div>
      </div>
       {/* --- Số Người --- */}
      <div className="border-t border-gray-100 pt-6">
        <h4 className="font-semibold text-sm mb-3">Số người tối đa</h4>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((num) => (
            <label key={num} className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <span className="text-gray-600 text-sm group-hover:text-gray-900">{num} người</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}