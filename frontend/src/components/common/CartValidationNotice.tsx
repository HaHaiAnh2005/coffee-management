import { useCartStore } from '../../store/cart.store';
export function CartValidationNotice() {
  const error = useCartStore(state => state.validationError);
  return error ? <div role="alert" className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-rose-50 border border-rose-300 text-rose-900 rounded-xl px-4 py-3 shadow-lg flex gap-4">
    <span>{error}</span><button type="button" aria-label="Đóng thông báo" onClick={() => useCartStore.setState({ validationError: '' })}>×</button>
  </div> : null;
}
