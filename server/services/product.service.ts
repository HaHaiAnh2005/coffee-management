import Product, { IProduct } from '../models/product.model';

export class ProductService {
  async getAll(categoryId?: string): Promise<IProduct[]> {
    const filter = categoryId ? { categoryId } : {};
    return await Product.find(filter).lean();
  }

  async getById(id: string): Promise<IProduct | null> {
    return await Product.findOne({ id }).lean();
  }

  async create(data: Partial<IProduct>): Promise<IProduct> {
    const product = new Product(data);
    return await product.save();
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findOneAndUpdate({ id }, data, { new: true });
  }

  async delete(id: string): Promise<IProduct | null> {
    return await Product.findOneAndDelete({ id });
  }
}

export default new ProductService();
