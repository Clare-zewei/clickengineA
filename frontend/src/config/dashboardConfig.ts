// Dashboard Configuration for ClickEngine Analytics
// Controls which metrics are displayed based on business phase

export interface DashboardConfig {
  showRevenueMetrics: boolean;
  showPaidUserMetrics: boolean;
  showROIMetrics: boolean;
  phase: 'pre-revenue' | 'revenue';
  validMetrics: {
    entryUsers: boolean;
    freeTrialUsers: boolean;
    conversionRate: boolean;
    cac: boolean;
    activeUsers: boolean;
    trialRetention: boolean;
  };
}

export const DASHBOARD_CONFIG: DashboardConfig = {
  showRevenueMetrics: false,        // Hide revenue metrics - pricing strategy not determined
  showPaidUserMetrics: false,       // Hide paid user metrics - no payment model yet
  showROIMetrics: false,           // Hide ROI metrics - no revenue to calculate ROI
  phase: 'pre-revenue',            // Current business phase
  validMetrics: {
    entryUsers: true,              // ✅ Core metric - data from GA4 (unique users)
    freeTrialUsers: true,          // ✅ Core metric - data from user management system
    conversionRate: true,          // ✅ Core metric - calculated (trial users / entry users)
    cac: true,                     // ✅ Core metric - calculated (channel actual spend / trial users)
    activeUsers: false,            // ⏸️ Not currently needed
    trialRetention: false,         // ⏸️ Future implementation
  }
};

// Feature flags for individual metric visibility
export const METRIC_FLAGS = {
  // Revenue-related metrics (paused until pricing strategy is determined)
  PAID_USERS: false,              // ⏸️ Paused - no payment model yet
  MONTHLY_REVENUE: false,         // ⏸️ Paused - pricing strategy not determined
  PERIOD_REVENUE: false,          // ⏸️ Paused - pricing strategy not determined
  TOTAL_ROI: false,              // ⏸️ Paused - cannot calculate without revenue
  MONTHLY_ROI: false,            // ⏸️ Paused - cannot calculate without revenue
  AVERAGE_LTV: false,            // ⏸️ Paused - cannot calculate without paying users
  
  // Core metrics (active with real data sources)
  ENTRY_USERS: true,             // ✅ GA4 - unique user IDs
  FREE_TRIAL_USERS: true,        // ✅ User management system
  CONVERSION_RATE: true,         // ✅ Calculated - trial users / entry users
  CAC: true,                     // ✅ Calculated - channel actual spend / trial users
  
  // Additional metrics (not currently needed)
  ACTIVE_USERS: false,           // ⏸️ Not currently needed
  FEATURE_USAGE: false,          // ❌ Removed per user request
  TRIAL_RETENTION: false,        // ⏸️ Future implementation
};

// Layout configuration
export const LAYOUT_CONFIG = {
  keyMetricsColumns: 4,          // 4-column layout for key metrics
  showRevenueSection: false,     // Hide entire revenue section
  showComingSoonPlaceholders: false, // Don't show "coming soon" placeholders
};

export default DASHBOARD_CONFIG;