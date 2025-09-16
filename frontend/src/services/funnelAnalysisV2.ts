// Funnel Analysis V2 Data Structures and Mock Service
// Completely independent from existing funnel analysis

export interface FunnelStepV2 {
  id: string;
  name: string;
  description: string;
  ga4EventName: string;
  eventParameters: string[];
  teamTurboAction: string;
  utmTemplate: {
    campaign: string;
    source: string;
    medium: string;
    term: string;
    content: string;
  };
  notes?: string;
  icon?: string;
  // Ad Click specific configuration
  adConfig?: {
    adType?: string;
    channel?: string;
    creativeFormat?: string;
    keywords?: string[];
  };
}

export interface FunnelV2 {
  id: string;
  name: string;
  description: string;
  targetGoal: {
    count: number;
    period: 'month' | 'week';
  };
  status: 'active' | 'testing' | 'paused';
  steps: FunnelStepV2[];
  createdAt: string;
  updatedAt: string;
}

export interface StepPerformance {
  stepId: string;
  users: number;
  conversionRate: number;
  avgTimeToNext: string | null;
  dropOffCount: number;
}

export interface FunnelPerformanceData {
  funnelId: string;
  period: string;
  totalUsers: number;
  totalConversions: number;
  conversionRate: number;
  stepPerformance: StepPerformance[];
  biggestDropOff: {
    fromStep: string;
    toStep: string;
    dropOffRate: number;
    usersLost: number;
  } | null;
  lastUpdated: string;
}

// Mock Data Service for Funnel Analysis V2
class FunnelAnalysisV2Service {
  private storageKey = 'funnelAnalysisV2_funnels';
  
