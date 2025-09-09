import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography, Spin, Alert, Button, Divider } from 'antd';
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
  SettingOutlined
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import { mockDataService, RevenueMetrics, FunnelTemplate, formatCurrency, formatChange } from '../services/mockData';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [revenueLoading, setRevenueLoading] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [revenueMetrics, setRevenueMetrics] = useState<RevenueMetrics | null>(null);
  const [funnelTemplates, setFunnelTemplates] = useState<FunnelTemplate[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchRevenueMetrics();
    fetchFunnelTemplates();
  }, []);

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
      <Title level={2} style={{ marginBottom: 24 }}>Dashboard</Title>
      
      {/* Marketing Metrics */}
      <Title level={4} style={{ marginBottom: 16, color: '#1890ff' }}>Marketing Metrics</Title>
      <Row gutter={16} className="dashboard-stats" style={{ marginBottom: 32 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Events"
              value={stats.totalEvents}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Unique Users"
              value={stats.uniqueUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Unique Sessions"
              value={stats.uniqueSessions}
              prefix={<LinkOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Conversion Rate"
              value={stats.conversionRate}
              prefix={<RiseOutlined />}
              suffix="%"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

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

      {/* Charts */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Top Campaigns" className="dashboard-chart">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.topCampaigns}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="events" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Events by Type" className="dashboard-chart">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.eventsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ event_type, percent }) => `${event_type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.eventsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;