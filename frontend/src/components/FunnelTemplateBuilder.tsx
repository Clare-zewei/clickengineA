import React, { useState } from 'react';
import { Layout } from 'antd';
import TemplateSelector, { FunnelTemplate } from './FunnelBuilder/TemplateSelector';
import FunnelStepsList from './FunnelBuilder/FunnelStepsList';

const { Content } = Layout;

const FunnelTemplateBuilder: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<FunnelTemplate | null | undefined>(undefined);
  const [showTemplateSelector, setShowTemplateSelector] = useState(true);

  const handleSelectTemplate = (template: FunnelTemplate | null) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  const handleBackToTemplates = () => {
    setShowTemplateSelector(true);
    setSelectedTemplate(undefined);
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      <Content>
        {showTemplateSelector ? (
          <TemplateSelector onSelectTemplate={handleSelectTemplate} />
        ) : (
          <FunnelStepsList 
            template={selectedTemplate === undefined ? null : selectedTemplate} 
            onBack={handleBackToTemplates} 
          />
        )}
      </Content>
    </Layout>
  );
};

export default FunnelTemplateBuilder;