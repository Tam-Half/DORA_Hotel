import React from 'react';
import { Search, Bell, HelpCircle, Download } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 fixed top-0 left-64 right-0 z-10">
      {/* Search Bar */}
      <div className="flex items-center w-96 bg-gray-50 rounded-lg px-4 py-2 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Tìm kiếm giao dịch, khách hàng..." 
          className="bg-transparent border-none outline-none text-sm ml-3 w-full text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm shadow-blue-200 transition-all">
          <Download size={16} /> Xuất báo cáo
        </button>
        <div className="h-8 w-px bg-gray-200 mx-2"></div>
        <button className="text-gray-500 hover:text-gray-700 relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </button>
        <button className="text-gray-500 hover:text-gray-700">
          <HelpCircle size={20} />
        </button>
      </div>
    </header>
  );
}