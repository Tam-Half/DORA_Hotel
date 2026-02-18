// src/features/room-map/pages/RoomMapPage.jsx
import React, { useState, forwardRef, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ro, vi } from 'date-fns/locale';
import { Plus, RotateCcw, Calendar, ReceiptText } from 'lucide-react';
import RoomMapSidebar from '../components/admin/maproom/RoomMapSidebar';
import RoomCard from '../components/admin/maproom/RoomCard';
import roomAPI from '../services/room';
import ShiftDetailModal from '../components/admin/Model/ShiftDetailModal';

import { useNavigate } from 'react-router-dom';

// --- GIỮ NGUYÊN COMPONENT UI CỦA BẠN ---
const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
  <div className="relative w-full sm:w-auto cursor-pointer" onClick={onClick} ref={ref}>
    <input
      type="text"
      value={value}
      readOnly
      className="border border-gray-300 rounded-lg pl-3 pr-10 py-2 text-sm w-full sm:w-40 bg-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
      placeholder="Chọn ngày"
    />
    <Calendar size={16} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
  </div>
));

export default function RoomMapPage() {
  const navigate = useNavigate();
  const [activeFloor, setActiveFloor] = useState('all');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);


  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await roomAPI.getRoomGridStatus(); // API mới
        const rawData = Array.isArray(response) ? response : (response.data || []);

        const mappedData = rawData.map(room => {
          let uiStatus = 'AVAILABLE'; // Mặc định là Trống (Xanh)
          if (room.status === 'CHECKED_IN') {
            uiStatus = 'BOOKED'; // Có khách (Xám)
          } else if (room.status === 'MAINTENANCE') {
            uiStatus = 'MAINTENANCE'; // Bảo trì (Cam)
          }

          return {
            ...room,
            ui_status: uiStatus,
            guestName: room.current_guest
          };
        });

        setRooms(mappedData);
      } catch (err) {
        console.error('Failed to fetch rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);


  // 2. Tự động tính toán số lượng (SỬA LẠI LOGIC ĐẾM DỰA TRÊN MAPPING MỚI)
  const statusCounts = useMemo(() => {
    const initialCounts = {
      ALL: rooms.length,
      AVAILABLE: 0,
      BOOKED: 0,
      MAINTENANCE: 0
    };

    return rooms.reduce((acc, room) => {
      // Đếm dựa trên ui_status đã map ở trên
      const status = room.ui_status;
      if (acc.hasOwnProperty(status)) {
        acc[status] += 1;
      }
      return acc;
    }, initialCounts);
  }, [rooms]);


  // 3. Logic lọc phòng (CẬP NHẬT ĐỂ LỌC THEO UI STATUS)
  const filteredRooms = rooms.filter(room => {
    // room.floor cần được backend trả về (như Bước 1 đã hướng dẫn)
    const matchFloor = activeFloor === 'all' || room.floor?.id === activeFloor;

    // So sánh filterStatus (AVAILABLE/BOOKED) với ui_status
    const matchStatus = filterStatus === 'ALL' || room.ui_status === filterStatus;

    return matchFloor && matchStatus;
  });

  // 4. Lấy danh sách tầng (Cần backend trả về object floor)
  const uniqueFloors = useMemo(() => {
    const floors = [];
    const map = new Map();
    for (const room of rooms) {
      // Kiểm tra an toàn để tránh lỗi nếu backend quên trả floor
      if (room.floor && !map.has(room.floor.id)) {
        map.set(room.floor.id, true);
        floors.push(room.floor);
      }
    }
    return floors.sort((a, b) => a.id - b.id);
  }, [rooms]);

  // --- XỬ LÝ CLICK PHÒNG ---
  const handleRoomClick = (roomData) => {
    navigate(`/admin/detailroom`, { state: roomData });
  };

  // 5. Hàm render
  const renderRoomsByFloor = (floorId, floorName) => {
    const roomsInFloor = filteredRooms.filter(r => r.floor?.id === floorId);

    if (roomsInFloor.length === 0) return null;

    return (
      <div key={floorId} className="mb-8">
        <h3 className="text-gray-700 font-bold mb-4 flex items-center gap-2">
          <span className="bg-gray-200 px-2 py-1 rounded text-xs text-gray-600">
            {floorName} {/* Hiển thị tên tầng từ dữ liệu uniqueFloors */}
          </span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {roomsInFloor.map(room => (
            <RoomCard
              key={room.id}
              // Truyền prop room đã được mapping
              room={{
                ...room,
                status: room.ui_status, // RoomCard cũ sẽ nhận AVAILABLE hoặc BOOKED để tô màu đúng
                guestName: room.current_guest // API trả về current_guest, ta truyền vào cho RoomCard hiển thị
              }}
              onClick={handleRoomClick}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6">
      {/* Header Page - GIỮ NGUYÊN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sơ Đồ Phòng Trống</h1>
          <p className="text-sm text-gray-500">Xem và quản lý trạng thái phòng theo thời gian thực</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsShiftModalOpen(true)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 text-gray-700"
          >
            <ReceiptText size={18} className="text-blue-600" /> {/* Thêm icon cho đẹp */}
            Xem Thông Tin Ca
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2 shadow-sm shadow-blue-200">
            Kết Ca
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* SIDEBAR - GIỮ NGUYÊN */}
        <div className="hidden lg:block lg:col-span-1 sticky top-6">
          <RoomMapSidebar activeFloor={activeFloor} onSelectFloor={setActiveFloor} statusCounts={statusCounts} />
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-4 space-y-6">

          {/* FILTER BAR - GIỮ NGUYÊN */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">

            <div className="w-full sm:w-auto">
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Ngày nhận phòng</label>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                dateFormat="dd/MM/yyyy"
                locale={vi}
                customInput={<CustomDateInput />}
              />
            </div>

            <div className="w-full sm:w-auto flex-1">
              <label className="block text-xs font-bold text-gray-500 mb-1.5">Lọc theo loại phòng</label>
              <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                <option>Tất cả loại phòng</option>
                <option>Standard</option>
                <option>VIP</option>
              </select>
            </div>

            <div className="w-full sm:w-auto flex items-center bg-gray-100 p-1 rounded-lg">
              {[
                { id: 'ALL', label: 'Tất cả' },
                { id: 'AVAILABLE', label: 'Trống', dot: 'bg-blue-500' },
                { id: 'BOOKED', label: 'Đã đặt', dot: 'bg-gray-400' },
                { id: 'MAINTENANCE', label: 'Bảo trì', dot: 'bg-orange-500' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${filterStatus === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab.dot && <span className={`w-2 h-2 rounded-full ${tab.dot}`}></span>}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* ROOM GRID */}
          <div className="min-h-[500px]">
            {/* Hiển thị Loading */}
            {loading && <div className="text-center text-gray-500 py-10">Đang tải dữ liệu...</div>}

            {/* Hiển thị dữ liệu */}
            {!loading && (
              activeFloor === 'all' ? (
                uniqueFloors.length > 0 ? (
                  uniqueFloors.map(floor => renderRoomsByFloor(floor.id, floor.name))
                ) : (
                  <div className="text-center text-gray-500 py-10">Không có dữ liệu phòng.</div>
                )
              ) : (
                (() => {
                  const floor = uniqueFloors.find(f => f.id === activeFloor);
                  // Fallback tên tầng nếu không tìm thấy
                  const floorName = floor ? floor.name : `Tầng ${activeFloor}`;
                  return renderRoomsByFloor(activeFloor, floorName);
                })()
              )
            )}
          </div>
        </div>
      </div>
      <ShiftDetailModal 
        isOpen={isShiftModalOpen} 
        onClose={() => setIsShiftModalOpen(false)}
        shiftId={1} 
      />
    </div>
  );
}