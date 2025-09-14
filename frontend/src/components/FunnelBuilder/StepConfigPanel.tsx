import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Divider,
  message
} from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { FunnelStep } from './FunnelStepsList';
import KeywordsManager from './KeywordsManager';

const { Title, Text } = Typography;
const { Option } = Select;

interface StepConfigPanelProps {
  step: FunnelStep | null;
  open: boolean;
  onClose: () => void;
  onSave: (step: FunnelStep) => void;
}

const StepConfigPanel: React.FC<StepConfigPanelProps> = ({ step, open, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    if (step) {
      form.setFieldsValue({
        name: step.name,
        ga4Event: step.ga4Event,
        adType: step.config?.adType,
        channel: step.config?.channel,
        creativeFormat: step.config?.creativeFormat,
        utmCampaign: step.config?.utm?.campaign,
        utmSource: step.config?.utm?.source,
        utmMedium: step.config?.utm?.medium
      });
      setKeywords(step.config?.keywords || []);
    }
  }, [step, form]);

  const handleSave = () => {
    form.validateFields().then(values => {
      if (!step) return;

      const updatedStep: FunnelStep = {
        ...step,
        name: values.name,
        ga4Event: values.ga4Event,
        config: {
          ...(step.type === 'ad_click' && {
            adType: values.adType,
            channel: values.channel,
            creativeFormat: values.creativeFormat,
            keywords: keywords
          }),
          utm: {
            campaign: values.utmCampaign,
            source: values.utmSource,
            medium: values.utmMedium
          }
        }
      };

      onSave(updatedStep);
      form.resetFields();
      setKeywords([]);
    }).catch(error => {
      message.error('Please fill in all required fields');
    });
  };

  const handleKeywordsChange = (newKeywords: string[]) => {
    setKeywords(newKeywords);
  };

  const isAdClickStep = step?.type === 'ad_click';

  return (
    <Drawer
      title={
        <Space>
          <span>{step?.icon}</span>
          <span>Configure {step?.name}</span>
        </Space>
      }
      placement="right"
      width={480}
      open={open}
      onClose={onClose}
      extra={
        <Space>
          <Button onClick={onClose} icon={<CloseOutlined />}>
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave} icon={<SaveOutlined />}>
            Save
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        {/* Basic Configuration */}
        <Title level={5}>Basic Configuration</Title>
        
        <Form.Item
          label="Step Name"
          name="name"
          rules={[{ required: true, message: 'Please enter step name' }]}
        >
          <Input placeholder="Enter step name" />
        </Form.Item>

        <Form.Item
          label="GA4 Event Name"
          name="ga4Event"
          rules={[{ required: true, message: 'Please enter GA4 event name' }]}
        >
          <Input placeholder="e.g., campaign_click, page_view" />
        </Form.Item>

        <Divider />

        {/* Ad Click Specific Configuration */}
        {isAdClickStep && (
          <>
            <Title level={5}>Ad Campaign Details</Title>
            
            <Form.Item
              label="Ad Type"
              name="adType"
            >
              <Select placeholder="Select ad type">
                <Option value="search_ads">Search Ads</Option>
                <Option value="display_ads">Display Ads</Option>
                <Option value="video_ads">Video Ads</Option>
                <Option value="social_ads">Social Ads</Option>
                <Option value="shopping_ads">Shopping Ads</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Channel"
              name="channel"
            >
              <Select placeholder="Select channel">
                <Option value="google_ads">Google Ads</Option>
                <Option value="facebook_ads">Facebook Ads</Option>
                <Option value="linkedin_ads">LinkedIn Ads</Option>
                <Option value="twitter_ads">Twitter Ads</Option>
                <Option value="instagram_ads">Instagram Ads</Option>
                <Option value="youtube_ads">YouTube Ads</Option>
                <Option value="tiktok_ads">TikTok Ads</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Creative Format"
              name="creativeFormat"
            >
              <Select placeholder="Select format">
                <Option value="text_only">Text Only</Option>
                <Option value="text_image">Text + Image</Option>
                <Option value="video">Video</Option>
                <Option value="carousel">Carousel</Option>
                <Option value="collection">Collection</Option>
                <Option value="stories">Stories</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Keywords">
              <KeywordsManager
                keywords={keywords}
                onChange={handleKeywordsChange}
                placeholder="Enter ad keywords..."
                maxKeywords={15}
              />
            </Form.Item>

            <Divider />
          </>
        )}

        {/* UTM Parameters - Available for all steps */}
        <Title level={5}>UTM Parameters</Title>
        
        <Form.Item
          label="Campaign"
          name="utmCampaign"
          tooltip="UTM Campaign parameter for tracking"
        >
          <Input placeholder="e.g., summer_sale_2024" />
        </Form.Item>

        <Form.Item
          label="Source"
          name="utmSource"
          tooltip="UTM Source parameter for tracking"
        >
          <Input placeholder="e.g., google, facebook" />
        </Form.Item>

        <Form.Item
          label="Medium"
          name="utmMedium"
          tooltip="UTM Medium parameter for tracking"
        >
          <Input placeholder="e.g., cpc, email, social" />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default StepConfigPanel;