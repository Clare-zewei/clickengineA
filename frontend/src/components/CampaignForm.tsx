import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Select, 
  InputNumber, 
  DatePicker, 
  Switch, 
  Row, 
  Col, 
  Alert,
  Divider,
  Typography,
  Button
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { InfoCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { mockDataService } from '../services/mockData';
import { Campaign, CampaignSummary, MarketingChannel, CampaignGoal } from '../types';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;

interface CampaignFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => Promise<void>;
  initialValues?: CampaignSummary;
  loading?: boolean;
}

const CampaignForm: React.FC<CampaignFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [channels, setChannels] = useState<MarketingChannel[]>([]);
  const [goals, setGoals] = useState<CampaignGoal[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      fetchFormData();
      if (initialValues) {
        const formValues = {
          ...initialValues,
          dates: initialValues.start_date && initialValues.end_date 
            ? [dayjs(initialValues.start_date), dayjs(initialValues.end_date)]
            : undefined
        };
        form.setFieldsValue(formValues);
      } else {
        form.resetFields();
      }
      setValidationErrors([]);
    }
  }, [visible, initialValues, form]);

  const fetchFormData = async () => {
    try {
      const [channelsData, goalsData] = await Promise.all([
        mockDataService.getChannels(),
        mockDataService.getCampaignGoals()
      ]);
      
      // Filter active channels only (no deduplication needed as data source should be unique)
      const activeChannels = channelsData.filter(channel => channel.is_active);
      
      setChannels(activeChannels);
      setGoals(goalsData || []);
    } catch (error) {
      console.error('Failed to fetch form data:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setValidationErrors([]);
      
      const formData = {
        ...values,
        start_date: values.dates?.[0]?.format('YYYY-MM-DD'),
        end_date: values.dates?.[1]?.format('YYYY-MM-DD'),
      };
      delete formData.dates;
      
      await onSubmit(formData);
      form.resetFields();
    } catch (error: any) {
      if (error.response?.data?.error?.message) {
        const errorMessage = error.response.data.error.message;
        if (errorMessage.includes('Validation failed:')) {
          const errors = errorMessage.replace('Validation failed: ', '').split(', ');
          setValidationErrors(errors);
        }
      }
    }
  };


  return (
    <Modal
      title={
        <Title level={3}>
          {initialValues ? 'Edit Campaign' : 'Create New Campaign'}
        </Title>
      }
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      confirmLoading={loading}
      width={800}
      destroyOnClose
    >
      {validationErrors.length > 0 && (
        <Alert
          message="Validation Errors"
          description={
            <ul style={{ marginBottom: 0, paddingLeft: 16 }}>
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          }
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          status: 'active',
          primary_goal: 'awareness',
          has_human_input: true,
          campaign_count: 1
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Campaign Name"
              rules={[{ required: true, message: 'Please enter campaign name' }]}
            >
              <Input placeholder="e.g. Q4 New User Acquisition" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="channel_id"
              label="Marketing Channel"
              rules={[{ required: true, message: 'Please select a marketing channel' }]}
            >
              <Select 
                placeholder="Select marketing channel"
                optionLabelProp="label"
                dropdownRender={(menu) => (
                  <div>
                    {menu}
                    <Divider style={{ margin: '8px 0' }} />
                    <Button 
                      type="link" 
                      icon={<PlusOutlined />}
                      onClick={() => window.open('/channels', '_blank')}
                      style={{ width: '100%', textAlign: 'left' }}
                    >
                      Create New Channel
                    </Button>
                  </div>
                )}
              >
                {channels.map(channel => (
                  <Option 
                    key={channel.id} 
                    value={channel.id}
                    label={channel.name}
                  >
                    <div>
                      <div style={{ fontWeight: 'bold' }}>{channel.name}</div>
                      <div style={{ fontSize: '12px', color: '#999' }}>
                        {channel.type} {channel.platform && `• ${channel.platform}`}
                      </div>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Budget & Spending</Divider>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="budget"
              label="Budget"
              rules={[{ type: 'number', min: 0, message: 'Budget must be positive' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder="5000"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="actual_ad_spend"
              label="Actual Ad Spend"
              rules={[{ type: 'number', min: 0, message: 'Ad spend must be positive' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder="4200"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="external_costs"
              label="External Design Costs"
              rules={[{ type: 'number', min: 0, message: 'External costs must be positive' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value!.replace(/\$\s?|(,*)/g, '')}
                placeholder="800"
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Campaign Details</Divider>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="primary_goal"
              label="Primary Goal"
              rules={[{ required: true, message: 'Please select primary goal' }]}
            >
              <Select placeholder="Select campaign goal">
                {goals.map(goal => (
                  <Option key={goal.name} value={goal.name}>
                    {goal.name.charAt(0).toUpperCase() + goal.name.slice(1)}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="campaign_count"
              label="Campaign Count (Ad Groups)"
              rules={[{ type: 'number', min: 1, message: 'Must have at least 1 campaign' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="3"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="dates" label="Campaign Period">
              <RangePicker 
                style={{ width: '100%' }}
                placeholder={['Start Date', 'End Date']}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="active">Active</Option>
                <Option value="paused">Paused</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="has_human_input"
              valuePropName="checked"
              style={{ marginBottom: 8 }}
            >
              <Switch
                checkedChildren="Yes"
                unCheckedChildren="No"
              />
              <Text style={{ marginLeft: 8 }}>Human Input Required</Text>
            </Form.Item>
            <Text type="secondary" style={{ fontSize: 12 }}>
              <InfoCircleOutlined /> Indicates if manual oversight or creative input is needed
            </Text>
          </Col>
        </Row>

        <Divider orientation="left">UTM Tracking (Optional)</Divider>
        
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="utm_source" label="UTM Source">
              <Input placeholder="google" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="utm_medium" label="UTM Medium">
              <Input placeholder="cpc" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="utm_campaign" label="UTM Campaign">
              <Input placeholder="q4_acquisition" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="utm_term" label="UTM Term">
              <Input placeholder="project management" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="utm_content" label="UTM Content">
              <Input placeholder="header_banner" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CampaignForm;