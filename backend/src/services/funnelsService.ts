import { getDatabase } from './database';
import { ConversionFunnel } from '../types';

export const funnelsService = {
  async getFunnels(page: number, limit: number, filters: any): Promise<{ funnels: ConversionFunnel[], total: number }> {
    const db = getDatabase();
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramCount = 0;
    
    if (filters.is_active !== undefined) {
      queryParams.push(filters.is_active);
      whereClause += ` AND is_active = $${++paramCount}`;
    }
    
    const countQuery = `SELECT COUNT(*) FROM conversion_funnels ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);
    
    queryParams.push(limit, offset);
    const dataQuery = `
      SELECT * FROM conversion_funnels 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    
    const result = await db.query(dataQuery, queryParams);
    
    return {
      funnels: result.rows,
      total
    };
  },

  async getFunnelById(id: number): Promise<ConversionFunnel | null> {
    const db = getDatabase();
    
    const query = 'SELECT * FROM conversion_funnels WHERE id = $1';
    const result = await db.query(query, [id]);
    
    return result.rows[0] || null;
  },

  async getFunnelAnalytics(id: number, startDate: string, endDate: string): Promise<any> {
    const db = getDatabase();
    
    const funnel = await this.getFunnelById(id);
    if (!funnel) return null;
    
    const steps = funnel.steps;
    const analytics = {
      funnel_id: id,
      funnel_name: funnel.name,
      period: { start: startDate, end: endDate },
      steps: [] as any[]
    };
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepQuery = `
        SELECT 
          COUNT(DISTINCT session_id) as unique_sessions,
          COUNT(*) as total_events
        FROM user_events 
        WHERE event_type = $1 
        AND created_at >= $2 
        AND created_at <= $3
      `;
      
      const stepResult = await db.query(stepQuery, [step.event_type, startDate, endDate]);
      const stepData = stepResult.rows[0];
      
      const conversionRate = i > 0 && analytics.steps[0] 
        ? (stepData.unique_sessions / analytics.steps[0].unique_sessions * 100).toFixed(2)
        : '100.00';
      
      analytics.steps.push({
        step_number: step.step,
        event_type: step.event_type,
        unique_sessions: parseInt(stepData.unique_sessions),
        total_events: parseInt(stepData.total_events),
        conversion_rate: parseFloat(conversionRate)
      });
    }
    
    return analytics;
  },

  async createFunnel(funnelData: Partial<ConversionFunnel>): Promise<ConversionFunnel> {
    const db = getDatabase();
    
    const query = `
      INSERT INTO conversion_funnels (name, description, steps, is_active)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    
    const values = [
      funnelData.name,
      funnelData.description,
      JSON.stringify(funnelData.steps),
      funnelData.is_active !== undefined ? funnelData.is_active : true
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updateFunnel(id: number, updateData: Partial<ConversionFunnel>): Promise<ConversionFunnel | null> {
    const db = getDatabase();
    
    const setClause = [];
    const values = [];
    let paramCount = 0;
    
    if (updateData.name !== undefined) {
      setClause.push(`name = $${++paramCount}`);
      values.push(updateData.name);
    }
    
    if (updateData.description !== undefined) {
      setClause.push(`description = $${++paramCount}`);
      values.push(updateData.description);
    }
    
    if (updateData.steps !== undefined) {
      setClause.push(`steps = $${++paramCount}`);
      values.push(JSON.stringify(updateData.steps));
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
      UPDATE conversion_funnels 
      SET ${setClause.join(', ')}
      WHERE id = $${++paramCount}
      RETURNING *
    `;
    
    const result = await db.query(query, values);
    return result.rows[0] || null;
  },

  async deleteFunnel(id: number): Promise<boolean> {
    const db = getDatabase();
    
    const query = 'DELETE FROM conversion_funnels WHERE id = $1';
    const result = await db.query(query, [id]);
    
    return (result.rowCount || 0) > 0;
  }
};