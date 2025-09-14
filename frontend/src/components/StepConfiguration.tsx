import React, { useState } from 'react';
import {
  Form,
  Input,
  Select,
  InputNumber,
  Card,
  Collapse,
  Row,
  Col,
  Typography,
  Space,
  Switch,
  Divider,
  Button
} from 'antd';
import {
  SettingOutlined,
  FileTextOutlined,
  PlayCircleOutlined,
  DownloadOutlined,
  UserOutlined,
  EyeOutlined,
  CrownOutlined,
  TagsOutlined,
  SearchOutlined,
  ShareAltOutlined,
  MailOutlined,
  LinkOutlined,
  ReadOutlined,
  CalendarOutlined,
  FormOutlined,
  DollarOutlined,
  ContactsOutlined,
  BellOutlined,
  LoginOutlined,
  ShopOutlined,
  ArrowUpOutlined,
  FileProtectOutlined,
  MoneyCollectOutlined,
  MobileOutlined,
  AppstoreOutlined
} from '@ant-design/icons';
import KeywordsInput from './KeywordsInput';

const { Text, Title } = Typography;
const { Option, OptGroup } = Select;
const { Panel } = Collapse;
const { TextArea } = Input;

// Step interface
interface StepType {
  value: string;
  label: string;
  icon: React.ReactElement;
  hasKeywords: boolean;
  hasConfig: boolean;
  badge?: string;
}

// Categorized step types structure
const STEP_CATEGORIES: Record<string, { label: string; steps: StepType[] }> = {
  acquisition: {
    label: 'Acquisition',
    steps: [
      { value: 'ad_click', label: 'Ad Click', icon: <TagsOutlined />, hasKeywords: true, hasConfig: true },
      { value: 'organic_search', label: 'Organic Search', icon: <SearchOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'social_referral', label: 'Social Referral', icon: <ShareAltOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'email_click', label: 'Email Click', icon: <MailOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'referral_link', label: 'Referral Link', icon: <LinkOutlined />, hasKeywords: false, hasConfig: false },
    ]
  },
  awareness: {
    label: 'Awareness',
    steps: [
      { value: 'page_view', label: 'Page View', icon: <EyeOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'content_view', label: 'Content View', icon: <FileTextOutlined />, hasKeywords: true, hasConfig: true },
      { value: 'video_watch', label: 'Video Watch', icon: <PlayCircleOutlined />, hasKeywords: true, hasConfig: true },
    ]
  },
  interest: {
    label: 'Interest',
    steps: [
      { value: 'resource_download', label: 'Resource Download', icon: <DownloadOutlined />, hasKeywords: true, hasConfig: true },
      { value: 'webinar_registration', label: 'Webinar Registration', icon: <CalendarOutlined />, hasKeywords: false, hasConfig: true },
    ]
  },
  trial: {
    label: 'Trial',
    steps: [
      { value: 'form_start', label: 'Form Start', icon: <FormOutlined />, hasKeywords: true, hasConfig: true },
      { value: 'view_pricing', label: 'View Pricing', icon: <DollarOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'request_demo', label: 'Request Demo', icon: <ContactsOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'contact_us', label: 'Contact Us', icon: <ContactsOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'newsletter_signup', label: 'Newsletter Signup', icon: <BellOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'user_registration', label: 'User Registration', icon: <LoginOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'start_trial', label: 'Start Trial', icon: <CrownOutlined />, hasKeywords: false, hasConfig: true },
    ]
  },
  custom: {
    label: 'Custom Events',
    steps: [
      { value: 'start_subscription', label: 'Start Subscription', icon: <ShopOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'upgrade_service', label: 'Upgrade Service', icon: <ArrowUpOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'sign_contract', label: 'Sign Contract', icon: <FileProtectOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'payment_success', label: 'Payment Success', icon: <MoneyCollectOutlined />, hasKeywords: false, hasConfig: false },
      { value: 'app_download', label: 'App Download', icon: <MobileOutlined />, hasKeywords: false, hasConfig: false, badge: 'Custom' },
      { value: 'whitepaper_view', label: 'Whitepaper View', icon: <ReadOutlined />, hasKeywords: false, hasConfig: false, badge: 'Custom' },
      { value: 'calculator_use', label: 'Calculator Use', icon: <AppstoreOutlined />, hasKeywords: false, hasConfig: false, badge: 'Custom' },
    ]
  }
};

