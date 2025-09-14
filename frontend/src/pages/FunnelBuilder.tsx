import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Spin,
  message,
  Tabs,
  Modal,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  SettingOutlined,
  CopyOutlined,
  EditOutlined,
  DeleteOutlined,
  FunnelPlotOutlined,
  SyncOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { 
  mockDataService, 
  FunnelTemplate, 
  GA4Event, 
  CustomEvent 
} from '../services/mockData';
import FunnelTemplateBuilder from '../components/FunnelTemplateBuilder';
import FunnelTemplateCard from '../components/FunnelTemplateCard';
import CustomEventManager from '../components/CustomEventManager';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const FunnelBuilder: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<FunnelTemplate[]>([]);
  const [ga4Events, setGA4Events] = useState<GA4Event[]>([]);
  const [customEvents, setCustomEvents] = useState<CustomEvent[]>([]);
  const [builderVisible, setBuilderVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FunnelTemplate | null>(null);
  const [activeTab, setActiveTab] = useState('templates');
  const [customEventModalVisible, setCustomEventModalVisible] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [templatesData, eventsData, customEventsData] = await Promise.all([
        mockDataService.getFunnelTemplates(),
        mockDataService.getGA4Events(),
        mockDataService.getCustomEvents()
      ]);

      setTemplates(templatesData);
      setGA4Events(eventsData);
      setCustomEvents(customEventsData);
      
      // Get last sync time from most recent template
      const mostRecentSync = templatesData.reduce((latest, template) => {
        if (template.lastSyncedAt && (!latest || template.lastSyncedAt > latest)) {
          return template.lastSyncedAt;
        }
        return latest;
      }, null as string | null);
      setLastSyncTime(mostRecentSync);
    } catch (error) {
      message.error('Failed to fetch configuration data');
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditingTemplate(null);
    setBuilderVisible(true);
  };

  const handleEditTemplate = (template: FunnelTemplate) => {
    setEditingTemplate(template);
    setBuilderVisible(true);
  };

  const handleCopyTemplate = async (template: FunnelTemplate) => {
    try {
      const copiedTemplate = {
        ...template,
        name: `${template.name} (Copy)`,
        id: undefined,
        createdAt: undefined,
        updatedAt: undefined
      };
      delete copiedTemplate.id;
      delete copiedTemplate.createdAt;
      delete copiedTemplate.updatedAt;

      const newTemplate = await mockDataService.saveFunnelTemplate(copiedTemplate);
      setTemplates([...templates, newTemplate]);
      message.success('Template copied successfully');
    } catch (error) {
      message.error('Failed to copy template');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      await mockDataService.deleteFunnelTemplate(templateId);
      setTemplates(templates.filter(t => t.id !== templateId));
      message.success('Template deleted successfully');
    } catch (error) {
      message.error('Failed to delete template');
    }
  };

  const handleTemplateSaved = (template: FunnelTemplate) => {
    if (editingTemplate) {
      setTemplates(templates.map(t => t.id === editingTemplate.id ? template : t));
      message.success('Template updated successfully');
    } else {
      setTemplates([...templates, template]);
      message.success('Template created successfully');
    }
    setBuilderVisible(false);
    setEditingTemplate(null);
  };

  const handleCustomEventSaved = (event: CustomEvent) => {
    setCustomEvents([...customEvents, event]);
    setCustomEventModalVisible(false);
  };


  const handleSyncGA4Data = async () => {
    setSyncing(true);
    try {
      message.loading('Syncing with GA4...', 0);
      
      // Simulate GA4 API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, this would call GA4 API to get actual data
      // For now, we'll simulate updating the existing templates with new actual conversion rates
      const updatedTemplates = await Promise.all(
        templates.map(async template => {
          const updatedTemplate = await mockDataService.syncTemplateWithGA4(template.id);
          return updatedTemplate;
        })
      );
      
      setTemplates(updatedTemplates);
      setLastSyncTime(new Date().toISOString());
      message.destroy();
      message.success(`Successfully synced ${updatedTemplates.length} templates with GA4 data`);
      
    } catch (error) {
      message.destroy();
      message.error('Failed to sync with GA4. Please check your connection and try again.');
      console.error('GA4 sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const renderExistingTemplates = () => {
    if (templates.length === 0) {
      return (
        <Card style={{ textAlign: 'center', padding: '40px' }}>
          <FunnelPlotOutlined style={{ fontSize: '48px', color: '#d9d9d9', marginBottom: '16px' }} />
          <Title level={4} style={{ color: '#999' }}>No Funnel Templates Created</Title>
          <Text type="secondary">Create your first funnel template to get started with conversion analysis</Text>
          <br />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNew} style={{ marginTop: '16px' }}>
            Create First Template
          </Button>
        </Card>
      );
    }

    return (
      <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>Existing Funnel Templates ({templates.length})</Title>
            <Text type="secondary">Manage and compare your conversion funnel templates</Text>
            {lastSyncTime && (
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  Last synced: {new Date(lastSyncTime).toLocaleString()}
                </Text>
              </div>
            )}
          </div>
          <Space>
            <Button 
              icon={<SyncOutlined />} 
              onClick={handleSyncGA4Data}
              loading={syncing}
              disabled={templates.length === 0}
            >
              {syncing ? 'Syncing...' : 'Sync with GA4'}
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateNew}>
              Create New Template
            </Button>
          </Space>
        </div>

        <Row gutter={[16, 16]}>
          {templates.map(template => (
            <Col span={8} key={template.id}>
              <FunnelTemplateCard
                template={template}
                onEdit={() => handleEditTemplate(template)}
                onCopy={() => handleCopyTemplate(template)}
                onDelete={() => handleDeleteTemplate(template.id)}
                roiColor="#1890ff"
              />
            </Col>
          ))}
        </Row>
      </>
    );
  };

  const renderCustomEventManager = () => {
    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <Title level={4} style={{ margin: 0 }}>My Custom Events ({customEvents.length})</Title>
            <Text type="secondary">Create and manage custom GA4 events for your specific business needs</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCustomEventModalVisible(true)}>
            Add New Custom Event
          </Button>
        </div>

        <CustomEventManager
          events={customEvents}
          onEventSaved={handleCustomEventSaved}
          onEventDeleted={(eventId) => {
            setCustomEvents(customEvents.filter(e => e.id !== eventId));
          }}
        />
      </div>
    );
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', margin: '50px auto' }} />;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
          <SettingOutlined style={{ marginRight: 12 }} />
          📊 Funnel Template Configuration
        </Title>
        <Text type="secondary" style={{ fontSize: 16, marginTop: 8, display: 'block' }}>
          Create, manage, and optimize your marketing conversion funnel templates for different business scenarios
        </Text>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane
          tab={
            <Space>
              <FunnelPlotOutlined />
              Funnel Templates
            </Space>
          }
          key="templates"
        >
          {renderExistingTemplates()}
        </TabPane>

        <TabPane
          tab={
            <Space>
              <SettingOutlined />
              Custom Events
            </Space>
          }
          key="events"
        >
          {renderCustomEventManager()}
        </TabPane>
      </Tabs>

      {/* Funnel Template Builder Modal */}
      <Modal
        title={editingTemplate ? `Edit Template: ${editingTemplate.name}` : 'Create New Funnel Template'}
        open={builderVisible}
        onCancel={() => {
          setBuilderVisible(false);
          setEditingTemplate(null);
        }}
        footer={null}
        width="90%"
        style={{ top: 20 }}
        destroyOnClose
      >
        <FunnelTemplateBuilder />
      </Modal>
    </div>
  );
};

export default FunnelBuilder;