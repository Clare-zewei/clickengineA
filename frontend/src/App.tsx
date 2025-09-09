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
import Analytics from './pages/Analytics';
import Configuration from './pages/Configuration';
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
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/configuration" element={<Configuration />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;