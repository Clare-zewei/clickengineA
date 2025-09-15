import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Button, 
  Space, 
  Typography, 
  Row, 
  Col, 
  Statistic, 
  Progress,
  Table,
  Tag,
  Tooltip,
  Alert,
  Divider
} from 'antd';
import {
  ArrowLeftOutlined,
  TrophyOutlined,
  UserOutlined,
  ClockCircleOutlined,
  FallOutlined,
  EditOutlined,
  CopyOutlined,
  ArrowDownOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { 
  funnelAnalysisV2Service, 
  FunnelV2, 
  FunnelPerformanceData, 
  StepPerformance 
} from '../services/funnelAnalysisV2';

const { Content } = Layout;
const { Title, Text } = Typography;

interface FunnelAnalysisV2DetailsProps {
  funnelId: string;
  onBack?: () => void;
  onEdit?: (funnel: FunnelV2) => void;
  onCopy?: (funnel: FunnelV2) => void;
}

const FunnelAnalysisV2Details: React.FC<FunnelAnalysisV2DetailsProps> = ({ 
  funnelId, 
  onBack,
  onEdit,
  onCopy 
}) => {
  const [funnel, setFunnel] = useState<FunnelV2 | null>(null);
  const [performance, setPerformance] = useState<FunnelPerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [funnelId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [funnelData, performanceData] = await Promise.all([
        funnelAnalysisV2Service.getFunnelById(funnelId),
        funnelAnalysisV2Service.getFunnelPerformance(funnelId)
      ]);

      setFunnel(funnelData);
      setPerformance(performanceData);
    } catch (error) {
      console.error('Error loading funnel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: 'active' | 'testing' | 'paused') => {
    const statusConfig = {
      active: { color: 'green', text: 'Active' },
      testing: { color: 'orange', text: 'Testing' },
      paused: { color: 'default', text: 'Paused' }
    };
    
    const config = statusConfig[status] || statusConfig.paused; // Fallback to paused if status is undefined
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const getConversionRateColor = (rate: number) => {
    if (rate >= 80) return '#52c41a'; // Green
    if (rate >= 60) return '#faad14'; // Orange
    if (rate >= 40) return '#1890ff'; // Blue
    return '#ff4d4f'; // Red
  };

  const stepColumns = [
    {
      title: 'Step',
      dataIndex: 'stepName',
      key: 'stepName',
      render: (_: any, record: StepPerformance & { stepName: string; stepDescription: string }, index: number) => (
        <div>
          <Text strong>
            Step {index + 1}: {record.stepName}
          </Text>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.stepDescription}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'Users',
      dataIndex: 'users',
      key: 'users',
      width: 100,
      render: (users: number) => (
        <Statistic 
          value={users} 
          valueStyle={{ fontSize: '16px' }}
        />
      )
    },
    {
      title: 'Conversion Rate',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 150,
      render: (rate: number) => (
        <div>
          <Progress 
            percent={rate} 
            size="small" 
            strokeColor={getConversionRateColor(rate)}
            format={() => `${rate.toFixed(1)}%`}
          />
        </div>
      )
    },
    {
      title: 'Drop Off',
      dataIndex: 'dropOffCount',
      key: 'dropOffCount',
      width: 100,
      render: (dropOff: number) => (
        <Text type={dropOff > 0 ? 'danger' : 'secondary'}>
          {dropOff > 0 ? `-${dropOff}` : '0'}
        </Text>
      )
    },
    {
      title: 'Avg Time to Next',
      dataIndex: 'avgTimeToNext',
      key: 'avgTimeToNext',
      width: 120,
      render: (time: string | null) => (
        <Text type="secondary">
          {time || 'Final step'}
        </Text>
      )
    }
  ];

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        <Content style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Text>Loading funnel details...</Text>
          </div>
        </Content>
      </Layout>
    );
  }

  if (!funnel) {
    return (
      <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
        <Content style={{ padding: '24px' }}>
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Text type="secondary">Funnel not found</Text>
          </div>
        </Content>
      </Layout>
    );
  }

  // Prepare step data for table
  const stepTableData = funnel.steps.map((step, index) => {
    const stepPerf = performance?.stepPerformance.find(sp => sp.stepId === step.id);
    return {
      key: step.id,
      stepName: step.name,
      stepDescription: step.description,
      stepId: step.id,
      users: stepPerf?.users || 0,
      conversionRate: stepPerf?.conversionRate || 0,
      avgTimeToNext: stepPerf?.avgTimeToNext || null,
      dropOffCount: stepPerf?.dropOffCount || 0
    } as StepPerformance & { stepName: string; stepDescription: string; };
  });

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
            >
              Back to Dashboard
            </Button>
            <Space>
              <Button 
                icon={<EditOutlined />}
                onClick={() => funnel && onEdit?.(funnel)}
              >
                Edit Funnel
              </Button>
              <Button 
                icon={<CopyOutlined />}
                onClick={() => funnel && onCopy?.(funnel)}
              >
                Copy Funnel
              </Button>
            </Space>
          </Space>
        </div>

        {/* Funnel Header */}
        <Card style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div>
              <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                {funnel.name}
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                {funnel.description}
              </Text>
              <div style={{ marginTop: 16 }}>
                <Space size="large">
                  <div>
                    <Text type="secondary">Status: </Text>
                    {getStatusTag(funnel.status)}
                  </div>
                  <div>
                    <Text type="secondary">Target Goal: </Text>
                    <Text strong>{funnel.targetGoal.count} conversions per {funnel.targetGoal.period}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Steps: </Text>
                    <Text strong>{funnel.steps.length}</Text>
                  </div>
                  <div>
                    <Text type="secondary">Last Updated: </Text>
                    <Text>{new Date(funnel.updatedAt).toLocaleString()}</Text>
                  </div>
                </Space>
              </div>
            </div>
          </div>
        </Card>

        {/* Performance Summary */}
        {performance && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Users"
                  value={performance.totalUsers}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {performance.period.replace('_', ' ')}
                </Text>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Conversions"
                  value={performance.totalConversions}
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Target: {funnel.targetGoal.count}
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Conversion Rate"
                  value={performance.conversionRate}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: performance.conversionRate >= 5 ? '#52c41a' : '#ff4d4f' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Data Updated"
                  value={new Date(performance.lastUpdated).toLocaleDateString()}
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ fontSize: '16px', color: '#666' }}
                />
              </Card>
            </Col>
          </Row>
        )}

        {/* Biggest Drop Off Alert */}
        {performance?.biggestDropOff && (
          <Alert
            message="Biggest Drop-Off Point Identified"
            description={
              <div>
                <Text strong>{performance.biggestDropOff.usersLost} users</Text> ({performance.biggestDropOff.dropOffRate.toFixed(1)}%) 
                dropped off between <Text strong>{performance.biggestDropOff.fromStep}</Text> and <Text strong>{performance.biggestDropOff.toStep}</Text>
              </div>
            }
            type="warning"
            icon={<FallOutlined />}
            showIcon
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Vertical Flow Design */}
        <Card title="Funnel Performance Flow" style={{ marginBottom: 24 }}>
          <div style={{ padding: '16px 0' }}>
            {funnel.steps.map((step, index) => {
              const stepPerf = performance?.stepPerformance.find(sp => sp.stepId === step.id);
              const users = stepPerf?.users || 0;
              const conversionRate = stepPerf?.conversionRate || 0;
              const dropOffCount = stepPerf?.dropOffCount || 0;
              const avgTime = stepPerf?.avgTimeToNext;
              
              // Determine status color and icon
              let statusColor = '#52c41a'; // Green
              let statusIcon = <CheckCircleOutlined />;
              if (conversionRate < 40) {
                statusColor = '#ff4d4f'; // Red
                statusIcon = <WarningOutlined />;
              } else if (conversionRate < 60) {
                statusColor = '#faad14'; // Yellow
                statusIcon = <WarningOutlined />;
              } else if (conversionRate < 80) {
                statusColor = '#1890ff'; // Blue
                statusIcon = <CheckCircleOutlined />;
              }

              const isLastStep = index === funnel.steps.length - 1;
              const isMajorDropOff = dropOffCount > 0 && (dropOffCount / (users + dropOffCount)) > 0.5;

              return (
                <div key={step.id}>
                  <Card
                    size="small"
                    style={{
                      borderLeft: `4px solid ${statusColor}`,
                      marginBottom: isLastStep ? 0 : 16,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                          <span style={{ color: statusColor, marginRight: 8 }}>{statusIcon}</span>
                          <Title level={5} style={{ margin: 0, flex: 1 }}>
                            Step {index + 1}: {step.name}
                          </Title>
                          {avgTime && (
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              <ClockCircleOutlined /> {avgTime}
                            </Text>
                          )}
                        </div>
                        
                        <Row gutter={16} style={{ marginBottom: 12 }}>
                          <Col span={8}>
                            <Statistic
                              title="Users"
                              value={users}
                              prefix={<UserOutlined />}
                              valueStyle={{ fontSize: '16px' }}
                            />
                          </Col>
                          <Col span={8}>
                            <Statistic
                              title="Conversion Rate"
                              value={conversionRate}
                              suffix="%"
                              valueStyle={{ fontSize: '16px', color: statusColor }}
                            />
                          </Col>
                          <Col span={8}>
                            <div>
                              <Text type="secondary" style={{ fontSize: '12px' }}>From Previous</Text>
                              <div style={{ fontSize: '16px', fontWeight: 500 }}>
                                {index === 0 ? '100.0%' : `${conversionRate.toFixed(1)}%`} of total
                              </div>
                            </div>
                          </Col>
                        </Row>

                        <Row gutter={16}>
                          <Col span={12}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Event: </Text>
                            <Tag color="blue">{step.ga4EventName}</Tag>
                          </Col>
                          <Col span={12}>
                            <Text type="secondary" style={{ fontSize: '12px' }}>Action: </Text>
                            <Tag>{step.teamTurboAction}</Tag>
                          </Col>
                        </Row>

                        {dropOffCount > 0 && (
                          <div style={{ marginTop: 12, padding: '8px 12px', backgroundColor: '#fff2f0', borderRadius: 6 }}>
                            <Text type="danger" style={{ fontSize: '12px' }}>
                              📉 Drop-off: {dropOffCount} users ({((dropOffCount / (users + dropOffCount)) * 100).toFixed(1)}%)
                              {isMajorDropOff && <span style={{ marginLeft: 8 }}>🚨 Major Drop-off</span>}
                            </Text>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {!isLastStep && (
                    <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0' }}>
                      <ArrowDownOutlined style={{ fontSize: '20px', color: '#d9d9d9' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Funnel Configuration */}
        <Card title="Funnel Configuration">
          <Row gutter={24}>
            {funnel.steps.map((step, index) => (
              <Col xs={24} lg={12} key={step.id} style={{ marginBottom: 16 }}>
                <Card 
                  size="small" 
                  title={`Step ${index + 1}: ${step.name}`}
                  extra={
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      {step.ga4EventName}
                    </Text>
                  }
                >
                  <div style={{ marginBottom: 12 }}>
                    <Text type="secondary">{step.description}</Text>
                  </div>

                  <Divider style={{ margin: '12px 0' }} />

                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div>
                      <Text strong style={{ fontSize: '12px' }}>TeamTurbo Action:</Text>
                      <div>
                        <Tag>{step.teamTurboAction}</Tag>
                      </div>
                    </div>

                    <div>
                      <Text strong style={{ fontSize: '12px' }}>Event Parameters:</Text>
                      <div>
                        {step.eventParameters.map(param => (
                          <Tag key={param} color="blue">
                            {param}
                          </Tag>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Text strong style={{ fontSize: '12px' }}>UTM Template:</Text>
                      <div style={{ 
                        fontSize: '11px', 
                        fontFamily: 'monospace',
                        backgroundColor: '#f5f5f5',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginTop: '4px'
                      }}>
                        campaign={step.utmTemplate.campaign}<br />
                        source={step.utmTemplate.source}<br />
                        medium={step.utmTemplate.medium}
                      </div>
                    </div>

                    {step.notes && (
                      <div>
                        <Text strong style={{ fontSize: '12px' }}>Notes:</Text>
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {step.notes}
                          </Text>
                        </div>
                      </div>
                    )}
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      </Content>
    </Layout>
  );
};

export default FunnelAnalysisV2Details;