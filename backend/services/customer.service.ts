import Customer, { ICustomer } from '../models/customer.model';

export class CustomerService {
  async getAll(): Promise<ICustomer[]> {
    return await Customer.find().lean();
  }

  async getById(id: string): Promise<ICustomer | null> {
    return await Customer.findOne({ id }).lean();
  }

  async getByPhone(phone: string): Promise<ICustomer | null> {
    return await Customer.findOne({ phone }).lean();
  }

  async create(data: Partial<ICustomer>): Promise<ICustomer> {
    const customer = new Customer(data);
    return await customer.save();
  }

  async update(id: string, data: Partial<ICustomer>): Promise<ICustomer | null> {
    return await Customer.findOneAndUpdate({ id }, data, { new: true });
  }

  async delete(id: string): Promise<ICustomer | null> {
    return await Customer.findOneAndDelete({ id });
  }
}

export default new CustomerService();
