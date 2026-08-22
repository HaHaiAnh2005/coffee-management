import Category from '../models/category.model';
import Product from '../models/product.model';
import Area from '../models/area.model';
import Table from '../models/table.model';
import User from '../models/user.model';
import Settings from '../models/settings.model';
import Customer from '../models/customer.model';

const FULL_PRODUCTS = [
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

export const seedData = async (): Promise<void> => {
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log('[Seeder] Seeding initial categories...');
      await Category.insertMany([
        { id: 'tea_flower', name: '🧋 TRÀ SỮA HƯƠNG HOA', icon: '🧋' },
        { id: 'cloud_cream', name: '☁️ KEM MÂY', icon: '☁️' },
        { id: 'kem_cheese', name: '🧀 KEM CHEESE', icon: '🧀' },
        { id: 'de_cuoi', name: '🥜 SERIES DẺ CƯỜI', icon: '🥜' },
        { id: 'fresh_fruit', name: '🍹 TRÀ TRÁI CÂY TƯƠI', icon: '🍹' },
        { id: 'fruit_cheese', name: '🍇 TRÀ TRÁI CÂY KEM CHEESE', icon: '🍇' },
        { id: 'pastry', name: '🥐 SERIES BÁNH', icon: '🥐' },
        { id: 'signature_matcha', name: '🍵 MATCHA THƯỢNG HẠNG', icon: '🍵' },
      ]);
    }

    const productCount = await Product.countDocuments();
    if (productCount < FULL_PRODUCTS.length) {
      console.log(`[Seeder] Seeding/Updating products (${productCount}/${FULL_PRODUCTS.length})...`);
      for (const item of FULL_PRODUCTS) {
        await Product.findOneAndUpdate({ id: item.id }, item, { upsert: true, new: true });
      }
    }

    const areaCount = await Area.countDocuments();
    if (areaCount === 0) {
      console.log('[Seeder] Seeding initial areas & tables...');
      await Area.insertMany([
        { id: 'floor1', name: 'Tầng 1 - Máy Lạnh & Quầy Bar' },
        { id: 'floor2', name: 'Tầng 2 - Không Gian Yên Tĩnh' },
        { id: 'garden', name: 'Sân Vườn - Thơ Mộng Bồng Biêng' },
      ]);

      await Table.insertMany([
        { id: 'T01', name: 'Bàn 01 (Cửa Sổ)', areaId: 'floor1', capacity: 2, status: 'occupied', currentOrderId: 'ORD-1001', occupiedAt: '2026-07-31 13:45' },
        { id: 'T02', name: 'Bàn 02', areaId: 'floor1', capacity: 4, status: 'available' },
        { id: 'T03', name: 'Bàn 03', areaId: 'floor1', capacity: 4, status: 'occupied', currentOrderId: 'ORD-1002', occupiedAt: '2026-07-31 14:10' },
        { id: 'T04', name: 'Bàn Sofa VIP 1', areaId: 'floor1', capacity: 6, status: 'reserved' },
      ]);
    }

    const userCount = await User.countDocuments();
    if (userCount < 3) {
      console.log('[Seeder] Seeding default users (Admin, Cashier, Staff)...');
      const bcrypt = (await import('bcryptjs')).default;
      const hashedPassword = await bcrypt.hash('123456', 10);

      const defaultUsers = [
        {
          id: 'U01',
          name: 'Quản Lý Trưởng',
          email: 'admin@coffeemanagement.com',
          password: hashedPassword,
          role: 'admin',
          phone: '0988888888',
        },
        {
          id: 'U02',
          name: 'Thu Ngân Quầy',
          email: 'thungan@coffeemanagement.com',
          password: hashedPassword,
          role: 'cashier',
          phone: '0977777777',
        },
        {
          id: 'U03',
          name: 'Nhân Viên Phục Vụ',
          email: 'nhanvien@coffeemanagement.com',
          password: hashedPassword,
          role: 'staff',
          phone: '0966666666',
        },
      ];

      for (const u of defaultUsers) {
        await User.findOneAndUpdate({ email: u.email }, u, { upsert: true, new: true });
      }
    }

    const sampleCustomers = [
      {
        id: 'CUS-001',
        name: 'Phạm Minh Anh',
        phone: '0912345678',
        email: 'minhanh@gmail.com',
        points: 240,
        totalSpent: 2400000,
        tier: 'Vàng',
        joinedDate: '2025-01-15',
        notes: 'Khách hàng thân thiết thích uống Cà phê muối'
      },
      {
        id: 'CUS-002',
        name: 'Hoàng Quốc Việt',
        phone: '0987654321',
        email: 'quocviet@gmail.com',
        points: 510,
        totalSpent: 5100000,
        tier: 'Kim Cương',
        joinedDate: '2025-02-01',
        notes: 'VIP - Đã quy đổi voucher 100k'
      },
      {
        id: 'CUS-003',
        name: 'Đỗ Thùy Trang',
        phone: '0905111222',
        email: 'thuytrang@gmail.com',
        points: 85,
        totalSpent: 850000,
        tier: 'Bạc',
        joinedDate: '2025-03-10',
        notes: 'Thường mua Trà nhài bồng biêng'
      },
      {
        id: 'CUS-004',
        name: 'Nguyễn Văn Hải',
        phone: '0933444555',
        email: 'vanhai.nguyen@gmail.com',
        points: 320,
        totalSpent: 3200000,
        tier: 'Vàng',
        joinedDate: '2025-04-05',
        notes: 'Khách đặt mang đi định kỳ'
      },
      {
        id: 'CUS-005',
        name: 'Lê Thị Khánh Huyền',
        phone: '0977888999',
        email: 'khanhhuyen.le@gmail.com',
        points: 680,
        totalSpent: 6800000,
        tier: 'Kim Cương',
        joinedDate: '2025-01-20',
        notes: 'Khách VIP văn phòng'
      },
      {
        id: 'CUS-006',
        name: 'Nguyễn Thị Mai',
        phone: '0901234567',
        email: 'mai.nguyen@gmail.com',
        points: 1250,
        tier: 'Kim Cương',
        totalSpent: 5400000,
        joinedDate: '2025-10-15',
      },
      {
        id: 'CUS-007',
        name: 'Trần Văn Nam',
        phone: '0902345678',
        email: 'nam.tran@gmail.com',
        points: 650,
        tier: 'Vàng',
        totalSpent: 2100000,
        joinedDate: '2026-01-20',
      },
      {
        id: 'CUS-008',
        name: 'Lê Hoàng Yến',
        phone: '0903456789',
        email: 'yen.le@gmail.com',
        points: 280,
        tier: 'Bạc',
        totalSpent: 950000,
        joinedDate: '2026-04-10',
      },
      {
        id: 'CUS-009',
        name: 'Phạm Quốc Anh',
        phone: '0904567890',
        email: 'anh.pham@gmail.com',
        points: 50,
        tier: 'Đồng',
        totalSpent: 180000,
        joinedDate: '2026-07-01',
      },
    ];

    console.log('[Seeder] Ensuring all 9 customers exist in MongoDB...');
    for (const c of sampleCustomers) {
      await Customer.findOneAndUpdate({ phone: c.phone }, c, { upsert: true, new: true });
    }

    const sampleStaff = [
      { id: 'EMP01', name: 'Nguyễn Văn Chủ Quán', email: 'admin@lauracoffee.vn', phone: '0988888888', role: 'ADMIN', pin: '9999' },
      { id: 'EMP02', name: 'Trần Thị Quản Lý', email: 'manager@lauracoffee.vn', phone: '0989999999', role: 'MANAGER', pin: '1234' },
      { id: 'EMP03', name: 'Nguyễn Văn Thu Ngân', email: 'cashier@lauracoffee.vn', phone: '0978888888', role: 'CASHIER' },
      { id: 'EMP04', name: 'Lê Thị Pha Chế', email: 'barista@lauracoffee.vn', phone: '0977777777', role: 'BARISTA' },
      { id: 'EMP05', name: 'Trần Văn Phục Vụ', email: 'waiter@lauracoffee.vn', phone: '0966666666', role: 'WAITER' },
    ];

    console.log('[Seeder] Ensuring RBAC staff accounts exist in MongoDB...');
    for (const s of sampleStaff) {
      await User.findOneAndUpdate({ id: s.id }, s, { upsert: true, new: true });
    }

    const settingsCount = await Settings.countDocuments();
    if (settingsCount === 0) {
      console.log('[Seeder] Seeding default settings...');
      await Settings.create({});
    }

    console.log('[Seeder] Database check & seeding complete.');
  } catch (error: any) {
    console.error('[Seeder] Error during seed:', error.message);
  }
};
