import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Calendar, User, Phone, CheckCircle2, XCircle, Clock,
    ArrowRight, Search, Eye, LogOut, RefreshCcw, Info,
    CalendarRange, Tag, DollarSign, Key, Ban, ChevronLeft, ChevronRight,
    ArrowLeftRight
} from 'lucide-react';
import DashboardLayout from '../components/admin/layout/DashboardLayout';
import BookingDetailModal from '../components/booking/BookingDetailModal';
import bookingAPI from '../services/booking';
import api from '../services/api';
import { toast } from 'react-toastify';

// Currency Formatter Helper
const formatVND = (value) =>
    new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(value);

// Date Formatter Helper
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
};

const STATUS_MAP = {
    PENDING: { label: 'Chờ thanh toán', cls: 'bg-amber-50 text-amber-600 border-amber-200' },
    CONFIRMED: { label: 'Đã xác nhận', cls: 'bg-blue-50 text-blue-600 border-blue-200' },
    CHECKED_IN: { label: 'Đã nhận phòng', cls: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    COMPLETED: { label: 'Hoàn thành', cls: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    CANCELLED: { label: 'Đã hủy', cls: 'bg-rose-50 text-rose-500 border-rose-200' },
    EXPIRED: { label: 'Hết hạn', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
};

function StatusBadge({ status }) {
    const s = STATUS_MAP[status] ?? { label: status, cls: 'bg-gray-100 text-gray-500 border-gray-200' };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${s.cls}`}>
            {s.label}
        </span>
    );
}

function StatCard({ title, value, icon, accentColor }) {
    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 transition-all hover:shadow-md">
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: accentColor + '10', color: accentColor }}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-xl font-bold text-gray-800 mt-1 truncate">{value}</p>
            </div>
        </div>
    );
}

export default function BookingPage() {
    const navigate = useNavigate();

    // State Management
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Modals & Action States
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [confirmModal, setConfirmModal] = useState({ open: false, type: '', booking: null });

    // Filters State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 8;

    // Change Room Modal States
    const [changeRoomOpen, setChangeRoomOpen] = useState(false);
    const [changeRoomBooking, setChangeRoomBooking] = useState(null);
    const [selectedAllocation, setSelectedAllocation] = useState(null);
    const [availableRoomTypes, setAvailableRoomTypes] = useState([]);
    const [selectedRoomType, setSelectedRoomType] = useState('');
    const [availableRooms, setAvailableRooms] = useState([]);
    const [selectedTargetRoomId, setSelectedTargetRoomId] = useState('');
    const [recalculatePrice, setRecalculatePrice] = useState(false);
    const [loadingChangeRoom, setLoadingChangeRoom] = useState(false);
    const [fetchingTypes, setFetchingTypes] = useState(false);
    const [fetchingRooms, setFetchingRooms] = useState(false);

    // Load Bookings Data
    const fetchBookings = useCallback(async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);

        try {
            // Fetch all bookings from backend
            const response = await bookingAPI.getAll();
            const bookingsList = Array.isArray(response) ? response : (response.data || []);
            setBookings(bookingsList);
        } catch (err) {
            console.error('Lỗi khi tải danh sách đặt phòng:', err);
            toast.error('Không thể tải danh sách đặt phòng!');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    // Statistics Calculations
    const stats = useMemo(() => {
        const counts = { ALL: bookings.length, PENDING: 0, CONFIRMED: 0, CHECKED_IN: 0, COMPLETED: 0 };
        bookings.forEach(b => {
            if (b.status in counts) {
                counts[b.status] += 1;
            }
        });
        return counts;
    }, [bookings]);

    // Client-Side Search & Filtering
    const filteredBookings = useMemo(() => {
        return bookings.filter(booking => {
            // 1. Search Query Match
            const q = searchQuery.toLowerCase().trim();
            const matchSearch = !q ||
                booking.booking_code?.toLowerCase().includes(q) ||
                booking.guest_name?.toLowerCase().includes(q) ||
                booking.guest_phone?.includes(q) ||
                booking.guest_email?.toLowerCase().includes(q);

            // 2. Status Filter Match
            const matchStatus = statusFilter === 'ALL' || booking.status === statusFilter;

            // 3. Date Range Match (Filters by Check-in Date)
            let matchDate = true;
            if (dateRange.start) {
                const checkInTime = new Date(booking.check_in_date).setHours(0, 0, 0, 0);
                const startTime = new Date(dateRange.start).setHours(0, 0, 0, 0);
                matchDate = checkInTime >= startTime;
            }
            if (matchDate && dateRange.end) {
                const checkInTime = new Date(booking.check_in_date).setHours(0, 0, 0, 0);
                const endTime = new Date(dateRange.end).setHours(23, 59, 59, 999);
                matchDate = checkInTime <= endTime;
            }

            return matchSearch && matchStatus && matchDate;
        });
    }, [bookings, searchQuery, statusFilter, dateRange]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
    const paginatedBookings = useMemo(() => {
        return filteredBookings.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE
        );
    }, [filteredBookings, currentPage]);

    // Reset to first page on filter change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter, dateRange]);

    // Action Handlers
    const handleViewDetails = (booking) => {
        setSelectedBooking(booking);
        setDetailOpen(true);
    };

    const handleCheckIn = async (booking) => {
        const allocationId = booking.bookingRooms?.[0]?.allocation?.id;
        if (!allocationId) {
            toast.warning('Đặt phòng này chưa được gán phòng cụ thể! Vui lòng gán phòng trước khi nhận phòng.');
            return;
        }

        setConfirmModal({
            open: true,
            type: 'CHECK_IN',
            booking,
            message: `Xác nhận thực hiện Check-in nhận phòng cho khách hàng ${booking.guest_name}?`,
            action: async () => {
                try {
                    await bookingAPI.updateRoomStatus(booking.id, 'CHECKED_IN', allocationId);
                    toast.success('Nhận phòng (Check-in) thành công!');
                    fetchBookings();
                } catch (err) {
                    console.error(err);
                    toast.error('Có lỗi xảy ra khi thực hiện Check-in!');
                }
            }
        });
    };

    const handleCheckOut = (booking) => {
        const roomNumber = booking.bookingRooms?.[0]?.allocation?.room?.room_number || 'Phòng nghỉ';

        // Construct check-out state structure and navigate
        navigate('/admin/checkout/', {
            state: {
                bookingData: {
                    booking_id: booking.id,
                    booking_code: booking.booking_code,
                    guest_name: booking.guest_name,
                    guest_phone: booking.guest_phone,
                    guest_email: booking.guest_email,
                    check_in_date: booking.check_in_date,
                    check_out_date: booking.check_out_date,
                    total_booking_price: booking.total_price,
                    status: booking.status,
                    payment_status: booking.payment_status,
                    bookingDetails: booking.bookingDetails,
                    serviceOrders: booking.serviceOrders,
                },
                room_number: roomNumber
            }
        });
    };

    const handleCancelBooking = (booking) => {
        setConfirmModal({
            open: true,
            type: 'CANCEL',
            booking,
            message: `Bạn có chắc chắn muốn HỦY đơn đặt phòng ${booking.booking_code} của khách hàng ${booking.guest_name}? Hành động này sẽ giải phóng tất cả phòng đã gán.`,
            action: async () => {
                try {
                    await api.post(`/bookings/${booking.id}/cancel`);
                    toast.success('Đã hủy đặt phòng thành công!');
                    fetchBookings();
                } catch (err) {
                    console.error(err);
                    toast.error('Có lỗi xảy ra khi hủy đặt phòng!');
                }
            }
        });
    };

    const fetchAvailableRoomTypes = async (booking, allocation) => {
        setFetchingTypes(true);
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const bookingCheckInStr = new Date(booking.check_in_date).toISOString().split('T')[0];
            const checkIn = bookingCheckInStr > todayStr ? bookingCheckInStr : todayStr;
            const checkOut = new Date(booking.check_out_date).toISOString().split('T')[0];

            const res = await api.post('/availability/search', { checkIn, checkOut });
            setAvailableRoomTypes(res.data?.availableRoomTypes || []);
        } catch (err) {
            console.error('Lỗi khi tải danh sách loại phòng khả dụng:', err);
            toast.error('Không thể kiểm tra loại phòng trống!');
        } finally {
            setFetchingTypes(false);
        }
    };

    const handleOpenChangeRoom = async (booking) => {
        setChangeRoomBooking(booking);
        setChangeRoomOpen(true);
        setSelectedRoomType('');
        setAvailableRooms([]);
        setSelectedTargetRoomId('');
        setRecalculatePrice(false);

        const allocations = booking.bookingRooms?.filter(br => br.allocation).map(br => br.allocation) || [];
        if (allocations.length > 0) {
            setSelectedAllocation(allocations[0]);
            await fetchAvailableRoomTypes(booking, allocations[0]);
        }
    };

    const handleAllocationChange = async (allocId) => {
        const allocations = changeRoomBooking?.bookingRooms?.filter(br => br.allocation).map(br => br.allocation) || [];
        const alloc = allocations.find(a => a.id === parseInt(allocId));
        if (alloc) {
            setSelectedAllocation(alloc);
            setSelectedRoomType('');
            setAvailableRooms([]);
            setSelectedTargetRoomId('');
            await fetchAvailableRoomTypes(changeRoomBooking, alloc);
        }
    };

    const handleRoomTypeChange = async (roomTypeId) => {
        setSelectedRoomType(roomTypeId);
        setSelectedTargetRoomId('');
        setAvailableRooms([]);

        if (!roomTypeId) return;

        setFetchingRooms(true);
        try {
            const todayStr = new Date().toISOString().split('T')[0];
            const bookingCheckInStr = new Date(changeRoomBooking.check_in_date).toISOString().split('T')[0];
            const checkIn = bookingCheckInStr > todayStr ? bookingCheckInStr : todayStr;
            const checkOut = new Date(changeRoomBooking.check_out_date).toISOString().split('T')[0];

            const res = await api.post('/availability/available-rooms', {
                roomTypeId: parseInt(roomTypeId),
                checkIn,
                checkOut
            });
            setAvailableRooms(res.data?.data || []);
        } catch (err) {
            console.error('Lỗi khi tải danh sách phòng trống:', err);
            toast.error('Không thể tải danh sách phòng trống!');
        } finally {
            setFetchingRooms(false);
        }
    };

    const handleSubmitChangeRoom = async () => {
        if (!selectedTargetRoomId) {
            toast.warning('Vui lòng chọn phòng vật lý mới!');
            return;
        }

        setLoadingChangeRoom(true);
        try {
            await bookingAPI.changeRoom(
                changeRoomBooking.id,
                selectedAllocation.id,
                parseInt(selectedTargetRoomId),
                recalculatePrice
            );
            toast.success('Chuyển phòng thành công!');
            setChangeRoomOpen(false);
            setChangeRoomBooking(null);
            setSelectedAllocation(null);
            fetchBookings();
        } catch (err) {
            console.error(err);
            toast.error(err.message || err.error || 'Lỗi khi thực hiện chuyển phòng!');
        } finally {
            setLoadingChangeRoom(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">

                {/* Header Block */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <CalendarRange className="text-blue-600" size={28} />
                            Quản lý đặt phòng
                        </h1>
                        <p className="text-sm text-gray-500">Xem, tìm kiếm, check-in, check-out và quản lý lịch sử đặt phòng của khách sạn</p>
                    </div>

                    <button
                        onClick={() => fetchBookings(true)}
                        disabled={refreshing}
                        className="px-4 py-2 border border-gray-200 hover:border-blue-500 hover:text-blue-600 bg-white text-gray-600 rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <RefreshCcw size={16} className={refreshing ? 'animate-spin text-blue-600' : ''} />
                        Làm mới
                    </button>
                </div>

                {/* Dynamic Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <StatCard
                        title="Tổng Đơn Đặt"
                        value={`${stats.ALL} đơn`}
                        icon={<CalendarRange size={22} />}
                        accentColor="#3b82f6"
                    />
                    <StatCard
                        title="Chờ Thanh Toán"
                        value={`${stats.PENDING} đơn`}
                        icon={<Clock size={22} />}
                        accentColor="#f59e0b"
                    />
                    <StatCard
                        title="Đã Xác Nhận"
                        value={`${stats.CONFIRMED} đơn`}
                        icon={<CheckCircle2 size={22} />}
                        accentColor="#2563eb"
                    />
                    <StatCard
                        title="Đang Lưu Trú"
                        value={`${stats.CHECKED_IN} đơn`}
                        icon={<Key size={22} />}
                        accentColor="#4f46e5"
                    />
                    <StatCard
                        title="Đã Hoàn Thành"
                        value={`${stats.COMPLETED} đơn`}
                        icon={<CheckCircle2 size={22} />}
                        accentColor="#10b981"
                    />
                </div>

                {/* Filter Controls Panel */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
                    <div className="flex flex-col md:flex-row gap-4">

                        {/* Live Search */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Tìm mã đặt, tên khách hàng, SĐT, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                            />
                            <Search className="absolute left-3.5 top-3.5 text-gray-400" size={16} />
                        </div>

                        {/* Check-in Date Filter */}
                        <div className="flex flex-col sm:flex-row items-center gap-2">
                            <div className="flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 shadow-sm w-full sm:w-auto">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Từ ngày</span>
                                <input
                                    type="date"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange(r => ({ ...r, start: e.target.value }))}
                                    className="text-xs outline-none bg-transparent text-gray-700 font-semibold focus:text-blue-600"
                                />
                            </div>
                            <span className="text-gray-400 hidden sm:inline">—</span>
                            <div className="flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 shadow-sm w-full sm:w-auto">
                                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Đến ngày</span>
                                <input
                                    type="date"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange(r => ({ ...r, end: e.target.value }))}
                                    className="text-xs outline-none bg-transparent text-gray-700 font-semibold focus:text-blue-600"
                                />
                            </div>
                            {(dateRange.start || dateRange.end) && (
                                <button
                                    onClick={() => setDateRange({ start: '', end: '' })}
                                    className="text-xs font-bold text-red-500 hover:text-red-700 underline px-2 flex-shrink-0"
                                >
                                    Xóa lọc ngày
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Status Select Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 border-t border-gray-100 pt-4">
                        <span className="text-xs font-bold uppercase text-gray-400 tracking-wider mr-2">Trạng thái:</span>
                        {[
                            { value: 'ALL', label: 'Tất cả' },
                            { value: 'PENDING', label: 'Chờ thanh toán' },
                            { value: 'CONFIRMED', label: 'Đã xác nhận' },
                            { value: 'CHECKED_IN', label: 'Đang lưu trú' },
                            { value: 'COMPLETED', label: 'Hoàn thành' },
                            { value: 'CANCELLED', label: 'Đã hủy' },
                        ].map((tab) => (
                            <button
                                key={tab.value}
                                onClick={() => setStatusFilter(tab.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${statusFilter === tab.value
                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-100'
                                    : 'bg-white border-gray-200 text-gray-500 hover:border-blue-500 hover:text-blue-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings Table Block */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-xs font-semibold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                                    <th className="px-5 py-4 whitespace-nowrap">Mã Đặt</th>
                                    <th className="px-5 py-4 whitespace-nowrap">Khách Hàng</th>
                                    <th className="px-5 py-4 whitespace-nowrap">Ngày Ở</th>
                                    <th className="px-5 py-4 whitespace-nowrap text-center">Phòng</th>
                                    <th className="px-5 py-4 whitespace-nowrap text-right">Tổng Tiền</th>
                                    <th className="px-5 py-4 whitespace-nowrap text-center">Trạng Thái</th>
                                    <th className="px-5 py-4 whitespace-nowrap text-center">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-16">
                                            <div className="flex flex-col items-center justify-center gap-3">
                                                <div className="w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-blue-600 animate-spin" />
                                                <span className="text-xs text-gray-400 font-medium">Đang tải danh sách đặt phòng...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paginatedBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-20 text-gray-400">
                                            <div className="flex flex-col items-center gap-3">
                                                <span className="text-4xl">📭</span>
                                                <span className="font-semibold text-sm">Không tìm thấy đơn đặt phòng nào</span>
                                                <span className="text-xs text-gray-400">Hãy thử thay đổi từ khóa hoặc bộ lọc</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedBookings.map((b) => {
                                        // Extract allocated room number list
                                        const roomNumbers = b.bookingRooms?.filter(br => br.allocation?.room)
                                            .map(br => br.allocation.room.room_number)
                                            .join(', ') || 'Chưa gán';

                                        // Compute check-out nights
                                        const nights = Math.max(1, Math.ceil((new Date(b.check_out_date).getTime() - new Date(b.check_in_date).getTime()) / (1000 * 3600 * 24)));

                                        return (
                                            <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                                                {/* Booking Code */}
                                                <td className="px-5 py-4">
                                                    <span className="font-mono font-bold text-blue-600 text-xs block hover:underline cursor-pointer" onClick={() => handleViewDetails(b)}>
                                                        {b.booking_code}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400 block mt-0.5">{formatDate(b.created_at)}</span>
                                                </td>

                                                {/* Guest Details */}
                                                <td className="px-5 py-4">
                                                    <p className="font-bold text-gray-800">{b.guest_name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                                                        <span className="flex items-center gap-1 font-medium"><Phone size={10} /> {b.guest_phone}</span>
                                                    </div>
                                                </td>

                                                {/* Stay Dates */}
                                                <td className="px-5 py-4 text-xs font-semibold text-gray-600">
                                                    <div className="flex items-center gap-1.5">
                                                        <span>{formatDate(b.check_in_date)}</span>
                                                        <ArrowRight size={10} className="text-gray-300" />
                                                        <span>{formatDate(b.check_out_date)}</span>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 block mt-0.5">{nights} đêm</span>
                                                </td>

                                                {/* Rooms */}
                                                <td className="px-5 py-4 text-center">
                                                    {roomNumbers !== 'Chưa gán' ? (
                                                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-black border border-blue-100">
                                                            {roomNumbers}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 font-semibold italic flex items-center justify-center gap-1">
                                                            <Info size={12} className="text-amber-500" /> Chưa gán
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Price */}
                                                <td className="px-5 py-4 text-right">
                                                    <p className="font-black text-gray-800 font-sans">{formatVND(b.total_price)}</p>
                                                    {/* <span className={`text-[10px] font-bold block mt-0.5 uppercase ${
                            b.payment_status === 'PAID' ? 'text-green-600' : 'text-rose-500'
                          }`}>
                            {b.payment_status === 'PAID' ? 'Đã thanh toán' : 'Chưa trả tiền'}
                          </span> */}
                                                </td>

                                                {/* Status */}
                                                <td className="px-5 py-4 text-center">
                                                    <StatusBadge status={b.status} />
                                                </td>

                                                {/* Table Actions */}
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {/* View Detail Action */}
                                                        <button
                                                            onClick={() => handleViewDetails(b)}
                                                            title="Xem chi tiết"
                                                            className="p-1.5 hover:bg-slate-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                                                        >
                                                            <Eye size={16} />
                                                        </button>

                                                        {/* Check-In Action (Only CONFIRMED or PENDING with assigned room) */}
                                                        {(b.status === 'CONFIRMED' || b.status === 'PENDING') && (
                                                            <button
                                                                onClick={() => handleCheckIn(b)}
                                                                title="Check-in nhận phòng"
                                                                className="p-1.5 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                                                            >
                                                                <Key size={16} />
                                                            </button>
                                                        )}

                                                        {/* Check-Out Action (Only CHECKED_IN) */}
                                                        {b.status === 'CHECKED_IN' && (
                                                            <button
                                                                onClick={() => handleCheckOut(b)}
                                                                title="Check-out thanh toán"
                                                                className="p-1.5 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors border border-transparent hover:border-indigo-200"
                                                            >
                                                                <LogOut size={16} />
                                                            </button>
                                                        )}

                                                        {/* Change Room Action (Only CONFIRMED or CHECKED_IN) */}
                                                        {(b.status === 'CONFIRMED' || b.status === 'CHECKED_IN') && b.bookingRooms?.some(br => br.allocation) && (
                                                            <button
                                                                onClick={() => handleOpenChangeRoom(b)}
                                                                title="Chuyển phòng"
                                                                className="p-1.5 hover:bg-sky-50 text-gray-400 hover:text-sky-600 rounded-lg transition-colors border border-transparent hover:border-sky-200"
                                                            >
                                                                <ArrowLeftRight size={16} />
                                                            </button>
                                                        )}

                                                        {/* Cancel Booking Action (Only PENDING or CONFIRMED) */}
                                                        {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                                                            <button
                                                                onClick={() => handleCancelBooking(b)}
                                                                title="Hủy đặt phòng"
                                                                className="p-1.5 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                                                            >
                                                                <Ban size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Component */}
                    {!loading && totalPages > 1 && (
                        <div className="px-5 py-4 bg-white border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500 font-semibold hidden sm:block">
                                Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} đến {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} trong tổng số {filteredBookings.length} đặt phòng
                            </span>
                            <div className="flex items-center gap-1.5 ml-auto">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border border-gray-200 rounded-xl text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-colors"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <span className="text-xs font-bold text-gray-600 px-3">
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border border-gray-200 rounded-xl text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-colors"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── DETAIL MODAL REUSE ────────────────────────────────────────── */}
            {detailOpen && selectedBooking && (
                <BookingDetailModal
                    booking={{
                        ...selectedBooking,
                        // Re-map IDs since BookingDetailModal expects specific snapshots
                        booking_id: selectedBooking.id,
                        bookingDetails: selectedBooking.bookingDetails,
                    }}
                    onClose={() => {
                        setDetailOpen(false);
                        setSelectedBooking(null);
                    }}
                    formatCurrency={formatVND}
                />
            )}

            {/* ── ACTION CONFIRMATION MODAL ─────────────────────────────────── */}
            {confirmModal.open && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200 space-y-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            {confirmModal.type === 'CHECK_IN' ? (
                                <>
                                    <Key className="text-emerald-500 animate-bounce" size={22} />
                                    <span>Xác nhận Check-in</span>
                                </>
                            ) : (
                                <>
                                    <Ban className="text-rose-500 animate-pulse" size={22} />
                                    <span>Xác nhận Hủy Đặt Phòng</span>
                                </>
                            )}
                        </h3>

                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                            {confirmModal.message}
                        </p>

                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setConfirmModal({ open: false, type: '', booking: null })}
                                className="flex-1 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={async () => {
                                    const action = confirmModal.action;
                                    setConfirmModal({ open: false, type: '', booking: null });
                                    if (action) await action();
                                }}
                                className={`flex-1 py-2.5 px-4 font-bold rounded-xl text-sm transition-all text-white ${confirmModal.type === 'CHECK_IN'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-100'
                                    : 'bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-100'
                                    }`}
                            >
                                Đồng ý thực hiện
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── CHANGE ROOM MODAL ────────────────────────────────────────── */}
            {changeRoomOpen && changeRoomBooking && selectedAllocation && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-7 shadow-2xl animate-in zoom-in-95 duration-200 space-y-6 border border-gray-100">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2.5">
                                <ArrowLeftRight className="text-blue-600 animate-pulse" size={24} />
                                <span>Chuyển phòng nghỉ</span>
                            </h3>
                            <button
                                onClick={() => setChangeRoomOpen(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold p-1 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <XCircle size={20} />
                            </button>
                        </div>

                        {/* Booking Context Info */}
                        <div className="bg-slate-50/70 rounded-2xl p-4 border border-gray-100 grid grid-cols-2 gap-3 text-xs">
                            <div>
                                <span className="text-gray-400 font-semibold block uppercase tracking-wider">Khách hàng</span>
                                <span className="font-bold text-gray-800 text-sm mt-0.5 block">{changeRoomBooking.guest_name}</span>
                            </div>
                            <div>
                                <span className="text-gray-400 font-semibold block uppercase tracking-wider">Mã đặt phòng</span>
                                <span className="font-mono font-bold text-blue-600 text-sm mt-0.5 block">{changeRoomBooking.booking_code}</span>
                            </div>
                            <div className="mt-1">
                                <span className="text-gray-400 font-semibold block uppercase tracking-wider">Kỳ lưu trú còn lại</span>
                                <span className="font-bold text-gray-700 mt-0.5 block">
                                    Từ Hôm nay → {formatDate(changeRoomBooking.check_out_date)}
                                </span>
                            </div>
                            <div className="mt-1 col-span-1">
                                <span className="text-gray-400 font-semibold block uppercase tracking-wider">Trạng thái</span>
                                <div className="mt-1"><StatusBadge status={changeRoomBooking.status} /></div>
                            </div>
                        </div>

                        {/* Multiple Room Allocation Select (If exists) */}
                        {changeRoomBooking.bookingRooms?.filter(br => br.allocation).length > 1 && (
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Chọn phòng cần đổi</label>
                                <select
                                    value={selectedAllocation.id}
                                    onChange={(e) => handleAllocationChange(e.target.value)}
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                                >
                                    {changeRoomBooking.bookingRooms
                                        .filter(br => br.allocation)
                                        .map(br => (
                                            <option key={br.allocation.id} value={br.allocation.id}>
                                                Phòng {br.allocation.room?.room_number || 'N/A'} ({br.roomType?.name || 'N/A'})
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>
                        )}

                        {/* Step 1: Choose Room Type */}
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                                    Bước 1: Chọn loại phòng mới
                                </label>
                                {fetchingTypes && (
                                    <span className="text-[10px] text-blue-600 font-semibold animate-pulse flex items-center gap-1">
                                        <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
                                        Đang kiểm tra phòng trống...
                                    </span>
                                )}
                            </div>
                            <select
                                value={selectedRoomType}
                                onChange={(e) => handleRoomTypeChange(e.target.value)}
                                disabled={fetchingTypes}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 outline-none text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white disabled:opacity-50"
                            >
                                <option value="">-- Chọn loại phòng muốn đổi --</option>
                                {availableRoomTypes.map(rt => (
                                    <option key={rt.roomTypeId} value={rt.roomTypeId}>
                                        {rt.name} (Còn {rt.availableCount} phòng trống - {formatVND(rt.basePrice)}/đêm)
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Step 2: Choose Physical Room */}
                        {selectedRoomType && (
                            <div className="space-y-2 animate-in slide-in-from-top-3 duration-200">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">
                                        Bước 2: Chọn số phòng vật lý trống
                                    </label>
                                    {fetchingRooms && (
                                        <span className="text-[10px] text-blue-600 font-semibold animate-pulse flex items-center gap-1">
                                            <div className="w-2.5 h-2.5 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
                                            Đang tải số phòng...
                                        </span>
                                    )}
                                </div>
                                
                                {availableRooms.length === 0 && !fetchingRooms ? (
                                    <p className="text-xs text-rose-500 font-semibold italic bg-rose-50 border border-rose-100 rounded-xl p-3">
                                        Rất tiếc! Không còn phòng vật lý nào trống hoàn toàn thuộc loại phòng này cho thời gian còn lại.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-4 gap-2">
                                        {availableRooms.map(room => (
                                            <button
                                                key={room.id}
                                                type="button"
                                                onClick={() => setSelectedTargetRoomId(room.id)}
                                                className={`py-2 rounded-xl text-sm font-black border transition-all ${
                                                    selectedTargetRoomId === room.id
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100 scale-105'
                                                        : 'bg-white border-gray-200 text-gray-700 hover:border-blue-500 hover:text-blue-600'
                                                }`}
                                            >
                                                {room.room_number}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Price Recalculation Toggle */}
                        {selectedRoomType && selectedTargetRoomId && (
                            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in duration-300">
                                <input
                                    type="checkbox"
                                    id="recalcCheck"
                                    checked={recalculatePrice}
                                    onChange={(e) => setRecalculatePrice(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1 cursor-pointer"
                                />
                                <div className="space-y-0.5 cursor-pointer select-none" onClick={() => setRecalculatePrice(!recalculatePrice)}>
                                    <label htmlFor="recalcCheck" className="text-xs font-bold text-gray-800 cursor-pointer block">
                                        Tính toán lại hóa đơn đặt phòng
                                    </label>
                                    <p className="text-[10px] text-gray-500 leading-normal font-medium">
                                        Nếu được kích hoạt, giá phòng của các đêm còn lại sẽ được cập nhật tự động theo đơn giá của loại phòng mới (đã bao gồm chiết khấu khuyến mãi hiện có và +8% VAT).
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-2 border-t border-gray-100">
                            <button
                                onClick={() => setChangeRoomOpen(false)}
                                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-all"
                            >
                                Đóng
                            </button>
                            <button
                                onClick={handleSubmitChangeRoom}
                                disabled={loadingChangeRoom || !selectedTargetRoomId}
                                className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-100 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loadingChangeRoom && <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                                Xác nhận đổi phòng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
