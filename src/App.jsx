import React from 'react';
import { CRMProvider, useCRM } from './context/CRMContext';
import Shell from './components/layout/Shell';
import DirectorDashboard from './components/director/DirectorDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import AgentDashboard from './components/agent/AgentDashboard';
import KanbanBoard from './components/pipeline/KanbanBoard';
import PropertyCatalog from './components/properties/PropertyCatalog';
import LeadsTable from './components/leads/LeadsTable';
import PublicPortal from './components/public/PublicPortal';
import LeadDrawer from './components/leads/LeadDrawer';
import NewLeadModal from './components/modals/NewLeadModal';
import NewPropertyModal from './components/modals/NewPropertyModal';
import ReportModal from './components/modals/ReportModal';
import Toast from './components/common/Toast';

import ApprovalsView from './components/approvals/ApprovalsView';
import BoardPipelineView from './components/director/BoardPipelineView';

function AppContent() {
  const { activeTab, role } = useCRM();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (role === 'director') return <DirectorDashboard />;
        if (role === 'manager') return <ManagerDashboard />;
        return <AgentDashboard />;
      case 'pipeline':
        if (role === 'director') return <BoardPipelineView />;
        return <KanbanBoard />;
      case 'properties':
        return <PropertyCatalog />;
      case 'leads':
        return <LeadsTable />;
      case 'approvals':
        return <ApprovalsView />;
      case 'public_portal':
        return <PublicPortal />;
      default:
        return <DirectorDashboard />;
    }
  };

  return (
    <>
      <Shell>
        {renderTabContent()}
      </Shell>
      <LeadDrawer />
      <NewLeadModal />
      <NewPropertyModal />
      <ReportModal />
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <CRMProvider>
      <AppContent />
    </CRMProvider>
  );
}
