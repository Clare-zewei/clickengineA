import { Request, Response } from 'express';
import { funnelsService } from '../services/funnelsService';
import { createError } from '../middleware/errorHandler';

export const funnelsController = {
  async getFunnels(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20, is_active } = req.query;
    
    const filters = {
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined
    };
    
    const result = await funnelsService.getFunnels(
      parseInt(page as string), 
      parseInt(limit as string),
      filters
    );
    
    res.json({
      success: true,
      data: result.funnels,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.total,
        totalPages: Math.ceil(result.total / parseInt(limit as string))
      }
    });
  },

  async getFunnelById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const funnel = await funnelsService.getFunnelById(parseInt(id));
    
    if (!funnel) {
      throw createError(404, 'Funnel not found');
    }
    
    res.json({
      success: true,
      data: funnel
    });
  },

  async getFunnelAnalytics(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { start_date, end_date } = req.query;
    
    const analytics = await funnelsService.getFunnelAnalytics(
      parseInt(id),
      start_date as string,
      end_date as string
    );
    
    if (!analytics) {
      throw createError(404, 'Funnel not found');
    }
    
    res.json({
      success: true,
      data: analytics
    });
  },

  async createFunnel(req: Request, res: Response): Promise<void> {
    const funnelData = req.body;
    
    const funnel = await funnelsService.createFunnel(funnelData);
    
    res.status(201).json({
      success: true,
      data: funnel
    });
  },

  async updateFunnel(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updateData = req.body;
    
    const funnel = await funnelsService.updateFunnel(parseInt(id), updateData);
    
    if (!funnel) {
      throw createError(404, 'Funnel not found');
    }
    
    res.json({
      success: true,
      data: funnel
    });
  },

  async deleteFunnel(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const success = await funnelsService.deleteFunnel(parseInt(id));
    
    if (!success) {
      throw createError(404, 'Funnel not found');
    }
    
    res.json({
      success: true,
      message: 'Funnel deleted successfully'
    });
  }
};