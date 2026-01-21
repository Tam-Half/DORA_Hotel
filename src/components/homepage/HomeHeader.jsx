import React, { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';
import { NAV_LINKS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HomeHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md z-50 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* LEFT: LOGO */}
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">DORA HOTEL</span>
          </div>

          {/* CENTER: NAVIGATION (Nằm giữa header) */}
          <nav className="hidden md:flex space-x-8 items-center justify-center flex-1">
            {NAV_LINKS.map((item) => (
              <a
                key={item}
                href="#"
                className="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors uppercase tracking-wide"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* RIGHT: AUTH BUTTONS */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border">
                  <User size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Xin chào, {user?.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-blue-600 font-medium text-sm"
                >
                  Đăng ký
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold text-sm transition-transform hover:scale-105 shadow-lg shadow-blue-200"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {NAV_LINKS.map((item) => (
              <a key={item} href="#" className="block px-3 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                {item}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <button className="w-full text-center py-3 border border-gray-300 rounded-lg font-bold text-gray-700">Đăng ký</button>
              <button className="w-full text-center py-3 bg-blue-600 text-white rounded-lg font-bold">Đăng nhập</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}