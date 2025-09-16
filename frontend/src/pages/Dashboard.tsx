import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Alert, Button, Divider, DatePicker, Select, Table } from 'antd';
import { 
  UserOutlined, 
  EyeOutlined, 
  LinkOutlined, 
  RiseOutlined,
  DollarOutlined,
  TeamOutlined,
  TrophyOutlined,
  HeartOutlined,
  ReloadOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  SettingOutlined,
  LoginOutlined,
  CrownOutlined,
  PercentageOutlined,
  WalletOutlined,
  BankOutlined,
  ShoppingCartOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { DashboardStats } from '../types';
import { api } from '../services/api';
import { mockDataService, RevenueMetrics, formatCurrency, formatChange } from '../services/mockData'; // Keep mock for some data
import { DASHBOARD_CONFIG, METRIC_FLAGS, LAYOUT_CONFIG } from '../config/dashboardConfig';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Define time range options
const TIME_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month', 
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  ALL_TIME: 'all_time',
  CUSTOM: 'custom'
};

// Helper function to get date range for API calls
const getDateRange = (timeRange: string, customRange?: any) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  
  switch (timeRange) {
    case TIME_RANGES.TODAY:
      return { startDate: today, endDate: now };
    case TIME_RANGES.YESTERDAY:
      return { startDate: yesterday, endDate: today };
    case TIME_RANGES.THIS_WEEK:
      const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
      return { startDate: weekStart, endDate: now };
    case TIME_RANGES.THIS_MONTH:
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return { startDate: monthStart, endDate: now };
    case TIME_RANGES.LAST_30_DAYS:
      const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
      return { startDate: thirtyDaysAgo, endDate: now };
    case TIME_RANGES.LAST_90_DAYS:
      const ninetyDaysAgo = new Date(now.getTime() - (90 * 24 * 60 * 60 * 1000));
      return { startDate: ninetyDaysAgo, endDate: now };
    case TIME_RANGES.CUSTOM:
      return customRange ? { 
        startDate: new Date(customRange[0]), 
        endDate: new Date(customRange[1]) 
      } : { startDate: today, endDate: now };
    default: // ALL_TIME
      return null; // No date filter
  }
};

interface DayOverDayComparison {
  current: number;
  previous: number;
  change: number;           // Percentage change
  changeDirection: 'up' | 'down' | 'neutral';
}

interface NewDashboardMetrics {
  entryUsers: number;          // GA4: unique user IDs
  freeTrialUsers: number;      // User Management System: trial users
  paidUsers: number;           // PAUSED: no payment model yet
  conversionRate: number;      // Calculated: trial users / entry users
  totalROI: number;           // PAUSED: no revenue data
  monthlyRevenue: number;     // PAUSED: pricing strategy not determined
  totalRevenue: number;       // PAUSED: pricing strategy not determined
  cac: number;                // Calculated: channel actual spend / trial users
  // Additional metrics for future implementation
  activeUsers: number;        // Future: engagement tracking
  trialRetention: number;     // Future: retention analysis
  
  // Day-over-day comparisons (only for today/yesterday views)
  entryUsersComparison?: DayOverDayComparison;
  freeTrialUsersComparison?: DayOverDayComparison;
  conversionRateComparison?: DayOverDayComparison;
  cacComparison?: DayOverDayComparison;
}

