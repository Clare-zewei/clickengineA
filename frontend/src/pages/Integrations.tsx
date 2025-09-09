import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Divider,
  Progress,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Alert,
  Spin,
  Space,
  Statistic
} from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  ReloadOutlined,
  SettingOutlined,
  GoogleOutlined,
  ApiOutlined,
  MailOutlined,
  SyncOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { mockDataService, IntegrationStatus } from '../services/mockData';

const { Title, Text } = Typography;
const { Option } = Select;

const Integrations: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [integrations, setIntegrations] = useState<IntegrationStatus[]>([]);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<IntegrationStatus | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const data = await mockDataService.getIntegrationStatuses();
      setIntegrations(data);
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleRefreshIntegration = async (integrationId: string) => {
    setRefreshing(integrationId);
    try {
      await mockDataService.refreshData(`${integrationId} Integration`);
      await fetchIntegrations();
    } catch (error) {
      console.error(`Failed to refresh ${integrationId}:`, error);
    } finally {
      setRefreshing(null);
    }
  };

  const handleConfigure = (integration: IntegrationStatus) => {
    setSelectedIntegration(integration);
    form.setFieldsValue({
      name: integration.name,
      syncFrequency: integration.syncFrequency,
      status: integration.status === 'connected'
    });
    setConfigModalVisible(true);
  };

  const handleConfigSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log('Configuration updated:', values);
      setConfigModalVisible(false);
      setSelectedIntegration(null);
      form.resetFields();
    } catch (error) {
      console.error('Configuration error:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'warning':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'disconnected':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return <CloseCircleOutlined style={{ color: '#d9d9d9' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'success';
      case 'warning':
        return 'warning';
      case 'disconnected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getIntegrationIcon = (id: string) => {
    switch (id) {
      case 'ga4':
        return <GoogleOutlined style={{ fontSize: 24, color: '#4285f4' }} />;
      case 'umm':
        return <ApiOutlined style={{ fontSize: 24, color: '#722ed1' }} />;
      case 'email':
        return <MailOutlined style={{ fontSize: 24, color: '#fa8c16' }} />;
      default:
        return <ApiOutlined style={{ fontSize: 24, color: '#1890ff' }} />;
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div style={{ padding: 24 }}>
      <Title level={2} style={{ marginBottom: 24 }}>Integrations Management</Title>

      {/* Integration Dashboard Overview */}
      <Card title="Integration Dashboard Overview" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          {integrations.map(integration => (
            <Col span={8} key={integration.id}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '12px 16px',
                border: '1px solid #f0f0f0',
                borderRadius: 6,
                marginBottom: 8
              }}>
                <div style={{ marginRight: 12 }}>
                  {getIntegrationIcon(integration.id)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text strong>{integration.name}</Text>
                    <Tag color={getStatusColor(integration.status)}>
                      {getStatusIcon(integration.status)}
                      {integration.status === 'connected' ? 'Active' : 
                       integration.status === 'warning' ? 'Warning' : 'Disconnected'}
                    </Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Last sync: {integration.lastSync}
                  </Text>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Card>

      {/* UMM API Integration */}
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ApiOutlined style={{ marginRight: 8, color: '#722ed1' }} />
            User Management (UMM) API Integration
          </div>
        }
        style={{ marginBottom: 24 }}
      >
        {integrations.filter(i => i.id === 'umm').map(integration => (
          <div key={integration.id}>
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="Connection Status"
                  value={integration.status === 'connected' ? 'Connected' : 
                          integration.status === 'warning' ? 'Warning' : 'Disconnected'}
                  prefix={getStatusIcon(integration.status)}
                  valueStyle={{ 
                    color: integration.status === 'connected' ? '#52c41a' : 
                           integration.status === 'warning' ? '#faad14' : '#ff4d4f'
                  }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Last Sync Time"
                  value={integration.lastSync}
                  prefix={<SyncOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="Sync Frequency"
                  value={integration.syncFrequency}
                  prefix={<ReloadOutlined />}
                />
              </Col>
              <Col span={6}>
                <div>
                  <Text strong>Data Health</Text>
                  <div style={{ marginTop: 8 }}>
                    <Progress
                      percent={integration.uptime}
                      size="small"
                      status={integration.uptime > 95 ? 'success' : 'exception'}
                    />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {integration.dataHealth}
                    </Text>
                  </div>
                </div>
              </Col>
            </Row>
            
            <Divider />
            
            <Row gutter={16}>
              <Col span={12}>
                <Space>
                  <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    loading={refreshing === integration.id}
                    onClick={() => handleRefreshIntegration(integration.id)}
                  >
                    Manual Sync
                  </Button>
                  <Button
                    icon={<SettingOutlined />}
                    onClick={() => handleConfigure(integration)}
                  >
                    Configure
                  </Button>
                </Space>
              </Col>
              <Col span={12}>
                <div style={{ textAlign: 'right' }}>
                  <Text type="secondary">
                    Ready for real UMM API connection
                  </Text>
                </div>
              </Col>
            </Row>
          </div>
        ))}
      </Card>

      {/* Google Analytics 4 Integration */}
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <GoogleOutlined style={{ marginRight: 8, color: '#4285f4' }} />
            Google Analytics 4 Integration
          </div>
        }
        style={{ marginBottom: 24 }}
      >
        {integrations.filter(i => i.id === 'ga4').map(integration => (
          <div key={integration.id}>
            <Alert
              message="GA4 Integration Active"
              description="Automatic collection and synchronization of user behavior data enabled."
              type="success"
              showIcon
              style={{ marginBottom: 16 }}
            />
            
            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Connection Status"
                    value="Active"
                    prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Last Sync"
                    value={integration.lastSync}
                    prefix={<SyncOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Data Quality"
                    value="High Precision"
                    prefix={<TrophyOutlined style={{ color: '#52c41a' }} />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
            </Row>


            <Divider />
            
            <Space>
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                loading={refreshing === integration.id}
                onClick={() => handleRefreshIntegration(integration.id)}
              >
                Refresh GA4 Data
              </Button>
              <Button
                icon={<SettingOutlined />}
                onClick={() => handleConfigure(integration)}
              >
                GA4 Settings
              </Button>
            </Space>
          </div>
        ))}
      </Card>

      {/* Configuration Modal */}
      <Modal
        title={`Configure ${selectedIntegration?.name || 'Integration'}`}
        open={configModalVisible}
        onOk={handleConfigSubmit}
        onCancel={() => {
          setConfigModalVisible(false);
          setSelectedIntegration(null);
          form.resetFields();
        }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Integration Name"
            rules={[{ required: true, message: 'Please enter integration name' }]}
          >
            <Input disabled />
          </Form.Item>
          
          <Form.Item
            name="syncFrequency"
            label="Sync Frequency"
            rules={[{ required: true, message: 'Please select sync frequency' }]}
          >
            <Select>
              <Option value="Every 15 minutes">Every 15 minutes</Option>
              <Option value="Every 30 minutes">Every 30 minutes</Option>
              <Option value="Every hour">Every hour</Option>
              <Option value="Every 2 hours">Every 2 hours</Option>
              <Option value="Daily">Daily</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="status"
            label="Enable Integration"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          {selectedIntegration?.id === 'ga4' && (
            <>
              <Form.Item
                name="ga4PropertyId"
                label="GA4 Property ID"
              >
                <Input placeholder="Enter GA4 Property ID" />
              </Form.Item>
              
              <Form.Item
                name="ga4DataStream"
                label="Data Stream ID"
              >
                <Input placeholder="Enter Data Stream ID" />
              </Form.Item>
            </>
          )}
          
          {selectedIntegration?.id === 'umm' && (
            <>
              <Form.Item
                name="ummApiUrl"
                label="UMM API URL"
              >
                <Input placeholder="Enter UMM API endpoint URL" />
              </Form.Item>
              
              <Form.Item
                name="ummApiKey"
                label="API Key"
              >
                <Input.Password placeholder="Enter API key" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default Integrations;