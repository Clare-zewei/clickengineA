# Click Engine Technical Documentation

## System Overview

Click Engine is a marketing analytics platform designed to track and optimize marketing funnel performance across multiple channels. The system provides real-time insights into user acquisition costs (CAC), conversion rates, and channel performance metrics.

## Architecture

### Technology Stack

#### Frontend
- **Framework**: React 18.2.0 with TypeScript 4.9.5
- **UI Library**: Ant Design 5.12.8
- **Routing**: React Router DOM 6.8.1
- **Charts**: Recharts 2.8.0 & Ant Design Charts 2.6.4
- **HTTP Client**: Axios 1.6.2
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Development Port**: 9999

#### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Cache**: Redis
- **ORM/Query Builder**: Custom database service layer
- **API Port**: 3001

### Project Structure

```
clickengine/
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── Layout/       # Header, Sidebar components
│   │   │   ├── CampaignForm.tsx
│   │   │   ├── ChannelForm.tsx
│   │   │   └── FunnelAnalysisV2/
│   │   ├── pages/            # Route pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Campaigns.tsx
│   │   │   ├── Channels.tsx
│   │   │   ├── Integrations.tsx
│   │   │   └── FunnelAnalysisV2*/
│   │   ├── services/         # API and data services
│   │   │   ├── api.ts        # API client configuration
│   │   │   ├── mockData.ts   # Mock data service
│   │   │   └── funnelAnalysisV2.ts
│   │   ├── types/            # TypeScript type definitions
│   │   ├── config/           # Configuration files
│   │   │   └── dashboardConfig.ts
│   │   └── App.tsx           # Root application component
│   └── package.json          # Frontend dependencies
│
└── backend/
    ├── src/
    │   ├── controllers/      # Request handlers
    │   ├── routes/           # API route definitions
    │   │   ├── index.ts
    │   │   ├── channels.routes.ts
    │   │   ├── campaigns.routes.ts
    │   │   └── keywords.routes.ts
    │   ├── services/         # Business logic layer
    │   │   ├── database.ts   # PostgreSQL connection
    │   │   └── redis.ts      # Redis connection
    │   ├── middleware/       # Express middleware
    │   │   ├── auth.ts
    │   │   ├── errorHandler.ts
    │   │   └── requestLogger.ts
    │   ├── utils/           # Utility functions
    │   │   └── logger.ts
    │   └── index.ts         # Server entry point
    ├── migrations/          # Database migrations
    └── package.json        # Backend dependencies
```

## Data Flow Architecture

### Current State (With Mock Data)

```
User Interface (React)
        ↓
    API Service Layer (api.ts)
        ↓
    [Branch Decision]
        ├─→ Mock Data Service (mockData.ts) - Dashboard metrics
        └─→ Backend API (Express) - Channels, Campaigns
                ↓
            PostgreSQL Database
```

### Target State (With Real Integrations)

```
User Interface (React)
        ↓
    API Service Layer (api.ts)
        ↓
    Backend API (Express)
        ↓
    [Data Aggregation Layer]
        ├─→ PostgreSQL (Internal data)
        ├─→ GA4 API (Entry Users, Traffic data)
        ├─→ User Management System API (Trial users, Conversions)
        └─→ Ad Platform APIs (Spend data)
                ↓
            Calculated Metrics
            - CAC = Total Spend / Trial Users
            - Conversion Rate = Trial Users / Entry Users
```

## Core Data Models

### Channel
```typescript
interface Channel {
  id: number;
  name: string;
  type: string;
  description?: string;
  platform?: string;
  cost_per_click?: number;
  is_active: boolean;
  custom_type?: string;
  channel_category: string;
  created_at: Date;
  updated_at: Date;
}
```

### Campaign
```typescript
interface Campaign {
  id: number;
  name: string;
  channel_id: number;
  status: 'active' | 'paused' | 'completed';
  budget?: number;
  total_spend?: number;
  start_date?: Date;
  end_date?: Date;
  primary_goal?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  created_at: Date;
  updated_at: Date;
}
```

### Dashboard Metrics
```typescript
interface DashboardMetrics {
  entryUsers: number;        // From GA4
  freeTrialUsers: number;    // From User Management System
  conversionRate: number;    // Calculated: (freeTrialUsers / entryUsers) * 100
  cac: number;              // Calculated: totalSpend / freeTrialUsers
  activeUsers: number;      // From User Management System
  trialRetention: number;   // From User Management System
  
  // Comparison data for time ranges
  comparison?: {
    current: number;
    previous: number;
    change: number;
    changeDirection: 'up' | 'down' | 'neutral';
  }
}
```

## API Endpoints

### Base URL
```
Development: http://localhost:3001/api/v1
Production: [YOUR_DOMAIN]/api/v1
```

### Channels API
```
GET    /channels                 # List all channels
GET    /channels/:id             # Get single channel
POST   /channels                 # Create channel
PUT    /channels/:id             # Update channel
DELETE /channels/:id             # Delete channel

Query Parameters:
- include_analytics=true         # Include performance metrics
- is_active=true                # Filter by status
```

