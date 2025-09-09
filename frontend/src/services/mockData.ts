// Mock data services for ROI tracking system
// This provides realistic data structure for frontend development
// Ready to be replaced with real API calls

export interface RevenueMetrics {
  monthlyROI: {
    current: number;
    change: number;
    isPositive: boolean;
  };
  paidUsers: {
    current: number;
    change: number;
    isPositive: boolean;
  };
  monthlyRevenue: {
    current: number;
    change: number;
    isPositive: boolean;
  };
  averageLTV: {
    current: number;
    change: number;
    isPositive: boolean;
  };
}

export interface ChannelRevenueData {
  id: number;
  name: string;
  monthlyRevenue: number;
  totalRevenue: number;
  paidUsers: number;
  conversionToPaid: number;
  ltvCacRatio: number;
  channelROI: number;
}

export interface CampaignRevenueData {
  id: number;
  name: string;
  paidUsers: number;
  monthlyRevenue: number;
  totalRevenue: number;
  roi: number;
  conversionRate: number;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'warning';
  lastSync: string;
  syncFrequency: string;
  dataHealth: string;
  uptime: number;
}


export interface SmartInsight {
  id: string;
  type: 'roi_performance' | 'ltv_cac' | 'revenue_trend' | 'conversion_optimization';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionRequired: boolean;
  createdAt: string;
}

export interface FunnelStep {
  stepName: string;
  users: number;
  conversionRate: string;
  dropOffRate?: string;
  medianDuration?: string;
  isDropOffPoint?: boolean;
  optimizationSuggestion?: string;
}

export interface ConversionFunnel {
  funnelSteps: FunnelStep[];
  totalConversionRate: string;
  dataQuality: 'high' | 'medium' | 'low';
  dateRange: string;
  insights: string[];
  revenueImpact?: number;
}

export interface ChannelFunnel {
  channelName: string;
  channelId: string;
  funnel: ConversionFunnel;
  qualityScore: number;
  costEfficiency: number;
}

export interface TrendDataPoint {
  date: string;
  conversionRate: number;
  users: number;
  conversions: number;
}

export interface ConversionTrend {
  daily: TrendDataPoint[];
  weekly: TrendDataPoint[];
  monthly: TrendDataPoint[];
  yoyComparison: {
    currentYear: number;
    previousYear: number;
    percentChange: number;
  };
  seasonalPatterns: string[];
  anomalies: {
    date: string;
    type: 'spike' | 'drop';
    severity: 'high' | 'medium' | 'low';
    description: string;
  }[];
}

export interface GA4Event {
  id: string;
  name: string;
  description: string;
  stage: 'acquisition' | 'awareness' | 'interest' | 'trial' | 'conversion';
  ga4EventId?: string;
  estimatedConversion?: number;
  isCustom: boolean;
}

export interface FunnelTemplateStep {
  id: string;
  stepNumber: number;
  event: GA4Event;
  targetConversionRate: number;    // User input (planning)
  actualConversionRate?: number;   // GA4 data (performance)
  isDropOffPoint?: boolean;
  lastSyncedAt?: string;
  performanceStatus?: 'success' | 'warning' | 'danger' | 'pending';
  performanceVariance?: string;
}

export interface FunnelTemplate {
  id: string;
  name: string;
  businessGoal: 'acquisition' | 'activation' | 'upgrade' | 'retention';
  targetUsers: 'b2b_enterprise' | 'individual' | 'smb' | 'large_enterprise';
  budgetRange: string;
  description: string;
  steps: FunnelTemplateStep[];
  targetTotalConversion: number;     // Based on target rates
  actualTotalConversion?: number;    // Based on actual rates
  estimatedCAC: number;
  estimatedROI: number;
  actualROI?: number;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt?: string;
  isActive: boolean;
  overallPerformanceStatus?: 'success' | 'warning' | 'danger' | 'pending';
  performanceMetrics?: {
    users: number;
    conversions: number;
    revenue: number;
    targetConversions: number;
    actualConversions: number;
  };
}

export interface CustomEvent extends GA4Event {
  createdBy: string;
  usageCount: number;
  targetConversionRate?: number;
}