// Step types that support keywords
const KEYWORD_SUPPORTED_STEPS = Object.values(STEP_CATEGORIES)
  .flatMap(category => category.steps)
  .filter(step => step.hasKeywords)
  .map(step => step.value);

export interface StepData {
  id?: string;
  step_type: string;
  step_name: string;
  ga4_event?: string;
  completion_goal?: number;
  
  // Ad configuration
  ad_type?: string;
  channel?: string;
  creative_format?: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  daily_budget?: number;
  
  // Content configuration
  content_type?: string;
  content_url?: string;
  resource_type?: string;
  file_format?: string;
  form_type?: string;
  page_type?: string;
  video_type?: string;
  video_platform?: string;
  
  // Trial configuration
  trial_length?: number;
  trial_type?: string;
  credit_card_required?: boolean;
  
  // Webinar configuration
  webinar_type?: string;
  webinar_platform?: string;
  
  // Keywords
  keywords?: string[];
  
  // Advanced configuration
  step_config?: any;
}

interface StepConfigurationProps {
  stepData: StepData;
  onChange: (data: StepData) => void;
  form: any;
  stepIndex: number;
}

const StepConfiguration: React.FC<StepConfigurationProps> = ({
  stepData,
  onChange,
  form,
  stepIndex
}) => {
  // Step configuration component with dynamic fields
  
  const handleFieldChange = (field: string, value: any) => {
    const updatedData = { ...stepData, [field]: value };
    onChange(updatedData);
  };
  
  const handleKeywordsChange = (keywords: string[]) => {
    handleFieldChange('keywords', keywords);
  };
  
  // Render step type selector with categories
  const renderStepTypeSelector = () => (
    <Form.Item
      label="Step Type"
      name={`step_${stepIndex}_type`}
      rules={[{ required: true, message: 'Please select a step type' }]}
    >
      <Select
        value={stepData.step_type}
        placeholder="Select step type"
        onChange={(value) => handleFieldChange('step_type', value)}
        showSearch
        filterOption={(input, option) =>
          (option?.title as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {Object.entries(STEP_CATEGORIES).map(([categoryKey, category]) => (
          <OptGroup key={categoryKey} label={category.label}>
            {category.steps.map((step) => (
              <Option key={step.value} value={step.value} title={step.label}>
                <Space>
                  {step.icon}
                  {step.label}
                  {step.badge && (
                    <span 
                      style={{ 
                        fontSize: '10px', 
                        color: '#1890ff', 
                        border: '1px solid #1890ff',
                        borderRadius: '2px',
                        padding: '0 4px',
                        marginLeft: '4px'
                      }}
                    >
                      {step.badge}
                    </span>
                  )}
                </Space>
              </Option>
            ))}
          </OptGroup>
        ))}
      </Select>
    </Form.Item>
  );
  
  // Render basic configuration
  const renderBasicConfiguration = () => (
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          label="Step Name"
          name={`step_${stepIndex}_name`}
          rules={[{ required: true, message: 'Please enter step name' }]}
        >
          <Input
            placeholder="Enter descriptive step name"
            onChange={(e) => handleFieldChange('step_name', e.target.value)}
          />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item
          label="GA4 Event (Optional)"
          name={`step_${stepIndex}_ga4_event`}
        >
          <Input
            placeholder="e.g., sign_up, purchase"
            onChange={(e) => handleFieldChange('ga4_event', e.target.value)}
          />
        </Form.Item>
      </Col>
    </Row>
  );
  
  // Render Ad Click configuration
  const renderAdClickConfig = () => (
    <>
      <Title level={5}>
        <TagsOutlined /> Ad Campaign Configuration
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Ad Type"
            name={`step_${stepIndex}_ad_type`}
            rules={[{ required: true, message: 'Please select ad type' }]}
          >
            <Select
              placeholder="Select ad type"
              onChange={(value) => handleFieldChange('ad_type', value)}
            >
              <Option value="search_ads">Search Ads</Option>
              <Option value="display_ads">Display Ads</Option>
              <Option value="video_ads">Video Ads</Option>
              <Option value="social_ads">Social Ads</Option>
              <Option value="native_ads">Native Ads</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Channel"
            name={`step_${stepIndex}_channel`}
            rules={[{ required: true, message: 'Please select channel' }]}
          >
            <Select
              placeholder="Select channel"
              onChange={(value) => handleFieldChange('channel', value)}
            >
              <Option value="google_ads">Google Ads</Option>
              <Option value="facebook_ads">Facebook Ads</Option>
              <Option value="linkedin_ads">LinkedIn Ads</Option>
              <Option value="twitter_ads">Twitter Ads</Option>
              <Option value="tiktok_ads">TikTok Ads</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Creative Format"
            name={`step_${stepIndex}_creative_format`}
            rules={[{ required: true, message: 'Please select creative format' }]}
          >
            <Select
              placeholder="Select creative format"
              onChange={(value) => handleFieldChange('creative_format', value)}
            >
              <Option value="text_only">Text Only</Option>
              <Option value="text_image">Text + Image</Option>
              <Option value="video">Video</Option>
              <Option value="carousel">Carousel</Option>
              <Option value="interactive">Interactive</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="UTM Campaign"
            name={`step_${stepIndex}_utm_campaign`}
          >
            <Input
              placeholder="e.g., pm_software_q4"
              onChange={(e) => handleFieldChange('utm_campaign', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="UTM Source"
            name={`step_${stepIndex}_utm_source`}
          >
            <Input
              placeholder="e.g., google, facebook"
              onChange={(e) => handleFieldChange('utm_source', e.target.value)}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="UTM Medium"
            name={`step_${stepIndex}_utm_medium`}
          >
            <Input
              placeholder="e.g., cpc, social"
              onChange={(e) => handleFieldChange('utm_medium', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Daily Budget ($)"
            name={`step_${stepIndex}_daily_budget`}
          >
            <InputNumber
              min={0}
              step={10}
              style={{ width: '100%' }}
              placeholder="Enter daily budget"
              onChange={(value) => handleFieldChange('daily_budget', value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
  
  // Render Content View configuration
  const renderContentViewConfig = () => (
    <>
      <Title level={5}>
        <FileTextOutlined /> Content Configuration
      </Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Content Type"
            name={`step_${stepIndex}_content_type`}
            rules={[{ required: true, message: 'Please select content type' }]}
          >
            <Select
              placeholder="Select content type"
              onChange={(value) => handleFieldChange('content_type', value)}
            >
              <Option value="blog_post">Blog Post</Option>
              <Option value="case_study">Case Study</Option>
              <Option value="product_page">Product Page</Option>
              <Option value="resource_page">Resource Page</Option>
              <Option value="landing_page">Landing Page</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Content URL"
            name={`step_${stepIndex}_content_url`}
            rules={[
              { required: true, message: 'Please enter content URL' },
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input
              placeholder="https://example.com/article"
              onChange={(e) => handleFieldChange('content_url', e.target.value)}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
  
  // Render Video Watch configuration
  const renderVideoWatchConfig = () => (
    <>
      <Title level={5}>
        <PlayCircleOutlined /> Video Configuration
      </Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Video Type"
            name={`step_${stepIndex}_video_type`}
            rules={[{ required: true, message: 'Please select video type' }]}
          >
            <Select
              placeholder="Select video type"
              onChange={(value) => handleFieldChange('video_type', value)}
            >
              <Option value="demo_video">Demo Video</Option>
              <Option value="tutorial_video">Tutorial Video</Option>
              <Option value="webinar_replay">Webinar Replay</Option>
              <Option value="product_overview">Product Overview</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Video Platform"
            name={`step_${stepIndex}_video_platform`}
            rules={[{ required: true, message: 'Please select platform' }]}
          >
            <Select
              placeholder="Select platform"
              onChange={(value) => handleFieldChange('video_platform', value)}
            >
              <Option value="youtube">YouTube</Option>
              <Option value="vimeo">Vimeo</Option>
              <Option value="wistia">Wistia</Option>
              <Option value="custom_player">Custom Player</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
  
  // Render Resource Download configuration
  const renderResourceDownloadConfig = () => (
    <>
      <Title level={5}>
        <DownloadOutlined /> Resource Configuration
      </Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Resource Type"
            name={`step_${stepIndex}_resource_type`}
            rules={[{ required: true, message: 'Please select resource type' }]}
          >
            <Select
              placeholder="Select resource type"
              onChange={(value) => handleFieldChange('resource_type', value)}
            >
              <Option value="whitepaper">Whitepaper</Option>
              <Option value="ebook">eBook</Option>
              <Option value="template">Template</Option>
              <Option value="checklist">Checklist</Option>
              <Option value="case_study">Case Study</Option>
              <Option value="tool">Tool</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="File Format"
            name={`step_${stepIndex}_file_format`}
            rules={[{ required: true, message: 'Please select file format' }]}
          >
            <Select
              placeholder="Select file format"
              onChange={(value) => handleFieldChange('file_format', value)}
            >
              <Option value="pdf">PDF</Option>
              <Option value="doc">DOC</Option>
              <Option value="xlsx">XLSX</Option>
              <Option value="zip">ZIP</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
  
  // Render Form Start configuration
  const renderFormStartConfig = () => (
    <>
      <Title level={5}>
        <UserOutlined /> Form Configuration
      </Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Form Type"
            name={`step_${stepIndex}_form_type`}
            rules={[{ required: true, message: 'Please select form type' }]}
          >
            <Select
              placeholder="Select form type"
              onChange={(value) => handleFieldChange('form_type', value)}
            >
              <Option value="trial_signup">Trial Signup</Option>
              <Option value="contact_form">Contact Form</Option>
              <Option value="demo_request">Demo Request</Option>
              <Option value="newsletter_signup">Newsletter Signup</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
  
  // Render Page View configuration
  const renderPageViewConfig = () => (
    <>
      <Title level={5}>
        <EyeOutlined /> Page Configuration
      </Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Page Type"
            name={`step_${stepIndex}_page_type`}
            rules={[{ required: true, message: 'Please select page type' }]}
          >
            <Select
              placeholder="Select page type"
              onChange={(value) => handleFieldChange('page_type', value)}
            >
              <Option value="home_page">Home Page</Option>
              <Option value="pricing_page">Pricing Page</Option>
              <Option value="features_page">Features Page</Option>
              <Option value="about_page">About Page</Option>
              <Option value="contact_page">Contact Page</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
  
  // Render Start Trial configuration
  const renderStartTrialConfig = () => (
    <>
      <Title level={5}>
        <CrownOutlined /> Trial Configuration
      </Title>
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item
            label="Trial Length (Days)"
            name={`step_${stepIndex}_trial_length`}
            rules={[{ required: true, message: 'Please enter trial length' }]}
          >
            <InputNumber
              min={1}
              max={365}
              style={{ width: '100%' }}
              placeholder="e.g., 30"
              onChange={(value) => handleFieldChange('trial_length', value)}
            />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Trial Type"
            name={`step_${stepIndex}_trial_type`}
            rules={[{ required: true, message: 'Please select trial type' }]}
          >
            <Select
              placeholder="Select trial type"
              onChange={(value) => handleFieldChange('trial_type', value)}
            >
              <Option value="full_access">Full Access</Option>
              <Option value="limited_features">Limited Features</Option>
              <Option value="usage_based">Usage Based</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item
            label="Credit Card Required"
            name={`step_${stepIndex}_credit_card_required`}
            valuePropName="checked"
          >
            <Switch
              onChange={(checked) => handleFieldChange('credit_card_required', checked)}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  );
  
  // Render Webinar Registration configuration
  const renderWebinarRegistrationConfig = () => (
    <>
      <Title level={5}>
        <CalendarOutlined /> Webinar Configuration
      </Title>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Webinar Type"
            name={`step_${stepIndex}_webinar_type`}
            rules={[{ required: true, message: 'Please select webinar type' }]}
          >
            <Select
              placeholder="Select webinar type"
              onChange={(value) => handleFieldChange('webinar_type', value)}
            >
              <Option value="product_demo">Product Demo</Option>
              <Option value="educational">Educational</Option>
              <Option value="training">Training</Option>
              <Option value="thought_leadership">Thought Leadership</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Platform"
            name={`step_${stepIndex}_webinar_platform`}
          >
            <Select
              placeholder="Select platform"
              onChange={(value) => handleFieldChange('webinar_platform', value)}
            >
              <Option value="zoom">Zoom</Option>
              <Option value="webex">WebEx</Option>
              <Option value="teams">Microsoft Teams</Option>
              <Option value="gotowebinar">GoToWebinar</Option>
              <Option value="custom">Custom Platform</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
  
  // Render step-specific configuration
  const renderStepSpecificConfig = () => {
    switch (stepData.step_type) {
      case 'ad_click':
        return renderAdClickConfig();
      case 'content_view':
        return renderContentViewConfig();
      case 'video_watch':
        return renderVideoWatchConfig();
      case 'resource_download':
        return renderResourceDownloadConfig();
      case 'form_start':
        return renderFormStartConfig();
      case 'page_view':
        return renderPageViewConfig();
      case 'start_trial':
        return renderStartTrialConfig();
      case 'webinar_registration':
        return renderWebinarRegistrationConfig();
      default:
        return null;
    }
  };
  
  // Render organized advanced configuration
  const renderAdvancedConfiguration = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Ad Campaign Details Group */}
        {stepData.step_type === 'ad_click' && (
          <div>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Ad Campaign Details:</Text>
            <Row gutter={[12, 8]}>
              <Col span={8}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Ad Type:</Text>
                <Select
                  size="small"
                  placeholder="Select ad type"
                  onChange={(value) => handleFieldChange('ad_type', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="search_ads">Search Ads</Option>
                  <Option value="display_ads">Display Ads</Option>
                  <Option value="video_ads">Video Ads</Option>
                  <Option value="social_ads">Social Ads</Option>
                </Select>
              </Col>
              <Col span={8}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Channel:</Text>
                <Select
                  size="small"
                  placeholder="Select channel"
                  onChange={(value) => handleFieldChange('channel', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="google_ads">Google Ads</Option>
                  <Option value="facebook_ads">Facebook Ads</Option>
                  <Option value="linkedin_ads">LinkedIn Ads</Option>
                  <Option value="twitter_ads">Twitter Ads</Option>
                </Select>
              </Col>
              <Col span={8}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Creative Format:</Text>
                <Select
                  size="small"
                  placeholder="Select format"
                  onChange={(value) => handleFieldChange('creative_format', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="text_only">Text Only</Option>
                  <Option value="text_image">Text + Image</Option>
                  <Option value="video">Video</Option>
                  <Option value="carousel">Carousel</Option>
                </Select>
              </Col>
            </Row>
            
            {/* Keywords for Ad Click */}
            <div style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Keywords:</Text>
              <KeywordsInput
                stepId={stepData.id}
                stepType={stepData.step_type}
                initialKeywords={stepData.keywords || []}
                onChange={handleKeywordsChange}
                placeholder="Enter ad keywords..."
                maxKeywords={15}
                showRecent={true}
              />
            </div>
          </div>
        )}
        
        {/* UTM Parameters Group */}
        {stepData.step_type === 'ad_click' && (
          <div>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>UTM Parameters:</Text>
            <Row gutter={[12, 8]}>
              <Col span={8}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Campaign:</Text>
                <Input
                  size="small"
                  placeholder="e.g., q4_campaign"
                  onChange={(e) => handleFieldChange('utm_campaign', e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Source:</Text>
                <Input
                  size="small"
                  placeholder="e.g., google"
                  onChange={(e) => handleFieldChange('utm_source', e.target.value)}
                />
              </Col>
              <Col span={8}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Medium:</Text>
                <Input
                  size="small"
                  placeholder="e.g., cpc"
                  onChange={(e) => handleFieldChange('utm_medium', e.target.value)}
                />
              </Col>
            </Row>
          </div>
        )}
        
        {/* Content Details Group */}
        {(stepData.step_type === 'content_view' || stepData.step_type === 'video_watch') && (
          <div>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Content Details:</Text>
            <Row gutter={[12, 8]}>
              <Col span={12}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Content Type:</Text>
                <Select
                  size="small"
                  placeholder="Select type"
                  onChange={(value) => handleFieldChange(stepData.step_type === 'video_watch' ? 'video_type' : 'content_type', value)}
                  style={{ width: '100%' }}
                >
                  {stepData.step_type === 'video_watch' ? (
                    <>
                      <Option value="demo_video">Demo Video</Option>
                      <Option value="tutorial_video">Tutorial Video</Option>
                      <Option value="webinar_replay">Webinar Replay</Option>
                      <Option value="product_overview">Product Overview</Option>
                    </>
                  ) : (
                    <>
                      <Option value="blog_post">Blog Post</Option>
                      <Option value="case_study">Case Study</Option>
                      <Option value="product_page">Product Page</Option>
                      <Option value="landing_page">Landing Page</Option>
                    </>
                  )}
                </Select>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>URL:</Text>
                <Input
                  size="small"
                  placeholder="https://example.com/content"
                  onChange={(e) => handleFieldChange('content_url', e.target.value)}
                />
              </Col>
            </Row>
            
            {/* Keywords for Content/Video */}
            <div style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Keywords:</Text>
              <KeywordsInput
                stepId={stepData.id}
                stepType={stepData.step_type}
                initialKeywords={stepData.keywords || []}
                onChange={handleKeywordsChange}
                placeholder={`Enter ${stepData.step_type.replace('_', ' ')} keywords...`}
                maxKeywords={15}
                showRecent={true}
              />
            </div>
          </div>
        )}
        
        {/* Resource Details Group */}
        {stepData.step_type === 'resource_download' && (
          <div>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Resource Details:</Text>
            <Row gutter={[12, 8]}>
              <Col span={12}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Resource Type:</Text>
                <Select
                  size="small"
                  placeholder="Select type"
                  onChange={(value) => handleFieldChange('resource_type', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="whitepaper">Whitepaper</Option>
                  <Option value="ebook">eBook</Option>
                  <Option value="template">Template</Option>
                  <Option value="checklist">Checklist</Option>
                  <Option value="case_study">Case Study</Option>
                </Select>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>File Format:</Text>
                <Select
                  size="small"
                  placeholder="Select format"
                  onChange={(value) => handleFieldChange('file_format', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="pdf">PDF</Option>
                  <Option value="doc">DOC</Option>
                  <Option value="xlsx">XLSX</Option>
                  <Option value="zip">ZIP</Option>
                </Select>
              </Col>
            </Row>
            
            {/* Keywords for Resource */}
            <div style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Keywords:</Text>
              <KeywordsInput
                stepId={stepData.id}
                stepType={stepData.step_type}
                initialKeywords={stepData.keywords || []}
                onChange={handleKeywordsChange}
                placeholder="Enter resource keywords..."
                maxKeywords={15}
                showRecent={true}
              />
            </div>
          </div>
        )}
        
        {/* Form Configuration Group */}
        {stepData.step_type === 'form_start' && (
          <div>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Form Configuration:</Text>
            <Row gutter={[12, 8]}>
              <Col span={12}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Form Type:</Text>
                <Select
                  size="small"
                  placeholder="Select form type"
                  onChange={(value) => handleFieldChange('form_type', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="trial_signup">Trial Signup</Option>
                  <Option value="contact_form">Contact Form</Option>
                  <Option value="demo_request">Demo Request</Option>
                  <Option value="newsletter_signup">Newsletter Signup</Option>
                </Select>
              </Col>
            </Row>
            
            {/* Keywords for Form */}
            <div style={{ marginTop: 8 }}>
              <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Keywords:</Text>
              <KeywordsInput
                stepId={stepData.id}
                stepType={stepData.step_type}
                initialKeywords={stepData.keywords || []}
                onChange={handleKeywordsChange}
                placeholder="Enter form keywords..."
                maxKeywords={15}
                showRecent={true}
              />
            </div>
          </div>
        )}
        
        {/* Trial Configuration Group */}
        {stepData.step_type === 'start_trial' && (
          <div>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Trial Configuration:</Text>
            <Row gutter={[12, 8]}>
              <Col span={8}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Trial Length (Days):</Text>
                <InputNumber
                  size="small"
                  min={1}
                  max={365}
                  placeholder="30"
                  onChange={(value) => handleFieldChange('trial_length', value)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col span={8}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Trial Type:</Text>
                <Select
                  size="small"
                  placeholder="Select type"
                  onChange={(value) => handleFieldChange('trial_type', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="full_access">Full Access</Option>
                  <Option value="limited_features">Limited Features</Option>
                  <Option value="usage_based">Usage Based</Option>
                </Select>
              </Col>
              <Col span={8}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Credit Card Required:</Text>
                <Switch
                  size="small"
                  onChange={(checked) => handleFieldChange('credit_card_required', checked)}
                />
              </Col>
            </Row>
          </div>
        )}
        
        {/* Webinar Configuration Group */}
        {stepData.step_type === 'webinar_registration' && (
          <div>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Webinar Configuration:</Text>
            <Row gutter={[12, 8]}>
              <Col span={12}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Webinar Type:</Text>
                <Select
                  size="small"
                  placeholder="Select type"
                  onChange={(value) => handleFieldChange('webinar_type', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="product_demo">Product Demo</Option>
                  <Option value="educational">Educational</Option>
                  <Option value="training">Training</Option>
                  <Option value="thought_leadership">Thought Leadership</Option>
                </Select>
              </Col>
              <Col span={12}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Platform:</Text>
                <Select
                  size="small"
                  placeholder="Select platform"
                  onChange={(value) => handleFieldChange('webinar_platform', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="zoom">Zoom</Option>
                  <Option value="webex">WebEx</Option>
                  <Option value="teams">Microsoft Teams</Option>
                  <Option value="gotowebinar">GoToWebinar</Option>
                </Select>
              </Col>
            </Row>
          </div>
        )}
        
        {/* Budget Group (only for ad_click) */}
        {stepData.step_type === 'ad_click' && (
          <div>
            <Text strong style={{ fontSize: 14, display: 'block', marginBottom: 8 }}>Budget:</Text>
            <Row gutter={[12, 8]}>
              <Col span={12}>
                <Text style={{ fontSize: 12, display: 'block', marginBottom: 4 }}>Daily Budget ($):</Text>
                <InputNumber
                  size="small"
                  min={0}
                  step={10}
                  placeholder="Enter daily budget"
                  onChange={(value) => handleFieldChange('daily_budget', value)}
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  };
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Get selected step info
  const getSelectedStepInfo = () => {
    for (const category of Object.values(STEP_CATEGORIES)) {
      const step = category.steps.find(s => s.value === stepData.step_type);
      if (step) return step;
    }
    return null;
  };
  
  const selectedStep = getSelectedStepInfo();
  
  // Auto-generate GA4 event mapping
  const getGA4Event = (stepType: string) => {
    const mapping: { [key: string]: string } = {
      'ad_click': 'click',
      'page_view': 'page_view',
      'content_view': 'page_view',
      'video_watch': 'video_start',
      'resource_download': 'file_download',
      'form_start': 'form_start',
      'user_registration': 'sign_up',
      'start_trial': 'begin_trial',
      'webinar_registration': 'lead',
      'view_pricing': 'view_item',
      'request_demo': 'generate_lead',
      'contact_us': 'generate_lead',
      'newsletter_signup': 'sign_up'
    };
    return mapping[stepType] || stepType;
  };
  
  return (
    <div style={{ 
      border: '1px solid #f0f0f0', 
      borderRadius: 6,
      padding: '12px 16px',
      marginBottom: 12,
      backgroundColor: '#fafafa'
    }}>
      {/* Compact One-Line Layout */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1 }}>
          {/* Step Number */}
          <Text strong style={{ minWidth: 20 }}>{stepIndex + 1}</Text>
          
          {/* Step Type Dropdown - Compact */}
          <div style={{ minWidth: 200 }}>
            <Select
              value={stepData.step_type}
              placeholder="Select step type"
              onChange={(value) => handleFieldChange('step_type', value)}
              size="small"
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) =>
                (option?.title as string)?.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {Object.entries(STEP_CATEGORIES).map(([categoryKey, category]) => (
                <OptGroup key={categoryKey} label={category.label}>
                  {category.steps.map((step) => (
                    <Option key={step.value} value={step.value} title={step.label}>
                      <Space>
                        {step.icon}
                        {step.label}
                        {step.badge && (
                          <span style={{ fontSize: '10px', color: '#1890ff', border: '1px solid #1890ff', borderRadius: '2px', padding: '0 4px' }}>
                            {step.badge}
                          </span>
                        )}
                      </Space>
                    </Option>
                  ))}
                </OptGroup>
              ))}
            </Select>
          </div>
          
          {/* GA4 Event Display */}
          {stepData.step_type && (
            <Text type="secondary" style={{ fontSize: 12 }}>
              GA4 Event: <code>{getGA4Event(stepData.step_type)}</code>
            </Text>
          )}
        </div>
        
        {/* Advanced Configuration Toggle */}
        {stepData.step_type && (selectedStep?.hasConfig || KEYWORD_SUPPORTED_STEPS.includes(stepData.step_type)) && (
          <Button
            type="text"
            size="small"
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{ fontSize: 12 }}
          >
            {showAdvanced ? '⏵' : '⏷'} Advanced Configuration
          </Button>
        )}
      </div>
      
      {/* Collapsible Advanced Configuration */}
      {showAdvanced && stepData.step_type && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #e8e8e8' }}>
          {renderAdvancedConfiguration()}
        </div>
      )}
    </div>
  );
};

export default StepConfiguration;