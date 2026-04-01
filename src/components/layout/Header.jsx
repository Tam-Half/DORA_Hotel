import Container from "./Container"
import { useAuth } from "../../context/AuthContext"
import { LogOut, User } from "lucide-react"

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="border-b bg-white">
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg">
              {/* Icon mô phỏng logo Dora */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M3 3v18h18" />
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">DORA HOTEL</span>
          </div>

          {/* MENU */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="/" className="hover:text-blue-600">Trang chủ</a>
            <a href="#" className="hover:text-blue-600">Phòng</a>
            <a href="#" className="hover:text-blue-600">Tin tức</a>
            <a href="/user/historybooking" className="hover:text-blue-600">Lịch sử</a>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
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
              <div className="flex items-center gap-3">
                <a href="/login" className="text-sm font-semibold text-gray-700 hover:text-blue-600">
                  Đăng nhập
                </a>
                <a
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-all"
                >
                  Đăng ký
                </a>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  )
}
