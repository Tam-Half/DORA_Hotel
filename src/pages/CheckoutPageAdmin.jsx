import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAllExtraServicesQuery } from '../services/extraService';
import { useGetBookingByIdQuery, useUpdateBookingMutation, useCheckoutMutation } from '../services/booking';
import { useCreatePayOSLinkMutation, useVerifyPayOSStatusMutation } from '../services/payment';
import { QRCodeCanvas } from 'qrcode.react';
import { toast } from 'react-toastify';
import { HandPlatter, HandCoins, UserStar, CalendarClock, BellRing, Martini } from 'lucide-react';

const SkeletonItem = () => (
  <div className="flex justify-between items-center p-4 border border-gray-100 rounded-lg bg-gray-50/50 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-5 h-5 bg-gray-200 rounded"></div>
      <div>
        <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
      </div>
    </div>
    <div className="flex items-center gap-8">
      <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
      <div className="h-4 w-16 bg-gray-200 rounded"></div>
    </div>
  </div>
);

const CashPaymentModal = ({ isOpen, onClose, total, onConfirm, isProcessing }) => {
  const [paid, setPaid] = useState(total);
  const change = paid - total;


  useEffect(() => {
    if (isOpen) setPaid(total);
  }, [isOpen, total]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50  p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">Thanh toán tiền mặt</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-center text-gray-600">
            <span>Tổng cộng:</span>
            <span className="text-2xl font-bold text-sky-600">{total.toLocaleString('vi-VN')} VND</span>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tiền khách đưa:</label>
            <div className="relative">
              <input
                type="number"
                value={paid}
                onChange={(e) => setPaid(Number(e.target.value))}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all text-xl font-semibold outline-none"
                placeholder="0"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">VND</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-sky-50 border border-sky-100 flex justify-between items-center">
            <span className="text-sky-800 font-medium">Tiền thừa trả khách:</span>
            <span className={`text-xl font-bold ${change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {change.toLocaleString('vi-VN')} VND
            </span>
          </div>

          <button
            onClick={() => onConfirm(paid)}
            disabled={change < 0 || isProcessing}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${change >= 0 && !isProcessing
              ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-200 hover:shadow-sky-300'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isProcessing ? 'Đang xử lý...' : (change >= 0 ? 'Xác nhận thanh toán' : 'Số tiền không đủ')}
          </button>
        </div>
      </div>
    </div>
  );
};

const QRPaymentModal = ({ isOpen, onClose, qrData, bookingId, total, onPaymentSuccess }) => {
  const [verifyStatus] = useVerifyPayOSStatusMutation();

  useEffect(() => {
    let interval;
    if (isOpen && bookingId) {
      interval = setInterval(async () => {
        try {
          const result = await verifyStatus({ booking_id: bookingId }).unwrap();
          if (result.status === "PAID") {
            clearInterval(interval);
            onPaymentSuccess();
          }
        } catch (error) {
          console.error("Lỗi kiểm tra trạng thái thanh toán:", error);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen, bookingId, verifyStatus, onPaymentSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <h3 className="text-xl font-bold text-gray-800">Quét mã QR thanh toán</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-8 space-y-6 text-center">
          <div className="bg-white p-4 rounded-2xl border-2 border-sky-100 inline-block shadow-inner">
            <QRCodeCanvas
              value={qrData}
              size={220}
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="space-y-2">
            <p className="text-gray-500 text-sm">Tổng tiền cần thanh toán</p>
            <p className="text-3xl font-black text-sky-600">{total.toLocaleString('vi-VN')} ₫</p>
          </div>

          <div className="flex items-center justify-center gap-3 p-3 bg-sky-50 rounded-xl border border-sky-100 text-sky-700">
            <div className="w-2 h-2 bg-sky-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Đang chờ khách hàng quét mã...</span>
          </div>

          <p className="text-[11px] text-gray-400 italic">
            Hệ thống sẽ tự động cập nhật sau khi thanh toán thành công.
          </p>
        </div>
      </div>
    </div>
  );
};

const CheckoutContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const bookingData = location.state?.bookingData || {};
  const room_number = location.state?.room_number || {};
  console.log("Booking data received in CheckoutContent:", bookingData);
  const bookingId = bookingData.booking_id;

  const { data: allServicesResponse, isLoading: isLoadingAllServices } = useGetAllExtraServicesQuery();
  const { data: bookingDetails } = useGetBookingByIdQuery(bookingId, { skip: !bookingId });
  const [updateBooking, { isLoading: isUpdating }] = useUpdateBookingMutation();
  const [checkout, { isLoading: isCheckoutLoading }] = useCheckoutMutation();
  const [createPayOSLink] = useCreatePayOSLinkMutation();

  const [services, setServices] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [isCashModalOpen, setIsCashModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [damages, setDamages] = useState([]);
  const [initialBookingPrice, setInitialBookingPrice] = useState(null);

  const userString = localStorage.getItem('user_profile');
  console.log("User profile string from localStorage:", userString);

  useEffect(() => {
    if (allServicesResponse?.data) {
      const allServices = allServicesResponse.data;
      const initialServices = allServices.map(svc => {
        const existingOrder = bookingDetails?.serviceOrders?.find(so => so.service?.id === svc.id);
        return {
          id: svc.id,
          name: svc.name,
          price: Number(svc.base_price),
          category: svc.category,
          quantity: existingOrder ? existingOrder.quantity : 1,
          checked: !!existingOrder
        };
      });
      setServices(initialServices);
    }
  }, [allServicesResponse, bookingDetails]);

  useEffect(() => {
    if (!bookingId) {
      alert("Không tìm thấy thông tin đặt phòng!");
      navigate('/admin');
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (bookingDetails && initialBookingPrice === null) {
      setInitialBookingPrice(Number(bookingDetails.total_price) || 0);
    }
  }, [bookingDetails, initialBookingPrice]);

  const calculatedNights = useMemo(() => {
    if (!bookingDetails) return 1;
    const checkIn = new Date(bookingDetails.check_in_date);
    const now = new Date();

    const checkInDateOnly = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let nights = Math.round((nowDateOnly - checkInDateOnly) / (1000 * 3600 * 24));
    if (nights < 0) nights = 0;

    const isPastNoon = now.getHours() >= 12;
    if (isPastNoon) {
      nights += 1;
    }

    return Math.max(1, nights);
  }, [bookingDetails]);

  const plannedNights = useMemo(() => {
    if (!bookingDetails) return 1;
    const checkIn = new Date(bookingDetails.check_in_date);
    const checkOut = new Date(bookingDetails.check_out_date);
    return Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24)) || 1;
  }, [bookingDetails]);

  const roomFee = useMemo(() => {
    if (!bookingDetails?.bookingDetails) return Number(bookingData.total_booking_price) || 0;
    return bookingDetails.bookingDetails.reduce((sum, detail) => {
      return sum + (Number(detail.price_at_booking) * detail.quantity * calculatedNights);
    }, 0);
  }, [bookingDetails, bookingData.total_booking_price, calculatedNights]);

  const handleQuantityChange = (id, delta) => {
    setServices(prev => prev.map(srv => srv.id === id ? { ...srv, quantity: Math.max(1, srv.quantity + delta) } : srv));
  };

  const handleCheckChange = (id) => {
    setServices(prev => prev.map(srv => srv.id === id ? { ...srv, checked: !srv.checked } : srv));
  };

  const handleSaveServices = async () => {
    try {
      const selectedServices = services.filter(s => s.checked).map(s => ({ service_id: s.id, quantity: s.quantity }));
      await updateBooking({ id: bookingId, extra_services: selectedServices }).unwrap();
      alert("Cập nhật dịch vụ thành công!");
    } catch (error) {
      alert("Lỗi khi lưu dịch vụ: " + (error.data?.message || error.message));
    }
  };

  const handleCheckoutAction = async () => {
    if (remainingBalance === 0) {
      await confirmCashCheckout(0);
      return;
    }

    if (paymentMethod === 'cash') {
      setIsCashModalOpen(true);
    } else if (paymentMethod === 'qr') {
      try {
        setIsProcessing(true);
        const result = await createPayOSLink({ booking_id: bookingId, amount: remainingBalance }).unwrap();
        if (result.data?.qrCode) {
          setQrCodeData(result.data.qrCode);
          setIsQRModalOpen(true);
        } else if (result.data?.checkoutUrl) {
          window.open(result.data.checkoutUrl, '_blank');
          alert("Vui lòng thanh toán trên trang PayOS.");
        }
      } catch (error) {
        console.error("Lỗi khi tạo link thanh toán:", error);
        alert("Không thể tạo mã QR thanh toán. Vui lòng thử lại.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleQRPaymentSuccess = async () => {
    setIsQRModalOpen(false);
    try {
      setIsProcessing(true);
      const selectedServices = services.filter(s => s.checked).map(s => ({ service_id: s.id, quantity: s.quantity }));
      await checkout({
        id: bookingId,
        payment_method: 'qr',
        amount_paid: remainingBalance,
        extra_services: selectedServices
      }).unwrap();
      toast.success("Thanh toán thành công! Check-out hoàn tất.");
      navigate('/admin');
    } catch (error) {
      toast.error("Thanh toán thành công nhưng có lỗi khi cập nhật trạng thái ");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmCashCheckout = async (amountPaid) => {
    try {
      setIsProcessing(true);
      const selectedServices = services.filter(s => s.checked).map(s => ({ service_id: s.id, quantity: s.quantity }));
      await checkout({
        id: bookingId,
        payment_method: 'cash',
        amount_paid: amountPaid,
        extra_services: selectedServices
      }).unwrap();
      setIsCashModalOpen(false);
      toast.success("Check-out thành công!");
      navigate('/admin');
    } catch (error) {
      toast.error("Có lỗi xảy ra khi check-out: " + (error.data?.message || error.message));
    } finally {
      setIsProcessing(false);
    }
  };

  const servicesTotal = services.filter(s => s.checked).reduce((total, s) => total + (s.price * s.quantity), 0);
  const damagesTotal = damages.reduce((total, item) => total + (Number(item.cost) || 0), 0);
  const subTotal = roomFee + servicesTotal + damagesTotal;
  const vat = subTotal * 0.08;
  const grandTotal = subTotal + vat;

  const isPaidBefore = useMemo(() => {
    const status = bookingDetails?.payment_status || bookingData?.payment_status;
    return status === 'paid' || status === 'PAID' || status === 'Đã thanh toán';
  }, [bookingDetails?.payment_status, bookingData?.payment_status]);


  const amountAlreadyPaid = useMemo(() => {
    if (!isPaidBefore) return 0;
    // Use the initial total price of the booking as the amount already paid
    return initialBookingPrice || Number(bookingData.total_booking_price) || 0;
  }, [isPaidBefore, initialBookingPrice, bookingData.total_booking_price]);

  const remainingBalance = useMemo(() => {
    return Math.max(0, grandTotal - amountAlreadyPaid);
  }, [grandTotal, amountAlreadyPaid]);

  const formatMoney = (amount) => (amount || 0).toLocaleString('vi-VN') + ' ₫';

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const checkInDisplay = formatDate(bookingDetails?.check_in_date || bookingData.check_in);
  const checkOutDisplay = formatDate(bookingDetails?.check_out_date || bookingData.check_out);

  return (
    <div className="bg-gray-100 min-h-screen px-8 pb-8 font-sans box-border">
      <div className="flex justify-between items-center h-[70px] border-b border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="bg-transparent border-none text-2xl cursor-pointer text-gray-600 px-2 hover:text-gray-900 transition">←</button>
          <h2 className="m-0 text-xl font-semibold text-gray-900">Check-out & Thanh toán</h2>
        </div>
        <div className="flex items-center gap-5">
          {/* <BellRing className="cursor-pointer text-xl text-yellow-500 hover:text-gray-700" /> */}
          <div className="flex items-center border-l border-gray-300 pl-5">
            <div className="text-right mr-2">
              <p className="m-0 text-sm font-semibold text-gray-900">{userString ? JSON.parse(userString).name : 'Admin'}</p>
              {/* <p className="m-0 text-xs text-gray-500">Quản lý ca trực</p> */}
            </div>
            {/* <img className="w-9 h-9 rounded-full border-2 border-blue-500 text-white flex items-center justify-center font-bold" src={userString ? JSON.parse(userString).avatar_url : undefined} alt="Avatar" /> */}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 flex flex-col gap-5 w-full">
          {/* Thông tin khách */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <UserStar className="w-[60px] h-[60px] rounded-xl bg-sky-100 flex items-center justify-center text-3xl text-sky-600" />
                <div>
                  <h3 className="m-0 mb-2 text-xl text-gray-900 font-bold">{bookingDetails?.guest_name || bookingData.guest_name || 'Khách lẻ'}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600">

                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                      Phòng {room_number || '---'}
                    </span>

                    <div className="flex items-center gap-2">
                      <CalendarClock className="w-4 h-4 text-gray-700 font-bold" />
                      <span className="text-gray-700 font-bold">
                        {checkInDisplay || '---'} — {checkOutDisplay || '---'}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="m-0 mb-1 text-[11px] text-gray-500 uppercase font-semibold">Trạng thái</p>
                <p className="m-0 text-sky-600 font-bold">● {bookingDetails?.status || bookingData.status || 'Đang chờ'}</p>
              </div>
            </div>
          </div>

          {new Date().getHours() >= 12 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 shadow-sm animate-fadeIn">
              <span className="text-amber-600 text-lg">⚠️</span>
              <div>
                <h5 className="font-bold text-amber-800 text-sm uppercase tracking-wide">Trả phòng muộn (Sau 12h00)</h5>
                <p className="text-xs text-amber-700 font-medium mt-1 leading-relaxed">
                  Giờ hiện tại là <strong className="text-amber-900">{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</strong> hôm nay. Theo quy định của khách sạn, do quá 12h trưa nên hệ thống đã tự động cộng thêm 1 ngày lưu trú vào tổng số đêm tính tiền của khách .
                </p>
              </div>
            </div>
          )}

          {/* Tiền phòng */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <HandCoins className="text-sky-600" />
              <h4 className="m-0 text-lg font-bold text-gray-800">Tiền phòng</h4>
            </div>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs text-gray-500 uppercase font-semibold">
                  <th className="py-3 border-b">Mô tả</th>
                  <th className="py-3 border-b text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 border-b text-sm text-gray-800">
                    <div className="font-semibold text-gray-900">Tiền phòng lưu trú ({calculatedNights} đêm)</div>
                    <div className="text-xs text-gray-500 mt-1">Mã đặt phòng: {bookingDetails?.booking_code || bookingData.booking_code}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Kế hoạch: {plannedNights} đêm ({checkInDisplay} — {checkOutDisplay})</div>
                    <div className="text-xs text-indigo-600 font-semibold mt-1 bg-indigo-50/50 border border-indigo-100 rounded-md px-2 py-1 inline-block">
                      Thực tế: Nhận {checkInDisplay} — Trả {new Date().toLocaleDateString('vi-VN')} {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="py-4 border-b text-right text-sky-600 font-bold">{formatMoney(roomFee)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Dịch vụ & Minibar */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50 space-y-8">
            {/* Section 1: Minibar */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Martini className="text-sky-600" />
                  <h4 className="m-0 text-lg font-bold text-gray-800">
                    Minibar
                  </h4>
                </div>
                <span className="text-xs text-gray-400 font-medium italic">Ghi nhận tiêu thụ tại phòng</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {isLoadingAllServices ? [1, 2].map(i => <SkeletonItem key={i} />) : services.filter(s => s.category === 'Minibar').map(srv => (
                  <div key={srv.id} className={`flex justify-between items-center p-3 border rounded-xl transition-all ${srv.checked ? 'border-sky-200 bg-sky-50/50 shadow-sm' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={srv.checked} onChange={() => handleCheckChange(srv.id)} className="w-4 h-4 accent-sky-600 rounded" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{srv.name}</p>
                        {srv.price === 0 ? (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold uppercase">Miễn phí</span>
                        ) : (
                          <p className="text-xs text-gray-500 font-medium">{formatMoney(srv.price)}</p>
                        )}
                      </div>
                    </div>
                    {srv.checked && (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
                          <button onClick={() => handleQuantityChange(srv.id, -1)} className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500">-</button>
                          <span className="w-4 text-center text-xs font-bold">{srv.quantity}</span>
                          <button onClick={() => handleQuantityChange(srv.id, 1)} className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500">+</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <HandPlatter className="text-sky-600" />
                  <h4 className="m-0 text-lg font-bold text-gray-800">
                    Dịch vụ khác
                  </h4>
                </div>
                <button onClick={handleSaveServices} disabled={isUpdating} className="px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold hover:bg-gray-900 disabled:bg-gray-400 transition-colors">
                  Lưu thay đổi
                </button>
              </div>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {isLoadingAllServices ? [1, 2].map(i => <SkeletonItem key={i} />) : services.filter(s => s.category !== 'Minibar').map(srv => (
                  <div key={srv.id} className={`flex justify-between items-center p-4 border rounded-lg transition-all ${srv.checked ? 'border-sky-200 bg-sky-50/30' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" checked={srv.checked} onChange={() => handleCheckChange(srv.id)} className="w-4 h-4 accent-sky-600" />
                      <div>
                        <p className="font-medium text-gray-800">{srv.name}</p>
                        <p className="text-xs text-gray-500">{formatMoney(srv.price)}</p>
                      </div>
                    </div>
                    {srv.checked && (
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-white border rounded-full p-1 shadow-sm">
                          <button onClick={() => handleQuantityChange(srv.id, -1)} className="w-6 h-6 rounded-full hover:bg-gray-100">-</button>
                          <span className="w-4 text-center text-sm">{srv.quantity}</span>
                          <button onClick={() => handleQuantityChange(srv.id, 1)} className="w-6 h-6 rounded-full hover:bg-gray-100">+</button>
                        </div>
                        <span className="font-semibold text-gray-800 w-24 text-right">{formatMoney(srv.price * srv.quantity)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tổng kết & Thanh toán */}
        <div className="w-full lg:w-[360px] space-y-5">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-4">Tổng hợp chi phí</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Tạm tính</span><span>{formatMoney(subTotal)}</span></div>
              <div className="flex justify-between"><span>VAT (8%)</span><span>{formatMoney(vat)}</span></div>
              <div className="flex justify-between font-medium"><span>Tổng chi phí</span><span>{formatMoney(grandTotal)}</span></div>

              {isPaidBefore && (
                <>
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Đã thanh toán trước</span>
                    <span>-{formatMoney(amountAlreadyPaid)}</span>
                  </div>
                  <div className="border-t border-dashed my-4"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase text-gray-500">Còn lại</span>
                    <span className="text-2xl font-bold text-rose-600">{formatMoney(remainingBalance)}</span>
                  </div>
                </>
              )}

              {!isPaidBefore && (
                <>
                  <div className="border-t border-dashed my-4"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-bold uppercase text-gray-500">Tổng thanh toán</span>
                    <span className="text-2xl font-bold text-sky-600">{formatMoney(grandTotal)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold mb-4">Phương thức thanh toán</h3>
            <div className="space-y-3">
              <div onClick={() => setPaymentMethod('cash')} className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'cash' ? 'border-sky-600 bg-sky-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                <img src="https://res.cloudinary.com/dhw2yjevk/image/upload/v1779026409/dollars_ev3spb.webp" alt="PayOS" className="w-6 h-6 object-contain" />
                <div><p className="font-semibold text-sm">Tiền mặt</p><p className="text-xs text-gray-500">Thanh toán tại quầy</p></div>
              </div>
              <div onClick={() => setPaymentMethod('qr')} className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center gap-4 ${paymentMethod === 'qr' ? 'border-sky-600 bg-sky-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                <img src="https://res.cloudinary.com/dhw2yjevk/image/upload/v1779021749/payosicons_zxjumz.png" alt="PayOS" className="w-6 h-6 object-contain" />
                <div><p className="font-semibold text-sm">Chuyển khoản QR</p><p className="text-xs text-gray-500">PayOS</p></div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCheckoutAction}
            disabled={isCheckoutLoading || isProcessing}
            className="w-full py-4 bg-sky-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-sky-700 disabled:bg-gray-400 transition-all flex flex-col items-center justify-center leading-tight"
          >
            {isCheckoutLoading || isProcessing ? 'Đang xử lý...' : (
              <>
                <span>Hoàn tất Check-out &</span>
                <span className="text-sm opacity-90 font-normal mt-0.5">Cập nhật trạng thái phòng</span>
              </>
            )}
          </button>
          <p className="text-[10px] text-center text-gray-400 font-medium uppercase tracking-widest">Phòng sẽ chuyển sang trạng thái "Dọn dẹp"</p>
        </div>
      </div>

      <CashPaymentModal isOpen={isCashModalOpen} onClose={() => setIsCashModalOpen(false)} total={remainingBalance} onConfirm={confirmCashCheckout} isProcessing={isProcessing} />

      <QRPaymentModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        qrData={qrCodeData}
        bookingId={bookingId}
        total={remainingBalance}
        onPaymentSuccess={handleQRPaymentSuccess}
      />
    </div>
  );
};

export default CheckoutContent;