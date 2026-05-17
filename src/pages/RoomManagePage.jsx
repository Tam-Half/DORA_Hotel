import React from 'react';
import { Building2, Moon, BellRing } from 'lucide-react';
import RoomInfoSidebar from '../components/admin/detailroom/RoomInfoSidebar';
import CustomerInfoSection from '../components/admin/detailroom/CustomerInfoSection'; // <-- Đã đổi tên import
import { useLocation, Navigate } from 'react-router-dom';
const AdminHeader = (user) => (
  <header className="bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between sticky top-0 z-50">
    <div className="flex items-center gap-2">
      <div className="bg-blue-600 p-1.5 rounded-lg text-white">
        <Building2 size={24} />
      </div>
      <h1 className="text-xl font-bold text-gray-800 tracking-tight">DORA HOTEL</h1>
    </div>

    <div className="flex items-center gap-6">
      <button className="text-gray-500 hover:text-gray-900">
                 <BellRing className="cursor-pointer text-xl text-yellow-500 hover:text-gray-700" />

      </button>
      <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-900">{user ? user?.user?.name : 'Admin'}</p>
          <p className="text-xs text-gray-500">Quản trị viên</p>
        </div>
        <div className="w-10 h-10  rounded-full flex items-center justify-center text-yellow-700 bg-white-200 border-2 border-blue-500 shadow-sm overflow-hidden">
          <img  src={user ? user?.user?.avatar_url : "https://ui-avatars.com/api/?name=Admin&background=fde047&color=854d0e"} alt="Admin" />
        </div>
      </div>
    </div>
  </header>
);

export default function RoomManagePage() {
  const location = useLocation();
  const room = location.state;
  const userString = localStorage.getItem('user_profile');
  const user = userString ? JSON.parse(userString) : null;
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <AdminHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

          {/* CỘT TRÁI: THÔNG TIN PHÒNG */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
            <RoomInfoSidebar room={room} />
          </div>

          {/* CỘT PHẢI: QUẢN LÝ KHÁCH HÀNG */}
          <div className="lg:col-span-3">
            <CustomerInfoSection room={room} />
          </div>

        </div>
      </main>
    </div>
  );
}