# ClickEngine Analytics 📊

> A comprehensive marketing analytics platform for tracking, analyzing, and optimizing marketing campaigns and conversion funnels.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.x-green)
![Node.js](https://img.shields.io/badge/Node.js-16.x-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Docker](https://img.shields.io/badge/Docker-Compose-blue)

ClickEngine Analytics is a modern, professional-grade marketing analytics platform that helps businesses understand their marketing performance, optimize conversion funnels, and make data-driven decisions. Built with React and TypeScript, it provides real-time insights into campaign performance, channel effectiveness, and user conversion paths.

## ✨ Key Features

### 📈 Real-time Dashboard
- **8 Key Performance Metrics**: Users, sessions, conversion rate, revenue with trend indicators
- **Time Range Filtering**: Analyze data for 7, 30, or 90-day periods
- **Campaign Rankings**: Top performing campaigns at a glance
- **Channel Rankings**: Marketing channel effectiveness comparison

### 🎯 Campaign Management
- **Professional Table Layout**: 8-column data table with advanced features
- **CAC Calculation**: Automatic Customer Acquisition Cost analysis
- **Budget Tracking**: Real-time utilization with visual progress bars
- **Advanced Filtering**: Multi-criteria search and filtering
- **Status Management**: Color-coded campaign status tracking

### 📡 Channel Analytics  
- **Multi-Channel Support**: Track all marketing channels in one place
- **ROI Analysis**: Calculate and monitor return on investment
- **Revenue Attribution**: Track revenue and conversions per channel
- **Budget Utilization**: Investment vs. spend analysis
- **Performance Metrics**: Paid users, conversion rates, and CAC per channel

### 🔄 Advanced Funnel Analysis V2
- **Multi-Step Wizard Builder**: Create funnels with guided 3-step process
- **17+ Pre-built Step Templates**: Marketing, user actions, business events, and engagement steps
- **Real-time Form Validation**: Live input feedback with proper data handling
- **Drag & Drop Step Ordering**: Reorder funnel steps with intuitive interface
- **Custom Step Configuration**: Define custom events with GA4 and TeamTurbo integration
- **UTM Template Management**: Built-in UTM parameter generation for each step
- **Ad Configuration**: Specialized settings for ad click tracking (type, channel, format, keywords)
- **Copy & Clone Functionality**: Duplicate existing funnels with automatic naming
- **Performance Dashboard**: Card-based layout with conversion metrics and drop-off analysis
- **Step-by-Step Analytics**: Detailed user journey with bottleneck identification

### 🔌 Integration Capabilities
- **GA4 Integration**: Google Analytics 4 connection ready
- **UTM Parameters**: Campaign tracking and attribution
- **Custom Events**: Business-specific event definitions
- **API Access**: RESTful API for external integrations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Ant Design 5** - Professional UI components
- **React Router v6** - Client-side routing
- **Day.js** - Date manipulation

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **PostgreSQL 15** - Relational database
- **Redis** - Caching layer

### Infrastructure
- **Docker Compose** - Container orchestration
- **Nginx** - Reverse proxy and load balancing

## 📦 Installation

### Prerequisites
- Node.js 16.x or higher
- Docker and Docker Compose
- Git

### Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd clickengineA
```

2. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start with Docker Compose**
```bash
docker-compose up -d
```

4. **Access the application**
- Frontend: http://localhost (port 80)
- Backend API: http://localhost/api/v1
- Direct Backend: http://localhost:3001

### Development Setup

**Frontend Development**
```bash
cd frontend
npm install
npm start
# Development server at http://localhost:3000
# Or run on custom port: PORT=9999 npm start
```

**Backend Development**
```bash
cd backend
npm install
npm run dev
# API runs at http://localhost:3001
```

## 🏗️ Project Structure

```
clickengineA/
├── frontend/                    # React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Layout/        # Header, Sidebar
│   │   │   ├── CampaignForm.tsx
│   │   │   └── FunnelTemplateBuilder.tsx
│   │   ├── pages/             # Application pages
│   │   │   ├── Dashboard.tsx  # Main dashboard
│   │   │   ├── Campaigns.tsx  # Campaign management
│   │   │   ├── Channels.tsx   # Channel analytics
│   │   │   ├── FunnelAnalysisV2Router.tsx      # Funnel routing
│   │   │   ├── FunnelAnalysisV2Dashboard.tsx   # Funnel management
│   │   │   └── FunnelAnalysisV2Builder.tsx     # Funnel creation/editing
│   │   ├── services/          # API and data services
│   │   └── types/             # TypeScript definitions
│   └── package.json
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API endpoints
│   │   └── middleware/        # Custom middleware
│   └── package.json
├── database/                   # Database scripts
│   └── init/                  # Initialization SQL
├── nginx/                      # Proxy configuration
├── docker-compose.yml         # Container orchestration
├── DEVELOPER_GUIDE.md         # Comprehensive dev docs
└── README.md                  # This file
```

## 📊 Core Features in Detail

### Dashboard Analytics
```typescript
// 8 Key metrics with time filtering
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
```

### Campaign Management
```typescript
// CAC Calculation Logic
const calculateCAC = (campaign: Campaign): number | null => {
  const totalSpend = campaign.total_spend || 0;
  const paidUsers = campaign.paid_users || 0;
  return paidUsers > 0 ? totalSpend / paidUsers : null;
};
```

### Advanced Funnel Analysis V2
```typescript
// Comprehensive funnel step configuration
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

// Real-time step performance tracking
interface StepPerformance {
  stepId: string;
  users: number;
  conversionRate: number;
  avgTimeToNext: string | null;
  dropOffCount: number;
}
```

## 🆕 Latest Features & Improvements

### Funnel Analysis V2 Enhancements
- **✅ Fixed Form Data Persistence**: Resolved issue where funnel names showed as "untitled funnel" after editing
- **✅ Real-time Input Feedback**: Live form validation with immediate visual feedback
- **✅ Dual State Management**: Synchronizes form state with component state for consistent UX
- **✅ Multi-step Wizard**: Guided creation process with Basic Info → Steps Configuration → Review & Save
- **✅ Step Template Library**: 17+ pre-built templates organized by category:
  - **Marketing & Ads**: Ad clicks, page views, blog engagement
  - **User Actions**: Sign up, login, email verification, onboarding
  - **Business Events**: Trial start, feature usage, pricing views, purchases
  - **Engagement**: Content downloads, newsletter signups, webinar registrations, contact forms
- **✅ Advanced Step Configuration**: Custom GA4 events, UTM templates, ad tracking parameters
- **✅ Drag & Drop Reordering**: Intuitive step sequence management
- **✅ Copy & Clone Functionality**: Duplicate existing funnels with automatic naming

### Technical Improvements
- **Form Architecture**: Fixed conditional rendering issues that prevented data access
- **Type Safety**: Complete TypeScript interfaces for all funnel components
- **Performance**: Optimized re-renders with proper state management
- **User Experience**: Seamless navigation between wizard steps with data persistence

## 🔧 Available Scripts

### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Lint code
npm run type-check # TypeScript checking
```

### Backend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build TypeScript
npm run start      # Start production server
npm test           # Run tests
```

### Docker Commands
```bash
docker-compose up -d        # Start all services
docker-compose down         # Stop all services
docker-compose logs -f      # View logs
docker-compose restart      # Restart services
```

## 🎨 UI/UX Design

### Design Principles
- **Clean & Professional**: Business-appropriate interface
- **Data-First**: Information density with clarity
- **Responsive**: Works on desktop, tablet, and mobile
- **Consistent**: Unified design language throughout

### Color System
- **Primary**: #1890ff (Blue)
- **Success**: #52c41a (Green)
- **Warning**: #faad14 (Orange)
- **Error**: #ff4d4f (Red)

### Component Library
- Ant Design 5.x for professional UI components
- Custom components for specialized features
- Responsive grid system with breakpoints

## 🚀 Performance

### Optimizations
- **Code Splitting**: Route-based lazy loading
- **Memoization**: React.memo for expensive components
- **Parallel Fetching**: Promise.all for multiple API calls
- **Caching**: 15-minute data cache for frequently accessed data

### Metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 90+

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm test                    # Run all tests
npm test -- --coverage      # With coverage
npm test -- --watchAll      # Watch mode

# Backend tests
cd backend
npm test                    # Run all tests
npm run test:integration    # Integration tests
```

## 📚 Documentation

- **[Developer Guide](./DEVELOPER_GUIDE.md)** - Comprehensive development documentation
- **[API Documentation](./docs/API.md)** - API endpoints and data models
- **[Component Library](./docs/COMPONENTS.md)** - UI component documentation

## 🔌 API Endpoints

### Core Endpoints
```
GET    /api/v1/campaigns       # List campaigns
POST   /api/v1/campaigns       # Create campaign
GET    /api/v1/campaigns/:id   # Get campaign details
PUT    /api/v1/campaigns/:id   # Update campaign
DELETE /api/v1/campaigns/:id   # Delete campaign

GET    /api/v1/channels        # List channels
POST   /api/v1/channels        # Create channel
PUT    /api/v1/channels/:id    # Update channel

GET    /api/v1/analytics/dashboard     # Dashboard metrics
GET    /api/v1/funnels/:id/analyze     # Funnel analysis

# Frontend Routes (Client-side)
/dashboard                          # Main analytics dashboard
/campaigns                          # Campaign management
/channels                           # Channel analytics
/funnel-analysis-v2                 # Funnel Analysis V2 dashboard
/funnel-analysis-v2/create          # Create new funnel
/funnel-analysis-v2/edit/:id        # Edit existing funnel
```

## 🚀 Roadmap

### ✅ Phase 1-4 (Completed)
- Docker infrastructure setup
- Dashboard with 8 key metrics and time filtering
- Campaign and channel management with CAC analysis
- Advanced Funnel Analysis V2 with multi-step wizard
- Professional UI/UX implementation with Ant Design
- Real-time form validation and data handling
- 17+ funnel step templates with custom configuration
- UTM parameter management and ad tracking

### 🚧 Phase 5 (In Progress)
- Real backend API implementation
- User authentication and session management
- Advanced GA4 integration with real data
- PostgreSQL database integration

### 📅 Phase 6 (Planned)
- Machine learning insights and recommendations
- Predictive analytics and forecasting
- A/B testing framework integration
- Custom dashboard builder with widgets

### 🔮 Future
- Mobile application
- Public API
- Third-party integrations
- White-label support

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Write TypeScript for all new code
- Follow existing code style
- Add tests for new features
- Update documentation as needed

## 🔐 Security

- No sensitive data in frontend code
- Environment variables for configuration
- Input validation and sanitization
- XSS protection with React's built-in escaping

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI library
- [Ant Design](https://ant.design/) - UI components
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Docker](https://www.docker.com/) - Containerization

## 📞 Support

For support, please:
- Check the [Developer Guide](./DEVELOPER_GUIDE.md)
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ by the ClickEngine Team**

*Making marketing analytics accessible and actionable for everyone*