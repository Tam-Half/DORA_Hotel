import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Home, Loader2 } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';
import { useVerifyPayOSStatusMutation } from '../services/payment';

export default function PaymentSuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('booking_id');
    const [verifyStatus, { isLoading: isVerifying }] = useVerifyPayOSStatusMutation();

    useEffect(() => {
        if (bookingId) {
            verifyStatus({ booking_id: bookingId });
        }
    }, [bookingId, verifyStatus]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center py-20">
                <Container>
                    <div className="max-w-md mx-auto bg-white p-10 rounded-2xl shadow-xl text-center border border-green-50">
                        {isVerifying ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
                                <p className="text-gray-500 font-medium">Đang xác nhận thanh toán...</p>
                            </div>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="text-green-600" size={48} />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Thanh toán thành công!</h1>
                                <p className="text-gray-600 mb-8">
                                    Cảm ơn bạn đã lựa chọn DoraHotel. Yêu cầu đặt phòng của bạn đã được xác nhận.
                                </p>
                            </>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/user/historybooking')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 group"
                            >
                                Xem lịch sử đặt phòng
                                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <Home size={18} />
                                Quay lại Trang chủ
                            </button>
                        </div>
                    </div>
                </Container>
            </main>
            <Footer />
        </div>
    );
}
