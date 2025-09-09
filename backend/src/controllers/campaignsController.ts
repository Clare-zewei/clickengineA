import { Request, Response } from 'express';
import { campaignsService } from '../services/campaignsService';
import { createError } from '../middleware/errorHandler';

export const campaignsController = {
  async getCampaigns(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 20, status, channel_id, primary_goal, search } = req.query;
    
    const filters = {
      status: status as string,
      channel_id: channel_id ? parseInt(channel_id as string) : undefined,
      primary_goal: primary_goal as string,
      search: search as string
    };
    
    const result = await campaignsService.getCampaigns(
      parseInt(page as string), 
      parseInt(limit as string),
      filters
    );
    
    res.json({
      success: true,
      data: result.campaigns,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.total,
        totalPages: Math.ceil(result.total / parseInt(limit as string))
      }
    });
  },

  async getCampaignById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const campaign = await campaignsService.getCampaignById(parseInt(id));
    
    if (!campaign) {
      throw createError(404, 'Campaign not found');
    }
    
    res.json({
      success: true,
      data: campaign
    });
  },

  async createCampaign(req: Request, res: Response): Promise<void> {
    const campaignData = req.body;
    
    // Validate campaign data
    const validationErrors = await campaignsService.validateCampaignData(campaignData);
    if (validationErrors.length > 0) {
      throw createError(400, `Validation failed: ${validationErrors.join(', ')}`);
    }
    
    const campaign = await campaignsService.createCampaign(campaignData);
    
    res.status(201).json({
      success: true,
      data: campaign
    });
  },

  async updateCampaign(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const updateData = req.body;
    
    // Validate campaign data
    const validationErrors = await campaignsService.validateCampaignData(updateData);
    if (validationErrors.length > 0) {
      throw createError(400, `Validation failed: ${validationErrors.join(', ')}`);
    }
    
    const campaign = await campaignsService.updateCampaign(parseInt(id), updateData);
    
    if (!campaign) {
      throw createError(404, 'Campaign not found');
    }
    
    res.json({
      success: true,
      data: campaign
    });
  },

  async deleteCampaign(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const success = await campaignsService.deleteCampaign(parseInt(id));
    
    if (!success) {
      throw createError(404, 'Campaign not found');
    }
    
    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  }
};