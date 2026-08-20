import type { Role } from './auth';

export interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  shift: 'Sáng' | 'Chiều' | 'Tối' | 'Full-time';
  salary: number;
  startDate: string;
  status: 'active' | 'inactive';
}