### Campaigns API
```
GET    /campaigns                # List all campaigns
GET    /campaigns/:id            # Get single campaign
POST   /campaigns                # Create campaign
PUT    /campaigns/:id            # Update campaign
DELETE /campaigns/:id            # Delete campaign
GET    /campaigns/goals          # Get campaign goal options

Query Parameters:
- search=string                  # Search by name
- status=active|paused|completed # Filter by status
- channel_id=number             # Filter by channel
- primary_goal=string           # Filter by goal
```

### Dashboard API (To be implemented)
```
GET    /dashboard/metrics        # Get dashboard metrics
Query Parameters:
- timeRange=today|yesterday|this_week|last_week|this_month|last_month
- compareWith=previous_period   # For comparison data
```

## Frontend Components

### Key Pages

#### Dashboard (`/dashboard`)
- Displays key performance metrics in cards
- Time range selector for data filtering
- Day-over-day comparison indicators
- Top performing channels ranking
- Currently uses `mockDataService` for metrics

#### Channels (`/channels`)
- CRUD operations for marketing channels
- Performance metrics per channel
- Budget utilization tracking
- Connected to real backend API

#### Campaigns (`/campaigns`)
- Campaign management interface
- UTM parameter configuration
- Budget and spend tracking
- Connected to real backend API

#### Integrations (`/integrations`)
- Shows integration status for external services
- Configuration interface for API connections
- Health monitoring for data sources

## Configuration

### Frontend Configuration

#### API Configuration (`frontend/src/services/api.ts`)
```typescript
const getApiBaseUrl = (): string => {
  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const currentPort = url.port;
  
  if (currentPort === '3000' || currentPort === '9999') {
    return 'http://localhost:3001/api/v1';
  }
  
  return `${url.protocol}//${url.hostname}:3001/api/v1`;
};
```

#### Proxy Configuration (`frontend/package.json`)
```json
{
  "proxy": "http://localhost:3001"
}
```

### Backend Configuration

#### CORS Setup (`backend/src/index.ts`)
```typescript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:9999',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true
}));
```

#### Environment Variables (`backend/.env`)
```bash
# Server
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clickengine
DB_USER=your_user
DB_PASSWORD=your_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:9999

# External APIs (Future Integration)
GA4_PROPERTY_ID=your_ga4_property_id
GA4_API_KEY=your_ga4_api_key
USER_SYSTEM_API_URL=your_user_system_url
USER_SYSTEM_API_KEY=your_api_key
```

## Development Setup

### Prerequisites
- Node.js 16+ 
- PostgreSQL 12+
- Redis 6+
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone [repository_url]
cd clickengine
```

2. **Setup Backend**
```bash
cd backend
npm install

# Create database
createdb clickengine

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run migrations
npm run migrate

# Start development server
npm run dev
```

3. **Setup Frontend**
```bash
cd frontend
npm install

# Start development server
PORT=9999 npm start
```

4. **Verify Installation**
- Frontend: http://localhost:9999
- Backend Health Check: http://localhost:3001/health
- API Test: `curl http://localhost:3001/api/v1/channels`

## Data Integration Guide

### Integrating GA4 for Entry Users

1. **Install GA4 Data API Client**
```bash
cd backend
npm install @google-analytics/data
```

2. **Create GA4 Service** (`backend/src/services/ga4Service.ts`)
```typescript
import { BetaAnalyticsDataClient } from '@google-analytics/data';

export class GA4Service {
  private client: BetaAnalyticsDataClient;
  
  constructor() {
    this.client = new BetaAnalyticsDataClient({
      keyFilename: 'path/to/service-account-key.json'
    });
  }
  
  async getEntryUsers(startDate: string, endDate: string) {
    const [response] = await this.client.runReport({
      property: `properties/${process.env.GA4_PROPERTY_ID}`,
      dateRanges: [{ startDate, endDate }],
      metrics: [{ name: 'activeUsers' }],
      dimensions: [{ name: 'sessionSource' }]
    });
    
    return this.processGA4Response(response);
  }
}
```

3. **Update Dashboard Controller**
```typescript
export const getDashboardMetrics = async (req, res) => {
  const { timeRange } = req.query;
  
  // Get entry users from GA4
  const entryUsers = await ga4Service.getEntryUsers(
    getStartDate(timeRange),
    getEndDate(timeRange)
  );
  
  // Get trial users from User Management System
  const trialUsers = await userSystemService.getTrialUsers(timeRange);
  
  // Calculate metrics
  const metrics = {
    entryUsers,
    freeTrialUsers: trialUsers,
    conversionRate: (trialUsers / entryUsers) * 100,
    cac: calculateCAC(timeRange)
  };
  
  res.json({ success: true, data: metrics });
};
```

### Integrating User Management System

