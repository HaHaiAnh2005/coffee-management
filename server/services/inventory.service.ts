import Inventory, { IInventory } from '../models/inventory.model';

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
}

export default new InventoryService();
