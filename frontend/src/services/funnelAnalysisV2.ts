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
          name: 'Ad Click',
          description: 'User clicks on advertisement',
          ga4EventName: 'campaign_click',
          eventParameters: ['campaign_id', 'ad_group', 'keyword'],
          teamTurboAction: 'user_source_tracking',
          utmTemplate: {
            campaign: '{campaign_name}',
            source: '{source}',
            medium: '{medium}',
            term: '{term}',
            content: '{content}'
          },
          notes: 'Track performance by keyword'
        },
        {
          id: 'step_002',
          name: 'Landing Page View',
          description: 'User views landing page',
          ga4EventName: 'page_view',
          eventParameters: ['page_url', 'referrer'],
          teamTurboAction: 'page_visit',
          utmTemplate: {
            campaign: '{campaign_name}',
            source: '{source}',
            medium: '{medium}',
            term: '{term}',
            content: '{content}'
          },
          notes: 'Track which landing page variant'
        },
        {
          id: 'step_003',
          name: 'Trial Start',
          description: 'User starts free trial',
          ga4EventName: 'trial_start',
          eventParameters: ['trial_type', 'plan'],
          teamTurboAction: 'trial_signup',
          utmTemplate: {
            campaign: '{campaign_name}',
            source: '{source}',
            medium: '{medium}',
            term: '{term}',
            content: '{content}'
          },
          notes: 'Track trial conversion'
        },
        {
          id: 'step_004',
          name: 'Purchase Complete',
          description: 'User completes purchase',
          ga4EventName: 'purchase',
          eventParameters: ['transaction_id', 'value', 'currency'],
          teamTurboAction: 'purchase_complete',
          utmTemplate: {
            campaign: '{campaign_name}',
            source: '{source}',
            medium: '{medium}',
            term: '{term}',
            content: '{content}'
          },
          notes: 'Final conversion tracking'
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
          name: 'Ad Click',
          description: 'User clicks on advertisement',
          ga4EventName: 'campaign_click',
          eventParameters: ['campaign_id', 'ad_group', 'keyword'],
          teamTurboAction: 'user_source_tracking',
          utmTemplate: {
            campaign: '{campaign_name}',
            source: '{source}',
            medium: '{medium}',
            term: '{term}',
            content: '{content}'
          }
        },
        {
          id: 'step_102',
          name: 'Landing Page View',
          description: 'User views landing page',
          ga4EventName: 'page_view',
          eventParameters: ['page_url', 'referrer'],
          teamTurboAction: 'page_visit',
          utmTemplate: {
            campaign: '{campaign_name}',
            source: '{source}',
            medium: '{medium}',
            term: '{term}',
            content: '{content}'
          }
        },
        {
          id: 'step_103',
          name: 'Purchase Complete',
          description: 'User completes purchase',
          ga4EventName: 'purchase',
          eventParameters: ['transaction_id', 'value', 'currency'],
          teamTurboAction: 'purchase_complete',
          utmTemplate: {
            campaign: '{campaign_name}',
            source: '{source}',
            medium: '{medium}',
            term: '{term}',
            content: '{content}'
          }
        }
      ],
      createdAt: '2025-01-07T09:15:00Z',
      updatedAt: '2025-01-07T16:20:00Z'
    }
    ];
  }

  private performanceData: { [funnelId: string]: FunnelPerformanceData } = {
    'funnel_001': {
      funnelId: 'funnel_001',
      period: 'last_30_days',
      totalUsers: 1247,
      totalConversions: 23,
      conversionRate: 1.8,
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
          users: 234,
          conversionRate: 21.5,
          avgTimeToNext: '15 min',
          dropOffCount: 855
        },
        {
          stepId: 'step_004',
          users: 23,
          conversionRate: 9.8,
          avgTimeToNext: null,
          dropOffCount: 211
        }
      ],
      biggestDropOff: {
        fromStep: 'Landing Page View',
        toStep: 'Trial Start',
        dropOffRate: 78.5,
        usersLost: 855
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
        fromStep: 'Ad Click',
        toStep: 'Landing Page View',
        dropOffRate: 44.9,
        usersLost: 70
      },
      lastUpdated: '2025-01-08T15:30:00Z'
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