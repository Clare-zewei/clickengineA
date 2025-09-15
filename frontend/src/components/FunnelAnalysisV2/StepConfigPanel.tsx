import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Typography, 
  Divider,
  Card,
  Tag,
  message,
  Alert
} from 'antd';
import { FunnelStepV2 } from '../../services/funnelAnalysisV2';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface StepConfigPanelProps {
  step: FunnelStepV2 | null;
  open: boolean;
  onClose: () => void;
  onSave: (step: FunnelStepV2) => void;
}

const ga4EventOptions = [
  { value: 'campaign_click', label: 'Campaign Click', category: 'Marketing' },
  { value: 'page_view', label: 'Page View', category: 'Navigation' },
  { value: 'sign_up', label: 'Sign Up', category: 'Conversion' },
  { value: 'login', label: 'Login', category: 'Authentication' },
  { value: 'trial_start', label: 'Trial Start', category: 'Conversion' },
  { value: 'purchase', label: 'Purchase', category: 'Revenue' },
  { value: 'feature_engagement', label: 'Feature Engagement', category: 'Product' },
  { value: 'content_view', label: 'Content View', category: 'Engagement' },
  { value: 'download', label: 'Download', category: 'Content' },
  { value: 'newsletter_signup', label: 'Newsletter Signup', category: 'Lead Generation' },
  { value: 'webinar_registration', label: 'Webinar Registration', category: 'Events' },
  { value: 'request_demo', label: 'Request Demo', category: 'Sales' },
  { value: 'contact_form_submit', label: 'Contact Form Submit', category: 'Lead Generation' }
];

const teamTurboActions = [
  { value: 'user_source_tracking', label: 'User Source Tracking', description: 'Track user acquisition source' },
  { value: 'page_visit', label: 'Page Visit', description: 'Record page visit event' },
  { value: 'user_registration', label: 'User Registration', description: 'Track new user registration' },
  { value: 'trial_signup', label: 'Trial Signup', description: 'Track trial conversions' },
  { value: 'purchase_complete', label: 'Purchase Complete', description: 'Track completed purchases' },
  { value: 'feature_usage', label: 'Feature Usage', description: 'Track feature engagement' },
  { value: 'content_interaction', label: 'Content Interaction', description: 'Track content engagement' },
  { value: 'lead_qualification', label: 'Lead Qualification', description: 'Qualify sales leads' }
];

const commonEventParameters = {
  'campaign_click': ['campaign_id', 'ad_group', 'keyword', 'creative_id'],
  'page_view': ['page_url', 'referrer', 'page_title', 'session_id'],
  'sign_up': ['method', 'source', 'campaign'],
  'login': ['method', 'success'],
  'trial_start': ['trial_type', 'plan', 'duration'],
  'purchase': ['transaction_id', 'value', 'currency', 'items'],
  'feature_engagement': ['feature_name', 'action_type', 'duration'],
  'content_view': ['content_type', 'content_id', 'category'],
  'download': ['file_name', 'file_type', 'source'],
  'newsletter_signup': ['list_id', 'source'],
  'webinar_registration': ['webinar_id', 'topic', 'date'],
  'request_demo': ['product_interest', 'company_size', 'urgency'],
  'contact_form_submit': ['form_type', 'inquiry_type', 'source']
};

