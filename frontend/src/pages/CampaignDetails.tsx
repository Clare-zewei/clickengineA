import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Descriptions, 
  Tag, 
  Progress, 
  Button, 
  Space, 
  Divider,
  Row,
  Col,
  Statistic,
  Typography,
  Spin,
  Alert,
  Badge
} from 'antd';
import { 
  EditOutlined, 
  ArrowLeftOutlined,
  DollarOutlined,
  CalendarOutlined,
  BarChartOutlined,
  UserOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { api } from '../services/api';
import { CampaignSummary } from '../types';
import CampaignForm from '../components/CampaignForm';

const { Title, Text } = Typography;

const CampaignDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<CampaignSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.campaigns.getById(parseInt(id!));
      setCampaign(response.data.data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch campaign details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      await api.campaigns.update(parseInt(id!), values);
      setEditModalVisible(false);
      fetchCampaign();
    } catch (err: any) {
      throw err;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'processing';
      case 'paused': return 'warning';
      case 'completed': return 'success';
      default: return 'default';
    }
  };

  const formatCurrency = (amount?: number) => {
    return amount ? `$${amount.toLocaleString()}` : '$0';
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (!campaign) return <Alert message="Campaign not found" type="warning" showIcon />;

  return (
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/campaigns')}
            style={{ marginRight: 16 }}
          >
            Back to Campaigns
          </Button>
          <Title level={2} style={{ display: 'inline', margin: 0 }}>
            {campaign.channel_name} - {campaign.name}
          </Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => setEditModalVisible(true)}
          >
            Edit Campaign
          </Button>
        </Col>
      </Row>

      {/* Status and Overview */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Status"
              value={campaign.status.toUpperCase()}
              prefix={<Badge status={getStatusColor(campaign.status)} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Budget Utilization"
              value={parseFloat(campaign.budget_utilization || '0')}
              suffix="%"
              precision={1}
              valueStyle={{ 
                color: parseFloat(campaign.budget_utilization || '0') > 100 ? '#cf1322' : '#3f8600' 
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Total Spend"
              value={campaign.total_spend || 0}
              formatter={value => `$${Number(value).toLocaleString()}`}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="Days Remaining"
              value={campaign.days_remaining || 'N/A'}
              prefix={<CalendarOutlined />}
              valueStyle={{ 
                color: (campaign.days_remaining || 0) < 7 ? '#cf1322' : '#3f8600' 
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* Campaign Details */}
      <Card title="Campaign Information" style={{ marginBottom: 24 }}>
        <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="Campaign Name">
            {campaign.name}
          </Descriptions.Item>
          <Descriptions.Item label="Marketing Channel">
            {campaign.channel_name}
          </Descriptions.Item>
          <Descriptions.Item label="Primary Goal">
            <Tag color="blue">
              {campaign.primary_goal?.replace('_', ' ').toUpperCase()}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Budget">
            {formatCurrency(campaign.budget)}
          </Descriptions.Item>
          <Descriptions.Item label="Actual Ad Spend">
            {formatCurrency(campaign.actual_ad_spend)}
          </Descriptions.Item>
          <Descriptions.Item label="External Costs">
            {formatCurrency(campaign.external_costs)}
          </Descriptions.Item>
          <Descriptions.Item label="Human Input Required">
            {campaign.has_human_input ? (
              <Tag color="green">Yes</Tag>
            ) : (
              <Tag color="red">No</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Campaign Count">
            {campaign.campaign_count || 1}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {campaign.start_date ? dayjs(campaign.start_date).format('MMM DD, YYYY') : 'Not set'}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {campaign.end_date ? dayjs(campaign.end_date).format('MMM DD, YYYY') : 'Ongoing'}
          </Descriptions.Item>
          <Descriptions.Item label="Created">
            {dayjs(campaign.created_at).format('MMM DD, YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Last Updated">
            {dayjs(campaign.updated_at).format('MMM DD, YYYY HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* UTM Tracking */}
      {(campaign.utm_source || campaign.utm_medium || campaign.utm_campaign) && (
        <Card title="UTM Tracking Parameters" style={{ marginBottom: 24 }}>
          <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
            <Descriptions.Item label="UTM Source">
              {campaign.utm_source || 'Not set'}
            </Descriptions.Item>
            <Descriptions.Item label="UTM Medium">
              {campaign.utm_medium || 'Not set'}
            </Descriptions.Item>
            <Descriptions.Item label="UTM Campaign">
              {campaign.utm_campaign || 'Not set'}
            </Descriptions.Item>
            <Descriptions.Item label="UTM Term">
              {campaign.utm_term || 'Not set'}
            </Descriptions.Item>
            <Descriptions.Item label="UTM Content">
              {campaign.utm_content || 'Not set'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {/* Budget Breakdown */}
      <Card title="Budget Analysis">
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Budget Utilization</Text>
              <Progress 
                percent={Math.min(parseFloat(campaign.budget_utilization || '0'), 100)} 
                strokeColor={parseFloat(campaign.budget_utilization || '0') > 100 ? '#ff4d4f' : '#52c41a'}
                format={percent => `${parseFloat(campaign.budget_utilization || '0').toFixed(1)}%`}
                style={{ marginTop: 8 }}
              />
              {parseFloat(campaign.budget_utilization || '0') > 100 && (
                <Text type="danger" style={{ fontSize: 12 }}>
                  ⚠️ Budget exceeded by ${((campaign.total_spend || 0) - (campaign.budget || 0)).toLocaleString()}
                </Text>
              )}
            </div>
          </Col>
          <Col xs={24} md={12}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Total Budget:</Text>
                <Text strong>{formatCurrency(campaign.budget)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Ad Spend:</Text>
                <Text>{formatCurrency(campaign.actual_ad_spend)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>External Costs:</Text>
                <Text>{formatCurrency(campaign.external_costs)}</Text>
              </div>
              <Divider style={{ margin: '8px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text strong>Total Spent:</Text>
                <Text strong>{formatCurrency(campaign.total_spend)}</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text>Remaining:</Text>
                <Text style={{ 
                  color: (campaign.budget || 0) - (campaign.total_spend || 0) < 0 ? '#ff4d4f' : '#52c41a' 
                }}>
                  {formatCurrency((campaign.budget || 0) - (campaign.total_spend || 0))}
                </Text>
              </div>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Edit Modal */}
      <CampaignForm
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSubmit={handleUpdate}
        initialValues={campaign}
      />
    </div>
  );
};

export default CampaignDetails;