1. **Create User System Service** (`backend/src/services/userSystemService.ts`)
```typescript
export class UserSystemService {
  private apiUrl = process.env.USER_SYSTEM_API_URL;
  private apiKey = process.env.USER_SYSTEM_API_KEY;
  
  async getTrialUsers(timeRange: string) {
    const response = await axios.get(`${this.apiUrl}/users`, {
      headers: { 'X-API-Key': this.apiKey },
      params: {
        type: 'trial',
        created_after: getStartDate(timeRange),
        created_before: getEndDate(timeRange)
      }
    });
    
    return response.data.count;
  }
  
  async getUsersByUTM(utmParams: UTMParams) {
    const response = await axios.get(`${this.apiUrl}/users/by-utm`, {
      headers: { 'X-API-Key': this.apiKey },
      params: utmParams
    });
    
    return response.data;
  }
}
```

### CAC Calculation Implementation

```typescript
export const calculateCAC = async (timeRange: string) => {
  // Get total spend from all active channels
  const channels = await db.query(`
    SELECT SUM(c.total_spend) as total_spend
    FROM campaigns c
    JOIN channels ch ON c.channel_id = ch.id
    WHERE ch.is_active = true
    AND c.start_date >= $1
    AND c.start_date <= $2
  `, [getStartDate(timeRange), getEndDate(timeRange)]);
  
  const totalSpend = channels.rows[0].total_spend || 0;
  
  // Get trial users count
  const trialUsers = await userSystemService.getTrialUsers(timeRange);
  
  // Calculate CAC
  return trialUsers > 0 ? totalSpend / trialUsers : 0;
};
```

## Testing

### API Testing
```bash
# Test channels endpoint
curl http://localhost:3001/api/v1/channels

# Create a channel
curl -X POST http://localhost:3001/api/v1/channels \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Channel","type":"test","description":"Testing"}'

# Update a channel
curl -X PUT http://localhost:3001/api/v1/channels/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Channel"}'

# Delete a channel
curl -X DELETE http://localhost:3001/api/v1/channels/1
```

### Frontend Testing
```bash
cd frontend
npm test                    # Run tests
npm run test:coverage      # With coverage
```

### End-to-End Testing Flow
1. Start both frontend and backend
2. Navigate to http://localhost:9999
3. Test CRUD operations in Channels page
4. Test CRUD operations in Campaigns page
5. Verify Dashboard displays mock data
6. Check browser console for API calls

## Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
# Output in build/ directory
```

#### Backend
```bash
cd backend
npm run build
# Output in dist/ directory
```

### Docker Deployment

#### Frontend Dockerfile
```dockerfile
FROM node:16-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

#### Backend Dockerfile
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
  
  postgres:
    image: postgres:14
    environment:
      - POSTGRES_DB=clickengine
      - POSTGRES_USER=admin
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

## Monitoring & Logging

### Logging Strategy
- **Backend**: Winston logger with daily rotation
- **Frontend**: Browser console with environment-based levels
- **API Requests**: Morgan middleware for HTTP logging

### Monitoring Endpoints
```
GET /health              # Basic health check
GET /api/v1/status      # Detailed system status
GET /api/v1/metrics     # Prometheus-compatible metrics
```

## Security Considerations

### API Security
- CORS configuration for allowed origins
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention via parameterized queries

### Authentication (To be implemented)
```typescript
// Proposed JWT authentication flow
POST   /api/v1/auth/login     # Login with credentials
POST   /api/v1/auth/refresh   # Refresh access token
POST   /api/v1/auth/logout    # Invalidate tokens

// Protected route middleware
app.use('/api/v1/dashboard', authenticateToken);
```

### Environment Security
- Never commit `.env` files
- Use secrets management in production
- Rotate API keys regularly
- Use HTTPS in production

## Troubleshooting

### Common Issues

1. **Proxy Error: ECONNREFUSED**
   - Ensure backend is running on port 3001
   - Check `package.json` proxy configuration
   - Restart frontend after proxy changes

2. **CORS Errors**
   - Verify frontend URL in backend CORS configuration
   - Check if credentials are included in requests

3. **Database Connection Failed**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

4. **Module Not Found Errors**
   - Run `npm install` in both frontend and backend
   - Clear node_modules and reinstall if persistent

### Debug Mode
```bash
# Backend with debug logging
DEBUG=* npm run dev

# Frontend with verbose output
REACT_APP_DEBUG=true npm start
```

## Future Enhancements

### Planned Features
1. **Real-time Analytics Dashboard**
   - WebSocket connections for live updates
   - Server-sent events for metric changes

2. **Advanced Attribution Models**
   - Multi-touch attribution
   - Time-decay models
   - Custom attribution rules

3. **Automated Reporting**
   - Scheduled email reports
   - PDF export functionality
   - Custom report builder

4. **Machine Learning Integration**
   - Predictive CAC modeling
   - Conversion rate optimization
   - Anomaly detection

5. **Multi-tenancy Support**
   - Organization management
   - User roles and permissions
   - Data isolation

## Support & Contributing

### Getting Help
- Check this documentation first
- Review existing issues in the repository
- Contact the development team

### Contributing Guidelines
1. Fork the repository
2. Create a feature branch
3. Follow existing code style
4. Add tests for new features
5. Update documentation
6. Submit pull request

## License

[Your License Here]

---

Last Updated: September 2025
Version: 1.0.0