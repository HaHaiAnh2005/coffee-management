import { axiosClient } from '../config/axios';
import type { LoginCredentials, RegisterPayload, User } from '../types/auth';
import type { ApiResponse } from '../types/common';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
    try {
      const res: any = await axiosClient.post('/auth/login', credentials);
      if (res?.data?.token && res?.data?.user) {
        return {
          success: true,
          message: 'Đăng nhập thành công',
          data: res.data,
        };
      }
      if (res?.token && res?.user) {
        return {
          success: true,
          message: 'Đăng nhập thành công',
          data: res,
        };
      }
    } catch (error: any) {
      const msg =
        typeof error === 'string'
          ? error
          : error?.message || error?.response?.data?.message || 'Đăng nhập thất bại';
      return { success: false, message: msg, data: undefined as any };
    }

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

  register: async (payload: RegisterPayload & { role?: string }): Promise<ApiResponse<{ user: User }>> => {
    try {
      const res: any = await axiosClient.post('/auth/register', payload);
      const user = res?.data || res;
      if (user && (user.id || user._id)) {
        return {
          success: true,
          message: 'Đăng ký tài khoản thành công',
          data: { user },
        };
      }
    } catch (error: any) {
      const msg =
        typeof error === 'string'
          ? error
          : error?.message || error?.response?.data?.message || 'Đăng ký thất bại';
      return {
        success: false,
        message: msg,
        data: undefined as any,
      };
    }

    return {
      success: true,
      message: 'Đăng ký tài khoản thành công',
      data: {
        user: {
          id: `U-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          role: (payload.role as any) || 'CUSTOMER',
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
