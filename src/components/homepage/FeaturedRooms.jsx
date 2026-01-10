import React from 'react';
import { Star, ChevronRight } from 'lucide-react';
import { ROOMS } from '../../data/mockData';

export default function FeaturedRooms() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Phòng Nghỉ Nổi Bật</h2>
            <p className="text-gray-500">Những lựa chọn được yêu thích nhất tại Dora Hotel</p>
          </div>
          <a href="#" className="hidden md:flex items-center text-blue-600 font-semibold hover:gap-2 transition-all">
            Xem tất cả phòng <ChevronRight size={20} />
          </a>
        </div>

        {/* Grid Rooms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ROOMS.map(room => (
            <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-gray-900 px-2 py-1 rounded-lg text-sm font-bold flex items-center gap-1">
                  <Star size={14} className="text-yellow-500 fill-yellow-500" /> {room.rating}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{room.name}</h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{room.desc}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-gray-400 text-xs">Giá mỗi đêm từ</span>
                    <p className="text-blue-600 font-bold text-lg">
                      {new Intl.NumberFormat('vi-VN').format(room.price)}đ
                    </p>
                  </div>
                  <button className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                    Đặt ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center md:hidden">
           <button className="text-blue-600 font-semibold">Xem tất cả phòng &rarr;</button>
        </div>
      </div>
    </section>
  );
}