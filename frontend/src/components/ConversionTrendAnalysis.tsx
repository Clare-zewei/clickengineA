import React, { useState } from 'react';
import { Card, Row, Col, Select, DatePicker, Space, Tag, Alert, Statistic, Table, Tabs, Typography } from 'antd';
import {
  RiseOutlined,
  FallOutlined,
  CalendarOutlined,
  WarningOutlined,
  LineChartOutlined
} from '@ant-design/icons';
import { ConversionTrend } from '../services/mockData';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { TabPane } = Tabs;
const { Text } = Typography;

interface ConversionTrendAnalysisProps {
  trends: ConversionTrend;
}

const ConversionTrendAnalysis: React.FC<ConversionTrendAnalysisProps> = ({ trends }) => {
  const [timeGranularity, setTimeGranularity] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

  const getChartData = () => {
    let data = trends[timeGranularity];
    
    if (dateRange && dateRange[0] && dateRange[1]) {
      data = data.filter(point => {
        const date = dayjs(point.date);
        return date.isAfter(dateRange[0].subtract(1, 'day')) && 
               date.isBefore(dateRange[1].add(1, 'day'));
      });
    }

    return data;
  };

  const renderSimpleChart = () => {
    const data = getChartData();
    if (!data.length) return null;

    const maxRate = Math.max(...data.map(d => d.conversionRate));
    const minRate = Math.min(...data.map(d => d.conversionRate));
    const range = maxRate - minRate || 1;

    return (
      <div style={{ padding: '20px 0', height: '300px', position: 'relative' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'end', 
          height: '100%', 
          borderLeft: '2px solid #d9d9d9',
          borderBottom: '2px solid #d9d9d9',
          paddingLeft: '10px'
        }}>
          {data.map((point, index) => {
            const heightPercent = ((point.conversionRate - minRate) / range) * 80 + 10;
            return (
              <div
                key={point.date}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginRight: '2px'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    maxWidth: '40px',
                    height: `${heightPercent}%`,
                    backgroundColor: '#1890ff',
                    borderRadius: '2px 2px 0 0',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  title={`${dayjs(point.date).format('MMM DD')}: ${point.conversionRate}% (${point.conversions}/${point.users})`}
                >
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '10px',
                    color: '#666',
                    whiteSpace: 'nowrap'
                  }}>
                    {point.conversionRate.toFixed(1)}%
                  </div>
                </div>
                <Text style={{ fontSize: '10px', marginTop: '8px', transform: 'rotate(-45deg)', transformOrigin: 'center' }}>
                  {dayjs(point.date).format('MM/DD')}
                </Text>
              </div>
            );
          })}
        </div>
        <div style={{
          position: 'absolute',
          left: '-40px',
          top: '10%',
          fontSize: '12px',
          color: '#666'
        }}>
          {maxRate.toFixed(1)}%
        </div>
        <div style={{
          position: 'absolute',
          left: '-40px',
          bottom: '20px',
          fontSize: '12px',
          color: '#666'
        }}>
          {minRate.toFixed(1)}%
        </div>
      </div>
    );
  };

  const renderYoYComparison = () => {
    const { yoyComparison } = trends;
    const isPositive = yoyComparison.percentChange > 0;

    return (
      <Card title="Year-over-Year Comparison" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="Current Year"
              value={yoyComparison.currentYear}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Previous Year"
              value={yoyComparison.previousYear}
              suffix="%"
              valueStyle={{ color: '#8c8c8c' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="YoY Change"
              value={Math.abs(yoyComparison.percentChange)}
              prefix={isPositive ? <RiseOutlined /> : <FallOutlined />}
              suffix="%"
              valueStyle={{ color: isPositive ? '#52c41a' : '#ff4d4f' }}
            />
          </Col>
        </Row>
      </Card>
    );
  };

  const renderSeasonalPatterns = () => {
    return (
      <Card title="Seasonal Patterns & Insights" style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          {trends.seasonalPatterns.map((pattern, index) => (
            <Alert
              key={index}
              message={pattern}
              type="info"
              icon={<CalendarOutlined />}
              showIcon
            />
          ))}
        </Space>
      </Card>
    );
  };

  const renderAnomalies = () => {
    const anomalyColumns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (date: string) => dayjs(date).format('MMM DD, YYYY')
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render: (type: 'spike' | 'drop') => (
          <Tag color={type === 'spike' ? 'green' : 'red'}>
            {type === 'spike' ? <RiseOutlined /> : <FallOutlined />} {type.toUpperCase()}
          </Tag>
        )
      },
      {
        title: 'Severity',
        dataIndex: 'severity',
        key: 'severity',
        render: (severity: string) => {
          const colors = {
            high: 'red',
            medium: 'orange',
            low: 'blue'
          };
          return <Tag color={colors[severity as keyof typeof colors]}>{severity.toUpperCase()}</Tag>;
        }
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description'
      }
    ];

    return (
      <Card 
        title={
          <Space>
            <WarningOutlined />
            Detected Anomalies
          </Space>
        } 
        style={{ marginBottom: 24 }}
      >
        <Table
          columns={anomalyColumns}
          dataSource={trends.anomalies.map((a, i) => ({ ...a, key: i }))}
          pagination={false}
          size="small"
        />
      </Card>
    );
  };

  const calculateTrendStatistics = () => {
    const data = trends[timeGranularity];
    if (data.length === 0) return null;

    const rates = data.map(d => d.conversionRate);
    const avg = rates.reduce((a, b) => a + b, 0) / rates.length;
    const max = Math.max(...rates);
    const min = Math.min(...rates);
    const latest = rates[rates.length - 1];
    const previous = rates[rates.length - 2] || latest;
    const change = ((latest - previous) / previous) * 100;

    return { avg, max, min, latest, change };
  };

  const stats = calculateTrendStatistics();

  return (
    <div>
      <Card
        title="Conversion Trend Analysis"
        extra={
          <Space>
            <Select value={timeGranularity} onChange={setTimeGranularity} style={{ width: 120 }}>
              <Option value="daily">Daily</Option>
              <Option value="weekly">Weekly</Option>
              <Option value="monthly">Monthly</Option>
            </Select>
            <RangePicker
              onChange={(dates) => setDateRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              format="YYYY-MM-DD"
            />
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {stats && (
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Statistic
                title="Average Rate"
                value={stats.avg.toFixed(2)}
                suffix="%"
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Peak Rate"
                value={stats.max.toFixed(2)}
                suffix="%"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Lowest Rate"
                value={stats.min.toFixed(2)}
                suffix="%"
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="Latest Change"
                value={Math.abs(stats.change).toFixed(1)}
                prefix={stats.change > 0 ? <RiseOutlined /> : <FallOutlined />}
                suffix="%"
                valueStyle={{ color: stats.change > 0 ? '#52c41a' : '#ff4d4f' }}
              />
            </Col>
          </Row>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <LineChartOutlined style={{ marginRight: 8 }} />
          <Text strong>Conversion Rate Trend</Text>
        </div>
        {renderSimpleChart()}
      </Card>

      <Tabs defaultActiveKey="yoy">
        <TabPane tab="Year-over-Year" key="yoy">
          {renderYoYComparison()}
        </TabPane>
        <TabPane tab="Seasonal Patterns" key="seasonal">
          {renderSeasonalPatterns()}
        </TabPane>
        <TabPane tab="Anomalies" key="anomalies">
          {renderAnomalies()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ConversionTrendAnalysis;