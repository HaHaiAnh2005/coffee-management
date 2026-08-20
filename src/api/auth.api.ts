import type { LoginCredentials, RegisterPayload, User } from '../types/auth';
import type { ApiResponse } from '../types/common';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
    return {
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        token: 'mock_jwt_token_laura_coffee_2026',
        user: {
          id: 'U01',
          name: 'Nguyễn Văn Thu Ngân',
          email: credentials.email || 'cashier@lauracoffee.vn',
          phone: '0988888888',
          role: 'ADMIN',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        },
      },
    };
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse<{ user: User }>> => {
    return {
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: {
        user: {
          id: `U-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: 'CUSTOMER',
        },
      },
    };
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    return {
      success: true,
      message: 'Lấy thông tin người dùng thành công',
      data: {
        id: 'U01',
        name: 'Nguyễn Văn Thu Ngân',
        email: 'cashier@lauracoffee.vn',
        phone: '0988888888',
        role: 'ADMIN',
      },
    };
  },
};