const StepConfigPanel: React.FC<StepConfigPanelProps> = ({ 
  step, 
  open, 
  onClose, 
  onSave 
}) => {
  const [form] = Form.useForm();
  const [selectedEventParameters, setSelectedEventParameters] = useState<string[]>([]);
  const [isAdClickStep, setIsAdClickStep] = useState(false);
  const [isCustomStep, setIsCustomStep] = useState(false);
  
  useEffect(() => {
    if (step && open) {
      const isAdClick = step.ga4EventName === 'campaign_click';
      const isCustom = step.ga4EventName === 'custom_event' || step.name === 'Custom Step';
      
      setIsAdClickStep(isAdClick);
      setIsCustomStep(isCustom);
      
      form.setFieldsValue({
        name: step.name,
        description: step.description,
        ga4EventName: step.ga4EventName,
        eventParameters: step.eventParameters,
        teamTurboAction: step.teamTurboAction,
        utmCampaign: step.utmTemplate.campaign,
        utmSource: step.utmTemplate.source,
        utmMedium: step.utmTemplate.medium,
        utmTerm: step.utmTemplate.term,
        utmContent: step.utmTemplate.content,
        notes: step.notes,
        // Ad Click specific fields
        adType: step.adConfig?.adType,
        channel: step.adConfig?.channel,
        creativeFormat: step.adConfig?.creativeFormat,
        keywords: step.adConfig?.keywords
      });
      setSelectedEventParameters(step.eventParameters);
    }
  }, [step, open, form]);

  const handleGA4EventChange = (eventName: string) => {
    const defaultParams = commonEventParameters[eventName as keyof typeof commonEventParameters] || [];
    setSelectedEventParameters(defaultParams);
    form.setFieldsValue({ eventParameters: defaultParams });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (!step) return;

      // Validation for custom steps
      if (isCustomStep) {
        if (!values.name || !values.ga4EventName) {
          message.error('Step Name and GA4 Event Name are required for custom steps');
          return;
        }
        
        // Validate GA4 event name format
        const eventNamePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
        if (!eventNamePattern.test(values.ga4EventName)) {
          message.error('GA4 Event Name can only contain letters, numbers, and underscores');
          return;
        }
      }

      const updatedStep: FunnelStepV2 = {
        ...step,
        name: values.name,
        description: values.description,
        ga4EventName: values.ga4EventName,
        eventParameters: values.eventParameters || [],
        teamTurboAction: values.teamTurboAction,
        utmTemplate: {
          campaign: values.utmCampaign || '{campaign_name}',
          source: values.utmSource || '{source}',
          medium: values.utmMedium || '{medium}',
          term: values.utmTerm || '{term}',
          content: values.utmContent || '{content}'
        },
        notes: values.notes
      };

      // Add ad-specific configuration for Ad Click steps
      if (isAdClickStep) {
        updatedStep.adConfig = {
          adType: values.adType,
          channel: values.channel,
          creativeFormat: values.creativeFormat,
          keywords: values.keywords || []
        };
      }

      onSave(updatedStep);
      message.success('Step configuration saved');
    } catch (error) {
      message.error('Please fill in all required fields');
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title={step ? `Configure: ${step.name}` : 'Configure Step'}
      width={600}
      open={open}
      onClose={handleClose}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Space>
            <Button onClick={handleClose}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSave}>
              Save Configuration
            </Button>
          </Space>
        </div>
      }
    >
      {step && (
        <Form form={form} layout="vertical">
          {/* Custom Step Warning */}
          {isCustomStep && (
            <Alert
              message="⚠️ Custom Step Configuration"
              description="Please define all fields for your custom conversion step"
              type="warning"
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Basic Information */}
          <Card title="Basic Information" size="small" style={{ marginBottom: 16 }}>
            <Form.Item
              label="Step Name"
              name="name"
              rules={[{ required: true, message: 'Please enter step name' }]}
            >
              <Input placeholder="Enter step name" maxLength={50} />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[{ required: true, message: 'Please enter description' }]}
            >
              <TextArea 
                placeholder="Describe what happens in this step"
                rows={3}
              />
            </Form.Item>

            <Form.Item label="Notes" name="notes">
              <TextArea 
                placeholder="Additional notes or instructions"
                rows={2}
              />
            </Form.Item>
          </Card>

          {/* Analytics Configuration */}
          <Card title="Analytics Configuration" size="small" style={{ marginBottom: 16 }}>
            <Form.Item
              label="GA4 Event Name"
              name="ga4EventName"
              rules={[{ required: true, message: 'Please select GA4 event' }]}
            >
              <Select 
                placeholder="Select GA4 event"
                onChange={handleGA4EventChange}
                showSearch
                filterOption={(input, option) =>
                  option?.children && typeof option.children === 'string' 
                    ? (option.children as string).toLowerCase().indexOf(input.toLowerCase()) >= 0
                    : false
                }
              >
                {Object.entries(
                  ga4EventOptions.reduce((groups, option) => {
                    const { category } = option;
                    if (!groups[category]) {
                      groups[category] = [];
                    }
                    groups[category].push(option);
                    return groups;
                  }, {} as Record<string, typeof ga4EventOptions>)
                ).map(([category, options]) => (
                  <Select.OptGroup key={category} label={category}>
                    {options.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select.OptGroup>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Event Parameters"
              name="eventParameters"
              tooltip="Parameters to track with this event"
            >
              <Select
                mode="tags"
                placeholder="Add event parameters"
                value={selectedEventParameters}
                onChange={setSelectedEventParameters}
              >
                {(commonEventParameters[form.getFieldValue('ga4EventName') as keyof typeof commonEventParameters] || []).map(param => (
                  <Option key={param} value={param}>{param}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="TeamTurbo Action"
              name="teamTurboAction"
              rules={[{ required: true, message: 'Please select TeamTurbo action' }]}
            >
              <Select placeholder="Select TeamTurbo action">
                {teamTurboActions.map(action => (
                  <Option key={action.value} value={action.value}>
                    <div>
                      <div>{action.label}</div>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {action.description}
                      </Text>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Card>

          {/* Ad Click Special Configuration */}
          {isAdClickStep && (
            <Card title="Ad Campaign Details" size="small" style={{ marginBottom: 16 }}>
              <Form.Item label="Ad Type" name="adType">
                <Select placeholder="Select ad type">
                  <Option value="Search Ads">Search Ads</Option>
                  <Option value="Display Ads">Display Ads</Option>
                  <Option value="Social Media Ads">Social Media Ads</Option>
                  <Option value="Video">Video</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Channel" name="channel">
                <Select placeholder="Select channel">
                  <Option value="Google Ads">Google Ads</Option>
                  <Option value="Facebook">Facebook</Option>
                  <Option value="LinkedIn">LinkedIn</Option>
                  <Option value="TikTok">TikTok</Option>
                  <Option value="YouTube">YouTube</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Creative Format" name="creativeFormat">
                <Select placeholder="Select format">
                  <Option value="Text Only">Text Only</Option>
                  <Option value="Text + Image">Text + Image</Option>
                  <Option value="Video">Video</Option>
                  <Option value="Carousel">Carousel</Option>
                  <Option value="Collection">Collection</Option>
                  <Option value="Stories">Stories</Option>
                </Select>
              </Form.Item>

              <Form.Item label="Keywords" name="keywords">
                <Select
                  mode="tags"
                  placeholder="Add keywords"
                  style={{ width: '100%' }}
                >
                  <Option value="project management">project management</Option>
                  <Option value="saas">saas</Option>
                  <Option value="funnel analysis">funnel analysis</Option>
                </Select>
              </Form.Item>
            </Card>
          )}

          {/* UTM Template Configuration */}
          <Card title="UTM Template Configuration" size="small">
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">
                Use variables like {'{campaign_name}'}, {'{source}'}, {'{medium}'} for dynamic values
              </Text>
            </div>

            <Form.Item label="Campaign" name="utmCampaign">
              <Input placeholder="e.g., {campaign_name} or summer_sale_2025" />
            </Form.Item>

            <Form.Item label="Source" name="utmSource">
              <Input placeholder="e.g., {source} or google" />
            </Form.Item>

            <Form.Item label="Medium" name="utmMedium">
              <Input placeholder="e.g., {medium} or cpc" />
            </Form.Item>

            <Form.Item label="Term" name="utmTerm">
              <Input placeholder="e.g., {term} or saas_platform" />
            </Form.Item>

            <Form.Item label="Content" name="utmContent">
              <Input placeholder="e.g., {content} or header_cta" />
            </Form.Item>

            <div style={{ marginTop: 16, padding: 12, backgroundColor: '#f9f9f9', borderRadius: 6 }}>
              <Text strong style={{ fontSize: '12px' }}>Preview URL:</Text>
              <div style={{ fontSize: '11px', fontFamily: 'monospace', marginTop: 4 }}>
                https://example.com?utm_campaign={form.getFieldValue('utmCampaign') || '{campaign_name}'}&utm_source={form.getFieldValue('utmSource') || '{source}'}&utm_medium={form.getFieldValue('utmMedium') || '{medium}'}&utm_term={form.getFieldValue('utmTerm') || '{term}'}&utm_content={form.getFieldValue('utmContent') || '{content}'}
              </div>
            </div>
          </Card>
        </Form>
      )}
    </Drawer>
  );
};

export default StepConfigPanel;