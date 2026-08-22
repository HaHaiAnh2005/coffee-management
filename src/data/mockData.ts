import type { Area, Category, InventoryItem, Product, StoreSettings, Table } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'tea_flower', name: '🧋 TRÀ SỮA HƯƠNG HOA', icon: '🧋' },
  { id: 'cloud_cream', name: '☁️ KEM MÂY', icon: '☁️' },
  { id: 'kem_cheese', name: '🧀 KEM CHEESE', icon: '🧀' },
  { id: 'de_cuoi', name: '🥜 SERIES DẺ CƯỜI', icon: '🥜' },
  { id: 'fresh_fruit', name: '🍹 TRÀ TRÁI CÂY TƯƠI', icon: '🍹' },
  { id: 'fruit_cheese', name: '🍇 TRÀ TRÁI CÂY KEM CHEESE', icon: '🍇' },
  { id: 'pastry', name: '🥐 SERIES BÁNH', icon: '🥐' },
  { id: 'signature_matcha', name: '🍵 MATCHA THƯỢNG HẠNG', icon: '🍵', description: 'Series Matcha Uji Nhật Bản nguyên chất ngậy thơm bồng bềnh' },
];

export const INITIAL_AREAS: Area[] = [
  { id: 'floor1', name: 'Tầng 1 - Máy Lạnh & Quầy Bar' },
  { id: 'floor2', name: 'Tầng 2 - Không Gian Yên Tĩnh' },
  { id: 'garden', name: 'Sân Vườn - Thơ Mộng Bồng Biêng' },
];

export const INITIAL_TABLES: Table[] = [
  { id: 'T01', name: 'Bàn 01 (Cửa Sổ)', areaId: 'floor1', capacity: 2, status: 'occupied', currentOrderId: 'ORD-1001', occupiedAt: '2026-07-31 13:45' },
  { id: 'T02', name: 'Bàn 02', areaId: 'floor1', capacity: 4, status: 'available' },
  { id: 'T03', name: 'Bàn 03', areaId: 'floor1', capacity: 4, status: 'occupied', currentOrderId: 'ORD-1002', occupiedAt: '2026-07-31 14:10' },
  { id: 'T04', name: 'Bàn Sofa VIP 1', areaId: 'floor1', capacity: 6, status: 'reserved' },
];

