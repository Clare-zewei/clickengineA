import { getDatabase } from './database';
import { UserEvent } from '../types';

export const eventsService = {
  async createEvent(eventData: Partial<UserEvent>): Promise<UserEvent> {
    const db = getDatabase();
    
    const query = `
      INSERT INTO user_events (
        user_id, session_id, event_type, page_url, referrer_url,
        utm_source, utm_medium, utm_campaign, utm_term, utm_content,
        device_type, browser, ip_address, user_agent, duration_seconds, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `;
    
    const values = [
      eventData.user_id, eventData.session_id, eventData.event_type,
      eventData.page_url, eventData.referrer_url, eventData.utm_source,
      eventData.utm_medium, eventData.utm_campaign, eventData.utm_term,
      eventData.utm_content, eventData.device_type, eventData.browser,
      eventData.ip_address, eventData.user_agent, eventData.duration_seconds,
      eventData.metadata ? JSON.stringify(eventData.metadata) : null
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async getEvents(page: number, limit: number, filters: any): Promise<{ events: UserEvent[], total: number }> {
    const db = getDatabase();
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const queryParams: any[] = [];
    let paramCount = 0;
    
    if (filters.event_type) {
      queryParams.push(filters.event_type);
      whereClause += ` AND event_type = $${++paramCount}`;
    }
    
    if (filters.user_id) {
      queryParams.push(filters.user_id);
      whereClause += ` AND user_id = $${++paramCount}`;
    }
    
    if (filters.session_id) {
      queryParams.push(filters.session_id);
      whereClause += ` AND session_id = $${++paramCount}`;
    }
    
    if (filters.utm_source) {
      queryParams.push(filters.utm_source);
      whereClause += ` AND utm_source = $${++paramCount}`;
    }
    
    const countQuery = `SELECT COUNT(*) FROM user_events ${whereClause}`;
    const countResult = await db.query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);
    
    queryParams.push(limit, offset);
    const dataQuery = `
      SELECT * FROM user_events 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${++paramCount} OFFSET $${++paramCount}
    `;
    
    const result = await db.query(dataQuery, queryParams);
    
    return {
      events: result.rows,
      total
    };
  },

  async getEventById(id: number): Promise<UserEvent | null> {
    const db = getDatabase();
    
    const query = 'SELECT * FROM user_events WHERE id = $1';
    const result = await db.query(query, [id]);
    
    return result.rows[0] || null;
  },

  async getEventAnalytics(startDate: string, endDate: string, groupBy: string): Promise<any[]> {
    const db = getDatabase();
    
    let dateFormat = 'YYYY-MM-DD';
    if (groupBy === 'hour') {
      dateFormat = 'YYYY-MM-DD HH24:00:00';
    } else if (groupBy === 'month') {
      dateFormat = 'YYYY-MM';
    }
    
    const query = `
      SELECT 
        TO_CHAR(created_at, $1) as period,
        event_type,
        COUNT(*) as count,
        COUNT(DISTINCT session_id) as unique_sessions,
        COUNT(DISTINCT user_id) as unique_users
      FROM user_events
      WHERE created_at >= $2 AND created_at <= $3
      GROUP BY period, event_type
      ORDER BY period, event_type
    `;
    
    const result = await db.query(query, [dateFormat, startDate, endDate]);
    return result.rows;
  }
};