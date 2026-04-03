import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Headphones, Bell, Loader2 } from 'lucide-react';
import { useGetBookingHistoryQuery, useCancelBookingMutation } from '../services/booking';
import { useCreatePayOSLinkMutation } from '../services/payment';
import { toast } from 'react-toastify';
import Header from '../components/layout/Header';
import { BookingStatus } from '../constants/Enums';
import BookingDetailModal, { StatusBadge } from '../components/booking/BookingDetailModal';

// --- 3. MAIN PAGE COMPONENT ---
const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');

export default function BookingHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: bookingsResponse, isLoading, error } = useGetBookingHistoryQuery();
  const [createPayOSLink, { isLoading: isPaymentLoading }] = useCreatePayOSLinkMutation();
  const [cancelBooking, { isLoading: isCancelLoading }] = useCancelBookingMutation();

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy đơn đặt phòng này?")) {
      try {
        const result = await cancelBooking(bookingId).unwrap();
        toast.success(result.message || "Hủy đơn đặt thành công");
      } catch (err) {
        console.error("Cancel error:", err);
        toast.error(err.data?.message || "Không thể hủy đơn đặt. Vui lòng thử lại.");
      }
    }
  };

  const handlePayNow = async (bookingId) => {
    try {
      const result = await createPayOSLink({ booking_id: bookingId }).unwrap();
      if (result.data && result.data.checkoutUrl) {
        toast.info("Đang chuyển hướng đến trang thanh toán...");
        window.location.href = result.data.checkoutUrl;
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Không thể tạo liên kết thanh toán. Vui lòng thử lại.");
    }
  };

  const bookings = bookingsResponse || [];

  const openDetailModal = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">

      {/* HEADER */}
      <Header />

      {/* CONTENT CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

        {/* Page Title */}
        <div className="mb-8 font-poppins">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lịch Sử Đặt Phòng</h1>
          <p className="text-gray-500">Quản lý và xem lại tất cả các giao dịch đặt phòng của bạn tại hệ thống DORA HOTEL.</p>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {isLoading ? (
            <div className="p-20 flex flex-col items-center justify-center">
              <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
              <p className="text-gray-500 font-medium">Đang tải lịch sử đặt phòng...</p>
            </div>
          ) : error ? (
            <div className="p-20 text-center text-red-500 font-bold">
              Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1500px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                    <th className="p-5">Phòng</th>
                    <th className="p-5">Mã đặt</th>
                    <th className="p-5">Ngày nhận - Ngày trả</th>
                    <th className="p-5">Tổng tiền</th>
                    <th className="p-5">Tình trạng</th>
                    <th className="p-5">Trạng thái</th>
                    <th className="p-5 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {bookings.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.bookingDetails?.[0]?.roomType?.images?.[0]?.url || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop'}
                            alt="Room"
                            className="w-16 h-12 rounded-lg object-cover shadow-sm"
                          />
                          <span className="font-bold text-gray-900 text-base">
                            {item.bookingDetails?.[0]?.roomType?.name || 'Phòng nghỉ'}
                          </span>
                        </div>
                      </td>

                      <td className="p-5 text-gray-500 font-medium">{item.booking_code}</td>

                      <td className="p-5 text-gray-600">
                        {new Date(item.check_in_date).toLocaleDateString('vi-VN')} - {new Date(item.check_out_date).toLocaleDateString('vi-VN')}
                      </td>

                      <td className="p-5 font-bold text-blue-600 text-base">{formatCurrency(item.total_price)}</td>
                      <td className="p-5 text-gray-600">{(item.payment_status) == 'paid' ? <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Đã thanh toán</span> : <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap">Chưa thanh toán</span>}</td>
                      <td className="p-5">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="p-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {item.status === 'PENDING' ? (
                            <button
                              disabled={isPaymentLoading}
                              onClick={() => handlePayNow(item.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-xs transition shadow-sm flex items-center gap-2"
                            >
                              {isPaymentLoading && <Loader2 size={12} className="animate-spin" />}
                              Thanh toán ngay
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => openDetailModal(item)}
                                className="text-blue-600 font-bold hover:underline"
                              >
                                Chi tiết
                              </button>
                              {[BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(item.status) && (
                                <button
                                  disabled={isCancelLoading}
                                  onClick={() => handleCancelBooking(item.id)}
                                  className="text-red-500 font-bold hover:underline disabled:opacity-50"
                                >
                                  {isCancelLoading ? 'Đang hủy...' : 'Hủy đặt'}
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL CHI TIẾT */}
        {isModalOpen && selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            onClose={closeDetailModal}
            formatCurrency={formatCurrency}
          />
        )}
      </div>
    </div>
  );
}
