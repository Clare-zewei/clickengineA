-- Migration: Enhance Funnel Steps with Ad Configuration and Keywords
-- Version: 004
-- Date: 2025-09-12

-- Drop existing funnel_steps table if exists (for development)
DROP TABLE IF EXISTS step_keywords CASCADE;
DROP TABLE IF EXISTS keywords_usage_log CASCADE;
DROP TABLE IF EXISTS funnel_steps CASCADE;

-- Enhanced Funnel Steps Table with Hybrid Schema
CREATE TABLE funnel_steps (
    -- Core fields using traditional schema (frequently queried)
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_template_id UUID NOT NULL,
    step_order INTEGER NOT NULL,
    step_type VARCHAR(50) NOT NULL,
    step_name VARCHAR(255),
    completion_goal INTEGER DEFAULT 100,
    ga4_event VARCHAR(100),
    
    -- Common marketing fields for easy querying
    ad_type VARCHAR(50),           -- 'search_ads', 'display_ads', 'video_ads', 'social_ads', 'native_ads'
    creative_format VARCHAR(50),   -- 'text_only', 'text_image', 'video', 'carousel', 'interactive'
    utm_campaign VARCHAR(100),
    utm_source VARCHAR(50),
    utm_medium VARCHAR(50),
    daily_budget DECIMAL(10,2),
    
    -- Content fields
    content_type VARCHAR(50),      -- For content view steps
    content_url TEXT,
    resource_type VARCHAR(50),     -- For resource download steps
    file_format VARCHAR(20),
    form_type VARCHAR(50),         -- For form steps
    page_type VARCHAR(50),         -- For page view steps
    video_type VARCHAR(50),        -- For video watch steps
    video_platform VARCHAR(50),
    
    -- Trial configuration
    trial_length INTEGER,          -- Days for trial steps
    trial_type VARCHAR(50),
    credit_card_required BOOLEAN DEFAULT FALSE,
    
    -- Flexible configuration for complex/changing requirements
    step_config JSONB DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Keywords tracking table (separate for analytics)
CREATE TABLE step_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_step_id UUID NOT NULL REFERENCES funnel_steps(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(funnel_step_id, keyword)
);

-- Keywords usage tracking for analytics
CREATE TABLE keywords_usage_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funnel_step_id UUID REFERENCES funnel_steps(id) ON DELETE SET NULL,
    keyword VARCHAR(255),
    action VARCHAR(20), -- 'added', 'removed'
    user_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_funnel_steps_template ON funnel_steps(funnel_template_id);
CREATE INDEX idx_funnel_steps_ad_type ON funnel_steps(ad_type);
CREATE INDEX idx_funnel_steps_utm_source ON funnel_steps(utm_source);
CREATE INDEX idx_funnel_steps_utm_campaign ON funnel_steps(utm_campaign);
CREATE INDEX idx_funnel_steps_content_type ON funnel_steps(content_type);
CREATE INDEX idx_funnel_steps_order ON funnel_steps(funnel_template_id, step_order);

CREATE INDEX idx_step_keywords_keyword ON step_keywords(keyword);
CREATE INDEX idx_step_keywords_step ON step_keywords(funnel_step_id);

CREATE INDEX idx_keywords_usage_keyword ON keywords_usage_log(keyword);
CREATE INDEX idx_keywords_usage_created ON keywords_usage_log(created_at DESC);

-- JSONB indexes for flexible queries
CREATE INDEX idx_funnel_steps_config ON funnel_steps USING GIN (step_config);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updated_at
CREATE TRIGGER update_funnel_steps_updated_at BEFORE UPDATE
    ON funnel_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for development
INSERT INTO funnel_steps (
    funnel_template_id,
    step_order,
    step_type,
    step_name,
    ad_type,
    creative_format,
    utm_campaign,
    utm_source,
    utm_medium,
    daily_budget,
    step_config
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890'::uuid,
    1,
    'ad_click',
    'Google Search Ads',
    'search_ads',
    'text_only',
    'pm_software_q4',
    'google',
    'cpc',
    500.00,
    '{
        "platform_settings": {
            "google_ads": {
                "bid_strategy": "target_cpa",
                "target_cpa": 75.00,
                "ad_extensions": ["sitelink", "callout"]
            }
        },
        "targeting": {
            "demographics": ["25-45", "enterprise_decision_makers"],
            "locations": ["US", "Canada", "UK"]
        }
    }'::jsonb
);

-- Sample keywords
INSERT INTO step_keywords (funnel_step_id, keyword) 
SELECT 
    (SELECT id FROM funnel_steps LIMIT 1),
    keyword
FROM (VALUES 
    ('project management'),
    ('team collaboration'),
    ('enterprise software'),
    ('task management'),
    ('workflow automation')
) AS keywords(keyword);