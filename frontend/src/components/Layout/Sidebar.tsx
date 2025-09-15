import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  BulbOutlined,
  FunnelPlotOutlined,
  GlobalOutlined,
  ApiOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/campaigns',
      icon: <BulbOutlined />,
      label: <Link to="/campaigns">Campaigns</Link>,
    },
    {
      key: '/channels',
      icon: <GlobalOutlined />,
      label: <Link to="/channels">Channels</Link>,
    },
    {
      key: '/integrations',
      icon: <ApiOutlined />,
      label: <Link to="/integrations">Integrations</Link>,
    },
    {
      key: '/funnel-analysis-v2',
      icon: <FunnelPlotOutlined />,
      label: <Link to="/funnel-analysis-v2">Funnel Analysis</Link>,
    },
  ];

  return (
    <Sider
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
      theme="dark"
    >
      <div
        style={{
          height: 64,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: 16,
        }}
      >
        Click Engine
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[
          currentPath === '/' ? '/dashboard' : 
          currentPath.startsWith('/funnel-analysis-v2') ? '/funnel-analysis-v2' :
          currentPath
        ]}
        items={menuItems}
      />
    </Sider>
  );
};

export default Sidebar;