import type { Employee } from '../types/employee';

export const INITIAL_EMPLOYEES: (Employee & { pin?: string })[] = [
  { id: 'EMP01', code: 'NV-001', name: 'Nguyễn Văn Chủ Quán', email: 'admin@lauracoffee.vn', phone: '0988888888', role: 'ADMIN', pin: '9999', shift: 'Full-time', salary: 25000000, startDate: '2025-01-15', status: 'active' },
  { id: 'EMP02', code: 'NV-002', name: 'Trần Thị Quản Lý', email: 'manager@lauracoffee.vn', phone: '0989999999', role: 'MANAGER', pin: '1234', shift: 'Full-time', salary: 15000000, startDate: '2025-02-01', status: 'active' },
  { id: 'EMP03', code: 'NV-003', name: 'Nguyễn Văn Thu Ngân', email: 'cashier@lauracoffee.vn', phone: '0978888888', role: 'CASHIER', shift: 'Sáng', salary: 9000000, startDate: '2025-03-01', status: 'active' },
  { id: 'EMP04', code: 'NV-004', name: 'Lê Thị Pha Chế', email: 'barista@lauracoffee.vn', phone: '0977777777', role: 'BARISTA', shift: 'Sáng', salary: 8500000, startDate: '2025-03-01', status: 'active' },
  { id: 'EMP05', code: 'NV-005', name: 'Trần Văn Phục Vụ', email: 'waiter@lauracoffee.vn', phone: '0966666666', role: 'WAITER', shift: 'Chiều', salary: 7000000, startDate: '2025-05-10', status: 'active' },
];

export const employeeApi = {
  getAll: async (): Promise<Employee[]> => INITIAL_EMPLOYEES,
};
