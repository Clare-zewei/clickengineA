import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { BarChartOutlined, SettingOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import ResultsDashboard from './ResultsDashboard';
import FunnelBuilder from './FunnelBuilder';

const { Content, Sider } = Layout;

const FunnelAnalysis: React.FC = () => {
  const location = useLocation();
  const currentSubPath = location.pathname.split('/')[2] || 'results';

  const menuItems = [
    {
      key: 'results',
      icon: <BarChartOutlined />,
      label: <Link to="/funnel-analysis/results">Results Dashboard</Link>,
    },
    {
      key: 'builder',
      icon: <SettingOutlined />,
      label: <Link to="/funnel-analysis/builder">Funnel Builder</Link>,
    },
  ];

  return (
    <Layout style={{ minHeight: 'calc(100vh - 64px)' }}>
      <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
        <Menu
          mode="inline"
          selectedKeys={[currentSubPath]}
          items={menuItems}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Sider>
      <Layout style={{ padding: '0 24px 24px' }}>
        <Content
          style={{
            background: '#fff',
            padding: 24,
            margin: 0,
            minHeight: 280,
          }}
        >
          <Routes>
            <Route path="/" element={<Navigate to="results" replace />} />
            <Route path="/results" element={<ResultsDashboard />} />
            <Route path="/builder" element={<FunnelBuilder />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default FunnelAnalysis;