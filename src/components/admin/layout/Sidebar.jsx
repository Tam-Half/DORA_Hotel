import React from 'react';
import { BedDouble, BarChart3, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom'; // 1. Import NavLink

// 2. Thêm đường dẫn (path) cho từng mục menu
// Bạn nhớ bỏ thuộc tính 'active' cứng đi, NavLink sẽ tự xử lý
const MENU_ITEMS = [
  { icon: BedDouble, label: 'Sơ đồ phòng', path: '/admin' },
  { icon: BarChart3, label: 'Báo cáo', path: '/admin/dashboard' },
  { icon: Settings, label: 'Cài đặt', path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <div className="bg-blue-600 p-1.5 rounded-lg mr-3">
          <span className="text-white font-bold text-lg">D</span>
        </div>
        <span className="text-xl font-bold text-gray-900">DORA HOTEL</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1">
        {MENU_ITEMS.map((item, index) => (
          /* 3. Dùng NavLink thay cho button */
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive
                ? 'bg-blue-50 text-blue-600' // Style khi đang ở trang này
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900' // Style khi bình thường
              }`
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://ui-avatars.com/api/?name=Admin+Dora" alt="Admin" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">Admin Dora</p>
            <p className="text-xs text-gray-500 truncate">Quản trị viên</p>
          </div>
        </div>
      </div>
    </aside>
  );
}