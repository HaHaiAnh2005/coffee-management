import Table, { ITable } from '../models/table.model';
import Area, { IArea } from '../models/area.model';

export class TableService {
  async getAllTables(): Promise<ITable[]> {
    return await Table.find().lean();
  }

  async getAllAreas(): Promise<IArea[]> {
    return await Area.find().lean();
  }

  async getTableById(id: string): Promise<ITable | null> {
    return await Table.findOne({ id }).lean();
  }

  async createTable(data: Partial<ITable>): Promise<ITable> {
    const table = new Table(data);
    return await table.save();
  }

  async updateTable(id: string, data: Partial<ITable>): Promise<ITable | null> {
    return await Table.findOneAndUpdate({ id }, data, { new: true });
  }

  async updateStatus(id: string, status: string, currentOrderId: string | null = null): Promise<ITable | null> {
    const updateData: any = { status };
    if (status === 'occupied') {
      updateData.currentOrderId = currentOrderId;
      updateData.occupiedAt = new Date().toISOString();
    } else if (status === 'available') {
      updateData.currentOrderId = null;
      updateData.occupiedAt = null;
    }
    return await Table.findOneAndUpdate({ id }, updateData, { new: true });
  }

  async deleteTable(id: string): Promise<ITable | null> {
    return await Table.findOneAndDelete({ id });
  }
}

export default new TableService();
