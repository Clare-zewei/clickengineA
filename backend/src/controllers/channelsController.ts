import { Request, Response } from 'express';
import { channelsService } from '../services/channelsService';
import { createError } from '../middleware/errorHandler';

export const channelsController = {
  async getChannels(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20, is_active } = req.query;
    
    const filters = {
      is_active: is_active === 'true' ? true : is_active === 'false' ? false : undefined
    };
    
    const result = await channelsService.getChannels(
      parseInt(page as string), 
      parseInt(limit as string),
      filters
    );
    
    res.json({
      success: true,
      data: result.channels,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.total,
        totalPages: Math.ceil(result.total / parseInt(limit as string))
      }
    });
  },

  async getChannelById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const channel = await channelsService.getChannelById(parseInt(id));
    
    if (!channel) {
      throw createError(404, 'Channel not found');
    }
    
    res.json({
      success: true,
      data: channel
    });
  },

  async createChannel(req: Request, res: Response): Promise<void> {
    const channelData = req.body;
    
    const channel = await channelsService.createChannel(channelData);
    
    res.status(201).json({
      success: true,
      data: channel
    });
  },

  async updateChannel(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updateData = req.body;
    
    const channel = await channelsService.updateChannel(parseInt(id), updateData);
    
    if (!channel) {
      throw createError(404, 'Channel not found');
    }
    
    res.json({
      success: true,
      data: channel
    });
  },

  async deleteChannel(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const success = await channelsService.deleteChannel(parseInt(id));
    
    if (!success) {
      throw createError(404, 'Channel not found');
    }
    
    res.json({
      success: true,
      message: 'Channel deleted successfully'
    });
  }
};