  private getStoredFunnels(): FunnelV2[] {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : this.getDefaultFunnels();
    } catch (error) {
      console.error('Error loading funnels from localStorage:', error);
      return this.getDefaultFunnels();
    }
  }

  private saveToStorage(funnels: FunnelV2[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(funnels));
    } catch (error) {
      console.error('Error saving funnels to localStorage:', error);
    }
  }

  private getDefaultFunnels(): FunnelV2[] {
    return [
    {
      id: 'funnel_001',
      name: 'B2B SaaS Trial Funnel',
      description: 'Standard trial conversion for enterprises',
      targetGoal: { count: 50, period: 'month' },
      status: 'active',
      steps: [
        {
          id: 'step_001',
          name: 'Google Ads Click',
          description: 'User clicks on Google advertisement',
          ga4EventName: 'campaign_click',
          eventParameters: ['campaign_id', 'ad_group', 'keyword'],
          teamTurboAction: 'user_source_tracking',
          utmTemplate: {
            campaign: 'b2b_saas_trial',
            source: 'google',
            medium: 'cpc',
            term: 'enterprise_software',
            content: 'trial_ad'
          },
          notes: 'Track performance by keyword',
          icon: '🎯',
          adConfig: {
            adType: 'search',
            channel: 'google_ads',
            creativeFormat: 'text',
            keywords: ['enterprise software', 'business tools', 'saas platform']
          }
        },
        {
          id: 'step_002',
          name: 'Landing Page View',
          description: 'User views landing page',
          ga4EventName: 'page_view',
          eventParameters: ['page_url', 'referrer'],
          teamTurboAction: 'page_visit',
          utmTemplate: {
            campaign: 'b2b_saas_trial',
            source: 'google',
            medium: 'cpc',
            term: 'enterprise_software',
            content: 'trial_ad'
          },
          notes: 'Track which landing page variant',
          icon: '👁️'
        },
        {
          id: 'step_003',
          name: 'Trial Sign Up',
          description: 'User starts free trial',
          ga4EventName: 'trial_start',
          eventParameters: ['trial_type', 'plan'],
          teamTurboAction: 'trial_signup',
          utmTemplate: {
            campaign: 'b2b_saas_trial',
            source: 'google',
            medium: 'cpc',
            term: 'enterprise_software',
            content: 'trial_ad'
          },
          notes: 'Track trial conversion',
          icon: '🚀'
        },
        {
          id: 'step_004',
          name: 'Email Verification',
          description: 'User verifies email address',
          ga4EventName: 'email_verification',
          eventParameters: ['verification_method'],
          teamTurboAction: 'email_verified',
          utmTemplate: {
            campaign: 'b2b_saas_trial',
            source: 'google',
            medium: 'cpc',
            term: 'enterprise_software',
            content: 'trial_ad'
          },
          notes: 'Email verification step',
          icon: '✉️'
        },
        {
          id: 'step_005',
          name: 'Purchase Complete',
          description: 'User completes subscription purchase',
          ga4EventName: 'purchase',
          eventParameters: ['transaction_id', 'value', 'currency'],
          teamTurboAction: 'purchase_complete',
          utmTemplate: {
            campaign: 'b2b_saas_trial',
            source: 'google',
            medium: 'cpc',
            term: 'enterprise_software',
            content: 'trial_ad'
          },
          notes: 'Final conversion tracking',
          icon: '💳'
        }
      ],
      createdAt: '2025-01-08T10:30:00Z',
      updatedAt: '2025-01-08T14:45:00Z'
    },
    {
      id: 'funnel_002',
      name: 'Direct Purchase Funnel',
      description: 'High-intent user direct conversion',
      targetGoal: { count: 20, period: 'month' },
      status: 'testing',
      steps: [
        {
          id: 'step_101',
          name: 'Facebook Ad Click',
          description: 'User clicks on Facebook advertisement',
          ga4EventName: 'campaign_click',
          eventParameters: ['campaign_id', 'ad_group', 'keyword'],
          teamTurboAction: 'user_source_tracking',
          utmTemplate: {
            campaign: 'direct_purchase',
            source: 'facebook',
            medium: 'cpc',
            term: 'quick_buy',
            content: 'direct_ad'
          },
          icon: '📱',
          adConfig: {
            adType: 'display',
            channel: 'facebook_ads',
            creativeFormat: 'video',
            keywords: ['instant purchase', 'quick buy', 'direct order']
          }
        },
        {
          id: 'step_102',
          name: 'Product Page View',
          description: 'User views product page',
          ga4EventName: 'page_view',
          eventParameters: ['page_url', 'referrer'],
          teamTurboAction: 'page_visit',
          utmTemplate: {
            campaign: 'direct_purchase',
            source: 'facebook',
            medium: 'cpc',
            term: 'quick_buy',
            content: 'direct_ad'
          },
          icon: '🛍️'
        },
        {
          id: 'step_103',
          name: 'Purchase Complete',
          description: 'User completes purchase',
          ga4EventName: 'purchase',
          eventParameters: ['transaction_id', 'value', 'currency'],
          teamTurboAction: 'purchase_complete',
          utmTemplate: {
            campaign: 'direct_purchase',
            source: 'facebook',
            medium: 'cpc',
            term: 'quick_buy',
            content: 'direct_ad'
          },
          icon: '💳'
        }
      ],
      createdAt: '2025-01-07T09:15:00Z',
      updatedAt: '2025-01-07T16:20:00Z'
    },
    {
      id: 'funnel_003',
      name: 'Content Marketing Funnel',
      description: 'Blog to email to conversion path',
      targetGoal: { count: 35, period: 'month' },
      status: 'active',
      steps: [
        {
          id: 'step_201',
          name: 'Blog Post View',
          description: 'User reads blog post',
          ga4EventName: 'page_view',
          eventParameters: ['page_url', 'article_title'],
          teamTurboAction: 'content_view',
          utmTemplate: {
            campaign: 'content_marketing',
            source: 'organic',
            medium: 'blog',
            term: 'how_to_guide',
            content: 'blog_post'
          },
          notes: 'Track which blog posts convert',
          icon: '📖'
        },
        {
          id: 'step_202',
          name: 'Newsletter Signup',
          description: 'User subscribes to newsletter',
          ga4EventName: 'newsletter_signup',
          eventParameters: ['signup_source', 'content_type'],
          teamTurboAction: 'newsletter_signup',
          utmTemplate: {
            campaign: 'content_marketing',
            source: 'organic',
            medium: 'blog',
            term: 'how_to_guide',
            content: 'newsletter_form'
          },
          notes: 'Newsletter conversion',
          icon: '📧'
        },
        {
          id: 'step_203',
          name: 'Demo Request',
          description: 'User requests product demo',
          ga4EventName: 'demo_request',
          eventParameters: ['demo_type', 'contact_method'],
          teamTurboAction: 'demo_requested',
          utmTemplate: {
            campaign: 'content_marketing',
            source: 'email',
            medium: 'newsletter',
            term: 'product_demo',
            content: 'demo_cta'
          },
          notes: 'Demo request from newsletter',
          icon: '🎭'
        },
        {
          id: 'step_204',
          name: 'Purchase Decision',
          description: 'User completes purchase',
          ga4EventName: 'purchase',
          eventParameters: ['transaction_id', 'value', 'currency'],
          teamTurboAction: 'purchase_complete',
          utmTemplate: {
            campaign: 'content_marketing',
            source: 'email',
            medium: 'newsletter',
            term: 'product_demo',
            content: 'purchase_link'
          },
          notes: 'Final purchase decision',
          icon: '✅'
        }
      ],
      createdAt: '2025-01-06T15:22:00Z',
      updatedAt: '2025-01-08T11:30:00Z'
    },
    {
      id: 'funnel_004',
      name: 'Mobile App Download Funnel',
      description: 'Social media to app download to purchase',
      targetGoal: { count: 100, period: 'week' },
      status: 'active',
      steps: [
        {
          id: 'step_301',
          name: 'Instagram Ad View',
          description: 'User sees Instagram advertisement',
          ga4EventName: 'ad_impression',
          eventParameters: ['campaign_id', 'creative_id'],
          teamTurboAction: 'ad_view',
          utmTemplate: {
            campaign: 'mobile_app_download',
            source: 'instagram',
            medium: 'social',
            term: 'app_download',
            content: 'video_ad'
          },
          notes: 'Instagram video ads',
          icon: '📱',
          adConfig: {
            adType: 'display',
            channel: 'instagram_ads',
            creativeFormat: 'video',
            keywords: ['mobile app', 'download', 'smartphone']
          }
        },
        {
          id: 'step_302',
          name: 'App Store Visit',
          description: 'User visits app store page',
          ga4EventName: 'page_view',
          eventParameters: ['store_type', 'app_id'],
          teamTurboAction: 'store_visit',
          utmTemplate: {
            campaign: 'mobile_app_download',
            source: 'instagram',
            medium: 'social',
            term: 'app_download',
            content: 'store_link'
          },
          notes: 'App store page view',
          icon: '🏪'
        },
        {
          id: 'step_303',
          name: 'App Download',
          description: 'User downloads mobile app',
          ga4EventName: 'app_download',
          eventParameters: ['app_version', 'device_type'],
          teamTurboAction: 'app_downloaded',
          utmTemplate: {
            campaign: 'mobile_app_download',
            source: 'instagram',
            medium: 'social',
            term: 'app_download',
            content: 'download_button'
          },
          notes: 'Track app downloads',
          icon: '⬇️'
        },
        {
          id: 'step_304',
          name: 'App Registration',
          description: 'User creates account in app',
          ga4EventName: 'sign_up',
          eventParameters: ['method', 'app_version'],
          teamTurboAction: 'app_registration',
          utmTemplate: {
            campaign: 'mobile_app_download',
            source: 'instagram',
            medium: 'social',
            term: 'app_download',
            content: 'signup_form'
          },
          notes: 'In-app registration',
          icon: '📝'
        },
        {
          id: 'step_305',
          name: 'In-App Purchase',
          description: 'User makes first purchase in app',
          ga4EventName: 'in_app_purchase',
          eventParameters: ['item_id', 'value', 'currency'],
          teamTurboAction: 'app_purchase',
          utmTemplate: {
            campaign: 'mobile_app_download',
            source: 'instagram',
            medium: 'social',
            term: 'app_download',
            content: 'purchase_flow'
          },
          notes: 'First in-app purchase',
          icon: '💰'
        }
      ],
      createdAt: '2025-01-05T08:45:00Z',
      updatedAt: '2025-01-08T16:20:00Z'
    },
    {
      id: 'funnel_005',
      name: 'Email Marketing Funnel',
      description: 'Email campaign to website conversion',
      targetGoal: { count: 25, period: 'week' },
      status: 'paused',
      steps: [
        {
          id: 'step_401',
          name: 'Email Open',
          description: 'User opens marketing email',
          ga4EventName: 'email_open',
          eventParameters: ['campaign_id', 'email_type'],
          teamTurboAction: 'email_opened',
          utmTemplate: {
            campaign: 'email_marketing',
            source: 'mailchimp',
            medium: 'email',
            term: 'newsletter',
            content: 'weekly_newsletter'
          },
          notes: 'Weekly newsletter opens',
          icon: '📬'
        },
        {
          id: 'step_402',
          name: 'Email Click',
          description: 'User clicks link in email',
          ga4EventName: 'email_click',
          eventParameters: ['link_url', 'link_text'],
          teamTurboAction: 'email_link_clicked',
          utmTemplate: {
            campaign: 'email_marketing',
            source: 'mailchimp',
            medium: 'email',
            term: 'newsletter',
            content: 'cta_button'
          },
          notes: 'Track which links get clicked',
          icon: '👆'
        },
        {
          id: 'step_403',
          name: 'Landing Page View',
          description: 'User views target landing page',
          ga4EventName: 'page_view',
          eventParameters: ['page_url', 'referrer'],
          teamTurboAction: 'page_visit',
          utmTemplate: {
            campaign: 'email_marketing',
            source: 'mailchimp',
            medium: 'email',
            term: 'newsletter',
            content: 'landing_page'
          },
          notes: 'Email traffic to landing page',
          icon: '🎯'
        },
        {
          id: 'step_404',
          name: 'Contact Form Submit',
          description: 'User submits contact form',
          ga4EventName: 'form_submit',
          eventParameters: ['form_id', 'form_type'],
          teamTurboAction: 'contact_form_submitted',
          utmTemplate: {
            campaign: 'email_marketing',
            source: 'mailchimp',
            medium: 'email',
            term: 'newsletter',
            content: 'contact_form'
          },
          notes: 'Lead generation form',
          icon: '📋'
        }
      ],
      createdAt: '2025-01-04T12:00:00Z',
      updatedAt: '2025-01-06T14:15:00Z'
    },
    {
      id: 'funnel_006',
      name: 'Webinar Registration Funnel',
      description: 'Webinar attendance to sales conversion',
      targetGoal: { count: 15, period: 'month' },
      status: 'testing',
      steps: [
        {
          id: 'step_501',
          name: 'Webinar Landing Page',
          description: 'User visits webinar landing page',
          ga4EventName: 'page_view',
          eventParameters: ['page_url', 'webinar_id'],
          teamTurboAction: 'webinar_page_visit',
          utmTemplate: {
            campaign: 'webinar_series',
            source: 'linkedin',
            medium: 'social',
            term: 'business_webinar',
            content: 'webinar_promo'
          },
          notes: 'Webinar promotional landing page',
          icon: '🎥'
        },
        {
          id: 'step_502',
          name: 'Webinar Registration',
          description: 'User registers for webinar',
          ga4EventName: 'webinar_registration',
          eventParameters: ['webinar_id', 'registration_source'],
          teamTurboAction: 'webinar_registered',
          utmTemplate: {
            campaign: 'webinar_series',
            source: 'linkedin',
            medium: 'social',
            term: 'business_webinar',
            content: 'registration_form'
          },
          notes: 'Webinar registration form',
          icon: '📝'
        },
        {
          id: 'step_503',
          name: 'Webinar Attendance',
          description: 'User attends live webinar',
          ga4EventName: 'webinar_attend',
          eventParameters: ['webinar_id', 'attendance_duration'],
          teamTurboAction: 'webinar_attended',
          utmTemplate: {
            campaign: 'webinar_series',
            source: 'linkedin',
            medium: 'social',
            term: 'business_webinar',
            content: 'webinar_link'
          },
          notes: 'Live webinar attendance',
          icon: '🎪'
        },
        {
          id: 'step_504',
          name: 'Follow-up Email Click',
          description: 'User clicks follow-up email',
          ga4EventName: 'email_click',
          eventParameters: ['email_type', 'link_url'],
          teamTurboAction: 'follow_up_clicked',
          utmTemplate: {
            campaign: 'webinar_series',
            source: 'email',
            medium: 'follow_up',
            term: 'business_webinar',
            content: 'follow_up_email'
          },
          notes: 'Post-webinar follow-up',
          icon: '📧'
        },
        {
          id: 'step_505',
          name: 'Sales Consultation',
          description: 'User books sales consultation',
          ga4EventName: 'consultation_booked',
          eventParameters: ['consultation_type', 'booking_source'],
          teamTurboAction: 'consultation_scheduled',
          utmTemplate: {
            campaign: 'webinar_series',
            source: 'email',
            medium: 'follow_up',
            term: 'business_webinar',
            content: 'booking_link'
          },
          notes: 'Sales consultation booking',
          icon: '🤝'
        }
      ],
      createdAt: '2025-01-03T10:30:00Z',
      updatedAt: '2025-01-07T09:45:00Z'
    }
    ];
  }

  private performanceData: { [funnelId: string]: FunnelPerformanceData } = {
    'funnel_001': {
      funnelId: 'funnel_001',
      period: 'last_30_days',
      totalUsers: 1247,
      totalConversions: 43,
      conversionRate: 3.4,
      stepPerformance: [
        {
          stepId: 'step_001',
          users: 1247,
          conversionRate: 100.0,
          avgTimeToNext: null,
          dropOffCount: 0
        },
        {
          stepId: 'step_002',
          users: 1089,
          conversionRate: 87.3,
          avgTimeToNext: '2 min',
          dropOffCount: 158
        },
        {
          stepId: 'step_003',
          users: 334,
          conversionRate: 30.7,
          avgTimeToNext: '12 min',
          dropOffCount: 755
        },
        {
          stepId: 'step_004',
          users: 298,
          conversionRate: 89.2,
          avgTimeToNext: '3 min',
          dropOffCount: 36
        },
        {
          stepId: 'step_005',
          users: 43,
          conversionRate: 14.4,
          avgTimeToNext: null,
          dropOffCount: 255
        }
      ],
      biggestDropOff: {
        fromStep: 'Landing Page View',
        toStep: 'Trial Sign Up',
        dropOffRate: 69.3,
        usersLost: 755
      },
      lastUpdated: '2025-01-08T16:00:00Z'
    },
    'funnel_002': {
      funnelId: 'funnel_002',
      period: 'last_7_days',
      totalUsers: 156,
      totalConversions: 8,
      conversionRate: 5.1,
      stepPerformance: [
        {
          stepId: 'step_101',
          users: 156,
          conversionRate: 100.0,
          avgTimeToNext: null,
          dropOffCount: 0
        },
        {
          stepId: 'step_102',
          users: 86,
          conversionRate: 55.1,
          avgTimeToNext: '1 min',
          dropOffCount: 70
        },
        {
          stepId: 'step_103',
          users: 8,
          conversionRate: 9.3,
          avgTimeToNext: null,
          dropOffCount: 78
        }
      ],
      biggestDropOff: {
        fromStep: 'Facebook Ad Click',
        toStep: 'Product Page View',
        dropOffRate: 44.9,
        usersLost: 70
      },
      lastUpdated: '2025-01-08T15:30:00Z'
    },
    'funnel_003': {
      funnelId: 'funnel_003',
      period: 'last_30_days',
      totalUsers: 2834,
      totalConversions: 67,
      conversionRate: 2.4,
      stepPerformance: [
        {
          stepId: 'step_201',
          users: 2834,
          conversionRate: 100.0,
          avgTimeToNext: null,
          dropOffCount: 0
        },
        {
          stepId: 'step_202',
          users: 567,
          conversionRate: 20.0,
          avgTimeToNext: '8 min',
          dropOffCount: 2267
        },
        {
          stepId: 'step_203',
          users: 198,
          conversionRate: 34.9,
          avgTimeToNext: '2 days',
          dropOffCount: 369
        },
        {
          stepId: 'step_204',
          users: 67,
          conversionRate: 33.8,
          avgTimeToNext: null,
          dropOffCount: 131
        }
      ],
      biggestDropOff: {
        fromStep: 'Blog Post View',
        toStep: 'Newsletter Signup',
        dropOffRate: 80.0,
        usersLost: 2267
      },
      lastUpdated: '2025-01-08T11:45:00Z'
    },
    'funnel_004': {
      funnelId: 'funnel_004',
      period: 'last_7_days',
      totalUsers: 3456,
      totalConversions: 178,
      conversionRate: 5.2,
      stepPerformance: [
        {
          stepId: 'step_301',
          users: 3456,
          conversionRate: 100.0,
          avgTimeToNext: null,
          dropOffCount: 0
        },
        {
          stepId: 'step_302',
          users: 1038,
          conversionRate: 30.0,
          avgTimeToNext: '30 sec',
          dropOffCount: 2418
        },
        {
          stepId: 'step_303',
          users: 623,
          conversionRate: 60.0,
          avgTimeToNext: '2 min',
          dropOffCount: 415
        },
        {
          stepId: 'step_304',
          users: 374,
          conversionRate: 60.0,
          avgTimeToNext: '5 min',
          dropOffCount: 249
        },
        {
          stepId: 'step_305',
          users: 178,
          conversionRate: 47.6,
          avgTimeToNext: null,
          dropOffCount: 196
        }
      ],
      biggestDropOff: {
        fromStep: 'Instagram Ad View',
        toStep: 'App Store Visit',
        dropOffRate: 70.0,
        usersLost: 2418
      },
      lastUpdated: '2025-01-08T17:15:00Z'
    },
    'funnel_005': {
      funnelId: 'funnel_005',
      period: 'last_7_days',
      totalUsers: 892,
      totalConversions: 12,
      conversionRate: 1.3,
      stepPerformance: [
        {
          stepId: 'step_401',
          users: 892,
          conversionRate: 100.0,
          avgTimeToNext: null,
          dropOffCount: 0
        },
        {
          stepId: 'step_402',
          users: 178,
          conversionRate: 20.0,
          avgTimeToNext: '1 min',
          dropOffCount: 714
        },
        {
          stepId: 'step_403',
          users: 134,
          conversionRate: 75.3,
          avgTimeToNext: '45 sec',
          dropOffCount: 44
        },
        {
          stepId: 'step_404',
          users: 12,
          conversionRate: 9.0,
          avgTimeToNext: null,
          dropOffCount: 122
        }
      ],
      biggestDropOff: {
        fromStep: 'Email Open',
        toStep: 'Email Click',
        dropOffRate: 80.0,
        usersLost: 714
      },
      lastUpdated: '2025-01-06T14:30:00Z'
    },
    'funnel_006': {
      funnelId: 'funnel_006',
      period: 'last_30_days',
      totalUsers: 789,
      totalConversions: 34,
      conversionRate: 4.3,
      stepPerformance: [
        {
          stepId: 'step_501',
          users: 789,
          conversionRate: 100.0,
          avgTimeToNext: null,
          dropOffCount: 0
        },
        {
          stepId: 'step_502',
          users: 345,
          conversionRate: 43.7,
          avgTimeToNext: '3 min',
          dropOffCount: 444
        },
        {
          stepId: 'step_503',
          users: 276,
          conversionRate: 80.0,
          avgTimeToNext: '2 days',
          dropOffCount: 69
        },
        {
          stepId: 'step_504',
          users: 138,
          conversionRate: 50.0,
          avgTimeToNext: '1 day',
          dropOffCount: 138
        },
        {
          stepId: 'step_505',
          users: 34,
          conversionRate: 24.6,
          avgTimeToNext: null,
          dropOffCount: 104
        }
      ],
      biggestDropOff: {
        fromStep: 'Webinar Landing Page',
        toStep: 'Webinar Registration',
        dropOffRate: 56.3,
        usersLost: 444
      },
      lastUpdated: '2025-01-07T10:20:00Z'
    }
  };

  // Get all funnels
  async getFunnels(): Promise<FunnelV2[]> {
    await this.simulateDelay();
    const funnels = this.getStoredFunnels();
    return [...funnels];
  }

  // Get funnel by ID
  async getFunnelById(id: string): Promise<FunnelV2 | null> {
    await this.simulateDelay();
    const funnels = this.getStoredFunnels();
    return funnels.find(f => f.id === id) || null;
  }

  // Create new funnel
  async createFunnel(funnelData: Omit<FunnelV2, 'id' | 'createdAt' | 'updatedAt'>): Promise<FunnelV2> {
    await this.simulateDelay();
    
    const funnels = this.getStoredFunnels();
    const newFunnel: FunnelV2 = {
      ...funnelData,
      id: `funnel_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    funnels.push(newFunnel);
    this.saveToStorage(funnels);
    return newFunnel;
  }

  // Update existing funnel
  async updateFunnel(id: string, funnelData: Partial<FunnelV2>): Promise<FunnelV2 | null> {
    console.log('Service: updateFunnel called with id:', id);
    console.log('Service: funnelData received:', funnelData);
    
    await this.simulateDelay();
    
    const funnels = this.getStoredFunnels();
    console.log('Service: current funnels from storage:', funnels);
    
    const index = funnels.findIndex(f => f.id === id);
    if (index === -1) {
      console.log('Service: funnel not found!');
      return null;
    }

    console.log('Service: found funnel at index:', index, funnels[index]);

    // Properly merge the data, ensuring we don't lose existing properties
    const updatedFunnel = {
      ...funnels[index],
      ...funnelData,
      id: funnels[index].id, // Preserve original ID
      createdAt: funnels[index].createdAt, // Preserve creation date
      updatedAt: new Date().toISOString()
    };

    console.log('Service: updated funnel object:', updatedFunnel);

    funnels[index] = updatedFunnel;
    this.saveToStorage(funnels);
    
    console.log('Service: saved to storage, returning:', updatedFunnel);
    return updatedFunnel;
  }

  // Delete funnel
  async deleteFunnel(id: string): Promise<boolean> {
    await this.simulateDelay();
    
    const funnels = this.getStoredFunnels();
    const index = funnels.findIndex(f => f.id === id);
    if (index === -1) return false;

    funnels.splice(index, 1);
    this.saveToStorage(funnels);
    delete this.performanceData[id];
    return true;
  }

  // Copy funnel
  async copyFunnel(id: string): Promise<FunnelV2 | null> {
    await this.simulateDelay();
    
    const funnels = this.getStoredFunnels();
    const originalFunnel = funnels.find(f => f.id === id);
    if (!originalFunnel) return null;

    const copiedFunnel: FunnelV2 = {
      ...originalFunnel,
      id: `funnel_${Date.now()}`,
      name: `${originalFunnel.name} (Copy)`,
      status: 'testing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    funnels.push(copiedFunnel);
    this.saveToStorage(funnels);
    return copiedFunnel;
  }

  // Get performance data for a funnel
  async getFunnelPerformance(id: string): Promise<FunnelPerformanceData | null> {
    await this.simulateDelay();
    return this.performanceData[id] || null;
  }

  // Save draft funnel
  async saveDraft(funnelData: Partial<FunnelV2>): Promise<void> {
    await this.simulateDelay();
    // In a real implementation, this would save to local storage or a draft endpoint
    console.log('Draft saved:', funnelData);
  }

  private async simulateDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
  }
}

// Export singleton instance
export const funnelAnalysisV2Service = new FunnelAnalysisV2Service();