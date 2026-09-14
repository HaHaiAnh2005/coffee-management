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
    return await Inventory.findOneAndUpdate({ id }, data, { new: true });
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
    await receipt.save();

    // Tự động cập nhật số lượng tồn kho của từng nguyên liệu
    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        const material = await Inventory.findOne({ id: item.materialId });
        if (material) {
          if (data.type === 'IMPORT') {
            material.quantity = (material.quantity || 0) + item.quantity;
            if (item.unitPrice > 0) {
              material.unitPrice = item.unitPrice;
            }
          } else if (data.type === 'EXPORT') {
            material.quantity = Math.max(0, (material.quantity || 0) - item.quantity);
          }
          material.lastUpdated = new Date().toISOString();
          await material.save();
        }
      }
    }

    return receipt;
  }
}

export default new InventoryService();
