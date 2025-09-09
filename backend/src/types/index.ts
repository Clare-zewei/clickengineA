export interface MarketingChannel {
  id: number;
  name: string;
  type: string;
  description?: string;
  cost_per_click?: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Campaign {
  id: number;
  name: string;
  channel_id: number;
  channel_name?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  budget?: number;
  actual_ad_spend?: number;
  external_costs?: number;
  has_human_input?: boolean;
  campaign_count?: number;
  primary_goal?: string;
  start_date?: Date;
  end_date?: Date;
  status: 'active' | 'paused' | 'completed';
  created_at: Date;
  updated_at: Date;
}

export interface CampaignGoal {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: Date;
}

export interface CampaignMetrics {
  id: number;
  campaign_id: number;
  metric_date: Date;
  impressions?: number;
  clicks?: number;
  click_through_rate?: number;
  cost_per_click?: number;
  conversions?: number;
  conversion_rate?: number;
  cost_per_conversion?: number;
  return_on_ad_spend?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CampaignSummary extends Campaign {
  budget_utilization?: number;
  total_spend?: number;
  days_remaining?: number;
  is_active?: boolean;
}

export interface UserEvent {
  id: number;
  user_id?: string;
  session_id: string;
  event_type: string;
  page_url?: string;
  referrer_url?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  device_type?: string;
  browser?: string;
  ip_address?: string;
  user_agent?: string;
  duration_seconds?: number;
  metadata?: Record<string, any>;
  created_at: Date;
}

export interface ConversionFunnel {
  id: number;
  name: string;
  description?: string;
  steps: Array<{
    step: number;
    event_type: string;
  }>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}