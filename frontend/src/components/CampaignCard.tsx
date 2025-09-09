import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Progress, Typography, Row, Col, Divider, Space, Tag } from 'antd';
import { 
  DollarOutlined, 
  CalendarOutlined, 
  UserOutlined, 
  BarChartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { CampaignSummary } from '../types';

const { Text, Title } = Typography;

interface CampaignCardProps {
  campaign: CampaignSummary;
  onEdit?: (campaign: CampaignSummary) => void;
  onDelete?: (id: number) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ 
  campaign, 
  onEdit, 
  onDelete 
}) => {
  const navigate = useNavigate();
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'processing';
      case 'paused': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const getBudgetUtilizationColor = (utilization: number) => {
    if (utilization > 100) return 'red';
    if (utilization > 80) return 'orange';
    return 'green';
  };

  const formatCurrency = (amount?: number) => {
    return amount ? `$${amount.toLocaleString()}` : '$0';
  };

  return (
    <Card
      className="campaign-card"
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              {campaign.channel_name} - {campaign.name}
            </Title>
            <Text type="secondary">{campaign.primary_goal?.replace('_', ' ').toUpperCase()}</Text>
          </div>
          <Badge 
            status={getStatusColor(campaign.status)} 
            text={campaign.status.toUpperCase()}
          />
        </div>
      }
      extra={
        <Space>
          {campaign.days_remaining !== null && campaign.days_remaining !== undefined && (
            <Text strong style={{ color: campaign.days_remaining < 7 ? '#ff4d4f' : '#52c41a' }}>
              {campaign.days_remaining > 0 
                ? `${campaign.days_remaining} days remaining`
                : campaign.days_remaining === 0 
                ? 'Ends today'
                : 'Expired'
              }
            </Text>
          )}
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={12}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <DollarOutlined style={{ color: '#1890ff', marginRight: 8 }} />
              <Text strong>Budget: {formatCurrency(campaign.budget)}</Text>
            </div>
            <Text>Actual Ad Spend: {formatCurrency(campaign.actual_ad_spend)}</Text>
            <br />
            <Text>External Costs: {formatCurrency(campaign.external_costs)}</Text>
            <br />
            <Text strong>Total Spend: {formatCurrency(campaign.total_spend)}</Text>
          </div>
          
          {campaign.budget && campaign.budget > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Text>Budget Utilization:</Text>
              <Progress 
                percent={Math.min(parseFloat(campaign.budget_utilization || '0'), 100)} 
                strokeColor={getBudgetUtilizationColor(parseFloat(campaign.budget_utilization || '0'))}
                format={percent => `${parseFloat(campaign.budget_utilization || '0').toFixed(1)}%`}
              />
            </div>
          )}
        </Col>
        
        <Col span={12}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <UserOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              <Text>Human Input: </Text>
              {campaign.has_human_input ? 
                <CheckCircleOutlined style={{ color: '#52c41a', marginLeft: 4 }} /> :
                <CloseCircleOutlined style={{ color: '#ff4d4f', marginLeft: 4 }} />
              }
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
              <BarChartOutlined style={{ color: '#722ed1', marginRight: 8 }} />
              <Text>Campaign Count: {campaign.campaign_count || 1}</Text>
            </div>
          </div>
          
          {(campaign.start_date || campaign.end_date) && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <CalendarOutlined style={{ color: '#faad14', marginRight: 8 }} />
                <Text>Campaign Period:</Text>
              </div>
              <Text type="secondary">
                {campaign.start_date ? dayjs(campaign.start_date).format('MMM DD, YYYY') : 'Not set'} - {' '}
                {campaign.end_date ? dayjs(campaign.end_date).format('MMM DD, YYYY') : 'Ongoing'}
              </Text>
            </div>
          )}
        </Col>
      </Row>
      
      <Divider />
      
      <Row justify="space-between" align="middle">
        <Col>
          <Space>
            <Tag color="blue">{campaign.utm_source || 'No UTM'}</Tag>
            <Tag color="green">{campaign.utm_campaign || 'No Campaign Tag'}</Tag>
          </Space>
        </Col>
        <Col>
          <Space>
            <Text 
              style={{ color: '#52c41a', cursor: 'pointer' }} 
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
            >
              <EyeOutlined /> View
            </Text>
            {onEdit && (
              <Text 
                style={{ color: '#1890ff', cursor: 'pointer' }} 
                onClick={() => onEdit(campaign)}
              >
                Edit
              </Text>
            )}
            {onDelete && (
              <Text 
                style={{ color: '#ff4d4f', cursor: 'pointer' }} 
                onClick={() => onDelete(campaign.id)}
              >
                Delete
              </Text>
            )}
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default CampaignCard;