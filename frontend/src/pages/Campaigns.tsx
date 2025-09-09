import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Button, 
  Space, 
  Spin, 
  Alert,
  Input,
  Select,
  Modal,
  message,
  Empty
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined,
  AppstoreOutlined,
  UnorderedListOutlined 
} from '@ant-design/icons';
import { api } from '../services/api';
import { CampaignSummary, MarketingChannel, CampaignGoal } from '../types';
import CampaignCard from '../components/CampaignCard';
import CampaignForm from '../components/CampaignForm';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [channels, setChannels] = useState<MarketingChannel[]>([]);
  const [goals, setGoals] = useState<CampaignGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignSummary | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [submitLoading, setSubmitLoading] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<number | undefined>();
  const [selectedGoal, setSelectedGoal] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchCampaigns();
  }, [searchTerm, selectedChannel, selectedGoal, selectedStatus]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [campaignResponse, channelResponse, goalsResponse] = await Promise.all([
        api.campaigns.getAll(),
        api.channels.getAll(),
        api.campaigns.getGoals()
      ]);
      
      setCampaigns(campaignResponse.data.data || []);
      setChannels(channelResponse.data.data || []);
      setGoals(goalsResponse.data.data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedChannel) params.channel_id = selectedChannel;
      if (selectedGoal) params.primary_goal = selectedGoal;
      if (selectedStatus) params.status = selectedStatus;
      
      const response = await api.campaigns.getAll(params);
      setCampaigns(response.data.data || []);
    } catch (err: any) {
      console.error('Failed to fetch campaigns:', err);
    }
  };

  const handleCreate = () => {
    setEditingCampaign(null);
    setModalVisible(true);
  };

  const handleEdit = (campaign: CampaignSummary) => {
    setEditingCampaign(campaign);
    setModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      setSubmitLoading(true);
      
      if (editingCampaign) {
        await api.campaigns.update(editingCampaign.id, values);
        message.success('Campaign updated successfully');
      } else {
        await api.campaigns.create(values);
        message.success('Campaign created successfully');
      }
      
      setModalVisible(false);
      setEditingCampaign(null);
      fetchCampaigns();
    } catch (err: any) {
      message.error(err.response?.data?.error?.message || 'Operation failed');
      throw err; // Re-throw to prevent modal closing
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Delete Campaign',
      content: 'Are you sure you want to delete this campaign? This action cannot be undone.',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await api.campaigns.delete(id);
          message.success('Campaign deleted successfully');
          fetchCampaigns();
        } catch (err: any) {
          message.error(err.response?.data?.error?.message || 'Delete failed');
        }
      },
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedChannel(undefined);
    setSelectedGoal(undefined);
    setSelectedStatus(undefined);
  };

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div>
      {/* Header */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            Marketing Campaigns
          </Title>
          <Text type="secondary">
            Manage and track your marketing campaign performance
          </Text>
        </Col>
        <Col>
          <Space>
            <Button 
              icon={viewMode === 'card' ? <UnorderedListOutlined /> : <AppstoreOutlined />}
              onClick={() => setViewMode(viewMode === 'card' ? 'list' : 'card')}
            >
              {viewMode === 'card' ? 'List View' : 'Card View'}
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              New Campaign
            </Button>
          </Space>
        </Col>
      </Row>

      {/* Filters */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Search
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ width: '100%' }}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Filter by Channel"
            value={selectedChannel}
            onChange={setSelectedChannel}
            allowClear
            style={{ width: '100%' }}
          >
            {channels.map(channel => (
              <Option key={channel.id} value={channel.id}>
                {channel.name}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Filter by Goal"
            value={selectedGoal}
            onChange={setSelectedGoal}
            allowClear
            style={{ width: '100%' }}
          >
            {goals.map(goal => (
              <Option key={goal.name} value={goal.name}>
                {goal.name.charAt(0).toUpperCase() + goal.name.slice(1)}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Select
            placeholder="Filter by Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            allowClear
            style={{ width: '100%' }}
          >
            <Option value="active">Active</Option>
            <Option value="paused">Paused</Option>
            <Option value="completed">Completed</Option>
          </Select>
        </Col>
      </Row>

      {/* Clear Filters */}
      {(searchTerm || selectedChannel || selectedGoal || selectedStatus) && (
        <Row style={{ marginBottom: 16 }}>
          <Col>
            <Button onClick={clearFilters} size="small">
              Clear All Filters
            </Button>
          </Col>
        </Row>
      )}

      {/* Campaign Display */}
      {campaigns.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={
            <span>
              No campaigns found. <br />
              Create your first marketing campaign to get started.
            </span>
          }
        >
          <Button type="primary" onClick={handleCreate}>
            Create Campaign
          </Button>
        </Empty>
      ) : (
        <Row gutter={[16, 16]}>
          {campaigns.map((campaign) => (
            <Col xs={24} sm={24} md={12} lg={8} xl={8} key={campaign.id}>
              <CampaignCard
                campaign={campaign}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Campaign Form Modal */}
      <CampaignForm
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingCampaign(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingCampaign || undefined}
        loading={submitLoading}
      />
    </div>
  );
};

export default Campaigns;