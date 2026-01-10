import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function HomeFooter() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">DORA HOTEL</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Trải nghiệm nghỉ dưỡng tuyệt vời nhất ngay tại trung tâm thành phố với dịch vụ 5 sao.
            </p>
            <div className="flex gap-4 pt-2">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Về Dora Hotel</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-600">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-blue-600">Cơ hội nghề nghiệp</a></li>
              <li><a href="#" className="hover:text-blue-600">Blog du lịch</a></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Hỗ Trợ</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a href="#" className="hover:text-blue-600">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-blue-600">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-blue-600">Liên hệ</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Đăng Ký Nhận Tin</h4>
            <p className="text-sm text-gray-500 mb-4">Nhận thông báo về các ưu đãi mới nhất.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email của bạn" 
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700">
                Gửi
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>&copy; 2026 Dora Hotel. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#">Điều khoản</a>
            <a href="#">Bảo mật</a>
            <a href="#">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}