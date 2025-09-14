import React, { useState } from 'react';
import { 
  Card, 
  Button, 
  Space, 
  Typography, 
  Input, 
  Select, 
  Form,
  message,
  Empty,
  Modal,
  Tag
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import StepItem from './StepItem';
import StepConfigPanel from './StepConfigPanel';
import { FunnelTemplate } from './TemplateSelector';

const { Title, Text } = Typography;
const { Option } = Select;

export interface FunnelStep {
  id: string;
  type: string;
  name: string;
  ga4Event?: string;
  icon: string;
  color: string;
  required?: boolean;
  config?: {
    adType?: string;
    channel?: string;
    creativeFormat?: string;
    keywords?: string[];
    utm?: {
      campaign?: string;
      source?: string;
      medium?: string;
    };
  };
}

interface FunnelStepsListProps {
  template: FunnelTemplate | null;
  onBack: () => void;
}

const availableStepTypes = [
  { type: 'ad_click', name: 'Ad Click', icon: '🎯', color: 'green' },
  { type: 'page_view', name: 'Page View', icon: '👁️', color: 'blue' },
  { type: 'sign_up', name: 'Sign Up', icon: '✍️', color: 'orange' },
  { type: 'login', name: 'Login', icon: '🔐', color: 'blue' },
  { type: 'email_verify', name: 'Email Verification', icon: '📧', color: 'cyan' },
  { type: 'onboarding', name: 'Onboarding', icon: '🎯', color: 'purple' },
  { type: 'trial', name: 'Trial Start', icon: '🚀', color: 'purple' },
  { type: 'feature_use', name: 'Feature Usage', icon: '⚡', color: 'orange' },
  { type: 'pricing', name: 'Pricing View', icon: '💰', color: 'gold' },
  { type: 'purchase', name: 'Purchase', icon: '✅', color: 'green' },
  { type: 'blog_view', name: 'Blog View', icon: '📖', color: 'blue' },
  { type: 'content_download', name: 'Content Download', icon: '📥', color: 'cyan' },
  { type: 'newsletter', name: 'Newsletter Signup', icon: '📨', color: 'purple' },
  { type: 'webinar', name: 'Webinar Registration', icon: '🎥', color: 'red' },
  { type: 'demo_request', name: 'Demo Request', icon: '🎪', color: 'magenta' },
  { type: 'contact', name: 'Contact Us', icon: '📞', color: 'volcano' },
  { type: 'custom', name: 'Custom Step', icon: '⚙️', color: 'default' }
];

const FunnelStepsList: React.FC<FunnelStepsListProps> = ({ template, onBack }) => {
  const [form] = Form.useForm();
  const [steps, setSteps] = useState<FunnelStep[]>(() => {
    if (template) {
      return template.defaultSteps.map((step, index) => ({
        id: `step_${index + 1}`,
        ...step,
        ga4Event: getDefaultGA4Event(step.type)
      }));
    }
    return [];
  });
  const [editingStep, setEditingStep] = useState<FunnelStep | null>(null);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [newStepType, setNewStepType] = useState<string>('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function getDefaultGA4Event(stepType: string): string {
    const mapping: { [key: string]: string } = {
      'ad_click': 'campaign_click',
      'page_view': 'page_view',
      'sign_up': 'sign_up',
      'login': 'login',
      'email_verify': 'email_verification',
      'onboarding': 'onboarding_start',
      'trial': 'trial_start',
      'feature_use': 'feature_engagement',
      'pricing': 'view_pricing',
      'purchase': 'purchase',
      'blog_view': 'content_view',
      'content_download': 'download',
      'newsletter': 'newsletter_signup',
      'webinar': 'webinar_registration',
      'demo_request': 'request_demo',
      'contact': 'contact_form_submit'
    };
    return mapping[stepType] || stepType;
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleEditStep = (step: FunnelStep) => {
    setEditingStep(step);
    setIsConfigPanelOpen(true);
  };

  const handleDeleteStep = (stepId: string) => {
    Modal.confirm({
      title: 'Delete Step',
      content: 'Are you sure you want to delete this step?',
      onOk: () => {
        setSteps(steps.filter(s => s.id !== stepId));
        message.success('Step deleted successfully');
      }
    });
  };

  const handleUpdateStep = (updatedStep: FunnelStep) => {
    setSteps(steps.map(s => s.id === updatedStep.id ? updatedStep : s));
    setIsConfigPanelOpen(false);
    setEditingStep(null);
    message.success('Step updated successfully');
  };

  const handleAddStep = () => {
    if (!newStepType) {
      message.error('Please select a step type');
      return;
    }

    const stepTypeInfo = availableStepTypes.find(s => s.type === newStepType);
    if (!stepTypeInfo) return;

    const newStep: FunnelStep = {
      id: `step_${Date.now()}`,
      type: newStepType,
      name: stepTypeInfo.name,
      icon: stepTypeInfo.icon,
      color: stepTypeInfo.color,
      ga4Event: getDefaultGA4Event(newStepType),
      config: {
        utm: {}
      }
    };

    setSteps([...steps, newStep]);
    setIsAddStepModalOpen(false);
    setNewStepType('');
    message.success('Step added successfully');
  };

  const handleSaveFunnel = () => {
    form.validateFields().then(values => {
      const funnelData = {
        ...values,
        steps: steps
      };
      console.log('Saving funnel:', funnelData);
      message.success('Funnel template saved successfully!');
      // TODO: API call to save funnel
    }).catch(error => {
      message.error('Please fill in all required fields');
    });
  };

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={onBack}
          >
            Back to Templates
          </Button>
          <Button 
            type="primary" 
            icon={<SaveOutlined />}
            onClick={handleSaveFunnel}
          >
            Save Funnel
          </Button>
        </Space>
      </div>

      {/* Title */}
      <Title level={3} style={{ marginBottom: 24 }}>
        Funnel Template Configuration
      </Title>

      {/* Basic Information */}
      <Card style={{ marginBottom: 24 }}>
        <Title level={4} style={{ marginBottom: 16 }}>Template Basic Information</Title>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Template Name"
            name="templateName"
            rules={[{ required: true, message: 'Please enter template name' }]}
            initialValue={template?.name}
          >
            <Input placeholder="Enter template name" />
          </Form.Item>

          <Space style={{ width: '100%' }} size="large">
            <Form.Item
              label="Target Users"
              name="targetUsers"
              style={{ minWidth: 200 }}
              rules={[{ required: true, message: 'Please select target users' }]}
            >
              <Select placeholder="Select target users">
                <Option value="b2b">B2B Enterprise</Option>
                <Option value="b2c">B2C Consumer</Option>
                <Option value="smb">Small Business</Option>
                <Option value="developer">Developers</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Business Goal"
              name="businessGoal"
              style={{ minWidth: 200 }}
              rules={[{ required: true, message: 'Please select business goal' }]}
            >
              <Select placeholder="Select business goal">
                <Option value="trial_conversion">Trial Conversion</Option>
                <Option value="direct_sale">Direct Sale</Option>
                <Option value="lead_generation">Lead Generation</Option>
                <Option value="user_activation">User Activation</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Budget Range"
              name="budgetRange"
              style={{ minWidth: 200 }}
            >
              <Select placeholder="Select budget range">
                <Option value="0-1000">$0 - $1,000</Option>
                <Option value="1000-5000">$1,000 - $5,000</Option>
                <Option value="5000-10000">$5,000 - $10,000</Option>
                <Option value="10000+">$10,000+</Option>
              </Select>
            </Form.Item>
          </Space>
        </Form>
      </Card>

      {/* Funnel Steps */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            Funnel Steps
            <Text type="secondary" style={{ fontSize: 14, marginLeft: 8 }}>
              (Drag to reorder)
            </Text>
          </Title>
          <Button 
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddStepModalOpen(true)}
          >
            Add Step
          </Button>
        </div>

        {steps.length === 0 ? (
          <Empty
            description="No steps added yet"
            style={{ padding: '40px 0' }}
          >
            <Button 
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsAddStepModalOpen(true)}
            >
              Add Your First Step
            </Button>
          </Empty>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={steps.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div style={{ position: 'relative' }}>
                {steps.map((step, index) => (
                  <div key={step.id}>
                    <StepItem
                      step={step}
                      index={index}
                      onEdit={handleEditStep}
                      onDelete={handleDeleteStep}
                    />
                    {index < steps.length - 1 && (
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center',
                        margin: '8px 0'
                      }}>
                        <ArrowDownOutlined style={{ 
                          fontSize: 20, 
                          color: '#bfbfbf'
                        }} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </Card>

      {/* Step Configuration Panel */}
      <StepConfigPanel
        step={editingStep}
        open={isConfigPanelOpen}
        onClose={() => {
          setIsConfigPanelOpen(false);
          setEditingStep(null);
        }}
        onSave={handleUpdateStep}
      />

      {/* Add Step Modal */}
      <Modal
        title="Add New Step"
        open={isAddStepModalOpen}
        onOk={handleAddStep}
        onCancel={() => {
          setIsAddStepModalOpen(false);
          setNewStepType('');
        }}
      >
        <Form.Item label="Select Step Type">
          <Select
            placeholder="Choose a step type"
            value={newStepType}
            onChange={setNewStepType}
            style={{ width: '100%' }}
          >
            {availableStepTypes.map(stepType => (
              <Option key={stepType.type} value={stepType.type}>
                <Space>
                  <span>{stepType.icon}</span>
                  <span>{stepType.name}</span>
                  <Tag color={stepType.color}>{stepType.type}</Tag>
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Modal>
    </div>
  );
};

export default FunnelStepsList;