export const INITIAL_PRODUCTS: Product[] = [
  // 🧋 TRÀ SỮA HƯƠNG HOA (M101 - M105)
  {
    id: 'M101',
    name: 'Thanh Nhài (Bồng Biêng)',
    categoryId: 'tea_flower',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: 'Trà sữa hoa nhài đậm vị hoa nhài tươi tự nhiên kết hợp sữa thơm béo dịu nhẹ.',
    isAvailable: true,
  },
  {
    id: 'M102',
    name: 'Song Nhài (Bồng Lai)',
    categoryId: 'tea_flower',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    description: 'Trà sữa song nhài gấp đôi hương hoa thanh khiết tao nhã.',
    isAvailable: true,
  },
  {
    id: 'M103',
    name: 'Mộc Hoa',
    categoryId: 'tea_flower',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
    description: 'Trà sữa quế hoa ngát hương hoa mộc đượm vị cổ truyền.',
    isAvailable: true,
  },
  {
    id: 'M104',
    name: 'Bồng Đào',
    categoryId: 'tea_flower',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    description: 'Ô long đào trứng sữa béo ngậy thơm ngọt nốt đào chín mọng.',
    isAvailable: true,
  },
  {
    id: 'M105',
    name: 'Phong Lan',
    categoryId: 'tea_flower',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    description: 'Hồng trà sữa phong lan quý phái nốt hương đượm đà hậu vị.',
    isAvailable: true,
  },

  // ☁️ KEM MÂY (M201 - M203)
  {
    id: 'M201',
    name: 'Đào Mây',
    categoryId: 'cloud_cream',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    description: 'Ô long đào sữa phủ ngọn kem mây mềm mịn bồng bềnh tan chảy.',
    isAvailable: true,
  },
  {
    id: 'M202',
    name: 'Nhài Mây',
    categoryId: 'cloud_cream',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: 'Nhài sữa thượng hạng phủ lớp mây kem frappe mịn màng.',
    isAvailable: true,
  },
  {
    id: 'M203',
    name: 'Lan Mây',
    categoryId: 'cloud_cream',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    description: 'Hồng trà sữa phong lan lớp kem mây phô mai thơm ngậy béo bùi.',
    isAvailable: true,
  },

  // 🧀 KEM CHEESE (M301 - M303)
  {
    id: 'M301',
    name: 'Nhài Cheese',
    categoryId: 'kem_cheese',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    description: 'Trà nhài tươi kết hợp màng kem phô mai béo mặn sánh mịn.',
    isAvailable: true,
  },
  {
    id: 'M302',
    name: 'Đào Cheese',
    categoryId: 'kem_cheese',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    description: 'Ô long đào ngọt dịu phủ lớp kem phô mai mặn béo ngậy.',
    isAvailable: true,
  },
  {
    id: 'M303',
    name: 'Lan Cheese',
    categoryId: 'kem_cheese',
    price: 60000,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    description: 'Hồng trà phong lan thơm đượm nốt kem phô mai béo mặn.',
    isAvailable: true,
  },

  // 🥜 SERIES DẺ CƯỜI (M401 - M402)
  {
    id: 'M401',
    name: 'Thanh',
    categoryId: 'de_cuoi',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    description: 'Trà thanh nhài kết hợp kem dẻ cười hạt nướng bùi thơm đặc sản.',
    isAvailable: true,
  },
  {
    id: 'M402',
    name: 'Xuân',
    categoryId: 'de_cuoi',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=800&q=80',
    description: 'Trà nhài dừa tươi hòa quyện kem dẻ cười bùi thơm đậm đà.',
    isAvailable: true,
  },

  // 🍹 TRÀ TRÁI CÂY TƯƠI (M501 - M506)
  {
    id: 'M501',
    name: 'Mận Đào Hoa',
    categoryId: 'fresh_fruit',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    description: 'Trà Mận Đào đá xay tươi mát chua ngọt mọng nước sảng khoái.',
    isAvailable: true,
  },
  {
    id: 'M502',
    name: 'Nhân Sen',
    categoryId: 'fresh_fruit',
    price: 70000,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    description: 'Nhãn Sen ngọt mọng kết hợp kem Nhàn đá xay thanh mát.',
    isAvailable: true,
  },
  {
    id: 'M503',
    name: 'Nhân Dừa',
    categoryId: 'fresh_fruit',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80',
    description: 'Nhãn Dừa tươi đá xay thơm lừng giòn sần sật mọng nước.',
    isAvailable: true,
  },
  {
    id: 'M504',
    name: 'Thanh Xoài',
    categoryId: 'fresh_fruit',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    description: 'Trà xoài tươi ngọt dịu mọng hương thơm trái cây nhiệt đới.',
    isAvailable: true,
  },
  {
    id: 'M505',
    name: 'Xoài Tuyết',
    categoryId: 'fresh_fruit',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    description: 'Xoài chín ngọt mọng dừa tươi thanh béo sảng khoái.',
    isAvailable: true,
  },
  {
    id: 'M506',
    name: 'Lam Nho',
    categoryId: 'fresh_fruit',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    description: 'Trà nho xanh mọng nước chua ngọt nhẹ nhàng tươi mát.',
    isAvailable: true,
  },

  // 🍇 TRÀ TRÁI CÂY KEM CHEESE (M601)
  {
    id: 'M601',
    name: 'Nho Cheese',
    categoryId: 'fruit_cheese',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
    description: 'Trà nho tím đậm đà ngọt mọng phủ lớp kem phô mai béo mặn.',
    isAvailable: true,
  },

  // 🥐 SERIES BÁNH (M701 - M703)
  {
    id: 'M701',
    name: 'Bánh Sừng Bò (Croissant)',
    categoryId: 'pastry',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    description: 'Bánh sừng bò ngàn lớp nướng nóng giòn tan thơm lừng bơ Pháp.',
    isAvailable: true,
  },
  {
    id: 'M702',
    name: 'Bánh Sừng Bò Hạnh Nhân (Almond Croissant)',
    categoryId: 'pastry',
    price: 69000,
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
    description: 'Croissant phủ lát hạnh nhân giòn bùi cùng lớp sốt hạnh nhân thơm nức.',
    isAvailable: true,
  },
  {
    id: 'M703',
    name: 'Bánh Su Kem (Vị Trà / Vị Vani)',
    categoryId: 'pastry',
    price: 59000,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
    description: 'Bánh su kem vỏ giòn nhẹ nhân kem vị trà hoặc vani mát lạnh béo mịn.',
    isAvailable: true,
  },

  // 🍵 SERIES MATCHA THƯỢNG HẠNG (M801)
  {
    id: 'M801',
    name: 'Matcha Uji Kem Mây (Bồng Biêng)',
    categoryId: 'signature_matcha',
    price: 68000,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
    description: 'Matcha Uji Shizuoka thượng hạng phủ ngọn kem mây mềm mịn bồng bềnh.',
    isAvailable: true,
  },
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'INV01', name: 'Hạt Cà Phê Robusta Đắk Lắk', unit: 'Kg', quantity: 24.5, minAlertThreshold: 5, category: 'Cà phê hạt', lastUpdated: '2026-07-31 08:00' },
  { id: 'INV02', name: 'Cốt Trà Nhài Tươi Bông Biêng', unit: 'Kg', quantity: 15.0, minAlertThreshold: 4, category: 'Trà & Hoa', lastUpdated: '2026-07-31 08:00' },
];

export const INITIAL_SETTINGS: StoreSettings = {
  storeName: '88 BỒNG BIÊNG - MENU DỆT HƯƠNG',
  address: '128 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  phone: '0988.888.999',
  taxCode: '0315891234',
  bankName: 'TPBank',
  bankAccountNo: '07755056866',
  bankAccountName: 'HA HAI ANH',
};
