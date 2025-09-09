import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Statistic,
  Space,
  Select,
  DatePicker,
  Button,
  Spin,
  Tabs,
  Alert,
  message
} from 'antd';
import {
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  TrophyOutlined,
  FunnelPlotOutlined,
  SwapOutlined,
  CalendarOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { 
  mockDataService, 
  ConversionFunnel as FunnelType, 
  ChannelFunnel, 
  ConversionTrend,
  FunnelStep
} from '../services/mockData';
import ConversionFunnel from '../components/ConversionFunnel';
import ChannelFunnelComparison from '../components/ChannelFunnelComparison';
import ConversionTrendAnalysis from '../components/ConversionTrendAnalysis';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;

const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('30d');
  const [funnelData, setFunnelData] = useState<FunnelType | null>(null);
  const [channelFunnels, setChannelFunnels] = useState<ChannelFunnel[]>([]);
  const [trendData, setTrendData] = useState<ConversionTrend | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllAnalytics();
  }, [timeRange]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    try {
      const [funnel, channels, trends] = await Promise.all([
        mockDataService.getConversionFunnel(getDateRangeLabel()),
        mockDataService.getChannelFunnels(),
        mockDataService.getConversionTrends()
      ]);
      
      setFunnelData(funnel);
      setChannelFunnels(channels);
      setTrendData(trends);
    } catch (error) {
      message.error('Failed to fetch analytics data');
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRangeLabel = (): string => {
    switch (timeRange) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 90 days';
      default: return 'Last 30 days';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await mockDataService.refreshData('Funnel Analytics');
      await fetchAllAnalytics();
      message.success('Analytics data refreshed successfully');
    } catch (error) {
      message.error('Failed to refresh analytics data');
    } finally {
      setRefreshing(false);
    }
  };

  const handleStepClick = (step: FunnelStep) => {
    message.info(`Analyzing ${step.stepName}: ${step.users.toLocaleString()} users, ${step.conversionRate} conversion rate`);
  };

  const renderOverviewStats = () => {
    if (!funnelData) return null;

    const totalUsers = funnelData.funnelSteps[0].users;
    const finalConversions = funnelData.funnelSteps[funnelData.funnelSteps.length - 1].users;
    const majorDropOffs = funnelData.funnelSteps.filter(step => step.isDropOffPoint).length;

    return (
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Users in Funnel"
              value={totalUsers}
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Final Conversions"
              value={finalConversions}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Overall Conversion Rate"
              value={funnelData.totalConversionRate}
              prefix={<PieChartOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Major Drop-off Points"
              value={majorDropOffs}
              prefix={<FunnelPlotOutlined />}
              valueStyle={{ color: majorDropOffs > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>🔬 Conversion Funnel Analysis</Title>
        <Space>
          <Select value={timeRange} onChange={setTimeRange} style={{ width: 150 }}>
            <Option value="7d">Last 7 days</Option>
            <Option value="30d">Last 30 days</Option>
            <Option value="90d">Last 90 days</Option>
          </Select>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={refreshing}
          >
            Refresh
          </Button>
        </Space>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <Space>
              <FunnelPlotOutlined />
              Overview
            </Space>
          }
          key="overview"
        >
          {renderOverviewStats()}
          {funnelData && (
            <ConversionFunnel 
              funnel={funnelData} 
              onStepClick={handleStepClick}
              showInsights={true}
            />
          )}
        </TabPane>

        <TabPane
          tab={
            <Space>
              <SwapOutlined />
              Channel Comparison
            </Space>
          }
          key="channels"
        >
          {channelFunnels.length > 0 && (
            <ChannelFunnelComparison channelFunnels={channelFunnels} />
          )}
        </TabPane>

        <TabPane
          tab={
            <Space>
              <CalendarOutlined />
              Time Trends
            </Space>
          }
          key="trends"
        >
          {trendData && (
            <ConversionTrendAnalysis trends={trendData} />
          )}
        </TabPane>
      </Tabs>

      {funnelData && funnelData.revenueImpact && (
        <Alert
          style={{ marginTop: 24 }}
          message="💰 Revenue Optimization Opportunity"
          description={
            <div>
              <Text>
                Based on current funnel analysis, there's a potential revenue impact of{' '}
                <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                  ${funnelData.revenueImpact.toLocaleString()}
                </Text>
                {' '}if major drop-off points are optimized to industry averages.
              </Text>
              <div style={{ marginTop: 8 }}>
                <Text type="secondary">
                  Focus areas: {funnelData.funnelSteps
                    .filter(step => step.isDropOffPoint)
                    .map(step => step.stepName)
                    .join(', ')}
                </Text>
              </div>
            </div>
          }
          type="success"
          showIcon
        />
      )}
    </div>
  );
};

export default Analytics;