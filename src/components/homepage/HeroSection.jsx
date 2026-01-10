import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { vi } from 'date-fns/locale';
import { Calendar, User, Search } from 'lucide-react';

export default function HeroSection() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 1)));

  return (
    <div className="relative pt-20">
      {/* Background Image */}
      <div className="h-[600px] md:h-[700px] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2049&auto=format&fit=crop" 
          alt="Luxury Pool" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <span className="text-white/90 text-sm md:text-base uppercase tracking-[0.2em] mb-4 animate-fade-in-up">Chào mừng đến với Dora Hotel</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl drop-shadow-lg">
            Trải nghiệm kỳ nghỉ tuyệt vời <br/> nhất của bạn
          </h1>
          <p className="text-gray-200 text-lg max-w-2xl mb-10 hidden md:block">
            Tận hưởng không gian sang trọng, dịch vụ đẳng cấp 5 sao và view biển tuyệt đẹp ngay tại trung tâm thành phố.
          </p>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className="max-w-6xl mx-auto px-4 relative -mt-16 z-20">
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-end border border-gray-100">
          
          {/* Ngày nhận */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <Calendar size={14} /> Ngày nhận phòng
            </label>
            <DatePicker 
              selected={startDate} 
              onChange={date => setStartDate(date)} 
              className="w-full border-b-2 border-gray-200 pb-2 text-gray-900 font-semibold focus:outline-none focus:border-blue-500 bg-transparent cursor-pointer"
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              locale={vi}
            />
          </div>

          {/* Ngày trả */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <Calendar size={14} /> Ngày trả phòng
            </label>
            <DatePicker 
              selected={endDate} 
              onChange={date => setEndDate(date)} 
              className="w-full border-b-2 border-gray-200 pb-2 text-gray-900 font-semibold focus:outline-none focus:border-blue-500 bg-transparent cursor-pointer"
              dateFormat="dd/MM/yyyy"
              minDate={startDate}
              locale={vi}
            />
          </div>

          {/* Loại phòng & Khách */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-1">
              <User size={14} /> Số khách & Loại phòng
            </label>
            <select className="w-full border-b-2 border-gray-200 pb-2 text-gray-900 font-semibold focus:outline-none focus:border-blue-500 bg-transparent cursor-pointer appearance-none">
              <option>2 Người lớn, 1 Trẻ em</option>
              <option>1 Người lớn</option>
              <option>4 Người lớn (Gia đình)</option>
            </select>
          </div>

          {/* Button Search */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2">
            <Search size={20} /> Tìm kiếm
          </button>

        </div>
      </div>
    </div>
  );
}