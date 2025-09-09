import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Space, 
  Spin, 
  Alert,
  Input,
  Select,
  Modal,
  message,
  Table,
  Tag,
  Progress,
  Dropdown,
  Menu,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  CalendarOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { api } from '../services/api';
import { CampaignSummary, MarketingChannel, CampaignGoal } from '../types';
import { ColumnsType } from 'antd/es/table';
// import CampaignCard from '../components/CampaignCard'; // No longer needed for table layout
import CampaignForm from '../components/CampaignForm';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

// Interface for processed campaign data with calculated fields
interface ProcessedCampaign extends CampaignSummary {
  cac: number | null;
  budget_utilization_percent: number;
  channel_type: string;
}

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<CampaignSummary[]>([]);
  const [channels, setChannels] = useState<MarketingChannel[]>([]);
  const [goals, setGoals] = useState<CampaignGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignSummary | null>(null);
  // Removed viewMode - now using table layout exclusively
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
      
      // Add mock paid_users data for CAC calculation
      const campaignsWithMockData = (campaignResponse.data.data || []).map((campaign: CampaignSummary) => ({
        ...campaign,
        paid_users: Math.floor(Math.random() * 50) + 5, // Mock 5-55 paid users
        total_spend: campaign.actual_ad_spend || campaign.budget || Math.floor(Math.random() * 10000) + 1000
      }));
      setCampaigns(campaignsWithMockData);
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
      // Add mock paid_users data for CAC calculation
      const campaignsWithMockData = (response.data.data || []).map((campaign: CampaignSummary) => ({
        ...campaign,
        paid_users: Math.floor(Math.random() * 50) + 5, // Mock 5-55 paid users
        total_spend: campaign.actual_ad_spend || campaign.budget || Math.floor(Math.random() * 10000) + 1000
      }));
      setCampaigns(campaignsWithMockData);
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

  // Helper function to calculate CAC
  const calculateCAC = (campaign: CampaignSummary): number | null => {
    const totalSpend = campaign.total_spend || campaign.actual_ad_spend || 0;
    const paidUsers = campaign.paid_users || 0;
    
    if (paidUsers === 0) {
      return null; // Return null when no paid users (will display "--")
    }
    
    return totalSpend / paidUsers;
  };

  // Process campaigns with CAC calculation
  const processedCampaigns: ProcessedCampaign[] = campaigns.map(campaign => ({
    ...campaign,
    cac: calculateCAC(campaign),
    budget_utilization_percent: campaign.budget_utilization_percent || 
      (campaign.budget && campaign.total_spend ? (campaign.total_spend / campaign.budget) * 100 : 0),
    channel_type: channels.find(c => c.id === campaign.channel_id)?.type || 'Unknown'
  }));

  // Table columns definition
  const columns: ColumnsType<ProcessedCampaign> = [
    {
      title: 'Campaign Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: ProcessedCampaign, b: ProcessedCampaign) => a.name.localeCompare(b.name),
      render: (text: string, record: ProcessedCampaign) => (
        <div>
          <div style={{ fontWeight: 500, marginBottom: 4 }}>{text}</div>
          <Tag color={record.status === 'active' ? 'green' : record.status === 'paused' ? 'orange' : 'default'}>
            {record.status?.toUpperCase()}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Channel Type',
      dataIndex: 'channel_type',
      key: 'channel_type',
      filters: Array.from(new Set(channels.map(c => c.type))).map(type => ({ text: type, value: type })),
      onFilter: (value: any, record: ProcessedCampaign) => record.channel_type === value,
      render: (text: string) => <Tag>{text}</Tag>,
    },
    {
      title: 'Budget',
      dataIndex: 'budget',
      key: 'budget',
      sorter: (a: ProcessedCampaign, b: ProcessedCampaign) => (a.budget || 0) - (b.budget || 0),
      render: (budget: number) => budget ? `$${budget.toLocaleString()}` : '--',
    },
    {
      title: 'Actual Spend',
      dataIndex: 'total_spend',
      key: 'total_spend',
      sorter: (a: ProcessedCampaign, b: ProcessedCampaign) => (a.total_spend || 0) - (b.total_spend || 0),
      render: (spend: number) => spend ? `$${spend.toLocaleString()}` : '$0',
    },
    {
      title: 'Budget Utilization',
      dataIndex: 'budget_utilization_percent',
      key: 'budget_utilization_percent',
      sorter: (a: ProcessedCampaign, b: ProcessedCampaign) => (a.budget_utilization_percent || 0) - (b.budget_utilization_percent || 0),
      render: (percent: number) => (
        <div>
          <Progress 
            percent={Math.min(percent, 100)} 
            size="small"
            status={percent > 90 ? 'exception' : percent > 70 ? 'active' : 'normal'}
          />
          <div style={{ fontSize: '12px', textAlign: 'center' }}>
            {percent.toFixed(1)}%
          </div>
        </div>
      ),
    },
    {
      title: 'CAC',
      dataIndex: 'cac',
      key: 'cac',
      sorter: (a: ProcessedCampaign, b: ProcessedCampaign) => (a.cac || 0) - (b.cac || 0),
      render: (cac: number | null) => {
        if (cac === null) return '--';
        const color = cac < 50 ? '#52c41a' : cac < 100 ? '#faad14' : '#ff4d4f';
        return <span style={{ color }}>${cac.toFixed(2)}</span>;
      },
    },
    {
      title: 'Campaign Period',
      dataIndex: 'start_date',
      key: 'campaign_period',
      sorter: (a: ProcessedCampaign, b: ProcessedCampaign) => {
        const dateA = new Date(a.start_date || a.created_at);
        const dateB = new Date(b.start_date || b.created_at);
        return dateB.getTime() - dateA.getTime(); // Latest first (descending)
      },
      defaultSortOrder: 'descend' as const,
      render: (startDate: string, record: ProcessedCampaign) => {
        const start = new Date(startDate || record.created_at);
        const end = record.end_date ? new Date(record.end_date) : null;
        
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <CalendarOutlined style={{ fontSize: 12 }} />
              <span style={{ fontSize: 12 }}>
                {start.toLocaleDateString()}
              </span>
            </div>
            {end && (
              <div style={{ fontSize: 11, color: '#666' }}>
                to {end.toLocaleDateString()}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (text: any, record: ProcessedCampaign) => {
        const actionMenu = (
          <Menu>
            <Menu.Item key="view" icon={<EyeOutlined />}>
              <a href={`/campaigns/${record.id}`}>View Details</a>
            </Menu.Item>
            <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
              Edit
            </Menu.Item>
            <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger>
              Delete
            </Menu.Item>
          </Menu>
        );

        return (
          <Dropdown overlay={actionMenu} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  if (loading) return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Marketing Campaigns
          </Title>
          <Text type="secondary">
            Manage and track your marketing campaign performance
          </Text>
        </div>
        <div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            New Campaign
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 16 }}>
        <Space wrap>
          <Search
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            allowClear
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by Channel"
            value={selectedChannel}
            onChange={setSelectedChannel}
            allowClear
            style={{ width: 180 }}
          >
            {channels.map(channel => (
              <Option key={channel.id} value={channel.id}>
                {channel.name}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Filter by Status"
            value={selectedStatus}
            onChange={setSelectedStatus}
            allowClear
            style={{ width: 150 }}
          >
            <Option value="active">Active</Option>
            <Option value="paused">Paused</Option>
            <Option value="completed">Completed</Option>
          </Select>
          {(searchTerm || selectedChannel || selectedGoal || selectedStatus) && (
            <Button onClick={clearFilters} size="small">
              Clear Filters
            </Button>
          )}
        </Space>
      </div>

      {/* Campaign Table */}
      <Table
        columns={columns}
        dataSource={processedCampaigns.filter(campaign => {
          const matchesSearch = !searchTerm || 
            campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesChannel = !selectedChannel || 
            campaign.channel_id === selectedChannel;
          const matchesStatus = !selectedStatus || 
            campaign.status === selectedStatus;
          
          return matchesSearch && matchesChannel && matchesStatus;
        })}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} campaigns`,
        }}
        scroll={{ x: 1200 }}
        locale={{
          emptyText: (
            <div style={{ textAlign: 'center', padding: '50px 20px' }}>
              <div style={{ fontSize: '16px', marginBottom: '8px' }}>No campaigns found</div>
              <div style={{ color: '#666', marginBottom: '16px' }}>
                Create your first marketing campaign to get started.
              </div>
              <Button type="primary" onClick={handleCreate}>
                Create Campaign
              </Button>
            </div>
          )
        }}
      />

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