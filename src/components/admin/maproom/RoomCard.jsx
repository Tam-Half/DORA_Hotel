// src/features/room-map/components/RoomCard.jsx
import React from 'react';
import { User, BedDouble, Wrench, CheckCircle } from 'lucide-react';

export default function RoomCard({ room, onClick }) {
  // Logic style động dựa theo trạng thái
  const getStatusStyle = () => {
    switch (room.status) {
      case 'AVAILABLE':
        return 'bg-white border-blue-200 hover:border-blue-500 hover:shadow-md';
      case 'BOOKED':
        // Đã đặt: Vẫn cho hover và style khác biệt (xám nhẹ)
        return 'bg-gray-100 border-gray-300 hover:border-gray-500 hover:shadow-md opacity-90'; 
      case 'MAINTENANCE':
        return 'bg-orange-50 border-orange-200 hover:border-orange-400';
      default:
        return 'bg-white';
    }
  };

  const renderBadge = () => {
    switch (room.status) {
      case 'AVAILABLE':
        return <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg absolute top-0 right-0">TRỐNG</span>;
      case 'BOOKED':
        return <span className="bg-gray-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg absolute top-0 right-0">ĐÃ ĐẶT</span>;
      case 'MAINTENANCE':
        return <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg absolute top-0 right-0">BẢO TRÌ</span>;
      default: return null;
    }
  };

  return (
    // QUAN TRỌNG: Luôn để cursor-pointer và onClick để thỏa mãn yêu cầu của bạn
    <div 
      onClick={() => onClick(room)}
      className={`relative p-4 rounded-xl border transition-all duration-200 cursor-pointer group h-full flex flex-col justify-between ${getStatusStyle()}`}
    >
      {renderBadge()}
      
      {/* Icon VIP (nếu có) */}
      {room.isVip && (
        <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg z-10">VIP</div>
      )}

      {/* Header: Số phòng */}
      <div className="mb-2 mt-2">
        <h3 className={`text-2xl font-bold ${room.status === 'BOOKED' ? 'text-gray-500' : 'text-gray-800'}`}>
          {room.number}
        </h3>
        <p className="text-xs text-gray-500 font-medium truncate">{room.name}</p>
      </div>

      {/* Content: Icon giường/bảo trì */}
      <div className="flex justify-center my-2 text-gray-400 group-hover:scale-110 transition-transform">
        {room.status === 'MAINTENANCE' ? (
          <Wrench size={32} className="text-orange-400" />
        ) : (
          <BedDouble size={32} className={room.status === 'AVAILABLE' ? 'text-blue-400' : 'text-gray-400'} />
        )}
      </div>

      {/* Footer: Thông tin giá/người hoặc Giờ xong */}
      <div className="flex justify-between items-end mt-2 pt-2 border-t border-dashed border-gray-200">
        {room.status === 'MAINTENANCE' ? (
           <p className="text-xs text-orange-600 font-medium italic">{room.note}</p>
        ) : (
          <>
            <div className="flex items-center gap-1 text-gray-500">
              <User size={14} />
              <span className="text-xs">{room.capacity}</span>
            </div>
            <div className="text-right">
              {room.status === 'AVAILABLE' ? (
                 <span className="text-blue-600 font-bold text-sm">
                   {(room.price / 1000)}k <span className="text-[10px] font-normal text-gray-400">/đêm</span>
                 </span>
              ) : (
                <span className="text-gray-400 font-bold text-sm">
                   {(room.price / 1000)}k
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}