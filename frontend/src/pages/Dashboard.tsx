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
  FunnelPlotOutlined,
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
import { mockDataService, RevenueMetrics, FunnelTemplate, formatCurrency, formatChange } from '../services/mockData';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Define time range options
const TIME_RANGES = {
  ALL_TIME: 'all_time',
  THIS_MONTH: 'this_month', 
  LAST_30_DAYS: 'last_30_days',
  LAST_90_DAYS: 'last_90_days',
  CUSTOM: 'custom'
};

interface NewDashboardMetrics {
  entryUsers: number;
  freeTrialUsers: number;
  paidUsers: number;
  conversionRate: number;
  totalROI: number;
  monthlyRevenue: number;
  totalRevenue: number;
  cac: number;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(null);
  const [funnelTemplates, setFunnelTemplates] = useState<FunnelTemplate[]>([]);
  const [newMetrics, setNewMetrics] = useState<NewDashboardMetrics | null>(null);
  const [timeRange, setTimeRange] = useState(TIME_RANGES.THIS_MONTH);
  const [customDateRange, setCustomDateRange] = useState<any>(null);

  const fetchNewMetrics = useCallback(async () => {
    try {
      // Mock data for new metrics based on time range
      // In real implementation, this would call backend API with time range parameters
      const mockNewMetrics: NewDashboardMetrics = {
        entryUsers: timeRange === TIME_RANGES.ALL_TIME ? 85420 : 12540, // Estimated Entry Users
        freeTrialUsers: timeRange === TIME_RANGES.ALL_TIME ? 8542 : 1254,
        paidUsers: timeRange === TIME_RANGES.ALL_TIME ? 3420 : 456,
        conversionRate: 0, // Will be calculated
        totalROI: timeRange === TIME_RANGES.ALL_TIME ? 285.5 : 125.3,
        monthlyRevenue: 42850,
        totalRevenue: timeRange === TIME_RANGES.ALL_TIME ? 512000 : 42850,
        cac: 0 // Will be calculated
      };

      // Calculate derived metrics
      mockNewMetrics.conversionRate = (mockNewMetrics.paidUsers / mockNewMetrics.entryUsers * 100);
      mockNewMetrics.cac = mockNewMetrics.totalRevenue / mockNewMetrics.paidUsers; // Simplified CAC calculation

      setNewMetrics(mockNewMetrics);
    } catch (err: any) {
      console.error('Failed to fetch new metrics:', err);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchDashboardData();
    fetchRevenueMetrics();
    fetchFunnelTemplates();
    fetchNewMetrics();
  }, [fetchNewMetrics]);

  useEffect(() => {
    fetchNewMetrics();
  }, [fetchNewMetrics, timeRange, customDateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, we'll create mock data since the backend doesn't have a specific dashboard endpoint
      const mockStats: DashboardStats = {
        totalEvents: 12540,
        uniqueUsers: 3420,
        uniqueSessions: 8650,
        conversionRate: 3.2,
        topCampaigns: [
          { name: 'PM Software Q4', events: 4230 },
          { name: 'TeamTurbo Launch', events: 3120 },
          { name: 'Organic Search', events: 2890 },
        ],
        eventsByType: [
          { event_type: 'page_view', count: 8540 },
          { event_type: 'click', count: 2340 },
          { event_type: 'registration', count: 1200 },
          { event_type: 'conversion', count: 460 },
        ],
      };
      
      setStats(mockStats);
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

  const fetchFunnelTemplates = async () => {
    try {
      const templates = await mockDataService.getFunnelTemplates();
      setFunnelTemplates(templates);
    } catch (err: any) {
      console.error('Failed to fetch funnel templates:', err);
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

  const getROIColor = (roi: number): string => {
    if (roi >= 5) return '#52c41a'; // Green - High ROI
    if (roi >= 3) return '#faad14'; // Orange - Medium ROI
    return '#ff4d4f'; // Red - Needs optimization
  };

  const renderFunnelTemplateCard = (template: FunnelTemplate) => {
    const roiColor = getROIColor(template.actualROI || template.estimatedROI);
    
    return (
      <Card
        key={template.id}
        hoverable
        style={{ 
          borderColor: roiColor,
          borderWidth: '2px',
          height: '160px'
        }}
        bodyStyle={{ padding: '16px' }}
        onClick={() => {
          // Navigate to analytics with this template selected
          console.log('Clicked template:', template.name);
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Title level={5} style={{ margin: 0, lineHeight: '1.2', fontSize: '14px' }}>
              {template.name}
            </Title>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            {template.steps.length} steps | {template.targetUsers.replace('_', ' ')}
          </div>
        </div>

        <Row gutter={8} style={{ marginBottom: 8 }}>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: roiColor }}>
                {template.actualTotalConversion 
                  ? `${template.actualTotalConversion.toFixed(1)}%` 
                  : `${template.targetTotalConversion?.toFixed(1) || '0'}%`
                }
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>
                {template.actualTotalConversion ? 'Actual' : 'Target'} Conversion
              </div>
              {template.actualTotalConversion && template.targetTotalConversion && (
                <div style={{ fontSize: '9px', color: '#999' }}>
                  Target: {template.targetTotalConversion.toFixed(1)}%
                </div>
              )}
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: roiColor }}>
                {template.actualROI 
                  ? `${template.actualROI.toFixed(1)}x` 
                  : `${template.estimatedROI.toFixed(1)}x`
                }
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>
                {template.actualROI ? 'Actual' : 'Target'} ROI
              </div>
              {template.actualROI && template.estimatedROI && (
                <div style={{ fontSize: '9px', color: '#999' }}>
                  Target: {template.estimatedROI.toFixed(1)}x
                </div>
              )}
            </div>
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                ${template.estimatedCAC}
              </div>
              <div style={{ fontSize: '10px', color: '#666' }}>CAC</div>
            </div>
          </Col>
        </Row>

        {template.performanceMetrics && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#666', marginBottom: 4 }}>
              <span>👥 {template.performanceMetrics.users.toLocaleString()} users</span>
              <span>🎯 {template.performanceMetrics.conversions} conversions</span>
            </div>
            {template.overallPerformanceStatus && (
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '10px' }}>
                <span 
                  style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: 
                      template.overallPerformanceStatus === 'success' ? '#52c41a' :
                      template.overallPerformanceStatus === 'warning' ? '#faad14' :
                      template.overallPerformanceStatus === 'danger' ? '#ff4d4f' : '#d9d9d9',
                    marginRight: '4px'
                  }}
                />
                <span style={{ textTransform: 'capitalize', color: '#666' }}>
                  {template.overallPerformanceStatus === 'success' ? 'On Track' :
                   template.overallPerformanceStatus === 'warning' ? 'Needs Attention' :
                   template.overallPerformanceStatus === 'danger' ? 'Underperforming' : 'Pending Data'}
                </span>
              </div>
            )}
          </div>
        )}
      </Card>
    );
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
            <Option value={TIME_RANGES.ALL_TIME}>All Time</Option>
            <Option value={TIME_RANGES.THIS_MONTH}>This Month</Option>
            <Option value={TIME_RANGES.LAST_30_DAYS}>Last 30 Days</Option>
            <Option value={TIME_RANGES.LAST_90_DAYS}>Last 90 Days</Option>
            <Option value={TIME_RANGES.CUSTOM}>Custom Range</Option>
          </Select>
          {timeRange === TIME_RANGES.CUSTOM && (
            <RangePicker onChange={setCustomDateRange} />
          )}
        </div>
      </div>
      
      {/* New Dashboard Metrics - 8 Cards */}
      <Title level={4} style={{ marginBottom: 16, color: '#1890ff' }}>Key Performance Metrics</Title>
      {newMetrics && (
        <>
          <Row gutter={16} className="dashboard-stats" style={{ marginBottom: 16 }}>
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
                        {timeRange !== TIME_RANGES.ALL_TIME ? '(Estimated)' : ''}
                      </span>
                    </span>
                  )}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Free Trial Users"
                  value={newMetrics.freeTrialUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                  formatter={(value) => Number(value).toLocaleString()}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Paid Users"
                  value={newMetrics.paidUsers}
                  prefix={<CrownOutlined />}
                  valueStyle={{ color: '#faad14' }}
                  formatter={(value) => Number(value).toLocaleString()}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Conversion Rate"
                  value={newMetrics.conversionRate}
                  prefix={<PercentageOutlined />}
                  suffix="%"
                  precision={2}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16} className="dashboard-stats" style={{ marginBottom: 32 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Total ROI"
                  value={newMetrics.totalROI}
                  prefix={<TrophyOutlined />}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: newMetrics.totalROI > 100 ? '#52c41a' : '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Monthly Revenue"
                  value={newMetrics.monthlyRevenue}
                  prefix={<WalletOutlined />}
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title={timeRange === TIME_RANGES.ALL_TIME ? 'Total Revenue' : 'Period Revenue'}
                  value={newMetrics.totalRevenue}
                  prefix={<BankOutlined />}
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="CAC (Customer Acquisition Cost)"
                  value={newMetrics.cac}
                  prefix={<ShoppingCartOutlined />}
                  formatter={(value) => `$${Number(value).toFixed(2)}`}
                  valueStyle={{ color: newMetrics.cac < 100 ? '#52c41a' : newMetrics.cac < 200 ? '#faad14' : '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>
        </>
      )}

      {/* Revenue Metrics */}
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
        {revenueMetrics ? (
          <>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Monthly ROI"
                  value={revenueMetrics.monthlyROI.current}
                  precision={1}
                  prefix={<TrophyOutlined />}
                  suffix="%"
                  valueStyle={{ color: revenueMetrics.monthlyROI.isPositive ? '#3f8600' : '#cf1322' }}
                />
                <div style={{ 
                  fontSize: '12px', 
                  color: revenueMetrics.monthlyROI.isPositive ? '#3f8600' : '#cf1322',
                  marginTop: 4
                }}>
                  {revenueMetrics.monthlyROI.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {formatChange(revenueMetrics.monthlyROI.change, true)} vs last month
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Paid Users"
                  value={revenueMetrics.paidUsers.current}
                  prefix={<TeamOutlined />}
                  valueStyle={{ color: revenueMetrics.paidUsers.isPositive ? '#3f8600' : '#cf1322' }}
                />
                <div style={{ 
                  fontSize: '12px', 
                  color: revenueMetrics.paidUsers.isPositive ? '#3f8600' : '#cf1322',
                  marginTop: 4
                }}>
                  {revenueMetrics.paidUsers.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {formatChange(revenueMetrics.paidUsers.change)} new this month
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Monthly Revenue"
                  value={revenueMetrics.monthlyRevenue.current}
                  prefix={<DollarOutlined />}
                  formatter={(value) => formatCurrency(Number(value))}
                  valueStyle={{ color: revenueMetrics.monthlyRevenue.isPositive ? '#3f8600' : '#cf1322' }}
                />
                <div style={{ 
                  fontSize: '12px', 
                  color: revenueMetrics.monthlyRevenue.isPositive ? '#3f8600' : '#cf1322',
                  marginTop: 4
                }}>
                  {revenueMetrics.monthlyRevenue.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {formatCurrency(revenueMetrics.monthlyRevenue.change)} vs last month
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Average LTV"
                  value={revenueMetrics.averageLTV.current}
                  prefix={<HeartOutlined />}
                  formatter={(value) => formatCurrency(Number(value))}
                  valueStyle={{ color: revenueMetrics.averageLTV.isPositive ? '#3f8600' : '#cf1322' }}
                />
                <div style={{ 
                  fontSize: '12px', 
                  color: revenueMetrics.averageLTV.isPositive ? '#3f8600' : '#cf1322',
                  marginTop: 4
                }}>
                  {revenueMetrics.averageLTV.isPositive ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                  {formatCurrency(revenueMetrics.averageLTV.change)} vs last month
                </div>
              </Card>
            </Col>
          </>
        ) : (
          <Col span={24}>
            <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />
          </Col>
        )}
      </Row>

      <Divider />

      {/* Funnel Templates Performance */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0, color: '#722ed1' }}>
          <FunnelPlotOutlined style={{ marginRight: 8 }} />
          Funnel Templates Performance
        </Title>
        <Link to="/configuration">
          <Button type="primary" icon={<SettingOutlined />}>
            Manage Templates
          </Button>
        </Link>
      </div>
      
      {funnelTemplates.length > 0 ? (
        <Row gutter={16} style={{ marginBottom: 32 }}>
          {funnelTemplates.map(template => (
            <Col span={8} key={template.id}>
              {renderFunnelTemplateCard(template)}
            </Col>
          ))}
        </Row>
      ) : (
        <Card style={{ textAlign: 'center', padding: '40px 20px', marginBottom: 32 }}>
          <FunnelPlotOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} style={{ color: '#999', marginBottom: '8px' }}>No Funnel Templates Created</Title>
          <div style={{ color: '#666', marginBottom: '16px' }}>
            Create funnel templates to analyze and compare different conversion strategies
          </div>
          <Link to="/configuration">
            <Button type="primary" icon={<SettingOutlined />}>
              Create Your First Template
            </Button>
          </Link>
        </Card>
      )}

      <Divider />

      {/* Ranking Tables */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Top Campaigns Ranking Table" className="dashboard-table">
            <Table
              dataSource={[
                {
                  key: '1',
                  campaignName: 'PM Software Q4',
                  conversionRate: 4.2,
                  roi: 285.5,
                  users: 4230,
                  cac: 89.50,
                  budgetUsage: 85.2
                },
                {
                  key: '2', 
                  campaignName: 'TeamTurbo Launch',
                  conversionRate: 3.8,
                  roi: 245.3,
                  users: 3120,
                  cac: 95.20,
                  budgetUsage: 78.5
                },
                {
                  key: '3',
                  campaignName: 'Organic Search',
                  conversionRate: 2.9,
                  roi: 198.7,
                  users: 2890,
                  cac: 72.30,
                  budgetUsage: 0
                },
                {
                  key: '4',
                  campaignName: 'Social Media Ads',
                  conversionRate: 2.1,
                  roi: 156.2,
                  users: 1850,
                  cac: 125.80,
                  budgetUsage: 92.1
                }
              ]}
              columns={[
                {
                  title: 'Campaign Name',
                  dataIndex: 'campaignName',
                  key: 'campaignName',
                  render: (text: string) => <strong>{text}</strong>
                },
                {
                  title: 'Conversion Rate',
                  dataIndex: 'conversionRate',
                  key: 'conversionRate',
                  render: (rate: number) => `${rate}%`,
                  sorter: (a, b) => a.conversionRate - b.conversionRate,
                  sortOrder: 'descend',
                  defaultSortOrder: 'descend'
                },
                {
                  title: 'ROI',
                  dataIndex: 'roi',
                  key: 'roi',
                  render: (roi: number) => (
                    <span style={{ color: roi > 200 ? '#52c41a' : roi > 150 ? '#faad14' : '#ff4d4f' }}>
                      {roi}%
                    </span>
                  )
                },
                {
                  title: 'Users',
                  dataIndex: 'users',
                  key: 'users',
                  render: (users: number) => users.toLocaleString()
                },
                {
                  title: 'CAC',
                  dataIndex: 'cac',
                  key: 'cac',
                  render: (cac: number) => (
                    <span style={{ color: cac < 100 ? '#52c41a' : cac < 150 ? '#faad14' : '#ff4d4f' }}>
                      ${cac.toFixed(2)}
                    </span>
                  )
                },
                {
                  title: 'Budget Usage',
                  dataIndex: 'budgetUsage',
                  key: 'budgetUsage',
                  render: (usage: number) => (
                    <span>
                      {usage === 0 ? 'Organic' : `${usage}%`}
                    </span>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top Channels Ranking Table" className="dashboard-table">
            <Table
              dataSource={[
                {
                  key: '1',
                  channel: 'Google Ads',
                  conversionRate: 3.9,
                  roi: 267.8,
                  users: 5420,
                  cac: 92.30,
                  totalSpent: 15420
                },
                {
                  key: '2',
                  channel: 'Facebook Ads',
                  conversionRate: 3.1,
                  roi: 223.5,
                  users: 3850,
                  cac: 108.50,
                  totalSpent: 12300
                },
                {
                  key: '3',
                  channel: 'LinkedIn Ads',
                  conversionRate: 2.8,
                  roi: 189.2,
                  users: 2100,
                  cac: 145.70,
                  totalSpent: 8950
                },
                {
                  key: '4',
                  channel: 'Organic Search',
                  conversionRate: 2.3,
                  roi: 178.6,
                  users: 6230,
                  cac: 0,
                  totalSpent: 0
                },
                {
                  key: '5',
                  channel: 'Email Marketing',
                  conversionRate: 1.9,
                  roi: 156.3,
                  users: 1890,
                  cac: 45.20,
                  totalSpent: 2850
                }
              ]}
              columns={[
                {
                  title: 'Channel',
                  dataIndex: 'channel',
                  key: 'channel',
                  render: (text: string) => <strong>{text}</strong>
                },
                {
                  title: 'Conversion Rate',
                  dataIndex: 'conversionRate',
                  key: 'conversionRate',
                  render: (rate: number) => `${rate}%`,
                  sorter: (a, b) => a.conversionRate - b.conversionRate,
                  sortOrder: 'descend',
                  defaultSortOrder: 'descend'
                },
                {
                  title: 'ROI',
                  dataIndex: 'roi',
                  key: 'roi',
                  render: (roi: number) => (
                    <span style={{ color: roi > 200 ? '#52c41a' : roi > 150 ? '#faad14' : '#ff4d4f' }}>
                      {roi}%
                    </span>
                  )
                },
                {
                  title: 'Users',
                  dataIndex: 'users',
                  key: 'users',
                  render: (users: number) => users.toLocaleString()
                },
                {
                  title: 'CAC',
                  dataIndex: 'cac',
                  key: 'cac',
                  render: (cac: number) => (
                    <span>
                      {cac === 0 ? 'Free' : (
                        <span style={{ color: cac < 100 ? '#52c41a' : cac < 150 ? '#faad14' : '#ff4d4f' }}>
                          ${cac.toFixed(2)}
                        </span>
                      )}
                    </span>
                  )
                },
                {
                  title: 'Total Spent',
                  dataIndex: 'totalSpent',
                  key: 'totalSpent',
                  render: (spent: number) => (
                    <span>
                      {spent === 0 ? 'Free' : `$${spent.toLocaleString()}`}
                    </span>
                  )
                }
              ]}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;