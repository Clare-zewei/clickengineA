# Click Engine - Marketing Analytics System

Click Engine is a comprehensive marketing analytics system designed to optimize marketing investments and improve conversion effectiveness through data-driven decision making.

## 🚀 Phase 1 Features ✅

- **Docker Compose Environment**: Complete containerized setup with all services
- **Database Infrastructure**: PostgreSQL with core marketing analytics tables
- **RESTful API**: Node.js/Express backend with comprehensive endpoints
- **React Frontend**: TypeScript-based dashboard with routing and UI components
- **Nginx Proxy**: Reverse proxy configuration for seamless integration

## 🎯 Phase 2 Features ✅

- **Enhanced Campaign Management**: Comprehensive CRUD operations with advanced tracking
- **Budget Tracking**: Real-time budget utilization with spending analysis
- **Data Validation**: Robust form validation with friendly error messages
- **Advanced Filtering**: Search, filter by channel, goal, and status
- **Responsive Design**: Mobile-friendly interface with card and list views
- **Campaign Details**: Dedicated campaign detail pages with full analytics

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Ant Design
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL 15 with optimized schemas
- **Cache**: Redis for session management
- **Proxy**: Nginx for routing and load balancing
- **Containerization**: Docker Compose for orchestration

## 📊 Core Data Models

### Marketing Channels
- Basic channel information (Google Ads, Facebook, Email, etc.)
- Cost tracking and status management

### Campaigns (Enhanced in Phase 2)
- Advanced campaign management with comprehensive tracking
- Budget allocation, actual spend, and external costs
- Human input requirements and campaign grouping
- UTM parameter management and goal setting
- Budget utilization monitoring with alerts

### User Events
- Comprehensive event tracking (page views, clicks, registrations, conversions)
- UTM parameter capture
- Device and browser information
- Custom metadata support

### Conversion Funnels
- Multi-step funnel definitions
- Conversion rate analytics
- Step-by-step performance tracking

## 🔧 Quick Start

1. **Clone and Setup**:
   ```bash
   git clone <repository-url>
   cd clickengineA
   cp .env.example .env
   ```

2. **Start Services**:
   ```bash
   docker-compose up -d
   ```

3. **Access Applications**:
   - Frontend: http://localhost (port 80)
   - Backend API: http://localhost/api/v1
   - Direct Backend: http://localhost:3001
   - Database: localhost:5432

## 📁 Project Structure

```
clickengineA/
├── docker-compose.yml          # Service orchestration
├── database/
│   └── init/                   # Database initialization scripts
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── services/          # Business logic
│   │   ├── routes/            # API endpoints
│   │   ├── middleware/        # Custom middleware
│   │   └── types/             # TypeScript definitions
│   └── package.json
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API clients
│   │   └── types/             # TypeScript definitions
│   └── package.json
└── nginx/
    └── nginx.conf             # Reverse proxy config
```

## 🔌 API Endpoints

### Channels
- `GET /api/v1/channels` - List marketing channels
- `POST /api/v1/channels` - Create new channel
- `PUT /api/v1/channels/:id` - Update channel
- `DELETE /api/v1/channels/:id` - Delete channel

### Campaigns
- `GET /api/v1/campaigns` - List campaigns
- `POST /api/v1/campaigns` - Create campaign
- `PUT /api/v1/campaigns/:id` - Update campaign
- `DELETE /api/v1/campaigns/:id` - Delete campaign

### Events
- `GET /api/v1/events` - List user events
- `POST /api/v1/events` - Track new event
- `GET /api/v1/events/analytics` - Event analytics

### Funnels
- `GET /api/v1/funnels` - List conversion funnels
- `POST /api/v1/funnels` - Create funnel
- `GET /api/v1/funnels/:id/analytics` - Funnel analytics

## 🛠️ Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Database Access
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U clickengine_user -d clickengine
```

## ✅ Phase 1 Acceptance Criteria

- ✅ Docker Compose environment starts successfully with one command
- ✅ Database table structure created, supports basic CRUD operations
- ✅ Basic API endpoints can be called normally
- ✅ Frontend application accessible and displays basic page structure
- ✅ Logging system works normally

## ✅ Phase 2 Acceptance Criteria

- ✅ Can create, view, edit, delete marketing campaigns with comprehensive tracking
- ✅ Support multiple preset marketing channels (Google Ads, LinkedIn, Facebook, Medium, Custom)
- ✅ Data validation works normally with friendly error messages including:
  - Budget and spending reasonableness checks
  - Date range validation
  - Required field validation  
  - Duplicate campaign name checks
- ✅ Campaign list supports filtering and search functionality
- ✅ Responsive design, mobile-friendly interface
- ✅ Campaign detail pages with budget analysis and utilization tracking

## 🔮 Next Phase Planning

**Phase 3** will focus on:
- Google Analytics 4 integration
- Real-time event processing and tracking
- Advanced conversion funnel analytics
- ROI and performance metrics dashboard
- Automated reporting and alerts

## 🤝 Contributing

This is a phased development project. Current phase focuses on infrastructure and basic functionality. Please ensure all acceptance criteria are met before moving to the next phase.

## 📄 License

Private project for TeamTurbo Marketing Analytics System.