import React, { useState } from 'react';
import { Card, Tabs, Row, Col, Select, Space, Tag, Statistic, Table, Progress, Typography } from 'antd';
import {
  TrophyOutlined,
  DollarOutlined,
  TeamOutlined,
  PercentageOutlined
} from '@ant-design/icons';
import { ChannelFunnel } from '../services/mockData';
import ConversionFunnel from './ConversionFunnel';

const { TabPane } = Tabs;
const { Option } = Select;

interface ChannelFunnelComparisonProps {
  channelFunnels: ChannelFunnel[];
}

const ChannelFunnelComparison: React.FC<ChannelFunnelComparisonProps> = ({ channelFunnels }) => {
  const [viewMode, setViewMode] = useState<'individual' | 'comparison'>('comparison');
  const [selectedChannels, setSelectedChannels] = useState<string[]>(
    channelFunnels.map(cf => cf.channelId)
  );

  const getQualityColor = (score: number): string => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getCostEfficiencyColor = (efficiency: number): string => {
    if (efficiency >= 3) return '#52c41a';
    if (efficiency >= 2) return '#faad14';
    return '#ff4d4f';
  };

  const renderChannelStats = (channel: ChannelFunnel) => {
    return (
      <Card key={channel.channelId} style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col span={6}>
            <Space direction="vertical">
              <Text strong style={{ fontSize: 16 }}>{channel.channelName}</Text>
              <Tag color="blue">ID: {channel.channelId}</Tag>
            </Space>
          </Col>
          <Col span={6}>
            <Statistic
              title="Conversion Rate"
              value={channel.funnel.totalConversionRate}
              prefix={<PercentageOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Quality Score"
              value={channel.qualityScore}
              suffix="/ 100"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: getQualityColor(channel.qualityScore) }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Cost Efficiency"
              value={channel.costEfficiency}
              suffix="x"
              prefix={<DollarOutlined />}
              valueStyle={{ color: getCostEfficiencyColor(channel.costEfficiency) }}
            />
          </Col>
        </Row>
      </Card>
    );
  };

  const comparisonColumns = [
    {
      title: 'Funnel Step',
      dataIndex: 'stepName',
      key: 'stepName',
      fixed: 'left' as const,
      width: 150
    },
    ...channelFunnels
      .filter(cf => selectedChannels.includes(cf.channelId))
      .map(channel => ({
        title: (
          <div>
            <div>{channel.channelName}</div>
            <Tag color="blue" style={{ fontSize: 10 }}>{channel.channelId}</Tag>
          </div>
        ),
        key: channel.channelId,
        render: (_: any, record: any) => {
          const step = record[channel.channelId];
          if (!step) return '-';
          
          return (
            <div>
              <div style={{ marginBottom: 4 }}>
                <Text strong>{step.users.toLocaleString()}</Text>
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  ({step.conversionRate})
                </Text>
              </div>
              {step.dropOffRate && (
                <Progress
                  percent={100 - parseFloat(step.dropOffRate)}
                  size="small"
                  showInfo={false}
                  strokeColor={parseFloat(step.dropOffRate) > 50 ? '#ff4d4f' : '#52c41a'}
                />
              )}
            </div>
          );
        }
      }))
  ];

  const prepareComparisonData = () => {
    const stepNames = new Set<string>();
    channelFunnels.forEach(cf => {
      cf.funnel.funnelSteps.forEach(step => stepNames.add(step.stepName));
    });

    return Array.from(stepNames).map(stepName => {
      const row: any = { stepName, key: stepName };
      channelFunnels.forEach(cf => {
        const step = cf.funnel.funnelSteps.find(s => s.stepName === stepName);
        if (step) {
          row[cf.channelId] = step;
        }
      });
      return row;
    });
  };

  const renderComparisonView = () => {
    return (
      <div>
        <div style={{ marginBottom: 16 }}>
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="Select channels to compare"
            value={selectedChannels}
            onChange={setSelectedChannels}
          >
            {channelFunnels.map(cf => (
              <Option key={cf.channelId} value={cf.channelId}>
                {cf.channelName}
              </Option>
            ))}
          </Select>
        </div>

        <Row gutter={16} style={{ marginBottom: 24 }}>
          {channelFunnels
            .filter(cf => selectedChannels.includes(cf.channelId))
            .map(channel => (
              <Col span={8} key={channel.channelId}>
                <Card>
                  <Statistic
                    title={channel.channelName}
                    value={channel.funnel.totalConversionRate}
                    valueStyle={{
                      color: channel.funnel.totalConversionRate === 
                        Math.max(...channelFunnels.map(cf => parseFloat(cf.funnel.totalConversionRate.replace('%', ''))))
                          .toString() + '%' ? '#52c41a' : '#000'
                    }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Space size={4}>
                      <Tag color={getQualityColor(channel.qualityScore)}>
                        Quality: {channel.qualityScore}
                      </Tag>
                      <Tag color={getCostEfficiencyColor(channel.costEfficiency)}>
                        Efficiency: {channel.costEfficiency}x
                      </Tag>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>

        <Table
          columns={comparisonColumns}
          dataSource={prepareComparisonData()}
          pagination={false}
          scroll={{ x: 800 }}
          bordered
        />
      </div>
    );
  };

  const renderIndividualView = () => {
    return (
      <Tabs defaultActiveKey={channelFunnels[0]?.channelId}>
        {channelFunnels.map(channel => (
          <TabPane
            tab={
              <Space>
                {channel.channelName}
                <Tag color={getQualityColor(channel.qualityScore)}>
                  {channel.qualityScore}
                </Tag>
              </Space>
            }
            key={channel.channelId}
          >
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Total Conversion Rate"
                    value={channel.funnel.totalConversionRate}
                    prefix={<PercentageOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Revenue Impact"
                    value={channel.funnel.revenueImpact || 0}
                    prefix="$"
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic
                    title="Total Users"
                    value={channel.funnel.funnelSteps[0].users}
                    prefix={<TeamOutlined />}
                  />
                </Card>
              </Col>
            </Row>
            <ConversionFunnel funnel={channel.funnel} showInsights={true} />
          </TabPane>
        ))}
      </Tabs>
    );
  };

  return (
    <Card
      title="Channel Funnel Comparison"
      extra={
        <Select value={viewMode} onChange={setViewMode} style={{ width: 150 }}>
          <Option value="comparison">Comparison View</Option>
          <Option value="individual">Individual View</Option>
        </Select>
      }
    >
      {viewMode === 'comparison' ? renderComparisonView() : renderIndividualView()}
    </Card>
  );
};

const { Text } = Typography;

export default ChannelFunnelComparison;