import React from 'react';
import { Card, Space, Tag, Button, Statistic, Typography, Row, Col, Popconfirm } from 'antd';
import {
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  TrophyOutlined,
  UserOutlined,
  DollarOutlined,
  FunnelPlotOutlined,
  CalendarOutlined
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

      <Row gutter={8} style={{ marginBottom: 12 }}>
        <Col span={12}>
          <div style={{ textAlign: 'center', padding: '8px 0', backgroundColor: '#fafafa', borderRadius: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: roiColor }}>
              {(template.actualTotalConversion || template.targetTotalConversion || 0).toFixed(1)}%
            </div>
            <div style={{ fontSize: 11, color: '#666' }}>Conversion</div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ textAlign: 'center', padding: '8px 0', backgroundColor: '#fafafa', borderRadius: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 'bold', color: roiColor }}>
              {template.estimatedROI.toFixed(1)}x
            </div>
            <div style={{ fontSize: 11, color: '#666' }}>ROI</div>
          </div>
        </Col>
      </Row>

      <Space direction="vertical" size={2} style={{ width: '100%', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 12, color: '#666' }}>
            <FunnelPlotOutlined /> {template.steps.length} steps
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>
            <DollarOutlined /> ${template.estimatedCAC} CAC
          </Text>
        </div>
        
        {template.performanceMetrics && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, color: '#666' }}>
              <UserOutlined /> {template.performanceMetrics.users.toLocaleString()} users
            </Text>
            <Text style={{ fontSize: 12, color: '#52c41a' }}>
              <TrophyOutlined /> {template.performanceMetrics.conversions} conversions
            </Text>
          </div>
        )}
      </Space>

      <div style={{ marginTop: 'auto' }}>
        <Space size={4}>
          <Tag color="blue" style={{ fontSize: 10, margin: 0 }}>
            {getBusinessGoalLabel(template.businessGoal)}
          </Tag>
          <Tag color="purple" style={{ fontSize: 10, margin: 0 }}>
            {getTargetUsersLabel(template.targetUsers)}
          </Tag>
        </Space>
        <div style={{ marginTop: 4 }}>
          <Text style={{ fontSize: 11, color: '#999' }}>
            Budget: {template.budgetRange}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default FunnelTemplateCard;