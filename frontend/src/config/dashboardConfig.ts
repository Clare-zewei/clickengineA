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
    featureUsage: boolean;
    trialRetention: boolean;
  };
}

export const DASHBOARD_CONFIG: DashboardConfig = {
  showRevenueMetrics: false,        // Hide revenue metrics in pre-revenue phase
  showPaidUserMetrics: false,       // Hide paid user metrics 
  showROIMetrics: false,           // Hide ROI metrics
  phase: 'pre-revenue',            // Current business phase
  validMetrics: {
    entryUsers: true,              // ✅ Valid - traffic metric
    freeTrialUsers: true,          // ✅ Valid - core conversion metric
    conversionRate: true,          // ✅ Valid - key conversion rate (trial conversion)
    cac: true,                     // ✅ Valid - marketing cost metric (if paid promotion exists)
    activeUsers: true,             // ✅ Valid - engagement metric
    featureUsage: true,            // ✅ Valid - product adoption metric
    trialRetention: true,          // ✅ Valid - retention metric
  }
};

// Feature flags for individual metric visibility
export const METRIC_FLAGS = {
  PAID_USERS: false,              // ❌ No payment model
  MONTHLY_REVENUE: false,         // ❌ No revenue source
  PERIOD_REVENUE: false,          // ❌ No revenue source
  TOTAL_ROI: false,              // ❌ Cannot calculate without revenue
  MONTHLY_ROI: false,            // ❌ Cannot calculate without revenue
  AVERAGE_LTV: false,            // ❌ Cannot calculate without paying users
  
  // Valid metrics
  ENTRY_USERS: true,             // ✅ Traffic metric
  FREE_TRIAL_USERS: true,        // ✅ Core conversion metric
  CONVERSION_RATE: true,         // ✅ Trial-to-active conversion
  CAC: true,                     // ✅ Marketing cost (if applicable)
};

// Layout configuration
export const LAYOUT_CONFIG = {
  keyMetricsColumns: 4,          // 4-column layout for key metrics
  showRevenueSection: false,     // Hide entire revenue section
  showComingSoonPlaceholders: false, // Don't show "coming soon" placeholders
};

export default DASHBOARD_CONFIG;