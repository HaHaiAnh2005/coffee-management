import Inventory, { IInventory } from '../models/inventory.model';
import InventoryReceipt, { IInventoryReceipt } from '../models/inventory-receipt.model';

export class InventoryService {
  async getAll(): Promise<IInventory[]> {
    return await Inventory.find().lean();
  }

  async getById(id: string): Promise<IInventory | null> {
    return await Inventory.findOne({ id }).lean();
  }

  async create(data: Partial<IInventory>): Promise<IInventory> {
    const item = new Inventory(data);
    return await item.save();
  }

  async update(id: string, data: Partial<IInventory>): Promise<IInventory | null> {
    return await Inventory.findOneAndUpdate({ id }, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<IInventory | null> {
    return await Inventory.findOneAndDelete({ id });
  }

  // --- Receipt Services (Phiếu Nhập / Xuất Kho) ---
  async getAllReceipts(): Promise<IInventoryReceipt[]> {
    return await InventoryReceipt.find().sort({ createdAt: -1 }).lean();
  }

  async getReceiptById(id: string): Promise<IInventoryReceipt | null> {
    return await InventoryReceipt.findOne({ $or: [{ id }, { code: id }] }).lean();
  }

  async createReceipt(data: Partial<IInventoryReceipt>): Promise<IInventoryReceipt> {
    const receipt = new InventoryReceipt(data);
    await receipt.validate();
    if (!data.items?.length) throw new Error('Phiếu kho phải có ít nhất một nguyên liệu');
    if (data.status === 'CANCELLED') throw new Error('Không thể ghi tồn kho cho phiếu đã hủy');

    // Validate every line, including repeated materials, before persisting anything.
    const changes = new Map<string, { material: IInventory; quantity: number; unitPrice: number }>();
    for (const item of data.items) {
      let change = changes.get(item.materialId);
      if (!change) {
        const material = await Inventory.findOne({ id: item.materialId });
        if (!material) throw new Error(`Nguyên liệu không tồn tại: ${item.materialId}`);
        change = { material, quantity: material.quantity, unitPrice: material.unitPrice };
        changes.set(item.materialId, change);
      }
      if (data.type === 'EXPORT') {
        if (change.quantity < item.quantity) throw new Error(`Không đủ tồn kho: ${item.materialName}`);
        change.quantity -= item.quantity;
      } else {
        change.quantity += item.quantity;
        if (item.unitPrice > 0) change.unitPrice = item.unitPrice;
      }
      if (!Number.isFinite(change.quantity)) throw new Error('Số lượng tồn kho không hợp lệ');
    }
    await receipt.save();

    // Tự động cập nhật số lượng tồn kho của từng nguyên liệu
    for (const { material, quantity, unitPrice } of changes.values()) {
      material.quantity = quantity;
      material.unitPrice = unitPrice;
      material.lastUpdated = new Date().toISOString();
      await material.save();
    }

    return receipt;
  }
}

export default new InventoryService();
