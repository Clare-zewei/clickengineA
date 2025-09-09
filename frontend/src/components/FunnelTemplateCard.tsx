import React from 'react';
import { Card, Space, Tag, Button, Statistic, Typography, Row, Col, Popconfirm } from 'antd';
import { Link } from 'react-router-dom';
import {
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  TrophyOutlined,
  UserOutlined,
  FunnelPlotOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { FunnelTemplate } from '../services/mockData';

const { Text, Paragraph } = Typography;

interface FunnelTemplateCardProps {
  template: FunnelTemplate;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
  roiColor: string;
}

const FunnelTemplateCard: React.FC<FunnelTemplateCardProps> = ({
  template,
  onEdit,
  onCopy,
  onDelete,
  roiColor
}) => {
  const getBusinessGoalLabel = (goal: string): string => {
    switch (goal) {
      case 'acquisition': return 'Customer Acquisition';
      case 'activation': return 'User Activation';
      case 'upgrade': return 'Paid Upgrade';
      case 'retention': return 'Customer Retention';
      default: return goal;
    }
  };

  const getFunnelComplexity = (stepCount: number): { level: string; color: string } => {
    if (stepCount <= 2) return { level: 'Simple', color: '#52c41a' };
    if (stepCount <= 4) return { level: 'Medium', color: '#faad14' };
    return { level: 'Complex', color: '#ff4d4f' };
  };

  const getEstimatedJourneyTime = (stepCount: number): string => {
    if (stepCount <= 2) return '< 5 minutes';
    if (stepCount <= 4) return '10-30 minutes';
    return '1+ hours';
  };

  const getFunnelTypeFromSteps = (steps: any[]): string => {
    if (steps.length === 1) return 'Single Action';
    if (steps.length === 2) return 'Direct Conversion';
    if (steps.some(s => s.event?.stage === 'trial')) return 'Trial-to-Paid';
    return 'Content Marketing';
  };

  const getTargetUsersLabel = (users: string): string => {
    switch (users) {
      case 'b2b_enterprise': return 'B2B Enterprises';
      case 'individual': return 'Individual Consumers';
      case 'smb': return 'SMBs';
      case 'large_enterprise': return 'Large Enterprises';
      default: return users;
    }
  };

  const renderFunnelFlow = () => {
    const stepNames = template.steps.map(step => step.event.name);
    return stepNames.join(' → ');
  };

  return (
    <Card
      hoverable
      style={{ 
        borderColor: roiColor,
        borderWidth: '2px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      actions={[
        <Link to={`/funnel/${template.id}`} key="view">
          <Button type="text" icon={<EyeOutlined />}>
            View Details
          </Button>
        </Link>,
        <Button
          key="edit"
          type="text"
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          Edit
        </Button>,
        <Button
          key="copy"
          type="text"
          icon={<CopyOutlined />}
          onClick={onCopy}
        >
          Copy
        </Button>,
        <Popconfirm
          key="delete"
          title="Are you sure you want to delete this template?"
          onConfirm={onDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button type="text" icon={<DeleteOutlined />} danger>
            Delete
          </Button>
        </Popconfirm>
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <Text strong style={{ fontSize: 16, lineHeight: '1.2' }}>
            {template.name}
          </Text>
          <Tag color={template.isActive ? 'green' : 'red'}>
            {template.isActive ? 'Active' : 'Inactive'}
          </Tag>
        </div>
        
        <Paragraph 
          ellipsis={{ rows: 2 }} 
          style={{ color: '#666', fontSize: 12, marginBottom: 12 }}
        >
          {template.description}
        </Paragraph>

        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <Text type="secondary" style={{ fontSize: 11 }}>
            <CalendarOutlined /> Updated: {template.updatedAt}
          </Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            Business Flow: {renderFunnelFlow()}
          </Text>
        </Space>
      </div>

      {/* Funnel Performance Expectations */}
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: 8 }}>Funnel Performance Expectations</Text>
        <Row gutter={8}>
          <Col span={12}>
            <div style={{ textAlign: 'center', padding: '8px 0', backgroundColor: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1890ff' }}>
                {(template.actualTotalConversion || template.targetTotalConversion || 0).toFixed(1)}%
              </div>
              <div style={{ fontSize: 10, color: '#666' }}>Target Conv</div>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ textAlign: 'center', padding: '8px 0', backgroundColor: '#fafafa', borderRadius: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 'bold', color: getFunnelComplexity(template.steps.length).color }}>
                {getFunnelComplexity(template.steps.length).level}
              </div>
              <div style={{ fontSize: 10, color: '#666' }}>Complexity</div>
            </div>
          </Col>
        </Row>
      </div>

      {/* User Journey Flow */}
      <div style={{ marginBottom: 12 }}>
        <Text strong style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: 6 }}>User Journey Flow</Text>
        <div style={{ 
          fontSize: 11, 
          color: '#1890ff', 
          backgroundColor: '#f6ffed', 
          padding: '6px 8px', 
          borderRadius: 4, 
          border: '1px solid #d9f7be',
          marginBottom: 8
        }}>
          Entry → {renderFunnelFlow()} → Conversion
        </div>
        
        <Space direction="vertical" size={2} style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 11, color: '#666' }}>
              <ClockCircleOutlined /> {getEstimatedJourneyTime(template.steps.length)}
            </Text>
            <Text style={{ fontSize: 11, color: '#666' }}>
              <BarChartOutlined /> {getFunnelTypeFromSteps(template.steps)}
            </Text>
          </div>
          
          {template.performanceMetrics && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 11, color: '#666' }}>
                <UserOutlined /> {template.performanceMetrics.users.toLocaleString()} users
              </Text>
              <Text style={{ fontSize: 11, color: '#52c41a' }}>
                <CheckCircleOutlined /> {template.performanceMetrics.conversions} conversions
              </Text>
            </div>
          )}
        </Space>
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          padding: '8px 10px', 
          borderRadius: 6,
          border: '1px solid #e8e9ea'
        }}>
          <div style={{ marginBottom: 6 }}>
            <Text strong style={{ fontSize: 11, color: '#666' }}>Best Use Case:</Text>
            <div style={{ fontSize: 11, color: '#333', marginTop: 2 }}>
              {getBusinessGoalLabel(template.businessGoal)} campaigns
            </div>
          </div>
          
          <Space size={4} wrap>
            <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
              {getTargetUsersLabel(template.targetUsers)}
            </Tag>
            <Tag color="green" style={{ fontSize: 10, margin: 0 }}>
              {template.steps.length} steps
            </Tag>
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default FunnelTemplateCard;