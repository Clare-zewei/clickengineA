import { Request, Response } from 'express';
import { getDatabase } from '../services/database';
import { 
  AddKeywordRequest, 
  AddKeywordResponse,
  GetRecentKeywordsResponse,
  GetStepKeywordsResponse,
  RecentKeyword
} from '../types/funnel.types';

export class KeywordsController {
  // Get recently used keywords
  async getRecentKeywords(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 15;
      
      const query = `
        WITH keyword_stats AS (
          SELECT 
            k.keyword,
            COUNT(DISTINCT k.funnel_step_id) as usage_count,
            MAX(k.created_at) as last_used
          FROM step_keywords k
          GROUP BY k.keyword
        )
        SELECT 
          keyword,
          usage_count,
          last_used
        FROM keyword_stats
        ORDER BY last_used DESC, usage_count DESC
        LIMIT $1
      `;
      
      const pool = getDatabase();
      const result = await pool.query(query, [limit]);
      
      const response: GetRecentKeywordsResponse = {
        keywords: result.rows.map(row => ({
          keyword: row.keyword,
          usage_count: parseInt(row.usage_count),
          last_used: row.last_used
        }))
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching recent keywords:', error);
      res.status(500).json({ error: 'Failed to fetch recent keywords' });
    }
  }
  
  // Get all keywords for a specific funnel step
  async getStepKeywords(req: Request, res: Response) {
    try {
      const { stepId } = req.params;
      
      const query = `
        SELECT 
          keyword,
          created_at as added_at
        FROM step_keywords
        WHERE funnel_step_id = $1
        ORDER BY created_at DESC
      `;
      
      const pool = getDatabase();
      const result = await pool.query(query, [stepId]);
      
      const response: GetStepKeywordsResponse = {
        keywords: result.rows.map(row => ({
          keyword: row.keyword,
          added_at: row.added_at
        }))
      };
      
      res.json(response);
    } catch (error) {
      console.error('Error fetching step keywords:', error);
      res.status(500).json({ error: 'Failed to fetch step keywords' });
    }
  }
  
  // Add a keyword to a funnel step
  async addKeyword(req: Request, res: Response) {
    try {
      const { stepId } = req.params;
      const { keyword }: AddKeywordRequest = req.body;
      
      // Validate keyword
      if (!keyword || keyword.length < 2 || keyword.length > 100) {
        return res.status(400).json({ 
          error: 'Keyword must be between 2 and 100 characters' 
        });
      }
      
      // Clean and normalize keyword
      const cleanKeyword = keyword.trim().toLowerCase();
      
      // Start transaction
      const pool = getDatabase();
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        
        // Insert keyword (ignore if duplicate)
        const insertQuery = `
          INSERT INTO step_keywords (funnel_step_id, keyword)
          VALUES ($1, $2)
          ON CONFLICT (funnel_step_id, keyword) DO NOTHING
          RETURNING id
        `;
        
        const insertResult = await client.query(insertQuery, [stepId, cleanKeyword]);
        
        if (insertResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(409).json({ error: 'Keyword already exists for this step' });
        }
        
        // Log the action
        const logQuery = `
          INSERT INTO keywords_usage_log (funnel_step_id, keyword, action, user_id)
          VALUES ($1, $2, 'added', $3)
        `;
        
        await client.query(logQuery, [
          stepId, 
          cleanKeyword, 
          req.headers['user-id'] || 'system'
        ]);
        
        // Get total keywords count
        const countQuery = `
          SELECT COUNT(*) as total 
          FROM step_keywords 
          WHERE funnel_step_id = $1
        `;
        
        const countResult = await client.query(countQuery, [stepId]);
        
        await client.query('COMMIT');
        
        const response: AddKeywordResponse = {
          success: true,
          keyword: cleanKeyword,
          total_keywords: parseInt(countResult.rows[0].total)
        };
        
        res.json(response);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error adding keyword:', error);
      res.status(500).json({ error: 'Failed to add keyword' });
    }
  }
  
