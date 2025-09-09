import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Popconfirm,
  Typography,
  Card,
  Row,
  Col,
  message
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { CustomEvent } from '../services/mockData';
import { mockDataService } from '../services/mockData';

const { Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface CustomEventManagerProps {
  events: CustomEvent[];
  onEventSaved: (event: CustomEvent) => void;
  onEventDeleted: (eventId: string) => void;
}

const CustomEventManager: React.FC<CustomEventManagerProps> = ({
  events,
  onEventSaved,
  onEventDeleted
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CustomEvent | null>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  const stageOptions = [
    { value: 'acquisition', label: 'Acquisition', color: 'blue', description: 'User enters funnel (ads, search, referrals)' },
    { value: 'awareness', label: 'Awareness', color: 'cyan', description: 'User becomes aware of product (page views, content)' },
    { value: 'interest', label: 'Interest', color: 'green', description: 'User shows interest (pricing, demos, forms)' },
    { value: 'trial', label: 'Trial', color: 'orange', description: 'User tries product (signup, trial, onboarding)' },
    { value: 'conversion', label: 'Conversion', color: 'red', description: 'User becomes customer (purchase, subscription)' }
  ];

  const handleCreate = () => {
    setEditingEvent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (event: CustomEvent) => {
    setEditingEvent(event);
    form.setFieldsValue({
      name: event.name,
      description: event.description,
      stage: event.stage,
      ga4EventId: event.ga4EventId,
      estimatedConversion: event.estimatedConversion,
      targetConversionRate: event.targetConversionRate
    });
    setModalVisible(true);
  };

  const handleDelete = async (eventId: string) => {
    try {
      // In a real app, you'd call an API to delete the event
      onEventDeleted(eventId);
      message.success('Custom event deleted successfully');
    } catch (error) {
      message.error('Failed to delete custom event');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);

      const eventData = {
        ...values,
        isCustom: true,
        createdBy: 'current-user@company.com' // In real app, get from auth context
      };

      if (editingEvent) {
        // Update existing event (simplified for demo)
        const updatedEvent: CustomEvent = {
          ...editingEvent,
          ...eventData
        };
        onEventSaved(updatedEvent);
        message.success('Custom event updated successfully');
      } else {
        // Create new event
        const newEvent = await mockDataService.saveCustomEvent(eventData);
        onEventSaved(newEvent);
        message.success('Custom event created successfully');
      }

      setModalVisible(false);
      form.resetFields();
      setEditingEvent(null);
    } catch (error) {
      console.error('Save error:', error);
      message.error('Failed to save custom event');
    } finally {
      setSaving(false);
    }
  };

  const getStageInfo = (stage: string) => {
    return stageOptions.find(option => option.value === stage) || stageOptions[0];
  };

  const columns = [
    {
      title: 'Event Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name: string, record: CustomEvent) => (
        <div>
          <Text strong>{name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            ID: {record.id}
          </Text>
        </div>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 250
    },
    {
      title: 'Stage',
      dataIndex: 'stage',
      key: 'stage',
      width: 120,
      render: (stage: string) => {
        const stageInfo = getStageInfo(stage);
        return <Tag color={stageInfo.color}>{stageInfo.label}</Tag>;
      }
    },
    {
      title: 'GA4 Event ID',
      dataIndex: 'ga4EventId',
      key: 'ga4EventId',
      width: 150,
      render: (ga4EventId: string) => (
        <Text code style={{ fontSize: 11 }}>
          {ga4EventId || 'Not specified'}
        </Text>
      )
    },
    {
      title: 'Est. Conversion',
      dataIndex: 'estimatedConversion',
      key: 'estimatedConversion',
      width: 100,
      render: (conversion: number) => (
        <Text strong>
          {conversion ? `${conversion}%` : 'Not set'}
        </Text>
      )
    },
    {
      title: 'Target Rate',
      dataIndex: 'targetConversionRate',
      key: 'targetConversionRate',
      width: 100,
      render: (rate: number, record: CustomEvent) => (
        <Text style={{ color: '#1890ff' }}>
          {rate ? `${rate}%` : `${record.estimatedConversion}%`}
        </Text>
      )
    },
    {
      title: 'Usage',
      dataIndex: 'usageCount',
      key: 'usageCount',
      width: 80,
      render: (count: number) => (
        <Tag color={count > 0 ? 'green' : 'default'}>
          {count} times
        </Tag>
      )
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 150,
      render: (createdBy: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {createdBy}
        </Text>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: CustomEvent) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure you want to delete this custom event?"
            description="This action cannot be undone and may affect existing templates."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="text"
              size="small"
              icon={<DeleteOutlined />}
              danger
            />
          </Popconfirm>
        </Space>
      )
    }
  ];

  const renderStageGuide = () => (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Text strong style={{ marginBottom: 8, display: 'block' }}>
        <InfoCircleOutlined /> Event Stage Guide
      </Text>
      <Row gutter={[8, 8]}>
        {stageOptions.map(stage => (
          <Col span={12} key={stage.value}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Tag color={stage.color} style={{ marginRight: 8, minWidth: 80, textAlign: 'center' }}>
                {stage.label}
              </Tag>
              <Text style={{ fontSize: 11, color: '#666' }}>
                {stage.description}
              </Text>
            </div>
          </Col>
        ))}
      </Row>
    </Card>
  );

  if (events.length === 0) {
    return (
      <div>
        {renderStageGuide()}
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <Text type="secondary">
            No custom events created yet. Create your first custom event to track specific business actions.
          </Text>
          <br />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} style={{ marginTop: '16px' }}>
            Create First Custom Event
          </Button>
        </Card>

        <Modal
          title={editingEvent ? 'Edit Custom Event' : 'Create New Custom Event'}
          open={modalVisible}
          onOk={handleSave}
          onCancel={() => {
            setModalVisible(false);
            setEditingEvent(null);
            form.resetFields();
          }}
          confirmLoading={saving}
          width={600}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="name"
              label="Event Name"
              rules={[
                { required: true, message: 'Please enter event name' },
                { max: 50, message: 'Name must be less than 50 characters' }
              ]}
            >
              <Input placeholder="e.g., Whitepaper Download" />
            </Form.Item>

            <Form.Item
              name="description"
              label="Event Description"
              rules={[{ max: 200, message: 'Description must be less than 200 characters' }]}
            >
              <TextArea
                rows={3}
                placeholder="Detailed description of when this event is triggered"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="stage"
                  label="Event Stage"
                  rules={[{ required: true, message: 'Please select event stage' }]}
                >
                  <Select placeholder="Select funnel stage">
                    {stageOptions.map(option => (
                      <Option key={option.value} value={option.value}>
                        <Space>
                          <Tag color={option.color}>{option.label}</Tag>
                          {option.description}
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="estimatedConversion"
                  label="Estimated Conversion Rate (%)"
                  rules={[
                    { type: 'number', min: 0.1, max: 100, message: 'Must be between 0.1 and 100' }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="e.g., 35"
                    min={0.1}
                    max={100}
                    precision={1}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="targetConversionRate"
              label="Target Conversion Rate (%) - Optional"
              extra="Set a specific target rate for planning purposes. If not set, estimated rate will be used."
              rules={[
                { type: 'number', min: 0.1, max: 100, message: 'Must be between 0.1 and 100' }
              ]}
            >
              <InputNumber
                style={{ width: '100%' }}
                placeholder="e.g., 30"
                min={0.1}
                max={100}
                precision={1}
              />
            </Form.Item>

            <Row gutter={16}>
            </Row>

            <Form.Item
              name="ga4EventId"
              label="GA4 Event ID (Optional)"
              extra="The actual event name in Google Analytics 4. Leave empty if not yet configured."
            >
              <Input placeholder="e.g., custom_whitepaper_download" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }

  return (
    <div>
      {renderStageGuide()}
      
      <Card>
        <Table
          columns={columns}
          dataSource={events}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} custom events`
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title={editingEvent ? 'Edit Custom Event' : 'Create New Custom Event'}
        open={modalVisible}
        onOk={handleSave}
        onCancel={() => {
          setModalVisible(false);
          setEditingEvent(null);
          form.resetFields();
        }}
        confirmLoading={saving}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Event Name"
            rules={[
              { required: true, message: 'Please enter event name' },
              { max: 50, message: 'Name must be less than 50 characters' }
            ]}
          >
            <Input placeholder="e.g., Whitepaper Download" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Event Description"
            rules={[{ max: 200, message: 'Description must be less than 200 characters' }]}
          >
            <TextArea
              rows={3}
              placeholder="Detailed description of when this event is triggered"
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="stage"
                label="Event Stage"
                rules={[{ required: true, message: 'Please select event stage' }]}
              >
                <Select placeholder="Select funnel stage">
                  {stageOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Space>
                        <Tag color={option.color}>{option.label}</Tag>
                        {option.description}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="estimatedConversion"
                label="Estimated Conversion Rate (%)"
                rules={[
                  { type: 'number', min: 0.1, max: 100, message: 'Must be between 0.1 and 100' }
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="e.g., 35"
                  min={0.1}
                  max={100}
                  precision={1}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="targetConversionRate"
            label="Target Conversion Rate (%) - Optional"
            extra="Set a specific target rate for planning purposes. If not set, estimated rate will be used."
            rules={[
              { type: 'number', min: 0.1, max: 100, message: 'Must be between 0.1 and 100' }
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="e.g., 30"
              min={0.1}
              max={100}
              precision={1}
            />
          </Form.Item>

          <Row gutter={16}>
          </Row>

          <Form.Item
            name="ga4EventId"
            label="GA4 Event ID (Optional)"
            extra="The actual event name in Google Analytics 4. Leave empty if not yet configured."
          >
            <Input placeholder="e.g., custom_whitepaper_download" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomEventManager;