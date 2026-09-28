import assert from 'node:assert/strict';
import test from 'node:test';
import Inventory from '../backend/models/inventory.model';
import InventoryReceipt from '../backend/models/inventory-receipt.model';
import inventoryService from '../backend/services/inventory.service';

for (const scenario of ['import', 'export', 'insufficient', 'missing'] as const) {
  test(`inventory receipt: ${scenario}`, async (t) => {
    let receiptWrites = 0;
    let stockWrites = 0;
    const material = { quantity: 5, unitPrice: 1000, lastUpdated: '', async save() { stockWrites++; return this; } };
    t.mock.method(InventoryReceipt.prototype, 'save', async function () { receiptWrites++; return this; });
    t.mock.method(Inventory, 'findOne', async () => scenario === 'missing' ? null : material);
    const quantity = scenario === 'insufficient' ? 6 : 2;
    const data = { id: 'TEST', code: 'TEST', type: scenario === 'import' ? 'IMPORT' as const : 'EXPORT' as const, reason: 'Test', creatorName: 'Test', createdAt: new Date().toISOString(), totalAmount: quantity * 2000,
      items: [{ materialId: 'M1', materialName: 'Coffee', unit: 'kg', quantity, unitPrice: 2000, totalPrice: quantity * 2000 }] };
    if (scenario === 'insufficient' || scenario === 'missing') {
      await assert.rejects(inventoryService.createReceipt(data), 'Invalid exports must be rejected');
      assert.equal(receiptWrites, 0);
      assert.equal(stockWrites, 0);
    } else {
      await inventoryService.createReceipt(data);
      assert.equal(material.quantity, scenario === 'import' ? 7 : 3);
      assert.equal(material.unitPrice, scenario === 'import' ? 2000 : 1000);
      assert.equal(receiptWrites, 1);
      assert.equal(stockWrites, 1);
    }
  });
}

for (const scenario of ['repeated-material', 'invalid-later-line', 'empty'] as const) {
  test(`invalid receipt writes nothing: ${scenario}`, async (t) => {
    let writes = 0;
    const material = { quantity: 5, unitPrice: 1000, async save() { writes++; } };
    t.mock.method(InventoryReceipt.prototype, 'save', async function () { writes++; return this; });
    t.mock.method(Inventory, 'findOne', async (filter: { id: string }) => filter.id === 'M1' ? material : null);
    const line = { materialId: 'M1', materialName: 'Coffee', unit: 'kg', quantity: 3, unitPrice: 1000, totalPrice: 3000 };
    const items = scenario === 'empty' ? [] : [line, { ...line, materialId: scenario === 'repeated-material' ? 'M1' : 'missing' }];
    await assert.rejects(inventoryService.createReceipt({ id: 'TEST', code: 'TEST', type: 'EXPORT', reason: 'Test', creatorName: 'Test', createdAt: new Date().toISOString(), items, totalAmount: 6000 }));
    assert.equal(writes, 0);
    assert.equal(material.quantity, 5);
  });
}