  // Remove a keyword from a funnel step
  async removeKeyword(req: Request, res: Response) {
    try {
      const { stepId, keyword } = req.params;
      
      // Clean keyword
      const cleanKeyword = decodeURIComponent(keyword).trim().toLowerCase();
      
      // Start transaction
      const pool = getDatabase();
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        
        // Delete keyword
        const deleteQuery = `
          DELETE FROM step_keywords
          WHERE funnel_step_id = $1 AND keyword = $2
          RETURNING id
        `;
        
        const deleteResult = await client.query(deleteQuery, [stepId, cleanKeyword]);
        
        if (deleteResult.rows.length === 0) {
          await client.query('ROLLBACK');
          return res.status(404).json({ error: 'Keyword not found' });
        }
        
        // Log the action
        const logQuery = `
          INSERT INTO keywords_usage_log (funnel_step_id, keyword, action, user_id)
          VALUES ($1, $2, 'removed', $3)
        `;
        
        await client.query(logQuery, [
          stepId, 
          cleanKeyword, 
          req.headers['user-id'] || 'system'
        ]);
        
        await client.query('COMMIT');
        
        res.json({ success: true, message: 'Keyword removed successfully' });
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Error removing keyword:', error);
      res.status(500).json({ error: 'Failed to remove keyword' });
    }
  }
  
  // Get keyword suggestions based on step type
  async getKeywordSuggestions(req: Request, res: Response) {
    try {
      const { step_type, q } = req.query;
      const query_text = (q as string || '').toLowerCase();
      
      // Define suggestions based on step type
      const suggestions: { [key: string]: string[] } = {
        ad_click: [
          'project management software',
          'team collaboration tools',
          'enterprise solutions',
          'task management',
          'workflow automation',
          'business productivity',
          'saas platform',
          'cloud software'
        ],
        content_view: [
          'best practices',
          'how to guide',
          'case study',
          'industry trends',
          'product comparison',
          'tutorial',
          'whitepaper',
          'research report'
        ],
        resource_download: [
          'free template',
          'ebook download',
          'checklist',
          'guide pdf',
          'toolkit',
          'framework',
          'worksheet',
          'resource pack'
        ],
        page_view: [
          'landing page',
          'product features',
          'pricing plans',
          'customer testimonials',
          'about us',
          'contact form',
          'demo request',
          'free trial'
        ]
      };
      
      let relevantSuggestions = suggestions[step_type as string] || [];
      
      // Filter by query if provided
      if (query_text) {
        relevantSuggestions = relevantSuggestions.filter(s => 
          s.includes(query_text)
        );
      }
      
      // Also get popular keywords from database
      const dbQuery = `
        SELECT DISTINCT keyword
        FROM step_keywords k
        JOIN funnel_steps fs ON k.funnel_step_id = fs.id
        WHERE ($1::text IS NULL OR fs.step_type = $1)
          AND ($2::text IS NULL OR k.keyword LIKE '%' || $2 || '%')
        ORDER BY keyword
        LIMIT 10
      `;
      
      const pool = getDatabase();
      const dbResult = await pool.query(dbQuery, [step_type || null, query_text || null]);
      const dbKeywords = dbResult.rows.map(r => r.keyword);
      
      // Combine and deduplicate
      const allSuggestions = [...new Set([...relevantSuggestions, ...dbKeywords])];
      
      res.json({ suggestions: allSuggestions.slice(0, 15) });
    } catch (error) {
      console.error('Error getting keyword suggestions:', error);
      res.status(500).json({ error: 'Failed to get keyword suggestions' });
    }
  }
  
  // Get keyword performance analytics
  async getKeywordPerformance(req: Request, res: Response) {
    try {
      const { keyword, start_date, end_date } = req.query;
      
      const query = `
        WITH keyword_performance AS (
          SELECT 
            sk.keyword,
            fs.utm_source as channel,
            fs.utm_campaign as campaign,
            COUNT(DISTINCT fs.id) as step_count,
            AVG(fs.daily_budget) as avg_daily_budget,
            SUM(fs.daily_budget * 30) as estimated_monthly_spend
          FROM step_keywords sk
          JOIN funnel_steps fs ON sk.funnel_step_id = fs.id
          WHERE ($1::text IS NULL OR sk.keyword = $1)
            AND fs.created_at >= COALESCE($2::timestamp, NOW() - INTERVAL '30 days')
            AND fs.created_at <= COALESCE($3::timestamp, NOW())
          GROUP BY sk.keyword, fs.utm_source, fs.utm_campaign
        )
        SELECT 
          keyword,
          channel,
          campaign,
          step_count,
          ROUND(avg_daily_budget::numeric, 2) as avg_daily_budget,
          ROUND(estimated_monthly_spend::numeric, 2) as estimated_monthly_spend
        FROM keyword_performance
        ORDER BY estimated_monthly_spend DESC NULLS LAST
        LIMIT 50
      `;
      
      const pool = getDatabase();
      const result = await pool.query(query, [
        keyword || null,
        start_date || null,
        end_date || null
      ]);
      
      res.json({ performance: result.rows });
    } catch (error) {
      console.error('Error getting keyword performance:', error);
      res.status(500).json({ error: 'Failed to get keyword performance' });
    }
  }
}