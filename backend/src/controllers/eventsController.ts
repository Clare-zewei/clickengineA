import { Request, Response } from 'express';
import { eventsService } from '../services/eventsService';
import { createError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth';

export const eventsController = {
  async createEvent(req: AuthRequest, res: Response): Promise<void> {
    const eventData = {
      ...req.body,
      user_id: req.user?.id || req.body.user_id,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    };
    
    const event = await eventsService.createEvent(eventData);
    
    res.status(201).json({
      success: true,
      data: event
    });
  },

  async getEvents(req: Request, res: Response): Promise<void> {
    const { page = 1, limit = 50, event_type, user_id, session_id, utm_source } = req.query;
    
    const filters = {
      event_type: event_type as string,
      user_id: user_id as string,
      session_id: session_id as string,
      utm_source: utm_source as string
    };
    
    const result = await eventsService.getEvents(
      parseInt(page as string), 
      parseInt(limit as string),
      filters
    );
    
    res.json({
      success: true,
      data: result.events,
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        total: result.total,
        totalPages: Math.ceil(result.total / parseInt(limit as string))
      }
    });
  },

  async getEventById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    
    const event = await eventsService.getEventById(parseInt(id));
    
    if (!event) {
      throw createError(404, 'Event not found');
    }
    
    res.json({
      success: true,
      data: event
    });
  },

  async getEventAnalytics(req: Request, res: Response): Promise<void> {
    const { start_date, end_date, group_by = 'day' } = req.query;
    
    const analytics = await eventsService.getEventAnalytics(
      start_date as string,
      end_date as string,
      group_by as string
    );
    
    res.json({
      success: true,
      data: analytics
    });
  }
};