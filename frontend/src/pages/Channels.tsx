import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Popconfirm,
  Tag
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { api } from '../services/api';
import { mockDataService, ChannelRevenueData, formatCurrency, formatPercentage } from '../services/mockData';

const { Option } = Select;

interface Channel {
  id: number;
  name: string;
  type: string;
  platform?: string;
  channel_category: string;
  custom_type?: string;
  type_display?: string;
  description?: string;
  cost_per_click?: number | string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Analytics fields
  total_campaigns?: number;
  active_campaigns?: number;
  total_budget?: number;
  total_investment?: number;
  budget_utilization_percent?: number;
  // Revenue fields
  monthlyRevenue?: number;
  totalRevenue?: number;
  paidUsers?: number;
  conversionToPaid?: number;
  cac?: number; // Customer Acquisition Cost
  channelROI?: number;
}

const Channels: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null);
  const [form] = Form.useForm();

  const channelCategories = [
    { value: 'paid_advertising', label: 'Paid Advertising' },
    { value: 'social_media_marketing', label: 'Social Media Marketing' },
    { value: 'content_marketing', label: 'Content Marketing' },
    { value: 'email_marketing', label: 'Email Marketing' },
    { value: 'seo_organic', label: 'SEO/Organic' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'events', label: 'Events' },
    { value: 'referral_program', label: 'Referral Program' },
    { value: 'influencer_marketing', label: 'Influencer Marketing' },
    { value: 'podcast_advertising', label: 'Podcast Advertising' },
    { value: 'custom', label: 'Custom/Other' },
  ];

  useEffect(() => {
    fetchChannels();
  }, []);

  const fetchChannels = async () => {
    setLoading(true);
    try {
      const [response, revenueData] = await Promise.all([
        api.channels.getAll({ include_analytics: true }),
        mockDataService.getChannelRevenueData()
      ]);
      
      const channelsData = response.data.data || [];
      
      // Merge channels with revenue data
      const enhancedChannels = channelsData.map((channel: Channel) => {
        const revenueInfo = revenueData.find((r: ChannelRevenueData) => r.id === channel.id);
        const totalSpent = channel.total_investment || 0;
        const paidUsers = revenueInfo?.paidUsers || 0;
        const cac = paidUsers > 0 ? totalSpent / paidUsers : null;
        
        return {
          ...channel,
          monthlyRevenue: revenueInfo?.monthlyRevenue || 0,
          totalRevenue: revenueInfo?.totalRevenue || 0,
          paidUsers: paidUsers,
          conversionToPaid: revenueInfo?.conversionToPaid || 0,
          cac: cac,
          channelROI: revenueInfo?.channelROI || 0
        };
      });
      
      setChannels(enhancedChannels);
    } catch (error) {
      message.error('Failed to fetch channels');
      console.error('Error fetching channels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingChannel) {
        await api.channels.update(editingChannel.id, values);
        message.success('Channel updated successfully');
      } else {
        await api.channels.create(values);
        message.success('Channel created successfully');
      }
      
      setModalVisible(false);
      setEditingChannel(null);
      form.resetFields();
      fetchChannels();
    } catch (error: any) {
      console.error('Error submitting channel:', error);
      message.error(error.response?.data?.message || 'Failed to save channel');
    }
  };

  const handleEdit = (channel: Channel) => {
    setEditingChannel(channel);
    form.setFieldsValue(channel);
    setModalVisible(true);
  };

  const handleDelete = async (channelId: number) => {
    try {
      await api.channels.delete(channelId);
      message.success('Channel deleted successfully');
      fetchChannels();
    } catch (error: any) {
      console.error('Error deleting channel:', error);
      message.error(error.response?.data?.message || 'Failed to delete channel');
    }
  };

  const handleAdd = () => {
    setEditingChannel(null);
    form.resetFields();
    setModalVisible(true);
  };

  const getChannelTypeLabel = (channel: Channel) => {
    return channel.type_display || channel.custom_type || 'Unknown';
  };

  const columns = [
    {
      title: 'Channel Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Channel, b: Channel) => a.name.localeCompare(b.name),
      render: (name: string, record: Channel) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          {record.platform && (
            <div style={{ fontSize: '12px', color: '#999' }}>
              Platform: {record.platform}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'channel_category',
      key: 'channel_category',
      render: (_: string, record: Channel) => (
        <Tag color="blue">{getChannelTypeLabel(record)}</Tag>
      ),
      filters: channelCategories.map(type => ({ text: type.label, value: type.value })),
      onFilter: (value: any, record: Channel) => record.channel_category === value,
    },
    {
      title: 'Campaigns',
      key: 'campaigns',
      render: (_: unknown, record: Channel) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
            {record.active_campaigns || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            of {record.total_campaigns || 0} total
          </div>
        </div>
      ),
      sorter: (a: Channel, b: Channel) => (a.active_campaigns || 0) - (b.active_campaigns || 0),
    },
    {
      title: 'Total Investment',
      key: 'total_investment',
      render: (_: unknown, record: Channel) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold' }}>
            ${(record.total_investment || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            Budget: ${(record.total_budget || 0).toLocaleString()}
          </div>
        </div>
      ),
      sorter: (a: Channel, b: Channel) => (a.total_investment || 0) - (b.total_investment || 0),
    },
    {
      title: 'Budget Utilization',
      key: 'budget_utilization',
      render: (_: unknown, record: Channel) => {
        const utilization = record.budget_utilization_percent || 0;
        const color = utilization > 100 ? '#ff4d4f' : utilization > 80 ? '#faad14' : '#52c41a';
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', color }}>
              {utilization.toFixed(1)}%
            </div>
          </div>
        );
      },
      sorter: (a: Channel, b: Channel) => (a.budget_utilization_percent || 0) - (b.budget_utilization_percent || 0),
    },
    {
      title: 'Monthly Revenue',
      key: 'monthlyRevenue',
      render: (_: unknown, record: Channel) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold', color: record.monthlyRevenue && record.monthlyRevenue > 0 ? '#52c41a' : '#999' }}>
            {formatCurrency(record.monthlyRevenue || 0)}
          </div>
        </div>
      ),
      sorter: (a: Channel, b: Channel) => (a.monthlyRevenue || 0) - (b.monthlyRevenue || 0),
    },
    {
      title: 'Paid Users',
      key: 'paidUsers',
      render: (_: unknown, record: Channel) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
            {record.paidUsers || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {formatPercentage(record.conversionToPaid || 0)} conversion
          </div>
        </div>
      ),
      sorter: (a: Channel, b: Channel) => (a.paidUsers || 0) - (b.paidUsers || 0),
    },
    {
      title: 'CAC',
      key: 'cac',
      render: (_: unknown, record: Channel) => {
        const cac = record.cac;
        if (cac === null || cac === undefined) {
          return (
            <div style={{ textAlign: 'center', color: '#999' }}>
              --
            </div>
          );
        }
        const color = cac < 50 ? '#52c41a' : cac < 100 ? '#faad14' : '#ff4d4f';
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', color }}>
              ${cac.toFixed(2)}
            </div>
            <div style={{ fontSize: '10px', color }}>
              {cac < 50 ? 'Excellent' : cac < 100 ? 'Good' : 'High'}
            </div>
          </div>
        );
      },
      sorter: (a: Channel, b: Channel) => (a.cac || 0) - (b.cac || 0),
    },
    {
      title: 'Channel ROI',
      key: 'channelROI',
      render: (_: unknown, record: Channel) => {
        const roi = record.channelROI || 0;
        const color = roi >= 200 ? '#52c41a' : roi >= 100 ? '#faad14' : '#ff4d4f';
        return (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontWeight: 'bold', color }}>
              {formatPercentage(roi)}
            </div>
            <div style={{ fontSize: '10px', color }}>
              {roi >= 200 ? 'Excellent' : roi >= 100 ? 'Good' : 'Needs Improvement'}
            </div>
          </div>
        );
      },
      sorter: (a: Channel, b: Channel) => (a.channelROI || 0) - (b.channelROI || 0),
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
      filters: [
        { text: 'Active', value: true },
        { text: 'Inactive', value: false },
      ],
      onFilter: (value: any, record: Channel) => record.is_active === value,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Channel) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this channel?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              icon={<DeleteOutlined />}
              danger
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card
        title="Marketing Channels"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Add Channel
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={channels}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>

      <Modal
        title={editingChannel ? 'Edit Channel' : 'Add Channel'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          setEditingChannel(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ is_active: true, channel_category: 'custom' }}
        >
          <Form.Item
            name="name"
            label="Channel Name"
            rules={[
              { required: true, message: 'Please enter channel name' },
              { max: 100, message: 'Name must be less than 100 characters' }
            ]}
          >
            <Input placeholder="e.g. TikTok Ads" />
          </Form.Item>

          <Form.Item
            name="channel_category"
            label="Channel Type"
            rules={[{ required: true, message: 'Please select channel type' }]}
          >
            <Select 
              placeholder="Select channel type"
              onChange={(value) => {
                if (value !== 'custom') {
                  form.setFieldValue('custom_type', undefined);
                }
              }}
            >
              {channelCategories.map(type => (
                <Option key={type.value} value={type.value}>
                  {type.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.channel_category !== currentValues.channel_category}
          >
            {({ getFieldValue }) =>
              getFieldValue('channel_category') === 'custom' ? (
                <Form.Item
                  name="custom_type"
                  label="Enter Custom Type"
                  rules={[
                    { required: true, message: 'Please enter custom channel type' },
                    { max: 100, message: 'Type must be less than 100 characters' }
                  ]}
                >
                  <Input placeholder="e.g. Podcast Sponsorship, Newsletter Ads" />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            name="platform"
            label="Platform"
            rules={[{ max: 100, message: 'Platform must be less than 100 characters' }]}
          >
            <Input placeholder="e.g. TikTok, LinkedIn, Google, Spotify" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ max: 500, message: 'Description must be less than 500 characters' }]}
          >
            <Input.TextArea
              placeholder="Brief description of the marketing channel"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="cost_per_click"
            label="Cost per Click (Optional)"
            rules={[
              { type: 'number', min: 0, message: 'Cost must be positive' }
            ]}
          >
            <Input
              type="number"
              step="0.01"
              placeholder="0.50"
              addonBefore="$"
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Status"
            valuePropName="checked"
          >
            <Switch
              checkedChildren="Active"
              unCheckedChildren="Inactive"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Channels;