import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Layout, 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Space, 
  Typography, 
  Steps,
  message,
  Divider,
  Modal,
  Drawer
} from 'antd';
import {
  ArrowLeftOutlined,
  SaveOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { funnelAnalysisV2Service, FunnelV2, FunnelStepV2 } from '../services/funnelAnalysisV2';
import StepConfigPanel from '../components/FunnelAnalysisV2/StepConfigPanel';

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

interface FunnelAnalysisV2BuilderProps {
  funnelId?: string;
  onBack?: () => void;
  onSave?: (funnel: FunnelV2) => void;
}

const stepTemplates = [
  {
    type: 'ad_click',
    name: 'Ad Click',
    description: 'User clicks on advertisement',
    ga4EventName: 'campaign_click',
    eventParameters: ['campaign_id', 'ad_group', 'keyword'],
    teamTurboAction: 'user_source_tracking',
    icon: '🎯'
  },
  {
    type: 'page_view',
    name: 'Page View',
    description: 'User views landing page',
    ga4EventName: 'page_view',
    eventParameters: ['page_url', 'referrer'],
    teamTurboAction: 'page_visit',
    icon: '👁️'
  },
  {
    type: 'sign_up',
    name: 'Sign Up',
    description: 'User creates account',
    ga4EventName: 'sign_up',
    eventParameters: ['method'],
    teamTurboAction: 'user_registration',
    icon: '📝'
  },
  {
    type: 'login',
    name: 'Login',
    description: 'User logs into account',
    ga4EventName: 'login',
    eventParameters: ['method', 'success'],
    teamTurboAction: 'user_login',
    icon: '🔐'
  },
  {
    type: 'email_verify',
    name: 'Email Verification',
    description: 'User verifies email address',
    ga4EventName: 'email_verification',
    eventParameters: ['verification_method'],
    teamTurboAction: 'email_verified',
    icon: '✉️'
  },
  {
    type: 'onboarding',
    name: 'Onboarding',
    description: 'User completes onboarding',
    ga4EventName: 'onboarding_start',
    eventParameters: ['step', 'completion'],
    teamTurboAction: 'onboarding_completed',
    icon: '🚀'
  },
  {
    type: 'trial',
    name: 'Trial Start',
    description: 'User starts free trial',
    ga4EventName: 'trial_start',
    eventParameters: ['trial_type', 'plan'],
    teamTurboAction: 'trial_signup',
    icon: '⭐'
  },
  {
    type: 'feature_use',
    name: 'Feature Usage',
    description: 'User uses key features',
    ga4EventName: 'feature_engagement',
    eventParameters: ['feature_name', 'action_type'],
    teamTurboAction: 'feature_usage',
    icon: '⚡'
  },
  {
    type: 'pricing',
    name: 'Pricing View',
    description: 'User views pricing page',
    ga4EventName: 'view_pricing',
    eventParameters: ['plan_type', 'source'],
    teamTurboAction: 'pricing_viewed',
    icon: '💰'
  },
  {
    type: 'purchase',
    name: 'Purchase',
    description: 'User completes purchase',
    ga4EventName: 'purchase',
    eventParameters: ['transaction_id', 'value', 'currency'],
    teamTurboAction: 'purchase_complete',
    icon: '💳'
  },
  {
    type: 'blog_view',
    name: 'Blog View',
    description: 'User reads blog content',
    ga4EventName: 'content_view',
    eventParameters: ['content_type', 'content_id'],
    teamTurboAction: 'content_engagement',
    icon: '📖'
  },
  {
    type: 'content_download',
    name: 'Content Download',
    description: 'User downloads content',
    ga4EventName: 'download',
    eventParameters: ['file_name', 'file_type'],
    teamTurboAction: 'content_downloaded',
    icon: '⬇️'
  },
  {
    type: 'newsletter',
    name: 'Newsletter Signup',
    description: 'User subscribes to newsletter',
    ga4EventName: 'newsletter_signup',
    eventParameters: ['list_id', 'source'],
    teamTurboAction: 'newsletter_subscribed',
    icon: '📧'
  },
  {
    type: 'webinar',
    name: 'Webinar Registration',
    description: 'User registers for webinar',
    ga4EventName: 'webinar_registration',
    eventParameters: ['webinar_id', 'topic'],
    teamTurboAction: 'webinar_registered',
    icon: '🎥'
  },
  {
    type: 'demo_request',
    name: 'Demo Request',
    description: 'User requests product demo',
    ga4EventName: 'request_demo',
    eventParameters: ['product_interest', 'company_size'],
    teamTurboAction: 'demo_requested',
    icon: '📞'
  },
  {
    type: 'contact',
    name: 'Contact Us',
    description: 'User submits contact form',
    ga4EventName: 'contact_form_submit',
    eventParameters: ['form_type', 'inquiry_type'],
    teamTurboAction: 'contact_submitted',
    icon: '📞'
  },
  {
    type: 'custom',
    name: 'Custom Step',
    description: 'Define your own conversion event',
    ga4EventName: 'custom_event',
    eventParameters: [],
    teamTurboAction: 'custom_action',
    icon: '⚙️'
  }
];

const FunnelAnalysisV2Builder: React.FC<FunnelAnalysisV2BuilderProps> = ({ 
  funnelId, 
  onBack, 
  onSave 
}) => {
  const location = useLocation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [funnel, setFunnel] = useState<FunnelV2 | null>(null);
  const [steps, setSteps] = useState<FunnelStepV2[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<FunnelStepV2 | null>(null);
  
  // Add state for form values to trigger re-renders
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    targetCount: '',
    targetPeriod: 'month',
    status: 'testing'
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Helper function to update both form and state
  const updateFormValue = (field: string, value: any) => {
    form.setFieldValue(field, value);
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (funnelId) {
      loadFunnel();
    } else if (location.state?.copyFrom) {
      // Handle copy functionality
      const originalFunnel = location.state.copyFrom as FunnelV2;
      handleCopyFunnel(originalFunnel);
    }
  }, [funnelId, location.state]);

  const handleCopyFunnel = (originalFunnel: FunnelV2) => {
    // Pre-fill form with copied data
    const copiedValues = {
      name: `${originalFunnel.name} - Copy`,
      description: originalFunnel.description,
      targetCount: originalFunnel.targetGoal.count.toString(),
      targetPeriod: originalFunnel.targetGoal.period,
      status: 'testing' // Set to testing for copied funnels
    };
    
    form.setFieldsValue(copiedValues);
    setFormValues(copiedValues);

    // Copy all steps with new IDs
    const copiedSteps = originalFunnel.steps.map((step, index) => ({
      ...step,
      id: `step_${Date.now()}_${index}` // Generate new IDs
    }));

    setSteps(copiedSteps);
    message.success(`Copying funnel: ${originalFunnel.name}`);
  };

  const loadFunnel = async () => {
    if (!funnelId) return;
    
    try {
      setLoading(true);
      const data = await funnelAnalysisV2Service.getFunnelById(funnelId);
      if (data) {
        setFunnel(data);
        setSteps(data.steps);
        
        const initialValues = {
          name: data.name,
          description: data.description,
          targetCount: data.targetGoal.count.toString(),
          targetPeriod: data.targetGoal.period,
          status: data.status
        };
        
        form.setFieldsValue(initialValues);
        setFormValues(initialValues);
      }
    } catch (error) {
      message.error('Failed to load funnel');
    } finally {
      setLoading(false);
    }
  };

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

  const handleAddStep = (template: any) => {
    const newStep: FunnelStepV2 = {
      id: `step_${Date.now()}`,
      name: template.name,
      description: template.description,
      ga4EventName: template.ga4EventName,
      eventParameters: template.eventParameters,
      teamTurboAction: template.teamTurboAction,
      icon: template.icon,
      utmTemplate: {
        campaign: '{campaign_name}',
        source: '{source}',
        medium: '{medium}',
        term: '{term}',
        content: '{content}'
      },
      // Initialize ad config for ad click steps
      ...(template.type === 'ad_click' && {
        adConfig: {
          adType: '',
          channel: '',
          creativeFormat: '',
          keywords: []
        }
      })
    };

    setSteps([...steps, newStep]);
    setIsAddStepModalOpen(false);
    
    // If it's a custom step, automatically open config panel
    if (template.type === 'custom') {
      setEditingStep(newStep);
      setIsConfigPanelOpen(true);
    }
    
    message.success(`${template.name} step added`);
  };

  const handleEditStep = (step: FunnelStepV2) => {
    setEditingStep(step);
    setIsConfigPanelOpen(true);
  };

  const handleDeleteStep = (stepId: string) => {
    Modal.confirm({
      title: 'Delete Step',
      content: 'Are you sure you want to delete this step?',
      okText: 'Delete',
      okType: 'danger',
      onOk: () => {
        setSteps(steps.filter(s => s.id !== stepId));
        message.success('Step deleted successfully');
      }
    });
  };

  const handleUpdateStep = (updatedStep: FunnelStepV2) => {
    setSteps(steps.map(s => s.id === updatedStep.id ? updatedStep : s));
    setIsConfigPanelOpen(false);
    setEditingStep(null);
    message.success('Step configuration saved');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Debug: Log the current form values for verification
      console.log('Component formValues state:', formValues);
      console.log('Current step index:', currentStepIndex);
      
      // Use the component's formValues state for validation (more reliable)
      if (!formValues.name) {
        message.error('Funnel name is required');
        setCurrentStepIndex(0); // Go back to basic info step
        return;
      }
      if (!formValues.description) {
        message.error('Description is required');
        setCurrentStepIndex(0);
        return;
      }
      if (!formValues.targetCount) {
        message.error('Target count is required');
        setCurrentStepIndex(0);
        return;
      }
      if (!formValues.targetPeriod) {
        message.error('Target period is required');
        setCurrentStepIndex(0);
        return;
      }
      if (!formValues.status) {
        message.error('Status is required');
        setCurrentStepIndex(0);
        return;
      }
      
      if (steps.length === 0) {
        message.error('Please add at least one step to the funnel');
        setCurrentStepIndex(1); // Go to steps configuration
        return;
      }
      
      const funnelData = {
        name: formValues.name,
        description: formValues.description,
        targetGoal: {
          count: parseInt(formValues.targetCount),
          period: formValues.targetPeriod as 'month' | 'week'
        },
        status: formValues.status as 'active' | 'testing' | 'paused',
        steps: steps
      };

      console.log('About to save funnel data:', funnelData);
      console.log('FunnelId:', funnelId, 'Existing funnel:', funnel);

      let savedFunnel: FunnelV2;
      
      if (funnelId && funnel) {
        console.log('Updating existing funnel...');
        // Update existing funnel
        const updated = await funnelAnalysisV2Service.updateFunnel(funnelId, funnelData);
        console.log('Update result:', updated);
        if (!updated) throw new Error('Failed to update funnel');
        savedFunnel = updated;
        message.success('Funnel updated successfully');
      } else {
        console.log('Creating new funnel...');
        // Create new funnel
        savedFunnel = await funnelAnalysisV2Service.createFunnel(funnelData);
        console.log('Create result:', savedFunnel);
        message.success('Funnel created successfully');
      }

      console.log('Calling onSave with:', savedFunnel);
      if (onSave) {
        onSave(savedFunnel);
      }
    } catch (error: any) {
      console.error('Error saving funnel:', error);
      message.error('Failed to save funnel');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const values = await form.getFieldsValue();
      await funnelAnalysisV2Service.saveDraft({
        ...values,
        steps: steps
      });
      message.success('Draft saved');
    } catch (error) {
      message.error('Failed to save draft');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={onBack}
            >
              Back to Dashboard
            </Button>
            <Space>
              <Button onClick={handleSaveDraft}>
                Save Draft
              </Button>
              <Button 
                type="primary" 
                icon={<SaveOutlined />}
                loading={loading}
                onClick={handleSave}
              >
                {funnelId ? 'Update Funnel' : 'Create Funnel'}
              </Button>
            </Space>
          </Space>
        </div>

        <Title level={2} style={{ marginBottom: 24 }}>
          {funnelId ? 'Edit Funnel' : 'Create New Funnel'}
        </Title>

        {/* Progress Steps */}
        <Card style={{ marginBottom: 24 }}>
          <Steps current={currentStepIndex} style={{ marginBottom: 24 }}>
            <Step title="Basic Information" description="Name, description, goals" />
            <Step title="Funnel Steps" description="Configure conversion steps" />
            <Step title="Review & Save" description="Final review and save" />
          </Steps>
        </Card>

        {/* Main Form - Always rendered but hidden when not on step 0 */}
        <Form form={form} layout="vertical" style={{ display: 'none' }}>
          <Form.Item
            label="Funnel Name"
            name="name"
            rules={[{ required: true, message: 'Please enter funnel name' }]}
          >
            <Input placeholder="Enter funnel name" />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea 
              placeholder="Describe the purpose and goals of this funnel"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            label="Target Goal"
            name="targetCount"
            rules={[{ required: true, message: 'Please enter target count' }]}
          >
            <Input 
              type="number" 
              placeholder="Target conversions"
              addonAfter="conversions"
            />
          </Form.Item>

          <Form.Item
            label="Time Period"
            name="targetPeriod"
            rules={[{ required: true, message: 'Please select period' }]}
            initialValue="month"
          >
            <Select>
              <Option value="week">Per Week</Option>
              <Option value="month">Per Month</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select status' }]}
            initialValue="testing"
          >
            <Select>
              <Option value="testing">Testing</Option>
              <Option value="active">Active</Option>
              <Option value="paused">Paused</Option>
            </Select>
          </Form.Item>
        </Form>

        {/* Step 1: Basic Information Display */}
        {currentStepIndex === 0 && (
          <Card title="Basic Information" style={{ marginBottom: 24 }}>
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Funnel Name *</label>
                <Input 
                  placeholder="Enter funnel name" 
                  value={formValues.name}
                  onChange={(e) => updateFormValue('name', e.target.value)}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Description *</label>
                <Input.TextArea 
                  placeholder="Describe the purpose and goals of this funnel"
                  rows={3}
                  value={formValues.description}
                  onChange={(e) => updateFormValue('description', e.target.value)}
                />
              </div>

              <Space size="large">
                <div style={{ minWidth: 200 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Target Goal *</label>
                  <Input 
                    type="number" 
                    placeholder="Target conversions"
                    addonAfter="conversions"
                    value={formValues.targetCount}
                    onChange={(e) => updateFormValue('targetCount', e.target.value)}
                  />
                </div>

                <div style={{ minWidth: 150 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Time Period *</label>
                  <Select 
                    value={formValues.targetPeriod}
                    onChange={(value) => updateFormValue('targetPeriod', value)}
                  >
                    <Option value="week">Per Week</Option>
                    <Option value="month">Per Month</Option>
                  </Select>
                </div>

                <div style={{ minWidth: 150 }}>
                  <label style={{ display: 'block', marginBottom: 8, fontWeight: 'bold' }}>Status *</label>
                  <Select 
                    value={formValues.status}
                    onChange={(value) => updateFormValue('status', value)}
                  >
                    <Option value="testing">Testing</Option>
                    <Option value="active">Active</Option>
                    <Option value="paused">Paused</Option>
                  </Select>
                </div>
              </Space>

              <div style={{ marginTop: 24, textAlign: 'right' }}>
                <Button 
                  type="primary" 
                  onClick={() => setCurrentStepIndex(1)}
                >
                  Next: Configure Steps
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Step 2: Configure Steps */}
        {currentStepIndex === 1 && (
          <Card title={`Funnel Steps (${steps.length})`}>
            <div style={{ marginBottom: 16 }}>
              <Button 
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setIsAddStepModalOpen(true)}
              >
                Add Step
              </Button>
            </div>

            {steps.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Text type="secondary">No steps added yet. Click "Add Step" to get started.</Text>
              </div>
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
                  <div>
                    {steps.map((step, index) => (
                      <Card 
                        key={step.id}
                        size="small" 
                        style={{ marginBottom: 8 }}
                        title={
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: 8 }}>{step.icon || '⚙️'}</span>
                            <Text strong>Step {index + 1}: {step.name}</Text>
                          </div>
                        }
                        extra={
                          <Space>
                            <Button 
                              type="text" 
                              icon={<EditOutlined />}
                              size="small"
                              onClick={() => handleEditStep(step)}
                            >
                              Edit
                            </Button>
                            <Button 
                              type="text" 
                              icon={<DeleteOutlined />}
                              danger
                              size="small"
                              onClick={() => handleDeleteStep(step.id)}
                            >
                              Delete
                            </Button>
                          </Space>
                        }
                      >
                        <Text type="secondary">{step.description}</Text>
                        <Divider style={{ margin: '8px 0' }} />
                        <Space size="large">
                          <Text>
                            <strong>GA4 Event:</strong> {step.ga4EventName}
                          </Text>
                          <Text>
                            <strong>Action:</strong> {step.teamTurboAction}
                          </Text>
                        </Space>
                      </Card>
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            <div style={{ marginTop: 24, textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setCurrentStepIndex(0)}>
                  Previous: Basic Info
                </Button>
                <Button 
                  type="primary" 
                  onClick={() => setCurrentStepIndex(2)}
                  disabled={steps.length === 0}
                >
                  Next: Review & Save
                </Button>
              </Space>
            </div>
          </Card>
        )}

        {/* Step 3: Review & Save */}
        {currentStepIndex === 2 && (
          <Card title="Review & Save">
            <div style={{ marginBottom: 24 }}>
              <Title level={4}>Funnel Summary</Title>
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text strong>Name: </Text>
                  <Text>{formValues.name || 'Not specified'}</Text>
                </div>
                <div>
                  <Text strong>Description: </Text>
                  <Text>{formValues.description || 'Not specified'}</Text>
                </div>
                <div>
                  <Text strong>Target Goal: </Text>
                  <Text>{formValues.targetCount || '0'} conversions per {formValues.targetPeriod}</Text>
                </div>
                <div>
                  <Text strong>Status: </Text>
                  <Text>{formValues.status}</Text>
                </div>
                <div>
                  <Text strong>Steps: </Text>
                  <Text>{steps.length} steps configured</Text>
                </div>
              </Space>
            </div>

            <Divider />

            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setCurrentStepIndex(1)}>
                  Previous: Configure Steps
                </Button>
                <Button 
                  type="primary" 
                  size="large"
                  icon={<SaveOutlined />}
                  loading={loading}
                  onClick={handleSave}
                >
                  {funnelId ? 'Update Funnel' : 'Create Funnel'}
                </Button>
              </Space>
            </div>
          </Card>
        )}

        {/* Add Step Modal */}
        <Modal
          title="Add New Step"
          open={isAddStepModalOpen}
          onCancel={() => setIsAddStepModalOpen(false)}
          footer={null}
          width={600}
        >
          <div style={{ marginBottom: 16 }}>
            <Text strong>Create Custom Step:</Text>
            <br />
            <Button 
              style={{ marginTop: 8 }}
              icon={stepTemplates.find(t => t.type === 'custom')?.icon}
              onClick={() => handleAddStep(stepTemplates.find(t => t.type === 'custom'))}
            >
              + Create Custom Step - Define your own conversion event
            </Button>
          </div>

          <Divider />

          <div>
            <Text strong>Or select from templates:</Text>
            
            <div style={{ marginTop: 16 }}>
              <Title level={5}>Marketing & Ads</Title>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: 16 }}>
                {stepTemplates.filter(t => ['ad_click', 'page_view', 'blog_view'].includes(t.type)).map(template => (
                  <Button 
                    key={template.type}
                    style={{ textAlign: 'left', height: 'auto', padding: '8px 12px' }}
                    onClick={() => handleAddStep(template)}
                  >
                    <div>
                      <span style={{ marginRight: 8 }}>{template.icon}</span>
                      <strong>{template.name}</strong>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{template.type}</Text>
                    </div>
                  </Button>
                ))}
              </div>

              <Title level={5}>User Actions</Title>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: 16 }}>
                {stepTemplates.filter(t => ['sign_up', 'login', 'email_verify', 'onboarding'].includes(t.type)).map(template => (
                  <Button 
                    key={template.type}
                    style={{ textAlign: 'left', height: 'auto', padding: '8px 12px' }}
                    onClick={() => handleAddStep(template)}
                  >
                    <div>
                      <span style={{ marginRight: 8 }}>{template.icon}</span>
                      <strong>{template.name}</strong>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{template.type}</Text>
                    </div>
                  </Button>
                ))}
              </div>

              <Title level={5}>Business Events</Title>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8, marginBottom: 16 }}>
                {stepTemplates.filter(t => ['trial', 'feature_use', 'pricing', 'purchase'].includes(t.type)).map(template => (
                  <Button 
                    key={template.type}
                    style={{ textAlign: 'left', height: 'auto', padding: '8px 12px' }}
                    onClick={() => handleAddStep(template)}
                  >
                    <div>
                      <span style={{ marginRight: 8 }}>{template.icon}</span>
                      <strong>{template.name}</strong>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{template.type}</Text>
                    </div>
                  </Button>
                ))}
              </div>

              <Title level={5}>Engagement</Title>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 8 }}>
                {stepTemplates.filter(t => ['content_download', 'newsletter', 'webinar', 'demo_request', 'contact'].includes(t.type)).map(template => (
                  <Button 
                    key={template.type}
                    style={{ textAlign: 'left', height: 'auto', padding: '8px 12px' }}
                    onClick={() => handleAddStep(template)}
                  >
                    <div>
                      <span style={{ marginRight: 8 }}>{template.icon}</span>
                      <strong>{template.name}</strong>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>{template.type}</Text>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Modal>

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
      </Content>
    </Layout>
  );
};

export default FunnelAnalysisV2Builder;