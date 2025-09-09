import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './pages/Dashboard';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import Channels from './pages/Channels';
import Integrations from './pages/Integrations';
import FunnelAnalysis from './pages/FunnelAnalysis';
import FunnelDetails from './pages/FunnelDetails';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="app-layout">
      <Sidebar />
      <Layout className="site-layout">
        <Header />
        <Content className="site-layout-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/channels" element={<Channels />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/funnel-analysis/*" element={<FunnelAnalysis />} />
            <Route path="/funnel/:id" element={<FunnelDetails />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;