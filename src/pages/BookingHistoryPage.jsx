import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Headphones, Bell, Loader2 } from 'lucide-react';
import { useGetBookingHistoryQuery } from '../services/booking';
import { useCreatePayOSLinkMutation } from '../services/payment';
import { toast } from 'react-toastify';

// --- HELPER COMPONENTS ---

// Component hiển thị Trạng thái (Badge)
const StatusBadge = ({ status }) => {
  const styles = {
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-700', label: 'Hoàn thành' },
    CONFIRMED: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Đã xác nhận' },
    CANCELLED: { bg: 'bg-red-100', text: 'text-red-700', label: 'Đã hủy' },
    PENDING: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Chờ thanh toán' },
  };

  const style = styles[status] || styles.PENDING;

  return (
    <span className={`${style.bg} ${style.text} px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap`}>
      {style.label}
    </span>
  );
};

// Component định dạng tiền tệ
const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);


// --- 3. MAIN PAGE COMPONENT ---
export default function BookingHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: bookingsResponse, isLoading, error } = useGetBookingHistoryQuery();
  const [createPayOSLink, { isLoading: isPaymentLoading }] = useCreatePayOSLinkMutation();

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

  const bookings = bookingsResponse?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-10">

      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 w-8 h-8 rounded flex items-center justify-center text-white font-bold">D</div>
          <span className="text-xl font-bold text-gray-900">DORA HOTEL</span>
        </div>
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
          <a href="/" className="hover:text-blue-600">Trang chủ</a>
          <a href="/searchrooms" className="hover:text-blue-600">Phòng</a>
          <a href="#" className="hover:text-blue-600">Dịch vụ</a>
          <a href="/user/historybooking" className="text-blue-600 font-bold">Lịch sử</a>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><Bell size={18} /></button>
          <div className="w-9 h-9 bg-yellow-200 rounded-full overflow-hidden border border-gray-300">
            <img src="https://ui-avatars.com/api/?name=User&background=random" alt="User" />
          </div>
        </div>
      </header>

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
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-wider border-b border-gray-100">
                    <th className="p-5">Phòng</th>
                    <th className="p-5">Mã đặt</th>
                    <th className="p-5">Ngày nhận/trả</th>
                    <th className="p-5">Tổng tiền</th>
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
                            src={item.bookingRooms?.[0]?.roomType?.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070&auto=format&fit=crop'}
                            alt="Room"
                            className="w-16 h-12 rounded-lg object-cover shadow-sm"
                          />
                          <span className="font-bold text-gray-900 text-base">
                            {item.bookingRooms?.[0]?.roomType?.name || 'Phòng nghỉ'}
                          </span>
                        </div>
                      </td>

                      <td className="p-5 text-gray-500 font-medium">{item.booking_code}</td>

                      <td className="p-5 text-gray-600">
                        {new Date(item.check_in_date).toLocaleDateString('vi-VN')} - {new Date(item.check_out_date).toLocaleDateString('vi-VN')}
                      </td>

                      <td className="p-5 font-bold text-blue-600 text-base">{formatCurrency(item.total_price)}</td>

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
                              <button className="text-blue-600 font-bold hover:underline">Chi tiết</button>
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

        {/* SUPPORT BANNER */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full text-blue-600 shadow-sm">
              <Headphones size={24} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">Cần hỗ trợ về việc đặt phòng?</h4>
              <p className="text-gray-600 text-sm">Đội ngũ CSKH của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>
            </div>
          </div>
          <button className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white transition-all font-bold px-6 py-3 rounded-lg shadow-sm w-full md:w-auto">
            Liên hệ ngay
          </button>
        </div>

      </div>
    </div>
  );
}
