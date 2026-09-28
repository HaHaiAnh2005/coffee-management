import assert from 'node:assert/strict';
import test, { beforeEach } from 'node:test';
import { personNameError, phoneError, emailError, orderQuantityError } from '../shared/validation';
import { inputError } from '../backend/middleware/input.middleware';
import { numericPayloadError } from '../backend/middleware/numeric.middleware';
import { useCartStore } from '../frontend/src/store/cart.store';
import { useCartStore as legacyCart } from '../frontend/src/stores/useCartStore';
import Order from '../backend/models/order.model';
import User from '../backend/models/user.model';
import Customer from '../backend/models/customer.model';
import { useInventoryStore } from '../frontend/src/stores/useInventoryStore';

const product = (id = 'P1') => ({ id, name: 'Coffee', categoryId: 'coffee', image: '', price: 30000, isAvailable: true });
const item = (quantity: number, id = 'P1') => ({ product: product(id), quantity, itemTotalPrice: 30000 * quantity });
const cart = () => useCartStore.getState();
beforeEach(() => cart().clearCart());

test('names accept Vietnamese Unicode letters and reject digits, symbols and blanks', () => {
  for (const name of ['Nguyễn Thị Ánh', 'Đỗ Văn An', 'Jose', 'Nguyễn Thị Ánh'.normalize('NFD')]) assert.equal(personNameError(name), '');
  for (const name of ['', '  ', 'A', 'An123', 'An@', '<script>', 'An🙂', 'An\nBình', 'A'.repeat(101)]) assert.ok(personNameError(name), name);
  assert.ok(inputError('/customers', { name: 'An123' }));
  assert.equal(inputError('/products', { name: 'Trà Ổi 500ml' }), '');
  assert.ok(new User({ name: 'An123' }).validateSync()?.errors.name);
  assert.ok(new Customer({ name: 'An@' }).validateSync()?.errors.name);
});

test('phone, email, PIN and bank account validation', () => {
  assert.equal(phoneError('0912345678'), '');
  for (const phone of ['abc', '09123', '091234567890', '-912345678', '1912345678', '09123a5678']) assert.ok(phoneError(phone));
  assert.equal(emailError('test@example.com'), '');
  for (const email of ['a', 'a@', '@test.com', 'a b@test.com']) assert.ok(emailError(email));
  assert.ok(inputError('/users', { pin: 'abc1' }));
  assert.ok(inputError('/settings', { bankAccountNo: '-12345' }));
  assert.ok(inputError('/users', { birthday: '2999-01-01' }));
});

test('quantity boundaries aggregate variants by product and enforce whole-order limit', () => {
  assert.equal(orderQuantityError([item(20)]), '');
  assert.equal(orderQuantityError([item(20), item(20, 'P2'), item(10, 'P3')]), '');
  for (const quantity of [0, -1, 0.5, 21, Infinity, NaN]) assert.ok(orderQuantityError([item(quantity)]));
  assert.ok(orderQuantityError([item(11), item(10)]));
  assert.ok(orderQuantityError([item(20), item(20, 'P2'), item(11, 'P3')]));
  assert.ok(orderQuantityError([]));
  assert.ok(orderQuantityError([{ quantity: 1 }]));
});

test('cart rejects added variants over 20 without mutating existing items', () => {
  cart().addItem(product(), 'S', '50%', 'Ít đá', [], 20);
  cart().addItem(product(), 'L', '50%', 'Ít đá', [], 1);
  assert.equal(cart().items.length, 1);
  assert.equal(cart().items[0].quantity, 20);
  assert.ok(cart().validationError);
  cart().updateQuantity(cart().items[0].cartItemId, 1);
  assert.equal(cart().items[0].quantity, 20);
  assert.equal(legacyCart, useCartStore);
});

test('cart rejects 51st unit and invalid edits preserve the original cart', () => {
  for (const [id, quantity] of [['P1', 20], ['P2', 20], ['P3', 10]] as const) cart().addItem(product(id), 'S', '50%', 'Ít đá', [], quantity);
  const previous = JSON.stringify(cart().items);
  cart().addItem(product('P4'), 'S', '50%', 'Ít đá', [], 1);
  assert.equal(JSON.stringify(cart().items), previous);
  cart().updateItem(cart().items[2].cartItemId, product('P3'), 'L', '50%', 'Ít đá', [], 11);
  assert.equal(JSON.stringify(cart().items), previous);
  cart().updateQuantity(cart().items[0].cartItemId, 0.5);
  assert.equal(JSON.stringify(cart().items), previous);
});

test('all declared monetary inputs reject negatives, non-numbers and infinity', () => {
  for (const key of ['salary', 'price', 'unitPrice', 'totalAmount', 'discountValue', 'minOrderValue', 'maxDiscount', 'totalSpent', 'subtotal', 'discount', 'total', 'itemTotalPrice', 'initialCash', 'actualCash', 'expectedCash', 'amount', 'discountAmount', 'cashReceived', 'receivedAmount', 'shippingFee']) {
    for (const value of [-1, '100', null, NaN, Infinity]) assert.ok(numericPayloadError({ [key]: value }), `${key}=${String(value)}`);
    assert.equal(numericPayloadError({ [key]: 0 }), undefined);
  }
  assert.equal(numericPayloadError({ variance: -200, quantity: 0.25 }), undefined);
  assert.ok(numericPayloadError({ points: 0.5 }));
  assert.ok(inputError('/coupons', { discountType: 'percent', discountValue: 101 }));
});

test('order model blocks invalid mixed item quantities and negative prices', () => {
  for (const items of [[item(21)], [{ ...item(1), product: { ...product(), price: -1 } }], [item(20), item(20, 'P2'), item(11, 'P3')]]) {
    assert.ok(new Order({ items }).validateSync()?.errors.items);
  }
  assert.equal(new Order({ items: [item(20), item(20, 'P2'), item(10, 'P3')] }).validateSync()?.errors.items, undefined);
});

test('local inventory rejects negative values and aggregate exports over stock', () => {
  const original = useInventoryStore.getState();
  try {
    useInventoryStore.setState({ items: [{ id: 'M1', name: 'Coffee', unit: 'kg', quantity: 5, unitPrice: 1000, minAlertThreshold: 1, lastUpdated: '' }], receipts: [] });
    useInventoryStore.getState().updateQuantity('M1', -1);
    assert.equal(useInventoryStore.getState().items[0].quantity, 5);
    const line = { materialId: 'M1', materialName: 'Coffee', unit: 'kg', quantity: 3, unitPrice: 1000, totalPrice: 3000 };
    assert.throws(() => useInventoryStore.getState().createReceipt({ type: 'EXPORT', reason: 'Test', creatorName: 'Test', items: [line, line], totalAmount: 6000 }), /tồn kho/);
    assert.equal(useInventoryStore.getState().receipts.length, 0);
    assert.equal(useInventoryStore.getState().items[0].quantity, 5);
  } finally { useInventoryStore.setState(original); }
});
