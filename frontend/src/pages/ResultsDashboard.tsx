import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Space, Tooltip, Dropdown, Menu } from 'antd';
import { 
  TrophyOutlined, 
  DollarOutlined, 
  UserOutlined, 
  BarChartOutlined,
  EditOutlined,
  CopyOutlined,
  DeleteOutlined,
  MoreOutlined,
  ClockCircleOutlined,
  RiseOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { mockDataService, FunnelTemplate } from '../services/mockData';

const { Title, Text } = Typography;

interface FunnelResultCard extends FunnelTemplate {
  averageCompletionTime: number; // in hours
  completionTimeUnit: string;
  stepRetentionRates: number[]; // retention rate between each step
  monthlyTrend: number; // percentage change vs last month
  performanceStatus: 'excellent' | 'good' | 'attention' | 'action';
  statusMessage: string;
}

const ResultsDashboard: React.FC = () => {
  const [funnelResults, setFunnelResults] = useState<FunnelResultCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFunnelResults();
  }, []);

  const fetchFunnelResults = async () => {
    try {
      setLoading(true);
      const templates = await mockDataService.getFunnelTemplates();
      
      // Convert to result cards with additional metrics
      const results: FunnelResultCard[] = templates.map(template => {
        const completionTime = Math.round(Math.random() * 72 + 24); // Random 24-96 hours
        const conversionRate = template.actualTotalConversion || template.targetTotalConversion || 0;
        const monthlyTrend = Math.round((Math.random() - 0.5) * 10 * 100) / 100; // -5% to +5%
        
        // Generate step retention rates
        const stepRetentionRates = template.steps.slice(0, -1).map(() => 
          Math.round((Math.random() * 30 + 60) * 100) / 100 // 60-90% retention
        );
        
        // Determine performance status
        let performanceStatus: 'excellent' | 'good' | 'attention' | 'action';
        let statusMessage: string;
        
        if (conversionRate >= 15 && monthlyTrend >= 0) {
          performanceStatus = 'excellent';
          statusMessage = 'Performing above benchmark';
        } else if (conversionRate >= 10 && monthlyTrend >= -2) {
          performanceStatus = 'good';
          statusMessage = 'Meeting expectations';
        } else if (conversionRate >= 5 || monthlyTrend >= -5) {
          performanceStatus = 'attention';
          statusMessage = completionTime > 48 ? 'Long completion time vs benchmark' : 'Below benchmark performance';
        } else {
          performanceStatus = 'action';
          statusMessage = 'Requires immediate optimization';
        }
        
        return {
          ...template,
          averageCompletionTime: completionTime,
          completionTimeUnit: 'hours',
          stepRetentionRates,
          monthlyTrend,
          performanceStatus,
          statusMessage
        };
      });
      
      setFunnelResults(results);
    } catch (error) {
      console.error('Failed to fetch funnel results:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardAction = (action: string, funnelId: string) => {
    console.log(`${action} funnel:`, funnelId);
    // Implement actions: view details, edit, copy, delete
  };

  const getActionMenu = (funnelId: string) => (
    <Menu>
      <Menu.Item key="edit" icon={<EditOutlined />} onClick={() => handleCardAction('edit', funnelId)}>
        Quick Edit
      </Menu.Item>
      <Menu.Item key="copy" icon={<CopyOutlined />} onClick={() => handleCardAction('copy', funnelId)}>
        Copy Funnel
      </Menu.Item>
      <Menu.Item key="delete" icon={<DeleteOutlined />} onClick={() => handleCardAction('delete', funnelId)} danger>
        Delete
      </Menu.Item>
    </Menu>
  );

  const renderFunnelCard = (funnel: FunnelResultCard) => {
    const conversionRate = funnel.actualTotalConversion || funnel.targetTotalConversion || 0;
    const users = funnel.performanceMetrics?.users || 0;
    const conversions = funnel.performanceMetrics?.conversions || 0;

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'excellent': return '#52c41a';
        case 'good': return '#1890ff';
        case 'attention': return '#faad14';
        case 'action': return '#ff4d4f';
        default: return '#d9d9d9';
      }
    };

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'excellent': return '🟢';
        case 'good': return '🔵';
        case 'attention': return '🟡';
        case 'action': return '🔴';
        default: return '⚪';
      }
    };

    return (
      <Col xs={24} sm={12} lg={8} xl={6} key={funnel.id}>
        <Card
          hoverable
          style={{
            marginBottom: 16,
            borderLeft: `4px solid ${getStatusColor(funnel.performanceStatus)}`
          }}
          actions={[
            <Button type="text" key="view" onClick={() => handleCardAction('view', funnel.id)}>
              View Details
            </Button>,
            <Dropdown overlay={getActionMenu(funnel.id)} placement="bottomRight" key="actions">
              <Button type="text" icon={<MoreOutlined />} />
            </Dropdown>
          ]}
        >
          <div>
            {/* Header */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ marginRight: 6 }}>📊</span>
                <Title level={5} style={{ margin: 0 }}>
                  {funnel.name}
                </Title>
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {funnel.steps.length} steps • {funnel.targetUsers.replace('_', ' ')} • Last 30 days
              </Text>
            </div>

            <div style={{ 
              height: 1, 
              background: 'linear-gradient(90deg, #f0f0f0 0%, #d9d9d9 50%, #f0f0f0 100%)', 
              marginBottom: 16 
            }} />

            {/* Core Performance Metrics */}
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: '13px', color: '#666' }}>Core Performance Metrics</Text>
              <Row gutter={8} style={{ marginTop: 8 }}>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '6px 0' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                      {conversionRate.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '10px', color: '#666' }}>Conv Rate</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '6px 0' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#722ed1' }}>
                      {users > 1000 ? `${(users/1000).toFixed(1)}k` : users.toLocaleString()}
                    </div>
                    <div style={{ fontSize: '10px', color: '#666' }}>Users</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '6px 0' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                      {conversions}
                    </div>
                    <div style={{ fontSize: '10px', color: '#666' }}>Conversions</div>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center', padding: '6px 0' }}>
                    <Tooltip title="Average time from first step to final conversion">
                      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#fa541c' }}>
                        {funnel.averageCompletionTime}h
                      </div>
                      <div style={{ fontSize: '10px', color: '#666' }}>Avg Time</div>
                    </Tooltip>
                  </div>
                </Col>
              </Row>
            </div>

            {/* Funnel Flow Analysis */}
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: '13px', color: '#666' }}>Funnel Flow Analysis</Text>
              <div style={{ marginTop: 8 }}>
                {funnel.stepRetentionRates.length > 0 && (
                  <div style={{ fontSize: '11px', color: '#666' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                      <span>Step 1 → Step 2: </span>
                      <span style={{ 
                        fontWeight: 'bold', 
                        color: funnel.stepRetentionRates[0] >= 80 ? '#52c41a' : funnel.stepRetentionRates[0] >= 60 ? '#faad14' : '#ff4d4f',
                        marginLeft: 4
                      }}>
                        {funnel.stepRetentionRates[0].toFixed(1)}% retention
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
                      <RiseOutlined style={{ fontSize: '10px', marginRight: 4 }} />
                      <span style={{ color: funnel.monthlyTrend >= 0 ? '#52c41a' : '#ff4d4f' }}>
                        {funnel.monthlyTrend >= 0 ? '+' : ''}{funnel.monthlyTrend.toFixed(1)}% vs last month
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Performance Status */}
            <div style={{ 
              fontSize: '11px', 
              padding: '8px 12px',
              backgroundColor: `${getStatusColor(funnel.performanceStatus)}15`,
              borderRadius: 6,
              border: `1px solid ${getStatusColor(funnel.performanceStatus)}30`
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <span style={{ marginRight: 6 }}>
                  {getStatusIcon(funnel.performanceStatus)}
                </span>
                <Text strong style={{ fontSize: '12px' }}>
                  Status: {funnel.performanceStatus === 'excellent' ? 'Performing Well' :
                           funnel.performanceStatus === 'good' ? 'Good Performance' :
                           funnel.performanceStatus === 'attention' ? 'Needs Attention' : 'Requires Action'}
                </Text>
              </div>
              <Text style={{ fontSize: '11px', color: '#666' }}>
                {funnel.statusMessage}
              </Text>
            </div>
          </div>
        </Card>
      </Col>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>Results Dashboard</Title>
          <Text type="secondary">Funnel template analysis results • Last 30 days data</Text>
        </div>
        <Space>
          <Button onClick={fetchFunnelResults} loading={loading}>
            Refresh Data
          </Button>
          <Button type="primary" icon={<BarChartOutlined />}>
            Export Results
          </Button>
        </Space>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <Text>Loading funnel results...</Text>
        </div>
      ) : funnelResults.length > 0 ? (
        <Row gutter={[16, 16]}>
          {funnelResults.map(renderFunnelCard)}
        </Row>
      ) : (
        <Card style={{ textAlign: 'center', padding: '50px 20px' }}>
          <BarChartOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} style={{ color: '#999', marginBottom: '8px' }}>No Funnel Results</Title>
          <Text type="secondary">Create funnel templates to see analysis results here</Text>
        </Card>
      )}
    </div>
  );
};

export default ResultsDashboard;