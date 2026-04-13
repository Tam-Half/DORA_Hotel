import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Lấy dữ liệu booking truyền từ Modal sang
  const bookingData = location.state?.bookingData || {};
  console.log("Dữ liệu booking nhận được tại CheckoutPageAdmin:", bookingData);

  // Nếu không có dữ liệu (user tự gõ URL), bạn có thể xử lý redirect về trang chủ
  useEffect(() => {
    if (!bookingData.booking_id) {
      alert("Không tìm thấy thông tin đặt phòng!");
      // navigate('/'); // Uncomment để chuyển hướng về trang chủ
    }
  }, [bookingData, navigate]);

  const [services, setServices] = useState([
    { id: 1, name: 'Mini-bar (Nước suối, Snack)', date: 'Sử dụng ngày 13/10', price: 40000, quantity: 2, checked: true },
    { id: 2, name: 'Dịch vụ Spa - Massage toàn thân', date: 'Sử dụng ngày 14/10', price: 450000, quantity: 1, checked: true },
    { id: 3, name: 'Giặt ủi (Laundry)', date: 'Sử dụng ngày 14/10', price: 50000, quantity: 1, checked: false },
    { id: 4, name: 'Thuê xe máy', date: 'Sử dụng ngày 13/10', price: 150000, quantity: 1, checked: false },
    { id: 5, name: 'Ăn sáng tại phòng', date: 'Sử dụng ngày 15/10', price: 120000, quantity: 1, checked: false },
    { id: 6, name: 'Đưa đón sân bay', date: 'Sử dụng ngày 12/10', price: 300000, quantity: 1, checked: false },
    { id: 7, name: 'Nước ngọt (Minibar)', date: 'Sử dụng ngày 14/10', price: 20000, quantity: 3, checked: false },
    { id: 8, name: 'Rượu vang (Minibar)', date: 'Sử dụng ngày 13/10', price: 500000, quantity: 1, checked: false },
  ]);

  const [damages, setDamages] = useState([
    { id: 1, name: '', cost: '' }
  ]);

  const [paymentMethod, setPaymentMethod] = useState('cash');

  // Lấy tiền phòng từ bookingData (thay thế total_amount bằng field thực tế của bạn)
  const roomFee = Number(bookingData.total_booking_price) || 3600000; 
  const discount = 200000;

  // Format ngày để hiển thị
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const checkInDisplay = formatDate(bookingData.check_in);
  const checkOutDisplay = formatDate(bookingData.check_out);

  const handleQuantityChange = (id, delta) => {
    setServices(services.map(srv => {
      if (srv.id === id) {
        const newQuantity = Math.max(1, srv.quantity + delta);
        return { ...srv, quantity: newQuantity };
      }
      return srv;
    }));
  };

  const handleCheckChange = (id) => {
    setServices(services.map(srv => srv.id === id ? { ...srv, checked: !srv.checked } : srv));
  };

  const handleAddDamageItem = () => {
    setDamages([...damages, { id: Date.now(), name: '', cost: '' }]);
  };

  const handleUpdateDamageItem = (id, field, value) => {
    setDamages(damages.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleRemoveDamageItem = (id) => {
    setDamages(damages.filter(item => item.id !== id));
  };

  const servicesTotal = services.filter(s => s.checked).reduce((total, s) => total + (s.price * s.quantity), 0);
  const damagesTotal = damages.reduce((total, item) => total + (Number(item.cost) || 0), 0);
  const subTotal = roomFee + servicesTotal + damagesTotal;
  const vat = subTotal * 0.1; 
  const grandTotal = subTotal + vat - discount;

  const formatMoney = (amount) => {
    return amount.toLocaleString('vi-VN') + ' ₫';
  };

  return (
    <div className="bg-gray-100 min-h-screen px-8 pb-8 font-sans box-border">
      {/* Header */}
      <div className="flex justify-between items-center h-[70px] border-b border-gray-200 mb-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="bg-transparent border-none text-2xl cursor-pointer text-gray-600 px-2 hover:text-gray-900 transition"
          >
            ←
          </button>
          <h2 className="m-0 text-xl font-semibold text-gray-900">Check-out & Thanh toán</h2>
        </div>
        <div className="flex items-center gap-5">
          <span className="cursor-pointer text-xl text-gray-500 hover:text-gray-700">🔔</span>
          <span className="cursor-pointer text-xl text-gray-500 hover:text-gray-700">⏱️</span>
          <span className="cursor-pointer text-xl text-gray-500 hover:text-gray-700">❓</span>
          <div className="flex items-center border-l border-gray-300 pl-5">
            <div className="text-right mr-2">
              <p className="m-0 text-sm font-semibold text-gray-900">Admin</p>
              <p className="m-0 text-xs text-gray-500">Quản lý ca trực</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold">A</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* CỘT TRÁI */}
        <div className="flex-1 flex flex-col gap-5 w-full">
          
          {/* Card Thông tin khách */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-[60px] h-[60px] rounded-xl bg-sky-100 flex items-center justify-center text-3xl text-sky-600">⭐</div>
                <div>
                  <h3 className="m-0 mb-2 text-xl text-gray-900 font-bold">
                    {bookingData.guest_name || 'Khách lẻ'}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-semibold">
                      Phòng {bookingData.room_number || '---'}
                    </span>
                    <span>
                      📅 {checkInDisplay || '---'} — {checkOutDisplay || '---'} 
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="m-0 mb-1 text-[11px] text-gray-500 uppercase font-semibold">Trạng thái hiện tại</p>
                <p className="m-0 text-sky-600 font-bold">● {bookingData.status || 'Đang chờ'}</p>
              </div>
            </div>
          </div>

          {/* Card Tiền phòng */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
            <h4 className="m-0 text-lg font-bold flex items-center gap-2 mb-4 text-gray-800">🛏️ Tiền phòng</h4>
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-3 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">Mô tả</th>
                  <th className="text-left py-3 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">Đơn giá</th>
                  <th className="text-left py-3 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">Số lượng</th>
                  <th className="text-right py-3 border-b border-gray-200 text-gray-500 text-xs uppercase font-semibold">Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-4 border-b border-gray-50 align-middle text-sm text-gray-800">
                    Tiền phòng lưu trú<br/>
                    <span className="text-[13px] text-gray-500">Mã Booking: {bookingData.booking_code || '---'}</span>
                  </td>
                  <td className="py-4 border-b border-gray-50 align-middle text-sm text-gray-500">---</td>
                  <td className="py-4 border-b border-gray-50 align-middle text-sm text-gray-500">---</td>
                  <td className="py-4 border-b border-gray-50 align-middle text-sm text-right text-sky-600 font-bold">
                    {formatMoney(roomFee)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card Dịch vụ */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="m-0 flex items-center gap-2 text-lg font-bold text-gray-800">🛎️ Các dịch vụ khả dụng</h4>
            </div>
            
            <div className="flex flex-col gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {services.map(srv => (
                <div key={srv.id} className={`flex justify-between items-center p-4 border border-gray-200 rounded-lg bg-gray-50 transition-all ${srv.checked ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      checked={srv.checked} 
                      onChange={() => handleCheckChange(srv.id)} 
                      className="w-[18px] h-[18px] cursor-pointer shrink-0 accent-sky-600 rounded"
                    />
                    <div>
                      <p className={`m-0 mb-1 font-medium text-gray-800 ${!srv.checked && 'line-through text-gray-500'}`}>
                        {srv.name}
                      </p>
                      <p className="m-0 text-xs text-gray-500">Đơn giá: {formatMoney(srv.price)}</p>
                    </div>
                  </div>
                  
                  {srv.checked && (
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3 bg-gray-200 p-1 rounded-full">
                        <button onClick={() => handleQuantityChange(srv.id, -1)} className="w-7 h-7 rounded-full border border-gray-300 bg-white flex items-center justify-center text-base hover:bg-gray-50 transition">-</button>
                        <span className="text-sm font-medium w-5 text-center text-gray-800">{srv.quantity}</span>
                        <button onClick={() => handleQuantityChange(srv.id, 1)} className="w-7 h-7 rounded-full border border-gray-300 bg-white flex items-center justify-center text-base hover:bg-gray-50 transition">+</button>
                      </div>
                      <span className="font-semibold w-20 text-right text-gray-800">{formatMoney(srv.price * srv.quantity)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card Bồi thường */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-4">
              <h4 className="m-0 text-lg font-bold flex items-center gap-2 text-amber-700">⚠️ Bồi thường & Hư hại</h4>
              <button 
                onClick={handleAddDamageItem} 
                className="text-amber-700 bg-transparent border border-dashed border-amber-700 rounded-md px-3 py-1.5 cursor-pointer font-medium text-sm hover:bg-amber-50 transition"
              >
                + Thêm mục bồi thường
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {damages.map((item, index) => (
                <div key={item.id} className="flex gap-4 items-end">
                  <div className="flex-[2]">
                    {index === 0 && <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Tên vật phẩm/Hư hại</label>}
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Vỡ ly thủy tinh..." 
                      className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800"
                      value={item.name}
                      onChange={(e) => handleUpdateDamageItem(item.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    {index === 0 && <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Số tiền phạt (₫)</label>}
                    <input 
                      type="number" 
                      className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-sm outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-gray-800"
                      value={item.cost}
                      onChange={(e) => handleUpdateDamageItem(item.id, 'cost', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  {damages.length > 1 && (
                    <button 
                      onClick={() => handleRemoveDamageItem(item.id)}
                      className="w-11 h-11 flex items-center justify-center bg-red-100 text-red-600 border-none rounded-lg cursor-pointer text-base hover:bg-red-200 transition"
                      title="Xóa mục này"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {damagesTotal > 0 && (
              <div className="mt-4 text-right font-bold text-amber-700 text-lg">
                Tổng bồi thường: {formatMoney(damagesTotal)}
              </div>
            )}
          </div>

        </div>

        {/* CỘT PHẢI */}
        <div className="w-full lg:w-[360px] flex flex-col gap-5 lg:sticky lg:top-6">
          
          <div className="bg-stone-50 rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="m-0 mb-5 text-lg font-bold text-gray-800">Tổng hợp chi phí</h3>
            
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-gray-600">Tạm tính (Phòng + Dịch vụ + Phạt)</span>
              <span className="font-semibold text-gray-800">{formatMoney(subTotal)}</span>
            </div>
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-gray-600">Thuế VAT (10%)</span>
              <span className="font-semibold text-gray-800">{formatMoney(vat)}</span>
            </div>
            <div className="flex justify-between mb-3 text-sm">
              <span className="text-amber-700 italic">Giảm giá (Ưu đãi)</span>
              <span className="text-amber-700 font-semibold">-{formatMoney(discount)}</span>
            </div>
            
            <div className="border-t border-dashed border-gray-300 my-5"></div>
            
            <div className="flex justify-between items-end">
              <span className="text-[12px] text-gray-500 uppercase font-bold">Tổng cộng thanh toán</span>
              <span className="text-3xl font-bold text-sky-600">{formatMoney(grandTotal)}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-50">
            <h3 className="m-0 mb-4 text-base font-bold text-gray-800">Phương thức thanh toán</h3>
            <div className="flex flex-col gap-3">
              
              <div 
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-sky-600 bg-sky-50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                onClick={() => setPaymentMethod('cash')}
              >
                <div className="text-2xl">💵</div>
                <div>
                  <p className="m-0 mb-1 font-semibold text-sm text-gray-800">Tiền mặt</p>
                  <p className="m-0 text-xs text-gray-500">Thanh toán tại quầy</p>
                </div>
              </div>

              <div 
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-sky-600 bg-sky-50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <div className="text-2xl">💳</div>
                <div>
                  <p className="m-0 mb-1 font-semibold text-sm text-gray-800">Thẻ tín dụng</p>
                  <p className="m-0 text-xs text-gray-500">Visa, Mastercard, JCB</p>
                </div>
              </div>

              <div 
                className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'qr' ? 'border-sky-600 bg-sky-50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'}`}
                onClick={() => setPaymentMethod('qr')}
              >
                <div className="text-2xl">📱</div>
                <div>
                  <p className="m-0 mb-1 font-semibold text-sm text-gray-800">Chuyển khoản QR</p>
                  <p className="m-0 text-xs text-gray-500">VietQR, MoMo, VNPay</p>
                </div>
              </div>

            </div>
          </div>

          <div>
            <button className="w-full flex items-center justify-center gap-3 bg-sky-600 text-white border-none rounded-xl p-4 text-base font-bold cursor-pointer shadow-md hover:bg-sky-700 hover:shadow-lg transition-all active:scale-[0.98]">
              <span className="text-2xl">🖨️</span>
              <div className="text-left">
                <p className="m-0 leading-tight">Hoàn tất Check-out &</p>
                <p className="m-0 leading-tight">In hóa đơn</p>
              </div>
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-3 font-semibold tracking-wide">
              THAO TÁC NÀY SẼ CẬP NHẬT PHÒNG THÀNH TRẠNG THÁI 'ĐANG DỌN DẸP'
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutContent;