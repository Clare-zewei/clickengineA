-- Click Engine Marketing Analytics Database Schema
-- Phase 1: Core tables for data collection and user behavior tracking

-- Marketing channels table
CREATE TABLE marketing_channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    type VARCHAR(50) NOT NULL, -- 'google_ads', 'facebook', 'email', 'organic', etc.
    description TEXT,
    cost_per_click DECIMAL(10,4),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Marketing campaigns table (simplified version)
CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    channel_id INTEGER REFERENCES marketing_channels(id),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    budget DECIMAL(12,2),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'paused', 'completed'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User events tracking table
CREATE TABLE user_events (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100), -- Can be anonymous before registration
    session_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'page_view', 'click', 'registration', 'conversion', etc.
    page_url TEXT,
    referrer_url TEXT,
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    utm_term VARCHAR(100),
    utm_content VARCHAR(100),
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    duration_seconds INTEGER, -- Time spent on page
    metadata JSONB, -- Additional event data (company_size, industry, etc.)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversion funnels data table
CREATE TABLE conversion_funnels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    steps JSONB NOT NULL, -- Array of funnel steps with event types
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_session_id ON user_events(session_id);
CREATE INDEX idx_user_events_event_type ON user_events(event_type);
CREATE INDEX idx_user_events_created_at ON user_events(created_at);
CREATE INDEX idx_user_events_utm_source ON user_events(utm_source);
CREATE INDEX idx_campaigns_channel_id ON campaigns(channel_id);
CREATE INDEX idx_campaigns_utm_campaign ON campaigns(utm_campaign);

-- Insert sample data for development
INSERT INTO marketing_channels (name, type, description) VALUES 
('Google Ads', 'google_ads', 'Google Ads pay-per-click campaigns'),
('Facebook Ads', 'facebook_ads', 'Facebook and Instagram advertising'),
('Email Marketing', 'email', 'Email newsletter and promotional campaigns'),
('Organic Search', 'organic', 'Organic search engine results'),
('Direct Traffic', 'direct', 'Direct website visits');

INSERT INTO campaigns (name, channel_id, utm_source, utm_medium, utm_campaign, budget) VALUES
('PM Software Q4', 1, 'google', 'cpc', 'pm_software', 5000.00),
('TeamTurbo Launch', 2, 'facebook', 'social', 'teamturbo_launch', 3000.00);

INSERT INTO conversion_funnels (name, description, steps) VALUES
('User Registration Funnel', 'Track user journey from ad click to registration', 
 '[{"step": 1, "event_type": "ad_click"}, {"step": 2, "event_type": "page_view"}, {"step": 3, "event_type": "registration"}]'),
('Purchase Funnel', 'Track user journey from registration to purchase',
 '[{"step": 1, "event_type": "registration"}, {"step": 2, "event_type": "trial_start"}, {"step": 3, "event_type": "purchase"}]');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_marketing_channels_updated_at BEFORE UPDATE ON marketing_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversion_funnels_updated_at BEFORE UPDATE ON conversion_funnels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();