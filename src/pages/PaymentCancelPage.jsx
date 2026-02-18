import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCcw, Home } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Container from '../components/layout/Container';

export default function PaymentCancelPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('booking_id');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-grow flex items-center justify-center py-20">
                <Container>
                    <div className="max-w-md mx-auto bg-white p-10 rounded-2xl shadow-xl text-center border border-red-50">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="text-red-600" size={48} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-poppins">Thanh toán đã bị hủy</h1>
                        <p className="text-gray-600 mb-8">
                            Giao dịch của bạn không được thực hiện. Đừng lo lắng, phòng của bạn vẫn đang được giữ (trong thời gian ngắn).
                        </p>

                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/user/historybooking')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                Thử lại từ Lịch sử
                                <RefreshCcw size={18} />
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
