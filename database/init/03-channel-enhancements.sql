-- Channel Management Enhancement SQL
-- This script adds the enhanced channel features for flexible marketing analytics

-- First, add new columns to marketing_channels table
ALTER TABLE marketing_channels 
ADD COLUMN platform VARCHAR(100),
ADD COLUMN custom_type VARCHAR(100),
ADD COLUMN channel_category VARCHAR(50) DEFAULT 'custom';

-- Update the type field to support both preset and custom types
-- We'll keep the existing type field for backward compatibility
-- and use channel_category to distinguish preset vs custom

-- Add check constraint for channel_category
ALTER TABLE marketing_channels 
ADD CONSTRAINT check_channel_category 
CHECK (channel_category IN (
  'paid_advertising',
  'social_media_marketing', 
  'content_marketing',
  'email_marketing',
  'seo_organic',
  'partnership',
  'events',
  'referral_program',
  'influencer_marketing',
  'podcast_advertising',
  'custom'
));

-- Create index for better performance on analytics queries
CREATE INDEX idx_marketing_channels_category ON marketing_channels(channel_category);
CREATE INDEX idx_marketing_channels_platform ON marketing_channels(platform);
CREATE INDEX idx_marketing_channels_active ON marketing_channels(is_active);

-- Create a view for channel analytics that aggregates campaign data
CREATE OR REPLACE VIEW channel_analytics AS
SELECT 
    mc.id,
    mc.name as channel_name,
    mc.type,
    mc.platform,
    mc.channel_category,
    mc.custom_type,
    mc.description,
    mc.cost_per_click,
    mc.is_active,
    
    -- Campaign statistics
    COUNT(c.id) as total_campaigns,
    COUNT(CASE WHEN c.status = 'active' THEN 1 END) as active_campaigns,
    
    -- Financial metrics
    COALESCE(SUM(CASE WHEN c.budget IS NOT NULL THEN c.budget ELSE 0 END), 0) as total_budget,
    COALESCE(SUM(CASE WHEN c.actual_ad_spend IS NOT NULL THEN c.actual_ad_spend ELSE 0 END), 0) as total_ad_spend,
    COALESCE(SUM(CASE WHEN c.external_costs IS NOT NULL THEN c.external_costs ELSE 0 END), 0) as total_external_costs,
    
    -- Total investment calculation
    COALESCE(
        SUM(CASE WHEN c.actual_ad_spend IS NOT NULL THEN c.actual_ad_spend ELSE 0 END) +
        SUM(CASE WHEN c.external_costs IS NOT NULL THEN c.external_costs ELSE 0 END), 
        0
    ) as total_investment,
    
    -- Budget utilization
    CASE 
        WHEN SUM(CASE WHEN c.budget IS NOT NULL THEN c.budget ELSE 0 END) > 0 THEN
            ROUND(
                (SUM(CASE WHEN c.actual_ad_spend IS NOT NULL THEN c.actual_ad_spend ELSE 0 END) +
                 SUM(CASE WHEN c.external_costs IS NOT NULL THEN c.external_costs ELSE 0 END)) * 100.0 /
                SUM(CASE WHEN c.budget IS NOT NULL THEN c.budget ELSE 0 END),
                2
            )
        ELSE 0
    END as budget_utilization_percent,
    
    -- Average metrics
    CASE 
        WHEN COUNT(c.id) > 0 THEN
            ROUND(
                COALESCE(SUM(CASE WHEN c.budget IS NOT NULL THEN c.budget ELSE 0 END), 0) / COUNT(c.id),
                2
            )
        ELSE 0
    END as avg_campaign_budget,
    
    -- Date ranges
    MIN(c.start_date) as earliest_campaign_start,
    MAX(c.end_date) as latest_campaign_end,
    
    -- Last updated
    mc.created_at as channel_created_at,
    mc.updated_at as channel_updated_at
    
FROM marketing_channels mc
LEFT JOIN campaigns c ON mc.id = c.channel_id
GROUP BY 
    mc.id, mc.name, mc.type, mc.platform, mc.channel_category, 
    mc.custom_type, mc.description, mc.cost_per_click, mc.is_active,
    mc.created_at, mc.updated_at;

-- Update existing channels to use the new category system
-- Map existing types to new categories
UPDATE marketing_channels SET 
    channel_category = CASE 
        WHEN type IN ('google_ads', 'facebook_ads', 'linkedin_ads') THEN 'paid_advertising'
        WHEN type IN ('social_media', 'social') THEN 'social_media_marketing'
        WHEN type IN ('content_marketing') THEN 'content_marketing'
        WHEN type IN ('email') THEN 'email_marketing'
        WHEN type IN ('organic', 'seo') THEN 'seo_organic'
        WHEN type IN ('affiliate') THEN 'partnership'
        ELSE 'custom'
    END,
    platform = CASE 
        WHEN type = 'google_ads' THEN 'Google'
        WHEN type = 'facebook_ads' THEN 'Facebook'
        WHEN type = 'linkedin_ads' THEN 'LinkedIn'
        WHEN type = 'content_marketing' THEN 'Medium'
        WHEN type = 'email' THEN 'Email Platform'
        WHEN type = 'organic' THEN 'Search Engines'
        WHEN type = 'direct' THEN 'Direct'
        ELSE 'Various'
    END,
    custom_type = CASE 
        WHEN channel_category = 'custom' AND type NOT IN (
            'google_ads', 'facebook_ads', 'linkedin_ads', 'content_marketing', 
            'email', 'organic', 'social_media', 'affiliate', 'direct'
        ) THEN type
        ELSE NULL
    END;

