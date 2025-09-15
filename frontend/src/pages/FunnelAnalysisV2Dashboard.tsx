import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Card, 
  Table, 
  Button, 
  Space, 
  Typography, 
  Tag, 
  Tooltip, 
  Dropdown, 
  Menu, 
  Modal,
  message,
  Row,
  Col,
  Statistic
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  BarChartOutlined,
  MoreOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  ExperimentOutlined,
  CalendarOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TrophyOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { funnelAnalysisV2Service, FunnelV2 } from '../services/funnelAnalysisV2';

const { Content } = Layout;
const { Title, Text } = Typography;

interface FunnelAnalysisV2DashboardProps {
  onCreateFunnel?: () => void;
  onViewDetails?: (funnelId: string) => void;
  onEditFunnel?: (funnel: FunnelV2) => void;
  onCopyFunnel?: (funnel: FunnelV2) => void;
}

const FunnelAnalysisV2Dashboard: React.FC<FunnelAnalysisV2DashboardProps> = ({
  onCreateFunnel,
  onViewDetails,
  onEditFunnel,
  onCopyFunnel
}) => {
  const [funnels, setFunnels] = useState<FunnelV2[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFunnel, setSelectedFunnel] = useState<FunnelV2 | null>(null);
  const location = useLocation();

  useEffect(() => {
    loadFunnels();
  }, []);

  // Reload data when returning from edit page
  useEffect(() => {
    if (location.state?.refresh) {
      loadFunnels();
      // Clear the state to prevent unnecessary reloads
      window.history.replaceState({}, document.title);
    }
  }, [location.state, location.pathname]);

  const loadFunnels = async () => {
    try {
      setLoading(true);
      const data = await funnelAnalysisV2Service.getFunnels();
      setFunnels(data);
    } catch (error) {
      message.error('Failed to load funnels');
      console.error('Error loading funnels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFunnel = () => {
    if (onCreateFunnel) {
      onCreateFunnel();
    }
  };

  const handleViewDetails = (funnel: FunnelV2) => {
    if (onViewDetails) {
      onViewDetails(funnel.id);
    }
  };

  const handleEditFunnel = (funnel: FunnelV2) => {
    if (onEditFunnel) {
      onEditFunnel(funnel);
    }
  };

  const handleCopyFunnel = async (funnel: FunnelV2) => {
    if (onCopyFunnel) {
      onCopyFunnel(funnel);
    } else {
      try {
        const copiedFunnel = await funnelAnalysisV2Service.copyFunnel(funnel.id);
        if (copiedFunnel) {
          message.success('Funnel copied successfully');
          await loadFunnels();
        }
      } catch (error) {
        message.error('Failed to copy funnel');
      }
    }
  };

  const handleDeleteFunnel = (funnel: FunnelV2) => {
    Modal.confirm({
      title: 'Delete Funnel',
      content: `Are you sure you want to delete "${funnel.name}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        try {
          const success = await funnelAnalysisV2Service.deleteFunnel(funnel.id);
          if (success) {
            message.success('Funnel deleted successfully');
            await loadFunnels();
          }
        } catch (error) {
          message.error('Failed to delete funnel');
        }
      }
    });
  };

  const getActionMenu = (funnel: FunnelV2) => (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleEditFunnel(funnel)}>
        Edit Funnel
      </Menu.Item>
      <Menu.Item key="copy" icon={<CopyOutlined />} onClick={() => handleCopyFunnel(funnel)}>
        Copy Funnel
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item 
        key="delete" 
        icon={<DeleteOutlined />} 
        onClick={() => handleDeleteFunnel(funnel)}
        danger
      >
        Delete Funnel
      </Menu.Item>
    </Menu>
  );

  const getStatusTag = (status: 'active' | 'testing' | 'paused') => {
    const statusConfig = {
      active: { color: 'green', icon: <PlayCircleOutlined />, text: 'Active' },
      testing: { color: 'orange', icon: <ExperimentOutlined />, text: 'Testing' },
      paused: { color: 'default', icon: <PauseCircleOutlined />, text: 'Paused' }
    };
    
    const config = statusConfig[status] || statusConfig.paused; // Fallback to paused if status is undefined
    return (
      <Tag color={config.color} icon={config.icon}>
        {config.text}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Funnel Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: FunnelV2) => (
        <div>
          <Text strong>{text || 'Untitled Funnel'}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.description || 'No description'}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: 'active' | 'testing' | 'paused') => {
        // Ensure we have a valid status
        const validStatus = status || 'paused';
        return getStatusTag(validStatus as 'active' | 'testing' | 'paused');
      }
    },
    {
      title: 'Steps',
      dataIndex: 'steps',
      key: 'steps',
      width: 80,
      render: (steps: any[]) => {
        if (!steps || !Array.isArray(steps)) return <Text type="secondary">0 steps</Text>;
        return <Text>{steps.length} steps</Text>;
      }
    },
    {
      title: 'Target Goal',
      dataIndex: 'targetGoal',
      key: 'targetGoal',
      width: 120,
      render: (goal: { count: number; period: string }) => {
        if (!goal) return <Text type="secondary">-</Text>;
        return (
          <div>
            <Text strong>{goal.count}</Text>
            <Text type="secondary">/{goal.period}</Text>
          </div>
        );
      }
    },
    {
      title: 'Last Updated',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 140,
      render: (date: string) => (
        <Text type="secondary">
          {new Date(date).toLocaleDateString()}
        </Text>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: FunnelV2) => (
        <Space>
          <Tooltip title="View Performance Details">
            <Button 
              type="text" 
              icon={<BarChartOutlined />}
              onClick={() => handleViewDetails(record)}
            />
          </Tooltip>
          <Dropdown overlay={getActionMenu(record)} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  // Calculate summary statistics
  const activeFunnels = funnels.filter(f => f.status === 'active').length;
  const testingFunnels = funnels.filter(f => f.status === 'testing').length;
  const totalSteps = funnels.reduce((sum, f) => sum + f.steps.length, 0);

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ margin: 0 }}>
                Funnel Analysis V2
              </Title>
              <Text type="secondary">
                Advanced funnel management and performance tracking
              </Text>
            </div>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              size="large"
              onClick={handleCreateFunnel}
            >
              Create New Funnel
            </Button>
          </div>
        </div>

        {/* Enhanced Summary Cards */}
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          <Col xs={24} sm={8}>
            <Card 
              style={{ 
                borderRadius: 12,
                background: 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
                border: '1px solid #91d5ff',
                boxShadow: '0 4px 12px rgba(24, 144, 255, 0.15)'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500 }}>
                    Total Funnels
                  </Text>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#1890ff', lineHeight: 1 }}>
                    {funnels.length}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    All conversion funnels
                  </Text>
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  color: '#1890ff',
                  background: 'rgba(24, 144, 255, 0.1)',
                  padding: '12px',
                  borderRadius: '50%'
                }}>
                  <TrophyOutlined />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card 
              style={{ 
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%)',
                border: '1px solid #b7eb8f',
                boxShadow: '0 4px 12px rgba(82, 196, 26, 0.15)'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500 }}>
                    Active Funnels
                  </Text>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#52c41a', lineHeight: 1 }}>
                    {activeFunnels}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {testingFunnels > 0 ? (
                      <>Running live <span style={{ color: '#faad14' }}>+{testingFunnels} testing</span></>
                    ) : (
                      'Running live now'
                    )}
                  </Text>
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  color: '#52c41a',
                  background: 'rgba(82, 196, 26, 0.1)',
                  padding: '12px',
                  borderRadius: '50%'
                }}>
                  <PlayCircleOutlined />
                </div>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card 
              style={{ 
                borderRadius: 12,
                background: 'linear-gradient(135deg, #f9f0ff 0%, #efdbff 100%)',
                border: '1px solid #d3adf7',
                boxShadow: '0 4px 12px rgba(114, 46, 209, 0.15)'
              }}
              bodyStyle={{ padding: '20px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500 }}>
                    Total Steps
                  </Text>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#722ed1', lineHeight: 1 }}>
                    {totalSteps}
                  </div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Across all funnels
                  </Text>
                </div>
                <div style={{ 
                  fontSize: '32px', 
                  color: '#722ed1',
                  background: 'rgba(114, 46, 209, 0.1)',
                  padding: '12px',
                  borderRadius: '50%'
                }}>
                  <ArrowRightOutlined />
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Main Content - Card Grid */}
        <div>
          <div style={{ marginBottom: 24 }}>
            <Title level={4} style={{ margin: 0 }}>
              Funnel Management
            </Title>
            <Text type="secondary">
              Manage your conversion funnels and track their performance
            </Text>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px 0' }}>
              <ReloadOutlined spin style={{ fontSize: '24px' }} />
              <div style={{ marginTop: 16 }}>Loading funnels...</div>
            </div>
          ) : funnels.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '50px 0' }}>
              <Title level={5} type="secondary">No funnels found</Title>
              <Text type="secondary">Create your first funnel to get started</Text>
              <div style={{ marginTop: 16 }}>
                <Button 
                  type="primary" 
                  icon={<PlusOutlined />}
                  onClick={handleCreateFunnel}
                >
                  Create New Funnel
                </Button>
              </div>
            </Card>
          ) : (
            <Row gutter={[24, 24]}>
              {funnels.map((funnel) => {
                const statusConfig = {
                  active: { color: '#52c41a', text: 'Active', icon: <PlayCircleOutlined /> },
                  testing: { color: '#faad14', text: 'Testing', icon: <ExperimentOutlined /> },
                  paused: { color: '#d9d9d9', text: 'Paused', icon: <PauseCircleOutlined /> }
                };
                
                const status = statusConfig[funnel.status] || statusConfig.paused;
                const stepCount = funnel.steps?.length || 0;
                const complexity = stepCount <= 3 ? 'Simple' : stepCount <= 6 ? 'Medium' : 'Complex';
                const estimatedTime = stepCount <= 3 ? '< 5 minutes' : stepCount <= 6 ? '< 15 minutes' : '< 30 minutes';
                
                // Create user journey flow
                const journeyFlow = funnel.steps.map(step => step.name).join(' → ');
                const shortJourney = journeyFlow.length > 50 ? journeyFlow.substring(0, 47) + '...' : journeyFlow;

                return (
                  <Col xs={24} lg={8} key={funnel.id}>
                    <Card
                      hoverable
                      style={{
                        height: '100%',
                        borderRadius: 8,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                      }}
                      bodyStyle={{ padding: '20px' }}
                    >
                      {/* Header */}
                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div style={{ flex: 1 }}>
                            <Title level={5} style={{ margin: 0, marginBottom: 4 }}>
                              {funnel.name || 'Untitled Funnel'}
                            </Title>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: status.color }}>{status.icon}</span>
                              <Text style={{ color: status.color, fontSize: '12px', fontWeight: 500 }}>
                                {status.text}
                              </Text>
                            </div>
                          </div>
                        </div>
                        <Text type="secondary" style={{ fontSize: '13px', lineHeight: '1.4' }}>
                          {funnel.description || 'No description provided'}
                        </Text>
                      </div>

                      {/* Updated Date */}
                      <div style={{ marginBottom: 16 }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          <CalendarOutlined /> Updated: {new Date(funnel.updatedAt).toLocaleDateString()}
                        </Text>
                      </div>

                      {/* Business Flow */}
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ fontSize: '12px', color: '#1890ff' }}>
                          <ReloadOutlined /> Business Flow:
                        </Text>
                        <div style={{ fontSize: '12px', color: '#595959', marginTop: 4 }}>
                          {shortJourney}
                        </div>
                      </div>

                      {/* Performance Expectations */}
                      <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#722ed1' }}>
                              {funnel.targetGoal?.count || 0}
                            </div>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              Target Goal
                            </Text>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
                              {complexity}
                            </div>
                            <Text type="secondary" style={{ fontSize: '11px' }}>
                              Complexity
                            </Text>
                          </div>
                        </Col>
                      </Row>

                      {/* User Journey Flow */}
                      <div style={{ marginBottom: 16 }}>
                        <Text strong style={{ fontSize: '12px' }}>User Journey Flow</Text>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#595959', 
                          marginTop: 4,
                          padding: '8px',
                          backgroundColor: '#f5f5f5',
                          borderRadius: 4
                        }}>
                          Entry → {shortJourney} → Conversion
                        </div>
                      </div>

                      {/* Metrics Row */}
                      <Row gutter={8} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            <ClockCircleOutlined /> {estimatedTime}
                          </Text>
                        </Col>
                        <Col span={12}>
                          <Text type="secondary" style={{ fontSize: '11px' }}>
                            <UserOutlined /> {stepCount} steps
                          </Text>
                        </Col>
                      </Row>

                      {/* Best Use Case */}
                      <div style={{ marginBottom: 20 }}>
                        <Text strong style={{ fontSize: '12px' }}>Best Use Case:</Text>
                        <div style={{ marginTop: 4 }}>
                          <Text style={{ fontSize: '12px', color: '#595959' }}>
                            {stepCount <= 3 ? 'Direct conversion campaigns' : 
                             stepCount <= 6 ? 'Lead nurturing sequences' : 
                             'Complex customer journeys'}
                          </Text>
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <Text style={{ 
                            fontSize: '11px', 
                            padding: '2px 8px', 
                            backgroundColor: '#e6f7ff', 
                            borderRadius: 12,
                            marginRight: 8
                          }}>
                            {funnel.targetGoal?.period === 'week' ? 'Weekly Goals' : 'Monthly Goals'}
                          </Text>
                          <Text style={{ 
                            fontSize: '11px', 
                            padding: '2px 8px', 
                            backgroundColor: '#f6ffed', 
                            borderRadius: 12
                          }}>
                            {stepCount} step{stepCount !== 1 ? 's' : ''}
                          </Text>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 16 }}>
                        <Space size="small" style={{ width: '100%', justifyContent: 'space-between' }}>
                          <Button 
                            type="primary" 
                            icon={<BarChartOutlined />} 
                            size="small"
                            onClick={() => handleViewDetails(funnel)}
                          >
                            View Details
                          </Button>
                          <Space size="small">
                            <Button 
                              icon={<EditOutlined />} 
                              size="small"
                              onClick={() => handleEditFunnel(funnel)}
                            >
                              Edit
                            </Button>
                            <Button 
                              icon={<CopyOutlined />} 
                              size="small"
                              onClick={() => handleCopyFunnel(funnel)}
                            >
                              Copy
                            </Button>
                            <Button 
                              icon={<DeleteOutlined />} 
                              size="small"
                              danger
                              onClick={() => handleDeleteFunnel(funnel)}
                            >
                              Delete
                            </Button>
                          </Space>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          )}
        </div>
      </Content>
    </Layout>
  );
};

export default FunnelAnalysisV2Dashboard;