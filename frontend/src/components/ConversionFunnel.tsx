import React from 'react';
import { Card, Row, Col, Progress, Tag, Alert, Typography, Space, Tooltip } from 'antd';
import {
  WarningOutlined,
  BulbOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { ConversionFunnel as FunnelType, FunnelStep } from '../services/mockData';

const { Text, Title } = Typography;

interface ConversionFunnelProps {
  funnel: FunnelType;
  onStepClick?: (step: FunnelStep) => void;
  showInsights?: boolean;
  compact?: boolean;
}

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({
  funnel,
  onStepClick,
  showInsights = true,
  compact = false
}) => {
  const getStepColor = (dropOffRate: string | undefined): string => {
    if (!dropOffRate) return '#1890ff';
    const rate = parseFloat(dropOffRate);
    if (rate >= 60) return '#ff4d4f';
    if (rate >= 40) return '#faad14';
    return '#52c41a';
  };

  const renderFunnelBar = (step: FunnelStep, index: number, totalSteps: number) => {
    const maxUsers = funnel.funnelSteps[0].users;
    const widthPercent = (step.users / maxUsers) * 100;
    const isLastStep = index === totalSteps - 1;
    
    return (
      <div
        key={step.stepName}
        className="funnel-step"
        style={{
          marginBottom: compact ? 12 : 24,
          cursor: onStepClick ? 'pointer' : 'default'
        }}
        onClick={() => onStepClick && onStepClick(step)}
      >
        <Row align="middle" gutter={16}>
          <Col span={5}>
            <Space direction="vertical" size={0}>
              <Text strong style={{ fontSize: compact ? 12 : 14 }}>
                {step.stepName}
              </Text>
              {step.medianDuration && !compact && (
                <Text type="secondary" style={{ fontSize: 11 }}>
                  <ClockCircleOutlined /> {step.medianDuration}
                </Text>
              )}
            </Space>
          </Col>
          <Col span={14}>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  height: compact ? 32 : 40,
                  background: `linear-gradient(to right, ${getStepColor(step.dropOffRate)} ${widthPercent}%, #f0f0f0 ${widthPercent}%)`,
                  borderRadius: 4,
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 16,
                  boxShadow: step.isDropOffPoint ? '0 0 0 2px #ff4d4f' : 'none',
                  transition: 'all 0.3s'
                }}
              >
                <Space>
                  <Text strong style={{ color: 'white', fontSize: compact ? 12 : 14 }}>
                    {step.users.toLocaleString()} users
                  </Text>
                  <Text style={{ color: 'white', fontSize: compact ? 11 : 12 }}>
                    {step.conversionRate}
                  </Text>
                </Space>
              </div>
              {!isLastStep && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: compact ? 40 : 48,
                    transform: 'translateX(50%)',
                    zIndex: 1
                  }}
                >
                  <Tag
                    color={parseFloat(step.dropOffRate || '0') > 50 ? 'error' : 'default'}
                    style={{ fontSize: 11 }}
                  >
                    <FallOutlined /> {step.dropOffRate} drop
                  </Tag>
                </div>
              )}
            </div>
          </Col>
          <Col span={5}>
            {step.isDropOffPoint && (
              <Tooltip title={step.optimizationSuggestion}>
                <Tag color="error" icon={<WarningOutlined />}>
                  Major Drop-off
                </Tag>
              </Tooltip>
            )}
          </Col>
        </Row>
      </div>
    );
  };

  const renderCompactFunnel = () => {
    const maxUsers = funnel.funnelSteps[0].users;
    
    return (
      <div style={{ padding: '12px 0' }}>
        {funnel.funnelSteps.map((step, index) => {
          const widthPercent = (step.users / maxUsers) * 100;
          const isDropOff = step.isDropOffPoint;
          
          return (
            <div key={step.stepName} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 12 }}>{step.stepName}</Text>
                <Space size={4}>
                  <Text strong style={{ fontSize: 12 }}>{step.users.toLocaleString()}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>({step.conversionRate})</Text>
                  {isDropOff && <WarningOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />}
                </Space>
              </div>
              <Progress
                percent={widthPercent}
                showInfo={false}
                strokeColor={getStepColor(step.dropOffRate)}
                size="small"
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Title level={4} style={{ margin: 0 }}>
              📊 {funnel.dateRange} Conversion Funnel Analysis
            </Title>
            <Tag color={funnel.dataQuality === 'high' ? 'green' : funnel.dataQuality === 'medium' ? 'orange' : 'red'}>
              {funnel.dataQuality} quality data
            </Tag>
          </Space>
          <div>
            <Text strong style={{ fontSize: 18, color: '#1890ff' }}>
              Total Conversion: {funnel.totalConversionRate}
            </Text>
          </div>
        </div>
      }
      style={{ marginBottom: 24 }}
    >
      {compact ? renderCompactFunnel() : (
        <div style={{ padding: '20px 0' }}>
          {funnel.funnelSteps.map((step, index) => 
            renderFunnelBar(step, index, funnel.funnelSteps.length)
          )}
        </div>
      )}

      {showInsights && funnel.insights.length > 0 && (
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f0f0f0' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>
              <BulbOutlined /> Key Insights
            </Text>
            {funnel.insights.map((insight, index) => (
              <Alert
                key={index}
                message={insight}
                type={insight.includes('abnormally') || insight.includes('needs improvement') ? 'warning' : 'info'}
                showIcon
                style={{ marginBottom: 8 }}
              />
            ))}
            {funnel.revenueImpact && (
              <Alert
                message={
                  <Space>
                    <RiseOutlined />
                    <Text strong>Revenue Impact Opportunity:</Text>
                    <Text style={{ color: '#52c41a', fontSize: 16 }}>
                      +${funnel.revenueImpact.toLocaleString()}
                    </Text>
                  </Space>
                }
                type="success"
                showIcon={false}
              />
            )}
          </Space>
        </div>
      )}
    </Card>
  );
};

export default ConversionFunnel;