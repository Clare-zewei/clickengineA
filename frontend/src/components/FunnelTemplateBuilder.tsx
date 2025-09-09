import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Select,
  Button,
  Card,
  Row,
  Col,
  Space,
  Typography,
  Divider,
  Alert,
  Tag,
  Tooltip,
  Switch,
  Statistic,
  message
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  DollarCircleOutlined,
  TrophyOutlined
} from '@ant-design/icons';
import { FunnelTemplate, GA4Event, CustomEvent, FunnelTemplateStep } from '../services/mockData';
import { mockDataService, validateFunnelTemplate, calculateTotalConversion, identifyDropOffPoints } from '../services/mockData';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface FunnelTemplateBuilderProps {
  template?: FunnelTemplate | null;
  ga4Events: GA4Event[];
  customEvents: CustomEvent[];
  onSave: (template: FunnelTemplate) => void;
  onCancel: () => void;
}

const FunnelTemplateBuilder: React.FC<FunnelTemplateBuilderProps> = ({
  template,
  ga4Events,
  customEvents,
  onSave,
  onCancel
}) => {
  const [form] = Form.useForm();
  const [steps, setSteps] = useState<FunnelTemplateStep[]>([]);
  const [saving, setSaving] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const allEvents = [...ga4Events, ...customEvents];

  useEffect(() => {
    if (template) {
      form.setFieldsValue({
        name: template.name,
        businessGoal: template.businessGoal,
        targetUsers: template.targetUsers,
        budgetRange: template.budgetRange,
        description: template.description,
        isActive: template.isActive
      });
      setSteps(template.steps);
    } else {
      // Initialize with first step
      addStep();
    }
  }, [template, form]);

  useEffect(() => {
    updatePreview();
  }, [steps]);

  const businessGoalOptions = [
    { value: 'acquisition', label: 'Customer Acquisition' },
    { value: 'activation', label: 'User Activation' },
    { value: 'upgrade', label: 'Paid Upgrade' },
    { value: 'retention', label: 'Customer Retention' }
  ];

  const targetUsersOptions = [
    { value: 'b2b_enterprise', label: 'B2B Enterprises' },
    { value: 'individual', label: 'Individual Consumers' },
    { value: 'smb', label: 'SMBs' },
    { value: 'large_enterprise', label: 'Large Enterprises' }
  ];

  const budgetRangeOptions = [
    { value: '$500-1000', label: '$500-1,000' },
    { value: '$1000-5000', label: '$1,000-5,000' },
    { value: '$5000-15000', label: '$5,000-15,000' },
    { value: '$15000-50000', label: '$15,000-50,000' },
    { value: '$50000+', label: '$50,000+' }
  ];

  const addStep = () => {
    const newStep: FunnelTemplateStep = {
      id: `step_${Date.now()}`,
      stepNumber: steps.length + 1,
      event: allEvents[0], // Default to first event
      targetConversionRate: allEvents[0]?.estimatedConversion || 100
    };
    setSteps([...steps, newStep]);
  };

  const removeStep = (stepId: string) => {
    const updatedSteps = steps.filter(step => step.id !== stepId);
    // Renumber steps
    const renumberedSteps = updatedSteps.map((step, index) => ({
      ...step,
      stepNumber: index + 1
    }));
    setSteps(renumberedSteps);
  };

  const updateStep = (stepId: string, updates: Partial<FunnelTemplateStep>) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    ));
  };

  const updatePreview = () => {
    if (steps.length === 0) {
      setPreviewData(null);
      return;
    }

    // Calculate overall conversion rate using target rates
    const totalConversion = calculateTotalConversion(steps, false);

    // Estimate CAC based on step count and complexity
    const complexity = steps.length + steps.filter(s => s.event.isCustom).length * 0.5;
    const baseCost = 50;
    const estimatedCAC = Math.round(baseCost * complexity);

    // Estimate ROI (simplified calculation)
    const avgRevenuePerCustomer = 300; // Assumption
    const estimatedROI = avgRevenuePerCustomer / estimatedCAC;

    // Find drop-off points (steps with <30% conversion)
    const dropOffPoints = identifyDropOffPoints(steps, 30);

    setPreviewData({
      totalConversion,
      estimatedCAC,
      estimatedROI,
      dropOffPoints,
      complexity: complexity.toFixed(1)
    });
  };

  const validateTemplate = (): boolean => {
    try {
      const templateData = {
        name: form.getFieldValue('name'),
        businessGoal: form.getFieldValue('businessGoal'),
        targetUsers: form.getFieldValue('targetUsers'),
        budgetRange: form.getFieldValue('budgetRange'),
        steps
      };

      const validation = validateFunnelTemplate(templateData);
      
      if (!validation.isValid) {
        // Show first error as primary message
        message.error(validation.errors[0]);
        
        // Show additional errors as warnings if there are multiple
        if (validation.errors.length > 1) {
          validation.errors.slice(1, 3).forEach(error => {
            message.warning(error);
          });
        }
        
        return false;
      }

      // Additional business logic validation
      const stageOrder = ['acquisition', 'awareness', 'interest', 'trial', 'conversion'];
      let lastStageIndex = -1;
      
      for (const step of steps) {
        const currentStageIndex = stageOrder.indexOf(step.event.stage);
        if (currentStageIndex < lastStageIndex && Math.abs(currentStageIndex - lastStageIndex) > 1) {
          message.warning('Funnel flow may not be logically ordered. Consider reordering steps for better conversion.');
        }
        lastStageIndex = Math.max(lastStageIndex, currentStageIndex);
      }

      return true;
    } catch (error) {
      message.error('Validation error occurred');
      console.error('Template validation error:', error);
      return false;
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      
      if (!validateTemplate()) return;

      setSaving(true);

      const templateData = {
        ...values,
        steps,
        targetTotalConversion: previewData?.totalConversion || 0,
        estimatedCAC: previewData?.estimatedCAC || 0,
        estimatedROI: previewData?.estimatedROI || 0,
        isActive: values.isActive ?? true
      };

      let savedTemplate: FunnelTemplate;

      if (template) {
        savedTemplate = await mockDataService.updateFunnelTemplate(template.id, templateData);
      } else {
        savedTemplate = await mockDataService.saveFunnelTemplate(templateData);
      }

      onSave(savedTemplate);
    } catch (error) {
      console.error('Save error:', error);
      message.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const renderStepBuilder = () => {
    return (
      <Card title="Funnel Step Configuration" style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {steps.map((step, index) => (
            <Card key={step.id} size="small" style={{ backgroundColor: '#fafafa' }}>
              <Row gutter={16} align="middle">
                <Col span={1}>
                  <Text strong>{step.stepNumber}</Text>
                </Col>
                <Col span={8}>
                  <Select
                    value={step.event.id}
                    onChange={(eventId) => {
                      const event = allEvents.find(e => e.id === eventId);
                      if (event) {
                        updateStep(step.id, {
                          event,
                          targetConversionRate: event.estimatedConversion || step.targetConversionRate
                        });
                      }
                    }}
                    style={{ width: '100%' }}
                    placeholder="Select Event"
                  >
                    {Object.entries(
                      allEvents.reduce((groups, event) => {
                        const group = event.isCustom ? 'Custom Events' : event.stage;
                        if (!groups[group]) groups[group] = [];
                        groups[group].push(event);
                        return groups;
                      }, {} as Record<string, GA4Event[]>)
                    ).map(([groupName, groupEvents]) => (
                      <Select.OptGroup key={groupName} label={groupName}>
                        {groupEvents.map(event => (
                          <Option key={event.id} value={event.id}>
                            <Space>
                              {event.name}
                              {event.isCustom && <Tag color="purple">Custom</Tag>}
                            </Space>
                          </Option>
                        ))}
                      </Select.OptGroup>
                    ))}
                  </Select>
                </Col>
                <Col span={6}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <div style={{ fontSize: 11, color: '#666' }}>Target Rate:</div>
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      suffix="%"
                      size="small"
                      value={step.targetConversionRate}
                      onChange={(e) => updateStep(step.id, { 
                        targetConversionRate: parseFloat(e.target.value) || 0 
                      })}
                      placeholder="Target %"
                    />
                    {step.actualConversionRate !== undefined && (
                      <div style={{ fontSize: 11, color: '#666' }}>
                        Actual: {step.actualConversionRate}%
                        {step.performanceStatus && (
                          <Tag 
                            color={
                              step.performanceStatus === 'success' ? 'green' :
                              step.performanceStatus === 'warning' ? 'orange' :
                              step.performanceStatus === 'danger' ? 'red' : 'default'
                            }
                            style={{ marginLeft: 4, fontSize: 10 }}
                          >
                            {step.performanceVariance}
                          </Tag>
                        )}
                      </div>
                    )}
                  </div>
                </Col>
                <Col span={6}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    GA4 Event: {step.event.ga4EventId || 'Not specified'}
                  </Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    {step.event.description}
                  </Text>
                </Col>
                <Col span={3}>
                  <Space>
                    {step.targetConversionRate && step.targetConversionRate < 30 && (
                      <Tooltip title="Potential drop-off point - consider optimization">
                        <WarningOutlined style={{ color: '#faad14' }} />
                      </Tooltip>
                    )}
                    {steps.length > 2 && (
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                        onClick={() => removeStep(step.id)}
                      />
                    )}
                  </Space>
                </Col>
              </Row>
            </Card>
          ))}

          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addStep}
            disabled={steps.length >= 6}
            style={{ width: '100%' }}
          >
            Add Funnel Step {steps.length >= 6 && '(Maximum 6 steps)'}
          </Button>
        </Space>
      </Card>
    );
  };

  const renderPreview = () => {
    if (!previewData) return null;

    return (
      <Card 
        title={
          <Space>
            <TrophyOutlined />
            Funnel Template Preview
          </Space>
        } 
        style={{ marginTop: 16 }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Target Conversion"
                value={previewData.totalConversion}
                precision={2}
                suffix="%"
                valueStyle={{ color: previewData.totalConversion > 5 ? '#52c41a' : '#faad14' }}
              />
              {steps.some(step => step.actualConversionRate !== undefined) && (
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  <Text type="secondary">Actual Performance:</Text>
                  <br />
                  <Text strong style={{ color: '#1890ff' }}>
                    {calculateTotalConversion(steps, true).toFixed(2)}%
                  </Text>
                </div>
              )}
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Estimated CAC"
                value={previewData.estimatedCAC}
                prefix="$"
                valueStyle={{ color: previewData.estimatedCAC < 100 ? '#52c41a' : '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small">
              <Statistic
                title="Estimated ROI"
                value={previewData.estimatedROI}
                precision={1}
                suffix="x"
                valueStyle={{ color: previewData.estimatedROI > 3 ? '#52c41a' : '#faad14' }}
              />
            </Card>
          </Col>
        </Row>

        <Divider />

        {/* Performance Comparison Section */}
        {steps.some(step => step.actualConversionRate !== undefined) && (
          <>
            <Alert
              type="info"
              showIcon
              message="Performance vs Target Analysis"
              description={
                <div style={{ marginTop: 8 }}>
                  {steps.map((step, index) => {
                    if (step.actualConversionRate === undefined) return null;
                    const targetRate = step.targetConversionRate || 0;
                    const actualRate = step.actualConversionRate;
                    const variance = ((actualRate - targetRate) / targetRate * 100).toFixed(1);
                    const isPositive = actualRate >= targetRate;
                    
                    return (
                      <div key={step.id} style={{ marginBottom: 4 }}>
                        <Text strong>{step.event.name}:</Text>{' '}
                        <Text>Target {targetRate}%</Text>{' → '}
                        <Text style={{ color: isPositive ? '#52c41a' : '#ff4d4f' }}>
                          Actual {actualRate}% ({isPositive ? '+' : ''}{variance}%)
                        </Text>
                      </div>
                    );
                  })}
                </div>
              }
            />
            <Divider />
          </>
        )}

        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <Text strong>Business Flow: </Text>
            <Text>{steps.map(s => s.event.name).join(' → ')}</Text>
          </div>
          
          <div>
            <Text strong>Template Type: </Text>
            <Text>
              {steps.length === 2 ? 'Direct Conversion' : 
               steps.some(s => s.event.stage === 'trial') ? 'Trial-to-Paid' : 'Content Marketing'}
            </Text>
          </div>

          <div>
            <Text strong>Total Steps: </Text>
            <Text>{steps.length} steps (Complexity: {previewData.complexity})</Text>
          </div>

          {previewData.dropOffPoints.length > 0 && (
            <Alert
              type="warning"
              showIcon
              message="Potential Drop-off Points Detected"
              description={
                <div>
                  <Text>The following steps have low conversion rates and may need optimization:</Text>
                  <ul style={{ margin: '8px 0 0 0' }}>
                    {previewData.dropOffPoints.map((step: FunnelTemplateStep) => (
                      <li key={step.id}>
                        <Text strong>{step.event.name}</Text>: {step.targetConversionRate || 0}% conversion
                      </li>
                    ))}
                  </ul>
                </div>
              }
            />
          )}

          <Alert
            type="info"
            showIcon
            message="Optimization Suggestions"
            description={
              <ul style={{ margin: '8px 0 0 0' }}>
                <li>Consider simplifying steps with conversion rates below 30%</li>
                <li>Add compelling incentives at major drop-off points</li>
                <li>Test different messaging and calls-to-action</li>
                <li>Consider A/B testing this template against alternatives</li>
              </ul>
            }
          />
        </Space>
      </Card>
    );
  };

  return (
    <div>
      <Form form={form} layout="vertical">
        <Card title="Template Basic Information">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Template Name"
                rules={[
                  { required: true, message: 'Please enter template name' },
                  { max: 50, message: 'Name must be less than 50 characters' }
                ]}
              >
                <Input placeholder="e.g., Enterprise SaaS Trial Conversion Template" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="businessGoal"
                label="Business Goal"
                rules={[{ required: true, message: 'Please select business goal' }]}
              >
                <Select placeholder="Select business goal">
                  {businessGoalOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="targetUsers"
                label="Target Users"
                rules={[{ required: true, message: 'Please select target users' }]}
              >
                <Select placeholder="Select target user type">
                  {targetUsersOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="budgetRange"
                label="Budget Range"
                rules={[{ required: true, message: 'Please select budget range' }]}
              >
                <Select placeholder="Select budget range">
                  {budgetRangeOptions.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={18}>
              <Form.Item
                name="description"
                label="Description"
                rules={[{ max: 200, message: 'Description must be less than 200 characters' }]}
              >
                <TextArea
                  rows={3}
                  placeholder="Brief description of the template and its use case"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="isActive"
                label="Template Status"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  defaultChecked={true}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {renderStepBuilder()}
        {renderPreview()}

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Space>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSave} loading={saving}>
              {template ? 'Update Template' : 'Save Template'}
            </Button>
          </Space>
        </div>
      </Form>
    </div>
  );
};

export default FunnelTemplateBuilder;