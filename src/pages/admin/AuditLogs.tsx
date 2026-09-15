import React, { useState } from 'react';
import { FiShield, FiSearch, FiFilter, FiCheckCircle, FiAlertTriangle, FiUser, FiClock, FiKey, FiTrash2 } from 'react-icons/fi';
import { useAuditStore } from '../../store/audit.store';
import { ROLE_LABELS } from '../../constants/roles';

export const AuditLogs: React.FC = () => {
  const logs = useAuditStore((state) => state.logs);
  const clearLogs = useAuditStore((state) => state.clearLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.targetId && log.targetId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.approvedBy && log.approvedBy.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = selectedAction === 'ALL' || log.action === selectedAction;

    return matchesSearch && matchesAction;
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'ITEM_CANCEL':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">Hủy món đã gửi</span>;
      case 'BILL_CANCEL':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-900 border border-red-300">Hủy hóa đơn</span>;
      case 'DISCOUNT_OVERRIDE':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300">Chiết khấu &gt;10%</span>;
      case 'SHIFT_OPEN':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-100 text-sky-900 border border-sky-300">Mở ca POS</span>;
      case 'SHIFT_CLOSE':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">Đóng ca POS</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-300">{action}</span>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950 p-6 rounded-3xl text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-3xl shadow-inner">
            <FiShield />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950">
                Anti-Fraud Engine
              </span>
              <span className="text-xs text-amber-200 font-medium flex items-center gap-1">
                <FiClock /> {logs.length} bản ghi nhật ký
              </span>
            </div>
            <h1 className="text-xl font-bold font-serif-title mt-0.5">Nhật Ký Kiểm Toán Anti-Fraud</h1>
            <p className="text-xs text-stone-300">
              Lưu vết bất biến toàn bộ thao tác nhạy cảm: Hủy món, Chiết khấu lớn, Duyệt mã PIN Quản lý, Mở/Đóng ca.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử kiểm toán?')) clearLogs();
          }}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-red-500/20 text-stone-200 hover:text-red-200 text-xs font-bold transition-all border border-white/10 flex items-center gap-1.5 self-start md:self-auto"
        >
          <FiTrash2 /> Xóa nhật ký
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-sm">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-3 text-stone-400 text-sm" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo nhân viên, người duyệt, món ăn..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500 bg-stone-50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <FiFilter className="text-stone-500 text-sm" />
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-stone-200 font-bold text-stone-700 bg-stone-50 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          >
            <option value="ALL">Tất cả hành động</option>
            <option value="ITEM_CANCEL">Hủy món đã gửi</option>
            <option value="BILL_CANCEL">Hủy hóa đơn</option>
            <option value="DISCOUNT_OVERRIDE">Chiết khấu &gt;10%</option>
            <option value="SHIFT_OPEN">Mở ca POS</option>
            <option value="SHIFT_CLOSE">Đóng ca POS</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-4">Thời gian</th>
                <th className="p-4">Nhân viên thực hiện</th>
                <th className="p-4">Loại hành động</th>
                <th className="p-4">Mục tiêu</th>
                <th className="p-4">Thay đổi</th>
                <th className="p-4">Duyệt bởi (PIN)</th>
                <th className="p-4">Lý do ghi nhận</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400 font-medium">
                    Không tìm thấy nhật ký kiểm toán phù hợp.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="p-4 whitespace-nowrap font-mono text-[11px] text-stone-600 font-medium">
                      {log.timestamp}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center font-bold text-stone-700">
                          <FiUser />
                        </div>
                        <div>
                          <p className="font-bold text-stone-900">{log.userName}</p>
                          <p className="text-[10px] text-stone-500 font-medium">
                            {ROLE_LABELS[log.userRole] || log.userRole}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 whitespace-nowrap">{getActionBadge(log.action)}</td>
                    <td className="p-4 font-bold text-stone-800 max-w-[150px] truncate">{log.targetId || 'N/A'}</td>
                    <td className="p-4 max-w-[200px]">
                      {log.oldValue && <p className="text-[11px] text-stone-500 line-through">{log.oldValue}</p>}
                      {log.newValue && <p className="text-[11px] font-bold text-emerald-800">{log.newValue}</p>}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {log.approvedBy ? (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-200 w-fit">
                          <FiKey className="text-amber-600 shrink-0" />
                          <span>{log.approvedBy}</span>
                        </div>
                      ) : (
                        <span className="text-stone-400 italic text-[11px]">Tự làm theo quyền</span>
                      )}
                    </td>
                    <td className="p-4 text-stone-600 max-w-[200px] truncate italic">{log.reason || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
