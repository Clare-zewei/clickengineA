import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Space, 
  Divider,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
  Alert,
  Progress,
  Tag,
  Tooltip,
  Timeline,
  Badge
} from 'antd';
import { 
  ArrowLeftOutlined,
  UserOutlined,
  FunnelPlotOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  BarChartOutlined,
  ArrowRightOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { mockDataService, FunnelTemplate } from '../services/mockData';

const { Title, Text, Paragraph } = Typography;

interface FunnelStepAnalysis {
  stepNumber: number;
  stepName: string;
  eventName: string;
  ga4EventId?: string;
  description?: string;
  users: number;
  conversionRate: number;
  dropOffRate: number;
  fromPrevious: number;
  ofTotal: number;
  cumulativeDropOff: number;
  avgTimeToNext?: number;
  status: 'excellent' | 'good' | 'attention' | 'critical';
}

interface FunnelAnalysisData {
  funnelId: string;
  funnelName: string;
  template?: FunnelTemplate;
  totalEntryUsers: number;
  finalConversions: number;
  overallConversionRate: number;
  avgCompletionTime: number;
  medianCompletionTime: number;
  steps: FunnelStepAnalysis[];
  keyBottlenecks: FunnelStepAnalysis[];
  recommendations: {
    type: 'critical' | 'attention' | 'optimization';
    step: string;
    issue: string;
    recommendation: string;
    potentialImpact: string;
  }[];
}

const FunnelDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [funnelData, setFunnelData] = useState<FunnelAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchFunnelAnalysis();
    }
  }, [id]);

  const fetchFunnelAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data - in real implementation, this would fetch from GA4
      const mockData: FunnelAnalysisData = {
        funnelId: id!,
        funnelName: 'Trial to Paid Conversion',
        totalEntryUsers: 1000,
        finalConversions: 14,
        overallConversionRate: 1.4,
        avgCompletionTime: 7.2,
        medianCompletionTime: 3.5,
        steps: [
          {
            stepNumber: 1,
            stepName: 'Ad Click',
            eventName: 'ad_click',
            ga4EventId: 'campaign_click',
            description: 'User clicks on marketing ad',
            users: 1000,
            conversionRate: 100,
            dropOffRate: 0,
            fromPrevious: 100,
            ofTotal: 100,
            cumulativeDropOff: 0,
            avgTimeToNext: 0.1,
            status: 'excellent'
          },
          {
            stepNumber: 2,
            stepName: 'Landing Page View',
            eventName: 'page_view',
            ga4EventId: 'landing_page_view',
            description: 'User views landing page',
            users: 850,
            conversionRate: 85,
            dropOffRate: 15,
            fromPrevious: 85,
            ofTotal: 85,
            cumulativeDropOff: 15,
            avgTimeToNext: 2.5,
            status: 'good'
          },
          {
            stepNumber: 3,
            stepName: 'User Registration',
            eventName: 'sign_up',
            ga4EventId: 'user_registration_complete',
            description: 'User completes registration form',
            users: 170,
            conversionRate: 20,
            dropOffRate: 68,
            fromPrevious: 20,
            ofTotal: 17,
            cumulativeDropOff: 83,
            avgTimeToNext: 15,
            status: 'critical'
          },
          {
            stepNumber: 4,
            stepName: 'First Login',
            eventName: 'login',
            ga4EventId: 'user_first_login',
            description: 'User logs in for first time',
            users: 136,
            conversionRate: 80,
            dropOffRate: 20,
            fromPrevious: 80,
            ofTotal: 13.6,
            cumulativeDropOff: 86.4,
            avgTimeToNext: 24,
            status: 'good'
          },
          {
            stepNumber: 5,
            stepName: 'Trial Start',
            eventName: 'trial_start',
            ga4EventId: 'trial_activation',
            description: 'User activates trial period',
            users: 95,
            conversionRate: 70,
            dropOffRate: 30,
            fromPrevious: 70,
            ofTotal: 9.5,
            cumulativeDropOff: 90.5,
            avgTimeToNext: 72,
            status: 'attention'
          },
          {
            stepNumber: 6,
            stepName: 'Pricing View',
            eventName: 'pricing_page_view',
            ga4EventId: 'pricing_page_engagement',
            description: 'User views pricing information',
            users: 47,
            conversionRate: 49,
            dropOffRate: 51,
            fromPrevious: 49,
            ofTotal: 4.7,
            cumulativeDropOff: 95.3,
            avgTimeToNext: 48,
            status: 'attention'
          },
          {
            stepNumber: 7,
            stepName: 'Payment Completed',
            eventName: 'purchase',
            ga4EventId: 'payment_successful',
            description: 'User completes payment process',
            users: 14,
            conversionRate: 30,
            dropOffRate: 70,
            fromPrevious: 30,
            ofTotal: 1.4,
            cumulativeDropOff: 98.6,
            status: 'critical'
          }
        ],
        keyBottlenecks: [],
        recommendations: [
          {
            type: 'critical',
            step: 'User Registration',
            issue: '68% drop-off rate (680 users lost)',
            recommendation: 'Simplify registration form, add social login options',
            potentialImpact: '+15% conversion if improved to industry average'
          },
          {
            type: 'attention',
            step: 'Payment Completed',
            issue: '70% drop-off at final step (33 users lost)',
            recommendation: 'Add payment security badges, improve checkout UX',
            potentialImpact: '+8% overall conversion if improved'
          },
          {
            type: 'attention',
            step: 'Pricing View',
            issue: '51% drop-off at pricing stage',
            recommendation: 'Add customer testimonials, clarify value proposition',
            potentialImpact: '+5% conversion improvement'
          }
        ]
      };

      // Calculate key bottlenecks
      mockData.keyBottlenecks = mockData.steps.filter(step => step.dropOffRate >= 50);
      
      setFunnelData(mockData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch funnel analysis');
    } finally {
      setLoading(false);
    }
  };

  const getStepStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return '#52c41a';
      case 'good': return '#1890ff';
      case 'attention': return '#faad14';
      case 'critical': return '#ff4d4f';
      default: return '#d9d9d9';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'good': return <CheckCircleOutlined style={{ color: '#1890ff' }} />;
      case 'attention': return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'critical': return <WarningOutlined style={{ color: '#ff4d4f' }} />;
      default: return <CheckCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const formatTime = (hours: number): string => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    if (hours < 24) return `${hours.toFixed(1)}h`;
    return `${Math.round(hours / 24)} days`;
  };

  const renderFunnelVisualization = () => {
    if (!funnelData) return null;

    return (
      <Card title={
        <Space>
          <FunnelPlotOutlined />
          Step-by-Step User Journey Analysis
        </Space>
      } style={{ marginBottom: 24 }}>
        <div style={{ overflowX: 'auto' }}>
          {funnelData.steps.map((step, index) => (
            <div key={step.stepNumber} style={{ marginBottom: 16 }}>
              <Row gutter={16} align="middle">
                <Col span={1}>
                  <div style={{ textAlign: 'center' }}>
                    {getStepStatusIcon(step.status)}
                  </div>
                </Col>
                
                <Col span={6}>
                  <Card size="small" style={{ 
                    borderLeft: `4px solid ${getStepStatusColor(step.status)}`,
                    backgroundColor: '#fafafa'
                  }}>
                    <div>
                      <Text strong style={{ fontSize: 14 }}>
                        Step {step.stepNumber}: {step.stepName}
                      </Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        Event: {step.eventName}
                      </Text>
                      {step.ga4EventId && (
                        <>
                          <br />
                          <Text type="secondary" style={{ fontSize: 10 }}>
                            GA4: {step.ga4EventId}
                          </Text>
                        </>
                      )}
                    </div>
                  </Card>
                </Col>

                <Col span={4}>
                  <Statistic
                    title="Users"
                    value={step.users}
                    valueStyle={{ 
                      fontSize: 18,
                      color: step.users < 100 ? '#ff4d4f' : step.users < 500 ? '#faad14' : '#52c41a'
                    }}
                    prefix={<UserOutlined />}
                  />
                </Col>

                <Col span={5}>
                  <div>
                    <Text strong style={{ fontSize: 16, color: getStepStatusColor(step.status) }}>
                      {step.fromPrevious.toFixed(1)}%
                    </Text>
                    <Text type="secondary" style={{ display: 'block', fontSize: 11 }}>
                      From previous step
                    </Text>
                    <Text type="secondary" style={{ fontSize: 10 }}>
                      {step.ofTotal.toFixed(1)}% of total funnel
                    </Text>
                  </div>
                </Col>

                <Col span={4}>
                  {step.dropOffRate > 0 && (
                    <div style={{ textAlign: 'center' }}>
                      <Text style={{ 
                        fontSize: 14, 
                        color: step.dropOffRate >= 50 ? '#ff4d4f' : step.dropOffRate >= 30 ? '#faad14' : '#52c41a' 
                      }}>
                        -{step.dropOffRate.toFixed(1)}%
                      </Text>
                      <Text type="secondary" style={{ display: 'block', fontSize: 10 }}>
                        Drop-off rate
                      </Text>
                      <Text type="secondary" style={{ fontSize: 10 }}>
                        ({Math.round((funnelData.steps[index - 1]?.users || step.users) - step.users)} users lost)
                      </Text>
                    </div>
                  )}
                </Col>

                <Col span={4}>
                  {step.avgTimeToNext && (
                    <div style={{ textAlign: 'center' }}>
                      <Text style={{ fontSize: 13 }}>
                        <ClockCircleOutlined style={{ marginRight: 4 }} />
                        {formatTime(step.avgTimeToNext)}
                      </Text>
                      <Text type="secondary" style={{ display: 'block', fontSize: 10 }}>
                        Avg. time to next
                      </Text>
                    </div>
                  )}
                </Col>
              </Row>

              {index < funnelData.steps.length - 1 && (
                <div style={{ textAlign: 'center', margin: '8px 0' }}>
                  <ArrowDownOutlined style={{ 
                    fontSize: 16, 
                    color: step.dropOffRate >= 50 ? '#ff4d4f' : '#1890ff' 
                  }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderBottleneckAnalysis = () => {
    if (!funnelData || funnelData.keyBottlenecks.length === 0) return null;

    return (
      <Card 
        title={
          <Space>
            <WarningOutlined style={{ color: '#faad14' }} />
            Key Bottlenecks Analysis
          </Space>
        } 
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          {funnelData.keyBottlenecks.map((bottleneck, index) => (
            <Col span={8} key={bottleneck.stepNumber}>
              <Card size="small" style={{ 
                borderLeft: '4px solid #ff4d4f',
                backgroundColor: '#fff2f0'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <Title level={4} style={{ color: '#ff4d4f', margin: 0 }}>
                    {bottleneck.dropOffRate.toFixed(1)}%
                  </Title>
                  <Text strong>Drop-off at {bottleneck.stepName}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {Math.round((funnelData.steps[bottleneck.stepNumber - 2]?.users || bottleneck.users) - bottleneck.users)} users lost
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    );
  };

  const renderActionableInsights = () => {
    if (!funnelData || funnelData.recommendations.length === 0) return null;

    return (
      <Card 
        title={
          <Space>
            <TrophyOutlined style={{ color: '#52c41a' }} />
            Actionable Insights & Recommendations
          </Space>
        } 
        style={{ marginBottom: 24 }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {funnelData.recommendations.map((rec, index) => (
            <Alert
              key={index}
              type={rec.type === 'critical' ? 'error' : rec.type === 'attention' ? 'warning' : 'info'}
              showIcon
              message={
                <div>
                  <Text strong>{rec.type === 'critical' ? '🔴' : rec.type === 'attention' ? '🟡' : '💡'} {rec.step}</Text>
                </div>
              }
              description={
                <div style={{ marginTop: 8 }}>
                  <Paragraph style={{ margin: 0, marginBottom: 8 }}>
                    <Text strong>Issue:</Text> {rec.issue}
                  </Paragraph>
                  <Paragraph style={{ margin: 0, marginBottom: 8 }}>
                    <Text strong>Recommendation:</Text> {rec.recommendation}
                  </Paragraph>
                  <Paragraph style={{ margin: 0 }}>
                    <Text strong>Potential Impact:</Text> <Text style={{ color: '#52c41a' }}>{rec.potentialImpact}</Text>
                  </Paragraph>
                </div>
              }
            />
          ))}
        </Space>
      </Card>
    );
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!funnelData) return <Alert message="Funnel not found" type="warning" showIcon />;

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/funnel-analysis')}
            style={{ marginRight: 16 }}
          >
            Back to Funnel Analysis
          </Button>
          <Title level={2} style={{ display: 'inline', margin: 0 }}>
            {funnelData.funnelName}
          </Title>
        </Col>
        <Col>
          <Button type="primary" icon={<BarChartOutlined />}>
            Export Report
          </Button>
        </Col>
      </Row>

      {/* Overview Metrics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Entry Users"
              value={funnelData.totalEntryUsers}
              valueStyle={{ color: '#1890ff' }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Final Conversions"
              value={funnelData.finalConversions}
              valueStyle={{ color: '#52c41a' }}
              prefix={<TrophyOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Success Rate"
              value={funnelData.overallConversionRate}
              precision={1}
              suffix="%"
              valueStyle={{ 
                color: funnelData.overallConversionRate >= 5 ? '#52c41a' : 
                       funnelData.overallConversionRate >= 2 ? '#faad14' : '#ff4d4f'
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Avg. Completion Time"
              value={`${funnelData.avgCompletionTime} days`}
              valueStyle={{ color: '#fa541c' }}
              prefix={<ClockCircleOutlined />}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Median: {funnelData.medianCompletionTime} days
            </Text>
          </Card>
        </Col>
      </Row>

      {renderFunnelVisualization()}
      {renderBottleneckAnalysis()}
      {renderActionableInsights()}

      {/* Time Analysis */}
      <Card title="Time Analysis Deep Dive" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Completion Time Distribution</Text>
              <div style={{ marginTop: 8 }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Fastest 25% (&lt; 2 hours):</Text>
                    <Tag color="green">High LTV users</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Median (3.5 days):</Text>
                    <Tag color="blue">Typical journey</Tag>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text>Slowest 25% (&gt; 10 days):</Text>
                    <Tag color="orange">Require nurturing</Tag>
                  </div>
                </Space>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <Alert
              type="info"
              showIcon
              message="Optimal Conversion Window"
              description={
                <div>
                  <Text>Users converting within 24-48 hours typically have:</Text>
                  <ul style={{ marginTop: 8, marginBottom: 0 }}>
                    <li>Higher lifetime value</li>
                    <li>Better product engagement</li>
                    <li>Lower churn rates</li>
                  </ul>
                </div>
              }
            />
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default FunnelDetails;