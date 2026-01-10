export const FLOORS = [
  { id: 'all', name: 'Tất cả các tầng', icon: 'layer' },
  { id: 1, name: 'Tầng 1 - Sảnh chính', icon: 'stairs' },
  { id: 2, name: 'Tầng 2 - Phòng VIP', icon: 'stairs' },
  { id: 3, name: 'Tầng 3 - Phòng Đôi', icon: 'stairs' },
];

export const ROOMS_DATA = [
  // Tầng 1
  { id: 101, number: '101', name: 'Deluxe Single', floor: 1, type: 'Single', status: 'AVAILABLE', capacity: 2, price: 500000 },
  { id: 102, number: '102', name: 'Deluxe Double', floor: 1, type: 'Double', status: 'AVAILABLE', capacity: 4, price: 850000 },
  { id: 103, number: '103', name: 'Standard', floor: 1, type: 'Single', status: 'BOOKED', capacity: 2, price: 450000 },
  { id: 104, number: '104', name: 'Standard', floor: 1, type: 'Single', status: 'BOOKED', capacity: 2, price: 450000 },
  { id: 105, number: '105', name: 'Sửa điện', floor: 1, type: 'Repair', status: 'MAINTENANCE', note: 'Xong 14:00' },
  
  // Tầng 2
  { id: 201, number: '201', name: 'President Suite', floor: 2, type: 'VIP', status: 'AVAILABLE', capacity: 4, price: 2500000, isVip: true },
  { id: 202, number: '202', name: 'VIP Double', floor: 2, type: 'VIP', status: 'AVAILABLE', capacity: 3, price: 1200000 },
  { id: 203, number: '203', name: 'VIP Double', floor: 2, type: 'VIP', status: 'AVAILABLE', capacity: 3, price: 1200000 },
];