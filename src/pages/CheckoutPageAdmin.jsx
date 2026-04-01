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
  // Nếu không có, gán tạm 3600000
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
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>←</button>
          <h2 style={styles.pageTitle}>Check-out & Thanh toán</h2>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.iconBtn}>🔔</span>
          <span style={styles.iconBtn}>⏱️</span>
          <span style={styles.iconBtn}>❓</span>
          <div style={styles.userInfo}>
            <div style={{ textAlign: 'right', marginRight: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>Admin</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Quản lý ca trực</p>
            </div>
            <div style={styles.avatar}>A</div>
          </div>
        </div>
      </div>

      <div style={styles.mainLayout}>
        
        {/* CỘT TRÁI */}
        <div style={styles.leftCol}>
          
          {/* Card Thông tin khách */}
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={styles.guestIcon}>⭐</div>
                <div>
                  <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#111827' }}>
                    {bookingData.guest_name || 'Khách lẻ'}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#4b5563' }}>
                    <span style={styles.roomTag}>Phòng {bookingData.room_number || '---'}</span>
                    <span>
                      📅 {checkInDisplay || '---'} — {checkOutDisplay || '---'} 
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase' }}>Trạng thái hiện tại</p>
                <p style={{ margin: 0, color: '#0284c7', fontWeight: '600' }}>● {bookingData.status || 'Đang chờ'}</p>
              </div>
            </div>
          </div>

          {/* Card Tiền phòng */}
          <div style={styles.card}>
            <h4 style={styles.sectionTitle}>🛏️ Tiền phòng</h4>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Mô tả</th>
                  <th style={styles.th}>Đơn giá</th>
                  <th style={styles.th}>Số lượng</th>
                  <th style={{...styles.th, textAlign: 'right'}}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={styles.td}>Tiền phòng lưu trú<br/><span style={{fontSize: '13px', color: '#6b7280'}}>Mã Booking: {bookingData.booking_code || '---'}</span></td>
                  <td style={styles.td}>---</td>
                  <td style={styles.td}>---</td>
                  <td style={{...styles.td, textAlign: 'right', color: '#0284c7', fontWeight: '600'}}>{formatMoney(roomFee)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card Dịch vụ */}
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>🛎️ Các dịch vụ khả dụng</h4>
            </div>
            
            <div style={styles.servicesScrollContainer}>
              {services.map(srv => (
                <div key={srv.id} style={{...styles.serviceItem, opacity: srv.checked ? 1 : 0.6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input 
                      type="checkbox" 
                      checked={srv.checked} 
                      onChange={() => handleCheckChange(srv.id)} 
                      style={{ width: '18px', height: '18px', cursor: 'pointer', flexShrink: 0 }} 
                    />
                    <div>
                      <p style={{ margin: '0 0 4px 0', fontWeight: '500', textDecoration: srv.checked ? 'none' : 'line-through' }}>{srv.name}</p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Đơn giá: {formatMoney(srv.price)}</p>
                    </div>
                  </div>
                  
                  {srv.checked && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f9fafb', padding: '4px', borderRadius: '20px' }}>
                        <button onClick={() => handleQuantityChange(srv.id, -1)} style={styles.qtyBtn}>-</button>
                        <span style={{ fontSize: '14px', fontWeight: '500', width: '20px', textAlign: 'center' }}>{srv.quantity}</span>
                        <button onClick={() => handleQuantityChange(srv.id, 1)} style={styles.qtyBtn}>+</button>
                      </div>
                      <span style={{ fontWeight: '600', width: '80px', textAlign: 'right' }}>{formatMoney(srv.price * srv.quantity)}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card Bồi thường */}
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, ...styles.sectionTitle, color: '#b45309' }}>⚠️ Bồi thường & Hư hại</h4>
              <button onClick={handleAddDamageItem} style={styles.addBtn}>+ Thêm mục bồi thường</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {damages.map((item, index) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
                  <div style={{ flex: 2 }}>
                    {index === 0 && <label style={styles.label}>Tên vật phẩm/Hư hại</label>}
                    <input 
                      type="text" 
                      placeholder="Ví dụ: Vỡ ly thủy tinh..." 
                      style={styles.input}
                      value={item.name}
                      onChange={(e) => handleUpdateDamageItem(item.id, 'name', e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    {index === 0 && <label style={styles.label}>Số tiền phạt (₫)</label>}
                    <input 
                      type="number" 
                      style={styles.input}
                      value={item.cost}
                      onChange={(e) => handleUpdateDamageItem(item.id, 'cost', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  {damages.length > 1 && (
                    <button 
                      onClick={() => handleRemoveDamageItem(item.id)}
                      style={styles.deleteBtn}
                      title="Xóa mục này"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {damagesTotal > 0 && (
              <div style={{ marginTop: '16px', textAlign: 'right', fontWeight: '600', color: '#b45309' }}>
                Tổng bồi thường: {formatMoney(damagesTotal)}
              </div>
            )}
          </div>

        </div>

        {/* CỘT PHẢI */}
        <div style={styles.rightCol}>
          
          <div style={{ ...styles.card, background: '#fafaf9' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Tổng hợp chi phí</h3>
            
            <div style={styles.summaryRow}>
              <span style={{ color: '#4b5563' }}>Tạm tính (Phòng + Dịch vụ + Phạt)</span>
              <span style={{ fontWeight: '500' }}>{formatMoney(subTotal)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={{ color: '#4b5563' }}>Thuế VAT (10%)</span>
              <span style={{ fontWeight: '500' }}>{formatMoney(vat)}</span>
            </div>
            <div style={styles.summaryRow}>
              <span style={{ color: '#b45309', fontStyle: 'italic' }}>Giảm giá (Ưu đãi)</span>
              <span style={{ color: '#b45309', fontWeight: '500' }}>-{formatMoney(discount)}</span>
            </div>
            
            <div style={{ borderTop: '1px dashed #d1d5db', margin: '20px 0' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600' }}>Tổng cộng thanh toán</span>
              <span style={{ fontSize: '28px', fontWeight: '700', color: '#0284c7' }}>{formatMoney(grandTotal)}</span>
            </div>
          </div>

          <div style={styles.card}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px' }}>Phương thức thanh toán</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              <div 
                style={paymentMethod === 'cash' ? styles.paymentOptionActive : styles.paymentOption}
                onClick={() => setPaymentMethod('cash')}
              >
                <div style={{ fontSize: '24px' }}>💵</div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '14px' }}>Tiền mặt</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Thanh toán tại quầy</p>
                </div>
              </div>

              <div 
                style={paymentMethod === 'card' ? styles.paymentOptionActive : styles.paymentOption}
                onClick={() => setPaymentMethod('card')}
              >
                <div style={{ fontSize: '24px' }}>💳</div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '14px' }}>Thẻ tín dụng</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>Visa, Mastercard, JCB</p>
                </div>
              </div>

              <div 
                style={paymentMethod === 'qr' ? styles.paymentOptionActive : styles.paymentOption}
                onClick={() => setPaymentMethod('qr')}
              >
                <div style={{ fontSize: '24px' }}>📱</div>
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '600', fontSize: '14px' }}>Chuyển khoản QR</p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>VietQR, MoMo, VNPay</p>
                </div>
              </div>

            </div>
          </div>

          <button style={styles.checkoutBtn}>
            <span style={{ fontSize: '20px' }}>🖨️</span>
            <div>
              <p style={{ margin: 0 }}>Hoàn tất Check-out &</p>
              <p style={{ margin: 0 }}>In hóa đơn</p>
            </div>
          </button>
          <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '12px' }}>
            THAO TÁC NÀY SẼ CẬP NHẬT PHÒNG THÀNH TRẠNG THÁI 'ĐANG DỌN DẸP'
          </p>

        </div>
      </div>
    </div>
  );
};

// CSS Styles Object
const styles = {
  container: { backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '0 32px 32px 32px', boxSizing: 'border-box', fontFamily: 'system-ui, -apple-system, sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' },
  backBtn: { background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#4b5563', padding: '0 8px' },
  pageTitle: { margin: 0, fontSize: '20px', fontWeight: '600', color: '#111827' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '20px' },
  iconBtn: { cursor: 'pointer', fontSize: '20px', color: '#6b7280' },
  userInfo: { display: 'flex', alignItems: 'center', borderLeft: '1px solid #d1d5db', paddingLeft: '20px' },
  avatar: { width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#0f766e', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' },
  
  mainLayout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  leftCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' },
  rightCol: { width: '360px', display: 'flex', flexDirection: 'column', gap: '20px' },

  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  
  guestIcon: { width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', color: '#0284c7' },
  roomTag: { backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 10px', borderRadius: '16px', fontWeight: '600' },
  
  sectionTitle: { margin: '0', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' },
  
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '12px 0', borderBottom: '1px solid #e5e7eb', color: '#6b7280', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' },
  td: { padding: '16px 0', borderBottom: '1px solid #f3f4f6', verticalAlign: 'middle', fontSize: '15px' },

  servicesScrollContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '350px',
    overflowY: 'auto',
    paddingRight: '8px'
  },

  serviceItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fafafa', transition: 'all 0.2s' },
  qtyBtn: { width: '28px', height: '28px', borderRadius: '50%', border: '1px solid #d1d5db', backgroundColor: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },

  label: { display: 'block', fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', marginBottom: '8px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#f9fafb', fontSize: '14px', boxSizing: 'border-box', outline: 'none' },
  
  addBtn: { color: '#b45309', background: 'none', border: '1px dashed #b45309', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' },
  deleteBtn: { width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', padding: 0 },

  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' },
  
  paymentOption: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', backgroundColor: '#fff' },
  paymentOptionActive: { display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #0284c7', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#f0f9ff' },

  checkoutBtn: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '16px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(2, 132, 199, 0.2)' }
};

export default CheckoutContent;