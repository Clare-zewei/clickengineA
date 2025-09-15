import React, { useState } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import FunnelAnalysisV2Dashboard from './FunnelAnalysisV2Dashboard';
import FunnelAnalysisV2Builder from './FunnelAnalysisV2Builder';
import FunnelAnalysisV2Details from './FunnelAnalysisV2Details';
import { FunnelV2 } from '../services/funnelAnalysisV2';

const FunnelAnalysisV2Router: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateFunnel = () => {
    navigate('/funnel-analysis-v2/create');
  };

  const handleViewDetails = (funnelId: string) => {
    navigate(`/funnel-analysis-v2/details/${funnelId}`);
  };

  const handleBackToDashboard = () => {
    navigate('/funnel-analysis-v2');
  };

  const handleEditFunnel = (funnel: FunnelV2) => {
    navigate(`/funnel-analysis-v2/edit/${funnel.id}`);
  };

  const handleCopyFunnel = (funnel: FunnelV2) => {
    // For now, just navigate to create with query parameter
    // In a full implementation, you'd pass the funnel data
    navigate('/funnel-analysis-v2/create', { state: { copyFrom: funnel } });
  };

  const handleSaveFunnel = (funnel: FunnelV2) => {
    // Force refresh of dashboard data by navigating with state
    navigate('/funnel-analysis-v2', { state: { refresh: true } });
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <DashboardWrapper 
            onCreateFunnel={handleCreateFunnel}
            onViewDetails={handleViewDetails}
            onEditFunnel={handleEditFunnel}
            onCopyFunnel={handleCopyFunnel}
          />
        } 
      />
      <Route 
        path="/create" 
        element={
          <FunnelAnalysisV2Builder
            onBack={handleBackToDashboard}
            onSave={handleSaveFunnel}
          />
        } 
      />
      <Route 
        path="/edit/:id" 
        element={<EditFunnelWrapper onBack={handleBackToDashboard} onSave={handleSaveFunnel} />}
      />
      <Route 
        path="/details/:id" 
        element={
          <DetailsFunnelWrapper 
            onBack={handleBackToDashboard}
            onEdit={handleEditFunnel}
            onCopy={handleCopyFunnel}
          />
        }
      />
    </Routes>
  );
};

// Wrapper components to handle route parameters
const DashboardWrapper: React.FC<{
  onCreateFunnel: () => void;
  onViewDetails: (funnelId: string) => void;
  onEditFunnel: (funnel: FunnelV2) => void;
  onCopyFunnel: (funnel: FunnelV2) => void;
}> = ({ onCreateFunnel, onViewDetails, onEditFunnel, onCopyFunnel }) => {
  return (
    <FunnelAnalysisV2Dashboard
      onCreateFunnel={onCreateFunnel}
      onViewDetails={onViewDetails}
      onEditFunnel={onEditFunnel}
      onCopyFunnel={onCopyFunnel}
    />
  );
};
const EditFunnelWrapper: React.FC<{
  onBack: () => void;
  onSave: (funnel: FunnelV2) => void;
}> = ({ onBack, onSave }) => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <FunnelAnalysisV2Builder
      funnelId={id}
      onBack={onBack}
      onSave={onSave}
    />
  );
};

const DetailsFunnelWrapper: React.FC<{
  onBack: () => void;
  onEdit: (funnel: FunnelV2) => void;
  onCopy: (funnel: FunnelV2) => void;
}> = ({ onBack, onEdit, onCopy }) => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>Funnel ID not found</div>;
  }
  
  return (
    <FunnelAnalysisV2Details
      funnelId={id}
      onBack={onBack}
      onEdit={onEdit}
      onCopy={onCopy}
    />
  );
};

export default FunnelAnalysisV2Router;