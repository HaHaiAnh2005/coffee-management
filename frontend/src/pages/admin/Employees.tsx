import React, { useState } from 'react';
import { INITIAL_EMPLOYEES } from '../../api/employee.api';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROLE_LABELS } from '../../constants/roles';
import { FiUsers, FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiSearch, FiKey, FiShield } from 'react-icons/fi';
import type { Employee } from '../../types/employee';
import type { Role } from '../../types/auth';

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<(Employee & { pin?: string })[]>(INITIAL_EMPLOYEES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<(Employee & { pin?: string }) | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    code: string;
    name: string;
    email: string;
    phone: string;
    role: Role;
    pin: string;
    shift: 'Sáng' | 'Chiều' | 'Tối' | 'Full-time';
    salary: number;
    status: 'active' | 'inactive';
  }>({
    code: '',
    name: '',
    email: '',
    phone: '',
    role: 'CASHIER',
    pin: '',
    shift: 'Full-time',
    salary: 8000000,
    status: 'active',
  });

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setFormData({
      code: `NV-00${employees.length + 1}`,
      name: '',
      email: '',
      phone: '',
      role: 'CASHIER',
      pin: '',
      shift: 'Full-time',
      salary: 8000000,
      status: 'active',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (emp: Employee & { pin?: string }) => {
    setEditingEmployee(emp);
    setFormData({
      code: emp.code,
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      pin: emp.pin || '',
      shift: emp.shift,
      salary: emp.salary,
      status: emp.status,
    });
    setIsModalOpen(true);
  };

  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này khỏi hệ thống?')) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    if (editingEmployee) {
      // Edit
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id
            ? {
                ...emp,
                code: formData.code,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                role: formData.role,
                pin: formData.pin,
                shift: formData.shift,
                salary: formData.salary,
                status: formData.status,
              }
            : emp
        )
      );
    } else {
      // Create new
      const newEmp: Employee & { pin?: string } = {
        id: `EMP_${Date.now()}`,
        code: formData.code,
        name: formData.name,
        email: formData.email || `${formData.code.toLowerCase()}@lauracoffee.vn`,
        phone: formData.phone,
        role: formData.role,
        pin: formData.pin,
        shift: formData.shift,
        salary: formData.salary,
        startDate: new Date().toISOString().split('T')[0],
        status: formData.status,
      };
      setEmployees([...employees, newEmp]);
    }

    setIsModalOpen(false);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6 text-stone-900 pb-12">
      {/* Header & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900 flex items-center gap-2">
            <FiUsers className="text-sky-600" /> Quản Lý Nhân Viên & RBAC
          </h1>
          <p className="text-xs text-stone-500 mt-1">Danh sách nhân viên, phân quyền vai trò (RBAC) & Mã PIN duyệt Anti-Fraud</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên/mã/SĐT..."
              className="bg-white border border-sky-200 rounded-xl pl-10 pr-4 py-2 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-sky-500 shadow-xs"
            />
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
          >
            <FiPlus className="stroke-[3]" /> Thêm Nhân Viên
          </button>
        </div>
      </div>

      {/* Table List */}
      <div className="bg-white border border-sky-100 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-sky-50/80 text-stone-700 uppercase border-b border-sky-100 font-bold">
                <th className="p-4">Mã NV & Họ Tên</th>
                <th className="p-4">Email / SĐT</th>
                <th className="p-4">Vai trò (Role)</th>
                <th className="p-4">Mã PIN Duyệt</th>
                <th className="p-4">Ca làm việc</th>
                <th className="p-4">Lương cơ bản</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100/60 text-stone-800">
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-sky-50/40 transition-colors">
                  <td className="p-4 font-bold text-stone-900">
                    <span className="text-sky-700 font-mono text-[11px] block">{emp.code}</span>
                    <span className="text-sm">{emp.name}</span>
                  </td>
                  <td className="p-4 text-stone-500">
                    <div>{emp.email}</div>
                    <div className="text-stone-700 font-mono text-[11px]">{emp.phone}</div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        emp.role === 'ADMIN'
                          ? 'bg-purple-100 text-purple-900 border-purple-300'
                          : emp.role === 'MANAGER'
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : emp.role === 'CASHIER'
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : emp.role === 'BARISTA'
                          ? 'bg-orange-100 text-orange-900 border-orange-300'
                          : 'bg-sky-100 text-sky-900 border-sky-300'
                      }`}
                    >
                      {ROLE_LABELS[emp.role] || emp.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold">
                    {emp.pin ? (
                      <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex items-center gap-1 w-fit">
                        <FiKey className="text-amber-600" /> {emp.pin}
                      </span>
                    ) : (
                      <span className="text-stone-400 italic">Chưa cài</span>
                    )}
                  </td>
                  <td className="p-4 text-stone-700 font-medium">{emp.shift}</td>
                  <td className="p-4 font-extrabold text-sky-800">{formatCurrency(emp.salary)}</td>
                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                        emp.status === 'active'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {emp.status === 'active' ? 'Đang làm việc' : 'Tạm nghỉ'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditModal(emp)}
                        className="p-2 rounded-lg bg-sky-100 hover:bg-sky-200 text-sky-800 transition-colors cursor-pointer"
                        title="Chỉnh sửa"
                      >
                        <FiEdit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="p-2 rounded-lg bg-stone-100 hover:bg-rose-600 hover:text-white text-stone-500 transition-colors cursor-pointer"
                        title="Xóa nhân viên"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-stone-500">
                    Không tìm thấy nhân viên nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl text-stone-900">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                <FiUsers className="text-sky-600" />
                {editingEmployee ? 'Chỉnh Sửa Nhân Viên' : 'Thêm Nhân Viên Mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Mã NV:</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Họ và tên:</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Email:</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nv@lauracoffee.vn"
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Số điện thoại:</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0988..."
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Vai trò (Role):</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500 font-bold"
                  >
                    <option value="ADMIN">Chủ quán (Admin)</option>
                    <option value="MANAGER">Quản lý cửa hàng</option>
                    <option value="CASHIER">Thu ngân (Cashier)</option>
                    <option value="WAITER">Phục vụ bàn (Waiter)</option>
                    <option value="BARISTA">Pha chế / Bếp (Barista)</option>
                    <option value="CUSTOMER">Khách hàng</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1">
                    <FiShield className="text-amber-600" /> Mã PIN Duyệt (4 Số):
                  </label>
                  <input
                    type="text"
                    maxLength={4}
                    value={formData.pin}
                    onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                    placeholder="Ví dụ: 1234"
                    className="w-full bg-amber-50/60 border border-amber-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-amber-900 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Ca làm việc:</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Full-time">Full-time (Cả ngày)</option>
                    <option value="Sáng">Ca Sáng (07:00 - 12:30)</option>
                    <option value="Chiều">Ca Chiều (12:30 - 18:00)</option>
                    <option value="Tối">Ca Tối (18:00 - 23:00)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-stone-600 uppercase">Lương cơ bản (VND):</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                    className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-stone-600 uppercase">Trạng thái làm việc:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:border-sky-500"
                >
                  <option value="active">Đang làm việc</option>
                  <option value="inactive">Tạm nghỉ</option>
                </select>
              </div>

              <div className="pt-3 border-t border-sky-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs flex items-center justify-center gap-1 shadow-md"
                >
                  <FiCheck className="stroke-[3]" /> Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
