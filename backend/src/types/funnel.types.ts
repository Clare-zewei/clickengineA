// Funnel Types and Interfaces

export type AdType = 'search_ads' | 'display_ads' | 'video_ads' | 'social_ads' | 'native_ads';
export type CreativeFormat = 'text_only' | 'text_image' | 'video' | 'carousel' | 'interactive';
export type ContentType = 'blog_post' | 'case_study' | 'product_page' | 'resource_page' | 'landing_page';
export type ResourceType = 'whitepaper' | 'ebook' | 'template' | 'checklist' | 'case_study' | 'tool';
export type FormType = 'trial_signup' | 'contact_form' | 'demo_request' | 'newsletter_signup';
export type PageType = 'home_page' | 'pricing_page' | 'features_page' | 'about_page' | 'contact_page';
export type VideoType = 'demo_video' | 'tutorial_video' | 'webinar_replay' | 'product_overview';
export type VideoPlatform = 'youtube' | 'vimeo' | 'wistia' | 'custom_player';
export type TrialType = 'full_access' | 'limited_features' | 'usage_based';

// Main funnel step interface
export interface FunnelStep {
  id: string;
  funnel_template_id: string;
  step_order: number;
  step_type: string;
  step_name?: string;
  completion_goal?: number;
  ga4_event?: string;
  
  // Ad configuration
  ad_type?: AdType;
  creative_format?: CreativeFormat;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  daily_budget?: number;
  
  // Content configuration
  content_type?: ContentType;
  content_url?: string;
  resource_type?: ResourceType;
  file_format?: string;
  form_type?: FormType;
  page_type?: PageType;
  video_type?: VideoType;
  video_platform?: VideoPlatform;
  
  // Trial configuration
  trial_length?: number;
  trial_type?: TrialType;
  credit_card_required?: boolean;
  
  // Flexible configuration
  step_config?: StepConfig;
  
  // Timestamps
  created_at: Date;
  updated_at: Date;
  
  // Relations
  keywords?: StepKeyword[];
}

// Step configuration stored in JSONB
export interface StepConfig {
  // Ad platform settings
  platform_settings?: {
    google_ads?: {
      bid_strategy?: string;
      target_cpa?: number;
      ad_extensions?: string[];
    };
    facebook?: {
      optimization_goal?: string;
      audience_type?: string;
      placement?: string[];
    };
  };
  
  // Targeting configuration
  targeting?: {
    demographics?: string[];
    locations?: string[];
    interests?: string[];
  };
  
  // Creative assets
  creative_assets?: {
    headlines?: string[];
    descriptions?: string[];
    images?: string[];
  };
  
  // Content tracking
  tracking_settings?: {
    track_scroll_depth?: boolean;
    scroll_milestones?: number[];
    track_click_heatmap?: boolean;
    track_exit_intent?: boolean;
  };
  
  // Video settings
  video_settings?: {
    video_duration_seconds?: number;
    engagement_milestones?: number[];
    auto_play?: boolean;
    video_quality?: string;
  };
  
  // Form settings
  form_settings?: {
    fields?: Array<{
      name: string;
      type: string;
      required: boolean;
    }>;
    progressive_profiling?: boolean;
    save_partial_submissions?: boolean;
    multi_step?: boolean;
  };
  
  // Trial settings
  trial_settings?: {
    feature_limitations?: {
      [key: string]: any;
    };
    onboarding?: {
      guided_tour?: boolean;
      sample_data?: boolean;
      setup_checklist?: string[];
    };
  };
  
  // Keywords (backup storage)
  keywords?: string[];
  keyword_metadata?: {
    primary_keyword?: string;
    keyword_match_type?: string;
    negative_keywords?: string[];
  };
}

// Keyword interfaces
export interface StepKeyword {
  id: string;
  funnel_step_id: string;
  keyword: string;
  created_at: Date;
}

export interface KeywordUsageLog {
  id: string;
  funnel_step_id?: string;
  keyword: string;
  action: 'added' | 'removed';
  user_id?: string;
  created_at: Date;
}

// API request/response types
export interface AddKeywordRequest {
  keyword: string;
}

export interface AddKeywordResponse {
  success: boolean;
  keyword: string;
  total_keywords: number;
}

export interface RecentKeyword {
  keyword: string;
  usage_count: number;
  last_used: Date;
}

export interface GetRecentKeywordsResponse {
  keywords: RecentKeyword[];
}

export interface GetStepKeywordsResponse {
  keywords: Array<{
    keyword: string;
    added_at: Date;
  }>;
}

// Funnel template interface
export interface FunnelTemplate {
  id: string;
  name: string;
  description?: string;
  business_goal: string;
  target_users: string;
  is_active: boolean;
  steps: FunnelStep[];
  created_at: Date;
  updated_at: Date;
}

// Create/Update DTOs
export interface CreateFunnelStepDTO {
  funnel_template_id: string;
  step_order: number;
  step_type: string;
  step_name?: string;
  completion_goal?: number;
  ga4_event?: string;
  
  // Ad configuration
  ad_type?: AdType;
  creative_format?: CreativeFormat;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  daily_budget?: number;
  
  // Content configuration
  content_type?: ContentType;
  content_url?: string;
  resource_type?: ResourceType;
  file_format?: string;
  form_type?: FormType;
  page_type?: PageType;
  video_type?: VideoType;
  video_platform?: VideoPlatform;
  
  // Trial configuration
  trial_length?: number;
  trial_type?: TrialType;
  credit_card_required?: boolean;
  
  // Additional configuration
  step_config?: StepConfig;
  
  // Keywords to add
  keywords?: string[];
}

export interface UpdateFunnelStepDTO extends Partial<CreateFunnelStepDTO> {
  id: string;
}

// Analytics types
export interface KeywordPerformance {
  keyword: string;
  channel: string;
  campaign?: string;
  unique_users: number;
  conversions: number;
  avg_budget: number;
  estimated_cac: number;
}