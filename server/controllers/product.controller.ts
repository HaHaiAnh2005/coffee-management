import { Request, Response } from 'express';
import productService from '../services/product.service';

export class ProductController {
  async getAll(req: Request, res: Response) {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const products = await productService.getAll(categoryId);
      return res.json({ success: true, data: products });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const product = await productService.getById(req.params.id);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({ success: true, data: product });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const product = await productService.create(req.body);
      return res.status(201).json({ success: true, data: product });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const product = await productService.update(req.params.id, req.body);
      return res.json({ success: true, data: product });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      await productService.delete(req.params.id);
      return res.json({ success: true, message: 'Product deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new ProductController();
