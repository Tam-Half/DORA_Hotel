// src/features/search/components/RoomCard.jsx
import React from 'react';
import { Star, User, BedDouble, Ruler, Heart } from 'lucide-react';

export default function RoomCard({ room }) {
  // Format tiền tệ
  const formatCurrency = (amount) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group">
      {/* --- IMAGE SECTION --- */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={room.image} 
          alt={room.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        {/* Badge Giảm giá / Nổi bật */}
        {room.discount && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Ưu đãi {room.discount}%
          </span>
        )}
        {room.tag && (
          <span className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
            {room.tag}
          </span>
        )}
        {/* Nút Yêu thích */}
        <button className="absolute top-3 right-3 p-1.5 bg-black/20 rounded-full text-white hover:bg-black/40 transition">
          <Heart size={18} />
        </button>
      </div>

      {/* --- CONTENT SECTION --- */}
      <div className="p-4 flex flex-col flex-1">
        {/* Loại phòng & Rating */}
        <div className="flex justify-between items-center mb-2">
          <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-1 rounded">
            {room.type}
          </span>
          <div className="flex items-center gap-1 text-orange-500 text-sm font-bold">
            <Star size={14} fill="currentColor" />
            <span>{room.rating}</span>
            <span className="text-gray-400 font-normal">({room.reviewCount})</span>
          </div>
        </div>

        {/* Tên phòng */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {room.name}
        </h3>

        {/* Thông số kỹ thuật */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Ruler size={14} /> {room.area}m²
          </div>
          <div className="flex items-center gap-1">
            <BedDouble size={14} /> {room.bed}
          </div>
          <div className="flex items-center gap-1">
            <User size={14} /> {room.capacity}
          </div>
        </div>

        {/* Giá & Button (Đẩy xuống đáy) */}
        <div className="mt-auto flex items-end justify-between">
          <div>
            {room.oldPrice && (
              <p className="text-xs text-gray-400 line-through mb-0.5">
                {formatCurrency(room.oldPrice)}
              </p>
            )}
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(room.price)}
            </p>
            <p className="text-xs text-gray-500">/ đêm</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
            Đặt ngay
          </button>
        </div>
      </div>
    </div>
  );
}