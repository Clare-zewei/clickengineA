import React from 'react';
import { Card, Row, Col, Typography, Tag, Button, Space } from 'antd';
import {
  RocketOutlined,
  ExperimentOutlined,
  ReadOutlined,
  PlusOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  complexity: 'Simple' | 'Medium' | 'Complex';
  expectedConversion: string;
  icon: React.ReactNode;
  color: string;
  defaultSteps: Array<{
    type: string;
    name: string;
    required: boolean;
    icon: string;
    color: string;
  }>;
}

const templates: FunnelTemplate[] = [
  {
    id: 'direct-conversion',
    name: 'Direct Conversion',
    description: 'Simple direct conversion for high-intent users',
    complexity: 'Simple',
    expectedConversion: '30.0%',
    icon: <RocketOutlined />,
    color: '#52c41a',
    defaultSteps: [
      { type: 'ad_click', name: 'Ad Click', required: true, icon: '🎯', color: 'green' },
      { type: 'page_view', name: 'Landing Page View', required: true, icon: '👁️', color: 'blue' },
      { type: 'sign_up', name: 'User Registration', required: true, icon: '✍️', color: 'orange' },
      { type: 'login', name: 'First Login', required: false, icon: '🔐', color: 'blue' },
      { type: 'trial', name: 'Trial Start', required: false, icon: '🚀', color: 'purple' },
      { type: 'pricing', name: 'Pricing View', required: false, icon: '💰', color: 'gold' },
      { type: 'purchase', name: 'Payment Completed', required: true, icon: '✅', color: 'green' }
    ]
  },
  {
    id: 'trial-to-paid',
    name: 'Trial-to-Paid',
    description: 'Standard SaaS trial conversion funnel',
    complexity: 'Medium',
    expectedConversion: '15.0%',
    icon: <ExperimentOutlined />,
    color: '#1890ff',
    defaultSteps: [
      { type: 'ad_click', name: 'Ad Click', required: true, icon: '🎯', color: 'green' },
      { type: 'page_view', name: 'Landing Page View', required: true, icon: '👁️', color: 'blue' },
      { type: 'sign_up', name: 'User Registration', required: true, icon: '✍️', color: 'orange' },
      { type: 'email_verify', name: 'Email Verification', required: false, icon: '📧', color: 'cyan' },
      { type: 'login', name: 'First Login', required: true, icon: '🔐', color: 'blue' },
      { type: 'onboarding', name: 'Onboarding', required: false, icon: '🎯', color: 'purple' },
      { type: 'trial', name: 'Trial Start', required: true, icon: '🚀', color: 'purple' },
      { type: 'feature_use', name: 'Feature Usage', required: false, icon: '⚡', color: 'orange' },
      { type: 'pricing', name: 'Pricing View', required: true, icon: '💰', color: 'gold' },
      { type: 'purchase', name: 'Payment Completed', required: true, icon: '✅', color: 'green' }
    ]
  },
  {
    id: 'content-marketing',
    name: 'Content Marketing',
    description: 'Long-term content-driven conversion',
    complexity: 'Complex',
    expectedConversion: '8.0%',
    icon: <ReadOutlined />,
    color: '#722ed1',
    defaultSteps: [
      { type: 'ad_click', name: 'Ad Click', required: true, icon: '🎯', color: 'green' },
      { type: 'blog_view', name: 'Blog Article View', required: true, icon: '📖', color: 'blue' },
      { type: 'content_download', name: 'Content Download', required: false, icon: '📥', color: 'cyan' },
      { type: 'newsletter', name: 'Newsletter Signup', required: false, icon: '📨', color: 'purple' },
      { type: 'webinar', name: 'Webinar Registration', required: false, icon: '🎥', color: 'red' },
      { type: 'sign_up', name: 'User Registration', required: true, icon: '✍️', color: 'orange' },
      { type: 'login', name: 'First Login', required: true, icon: '🔐', color: 'blue' },
      { type: 'trial', name: 'Trial Start', required: true, icon: '🚀', color: 'purple' },
      { type: 'pricing', name: 'Pricing View', required: true, icon: '💰', color: 'gold' },
      { type: 'purchase', name: 'Payment Completed', required: true, icon: '✅', color: 'green' }
    ]
  }
];

interface TemplateSelectorProps {
  onSelectTemplate: (template: FunnelTemplate | null) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelectTemplate }) => {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple':
        return 'green';
      case 'Medium':
        return 'orange';
      case 'Complex':
        return 'red';
      default:
        return 'default';
    }
  };

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'Simple':
        return <CheckCircleOutlined />;
      case 'Medium':
        return <ClockCircleOutlined />;
      case 'Complex':
        return <FireOutlined />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Title level={2}>Choose a Funnel Template</Title>
        <Paragraph type="secondary">
          Select a pre-built template to get started quickly, or create a custom funnel from scratch
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {templates.map((template) => (
          <Col xs={24} sm={12} lg={6} key={template.id}>
            <Card
              hoverable
              style={{ height: '100%', borderColor: template.color }}
              bodyStyle={{ padding: 24 }}
              onClick={() => onSelectTemplate(template)}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ 
                  fontSize: 48, 
                  color: template.color,
                  marginBottom: 8
                }}>
                  {template.icon}
                </div>
                <Title level={4} style={{ marginBottom: 8 }}>
                  {template.name}
                </Title>
                <Tag 
                  color={getComplexityColor(template.complexity)}
                  icon={getComplexityIcon(template.complexity)}
                >
                  {template.complexity}
                </Tag>
              </div>

              <Paragraph 
                type="secondary" 
                style={{ 
                  minHeight: 48,
                  fontSize: 13,
                  marginBottom: 16 
                }}
              >
                {template.description}
              </Paragraph>

              <div style={{ marginBottom: 16 }}>
                <Text strong>Expected Conversion:</Text>
                <div style={{ 
                  fontSize: 24, 
                  fontWeight: 'bold',
                  color: template.color 
                }}>
                  {template.expectedConversion}
                </div>
              </div>

              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {template.defaultSteps.length} steps
                </Text>
                <div style={{ marginTop: 8 }}>
                  {template.defaultSteps.slice(0, 3).map((step, index) => (
                    <span key={index} style={{ marginRight: 8 }}>
                      {step.icon}
                    </span>
                  ))}
                  {template.defaultSteps.length > 3 && (
                    <Text type="secondary">+{template.defaultSteps.length - 3} more</Text>
                  )}
                </div>
              </div>

              <Button 
                type="primary" 
                block 
                style={{ 
                  marginTop: 16,
                  backgroundColor: template.color,
                  borderColor: template.color
                }}
              >
                Use Template
              </Button>
            </Card>
          </Col>
        ))}

        {/* Custom Template Card */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            hoverable
            style={{ 
              height: '100%', 
              borderStyle: 'dashed',
              borderColor: '#d9d9d9'
            }}
            bodyStyle={{ 
              padding: 24,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 400
            }}
            onClick={() => onSelectTemplate(null)}
          >
            <PlusOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
            <Title level={4} style={{ color: '#595959', marginBottom: 8 }}>
              Custom Funnel
            </Title>
            <Paragraph type="secondary" style={{ textAlign: 'center' }}>
              Build your own funnel from scratch with custom steps
            </Paragraph>
            <Button type="dashed" block style={{ marginTop: 16 }}>
              Start from Scratch
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TemplateSelector;