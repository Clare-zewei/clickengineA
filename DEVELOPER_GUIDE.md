# ClickEngine Analytics - Complete Developer Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Core Features Implementation](#core-features-implementation)
6. [API Integration](#api-integration)
7. [Component Architecture](#component-architecture)
8. [Data Models](#data-models)
9. [Routing Structure](#routing-structure)
10. [State Management](#state-management)
11. [UI Design System](#ui-design-system)
12. [Performance Optimizations](#performance-optimizations)
13. [Development Setup](#development-setup)
14. [Testing Strategy](#testing-strategy)
15. [Deployment Guide](#deployment-guide)

## Project Overview

ClickEngine Analytics is a comprehensive marketing analytics platform that helps businesses track, analyze, and optimize their marketing campaigns and conversion funnels. The platform provides detailed insights into user behavior, campaign performance, and conversion optimization opportunities.

### Key Business Features
- **Dashboard Analytics**: Real-time marketing performance overview with 8 key metrics
- **Campaign Management**: Track and optimize marketing campaigns with CAC analysis
- **Channel Analytics**: Analyze marketing channel performance and ROI
- **Advanced Funnel Analysis V2**: Multi-step wizard funnel builder with 17+ templates
- **Step Template Library**: Pre-configured GA4 event templates by category
- **UTM Parameter Management**: Automated campaign tracking and attribution
- **Integration Hub**: Connect with GA4 and TeamTurbo analytics platforms

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │  Dashboard  │ │ Campaigns   │ │  Channels   │ │   Funnels   ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                    Service Layer (API)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐│
│  │     GA4     │ │   Backend   │ │    Mock     │ │ External    ││
│  │ Integration │ │     API     │ │   Service   │ │    APIs     ││
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘│
├─────────────────────────────────────────────────────────────────┤
│                      Data Layer                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │
│  │  Analytics  │ │  Campaigns  │ │   Funnels   │               │
│  │    Data     │ │    Data     │ │    Data     │               │
│  └─────────────┘ └─────────────┘ └─────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend
- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Ant Design** - UI Component Library
- **React Router v6** - Client-side Routing
- **Day.js** - Date Manipulation
- **CSS-in-JS** - Styling

### Build Tools
- **Create React App** - Build Configuration
- **Babel** - JavaScript Transpilation
- **ESLint** - Code Linting
- **TypeScript Compiler** - Type Checking

### Development Tools
- **Hot Reload** - Development Experience
- **Source Maps** - Debugging
- **Mock Services** - Development Data

## Project Structure

```
clickengineA/
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── Layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   ├── CampaignForm.tsx
│   │   │   ├── CustomEventManager.tsx
│   │   │   ├── FunnelTemplateBuilder.tsx
│   │   │   ├── FunnelTemplateCard.tsx
│   │   │   ├── KeywordsInput.tsx
│   │   │   ├── StepConfiguration.tsx
│   │   │   └── FunnelAnalysisV2/
│   │   │       └── StepConfigPanel.tsx
│   │   ├── pages/               # Main application pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Campaigns.tsx
│   │   │   ├── CampaignDetails.tsx
│   │   │   ├── Channels.tsx
│   │   │   ├── Integrations.tsx
│   │   │   ├── FunnelAnalysisV2Router.tsx       # Funnel routing
│   │   │   ├── FunnelAnalysisV2Dashboard.tsx    # Funnel management
│   │   │   ├── FunnelAnalysisV2Builder.tsx      # Funnel creation/editing
│   │   │   └── FunnelAnalysisV2Details.tsx      # Detailed funnel analysis
│   │   ├── services/            # API and data services
│   │   │   ├── api.ts
│   │   │   └── mockData.ts
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── App.tsx             # Main application component
│   │   ├── App.css             # Global styles
│   │   └── index.tsx           # Application entry point
│   ├── public/                 # Static assets
│   └── package.json           # Frontend dependencies
├── backend/                   # Backend API (future implementation)
└── README.md
```

## Core Features Implementation

### 1. Dashboard Analytics

**File**: `src/pages/Dashboard.tsx`

The dashboard provides a comprehensive overview of marketing performance with 8 key metrics:

```typescript
interface DashboardMetrics {
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  revenue: number;
}

// Time selector functionality
const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

// Metrics calculation with time range filtering
const calculateMetrics = (timeRange: string) => {
  // Implementation details for filtering data by time range
};
```

**Key Features:**
- **Top Metrics Cards**: 8 KPI metrics with trend indicators
- **Time Range Selector**: 7 days, 30 days, 90 days options
- **Campaign Rankings**: Top performing campaigns table
- **Channel Rankings**: Marketing channel performance comparison
- **Real-time Data Updates**: Automatic refresh every 15 minutes

**Components Used:**
- `Card`, `Statistic`, `Select`, `Table` from Ant Design
- Custom time range filtering logic
- Responsive grid layout (4 columns on desktop, stacked on mobile)

### 2. Campaign Management

**File**: `src/pages/Campaigns.tsx`

Professional table-based campaign management with advanced features:

```typescript
interface ProcessedCampaign extends CampaignSummary {
  cac: number | null;
  budget_utilization_percent: number;
  channel_type: string;
}

// CAC Calculation Logic
const calculateCAC = (campaign: CampaignSummary): number | null => {
  const totalSpend = campaign.total_spend || campaign.actual_ad_spend || 0;
  const paidUsers = campaign.paid_users || 0;
  
  if (paidUsers === 0) return null;
  return totalSpend / paidUsers;
};
```

**Key Features:**
- **Table Layout**: Professional data table with 8 columns
- **CAC Calculation**: Customer Acquisition Cost per campaign
- **Budget Utilization**: Visual progress bars and percentage tracking
- **Filtering & Search**: Real-time search and multi-filter support
- **Sorting**: All columns sortable with custom logic
- **Actions Menu**: Edit, delete, view details per campaign
- **Status Indicators**: Color-coded campaign status tags

**Table Columns:**
1. Campaign Name (with status badge)
2. Channel Type (filterable tags)
3. Budget (currency formatted)
4. Actual Spend (currency formatted)
5. Budget Utilization (progress bar)
6. CAC (color-coded based on value)
7. Campaign Period (date range with icons)
8. Actions (dropdown menu)

### 3. Channel Analytics

**File**: `src/pages/Channels.tsx`

Comprehensive marketing channel performance analysis:

```typescript
interface Channel {
  id: number;
  name: string;
  type: string;
  platform?: string;
  channel_category: string;
  total_campaigns?: number;
  active_campaigns?: number;
  total_budget?: number;
  total_investment?: number;
  budget_utilization_percent?: number;
  monthlyRevenue?: number;
  totalRevenue?: number;
  paidUsers?: number;
  conversionToPaid?: number;
  cac?: number; // Customer Acquisition Cost
  channelROI?: number;
  is_active: boolean;
}

// Channel CAC Calculation
const cac = paidUsers > 0 ? totalSpent / paidUsers : null;
```

**Key Features:**
- **Channel Performance Matrix**: Multiple KPIs per channel
- **CAC Analysis**: Dedicated Customer Acquisition Cost column
- **Revenue Tracking**: Monthly and total revenue metrics
- **Budget Analysis**: Investment vs. utilization tracking
- **Status Management**: Active/inactive channel filtering
- **Platform Integration**: Multi-platform channel support

**Analytics Columns:**
1. Channel Name (with platform info)
2. Type (categorized tags)
3. Campaigns (active/total split)
4. Total Investment (with budget comparison)
5. Budget Utilization (percentage with color coding)
6. Monthly Revenue (performance indicator)
7. Paid Users (with conversion rate)
8. CAC (Customer Acquisition Cost)
9. Channel ROI (return on investment)
10. Status (active/inactive)
11. Actions (edit/copy/delete)

### 4. Advanced Funnel Analysis V2 System

The V2 funnel analysis system provides a comprehensive multi-step wizard approach for creating, managing, and analyzing conversion funnels with advanced features:

#### 4.1 Funnel Analysis V2 Router
**File**: `src/pages/FunnelAnalysisV2Router.tsx`

Main routing component that handles navigation between funnel dashboard, creation, and editing:

```typescript
const FunnelAnalysisV2Router: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FunnelAnalysisV2Dashboard />} />
      <Route path="/create" element={<FunnelAnalysisV2Builder />} />
      <Route path="/edit/:id" element={<FunnelAnalysisV2Builder />} />
      <Route path="/details/:id" element={<FunnelAnalysisV2Details />} />
    </Routes>
  );
};
```

#### 4.2 Funnel Management Dashboard
**File**: `src/pages/FunnelAnalysisV2Dashboard.tsx`

Card-based funnel management interface with performance overview:

```typescript
interface FunnelV2 {
  id: string;
  name: string;
  description: string;
  targetCount: string;
  targetPeriod: 'day' | 'week' | 'month';
  status: 'draft' | 'testing' | 'active' | 'paused';
  steps: FunnelStepV2[];
  createdAt: Date;
  updatedAt: Date;
  performance?: {
    totalUsers: number;
    conversions: number;
    conversionRate: number;
    avgCompletionTime: string;
  };
}
```

**Key Features:**
- **Funnel Cards**: Visual overview with key metrics
- **Status Management**: Draft, testing, active, paused states
- **Quick Actions**: Edit, clone, delete, view details
- **Performance Indicators**: Conversion rates and user metrics
- **Search & Filter**: Find funnels by name, status, or performance

#### 4.3 Multi-Step Wizard Builder
**File**: `src/pages/FunnelAnalysisV2Builder.tsx`

Comprehensive funnel creation and editing with a 3-step wizard:

```typescript
interface FunnelStepV2 {
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
  adConfig?: {
    adType?: string;
    channel?: string;
    creativeFormat?: string;
    keywords?: string[];
  };
}

interface StepTemplate {
  id: string;
  category: 'marketing' | 'user-actions' | 'business-events' | 'engagement';
  name: string;
  description: string;
  ga4EventName: string;
  eventParameters: string[];
  teamTurboAction: string;
  icon: string;
}
```

**Wizard Steps:**
1. **Basic Information**: Name, description, targets, status
2. **Steps Configuration**: Add/remove/reorder steps with templates
3. **Review & Save**: Preview and final validation

**Advanced Features:**
- **17+ Pre-built Templates**: Organized by category (Marketing, User Actions, Business Events, Engagement)
- **Drag & Drop Reordering**: Intuitive step sequence management
- **Custom Step Configuration**: GA4 events, UTM parameters, ad tracking
- **Real-time Form Validation**: Live input feedback with immediate visual updates
- **Dual State Management**: Synchronizes form state with component state
- **Copy & Clone Functionality**: Duplicate existing funnels with automatic naming

**Step Template Categories:**
- **Marketing & Ads**: Ad clicks, page views, blog engagement, social media interactions
- **User Actions**: Sign up, login, email verification, onboarding completion
- **Business Events**: Trial start, feature usage, pricing page views, purchases
- **Engagement**: Content downloads, newsletter signups, webinar registrations, contact forms

#### 4.4 Step Configuration System
**File**: `src/components/StepConfiguration.tsx`

Advanced step configuration with custom parameters:

```typescript
interface StepConfigProps {
  step: FunnelStepV2;
  onChange: (step: FunnelStepV2) => void;
  isTemplate?: boolean;
}

const StepConfiguration: React.FC<StepConfigProps> = ({ step, onChange, isTemplate }) => {
  // UTM Template Management
  const updateUTMTemplate = (field: string, value: string) => {
    onChange({
      ...step,
      utmTemplate: { ...step.utmTemplate, [field]: value }
    });
  };

  // Ad Configuration for marketing steps
  const updateAdConfig = (field: string, value: any) => {
    onChange({
      ...step,
      adConfig: { ...step.adConfig, [field]: value }
    });
  };
};
```

**Configuration Options:**
- **GA4 Event Mapping**: Custom event names and parameters
- **UTM Parameter Templates**: Campaign tracking setup
- **Ad Configuration**: Type, channel, creative format, keywords
- **TeamTurbo Integration**: Action mapping for internal tracking

#### 4.5 Keywords Input System
**File**: `src/components/KeywordsInput.tsx`

Specialized component for managing ad keywords:

```typescript
interface KeywordsInputProps {
  value?: string[];
  onChange?: (keywords: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const KeywordsInput: React.FC<KeywordsInputProps> = ({ value = [], onChange, placeholder, maxTags = 20 }) => {
  // Tag management with validation
  const handleTagAdd = (tag: string) => {
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange?.([...value, tag]);
    }
  };
};
```

**Features:**
- **Dynamic Tag Management**: Add/remove keywords with validation
- **Duplicate Prevention**: Automatic duplicate keyword filtering
- **Limit Control**: Configurable maximum keyword count
- **Visual Feedback**: Immediate tag display and removal

#### 4.6 Detailed Funnel Analysis
**File**: `src/pages/FunnelAnalysisV2Details.tsx`

Comprehensive funnel performance analysis and insights:

```typescript
interface StepPerformance {
  stepId: string;
  stepName: string;
  users: number;
  conversionRate: number;
  avgTimeToNext: string | null;
  dropOffCount: number;
  status: 'excellent' | 'good' | 'attention' | 'critical';
}

interface FunnelAnalysisV2Data {
  funnelId: string;
  overallMetrics: {
    totalUsers: number;
    conversions: number;
    conversionRate: number;
    avgCompletionTime: string;
  };
  stepPerformance: StepPerformance[];
  insights: {
    topBottleneck: string;
    recommendations: string[];
    trendAnalysis: string;
  };
}
```

**Analysis Features:**
- **Step-by-Step Performance**: Detailed conversion metrics per step
- **Bottleneck Identification**: Automatic problem area detection
- **Time Analysis**: User journey timing and completion patterns
- **Actionable Insights**: Specific optimization recommendations
- **Trend Analysis**: Performance changes over time
- **Visual Flow**: Interactive funnel visualization with drop-off points

### 5. Integration Hub

**File**: `src/pages/Integrations.tsx`

Platform integration management for external analytics services:

**Key Features:**
- **GA4 Integration**: Google Analytics 4 connection setup
- **UTM Parameter Management**: Campaign tracking configuration
- **Custom Event Configuration**: Business-specific event definitions
- **Data Sync Status**: Real-time integration health monitoring
- **API Key Management**: Secure credential handling

## API Integration

### Service Layer Architecture

**File**: `src/services/api.ts`

```typescript
interface ApiService {
  campaigns: {
    getAll: (params?: any) => Promise<ApiResponse<CampaignSummary[]>>;
    getById: (id: number) => Promise<ApiResponse<CampaignSummary>>;
    create: (data: any) => Promise<ApiResponse<CampaignSummary>>;
    update: (id: number, data: any) => Promise<ApiResponse<CampaignSummary>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
    getGoals: () => Promise<ApiResponse<CampaignGoal[]>>;
  };
  channels: {
    getAll: (params?: any) => Promise<ApiResponse<MarketingChannel[]>>;
    create: (data: any) => Promise<ApiResponse<MarketingChannel>>;
    update: (id: number, data: any) => Promise<ApiResponse<MarketingChannel>>;
    delete: (id: number) => Promise<ApiResponse<void>>;
  };
  analytics: {
    getDashboardStats: (timeRange?: string) => Promise<ApiResponse<DashboardStats>>;
    getFunnelAnalysis: (funnelId: string) => Promise<ApiResponse<FunnelAnalysisData>>;
  };
}
```

### Mock Data Service

**File**: `src/services/mockData.ts`

Comprehensive mock data service for development and testing:

```typescript
interface MockDataService {
  // Campaign Management
  getCampaigns: () => Promise<CampaignSummary[]>;
  saveCampaign: (campaign: any) => Promise<CampaignSummary>;
  
  // Channel Management
  getChannels: () => Promise<MarketingChannel[]>;
  saveChannel: (channel: any) => Promise<MarketingChannel>;
  
  // Funnel Templates
  getFunnelTemplates: () => Promise<FunnelTemplate[]>;
  saveFunnelTemplate: (template: any) => Promise<FunnelTemplate>;
  
  // Analytics Data
  getDashboardMetrics: (timeRange: string) => Promise<DashboardMetrics>;
  getChannelRevenueData: () => Promise<ChannelRevenueData[]>;
  
  // GA4 Integration
  getGA4Events: () => Promise<GA4Event[]>;
  syncTemplateWithGA4: (templateId: string) => Promise<FunnelTemplate>;
}
```

**Data Generation Features:**
- **Realistic Data**: Business-appropriate mock data generation
- **Time-based Variation**: Different metrics based on time ranges
- **Relationship Consistency**: Connected data across different entities
- **Performance Simulation**: Realistic performance metrics and trends

## Component Architecture

### Layout Components

#### Header Component
**File**: `src/components/Layout/Header.tsx`

```typescript
const Header: React.FC = () => {
  return (
    <AntHeader className="site-layout-header">
      <div className="header-content">
        <Title level={4} style={{ color: 'white', margin: 0 }}>
          ClickEngine Analytics
        </Title>
        <Space>
          <Button type="text" style={{ color: 'white' }}>
            Settings
          </Button>
          <Button type="text" style={{ color: 'white' }}>
            User Menu
          </Button>
        </Space>
      </div>
    </AntHeader>
  );
};
```

#### Sidebar Navigation
**File**: `src/components/Layout/Sidebar.tsx`

```typescript
const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/campaigns',
      icon: <RocketOutlined />,
      label: <Link to="/campaigns">Campaigns</Link>,
    },
    {
      key: '/channels',
      icon: <BranchesOutlined />,
      label: <Link to="/channels">Channels</Link>,
    },
    {
      key: '/funnel-analysis',
      icon: <FunnelPlotOutlined />,
      label: <Link to="/funnel-analysis">Funnel Analysis</Link>,
    },
    {
      key: '/integrations',
      icon: <ApiOutlined />,
      label: <Link to="/integrations">Integrations</Link>,
    },
  ];

  return (
    <Sider width={200} className="site-layout-sider">
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
      />
    </Sider>
  );
};
```

### Form Components

#### Campaign Form
**File**: `src/components/CampaignForm.tsx`

Comprehensive campaign creation and editing form:

```typescript
interface CampaignFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialValues?: CampaignSummary;
  loading?: boolean;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading
}) => {
  // Form configuration with validation rules
  // UTM parameter management
  // Budget and date handling
  // Channel selection logic
};
```

#### Funnel Template Builder
**File**: `src/components/FunnelTemplateBuilder.tsx`

Advanced funnel template creation interface:

```typescript
const FunnelTemplateBuilder: React.FC<FunnelTemplateBuilderProps> = ({
  template,
  ga4Events,
  customEvents,
  onSave,
  onCancel
}) => {
  // Step management (add/remove/reorder)
  // GA4 event integration
  // Real-time preview updates
  // Validation and business logic
  // Template type classification
};
```

### Card Components

#### Funnel Template Card
**File**: `src/components/FunnelTemplateCard.tsx`

Redesigned template display card:

```typescript
const FunnelTemplateCard: React.FC<FunnelTemplateCardProps> = ({
  template,
  onEdit,
  onCopy,
  onDelete
}) => {
  // Funnel complexity calculation
  // Journey time estimation
  // Performance expectations display
  // Action menu (view/edit/copy/delete)
};
```

**Card Structure:**
- **Header**: Template name and status
- **Performance Expectations**: Target conversion rate and complexity
- **User Journey Flow**: Visual step representation
- **Best Use Case**: Contextual recommendations
- **Action Buttons**: Navigation and management options

## Data Models

### Core Interfaces

```typescript
// Campaign Management
interface CampaignSummary extends Campaign {
  budget_utilization?: string;
  budget_utilization_percent?: number;
  total_spend?: number;
  days_remaining?: number;
  is_active?: boolean;
  cac?: number | null;
  paid_users?: number;
  channel_type?: string;
}

// Channel Analytics
interface MarketingChannel {
  id: number;
  name: string;
  type: string;
  platform?: string;
  channel_category: string;
  custom_type?: string;
  description?: string;
  cost_per_click?: number;
  is_active: boolean;
  total_campaigns?: number;
  active_campaigns?: number;
  total_budget?: number;
  total_investment?: number;
  budget_utilization_percent?: number;
  monthlyRevenue?: number;
  totalRevenue?: number;
  paidUsers?: number;
  conversionToPaid?: number;
  cac?: number;
  channelROI?: number;
}

// Funnel Analysis
interface FunnelTemplate {
  id: string;
  name: string;
  businessGoal: 'acquisition' | 'activation' | 'upgrade' | 'retention';
  targetUsers: string;
  budgetRange: string;
  description?: string;
  steps: FunnelTemplateStep[];
  targetTotalConversion: number;
  funnelType: string;
  estimatedJourneyTime: string;
  complexity: string;
  isActive: boolean;
  actualTotalConversion?: number;
  overallPerformanceStatus?: 'success' | 'warning' | 'danger';
  performanceMetrics?: {
    users: number;
    conversions: number;
  };
}

interface FunnelTemplateStep {
  id: string;
  stepNumber: number;
  event: GA4Event;
  targetConversionRate: number;
  actualConversionRate?: number;
  performanceStatus?: 'success' | 'warning' | 'danger';
  performanceVariance?: string;
}

// GA4 Integration
interface GA4Event {
  id: string;
  name: string;
  ga4EventId: string;
  description: string;
  stage: 'acquisition' | 'awareness' | 'interest' | 'trial' | 'conversion';
  estimatedConversion: number;
  isCustom: boolean;
  parameters?: GA4EventParameter[];
}

// Analytics Data
interface DashboardStats {
  totalUsers: number;
  newUsers: number;
  returningUsers: number;
  totalSessions: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  revenue: number;
  topCampaigns: Array<{
    name: string;
    events: number;
  }>;
  eventsByType: Array<{
    event_type: string;
    count: number;
  }>;
}
```

## Routing Structure

**File**: `src/App.tsx`

```typescript
const App: React.FC = () => {
  return (
    <Layout className="app-layout">
      <Sidebar />
      <Layout className="site-layout">
        <Header />
        <Content className="site-layout-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/funnel-analysis/*" element={<FunnelAnalysis />} />
            <Route path="/funnel/:id" element={<FunnelDetails />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};
```

### Nested Routing

**Funnel Analysis Routing** (`src/pages/FunnelAnalysis.tsx`):
```typescript
<Routes>
  <Route path="/" element={<Navigate to="results" replace />} />
  <Route path="/results" element={<ResultsDashboard />} />
  <Route path="/builder" element={<FunnelBuilder />} />
</Routes>
```

## State Management

The application uses React's built-in state management with hooks:

### Component-Level State
```typescript
// Dashboard state management
const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [loading, setLoading] = useState(true);
  const [campaignRankings, setCampaignRankings] = useState<CampaignRanking[]>([]);
  const [channelRankings, setChannelRankings] = useState<ChannelRanking[]>([]);
};
```

### Data Fetching Patterns
```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    const [metricsResponse, campaignsResponse] = await Promise.all([
      api.analytics.getDashboardStats(timeRange),
      api.campaigns.getAll()
    ]);
    setMetrics(metricsResponse.data);
    setCampaigns(campaignsResponse.data);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

### Form State Management
```typescript
const CampaignForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSubmit(values);
    } catch (error) {
      // Handle validation errors
    } finally {
      setLoading(false);
    }
  };
};
```

## UI Design System

### Color Palette
```css
:root {
  /* Primary Colors */
  --primary-color: #1890ff;
  --primary-light: #40a9ff;
  --primary-dark: #096dd9;

  /* Status Colors */
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #ff4d4f;
  --info-color: #1890ff;

  /* Neutral Colors */
  --text-primary: #262626;
  --text-secondary: #8c8c8c;
  --border-color: #d9d9d9;
  --background-color: #f0f2f5;
}
```

### Typography System
```typescript
// Text hierarchy
<Title level={1}>Main Page Title</Title>
<Title level={2}>Section Title</Title>
<Title level={3}>Subsection Title</Title>
<Text strong>Bold text</Text>
<Text type="secondary">Secondary text</Text>
<Text type="success">Success message</Text>
<Text type="warning">Warning message</Text>
<Text type="danger">Error message</Text>
```

### Spacing System
```css
/* Consistent spacing scale */
--space-xs: 4px;   /* 0.25rem */
--space-sm: 8px;   /* 0.5rem */
--space-md: 16px;  /* 1rem */
--space-lg: 24px;  /* 1.5rem */
--space-xl: 32px;  /* 2rem */
--space-xxl: 48px; /* 3rem */
```

### Component Consistency

#### Card Layouts
```typescript
// Standard card with consistent padding and styling
<Card
  title="Section Title"
  style={{ marginBottom: 24 }}
  extra={<Button type="primary">Action</Button>}
>
  <Content />
</Card>
```

#### Table Configurations
```typescript
// Standard table with consistent pagination and sorting
<Table
  columns={columns}
  dataSource={data}
  rowKey="id"
  pagination={{
    pageSize: 20,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  }}
  scroll={{ x: 1200 }}
/>
```

#### Status Indicators
```typescript
// Consistent status color coding
const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return '#52c41a';
    case 'good': return '#1890ff';
    case 'attention': return '#faad14';
    case 'critical': return '#ff4d4f';
    default: return '#d9d9d9';
  }
};
```

## Performance Optimizations

### Component Optimization
```typescript
// Memoization for expensive calculations
const processedCampaigns = useMemo(() => 
  campaigns.map(campaign => ({
    ...campaign,
    cac: calculateCAC(campaign),
    budget_utilization_percent: calculateBudgetUtilization(campaign)
  })), 
  [campaigns]
);

// Callback memoization for event handlers
const handleEdit = useCallback((campaign: Campaign) => {
  setEditingCampaign(campaign);
  setModalVisible(true);
}, []);
```

### Data Loading Strategies
```typescript
// Parallel data fetching
const fetchAllData = async () => {
  const [campaigns, channels, goals] = await Promise.all([
    api.campaigns.getAll(),
    api.channels.getAll(),
    api.campaigns.getGoals()
  ]);
  return { campaigns, channels, goals };
};

// Background data refresh
useEffect(() => {
  const interval = setInterval(() => {
    if (document.visibilityState === 'visible') {
      fetchLatestData();
    }
  }, 15 * 60 * 1000); // 15 minutes

  return () => clearInterval(interval);
}, []);
```

### Lazy Loading
```typescript
// Code splitting for large components
const FunnelDetails = lazy(() => import('./pages/FunnelDetails'));

// Route-based code splitting
<Routes>
  <Route 
    path="/funnel/:id" 
    element={
      <Suspense fallback={<Spin size="large" />}>
        <FunnelDetails />
      </Suspense>
    } 
  />
</Routes>
```

## Development Setup

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager
- Git for version control

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd clickengineA
```

2. **Install Dependencies**
```bash
cd frontend
npm install
```

3. **Environment Configuration**
```bash
# Create .env file in frontend directory
REACT_APP_API_BASE_URL=http://localhost:3001
REACT_APP_GA4_MEASUREMENT_ID=your-ga4-id
REACT_APP_ENV=development
```

4. **Start Development Server**
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Development Scripts
```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

### Code Quality Tools

#### ESLint Configuration
```json
{
  "extends": [
    "react-app",
    "react-app/jest",
    "@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

#### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  }
}
```

## Testing Strategy

### Component Testing
```typescript
// Example test for Dashboard component
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  test('renders dashboard metrics', async () => {
    renderDashboard();
    
    await waitFor(() => {
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    });
  });

  test('time range selector updates metrics', async () => {
    renderDashboard();
    
    const selector = screen.getByRole('combobox');
    fireEvent.change(selector, { target: { value: '7d' } });
    
    await waitFor(() => {
      // Assert metrics updated for 7-day range
    });
  });
});
```

### API Testing
```typescript
// Mock service testing
import { mockDataService } from '../services/mockData';

describe('Mock Data Service', () => {
  test('generates realistic campaign data', async () => {
    const campaigns = await mockDataService.getCampaigns();
    
    expect(campaigns).toHaveLength(10);
    campaigns.forEach(campaign => {
      expect(campaign).toHaveProperty('name');
      expect(campaign).toHaveProperty('budget');
      expect(campaign.budget).toBeGreaterThan(0);
    });
  });

  test('calculates CAC correctly', async () => {
    const campaigns = await mockDataService.getCampaigns();
    const campaignWithCAC = campaigns.find(c => c.paid_users && c.paid_users > 0);
    
    if (campaignWithCAC) {
      const expectedCAC = campaignWithCAC.total_spend / campaignWithCAC.paid_users;
      expect(campaignWithCAC.cac).toBe(expectedCAC);
    }
  });
});
```

### Integration Testing
```typescript
// Test complete user workflows
describe('Campaign Management Workflow', () => {
  test('user can create, edit, and delete campaign', async () => {
    // Navigate to campaigns page
    // Click "New Campaign" button
    // Fill out campaign form
    // Submit and verify creation
    // Edit the campaign
    // Verify updates
    // Delete the campaign
    // Verify removal
  });
});
```

## Deployment Guide

### Production Build

1. **Build Optimization**
```bash
npm run build
```

2. **Build Analysis**
```bash
# Add to package.json
"analyze": "npm run build && npx serve -s build"
```

### Environment Configuration

#### Production Environment Variables
```env
REACT_APP_API_BASE_URL=https://api.clickengine.com
REACT_APP_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
REACT_APP_ENV=production
REACT_APP_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:16-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://backend:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Monitoring & Analytics

#### Error Tracking
```typescript
// Sentry integration
import * as Sentry from "@sentry/react";

if (process.env.REACT_APP_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing(),
    ],
    tracesSampleRate: 1.0,
  });
}
```

#### Performance Monitoring
```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric) => {
  // Send to your analytics service
  console.log(metric);
};

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

## Next Steps & Future Enhancements

### Phase 1: Backend Integration
- Implement real backend API
- Database schema design
- Authentication & authorization
- Real-time data synchronization

### Phase 2: Advanced Analytics
- Machine learning insights
- Predictive analytics
- A/B testing framework
- Cohort analysis

### Phase 3: Enterprise Features
- Multi-tenant architecture
- Role-based access control
- Advanced reporting
- Custom dashboards

### Phase 4: Mobile & API
- React Native mobile app
- Public API for integrations
- Webhook system
- Third-party integrations

---

## Support & Maintenance

### Code Style Guidelines
- Use TypeScript for all new code
- Follow React functional component patterns
- Implement proper error handling
- Write comprehensive comments for complex logic
- Use meaningful variable and function names

### Documentation Standards
- Update this guide for major feature additions
- Document all API interfaces
- Maintain component storybook
- Keep README files current

### Version Control
- Use semantic versioning (semver)
- Write descriptive commit messages
- Use feature branches for development
- Require code reviews for main branch

This comprehensive guide provides everything needed to understand, develop, maintain, and extend the ClickEngine Analytics platform. The modular architecture ensures scalability while maintaining clean separation of concerns and professional development standards.