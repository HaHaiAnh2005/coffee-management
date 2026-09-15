import Category, { ICategory } from '../models/category.model';

export class CategoryService {
  async getAll(): Promise<ICategory[]> {
    return await Category.find().lean();
  }

  async getById(id: string): Promise<ICategory | null> {
    return await Category.findOne({ id }).lean();
  }

  async create(data: Partial<ICategory>): Promise<ICategory> {
    const category = new Category(data);
    return await category.save();
  }

  async update(id: string, data: Partial<ICategory>): Promise<ICategory | null> {
    return await Category.findOneAndUpdate({ id }, data, { new: true });
  }

  async delete(id: string): Promise<ICategory | null> {
    return await Category.findOneAndDelete({ id });
  }
}

export default new CategoryService();
