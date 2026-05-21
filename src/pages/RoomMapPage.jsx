// src/features/room-map/pages/RoomMapPage.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { RotateCcw, Calendar, ReceiptText, QrCode, PlayCircle, Filter } from 'lucide-react';
import RoomMapSidebar from '../components/admin/maproom/RoomMapSidebar';
import RoomCard from '../components/admin/maproom/RoomCard';
import roomAPI from '../services/room';
import bookingAPI from '../services/booking';
import shiftAPI from '../services/shift';

import ShiftDetailModal from '../components/admin/Model/ShiftDetailModal';
import EndShiftModal from '../components/admin/Model/EndShiftModal';
// IMPORT THÊM MODAL MỞ CA
import StartShiftModal from '../components/admin/Model/StartShiftModal';
import ShiftListModal from '../components/admin/Model/ShiftListModal';
import { useNavigate } from 'react-router-dom';
import QRScannerModal from '../components/admin/Model/QRScannerModal';
import QRScanResultModal from '../components/admin/Model/QRScanResultModal';
import { toast } from 'react-toastify';
import DashboardLayout from '../components/admin/layout/DashboardLayout';

export default function RoomMapPage() {
  const navigate = useNavigate();
  const [activeFloor, setActiveFloor] = useState('all');
  const [filterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);

  // QUẢN LÝ MODAL CA LÀM VIỆC
  const [currentShiftId, setCurrentShiftId] = useState(null);
  const [isStartShiftModalOpen, setIsStartShiftModalOpen] = useState(false);
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isEndShiftModalOpen, setIsEndShiftModalOpen] = useState(false);
  const [isListModalOpen, setListModalOpen] = useState(false);

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // --- LẤY THÔNG TIN CA HIỆN TẠI KHI LOAD TRANG ---
  const fetchCurrentShift = async () => {
    try {
      const userStr = localStorage.getItem('user');
      console.log("Kiểm tra ca làm việc hiện tại, user info:", userStr);
      if (!userStr) return;
      const user = JSON.parse(userStr);
      console.log("Gửi yêu cầu lấy ca làm việc hiện tại với user:", user.accountId);
      const response = await shiftAPI.getCurrentShift(user.accountId);
      // Nếu API trả về data hợp lệ, lưu lại ID. Nếu không, trả về null (chưa mở ca)
      if (response && response.id) {
        setCurrentShiftId(response.id);
      } else {
        setCurrentShiftId(null);
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra ca làm việc:", error);
      setCurrentShiftId(null);
    }
  };

  useEffect(() => {
    fetchCurrentShift();
  }, []);

  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState('all');
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const fetchRooms = async (checkIn = '', checkOut = '') => {
    try {
      setLoading(true);
      const response = await roomAPI.getRoomGridStatus(undefined, checkIn, checkOut);
      const rawData = Array.isArray(response) ? response : (response.data || []);

      const mappedData = rawData.map(room => {
        let uiStatus = 'AVAILABLE';
        if (room.status === 'CHECKED_IN') uiStatus = 'BOOKED';
        else if (room.status === 'MAINTENANCE') uiStatus = 'MAINTENANCE';

        return { ...room, ui_status: uiStatus, guestName: room.current_guest };
      });

      setRooms(mappedData);
    } catch (err) {
      console.error('Failed to fetch rooms:', err);
      toast.error('Không thể tải sơ đồ phòng!');
    } finally {
      setLoading(false);
    }
  };

  // Các Effect khác giữ nguyên như cũ
  useEffect(() => {
    fetchRooms();
    
    // Fetch room types too
    const fetchRoomTypes = async () => {
      try {
        const response = await roomAPI.getAllRoomTypes();
        const data = Array.isArray(response) ? response : (response.data || []);
        setRoomTypes(data);
      } catch (err) {
        console.error('Failed to fetch room types:', err);
      }
    };
    fetchRoomTypes();
  }, []);

  const handleFilter = () => {
    if ((checkInDate && !checkOutDate) || (!checkInDate && checkOutDate)) {
      toast.warn("Vui lòng chọn đầy đủ cả Ngày Check-in và Ngày Check-out!");
      return;
    }

    if (checkInDate && checkOutDate) {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);

      if (checkOut <= checkIn) {
        toast.error("Ngày Check-out phải lớn hơn Ngày Check-in!");
        return;
      }
      
      fetchRooms(checkInDate, checkOutDate);
    } else {
      fetchRooms();
    }
  };

  const handleReset = () => {
    setCheckInDate('');
    setCheckOutDate('');
    setSelectedRoomType('all');
    fetchRooms();
    toast.success("Đã đặt lại bộ lọc sơ đồ phòng!");
  };

  const handleScanSuccess = async (decodedText) => {
    try {
      setIsScannerOpen(false); // Đóng scanner

      // 1. Phân tích mã booking từ chuỗi QR được tạo ở BookingDetailModal.jsx
      let bookingCode = decodedText.trim();
      if (decodedText.includes("Mã:")) {
        const match = decodedText.match(/Mã:\s*([A-Za-z0-9-]+)/);
        if (match) {
          bookingCode = match[1].trim();
        }
      }

      if (!bookingCode) {
        toast.error("Không thể đọc được mã đặt phòng từ mã QR!");
        return;
      }

      toast.info(`Đang tải thông tin đặt phòng: ${bookingCode}...`);

      // 2. Gọi API để lấy chi tiết đặt phòng
      const response = await bookingAPI.getAll({ booking_code: bookingCode });
      const bookingsList = Array.isArray(response) ? response : (response.data || []);

      if (bookingsList.length === 0) {
        toast.error(`Không tìm thấy thông tin đặt phòng với mã: ${bookingCode}`);
        return;
      }

      const booking = bookingsList[0];
      setSelectedBooking(booking);
      setIsDetailModalOpen(true);
      toast.success("Tải thông tin đặt phòng thành công!");
    } catch (error) {
      console.error("Lỗi khi tìm kiếm booking sau quét QR:", error);
      toast.error("Có lỗi xảy ra khi tải thông tin đặt phòng!");
    }
  };

  const statusCounts = useMemo(() => {
    const initialCounts = { ALL: rooms.length, AVAILABLE: 0, BOOKED: 0, MAINTENANCE: 0 };
    return rooms.reduce((acc, room) => {
      if (room.ui_status in acc) acc[room.ui_status] += 1;
      return acc;
    }, initialCounts);
  }, [rooms]);

  const filteredRooms = rooms.filter(room => {
    const matchFloor = activeFloor === 'all' || room.floor?.id === activeFloor;
    const matchStatus = filterStatus === 'ALL' || room.ui_status === filterStatus;
    const matchRoomType = selectedRoomType === 'all' || room.roomType?.id === Number(selectedRoomType);
    return matchFloor && matchStatus && matchRoomType;
  });

  const uniqueFloors = useMemo(() => {
    const floors = [];
    const map = new Map();
    for (const room of rooms) {
      if (room.floor && !map.has(room.floor.id)) {
        map.set(room.floor.id, true);
        floors.push(room.floor);
      }
    }
    return floors.sort((a, b) => a.id - b.id);
  }, [rooms]);

  const renderRoomsByFloor = (floorId, floorName) => { /* Giữ nguyên UI RoomCard của bạn */
    const roomsInFloor = filteredRooms.filter(r => r.floor?.id === floorId);
    if (roomsInFloor.length === 0) return null;
    return (
      <div key={floorId} className="mb-8">
        <h3 className="text-gray-700 font-bold mb-4"><span className="bg-gray-200 px-2 py-1 rounded text-xs">{floorName}</span></h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {roomsInFloor.map(room => (
            <RoomCard key={room.id} room={{ ...room, status: room.ui_status, guestName: room.current_guest }} onClick={(data) => navigate(`/admin/detailroom`, { state: data })} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sơ Đồ Phòng Trống</h1>
          <p className="text-sm text-gray-500">Xem và quản lý trạng thái phòng theo thời gian thực</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setListModalOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition">Danh Sách Ca</button>
          <button onClick={() => navigate('/admin/dashboard')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm transition">Doanh Thu</button>
          <button onClick={() => setIsScannerOpen(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2 shadow-sm transition">
            <QrCode size={18} /> Quét mã QR
          </button>

          {/* LOGIC ĐIỀU KHIỂN NÚT CA LÀM VIỆC */}
          {!currentShiftId ? (
            // Nếu CHƯA MỞ CA -> Hiện nút Mở Ca màu Xanh lá
            <button
              onClick={() => setIsStartShiftModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2 shadow-sm shadow-emerald-200 transition"
            >
              <PlayCircle size={18} /> Mở Ca Mới
            </button>
          ) : (
            // Nếu ĐÃ MỞ CA -> Hiện nút Xem Thông Tin và Kết Ca
            <>
              <button
                onClick={() => setIsShiftModalOpen(true)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 text-gray-700"
              >
                <ReceiptText size={18} className="text-blue-600" /> Xem Thông Tin Ca
              </button>
              <button
                onClick={() => setIsEndShiftModalOpen(true)}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 flex items-center gap-2 shadow-sm shadow-rose-200 transition"
              >
                <RotateCcw size={18} /> Kết Ca
              </button>
            </>
          )}

        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        <div className="hidden lg:block lg:col-span-1 sticky top-6">
          <RoomMapSidebar activeFloor={activeFloor} onSelectFloor={setActiveFloor} statusCounts={statusCounts} />
        </div>

        {/* Nội dung bên trong bộ lọc giữ nguyên... */}
        <div className="lg:col-span-4 space-y-6">

          {/* Bộ lọc phòng trống cao cấp */}
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ngày Check-in</label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-gray-50 hover:bg-white transition-all"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ngày Check-out</label>
                <div className="relative">
                  <input
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-gray-50 hover:bg-white transition-all"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Loại phòng</label>
                <select
                  value={selectedRoomType}
                  onChange={(e) => setSelectedRoomType(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-700 bg-gray-50 hover:bg-white transition-all cursor-pointer"
                >
                  <option value="all">Tất Cả Loại Phòng</option>
                  {roomTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleFilter}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-indigo-100"
                >
                  <Filter size={16} /> Lọc Phòng
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center"
                  title="Đặt lại bộ lọc"
                >
                  <RotateCcw size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="min-h-[500px]">
            {loading && <div className="text-center text-gray-500 py-10">Đang tải...</div>}
            {!loading && (activeFloor === 'all' ? (uniqueFloors.length > 0 ? uniqueFloors.map(floor => renderRoomsByFloor(floor.id, floor.name)) : <div className="text-center">Không có dữ liệu</div>) : renderRoomsByFloor(activeFloor, uniqueFloors.find(f => f.id === activeFloor)?.name || `Tầng ${activeFloor}`))}
          </div>
        </div>
      </div>

      {/* --- CÁC MODALS --- */}

      {/* 1. Modal Mở Ca */}
      <StartShiftModal
        isOpen={isStartShiftModalOpen}
        onClose={() => setIsStartShiftModalOpen(false)}
        onSuccess={() => {
          setIsStartShiftModalOpen(false);
          fetchCurrentShift(); // Refresh lại ID ca để đổi nút
        }}
      />

      {/* 2. Modal Xem Ca */}
      <ShiftDetailModal
        isOpen={isShiftModalOpen}
        onClose={() => setIsShiftModalOpen(false)}
        shiftId={currentShiftId}
      />

      {/* 3. Modal Kết Ca */}
      <EndShiftModal
        isOpen={isEndShiftModalOpen}
        onClose={() => setIsEndShiftModalOpen(false)}
        shiftId={currentShiftId}
        onSuccess={() => {
          setIsEndShiftModalOpen(false);
          setCurrentShiftId(null); // Reset ID ca về null để hiện lại nút Mở Ca
        }}
      />

      <ShiftListModal
        isOpen={isListModalOpen}
        onClose={() => setListModalOpen(false)}
      />


      <QRScannerModal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} onScanSuccess={handleScanSuccess} />
      {isDetailModalOpen && selectedBooking && <QRScanResultModal isOpen={isDetailModalOpen} booking={selectedBooking} onClose={() => setIsDetailModalOpen(false)} />}
      </div>
    </DashboardLayout>
  );
}