import User, { IUser } from '../models/user.model';

export class UserService {
  async getAll(): Promise<IUser[]> {
    return await User.find().lean();
  }

  async getById(id: string): Promise<IUser | null> {
    return await User.findOne({ id }).lean();
  }

  async create(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data);
    return await user.save();
  }

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await User.findOneAndUpdate({ id }, data, { new: true });
  }

  async delete(id: string): Promise<IUser | null> {
    return await User.findOneAndDelete({ id });
  }
}

export default new UserService();
