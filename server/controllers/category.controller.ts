import { Request, Response } from 'express';
import categoryService from '../services/category.service';

export class CategoryController {
  async getAll(req: Request, res: Response) {
    try {
      const categories = await categoryService.getAll();
      return res.json({ success: true, data: categories });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const category = await categoryService.getById(req.params.id);
      if (!category) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      return res.json({ success: true, data: category });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const category = await categoryService.create(req.body);
      return res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const category = await categoryService.update(req.params.id, req.body);
      return res.json({ success: true, data: category });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await categoryService.delete(req.params.id);
      return res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new CategoryController();
