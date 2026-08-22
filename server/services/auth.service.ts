import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/user.model';
import Customer from '../models/customer.model';

const JWT_SECRET = process.env.JWT_SECRET || 'coffee_management_super_secret_jwt_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export class AuthService {
  async register(userData: Partial<IUser> & { password?: string }): Promise<Omit<IUser, 'password'>> {
    const { email, password, name, role, avatar, phone } = userData;

    // Check if email already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email đã được đăng ký tài khoản khác.');
    }

    const userRole = (role || 'CUSTOMER').toUpperCase();

    // Check if phone already registered as customer
    if (userRole === 'CUSTOMER' && phone) {
      const existingCustomer = await Customer.findOne({ phone });
      if (existingCustomer) {
        throw new Error('Số điện thoại này đã được đăng ký tài khoản khách hàng.');
      }
    }

    // Generate custom string id if not provided
    const id = userData.id || `U-${Date.now().toString().slice(-4)}`;

    // Hash password if provided
    let hashedPassword = '';
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    } else {
      // Default password fallback for quick registration
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash('123456', salt);
    }

    const newUser = new User({
      id,
      name,
      email,
      password: hashedPassword,
      role: userRole === 'ADMIN' ? 'admin' : 'customer',
      avatar,
      phone,
    });

    const savedUser = await newUser.save();

    // Auto-create Customer profile if user is a customer
    if (userRole === 'CUSTOMER') {
      try {
        const cusId = `CUS-${Date.now().toString().slice(-6)}`;
        const todayStr = new Date().toISOString().split('T')[0];
        const newCustomer = new Customer({
          id: cusId,
          name: name || 'Khách hàng mới',
          phone: phone || '0900000000',
          email: email || '',
          points: 50, // Welcome points
          tier: 'Bạc',
          totalSpent: 0,
          totalOrders: 0,
          joinedDate: todayStr,
          notes: 'Đăng ký tài khoản từ Website Bồng Biêng',
        });
        await newCustomer.save();
      } catch (err: any) {
        console.error('Error creating customer record during auth register:', err);
      }
    }

    const userObj = savedUser.toObject();
    delete userObj.password;
    return userObj;
  }

  async login(email: string, password?: string): Promise<{ user: Partial<IUser>; token: string }> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
    }

    // If user has a password in DB and password was provided, verify it
    if (user.password && password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
      }
    }

    // Generate JWT Token
    const payload = {
      _id: user._id.toString(),
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }

  async getMe(userId: string): Promise<Partial<IUser> | null> {
    const user = await User.findOne({ $or: [{ _id: userId }, { id: userId }] }).select('-password').lean();
    return user;
  }
}

export default new AuthService();

