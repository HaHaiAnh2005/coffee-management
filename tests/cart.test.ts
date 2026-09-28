import assert from 'node:assert/strict';
import { beforeEach, test } from 'node:test';
import { useCartStore } from '../frontend/src/store/cart.store';
import { calculateSubtotal, calculateTotal } from '../frontend/src/utils/calculateTotal';

const product = { id: 'TEST', name: 'Coffee', price: 30000, categoryId: 'coffee', image: '', isAvailable: true };
const cart = () => useCartStore.getState();
beforeEach(() => useCartStore.setState({ items: [], discount: 0, selectedTableId: null, selectedTableName: null, isTakeaway: false }));

test('cart prices size, topping, quantity and discount correctly', () => {
  cart().addItem(product, 'M', '50%', 'Ít đá', [{ groupId: 'g', groupName: 'Topping', optionId: 'o', optionName: 'Cream', price: 5000 }], 2, '', 10000);
  assert.equal(calculateSubtotal(cart().items), 72000);
  assert.equal(calculateTotal(cart().items, 2000), 70000);
  assert.equal(calculateTotal(cart().items, 100000), 0);
});

test('identical drinks merge and quantity updates recalculate price', () => {
  cart().addItem(product, 'S', '50%', 'Ít đá', []);
  cart().addItem(product, 'S', '50%', 'Ít đá', []);
  assert.equal(cart().items.length, 1);
  assert.equal(cart().items[0].quantity, 2);
  cart().updateQuantity(cart().items[0].cartItemId, -1);
  assert.equal(cart().items[0].itemTotalPrice, 30000);
  cart().updateQuantity(cart().items[0].cartItemId, -1);
  assert.equal(cart().items.length, 0);
});

test('takeaway clears selected table and clearCart resets discount', () => {
  cart().setSelectedTable('T1', 'Table 1');
  cart().setIsTakeaway(true);
  assert.equal(cart().selectedTableId, null);
  assert.equal(cart().selectedTableName, null);
  cart().setDiscount(5000);
  cart().clearCart();
  assert.equal(cart().discount, 0);
  assert.equal(calculateTotal(cart().items), 0);
});

test('different preparation notes must not be lost when adding identical drinks', () => {
  cart().addItem(product, 'S', '50%', 'Ít đá', [], 1, 'Serve first');
  cart().addItem(product, 'S', '50%', 'Ít đá', [], 1, 'Serve later');
  assert.deepEqual(cart().items.map(item => item.note).sort(), ['Serve first', 'Serve later']);
});

test('editing a drink to match another must not create duplicate cart identifiers', () => {
  cart().addItem(product, 'S', '50%', 'Ít đá', []);
  cart().addItem(product, 'L', '50%', 'Ít đá', []);
  cart().updateItem(cart().items[1].cartItemId, product, 'S', '50%', 'Ít đá', []);
  assert.equal(new Set(cart().items.map(item => item.cartItemId)).size, cart().items.length);
  assert.equal(cart().items.reduce((sum, item) => sum + item.quantity, 0), 2);
  assert.equal(calculateTotal(cart().items), 60000);
  cart().updateQuantity(cart().items[0].cartItemId, -1);
  assert.equal(calculateTotal(cart().items), 30000);
  cart().removeItem(cart().items[0].cartItemId);
  assert.equal(cart().items.length, 0);
});

test('editing to merge discounted drinks preserves combined discount', () => {
  cart().addItem(product, 'S', '50%', 'Ít đá', [], 1, '', 5000);
  cart().addItem(product, 'L', '50%', 'Ít đá', [], 1, '', 5000);
  cart().updateItem(cart().items[1].cartItemId, product, 'S', '50%', 'Ít đá', [], 1, '', 5000);
  assert.equal(cart().items.length, 1);
  assert.equal(cart().items[0].quantity, 2);
  assert.equal(cart().items[0].discountAmount, 10000);
  assert.equal(calculateTotal(cart().items), 50000);
});
