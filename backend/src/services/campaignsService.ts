import { getDatabase } from './database';
import { Campaign, CampaignSummary, CampaignGoal } from '../types';

export const campaignsService = {
  async getCampaigns(page: number, limit: number, filters: any): Promise<{ campaigns: CampaignSummary[], total: number }> {
    const db = getDatabase();
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramCount = 0;
    
    if (filters.status) {
      queryParams.push(filters.status);
      whereClause += ` AND c.status = $${++paramCount}`;
    }
    
    if (filters.channel_id) {
      queryParams.push(filters.channel_id);
      whereClause += ` AND c.channel_id = $${++paramCount}`;
    }
    
    if (filters.primary_goal) {
      queryParams.push(filters.primary_goal);
      whereClause += ` AND c.primary_goal = $${++paramCount}`;
    }
    
    if (filters.search) {
      queryParams.push(`%${filters.search}%`);
      whereClause += ` AND (c.name ILIKE $${++paramCount} OR mc.name ILIKE $${paramCount})`;
    }
    
    const countQuery = `
      SELECT COUNT(*) FROM campaigns c 
      LEFT JOIN marketing_channels mc ON c.channel_id = mc.id
      ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);
    
    queryParams.push(limit, offset);
    const dataQuery = `
      SELECT 
        c.*,
        mc.name as channel_name,
        COALESCE(c.actual_ad_spend, 0) + COALESCE(c.external_costs, 0) as total_spend,
        CASE 
          WHEN c.budget > 0 THEN 
            ROUND(((COALESCE(c.actual_ad_spend, 0) + COALESCE(c.external_costs, 0)) / c.budget * 100), 2)
          ELSE 0 
        END as budget_utilization,
        CASE 
          WHEN c.end_date IS NOT NULL THEN c.end_date - CURRENT_DATE
          ELSE NULL 
        END as days_remaining,
        (c.status = 'active' AND (c.end_date IS NULL OR c.end_date >= CURRENT_DATE)) as is_active
      FROM campaigns c
      LEFT JOIN marketing_channels mc ON c.channel_id = mc.id
      ${whereClause}
      ORDER BY c.created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    
    const result = await db.query(dataQuery, queryParams);
    
    return {
      campaigns: result.rows,
      total
    };
  },

  async getCampaignById(id: number): Promise<CampaignSummary | null> {
    const db = getDatabase();
    
    const query = `
      SELECT 
        c.*,
        mc.name as channel_name,
        COALESCE(c.actual_ad_spend, 0) + COALESCE(c.external_costs, 0) as total_spend,
        CASE 
          WHEN c.budget > 0 THEN 
            ROUND(((COALESCE(c.actual_ad_spend, 0) + COALESCE(c.external_costs, 0)) / c.budget * 100), 2)
          ELSE 0 
        END as budget_utilization,
        CASE 
          WHEN c.end_date IS NOT NULL THEN c.end_date - CURRENT_DATE
          ELSE NULL 
        END as days_remaining,
        (c.status = 'active' AND (c.end_date IS NULL OR c.end_date >= CURRENT_DATE)) as is_active
      FROM campaigns c
      LEFT JOIN marketing_channels mc ON c.channel_id = mc.id
      WHERE c.id = $1
    `;
    const result = await db.query(query, [id]);
    
    return result.rows[0] || null;
  },

  async createCampaign(campaignData: Partial<Campaign>): Promise<Campaign> {
    const db = getDatabase();
    
    // Check for duplicate campaign name
    const duplicateCheck = await db.query(
      'SELECT id FROM campaigns WHERE name = $1 AND channel_id = $2',
      [campaignData.name, campaignData.channel_id]
    );
    
    if (duplicateCheck.rows.length > 0) {
      throw new Error('Campaign with this name already exists for the selected channel');
    }
    
    const query = `
      INSERT INTO campaigns (
        name, channel_id, utm_source, utm_medium, utm_campaign, 
        utm_term, utm_content, budget, actual_ad_spend, external_costs,
        has_human_input, campaign_count, primary_goal, start_date, end_date, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;
    
    const values = [
      campaignData.name,
      campaignData.channel_id,
      campaignData.utm_source,
      campaignData.utm_medium,
      campaignData.utm_campaign,
      campaignData.utm_term,
      campaignData.utm_content,
      campaignData.budget,
      campaignData.actual_ad_spend || 0,
      campaignData.external_costs || 0,
      campaignData.has_human_input || false,
      campaignData.campaign_count || 1,
      campaignData.primary_goal || 'awareness',
      campaignData.start_date,
      campaignData.end_date,
      campaignData.status || 'active'
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updateCampaign(id: number, updateData: Partial<Campaign>): Promise<Campaign | null> {
    const db = getDatabase();
    
    // Check for duplicate campaign name if name is being updated
    if (updateData.name) {
      const duplicateCheck = await db.query(
        'SELECT id FROM campaigns WHERE name = $1 AND channel_id = $2 AND id != $3',
        [updateData.name, updateData.channel_id, id]
      );
      
      if (duplicateCheck.rows.length > 0) {
        throw new Error('Campaign with this name already exists for the selected channel');
      }
    }
    
    const setClause: string[] = [];
    const values: any[] = [];
    let paramCount = 0;
    
    const fields = [
      'name', 'channel_id', 'utm_source', 'utm_medium', 'utm_campaign',
      'utm_term', 'utm_content', 'budget', 'actual_ad_spend', 'external_costs',
      'has_human_input', 'campaign_count', 'primary_goal', 'start_date', 'end_date', 'status'
    ];
    
    fields.forEach(field => {
      if (updateData[field as keyof Campaign] !== undefined) {
        setClause.push(`${field} = $${++paramCount}`);
        values.push(updateData[field as keyof Campaign]);
      }
    });
    
    if (setClause.length === 0) {
      return null;
    }
    
    values.push(id);
    const query = `
      UPDATE campaigns 
      SET ${setClause.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  },

  async deleteCampaign(id: number): Promise<boolean> {
    const db = getDatabase();
    
    const query = 'DELETE FROM campaigns WHERE id = $1';
    const result = await db.query(query, [id]);
    
    return (result.rowCount || 0) > 0;
  },

  async getCampaignGoals(): Promise<CampaignGoal[]> {
    const db = getDatabase();
    
    const query = 'SELECT * FROM campaign_goals WHERE is_active = true ORDER BY name';
    const result = await db.query(query);
    
    return result.rows;
  },

  async validateCampaignData(campaignData: Partial<Campaign>): Promise<string[]> {
    const errors: string[] = [];
    
    // Required field validation
    if (!campaignData.name || campaignData.name.trim().length === 0) {
      errors.push('Campaign name is required');
    }
    
    if (!campaignData.channel_id) {
      errors.push('Marketing channel is required');
    }
    
    // Budget validation
    if (campaignData.budget !== undefined && campaignData.budget < 0) {
      errors.push('Budget must be a positive number');
    }
    
    if (campaignData.actual_ad_spend !== undefined && campaignData.actual_ad_spend < 0) {
      errors.push('Actual ad spend must be a positive number');
    }
    
    if (campaignData.external_costs !== undefined && campaignData.external_costs < 0) {
      errors.push('External costs must be a positive number');
    }
    
    // Date validation
    if (campaignData.start_date && campaignData.end_date) {
      const startDate = new Date(campaignData.start_date);
      const endDate = new Date(campaignData.end_date);
      
      if (startDate > endDate) {
        errors.push('Start date must be before end date');
      }
    }
    
    // Campaign count validation
    if (campaignData.campaign_count !== undefined && campaignData.campaign_count < 1) {
      errors.push('Campaign count must be at least 1');
    }
    
    // Spending reasonableness check
    if (campaignData.budget && campaignData.actual_ad_spend && campaignData.external_costs) {
      const totalSpend = campaignData.actual_ad_spend + campaignData.external_costs;
      if (totalSpend > campaignData.budget * 1.2) {
        errors.push('Total spending exceeds budget by more than 20% - please review');
      }
    }
    
    return errors;
  }
};