-- Add some sample enhanced channels to demonstrate new capabilities
INSERT INTO marketing_channels (name, type, platform, channel_category, description, is_active) VALUES
('TikTok Ads', 'tiktok_ads', 'TikTok', 'social_media_marketing', 'TikTok social media advertising for younger demographics', true),
('YouTube Advertising', 'youtube_ads', 'YouTube', 'paid_advertising', 'Video advertising on YouTube platform', true),
('Reddit Sponsored Posts', 'reddit_ads', 'Reddit', 'social_media_marketing', 'Community-based advertising on Reddit', true),
('Podcast Sponsorships', 'podcast_sponsorship', 'Spotify', 'podcast_advertising', 'Audio advertising through podcast sponsorships', true),
('Influencer Partnerships', 'influencer_collab', 'Instagram', 'influencer_marketing', 'Collaborations with social media influencers', true),
('Trade Show Booth', 'trade_show', 'Convention Centers', 'events', 'Physical presence at industry trade shows and conferences', true)
ON CONFLICT (name) DO NOTHING;

-- Create function to get channel display name that handles both preset and custom types
CREATE OR REPLACE FUNCTION get_channel_type_display(
    p_channel_category VARCHAR(50),
    p_custom_type VARCHAR(100)
) RETURNS VARCHAR(100) AS $$
BEGIN
    RETURN CASE p_channel_category
        WHEN 'paid_advertising' THEN 'Paid Advertising'
        WHEN 'social_media_marketing' THEN 'Social Media Marketing'
        WHEN 'content_marketing' THEN 'Content Marketing'
        WHEN 'email_marketing' THEN 'Email Marketing'
        WHEN 'seo_organic' THEN 'SEO/Organic'
        WHEN 'partnership' THEN 'Partnership'
        WHEN 'events' THEN 'Events'
        WHEN 'referral_program' THEN 'Referral Program'
        WHEN 'influencer_marketing' THEN 'Influencer Marketing'
        WHEN 'podcast_advertising' THEN 'Podcast Advertising'
        WHEN 'custom' THEN COALESCE(p_custom_type, 'Custom')
        ELSE 'Other'
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Create function to calculate channel ROI (placeholder for future event tracking integration)
CREATE OR REPLACE FUNCTION calculate_channel_roi(
    p_channel_id INTEGER,
    p_start_date DATE DEFAULT NULL,
    p_end_date DATE DEFAULT NULL
) RETURNS DECIMAL(10,2) AS $$
DECLARE
    v_total_investment DECIMAL(12,2);
    v_total_revenue DECIMAL(12,2);
    v_roi DECIMAL(10,2);
BEGIN
    -- Get total investment for the channel in the specified period
    SELECT COALESCE(SUM(
        COALESCE(actual_ad_spend, 0) + COALESCE(external_costs, 0)
    ), 0)
    INTO v_total_investment
    FROM campaigns
    WHERE channel_id = p_channel_id
    AND (p_start_date IS NULL OR start_date >= p_start_date)
    AND (p_end_date IS NULL OR end_date <= p_end_date);
    
    -- TODO: Calculate total revenue from user_events table when conversion tracking is implemented
    -- For now, we'll use a placeholder calculation based on campaign performance
    v_total_revenue := v_total_investment * 2.5; -- Placeholder: assume 250% return
    
    -- Calculate ROI percentage
    IF v_total_investment > 0 THEN
        v_roi := ((v_total_revenue - v_total_investment) / v_total_investment) * 100;
    ELSE
        v_roi := 0;
    END IF;
    
    RETURN v_roi;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON COLUMN marketing_channels.platform IS 'Specific platform within the channel category (e.g., Facebook, LinkedIn, TikTok)';
COMMENT ON COLUMN marketing_channels.custom_type IS 'User-defined channel type when channel_category is custom';
COMMENT ON COLUMN marketing_channels.channel_category IS 'Predefined channel category for analytics grouping';
COMMENT ON VIEW channel_analytics IS 'Aggregated analytics view for all marketing channels including campaign performance metrics';
COMMENT ON FUNCTION get_channel_type_display IS 'Returns user-friendly display name for channel type';
COMMENT ON FUNCTION calculate_channel_roi IS 'Calculates ROI for a channel over a specified time period';