export interface MarketingChannel {
  id: number;
  name: string;
  type: string;
  platform?: string;
  channel_category?: string;
  custom_type?: string;
  type_display?: string;
  description?: string;
  cost_per_click?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Analytics fields
  total_campaigns?: number;
  active_campaigns?: number;
  total_budget?: number;
  total_investment?: number;
  budget_utilization_percent?: number;
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
  start_date?: string;
  end_date?: string;
  status: 'active' | 'paused' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface CampaignSummary extends Campaign {
  budget_utilization?: string;
  budget_utilization_percent?: number;
  total_spend?: number;
  days_remaining?: number;
  is_active?: boolean;
  cac?: number | null; // Customer Acquisition Cost
  paid_users?: number; // Number of paid users attributed to this campaign
  channel_type?: string; // Channel type for display
}

export interface CampaignGoal {
  id: number;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
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
  created_at: string;
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
  created_at: string;
  updated_at: string;
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

export interface DashboardStats {
  totalEvents: number;
  uniqueUsers: number;
  uniqueSessions: number;
  conversionRate: number;
  topCampaigns: Array<{
    name: string;
    events: number;
  }>;
  eventsByType: Array<{
    event_type: string;
    count: number;
  }>;
}