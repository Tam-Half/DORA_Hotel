import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Import CSS của thư viện lịch
import { ChevronDown, Minus, Plus } from 'lucide-react';
import { vi } from 'date-fns/locale'; // Để lịch hiển thị tiếng Việt

// Component con để hiển thị từng dòng khách (Người lớn, Trẻ em...)
const GuestCounter = ({ label, subLabel, value, onDecrease, onIncrease, max = 10 }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="flex flex-col">
      <span className="font-semibold text-sm text-gray-900">{label}</span>
      {subLabel && <span className="text-xs text-gray-500">{subLabel}</span>}
    </div>
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        disabled={value <= 0}
        className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${
          value <= 0 ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-gray-600 hover:border-black hover:text-black'
        }`}
      >
        <Minus size={14} />
      </button>
      <span className="w-4 text-center text-sm font-medium">{value}</span>
      <button
        onClick={onIncrease}
        disabled={value >= max}
        className={`w-8 h-8 rounded-full border flex items-center justify-center transition ${
          value >= max ? 'border-gray-200 text-gray-300 cursor-not-allowed' : 'border-gray-400 text-gray-600 hover:border-black hover:text-black'
        }`}
      >
        <Plus size={14} />
      </button>
    </div>
  </div>
);

export default function BookingCard() {
  const [pricePerNight] = useState(2500000);
  
  // State cho Lịch (Ngày bắt đầu - Ngày kết thúc)
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3))); // Mặc định +3 ngày

  // State cho Khách
  const [guests, setGuests] = useState({ adults: 2, children: 1, infants: 0 });
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const guestDropdownRef = useRef(null); // Ref để phát hiện click ra ngoài

  // --- LOGIC TÍNH TOÁN ---
  // Tính số đêm
  const nights = Math.max(1, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)));
  
  const cleaningFee = 200000;
  const totalPrice = (pricePerNight * nights) + cleaningFee;

  // Format tiền tệ
  const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');

  // Format hiển thị text "Khách"
  const getGuestLabel = () => {
    let text = `${guests.adults} người lớn`;
    if (guests.children > 0) text += `, ${guests.children} trẻ em`;
    if (guests.infants > 0) text += `, ${guests.infants} em bé`;
    return text;
  };

  // --- EFFECT: ĐÓNG MENU KHI CLICK RA NGOÀI ---
  useEffect(() => {
    function handleClickOutside(event) {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(event.target)) {
        setIsGuestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 w-full max-w-[380px]">
      {/* Header Giá */}
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gray-900">{formatCurrency(pricePerNight)}</span>
          <span className="text-gray-500 font-medium">/ đêm</span>
        </div>
      </div>

      {/* --- FORM NHẬP LIỆU --- */}
      <div className="border border-gray-300 rounded-xl mb-4 relative bg-white z-10">
        
        {/* DATE PICKER */}
        <div className="flex border-b border-gray-300">
          <div className="w-1/2 p-3 border-r border-gray-300 hover:bg-gray-50 cursor-pointer relative">
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Nhận phòng</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              locale={vi}
              dateFormat="dd/MM/yyyy"
              className="w-full bg-transparent text-sm text-gray-700 outline-none cursor-pointer p-0"
            />
          </div>
          <div className="w-1/2 p-3 hover:bg-gray-50 cursor-pointer relative">
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Trả phòng</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              locale={vi}
              dateFormat="dd/MM/yyyy"
              className="w-full bg-transparent text-sm text-gray-700 outline-none cursor-pointer p-0"
            />
          </div>
        </div>

        {/* GUEST DROPDOWN */}
        <div className="relative" ref={guestDropdownRef}>
          <div 
            className="p-3 hover:bg-gray-50 cursor-pointer"
            onClick={() => setIsGuestOpen(!isGuestOpen)}
          >
            <label className="block text-[10px] font-bold text-gray-700 uppercase mb-1">Khách</label>
            <div className="flex items-center justify-between text-sm text-gray-900">
              <span className="truncate pr-2">{getGuestLabel()}</span>
              <ChevronDown size={18} className={`transition-transform ${isGuestOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>

          {/* Menu xổ xuống (Dropdown Content) */}
          {isGuestOpen && (
            <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 mt-2 z-50 animate-in fade-in zoom-in-95 duration-200">
              <GuestCounter 
                label="Người lớn" 
                subLabel="Từ 13 tuổi trở lên"
                value={guests.adults}
                onDecrease={() => setGuests(prev => ({ ...prev, adults: Math.max(1, prev.adults - 1) }))} // Min 1 người lớn
                onIncrease={() => setGuests(prev => ({ ...prev, adults: prev.adults + 1 }))}
              />
              <GuestCounter 
                label="Trẻ em" 
                subLabel="Độ tuổi 2 - 12"
                value={guests.children}
                onDecrease={() => setGuests(prev => ({ ...prev, children: Math.max(0, prev.children - 1) }))}
                onIncrease={() => setGuests(prev => ({ ...prev, children: prev.children + 1 }))}
              />
              <GuestCounter 
                label="Em bé" 
                subLabel="Dưới 2 tuổi"
                value={guests.infants}
                onDecrease={() => setGuests(prev => ({ ...prev, infants: Math.max(0, prev.infants - 1) }))}
                onIncrease={() => setGuests(prev => ({ ...prev, infants: prev.infants + 1 }))}
              />
              
              <div className="mt-4 pt-3 text-right">
                <button 
                  onClick={() => setIsGuestOpen(false)}
                  className="text-sm font-semibold underline text-gray-800 hover:text-black"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Button & Chi tiết giá (Giữ nguyên logic cũ) */}
      <button className="w-full bg-rose-500 hover:bg-rose-600 transition text-white font-bold py-3.5 rounded-lg text-base shadow-md mb-3">
        Đặt phòng ngay
      </button>

      <div className="space-y-3 border-t border-gray-100 pt-4 mt-4">
        <div className="flex justify-between text-gray-600 text-base">
          <span className="underline decoration-gray-300 decoration-dotted">
            {formatCurrency(pricePerNight)} x {nights} đêm
          </span>
          <span>{formatCurrency(pricePerNight * nights)}</span>
        </div>
        <div className="flex justify-between items-center border-t border-gray-200 mt-4 pt-4">
          <span className="font-bold text-gray-900 text-lg">Tổng cộng</span>
          <span className="font-bold text-gray-900 text-lg">{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </div>
  );
}