// Component for rendering day-over-day comparison
const ComparisonIndicator: React.FC<{ comparison: DayOverDayComparison }> = ({ comparison }) => {
  const { change, changeDirection } = comparison;
  const isPositive = changeDirection === 'up';
  const isNegative = changeDirection === 'down';
  
  if (changeDirection === 'neutral') return null;
  
  return (
    <div style={{ 
      fontSize: '11px', 
      color: isPositive ? '#52c41a' : isNegative ? '#ff4d4f' : '#666',
      marginTop: 4,
      display: 'flex',
      alignItems: 'center'
    }}>
      {isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
      <span style={{ marginLeft: 2 }}>
        {Math.abs(change)}% vs yesterday
      </span>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(null);
  const [newMetrics, setNewMetrics] = useState<NewDashboardMetrics | null>(null);
  const [topChannels, setTopChannels] = useState<any[]>([]);
  const [timeRange, setTimeRange] = useState(TIME_RANGES.THIS_MONTH);
  const [customDateRange, setCustomDateRange] = useState<any>(null);
  const [realChannelSpend, setRealChannelSpend] = useState<number>(0);

  const fetchNewMetrics = useCallback(async () => {
    try {
      // Get date range for API calls
      const dateRange = getDateRange(timeRange, customDateRange);
      
      // Real data sources for core metrics with time filtering:
      // - Entry Users: GA4 API with date range filter
      // - Free Trial Users: User Management System API with date range filter
      // - Conversion Rate: Calculated (trial users / entry users)
      // - CAC: Calculated (channel actual spend / trial users)
      
      // TODO: Replace with actual API calls
      // Example API calls with date filtering:
      // const entryUsersData = await ga4API.getUniqueUsers(dateRange);
      // const trialUsersData = await userManagementAPI.getTrialUsers(dateRange);
      
      // Mock data with realistic time-based variations
      const getMetricByTimeRange = (baseValue: number, timeMultiplier: number = 1) => {
        switch (timeRange) {
          case TIME_RANGES.TODAY:
            return Math.floor(baseValue * 0.03 * timeMultiplier); // ~3% of monthly
          case TIME_RANGES.YESTERDAY:
            return Math.floor(baseValue * 0.032 * timeMultiplier); // Slightly higher than today
          case TIME_RANGES.THIS_WEEK:
            return Math.floor(baseValue * 0.23 * timeMultiplier); // ~23% of monthly
          case TIME_RANGES.THIS_MONTH:
            return Math.floor(baseValue * timeMultiplier);
          case TIME_RANGES.LAST_30_DAYS:
            return Math.floor(baseValue * 1.1 * timeMultiplier); // Slightly higher
          case TIME_RANGES.LAST_90_DAYS:
            return Math.floor(baseValue * 2.8 * timeMultiplier);
          case TIME_RANGES.ALL_TIME:
            return Math.floor(baseValue * 6.8 * timeMultiplier);
          default:
            return Math.floor(baseValue * timeMultiplier);
        }
      };
      
      const baseEntryUsers = 12540; // Monthly base
      const baseTrialUsers = 1254;  // Monthly base
      
      const mockNewMetrics: NewDashboardMetrics = {
        entryUsers: getMetricByTimeRange(baseEntryUsers), // GA4: unique user count with time filter
        freeTrialUsers: getMetricByTimeRange(baseTrialUsers), // User Management System: trial user count with time filter
        paidUsers: getMetricByTimeRange(456), // PAUSED: no payment model yet
        conversionRate: 0, // Calculated: trial users / entry users * 100
        totalROI: 125.3, // PAUSED: no revenue data
        monthlyRevenue: 42850, // PAUSED: pricing strategy not determined
        totalRevenue: 42850, // PAUSED: pricing strategy not determined
        cac: 0, // Calculated: channel actual spend / trial users
        // Additional metrics for future use
        activeUsers: getMetricByTimeRange(1047),
        trialRetention: 65.2
      };

      // Core metric calculations using real data
      // Trial Conversion Rate = (Free Trial Users / Entry Users) * 100
      mockNewMetrics.conversionRate = mockNewMetrics.entryUsers > 0 ? 
        (mockNewMetrics.freeTrialUsers / mockNewMetrics.entryUsers * 100) : 0;
      
      // CAC = Total Channel Actual Spend / Free Trial Users
      // Use real channel spend data if available, otherwise calculate proportionally
      const totalChannelSpend = realChannelSpend > 0 ? 
        realChannelSpend : getMetricByTimeRange(93970, 1);
      mockNewMetrics.cac = mockNewMetrics.freeTrialUsers > 0 ? 
        totalChannelSpend / mockNewMetrics.freeTrialUsers : 0;

      // Add day-over-day comparisons for today/yesterday views
      if (timeRange === TIME_RANGES.TODAY || timeRange === TIME_RANGES.YESTERDAY) {
        const calculateComparison = (current: number, previous: number): DayOverDayComparison => {
          const change = previous > 0 ? ((current - previous) / previous) * 100 : 0;
          return {
            current,
            previous,
            change: Math.round(change * 100) / 100, // Round to 2 decimal places
            changeDirection: change > 1 ? 'up' : change < -1 ? 'down' : 'neutral'
          };
        };

        // Mock previous day data (in real implementation, fetch from APIs)
        const previousEntryUsers = timeRange === TIME_RANGES.TODAY ? 
          getMetricByTimeRange(baseEntryUsers) * 1.05 : // Yesterday's data for today comparison
          getMetricByTimeRange(baseEntryUsers) * 0.95;  // Day before yesterday for yesterday comparison
        
        const previousTrialUsers = timeRange === TIME_RANGES.TODAY ?
          getMetricByTimeRange(baseTrialUsers) * 1.02 :
          getMetricByTimeRange(baseTrialUsers) * 0.98;

        mockNewMetrics.entryUsersComparison = calculateComparison(
          mockNewMetrics.entryUsers, 
          Math.floor(previousEntryUsers)
        );
        
        mockNewMetrics.freeTrialUsersComparison = calculateComparison(
          mockNewMetrics.freeTrialUsers,
          Math.floor(previousTrialUsers)
        );

        const previousConversionRate = previousEntryUsers > 0 ? 
          (previousTrialUsers / previousEntryUsers * 100) : 0;
        mockNewMetrics.conversionRateComparison = calculateComparison(
          mockNewMetrics.conversionRate,
          previousConversionRate
        );

        const previousCAC = previousTrialUsers > 0 ? 
          (getMetricByTimeRange(93970, 1) * 1.03) / previousTrialUsers : 0;
        mockNewMetrics.cacComparison = calculateComparison(
          mockNewMetrics.cac,
          previousCAC
        );
      }

      setNewMetrics(mockNewMetrics);
    } catch (err: any) {
      console.error('Failed to fetch new metrics:', err);
    }
  }, [timeRange, customDateRange, realChannelSpend]);

  useEffect(() => {
    fetchDashboardData();
    fetchRevenueMetrics();
    fetchNewMetrics();
    fetchTopChannels();
  }, [fetchNewMetrics]);

  useEffect(() => {
    fetchNewMetrics();
  }, [fetchNewMetrics, timeRange, customDateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get real data from campaigns and channels
      const [campaignResponse, channelResponse] = await Promise.all([
        api.campaigns.getAll(),
        api.channels.getAll()
      ]);
      
      const campaigns = campaignResponse.data.data || [];
      const channels = channelResponse.data.data || [];
      
      // Calculate real metrics from actual data
      const activeCampaigns = campaigns.filter((c: any) => c.status === 'active');
      const totalBudget = campaigns.reduce((sum: number, c: any) => sum + (c.budget || 0), 0);
      const totalSpend = campaigns.reduce((sum: number, c: any) => sum + (c.actual_ad_spend || 0), 0);
      const totalPaidUsers = campaigns.reduce((sum: number, c: any) => sum + (c.paid_users || 0), 0);
      
      // Store real channel spend for CAC calculation
      setRealChannelSpend(totalSpend);
      
      const realStats: DashboardStats = {
        totalEvents: totalSpend, // Use total spend as "events" for now
        uniqueUsers: totalPaidUsers,
        uniqueSessions: activeCampaigns.length,
        conversionRate: totalBudget > 0 ? (totalSpend / totalBudget) * 100 : 0,
        topCampaigns: [], // Remove top campaigns
        eventsByType: [
          { event_type: 'active_campaigns', count: activeCampaigns.length },
          { event_type: 'total_channels', count: channels.filter((c: any) => c.is_active).length },
          { event_type: 'total_budget', count: totalBudget },
          { event_type: 'total_spend', count: totalSpend },
        ],
      };
      
      setStats(realStats);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenueMetrics = async () => {
    try {
      const metrics = await mockDataService.getRevenueMetrics();
      setRevenueMetrics(metrics);
    } catch (err: any) {
      console.error('Failed to fetch revenue metrics:', err);
    }
  };


  const fetchTopChannels = async () => {
    try {
      const channels = await mockDataService.getTopChannels(5);
      setTopChannels(channels);
    } catch (err: any) {
      console.error('Failed to fetch top channels:', err);
    }
  };

  const handleRefreshRevenue = async () => {
    setRevenueLoading(true);
    try {
      await mockDataService.refreshData('Revenue Metrics');
      await fetchRevenueMetrics();
    } catch (err: any) {
      console.error('Failed to refresh revenue data:', err);
    } finally {
      setRevenueLoading(false);
    }
  };



  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!stats) return null;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Dashboard</Title>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span>Time Range:</span>
          <Select 
            value={timeRange} 
            onChange={setTimeRange}
            style={{ width: 150 }}
          >
            <Option value={TIME_RANGES.TODAY}>Today</Option>
            <Option value={TIME_RANGES.YESTERDAY}>Yesterday</Option>
            <Option value={TIME_RANGES.THIS_WEEK}>This Week</Option>
            <Option value={TIME_RANGES.THIS_MONTH}>This Month</Option>
            <Option value={TIME_RANGES.LAST_30_DAYS}>Last 30 Days</Option>
            <Option value={TIME_RANGES.LAST_90_DAYS}>Last 90 Days</Option>
            <Option value={TIME_RANGES.ALL_TIME}>All Time</Option>
            <Option value={TIME_RANGES.CUSTOM}>Custom Range</Option>
          </Select>
          {timeRange === TIME_RANGES.CUSTOM && (
            <RangePicker onChange={setCustomDateRange} />
          )}
        </div>
      </div>
      
      {/* Key Performance Metrics - Pre-Revenue Phase */}
      <Title level={4} style={{ marginBottom: 16, color: '#1890ff' }}>Key Performance Metrics</Title>
      {newMetrics && (
        <>
          <Row gutter={16} className="dashboard-stats pre-revenue-phase" style={{ marginBottom: 16 }}>
            {METRIC_FLAGS.ENTRY_USERS && (
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Entry Users"
                    value={newMetrics.entryUsers}
                    prefix={<LoginOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                    formatter={(value) => (
                      <span>
                        {Number(value).toLocaleString()}
                        <span style={{ fontSize: '10px', color: '#999', marginLeft: 4 }}>
                          {timeRange !== TIME_RANGES.ALL_TIME ? '(GA4)' : ''}
                        </span>
                      </span>
                    )}
                  />
                  {newMetrics.entryUsersComparison && (
                    <ComparisonIndicator comparison={newMetrics.entryUsersComparison} />
                  )}
                </Card>
              </Col>
            )}
            {METRIC_FLAGS.FREE_TRIAL_USERS && (
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Free Trial Users"
                    value={newMetrics.freeTrialUsers}
                    prefix={<UserOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                    formatter={(value) => Number(value).toLocaleString()}
                  />
                  {newMetrics.freeTrialUsersComparison && (
                    <ComparisonIndicator comparison={newMetrics.freeTrialUsersComparison} />
                  )}
                </Card>
              </Col>
            )}
            {METRIC_FLAGS.CONVERSION_RATE && (
              <Col span={6}>
                <Card>
                  <Statistic
                    title="Trial Conversion Rate"
                    value={newMetrics.conversionRate}
                    prefix={<PercentageOutlined />}
                    suffix="%"
                    precision={2}
                    valueStyle={{ color: '#722ed1' }}
                  />
                  {newMetrics.conversionRateComparison ? (
                    <ComparisonIndicator comparison={newMetrics.conversionRateComparison} />
                  ) : (
                    <div style={{ fontSize: '11px', color: '#666', marginTop: 4 }}>
                      Entry → Trial Users
                    </div>
                  )}
                </Card>
              </Col>
            )}
            {METRIC_FLAGS.CAC && (
              <Col span={6}>
                <Card>
                  <Statistic
                    title="CAC (Marketing Cost)"
                    value={newMetrics.cac}
                    prefix={<ShoppingCartOutlined />}
                    formatter={(value) => `$${Number(value).toFixed(2)}`}
                    valueStyle={{ color: newMetrics.cac < 100 ? '#52c41a' : newMetrics.cac < 200 ? '#faad14' : '#ff4d4f' }}
                  />
                  {newMetrics.cacComparison ? (
                    <ComparisonIndicator comparison={newMetrics.cacComparison} />
                  ) : (
                    <div style={{ fontSize: '11px', color: '#666', marginTop: 4 }}>
                      Per Trial User
                    </div>
                  )}
                </Card>
              </Col>
            )}
          </Row>
        </>
      )}

      {/* Revenue Metrics Section - Hidden in Pre-Revenue Phase */}
      {LAYOUT_CONFIG.showRevenueSection && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <Title level={4} style={{ margin: 0, color: '#52c41a' }}>Revenue Metrics</Title>
            <Button 
              type="text" 
              icon={<ReloadOutlined />}
              loading={revenueLoading}
              onClick={handleRefreshRevenue}
              style={{ marginLeft: 16 }}
            >
              Refresh
            </Button>
          </div>
          <Row gutter={16} className="dashboard-revenue-stats" style={{ marginBottom: 32 }}>
            {/* Revenue metrics content - hidden in pre-revenue phase */}
          </Row>
        </>
      )}

      <Divider />


      {/* Ranking Tables */}
      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title="Top Channels by Investment" 
            className="dashboard-table"
            extra={
              <Link to="/channels">
                <Button type="link" size="small">View All Channels</Button>
              </Link>
            }
          >
            {topChannels.length > 0 ? (
              <Table
                dataSource={topChannels.map((channel, index) => ({
                  key: channel.id,
                  rank: index + 1,
                  channel: channel.name,
                  totalInvestment: channel.total_investment,
                  activeCampaigns: channel.active_campaigns,
                  budgetUtilization: channel.budget_utilization_percent,
                  paidUsers: channel.paidUsers,
                  cac: channel.cac
                }))}
                columns={[
                  {
                    title: 'Rank',
                    dataIndex: 'rank',
                    key: 'rank',
                    width: 60,
                    render: (rank: number) => (
                      <div style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        backgroundColor: rank <= 3 ? '#1890ff' : '#f0f0f0',
                        color: rank <= 3 ? 'white' : '#666',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {rank}
                      </div>
                    )
                  },
                  {
                    title: 'Channel',
                    dataIndex: 'channel',
                    key: 'channel',
                    render: (text: string) => <strong>{text}</strong>
                  },
                  {
                    title: 'Total Investment',
                    dataIndex: 'totalInvestment',
                    key: 'totalInvestment',
                    render: (amount: number) => `$${amount.toLocaleString()}`,
                    sorter: (a, b) => a.totalInvestment - b.totalInvestment,
                    sortOrder: 'descend',
                    defaultSortOrder: 'descend'
                  },
                  {
                    title: 'Active Campaigns',
                    dataIndex: 'activeCampaigns',
                    key: 'activeCampaigns',
                    width: 120,
                    render: (count: number) => (
                      <span style={{ color: count > 0 ? '#1890ff' : '#999' }}>
                        {count}
                      </span>
                    )
                  },
                  {
                    title: 'Budget Utilization',
                    dataIndex: 'budgetUtilization',
                    key: 'budgetUtilization',
                    render: (percent: number) => {
                      const color = percent > 90 ? '#ff4d4f' : percent > 70 ? '#faad14' : '#52c41a';
                      return (
                        <span style={{ color }}>
                          {percent.toFixed(1)}%
                        </span>
                      );
                    }
                  },
                  {
                    title: 'Paid Users',
                    dataIndex: 'paidUsers',
                    key: 'paidUsers',
                    render: (users: number) => users.toLocaleString()
                  },
                  {
                    title: 'CAC',
                    dataIndex: 'cac',
                    key: 'cac',
                    render: (cac: number | null) => {
                      if (cac === null || cac === undefined) {
                        return <span style={{ color: '#999' }}>--</span>;
                      }
                      const color = cac < 100 ? '#52c41a' : cac < 150 ? '#faad14' : '#ff4d4f';
                      return (
                        <span style={{ color }}>
                          ${cac.toFixed(2)}
                        </span>
                      );
                    }
                  }
                ]}
                pagination={false}
                size="small"
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>No channels with investment data</div>
                <div style={{ fontSize: '14px', marginBottom: '16px' }}>
                  Create channels and campaigns to see rankings here
                </div>
                <Link to="/channels">
                  <Button type="primary">Create Your First Channel</Button>
                </Link>
              </div>
            )}
          </Card>
        </Col>
      </Row>

    </div>
  );
};

export default Dashboard;