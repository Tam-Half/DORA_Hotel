// src/features/admin/components/RoomInfoSidebar.jsx
import React from 'react';
import { Users, Layout, FileText, Info, ArrowLeft } from 'lucide-react';

export default function RoomInfoSidebar() {
  return (
    <div className="w-full">
      {/* Nút Quay lại */}
      <button className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
        <ArrowLeft size={18} /> Quay lại
      </button>

      {/* Tiêu đề */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Thông tin phòng</h2>
      
      {/* Số phòng nổi bật */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className="text-3xl font-bold text-blue-600">P: 101</span>
        <span className="text-gray-500 text-lg">Lầu: 01</span>
      </div>

      <div className="border-t border-gray-100 my-4"></div>

      {/* Thông số chi tiết */}
      <div className="space-y-6">
        {/* Số người */}
        <div className="flex gap-4">
          <div className="mt-1 text-gray-400"><Users size={20} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Số người tối đa</p>
            <p className="font-semibold text-gray-800">4 Người</p>
          </div>
        </div>

        {/* Loại phòng */}
        <div className="flex gap-4">
          <div className="mt-1 text-gray-400"><Layout size={20} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Loại phòng</p>
            <p className="font-semibold text-gray-800">Thường (Standard)</p>
          </div>
        </div>

        {/* Mô tả */}
        <div className="flex gap-4">
          <div className="mt-1 text-gray-400"><FileText size={20} /></div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Mô tả phòng</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              View đẹp hướng ra thành phố, đầy đủ tiện nghi, thoáng mát, yên tĩnh phù hợp cho gia đình hoặc nhóm bạn.
            </p>
          </div>
        </div>
      </div>

      {/* Alert Trạng thái */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
        <div className="text-blue-500 mt-0.5"><Info size={20} /></div>
        <div>
          <h4 className="font-bold text-blue-700 text-sm mb-1">Trạng thái hiện tại</h4>
          <p className="text-sm text-blue-600">
            Phòng hiện đang có khách lưu trú. Vui lòng kiểm tra lịch trình bên dưới.
          </p>
        </div>
      </div>
    </div>
  );
}