// Mock data generators
export const mockDataService = {
  // Revenue metrics for dashboard
  getRevenueMetrics: (): Promise<RevenueMetrics> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          monthlyROI: {
            current: 150.2,
            change: 15.0,
            isPositive: true
          },
          paidUsers: {
            current: 1247,
            change: 89,
            isPositive: true
          },
          monthlyRevenue: {
            current: 45670,
            change: 8230,
            isPositive: true
          },
          averageLTV: {
            current: 420,
            change: 35,
            isPositive: true
          }
        });
      }, 800);
    });
  },

  // Channel revenue data
  getChannelRevenueData: (): Promise<ChannelRevenueData[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 1,
            name: 'Google Ads',
            monthlyRevenue: 18500,
            totalRevenue: 142000,
            paidUsers: 287,
            conversionToPaid: 12.5,
            ltvCacRatio: 3.2,
            channelROI: 185.5
          },
          {
            id: 6,
            name: 'LinkedIn Ads',
            monthlyRevenue: 9200,
            totalRevenue: 45600,
            paidUsers: 89,
            conversionToPaid: 8.7,
            ltvCacRatio: 2.8,
            channelROI: 168.3
          },
          {
            id: 2,
            name: 'Facebook Ads',
            monthlyRevenue: 6800,
            totalRevenue: 38200,
            paidUsers: 156,
            conversionToPaid: 15.2,
            ltvCacRatio: 4.1,
            channelROI: 224.7
          },
          {
            id: 7,
            name: 'Medium Content',
            monthlyRevenue: 3400,
            totalRevenue: 15600,
            paidUsers: 42,
            conversionToPaid: 18.9,
            ltvCacRatio: 5.3,
            channelROI: 312.4
          },
          {
            id: 3,
            name: 'Email Marketing',
            monthlyRevenue: 2800,
            totalRevenue: 12400,
            paidUsers: 67,
            conversionToPaid: 22.1,
            ltvCacRatio: 6.2,
            channelROI: 287.8
          }
        ]);
      }, 600);
    });
  },

  // Campaign revenue data
  getCampaignRevenueData: (): Promise<CampaignRevenueData[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 3,
            name: 'Q4 New User Acquisition',
            paidUsers: 125,
            monthlyRevenue: 8500,
            totalRevenue: 34200,
            roi: 184.5,
            conversionRate: 11.2
          },
          {
            id: 4,
            name: 'LinkedIn Professional Outreach',
            paidUsers: 67,
            monthlyRevenue: 5600,
            totalRevenue: 18900,
            roi: 156.8,
            conversionRate: 9.8
          },
          {
            id: 6,
            name: 'Medium Content Strategy',
            paidUsers: 23,
            monthlyRevenue: 2100,
            totalRevenue: 8400,
            roi: 287.3,
            conversionRate: 18.7
          },
          {
            id: 7,
            name: 'Email Newsletter Q4',
            paidUsers: 34,
            monthlyRevenue: 1800,
            totalRevenue: 7200,
            roi: 312.5,
            conversionRate: 21.3
          }
        ]);
      }, 700);
    });
  },

  // Integration statuses
  getIntegrationStatuses: (): Promise<IntegrationStatus[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'ga4',
            name: 'Google Analytics 4',
            status: 'connected',
            lastSync: '2 minutes ago',
            syncFrequency: 'Every 15 minutes',
            dataHealth: '99.8% uptime (last 30 days)',
            uptime: 99.8
          },
          {
            id: 'umm',
            name: 'User Management API',
            status: 'connected',
            lastSync: '15 minutes ago',
            syncFrequency: 'Every hour + Manual refresh',
            dataHealth: '99.2% uptime (last 30 days)',
            uptime: 99.2
          },
          {
            id: 'email',
            name: 'Email Platform',
            status: 'warning',
            lastSync: '2 hours ago',
            syncFrequency: 'Every hour',
            dataHealth: '95.4% uptime (last 30 days)',
            uptime: 95.4
          }
        ]);
      }, 500);
    });
  },


  // Smart insights with revenue focus
  getSmartInsights: (): Promise<SmartInsight[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'roi_1',
            type: 'roi_performance',
            title: 'High ROI Alert: Medium Content Channel',
            description: 'Medium Content channel showing exceptional ROI of 312.4%. Consider increasing budget allocation by 25%.',
            priority: 'high',
            actionRequired: true,
            createdAt: '2025-01-09'
          },
          {
            id: 'ltv_1',
            type: 'ltv_cac',
            title: 'Optimal LTV/CAC Ratio: Email Marketing',
            description: 'Email Marketing maintains healthy LTV/CAC ratio of 6.2x, well above 3x threshold. Strong performance.',
            priority: 'medium',
            actionRequired: false,
            createdAt: '2025-01-09'
          },
          {
            id: 'revenue_1',
            type: 'revenue_trend',
            title: 'Revenue Growth Trend Warning',
            description: 'LinkedIn Ads revenue growth slowed to 3% this month vs 15% last month. Investigate campaign performance.',
            priority: 'medium',
            actionRequired: true,
            createdAt: '2025-01-08'
          },
          {
            id: 'conversion_1',
            type: 'conversion_optimization',
            title: 'Low Conversion Rate: Google Ads',
            description: 'Google Ads conversion to paid rate of 12.5% is below channel average of 15.3%. Review landing pages.',
            priority: 'high',
            actionRequired: true,
            createdAt: '2025-01-08'
          }
        ]);
      }, 400);
    });
  },

  // Conversion funnel analysis
  getConversionFunnel: (dateRange?: string): Promise<ConversionFunnel> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const funnel: ConversionFunnel = {
          funnelSteps: [
            {
              stepName: 'Ad Clicks',
              users: 4646,
              conversionRate: '100%',
              dropOffRate: '0%',
              medianDuration: '0s'
            },
            {
              stepName: 'Landing Views',
              users: 3950,
              conversionRate: '85.0%',
              dropOffRate: '15%',
              medianDuration: '2s'
            },
            {
              stepName: 'User Registration',
              users: 1185,
              conversionRate: '25.5%',
              dropOffRate: '70%',
              medianDuration: '3m 45s',
              isDropOffPoint: true,
              optimizationSuggestion: 'Major drop-off detected. Consider simplifying registration form or adding social login options.'
            },
            {
              stepName: 'First Login',
              users: 890,
              conversionRate: '19.2%',
              dropOffRate: '25%',
              medianDuration: '1h 30m'
            },
            {
              stepName: 'Trial Activation',
              users: 623,
              conversionRate: '13.4%',
              dropOffRate: '30%',
              medianDuration: '2h 15m'
            },
            {
              stepName: 'Pricing View',
              users: 267,
              conversionRate: '5.7%',
              dropOffRate: '57%',
              medianDuration: '1d 4h',
              isDropOffPoint: true,
              optimizationSuggestion: 'High drop-off before pricing. Consider better trial value communication.'
            },
            {
              stepName: 'Payment Conversion',
              users: 89,
              conversionRate: '1.9%',
              dropOffRate: '67%',
              medianDuration: '2d 6h'
            }
          ],
          totalConversionRate: '1.9%',
          dataQuality: 'high',
          dateRange: dateRange || 'October 2025',
          insights: [
            '70% drop-off rate from Landing Page to Registration is abnormally high',
            'If optimized to industry average 50%, expect 35 additional conversions',
            'Trial to Pricing conversion needs improvement - only 43% proceed to view pricing',
            'Payment conversion from pricing view (33%) is above industry average'
          ],
          revenueImpact: 12250
        };
        resolve(funnel);
      }, 600);
    });
  },

  // Channel-specific funnels
  getChannelFunnels: (): Promise<ChannelFunnel[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            channelName: 'Google Ads',
            channelId: 'ga',
            funnel: {
              funnelSteps: [
                { stepName: 'Ad Clicks', users: 2100, conversionRate: '100%' },
                { stepName: 'Landing Views', users: 1890, conversionRate: '90%', dropOffRate: '10%' },
                { stepName: 'User Registration', users: 567, conversionRate: '27%', dropOffRate: '70%' },
                { stepName: 'First Login', users: 453, conversionRate: '21.6%', dropOffRate: '20%' },
                { stepName: 'Trial Activation', users: 340, conversionRate: '16.2%', dropOffRate: '25%' },
                { stepName: 'Pricing View', users: 156, conversionRate: '7.4%', dropOffRate: '54%' },
                { stepName: 'Payment Conversion', users: 52, conversionRate: '2.5%', dropOffRate: '67%' }
              ],
              totalConversionRate: '2.5%',
              dataQuality: 'high',
              dateRange: 'Last 30 days',
              insights: ['Best overall conversion rate', 'Strong landing page performance'],
              revenueImpact: 7800
            },
            qualityScore: 85,
            costEfficiency: 3.2
          },
          {
            channelName: 'Facebook Ads',
            channelId: 'fb',
            funnel: {
              funnelSteps: [
                { stepName: 'Ad Clicks', users: 1546, conversionRate: '100%' },
                { stepName: 'Landing Views', users: 1237, conversionRate: '80%', dropOffRate: '20%' },
                { stepName: 'User Registration', users: 371, conversionRate: '24%', dropOffRate: '70%' },
                { stepName: 'First Login', users: 260, conversionRate: '16.8%', dropOffRate: '30%' },
                { stepName: 'Trial Activation', users: 169, conversionRate: '10.9%', dropOffRate: '35%' },
                { stepName: 'Pricing View', users: 67, conversionRate: '4.3%', dropOffRate: '60%' },
                { stepName: 'Payment Conversion', users: 23, conversionRate: '1.5%', dropOffRate: '66%' }
              ],
              totalConversionRate: '1.5%',
              dataQuality: 'high',
              dateRange: 'Last 30 days',
              insights: ['Lower landing page engagement', 'Need to improve ad targeting'],
              revenueImpact: 3450
            },
            qualityScore: 72,
            costEfficiency: 2.1
          },
          {
            channelName: 'LinkedIn Ads',
            channelId: 'li',
            funnel: {
              funnelSteps: [
                { stepName: 'Ad Clicks', users: 1000, conversionRate: '100%' },
                { stepName: 'Landing Views', users: 823, conversionRate: '82.3%', dropOffRate: '17.7%' },
                { stepName: 'User Registration', users: 247, conversionRate: '24.7%', dropOffRate: '70%' },
                { stepName: 'First Login', users: 177, conversionRate: '17.7%', dropOffRate: '28%' },
                { stepName: 'Trial Activation', users: 114, conversionRate: '11.4%', dropOffRate: '36%' },
                { stepName: 'Pricing View', users: 44, conversionRate: '4.4%', dropOffRate: '61%' },
                { stepName: 'Payment Conversion', users: 14, conversionRate: '1.4%', dropOffRate: '68%' }
              ],
              totalConversionRate: '1.4%',
              dataQuality: 'high',
              dateRange: 'Last 30 days',
              insights: ['Professional audience converts well', 'High-quality leads despite lower volume'],
              revenueImpact: 2100
            },
            qualityScore: 78,
            costEfficiency: 1.8
          }
        ]);
      }, 700);
    });
  },

  // Conversion trends over time
  getConversionTrends: (): Promise<ConversionTrend> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const generateTrendData = (baseRate: number, variance: number, count: number): TrendDataPoint[] => {
          return Array.from({ length: count }, (_, i) => {
            const rate = baseRate + (Math.random() - 0.5) * variance;
            const users = Math.floor(1000 + Math.random() * 500);
            return {
              date: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              conversionRate: parseFloat(rate.toFixed(2)),
              users,
              conversions: Math.floor(users * rate / 100)
            };
          });
        };

        resolve({
          daily: generateTrendData(1.9, 0.4, 30),
          weekly: generateTrendData(1.9, 0.3, 12),
          monthly: generateTrendData(1.9, 0.5, 6),
          yoyComparison: {
            currentYear: 1.9,
            previousYear: 1.5,
            percentChange: 26.7
          },
          seasonalPatterns: [
            'Q4 shows 15% higher conversion rates',
            'Weekend conversions drop by 20%',
            'End-of-month spike in conversions observed'
          ],
          anomalies: [
            {
              date: '2025-01-05',
              type: 'spike',
              severity: 'medium',
              description: 'Conversion rate spike to 2.8% due to promotional campaign'
            },
            {
              date: '2025-01-02',
              type: 'drop',
              severity: 'low',
              description: 'Post-holiday drop in conversion rate to 1.2%'
            }
          ]
        });
      }, 500);
    });
  },

  // Predefined GA4 Events
  getGA4Events: (): Promise<GA4Event[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          // Acquisition Stage
          { id: 'ad_click', name: 'Ad Click', description: 'User clicks on advertisement', stage: 'acquisition', ga4EventId: 'ad_click', estimatedConversion: 100, isCustom: false },
          { id: 'organic_search', name: 'Organic Search', description: 'User arrives via organic search', stage: 'acquisition', ga4EventId: 'organic_search', estimatedConversion: 100, isCustom: false },
          { id: 'social_referral', name: 'Social Referral', description: 'User arrives via social media', stage: 'acquisition', ga4EventId: 'social_referral', estimatedConversion: 100, isCustom: false },
          { id: 'email_click', name: 'Email Click', description: 'User clicks email link', stage: 'acquisition', ga4EventId: 'email_click', estimatedConversion: 100, isCustom: false },
          { id: 'referral_click', name: 'Referral Link', description: 'User clicks referral link', stage: 'acquisition', ga4EventId: 'referral_click', estimatedConversion: 100, isCustom: false },

          // Awareness Stage
          { id: 'page_view', name: 'Page View', description: 'User views landing page', stage: 'awareness', ga4EventId: 'page_view', estimatedConversion: 85, isCustom: false },
          { id: 'content_view', name: 'Content View', description: 'User views content/blog', stage: 'awareness', ga4EventId: 'content_view', estimatedConversion: 70, isCustom: false },
          { id: 'video_start', name: 'Video Watch', description: 'User starts watching video', stage: 'awareness', ga4EventId: 'video_start', estimatedConversion: 65, isCustom: false },
          { id: 'resource_download', name: 'Resource Download', description: 'User downloads resource', stage: 'awareness', ga4EventId: 'resource_download', estimatedConversion: 45, isCustom: false },
          { id: 'webinar_register', name: 'Webinar Registration', description: 'User registers for webinar', stage: 'awareness', ga4EventId: 'webinar_register', estimatedConversion: 35, isCustom: false },

          // Interest Stage
          { id: 'form_start', name: 'Form Start', description: 'User starts filling form', stage: 'interest', ga4EventId: 'form_start', estimatedConversion: 60, isCustom: false },
          { id: 'pricing_view', name: 'View Pricing', description: 'User views pricing page', stage: 'interest', ga4EventId: 'pricing_view', estimatedConversion: 40, isCustom: false },
          { id: 'demo_request', name: 'Request Demo', description: 'User requests product demo', stage: 'interest', ga4EventId: 'demo_request', estimatedConversion: 25, isCustom: false },
          { id: 'contact_us', name: 'Contact Us', description: 'User contacts company', stage: 'interest', ga4EventId: 'contact_us', estimatedConversion: 30, isCustom: false },
          { id: 'newsletter_signup', name: 'Newsletter Signup', description: 'User subscribes to newsletter', stage: 'interest', ga4EventId: 'newsletter_signup', estimatedConversion: 50, isCustom: false },

          // Trial Stage
          { id: 'sign_up', name: 'User Registration', description: 'User creates account', stage: 'trial', ga4EventId: 'sign_up', estimatedConversion: 25, isCustom: false },
          { id: 'trial_start', name: 'Start Trial', description: 'User starts free trial', stage: 'trial', ga4EventId: 'trial_start', estimatedConversion: 20, isCustom: false },
          { id: 'feature_usage', name: 'Feature Usage', description: 'User uses key features', stage: 'trial', ga4EventId: 'feature_usage', estimatedConversion: 60, isCustom: false },
          { id: 'onboarding_complete', name: 'Onboarding Complete', description: 'User completes onboarding', stage: 'trial', ga4EventId: 'onboarding_complete', estimatedConversion: 70, isCustom: false },
          { id: 'support_contact', name: 'Contact Support', description: 'User contacts support', stage: 'trial', ga4EventId: 'support_contact', estimatedConversion: 45, isCustom: false },

          // Conversion Stage
          { id: 'purchase', name: 'Complete Purchase', description: 'User completes purchase', stage: 'conversion', ga4EventId: 'purchase', estimatedConversion: 12, isCustom: false },
          { id: 'subscription_start', name: 'Start Subscription', description: 'User starts subscription', stage: 'conversion', ga4EventId: 'subscription_start', estimatedConversion: 15, isCustom: false },
          { id: 'upgrade', name: 'Upgrade Service', description: 'User upgrades service', stage: 'conversion', ga4EventId: 'upgrade', estimatedConversion: 8, isCustom: false },
          { id: 'contract_signed', name: 'Sign Contract', description: 'User signs contract', stage: 'conversion', ga4EventId: 'contract_signed', estimatedConversion: 10, isCustom: false },
          { id: 'payment_success', name: 'Payment Success', description: 'Payment completed successfully', stage: 'conversion', ga4EventId: 'payment_success', estimatedConversion: 95, isCustom: false }
        ]);
      }, 300);
    });
  },

  // Custom Events Management
  getCustomEvents: (): Promise<CustomEvent[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'app_download',
            name: 'App Download',
            description: 'User downloads mobile app',
            stage: 'acquisition',
            ga4EventId: 'custom_app_download',
            estimatedConversion: 85,
            isCustom: true,
            createdBy: 'john@company.com',
            usageCount: 3
          },
          {
            id: 'whitepaper_view',
            name: 'Whitepaper View',
            description: 'User views technical whitepaper',
            stage: 'awareness',
            ga4EventId: 'custom_whitepaper_view',
            estimatedConversion: 35,
            isCustom: true,
            createdBy: 'marketing@company.com',
            usageCount: 5
          },
          {
            id: 'calculator_use',
            name: 'Calculator Use',
            description: 'User uses ROI calculator',
            stage: 'interest',
            ga4EventId: 'custom_calculator_use',
            estimatedConversion: 55,
            isCustom: true,
            createdBy: 'sales@company.com',
            usageCount: 2
          }
        ]);
      }, 200);
    });
  },

  // Funnel Templates
  getFunnelTemplates: (): Promise<FunnelTemplate[]> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve([
          {
            id: 'direct_conversion',
            name: 'Direct Conversion Template',
            businessGoal: 'acquisition',
            targetUsers: 'individual',
            budgetRange: '$1000-5000',
            description: 'Simple direct conversion for high-intent users',
            steps: [
              {
                id: 'step1',
                stepNumber: 1,
                event: { id: 'ad_click', name: 'Ad Click', description: 'User clicks on advertisement', stage: 'acquisition', estimatedConversion: 100, isCustom: false },
                targetConversionRate: 100,
                actualConversionRate: 100,
                performanceStatus: 'success',
                performanceVariance: '+0%',
                lastSyncedAt: '2025-01-09T14:30:00Z'
              },
              {
                id: 'step2',
                stepNumber: 2,
                event: { id: 'purchase', name: 'Complete Purchase', description: 'User completes purchase', stage: 'conversion', estimatedConversion: 8.6, isCustom: false },
                targetConversionRate: 10.0,
                actualConversionRate: 8.6,
                performanceStatus: 'warning',
                performanceVariance: '-14%',
                lastSyncedAt: '2025-01-09T14:30:00Z'
              }
            ],
            targetTotalConversion: 10.0,
            actualTotalConversion: 8.6,
            estimatedCAC: 35,
            estimatedROI: 3.2,
            actualROI: 3.4,
            createdAt: '2025-01-05',
            updatedAt: '2025-01-08',
            lastSyncedAt: '2025-01-09T14:30:00Z',
            isActive: true,
            overallPerformanceStatus: 'warning',
            performanceMetrics: {
              users: 1200,
              conversions: 103,
              revenue: 15450,
              targetConversions: 120,
              actualConversions: 103
            }
          },
          {
            id: 'trial_to_paid',
            name: 'Trial-to-Paid Template',
            businessGoal: 'activation',
            targetUsers: 'b2b_enterprise',
            budgetRange: '$5000-15000',
            description: 'Standard SaaS trial conversion funnel',
            steps: [
              {
                id: 'step1',
                stepNumber: 1,
                event: { id: 'ad_click', name: 'Ad Click', description: 'User clicks on advertisement', stage: 'acquisition', estimatedConversion: 100, isCustom: false },
                targetConversionRate: 100,
                actualConversionRate: 100,
                performanceStatus: 'success',
                performanceVariance: '+0%',
                lastSyncedAt: '2025-01-09T14:30:00Z'
              },
              {
                id: 'step2',
                stepNumber: 2,
                event: { id: 'page_view', name: 'Landing View', description: 'User views landing page', stage: 'awareness', estimatedConversion: 85, isCustom: false },
                targetConversionRate: 85,
                actualConversionRate: 78,
                performanceStatus: 'warning',
                performanceVariance: '-8.2%',
                lastSyncedAt: '2025-01-09T14:30:00Z'
              },
              {
                id: 'step3',
                stepNumber: 3,
                event: { id: 'trial_start', name: 'Free Trial', description: 'User starts free trial', stage: 'trial', estimatedConversion: 25, isCustom: false },
                targetConversionRate: 25,
                actualConversionRate: 18,
                performanceStatus: 'danger',
                performanceVariance: '-28%',
                isDropOffPoint: true,
                lastSyncedAt: '2025-01-09T14:30:00Z'
              },
              {
                id: 'step4',
                stepNumber: 4,
                event: { id: 'subscription_start', name: 'Paid User', description: 'User starts subscription', stage: 'conversion', estimatedConversion: 14, isCustom: false },
                targetConversionRate: 14,
                actualConversionRate: 10,
                performanceStatus: 'danger',
                performanceVariance: '-28.6%',
                lastSyncedAt: '2025-01-09T14:30:00Z'
              }
            ],
            targetTotalConversion: 2.975,
            actualTotalConversion: 1.4,
            estimatedCAC: 125,
            estimatedROI: 4.1,
            actualROI: 2.8,
            createdAt: '2025-01-03',
            updatedAt: '2025-01-09',
            lastSyncedAt: '2025-01-09T14:30:00Z',
            isActive: true,
            overallPerformanceStatus: 'danger',
            performanceMetrics: {
              users: 2800,
              conversions: 39,
              revenue: 23400,
              targetConversions: 83,
              actualConversions: 39
            }
          },
          {
            id: 'content_marketing',
            name: 'Content Marketing Template',
            businessGoal: 'acquisition',
            targetUsers: 'smb',
            budgetRange: '$2000-8000',
            description: 'Long-term content-driven conversion',
            steps: [
              {
                id: 'step1',
                stepNumber: 1,
                event: { id: 'organic_search', name: 'SEO Search', description: 'User arrives via organic search', stage: 'acquisition', estimatedConversion: 100, isCustom: false },
                targetConversionRate: 100,
                actualConversionRate: 100,
                performanceStatus: 'success',
                performanceVariance: '+0%',
                lastSyncedAt: '2025-01-09T14:30:00Z'
              },
              {
                id: 'step2',
                stepNumber: 2,
                event: { id: 'content_view', name: 'Blog Content', description: 'User views content/blog', stage: 'awareness', estimatedConversion: 70, isCustom: false },
                targetConversionRate: 70,
                actualConversionRate: 74,
                performanceStatus: 'success',
                performanceVariance: '+5.7%',
                lastSyncedAt: '2025-01-09T14:30:00Z'
              },
              {
                id: 'step3',
                stepNumber: 3,
                event: { id: 'newsletter_signup', name: 'Email Subscribe', description: 'User subscribes to newsletter', stage: 'interest', estimatedConversion: 45, isCustom: false },
                targetConversionRate: 45,
                actualConversionRate: 42,
                performanceStatus: 'warning',
                performanceVariance: '-6.7%',
                lastSyncedAt: '2025-01-09T14:30:00Z'
              },
              {
                id: 'step4',
                stepNumber: 4,
                event: { id: 'trial_start', name: 'Trial', description: 'User starts free trial', stage: 'trial', estimatedConversion: 35, isCustom: false },
                targetConversionRate: 35,
                actualConversionRate: 38,
                performanceStatus: 'success',
                performanceVariance: '+8.6%',
                lastSyncedAt: '2025-01-09T14:30:00Z'
              },
              {
                id: 'step5',
                stepNumber: 5,
                event: { id: 'subscription_start', name: 'Paid User', description: 'User starts subscription', stage: 'conversion', estimatedConversion: 18, isCustom: false },
                targetConversionRate: 18,
                actualConversionRate: 22,
                performanceStatus: 'success',
                performanceVariance: '+22.2%',
                lastSyncedAt: '2025-01-09T14:30:00Z'
              }
            ],
            targetTotalConversion: 12.4,
            actualTotalConversion: 14.8,
            estimatedCAC: 85,
            estimatedROI: 5.8,
            actualROI: 6.1,
            createdAt: '2025-01-01',
            updatedAt: '2025-01-07',
            lastSyncedAt: '2025-01-09T14:30:00Z',
            isActive: true,
            overallPerformanceStatus: 'success',
            performanceMetrics: {
              users: 950,
              conversions: 141,
              revenue: 24780,
              targetConversions: 118,
              actualConversions: 141
            }
          }
        ]);
      }, 500);
    });
  },

  // Template Management Functions
  saveFunnelTemplate: (template: Omit<FunnelTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<FunnelTemplate> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newTemplate: FunnelTemplate = {
          ...template,
          id: `template_${Date.now()}`,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0]
        };
        resolve(newTemplate);
      }, 800);
    });
  },

  updateFunnelTemplate: (id: string, template: Partial<FunnelTemplate>): Promise<FunnelTemplate> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const updatedTemplate: FunnelTemplate = {
          id,
          updatedAt: new Date().toISOString().split('T')[0],
          ...template
        } as FunnelTemplate;
        resolve(updatedTemplate);
      }, 600);
    });
  },

  deleteFunnelTemplate: (id: string): Promise<{ success: boolean; message: string }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Funnel template ${id} deleted successfully`
        });
      }, 400);
    });
  },

  saveCustomEvent: (event: Omit<CustomEvent, 'id' | 'usageCount'>): Promise<CustomEvent> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const newEvent: CustomEvent = {
          ...event,
          id: `custom_${Date.now()}`,
          usageCount: 0
        };
        resolve(newEvent);
      }, 400);
    });
  },

  // Manual refresh simulation
  refreshData: (dataType: string): Promise<{ success: boolean; message: string }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: Math.random() > 0.1, // 90% success rate
          message: `${dataType} data refreshed successfully`
        });
      }, 2000); // 2 second refresh simulation
    });
  },

  // GA4 Sync Function
  syncTemplateWithGA4: (templateId: string): Promise<FunnelTemplate> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTemplates = mockDataService.getFunnelTemplates();
        mockTemplates.then(templates => {
          const template = templates.find(t => t.id === templateId);
          if (!template) {
            throw new Error('Template not found');
          }

          // Simulate GA4 data update with slight variations
          const updatedSteps = template.steps.map(step => ({
            ...step,
            actualConversionRate: step.actualConversionRate || 
              Math.max(0.1, (step.targetConversionRate || 0) * (0.7 + Math.random() * 0.6)),
            lastSyncedAt: new Date().toISOString(),
            performanceStatus: (() => {
              const target = step.targetConversionRate || 0;
              const actual = step.actualConversionRate || target * (0.7 + Math.random() * 0.6);
              const variance = (actual - target) / target;
              if (variance >= 0.1) return 'success';
              if (variance >= -0.15) return 'warning';
              return 'danger';
            })() as 'success' | 'warning' | 'danger',
            performanceVariance: (() => {
              const target = step.targetConversionRate || 0;
              const actual = step.actualConversionRate || target * (0.7 + Math.random() * 0.6);
              const variance = ((actual - target) / target * 100);
              return `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%`;
            })()
          }));

          // Calculate actual total conversion
          const actualTotalConversion = updatedSteps.reduce((acc, step, index) => {
            const actualRate = step.actualConversionRate || step.targetConversionRate || 0;
            if (index === 0) return actualRate;
            return (acc * actualRate) / 100;
          }, 100) / 100;

          // Update performance metrics
          const updatedTemplate: FunnelTemplate = {
            ...template,
            steps: updatedSteps,
            actualTotalConversion,
            actualROI: template.estimatedROI * (0.8 + Math.random() * 0.4),
            lastSyncedAt: new Date().toISOString(),
            overallPerformanceStatus: (() => {
              const targetTotal = template.targetTotalConversion || 0;
              const variance = (actualTotalConversion - targetTotal) / targetTotal;
              if (variance >= 0.1) return 'success';
              if (variance >= -0.2) return 'warning';
              return 'danger';
            })() as 'success' | 'warning' | 'danger',
            performanceMetrics: {
              users: template.performanceMetrics?.users || 1000,
              conversions: template.performanceMetrics?.conversions || 0,
              revenue: template.performanceMetrics?.revenue || 0,
              targetConversions: template.performanceMetrics?.targetConversions || 0,
              actualConversions: Math.round((template.performanceMetrics?.users || 1000) * (actualTotalConversion / 100))
            }
          };

          resolve(updatedTemplate);
        });
      }, 800);
    });
  }
};

// Utility functions for data formatting
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

export const formatChange = (change: number, isPercentage: boolean = false): string => {
  const prefix = change >= 0 ? '+' : '';
  const suffix = isPercentage ? '%' : '';
  return `${prefix}${change.toLocaleString()}${suffix}`;
};

// Performance calculation and validation utilities
export const calculatePerformanceVariance = (actual: number, target: number): string => {
  const variance = ((actual - target) / target * 100);
  return `${variance >= 0 ? '+' : ''}${variance.toFixed(1)}%`;
};

export const getPerformanceStatus = (actual: number, target: number): 'success' | 'warning' | 'danger' => {
  const variance = (actual - target) / target;
  if (variance >= 0.1) return 'success'; // 10% above target
  if (variance >= -0.15) return 'warning'; // Up to 15% below target
  return 'danger'; // More than 15% below target
};

export const calculateTotalConversion = (steps: FunnelTemplateStep[], useActual: boolean = false): number => {
  return steps.reduce((acc, step, index) => {
    const rate = useActual 
      ? (step.actualConversionRate || step.targetConversionRate || 0)
      : (step.targetConversionRate || 0);
    if (index === 0) return rate;
    return (acc * rate) / 100;
  }, 100) / 100;
};

export const validateFunnelTemplate = (template: Partial<FunnelTemplate>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Basic validation
  if (!template.name || template.name.trim().length === 0) {
    errors.push('Template name is required');
  }
  
  if (!template.businessGoal) {
    errors.push('Business goal is required');
  }
  
  if (!template.targetUsers) {
    errors.push('Target users must be specified');
  }
  
  if (!template.budgetRange) {
    errors.push('Budget range is required');
  }

  // Step validation
  if (!template.steps || template.steps.length < 2) {
    errors.push('Template must have at least 2 steps');
  }

  if (template.steps && template.steps.length > 6) {
    errors.push('Template cannot have more than 6 steps');
  }

  // Step-specific validation
  template.steps?.forEach((step, index) => {
    if (!step.event || !step.event.id) {
      errors.push(`Step ${index + 1}: Event must be selected`);
    }

    const targetRate = step.targetConversionRate || 0;
    if (!targetRate || targetRate <= 0 || targetRate > 100) {
      errors.push(`Step ${index + 1}: Invalid conversion rate (must be between 0.1 and 100)`);
    }

    if (index === 0 && targetRate !== 100) {
      errors.push(`Step 1: First step must have 100% conversion rate (represents entry point)`);
    }
  });

  // Business logic validation
  if (template.steps && template.steps.length >= 2) {
    const totalConversion = calculateTotalConversion(template.steps, false);
    if (totalConversion < 0.1) {
      errors.push('Total conversion rate is too low (<0.1%). Consider adjusting step conversion rates.');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateTemplateROI = (template: FunnelTemplate, avgRevenuePerCustomer: number = 300): number => {
  const conversion = template.actualTotalConversion || template.targetTotalConversion || 0;
  const estimatedRevenue = (conversion / 100) * avgRevenuePerCustomer;
  return estimatedRevenue / template.estimatedCAC;
};

export const identifyDropOffPoints = (steps: FunnelTemplateStep[], threshold: number = 30): FunnelTemplateStep[] => {
  return steps.filter(step => {
    const rate = step.actualConversionRate || step.targetConversionRate || 0;
    return rate < threshold;
  });
};