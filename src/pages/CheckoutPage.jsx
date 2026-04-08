import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGetAllExtraServicesQuery } from '../services/extraService';
import { useCreateBookingMutation } from '../services/booking';
import { useCreatePayOSLinkMutation } from '../services/payment';
import { useGetRoomTypeByIdQuery } from '../services/roomType';
import { toast } from 'react-toastify';
import { ChevronLeft, CreditCard, User, ShieldCheck, Plus, Minus, Info, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { user } = useAuth();

    // Support deep-linking from Chatbot
    const pRoomTypeId = searchParams.get('roomTypeId');
    const pCheckin = searchParams.get('checkin');
    const pCheckout = searchParams.get('checkout');
    const pName = searchParams.get('name');
    const pEmail = searchParams.get('email');
    const pPhone = searchParams.get('phone');

    const state = location.state || {};
    const [room, setRoom] = useState(state.room);
    const [startDate, setStartDate] = useState(state.startDate || pCheckin);
    const [endDate, setEndDate] = useState(state.endDate || pCheckout);
    const [nights, setNights] = useState(state.nights || 0);
    const [totalPrice, setTotalPrice] = useState(state.totalPrice || 0);

    // Fetch room type if missing state
    const { data: roomTypeResult, isLoading: isRoomLoading } = useGetRoomTypeByIdQuery(
        { id: pRoomTypeId },
        { skip: !!room || !pRoomTypeId }
    );

    const [bookingType, setBookingType] = useState(pName || pEmail || pPhone ? 'others' : 'self'); // 'self' or 'others'
    const [guestInfo, setGuestInfo] = useState({
        name: pName || '',
        email: pEmail || '',
        phone: pPhone || ''
    });

    const [selectedServices, setSelectedServices] = useState([]);

    const { data: servicesResult, isLoading: isServicesLoading } = useGetAllExtraServicesQuery();
    const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
    const [createPayOSLink, { isLoading: isPaymentLoading }] = useCreatePayOSLinkMutation();

    useEffect(() => {
        if (!location.state && !pRoomTypeId) {
            navigate('/');
        }
    }, [location.state, pRoomTypeId, navigate]);

    // Update room info from fetch result
    useEffect(() => {
        if (!room && roomTypeResult?.data) {
            setRoom(roomTypeResult.data);
        }
    }, [room, roomTypeResult]);

    // Calculate nights and price if derived from params
    useEffect(() => {
        if (room && startDate && endDate && (!nights || !totalPrice)) {
            try {
                const start = new Date(startDate);
                const end = new Date(endDate);
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 0) {
                    setNights(diffDays);
                    setTotalPrice(diffDays * (room.base_price || room.price || 0));
                }
            } catch (e) {
                console.error("Date calculation error", e);
            }
        }
    }, [room, startDate, endDate, nights, totalPrice]);

    useEffect(() => {
        if (bookingType === 'self' && user) {
            setGuestInfo({
                name: user.name || '',
                email: user.account?.email || user.email || '',
                phone: user.phone_number || ''
            });
        } else if (bookingType === 'others') {
            // Only reset if we don't have param-provided info
            if (!pName && !pEmail && !pPhone) {
                setGuestInfo({ name: '', email: '', phone: '' });
            }
        }
    }, [bookingType, user, pName, pEmail, pPhone]);

    const handleServiceToggle = (service) => {
        setSelectedServices(prev => {
            const exists = prev.find(s => s.id === service.id);
            if (exists) {
                return prev.filter(s => s.id !== service.id);
            } else {
                return [...prev, { ...service, quantity: 1 }];
            }
        });
    };

    const updateServiceQuantity = (serviceId, delta) => {
        setSelectedServices(prev => 
            prev.map(s => {
                if (s.id === serviceId) {
                    const newQty = Math.max(1, s.quantity + delta);
                    return { ...s, quantity: newQty };
                }
                return s;
            })
        );
    };

    const servicesTotal = selectedServices.reduce((sum, s) => sum + (Number(s.base_price) * s.quantity || 0), 0);
    const subtotal = (totalPrice || 0) + servicesTotal;
    const vat = subtotal * 0.08;
    const grandTotal = subtotal + vat;

    const formatCurrency = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');

    const handlePayment = async () => {
        try {
            if (!guestInfo.name || !guestInfo.email || !guestInfo.phone) {
                toast.error("Vui lòng điền đầy đủ thông tin người nhận phòng");
                return;
            }

            const bookingPayload = {
                check_in_date: startDate,
                check_out_date: endDate,
                rooms: [{ roomTypeId: room.id, quantity: 1 }],
                guest_name: guestInfo.name,
                guest_email: guestInfo.email,
                guest_phone: guestInfo.phone,
                extra_services: selectedServices.map(s => ({ service_id: s.id, quantity: s.quantity })),
                note: `Website booking - ${nights} nights. Services: ${selectedServices.map(s => `${s.name} (x${s.quantity})`).join(', ') || 'None'}`
            };

            const bookingResult = await createBooking(bookingPayload).unwrap();
            const bookingId = bookingResult.data.id;

            const paymentResult = await createPayOSLink({ booking_id: bookingId }).unwrap();

            if (paymentResult.data && paymentResult.data.checkoutUrl) {
                toast.success("Đặt phòng thành công! Đang chuyển hướng thanh toán...");
                window.location.href = paymentResult.data.checkoutUrl;
            } else {
                throw new Error("Không lấy được link thanh toán PayOS");
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error(error.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
        }
    };

    if (isRoomLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="animate-spin text-rose-500" size={40} />
        </div>
    );

    if (!room) return null;

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-black transition">
                        <ChevronLeft size={20} />
                        <span className="font-medium">Quay lại</span>
                    </button>
                    <h1 className="text-lg font-bold">Xác nhận và thanh toán</h1>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Form Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Section 1: Guest Info */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center text-rose-600">
                                <User size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Thông tin người nhận phòng</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                                <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${bookingType === 'self' ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="bookingType"
                                        checked={bookingType === 'self'}
                                        onChange={() => setBookingType('self')}
                                        className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                                    />
                                    <div>
                                        <p className="font-bold text-sm">Tôi là người nhận phòng</p>
                                        <p className="text-xs text-gray-500">Sử dụng thông tin tài khoản của bạn</p>
                                    </div>
                                </label>
                                <label className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${bookingType === 'others' ? 'border-rose-500 bg-rose-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name="bookingType"
                                        checked={bookingType === 'others'}
                                        onChange={() => setBookingType('others')}
                                        className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                                    />
                                    <div>
                                        <p className="font-bold text-sm">Đặt hộ người khác</p>
                                        <p className="text-xs text-gray-500">Nhập thông tin người sẽ nhận phòng</p>
                                    </div>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Họ và tên</label>
                                    <input
                                        type="text"
                                        placeholder="VD: Nguyen Van A"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
                                        value={guestInfo.name}
                                        onChange={(e) => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Email</label>
                                    <input
                                        type="email"
                                        placeholder="vd@gmail.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
                                        value={guestInfo.email}
                                        onChange={(e) => setGuestInfo({ ...guestInfo, email: e.target.value })}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 ml-1">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        placeholder="0123 456 789"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition"
                                        value={guestInfo.phone}
                                        onChange={(e) => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Extra Services */}
                    <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                <Plus size={20} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Tiện ích bổ sung</h2>
                        </div>

                        {isServicesLoading ? (
                            <div className="flex justify-center py-10">
                                <Loader2 className="animate-spin text-gray-300" size={30} />
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {servicesResult?.data?.map((service) => {
                                    const selectedService = selectedServices.find(s => s.id === service.id);
                                    const isSelected = !!selectedService;
                                    
                                    return (
                                        <div
                                            key={service.id}
                                            className={`flex flex-col p-4 rounded-xl border-2 transition ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-50 hover:border-gray-100 bg-gray-50/50'}`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div 
                                                    className="flex items-center gap-3 cursor-pointer flex-1"
                                                    onClick={() => handleServiceToggle(service)}
                                                >
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-300 bg-white'}`}>
                                                        {isSelected && <ShieldCheck size={14} />}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900">{service.name}</p>
                                                        <p className="text-xs text-blue-600 font-semibold">+{formatCurrency(service.base_price)}</p>
                                                    </div>
                                                </div>
                                                
                                                {isSelected && (
                                                    <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg border border-blue-100 shadow-sm">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); updateServiceQuantity(service.id, -1); }}
                                                            className="text-blue-600 hover:bg-blue-50 p-1 rounded transition"
                                                            disabled={selectedService.quantity <= 1}
                                                        >
                                                            <Minus size={14} />
                                                        </button>
                                                        <span className="font-bold text-sm min-w-[20px] text-center">{selectedService.quantity}</span>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); updateServiceQuantity(service.id, 1); }}
                                                            className="text-blue-600 hover:bg-blue-50 p-1 rounded transition"
                                                        >
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <p className="mt-4 text-xs text-gray-500 flex items-center gap-1">
                            <Info size={14} />
                            Các dịch vụ này sẽ được phục vụ trong suốt thời gian lưu trú của bạn.
                        </p>
                    </section>
                </div>

                {/* Right Column: Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Chi tiết đặt phòng</h2>

                        <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img src={room.images?.[0]?.url || 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=200'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Hạng phòng</p>
                                <h3 className="font-bold text-gray-900 line-clamp-2">{room.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{nights} đêm • 1 phòng</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Giá phòng ({nights} đêm)</span>
                                <span className="font-medium text-gray-900">{formatCurrency(totalPrice)}</span>
                            </div>
                            {selectedServices.length > 0 && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Dịch vụ bổ sung</span>
                                        <span className="font-medium text-gray-900">{formatCurrency(servicesTotal)}</span>
                                    </div>
                                    <div className="pl-4 space-y-1">
                                        {selectedServices.map(s => (
                                            <div key={s.id} className="flex justify-between text-[11px] text-gray-400">
                                                <span>• {s.name} (x{s.quantity})</span>
                                                <span>{formatCurrency(s.base_price * s.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="text-gray-900 font-medium">Tạm tính</span>
                                <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Thuế VAT (8%)</span>
                                <span className="font-medium text-gray-900">{formatCurrency(vat)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                <span className="font-bold text-gray-900">Tổng cộng</span>
                                <span className="text-xl font-extrabold text-rose-600">{formatCurrency(grandTotal)}</span>
                            </div>
                        </div>

                        <button
                            disabled={isBookingLoading || isPaymentLoading}
                            onClick={handlePayment}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl transition flex items-center justify-center gap-2 ${isBookingLoading || isPaymentLoading ? 'bg-gray-400' : 'bg-rose-500 hover:bg-rose-600 active:scale-95'}`}
                        >
                            {(isBookingLoading || isPaymentLoading) ? (
                                <Loader2 className="animate-spin" size={20} />
                            ) : (
                                <>
                                    <CreditCard size={20} />
                                    <span>Thanh toán ngay</span>
                                </>
                            )}
                        </button>

                        <p className="mt-4 text-[10px] text-center text-gray-400 leading-relaxed px-4">
                            Bằng cách nhấn "Thanh toán ngay", bạn đồng ý với các Điều khoản & Chính sách của DoraHotel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
