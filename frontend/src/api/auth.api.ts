import { axiosClient } from '../config/axios';
import type { LoginCredentials, RegisterPayload, User } from '../types/auth';
import type { ApiResponse } from '../types/common';

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> => {
    const res = await axiosClient.post<unknown, ApiResponse<{ token: string; user: User }>>('/auth/login', credentials);
    if (!res?.success || !res.data?.token || !res.data.user?.id) {
      throw new Error(res?.message || 'Phản hồi đăng nhập không hợp lệ.');
    }
    return res;
  },
  register: async (payload: RegisterPayload & { role?: string }): Promise<ApiResponse<{ user: User }>> => {
    const res = await axiosClient.post<unknown, ApiResponse<User>>('/auth/register', payload);
    if (!res?.success || !res.data?.id) {
      throw new Error(res?.message || 'Phản hồi đăng ký không hợp lệ.');
    }
    return { success: true, message: res.message || 'Đăng ký thành công', data: { user: res.data } };
  },
  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await axiosClient.get<unknown, ApiResponse<User>>('/auth/me');
    if (!res?.success || !res.data?.id) throw new Error(res?.message || 'Phiên đăng nhập không hợp lệ.');
    return res;
  },
};
