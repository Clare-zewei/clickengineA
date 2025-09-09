-- Phase 2: Enhanced Campaign Management Schema
-- Adding new fields and constraints for comprehensive campaign tracking

-- Add new fields to campaigns table for Phase 2 requirements
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS actual_ad_spend DECIMAL(12,2) DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS external_costs DECIMAL(12,2) DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS has_human_input BOOLEAN DEFAULT false;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS campaign_count INTEGER DEFAULT 1;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS primary_goal VARCHAR(50) DEFAULT 'awareness';

-- Add check constraints for data validation
ALTER TABLE campaigns ADD CONSTRAINT check_budget_positive 
    CHECK (budget IS NULL OR budget >= 0);
ALTER TABLE campaigns ADD CONSTRAINT check_actual_spend_positive 
    CHECK (actual_ad_spend >= 0);
ALTER TABLE campaigns ADD CONSTRAINT check_external_costs_positive 
    CHECK (external_costs >= 0);
ALTER TABLE campaigns ADD CONSTRAINT check_campaign_count_positive 
    CHECK (campaign_count > 0);
ALTER TABLE campaigns ADD CONSTRAINT check_date_range 
    CHECK (start_date IS NULL OR end_date IS NULL OR start_date <= end_date);

-- Update marketing channels with Phase 2 preset channels
INSERT INTO marketing_channels (name, type, description) VALUES 
('LinkedIn Ads', 'linkedin_ads', 'LinkedIn professional network advertising'),
('Medium Content', 'content_marketing', 'Medium platform content marketing')
ON CONFLICT (name) DO NOTHING;

-- Create campaign goals enumeration table
CREATE TABLE IF NOT EXISTS campaign_goals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO campaign_goals (name, description) VALUES
('awareness', 'Brand awareness and reach'),
('registration', 'User registration and sign-ups'),
('conversion', 'Sales and revenue generation'),
('engagement', 'User engagement and interaction'),
('retention', 'Customer retention and loyalty'),
('leads', 'Lead generation and qualification')
ON CONFLICT (name) DO NOTHING;

-- Create campaign metrics tracking table
CREATE TABLE IF NOT EXISTS campaign_metrics (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    metric_date DATE NOT NULL DEFAULT CURRENT_DATE,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    click_through_rate DECIMAL(5,4),
    cost_per_click DECIMAL(10,4),
    conversions INTEGER DEFAULT 0,
    conversion_rate DECIMAL(5,4),
    cost_per_conversion DECIMAL(10,2),
    return_on_ad_spend DECIMAL(8,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, metric_date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_campaigns_primary_goal ON campaigns(primary_goal);
CREATE INDEX IF NOT EXISTS idx_campaigns_actual_spend ON campaigns(actual_ad_spend);
CREATE INDEX IF NOT EXISTS idx_campaigns_status_dates ON campaigns(status, start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_date ON campaign_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_campaign_metrics_campaign_id ON campaign_metrics(campaign_id);

-- Create trigger for campaign_metrics updated_at
CREATE TRIGGER update_campaign_metrics_updated_at 
    BEFORE UPDATE ON campaign_metrics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate budget utilization
CREATE OR REPLACE FUNCTION get_budget_utilization(campaign_id INTEGER)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    total_budget DECIMAL(12,2);
    total_spend DECIMAL(12,2);
BEGIN
    SELECT 
        COALESCE(budget, 0),
        COALESCE(actual_ad_spend, 0) + COALESCE(external_costs, 0)
    INTO total_budget, total_spend
    FROM campaigns 
    WHERE id = campaign_id;
    
    IF total_budget > 0 THEN
        RETURN (total_spend / total_budget * 100);
    ELSE
        RETURN 0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get campaign status with days remaining
CREATE OR REPLACE FUNCTION get_campaign_status_with_days(campaign_id INTEGER)
RETURNS JSON AS $$
DECLARE
    campaign_record RECORD;
    days_remaining INTEGER;
    result JSON;
BEGIN
    SELECT * INTO campaign_record FROM campaigns WHERE id = campaign_id;
    
    IF campaign_record.end_date IS NOT NULL THEN
        days_remaining := campaign_record.end_date - CURRENT_DATE;
    ELSE
        days_remaining := NULL;
    END IF;
    
    result := json_build_object(
        'status', campaign_record.status,
        'days_remaining', days_remaining,
        'is_active', (campaign_record.status = 'active' AND 
                     (campaign_record.end_date IS NULL OR campaign_record.end_date >= CURRENT_DATE))
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Sample data for testing Phase 2 features
INSERT INTO campaigns (
    name, channel_id, utm_source, utm_medium, utm_campaign, 
    budget, actual_ad_spend, external_costs, has_human_input, 
    campaign_count, primary_goal, start_date, end_date, status
) VALUES
(
    'Q4 New User Acquisition', 
    (SELECT id FROM marketing_channels WHERE name = 'Google Ads' LIMIT 1),
    'google', 'cpc', 'q4_acquisition',
    5000.00, 4200.00, 800.00, true,
    3, 'registration',
    '2025-10-01', '2025-10-31', 'active'
),
(
    'LinkedIn Professional Outreach',
    (SELECT id FROM marketing_channels WHERE name = 'LinkedIn Ads' LIMIT 1),
    'linkedin', 'social', 'professional_outreach',
    3000.00, 2100.00, 400.00, true,
    2, 'leads',
    '2025-09-15', '2025-11-15', 'active'
) ON CONFLICT DO NOTHING;