import { useState } from 'react';
import { axiosClient } from '../config/axios';
import type { ApiResponse } from '../types/common';

export function CustomerActivationButton({ customerId, name }: { customerId: string; name: string }) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ token: string; expiresAt: string; email: string; phone: string } | null>(null);
  async function issue() {
    setBusy(true);
    setError('');
    try {
      const response = await axiosClient.post<unknown, ApiResponse<NonNullable<typeof result>>>(`/auth/customer-activation/${encodeURIComponent(customerId)}`, { confirmedIdentity: confirmed });
      setResult(response.data);
    } catch (err) {
      setError(err && typeof err === 'object' && 'message' in err ? String(err.message) : 'Không thể cấp mã.');
    } finally { setBusy(false); }
  }
  return <>
    <button type="button" className="text-xs text-sky-800 underline px-2" onClick={() => { setOpen(true); setConfirmed(false); setError(''); setResult(null); }}>Kích hoạt</button>
    {open && <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <section role="dialog" aria-modal="true" aria-label={`Kích hoạt tài khoản ${name}`} className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 text-left whitespace-normal">
        <h2 className="font-bold text-lg">Kích hoạt tài khoản — {name}</h2>
        {result ? <>
          <p>Khách nhập email <strong>{result.email}</strong>, số điện thoại <strong>{result.phone}</strong> và mã dưới đây tại trang đăng ký.</p>
          <input aria-label="Mã kích hoạt" readOnly value={result.token} onFocus={e => e.target.select()} className="border rounded p-3 w-full font-mono text-xs" />
          <p>Hết hạn: {new Date(result.expiresAt).toLocaleString('vi-VN')}. Mã dùng một lần; chỉ trao cho khách đã xác nhận.</p>
        </> : <>
          <p>Xác nhận danh tính khách tại quán trước khi cấp mã. Mã mới sẽ thay thế mã cũ và có hiệu lực 30 phút.</p>
          <label className="flex gap-2"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />Tôi đã xác nhận đúng khách hàng.</label>
          <button type="button" disabled={!confirmed || busy} onClick={() => void issue()} className="bg-sky-800 text-white rounded px-4 py-2 disabled:opacity-50">{busy ? 'Đang cấp mã…' : 'Cấp mã kích hoạt'}</button>
        </>}
        {error && <p role="alert" className="text-red-700">{error}</p>}
        <button type="button" disabled={busy} onClick={() => setOpen(false)} className="border rounded px-4 py-2">Đóng</button>
      </section>
    </div>}
  </>;
}
