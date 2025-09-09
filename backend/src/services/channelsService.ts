import { getDatabase } from './database';
import { MarketingChannel } from '../types';

export const channelsService = {
  async getChannels(page: number, limit: number, filters: any): Promise<{ channels: any[], total: number }> {
    const db = getDatabase();
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramCount = 0;
    
    if (filters.is_active !== undefined) {
      queryParams.push(filters.is_active);
      whereClause += ` AND is_active = $${++paramCount}`;
    }
    
    if (filters.include_analytics) {
      // Use the channel_analytics view for enhanced data
      const countQuery = `SELECT COUNT(*) FROM channel_analytics ${whereClause}`;
      const countResult = await db.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].count);
      
      queryParams.push(limit, offset);
      const dataQuery = `
        SELECT 
          id, channel_name as name, type, platform, channel_category, custom_type,
          description, cost_per_click, is_active, total_campaigns, active_campaigns,
          total_budget, total_investment, budget_utilization_percent,
          avg_campaign_budget, channel_created_at as created_at, channel_updated_at as updated_at,
          get_channel_type_display(channel_category, custom_type) as type_display
        FROM channel_analytics 
        ${whereClause}
        ORDER BY channel_updated_at DESC
        LIMIT $${++paramCount} OFFSET $${++paramCount}
      `;
      
      const result = await db.query(dataQuery, queryParams);
      
      return {
        channels: result.rows,
        total
      };
    } else {
      // Regular channels query
      const countQuery = `SELECT COUNT(*) FROM marketing_channels ${whereClause}`;
      const countResult = await db.query(countQuery, queryParams);
      const total = parseInt(countResult.rows[0].count);
      
      queryParams.push(limit, offset);
      const dataQuery = `
        SELECT *, get_channel_type_display(channel_category, custom_type) as type_display
        FROM marketing_channels 
        ${whereClause}
        ORDER BY created_at DESC
        LIMIT $${++paramCount} OFFSET $${++paramCount}
      `;
      
      const result = await db.query(dataQuery, queryParams);
      
      return {
        channels: result.rows,
        total
      };
    }
  },

  async getChannelById(id: number): Promise<MarketingChannel | null> {
    const db = getDatabase();
    
    const query = 'SELECT * FROM marketing_channels WHERE id = $1';
    const result = await db.query(query, [id]);
    
    return result.rows[0] || null;
  },

  async createChannel(channelData: any): Promise<any> {
    const db = getDatabase();
    
    const query = `
      INSERT INTO marketing_channels (
        name, type, platform, channel_category, custom_type, 
        description, cost_per_click, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *, get_channel_type_display(channel_category, custom_type) as type_display
    `;
    
    const values = [
      channelData.name,
      channelData.type || channelData.custom_type || channelData.channel_category || 'custom',
      channelData.platform,
      channelData.channel_category || 'custom',
      channelData.custom_type,
      channelData.description,
      channelData.cost_per_click,
      channelData.is_active !== undefined ? channelData.is_active : true
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updateChannel(id: number, updateData: any): Promise<any | null> {
    const db = getDatabase();
    
    const setClause = [];
    const values = [];
    let paramCount = 0;
    
    if (updateData.name !== undefined) {
      setClause.push(`name = $${++paramCount}`);
      values.push(updateData.name);
    }
    
    if (updateData.type !== undefined) {
      setClause.push(`type = $${++paramCount}`);
      values.push(updateData.type);
    }
    
    if (updateData.platform !== undefined) {
      setClause.push(`platform = $${++paramCount}`);
      values.push(updateData.platform);
    }
    
    if (updateData.channel_category !== undefined) {
      setClause.push(`channel_category = $${++paramCount}`);
      values.push(updateData.channel_category);
    }
    
    if (updateData.custom_type !== undefined) {
      setClause.push(`custom_type = $${++paramCount}`);
      values.push(updateData.custom_type);
    }
    
    if (updateData.description !== undefined) {
      setClause.push(`description = $${++paramCount}`);
      values.push(updateData.description);
    }
    
    if (updateData.cost_per_click !== undefined) {
      setClause.push(`cost_per_click = $${++paramCount}`);
      values.push(updateData.cost_per_click);
    }
    
    if (updateData.is_active !== undefined) {
      setClause.push(`is_active = $${++paramCount}`);
      values.push(updateData.is_active);
    }
    
    if (setClause.length === 0) {
      return null;
    }
    
    values.push(id);
    const query = `
      UPDATE marketing_channels 
      SET ${setClause.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING *, get_channel_type_display(channel_category, custom_type) as type_display
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  },

  async deleteChannel(id: number): Promise<boolean> {
    const db = getDatabase();
    
    const query = 'DELETE FROM marketing_channels WHERE id = $1';
    const result = await db.query(query, [id]);
    
    return (result.rowCount || 0) > 0;
  }
};