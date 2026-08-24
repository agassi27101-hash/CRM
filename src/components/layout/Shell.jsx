import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { ROLES, STAGES } from '../../data/mockData';
import {
  LayoutDashboard,
  Kanban,
  Building,
  Users,
  CheckSquare,
  Globe,
  Search,
  Plus,
  Crown,
  Briefcase,
  UserCheck,
  Menu,
  X,
  Sparkles,
  Flame,
  Clock,
  ChevronDown,
  ChevronRight,
  Filter,
  BarChart3,
  Layers,
  PhoneCall,
  Megaphone,
  BookOpen,
  PhoneMissed,
  Mail,
  UserX,
  FileSpreadsheet,
  PieChart,
  LogOut
} from 'lucide-react';

export default function Shell({ children }) {
  const {
    role,
    setRole,
    currentUser,
    logout,
    activeTab,
    setActiveTab,
    activeSmartList,
    setActiveSmartList,
    setActiveReport,
    searchTerm,
    setSearchTerm,
    setLeadModalOpen,
    approvals,
    leads,
    tasks
  } = useCRM();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAllModules, setShowAllModules] = useState(false);
  const [smartListsOpen, setSmartListsOpen] = useState(true);
  const [pendingTasksOpen, setPendingTasksOpen] = useState(true);
  const [pipelineStagesOpen, setPipelineStagesOpen] = useState(true);
  const [pipelineAnalysisOpen, setPipelineAnalysisOpen] = useState(false);
  const [salesPerfOpen, setSalesPerfOpen] = useState(false);
  const [marketingOpen, setMarketingOpen] = useState(false);
  const [callReportsOpen, setCallReportsOpen] = useState(false);
  const [inventoryReportsOpen, setInventoryReportsOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [approvalsOpen, setApprovalsOpen] = useState(false);

  // Determine which sidebar layer to show based on active icon rail tab
  const sidebarLayer = showAllModules ? 'all' : activeTab;

  // Layer label for sidebar header
  const layerLabels = {
    dashboard: role === 'director' ? 'Board Governance' : role === 'manager' ? 'VP Operations' : 'Agent Workspace',
    leads: 'Leads & Smart Lists',
    pipeline: 'Pipeline & Deals',
    properties: 'Inventory & Assets',
    approvals: 'Governance Approvals',
    public_portal: 'Public Website',
  };
  const sidebarLabel = showAllModules ? 'All Modules' : (layerLabels[activeTab] || 'Board Governance');

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const unassignedLeadsCount = leads.filter((l) => !l.agent).length;
  const openTasksCount = tasks.filter((t) => t.agent === 'VM' && !t.done).length;
  const hotLeadsCount = leads.filter((l) => l.temp === 'hot').length;
  const warmLeadsCount = leads.filter((l) => l.temp === 'warm').length;
  const nriLeadsCount = leads.filter((l) => l.name.includes('NRI') || l.source === 'NRI').length;
  const siteVisitsCount = leads.filter((l) => l.stage === 'site_visit').length;
  const untouchedCount = leads.filter((l) => l.stage === 'new' || l.log.length <= 1).length;

  const currentRoleInfo = ROLES[role.toUpperCase()] || ROLES.DIRECTOR;

  // Smart Lists categories (exact match to Sell.do CRM reference)
  const smartLists = [
    { id: 'all', label: 'All Leads', count: leads.length, icon: Users },
    { id: 'hot', label: 'Hot Leads', count: hotLeadsCount, icon: Flame, color: 'text-rose-500 font-bold' },
    { id: 'warm', label: 'Warm Leads', count: warmLeadsCount, icon: Sparkles, color: 'text-amber-400' },
    { id: 'nri', label: 'NRI Leads', count: nriLeadsCount, icon: Globe },
    { id: 'recently_contacted', label: 'Recently Contacted', count: 4, icon: Clock },
    { id: 'reengaged', label: 'Reengaged Leads', count: 2, icon: BookOpen }
  ];

  // Pending Tasks categories (exact match to Sell.do CRM reference)
  const pendingTasksList = [
    { id: 'new_enquiries', label: 'New Enquiries', count: unassignedLeadsCount, icon: Plus, color: 'text-emerald-400 font-bold' },
    { id: 'missed_calls', label: 'Missed Calls', count: 2, icon: PhoneMissed, color: 'text-rose-400' },
    { id: 'untouched_1', label: 'Untouched Leads - 1 Attempt', count: untouchedCount, icon: Clock },
    { id: 'untouched_2', label: 'Untouched Leads - 2 Attempts', count: 2, icon: Clock },
    { id: 'untouched_3', label: 'Untouched Leads - 3+ Attempts', count: 1, icon: Clock },
    { id: 'missed_followups', label: 'Missed Followups', count: openTasksCount, icon: CheckSquare, color: 'text-amber-400' },
    { id: 'unread_emails', label: 'Unread Emails', count: 3, icon: Mail },
    { id: 'reassigned', label: 'Reassigned To Me', count: 2, icon: UserCheck },
    { id: 'site_visits', label: 'Scheduled Site Visits', count: siteVisitsCount, icon: Building, color: 'text-purple-400' }
  ];

  // Pipeline Analysis reports
  const pipelineAnalysisList = [
    { id: 'lead_stage_analysis', label: 'Lead Stage Analysis' },
    { id: 'lead_funnel', label: 'Lead Funnel' },
    { id: 'lead_unqualified_reasons', label: 'Lead Unqualified Reasons' },
    { id: 'lead_lost_reasons', label: 'Lead Lost Reasons' },
    { id: 'lead_touched_untouched', label: 'Lead Touched / Untouched' }
  ];

  // Sales Performance reports
  const salesPerfList = [
    { id: 'leads_statistics_sales', label: 'Leads Statistics Sales' },
    { id: 'site_visit_by_sales', label: 'Site Visit By Sales' },
    { id: 'site_visit_by_stages', label: 'Site Visit By Stages' },
    { id: 'follow_ups', label: 'Follow Ups' },
    { id: 'booking', label: 'Booking' },
    { id: 'pre_sales_to_sales', label: 'Pre-Sales To Sales' },
    { id: 'leads_reassignment', label: 'Leads Reassignment' },
    { id: 'untouched_attempts', label: 'Untouched Attempts' },
    { id: 'user_tracking_details', label: 'User Tracking Details' },
    { id: 'roster_logs', label: 'Roster Logs' }
  ];

  // Marketing Effect reports
  const marketingList = [
    { id: 'marketing_lead_source', label: 'Lead Source Analysis' },
    { id: 'marketing_campaign_perf', label: 'Campaign Performance' },
    { id: 'marketing_cost_per_lead', label: 'Cost Per Lead' },
    { id: 'marketing_channel_roi', label: 'Channel ROI' }
  ];

  // Call Reports
  const callReportsList = [
    { id: 'call_sales_performance', label: 'Sales Performance' },
    { id: 'call_missed_calls', label: 'Missed Calls Report' },
    { id: 'call_duration_analysis', label: 'Call Duration Analysis' }
  ];

  // Inventory Reports
  const inventoryReportsList = [
    { id: 'inventory_summary', label: 'Inventory Summary' },
    { id: 'inventory_availability', label: 'Unit Availability' },
    { id: 'inventory_pricing', label: 'Pricing Report' }
  ];

  // Products & Services
  const productsList = [
    { id: 'product_management', label: 'Product Management' },
    { id: 'projects', label: 'Projects' },
    { id: 'approvals_negotiation', label: 'Approvals For Negotiation' },
    { id: 'price_quotes', label: 'Price Quotes' }
  ];

  // Approvals
  const approvalMenuList = [
    { id: 'booking_cancellation', label: 'Booking Cancellation' },
    { id: 'receipt', label: 'Receipt' },
    { id: 'payment_schedule', label: 'Payment Schedule' },
    { id: 'applicant_deletion', label: 'Applicant Deletion' },
    { id: 'project_unit', label: 'Project Unit' },
    { id: 'credit_note', label: 'Credit Note', badge: 'NEW' }
  ];

  return (
    <div className="min-h-screen flex bg-[#F4F7F5] text-slate-800 font-sans antialiased selection:bg-gold-500 selection:text-brand-950">
      {/* 1. Primary Left Icon Rail (Slim Dark Bar) */}
      <aside className="fixed inset-y-0 left-0 z-50 w-16 bg-slate-950 text-slate-400 flex flex-col items-center py-4 border-r border-slate-800 shadow-2xl">
        {/* Brand Mark */}
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 flex items-center justify-center shadow-glow text-brand-950 font-extrabold text-lg tracking-tighter shrink-0 mb-6 cursor-pointer">
          M
        </div>

        {/* Icon Action Navigation */}
        <div className="flex-1 space-y-3 flex flex-col items-center">
          <button
            onClick={() => { setActiveTab('dashboard'); setShowAllModules(false); }}
            className={`p-2.5 rounded-xl transition-all ${
              !showAllModules && activeTab === 'dashboard'
                ? 'bg-brand-600 text-white shadow-md'
                : 'hover:bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Dashboard Overview"
          >
            <LayoutDashboard className="w-5 h-5" />
          </button>

          <button
            onClick={() => { setActiveTab('leads'); setShowAllModules(false); }}
            className={`p-2.5 rounded-xl transition-all relative ${
              !showAllModules && activeTab === 'leads'
                ? 'bg-brand-600 text-white shadow-md'
                : 'hover:bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Leads Management & Smart Lists"
          >
            <Users className="w-5 h-5" />
            {unassignedLeadsCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            )}
          </button>

          <button
            onClick={() => { setActiveTab('pipeline'); setShowAllModules(false); }}
            className={`p-2.5 rounded-xl transition-all ${
              !showAllModules && activeTab === 'pipeline'
                ? 'bg-brand-600 text-white shadow-md'
                : 'hover:bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Pipeline Stages"
          >
            <Kanban className="w-5 h-5" />
          </button>

          <button
            onClick={() => { setActiveTab('properties'); setShowAllModules(false); }}
            className={`p-2.5 rounded-xl transition-all ${
              !showAllModules && activeTab === 'properties'
                ? 'bg-brand-600 text-white shadow-md'
                : 'hover:bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Inventory Catalog"
          >
            <Building className="w-5 h-5" />
          </button>

          <button
            onClick={() => { setActiveTab('approvals'); setShowAllModules(false); }}
            className={`p-2.5 rounded-xl transition-all relative ${
              !showAllModules && activeTab === 'approvals'
                ? 'bg-brand-600 text-white shadow-md'
                : 'hover:bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Discount Approvals"
          >
            <CheckSquare className="w-5 h-5" />
            {pendingApprovalsCount > 0 && (
              <span className="absolute top-1 right-1 px-1 py-0.2 text-[8px] font-bold bg-rose-600 text-white rounded-full">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('public_portal'); setShowAllModules(false); }}
            className={`p-2.5 rounded-xl transition-all ${
              !showAllModules && activeTab === 'public_portal'
                ? 'bg-brand-600 text-white shadow-md'
                : 'hover:bg-slate-900 text-slate-400 hover:text-white'
            }`}
            title="Public Website Simulation"
          >
            <Globe className="w-5 h-5 text-emerald-400" />
          </button>
        </div>

        {/* User Role Badge Avatar */}
        <div
          onClick={() => setRole(role === 'director' ? 'manager' : role === 'manager' ? 'agent' : 'director')}
          className="w-9 h-9 rounded-xl bg-gradient-to-tr from-gold-500 to-gold-300 text-slate-950 font-extrabold text-xs flex items-center justify-center cursor-pointer shadow-md"
          title={`Active Role: ${currentRoleInfo.name} (Click to toggle)`}
        >
          {currentRoleInfo.avatar}
        </div>
      </aside>

      {/* 2. Secondary Submenu Panel (Contextual Path Layer Structure) */}
      <aside
        className={`fixed inset-y-0 left-16 z-40 w-56 bg-brand-950 text-slate-200 flex flex-col border-r border-brand-900/60 shadow-xl transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-0 hidden md:flex'
        }`}
      >
        {/* Secondary Submenu Header */}
        <div className="p-3 border-b border-brand-900/80 bg-brand-950 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-extrabold uppercase text-gold-400 tracking-wider truncate">
              {sidebarLabel}
            </span>
            <button
              onClick={() => setLeadModalOpen(true)}
              className="p-1 bg-brand-700 hover:bg-brand-600 text-white rounded-lg text-xs shrink-0"
              title="Quick Add Lead"
            >
              <Plus className="w-4 h-4 text-gold-400" />
            </button>
          </div>

          {/* View Filter Toggle */}
          <div className="flex items-center justify-between text-[10px] font-mono text-brand-300/80 bg-brand-900/60 p-1 rounded-md border border-brand-800/50">
            <span className="text-brand-400 font-bold px-1 uppercase">Menu View</span>
            <button
              onClick={() => setShowAllModules(!showAllModules)}
              className="px-2 py-0.5 bg-gold-500 hover:bg-gold-400 text-brand-950 rounded text-[9px] font-mono font-bold shadow-xs transition-colors"
            >
              {showAllModules ? 'ALL MODULES (11)' : `LAYER: ${activeTab.replace('_',' ').toUpperCase()}`}
            </button>
          </div>
        </div>

        {/* Submenu Scroll Content - Full Sell.do Module Hierarchy */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs font-medium">
          {/* ================= LAYER 1: LEADS MANAGEMENT ================= */}
          {(sidebarLayer === 'all' || sidebarLayer === 'leads') && (
            <>
              {/* LEADS MANAGEMENT */}
              <div>
                <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2">
                  Leads Management
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setLeadModalOpen(true)}
                    className="w-full text-left px-2.5 py-1.5 rounded-lg text-brand-100/80 hover:bg-brand-900/60 hover:text-white flex items-center gap-2"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold-400" /> New Lead
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('leads');
                      setActiveSmartList('all');
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                      activeTab === 'leads' && activeSmartList === 'all'
                        ? 'bg-brand-600 text-white font-bold shadow-sm'
                        : 'text-brand-100/80 hover:bg-brand-900/60 hover:text-white'
                    }`}
                  >
                    <span>All Leads</span>
                    <span className="text-[10px] font-mono text-brand-300 font-bold">{leads.length}</span>
                  </button>
                </div>
              </div>

              {/* SMART LISTS (Collapsible) */}
              <div>
                <button
                  onClick={() => setSmartListsOpen(!smartListsOpen)}
                  className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1">
                    {smartListsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    Smart Lists
                  </span>
                  <Sparkles className="w-3 h-3 text-gold-400" />
                </button>

                {smartListsOpen && (
                  <div className="space-y-0.5 pl-1">
                    {smartLists.map((item) => {
                      const Icon = item.icon;
                      const isSelected = activeTab === 'leads' && activeSmartList === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab('leads');
                            setActiveSmartList(item.id);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-brand-600 text-white font-bold shadow-sm'
                              : 'text-brand-100/80 hover:bg-brand-900/60 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className={`w-3.5 h-3.5 ${item.color || 'text-brand-300'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.count !== null && (
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-brand-900/80 text-brand-200 rounded">
                              {item.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* PENDING TASKS (Collapsible) */}
              <div>
                <button
                  onClick={() => setPendingTasksOpen(!pendingTasksOpen)}
                  className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1">
                    {pendingTasksOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    Pending Tasks
                  </span>
                </button>

                {pendingTasksOpen && (
                  <div className="space-y-0.5 pl-1">
                    {pendingTasksList.map((item) => {
                      const Icon = item.icon;
                      const isSelected = activeTab === 'leads' && activeSmartList === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab('leads');
                            setActiveSmartList(item.id);
                          }}
                          className={`w-full flex items-center justify-between px-2.5 py-1 rounded-lg transition-colors text-[11px] ${
                            isSelected
                              ? 'bg-brand-600 text-white font-bold shadow-sm'
                              : 'text-brand-100/75 hover:bg-brand-900/60 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <Icon className={`w-3 h-3 ${item.color || 'text-brand-400'}`} />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {item.count > 0 && (
                            <span className="text-[9px] font-mono px-1.5 py-0.2 bg-brand-900 text-brand-300 rounded font-bold">
                              {item.count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ================= LAYER 2: ROLE-SPECIFIC DASHBOARD ================= */}
          {(sidebarLayer === 'all' || sidebarLayer === 'dashboard') && (
            <>
              {/* SECTION HEADER — role-labelled */}
              <div>
                <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2">
                  {role === 'director' ? 'Board Controls' : role === 'manager' ? 'Operations Control' : 'My Day Analytics'}
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                      activeTab === 'dashboard'
                        ? 'bg-brand-600 text-white font-bold shadow-sm'
                        : 'text-brand-100/80 hover:bg-brand-900/60 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <LayoutDashboard className="w-3.5 h-3.5 text-gold-400" />
                      {role === 'director' ? 'Executive Overview' : role === 'manager' ? 'Manager Control Hub' : 'My Day Overview'}
                    </span>
                  </button>
                </div>
              </div>

              {/* ---- BOARD-ONLY: Full Pipeline Analysis (5 reports) ---- */}
              {role === 'director' && (
                <div>
                  <button
                    onClick={() => setPipelineAnalysisOpen(!pipelineAnalysisOpen)}
                    className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1">
                      {pipelineAnalysisOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      Pipeline Analysis
                    </span>
                    <BarChart3 className="w-3 h-3 text-gold-400" />
                  </button>
                  {pipelineAnalysisOpen && (
                    <div className="space-y-0.5 pl-1">
                      {pipelineAnalysisList.map((rep) => (
                        <button key={rep.id} onClick={() => setActiveReport({ id: rep.id, label: rep.label, category: 'PIPELINE ANALYSIS' })}
                          className="w-full text-left px-2.5 py-1 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] truncate">
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---- MANAGER: Pipeline Overview (2 reports only) ---- */}
              {role === 'manager' && (
                <div>
                  <button
                    onClick={() => setPipelineAnalysisOpen(!pipelineAnalysisOpen)}
                    className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1">
                      {pipelineAnalysisOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      Pipeline Overview
                    </span>
                    <BarChart3 className="w-3 h-3 text-gold-400" />
                  </button>
                  {pipelineAnalysisOpen && (
                    <div className="space-y-0.5 pl-1">
                      {pipelineAnalysisList.slice(0, 2).map((rep) => (
                        <button key={rep.id} onClick={() => setActiveReport({ id: rep.id, label: rep.label, category: 'PIPELINE ANALYSIS' })}
                          className="w-full text-left px-2.5 py-1 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] truncate">
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---- BOARD: Full Sales Performance (10 reports) ---- */}
              {role === 'director' && (
                <div>
                  <button
                    onClick={() => setSalesPerfOpen(!salesPerfOpen)}
                    className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1">
                      {salesPerfOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      Sales Performance
                    </span>
                  </button>
                  {salesPerfOpen && (
                    <div className="space-y-0.5 pl-1">
                      {salesPerfList.map((rep) => (
                        <button key={rep.id} onClick={() => setActiveReport({ id: rep.id, label: rep.label, category: 'SALES PERFORMANCE' })}
                          className="w-full text-left px-2.5 py-1 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] truncate">
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---- MANAGER: Operational Sales Reports (6 reports) ---- */}
              {role === 'manager' && (
                <div>
                  <button
                    onClick={() => setSalesPerfOpen(!salesPerfOpen)}
                    className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1">
                      {salesPerfOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      Team Sales Reports
                    </span>
                  </button>
                  {salesPerfOpen && (
                    <div className="space-y-0.5 pl-1">
                      {[salesPerfList[0], salesPerfList[1], salesPerfList[3], salesPerfList[4], salesPerfList[5], salesPerfList[9]].map((rep) => (
                        <button key={rep.id} onClick={() => setActiveReport({ id: rep.id, label: rep.label, category: 'SALES PERFORMANCE' })}
                          className="w-full text-left px-2.5 py-1 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] truncate">
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---- AGENT: Personal Task Shortcuts ---- */}
              {role === 'agent' && (
                <div>
                  <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2">
                    My Tasks & Follow-Ups
                  </div>
                  <div className="space-y-0.5">
                    {[
                      { id: 'follow_ups', label: 'My Follow Ups', icon: CheckSquare, color: 'text-amber-400' },
                      { id: 'missed_calls', label: 'Missed Calls', icon: PhoneMissed, color: 'text-rose-400' },
                      { id: 'site_visits', label: 'Scheduled Site Visits', icon: Building, color: 'text-purple-400' },
                      { id: 'untouched_1', label: 'Untouched Leads', icon: Clock, color: 'text-brand-300' },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button key={item.id}
                          onClick={() => { setActiveTab('leads'); setActiveSmartList(item.id); }}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px]">
                          <Icon className={`w-3.5 h-3.5 ${item.color}`} />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ---- BOARD-ONLY: Full Marketing Effect (4 reports) ---- */}
              {role === 'director' && (
                <div>
                  <button
                    onClick={() => setMarketingOpen(!marketingOpen)}
                    className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1">
                      {marketingOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      Marketing Effect
                    </span>
                    <Megaphone className="w-3 h-3 text-brand-400" />
                  </button>
                  {marketingOpen && (
                    <div className="space-y-0.5 pl-1">
                      {marketingList.map((rep) => (
                        <button key={rep.id} onClick={() => setActiveReport({ id: rep.id, label: rep.label, category: 'MARKETING EFFECT' })}
                          className="w-full text-left px-2.5 py-1 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] truncate">
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---- BOARD + MANAGER: Call Reports ---- */}
              {role !== 'agent' && (
                <div>
                  <button
                    onClick={() => setCallReportsOpen(!callReportsOpen)}
                    className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1">
                      {callReportsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      Call Reports
                    </span>
                    <PhoneCall className="w-3 h-3 text-brand-400" />
                  </button>
                  {callReportsOpen && (
                    <div className="space-y-0.5 pl-1">
                      {callReportsList.map((rep) => (
                        <button key={rep.id} onClick={() => setActiveReport({ id: rep.id, label: rep.label, category: 'CALL REPORTS' })}
                          className="w-full text-left px-2.5 py-1 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] truncate">
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ---- AGENT: My Call Log shortcut ---- */}
              {role === 'agent' && (
                <div>
                  <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2">
                    My Call Log
                  </div>
                  <div className="space-y-0.5">
                    <button onClick={() => setActiveReport({ id: 'call_missed_calls', label: 'Missed Calls Report', category: 'CALL REPORTS' })}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] flex items-center gap-2">
                      <PhoneMissed className="w-3.5 h-3.5 text-rose-400" /> Missed Calls
                    </button>
                    <button onClick={() => setActiveReport({ id: 'call_duration_analysis', label: 'Call Duration Analysis', category: 'CALL REPORTS' })}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] flex items-center gap-2">
                      <PhoneCall className="w-3.5 h-3.5 text-brand-300" /> Call Duration
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= LAYER 3: PIPELINE & DEALS ================= */}
          {(sidebarLayer === 'all' || sidebarLayer === 'pipeline') && (
            <>
              {/* PIPELINE STAGES (Collapsible) */}
              <div>
                <button
                  onClick={() => setPipelineStagesOpen(!pipelineStagesOpen)}
                  className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1">
                    {pipelineStagesOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    Pipeline Stages
                  </span>
                  <Kanban className="w-3 h-3 text-gold-400" />
                </button>

                {pipelineStagesOpen && (
                  <div className="space-y-0.5 pl-1">
                    {STAGES.map((stage) => {
                      const stageCount = leads.filter((l) => l.stage === stage.id).length;
                      return (
                        <button
                          key={stage.id}
                          onClick={() => {
                            setActiveTab('pipeline');
                          }}
                          className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-brand-100/80 hover:bg-brand-900/60 hover:text-white text-[11px]"
                        >
                          <span className="truncate">{stage.label}</span>
                          <span className="text-[10px] font-mono text-brand-300 font-bold">{stageCount}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* PIPELINE ANALYSIS QUICK LINK */}
              <div>
                <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2">
                  Deal Analytics
                </div>
                <div className="space-y-0.5">
                  {pipelineAnalysisList.slice(0, 3).map((rep) => (
                    <button key={rep.id} onClick={() => setActiveReport({ id: rep.id, label: rep.label, category: 'PIPELINE ANALYSIS' })}
                      className="w-full text-left px-2.5 py-1 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] truncate">
                      {rep.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ================= LAYER 4: INVENTORY & ASSETS ================= */}
          {(sidebarLayer === 'all' || sidebarLayer === 'properties') && (
            <>
              {/* INVENTORY CATALOG */}
              <div>
                <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2">
                  {role === 'director' ? 'Portfolio Management' : role === 'manager' ? 'Inventory Control' : 'Property Catalog'}
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setActiveTab('properties')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                      activeTab === 'properties'
                        ? 'bg-brand-600 text-white font-bold shadow-sm'
                        : 'text-brand-100/80 hover:bg-brand-900/60 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-gold-400" />
                      {role === 'agent' ? 'Browse Properties' : 'All Properties'}
                    </span>
                  </button>
                </div>
              </div>

              {/* INVENTORY REPORTS (Collapsible) */}
              <div>
                <button
                  onClick={() => setInventoryReportsOpen(!inventoryReportsOpen)}
                  className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1">
                    {inventoryReportsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    Inventory Reports
                  </span>
                  <FileSpreadsheet className="w-3 h-3 text-gold-400" />
                </button>
                {inventoryReportsOpen && (
                  <div className="space-y-0.5 pl-1">
                    {inventoryReportsList.map((rep) => (
                      <button key={rep.id} onClick={() => setActiveReport({ id: rep.id, label: rep.label, category: 'INVENTORY REPORTS' })}
                        className="w-full text-left px-2.5 py-1 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] truncate">
                        {rep.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* PRODUCTS & SERVICES — Board and Manager only */}
              {role !== 'agent' && (
                <div>
                  <button
                    onClick={() => setProductsOpen(!productsOpen)}
                    className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1">
                      {productsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      Products &amp; Services
                    </span>
                  </button>
                  {productsOpen && (
                    <div className="space-y-0.5 pl-1">
                      {(role === 'director' ? productsList : productsList.slice(1, 3)).map((rep) => (
                        <button key={rep.id} onClick={() => setActiveReport({ id: rep.id, label: rep.label, category: 'PRODUCTS & SERVICES' })}
                          className="w-full text-left px-2.5 py-1 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px] truncate">
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* ================= LAYER 5: GOVERNANCE APPROVALS ================= */}
          {(sidebarLayer === 'all' || sidebarLayer === 'approvals') && (
            <>
              {/* GOVERNANCE DISCOUNTS */}
              <div>
                <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2">
                  Governance & Sign-Offs
                </div>
                <div className="space-y-0.5">
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                      activeTab === 'approvals'
                        ? 'bg-brand-600 text-white font-bold shadow-sm'
                        : 'text-brand-100/80 hover:bg-brand-900/60 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <CheckSquare className="w-3.5 h-3.5 text-gold-400" />
                      Pending Requests
                    </span>
                    {pendingApprovalsCount > 0 && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-rose-600 text-white rounded-full">
                        {pendingApprovalsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* APPROVAL TYPES — role-filtered */}
              {role !== 'agent' && (
                <div>
                  <button
                    onClick={() => setApprovalsOpen(!approvalsOpen)}
                    className="w-full text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1">
                      {approvalsOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                      {role === 'director' ? 'Approval Types' : 'My Approvals Queue'}
                    </span>
                  </button>
                  {approvalsOpen && (
                    <div className="space-y-0.5 pl-1">
                      {(role === 'director' ? approvalMenuList : approvalMenuList.slice(0, 3)).map((rep) => (
                        <button key={rep.id} onClick={() => {
                          setActiveTab('approvals');
                          setActiveReport({ id: rep.id, label: rep.label, category: 'GOVERNANCE APPROVALS' });
                        }}
                          className="w-full flex items-center justify-between px-2.5 py-1 rounded-lg text-brand-100/75 hover:bg-brand-900/60 hover:text-white text-[11px]">
                          <span className="truncate">{rep.label}</span>
                          {rep.badge && (
                            <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 bg-brand-500 text-white rounded uppercase shrink-0 ml-1">
                              {rep.badge}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {/* AGENT: Only sees their own discount requests */}
              {role === 'agent' && (
                <div>
                  <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2">
                    My Requests
                  </div>
                  <div className="space-y-0.5">
                    <button onClick={() => setActiveTab('approvals')}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-brand-100/80 hover:bg-brand-900/60 hover:text-white text-[11px] flex items-center gap-2">
                      <PieChart className="w-3.5 h-3.5 text-amber-400" /> My Discount Requests
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= LAYER 6: PUBLIC PORTAL ================= */}
          {(sidebarLayer === 'all' || sidebarLayer === 'public_portal') && (
            <div>
              <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-brand-400/70 mb-1.5 px-2">
                Public Website Portal
              </div>
              <div className="space-y-0.5">
                <button
                  onClick={() => setActiveTab('public_portal')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between ${
                    activeTab === 'public_portal'
                      ? 'bg-brand-600 text-white font-bold shadow-sm'
                      : 'text-brand-100/80 hover:bg-brand-900/60 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    Buyer Portal Simulation
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Role Switcher */}
        <div className="p-3 border-t border-brand-900/80 bg-brand-950 text-xs">
          <div className="text-[10px] font-mono text-brand-400 uppercase tracking-widest mb-1.5">
            Active Role
          </div>
          <div className="flex items-center gap-2 p-2 bg-brand-900/80 rounded-lg">
            <div className="w-6 h-6 rounded bg-gold-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0">
              {currentRoleInfo.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-white truncate text-[11px]">{currentRoleInfo.name}</div>
              <div className="text-[9px] text-gold-400 truncate">{currentRoleInfo.badge}</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 md:pl-[272px] flex flex-col min-w-0 min-h-screen">
        {/* Glassmorphism Header Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          <div className="px-4 md:px-8 py-3 flex items-center justify-between gap-4">
            {/* Mobile Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* View Title */}
            <div className="hidden sm:block">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                {activeTab === 'dashboard' && role === 'director' && 'Board of Directors Governance'}
                {activeTab === 'dashboard' && role === 'manager' && 'VP Sales & Branch Control Hub'}
                {activeTab === 'dashboard' && role === 'agent' && 'Sales Agent Workspace ("My Day")'}
                {activeTab === 'pipeline' && (role === 'director' ? 'Group Strategic Pipeline' : role === 'manager' ? 'Branch Deal Pipeline' : 'My Lead Pipeline')}
                {activeTab === 'properties' && (role === 'director' ? 'Portfolio Asset Valuation' : role === 'manager' ? 'Inventory & Pricing Control' : 'Property Catalog & AI Match')}
                {activeTab === 'leads' && (activeSmartList !== 'all' ? `Smart List / Task: ${activeSmartList.toUpperCase()}` : 'All Buyer Accounts')}
                {activeTab === 'approvals' && (role === 'director' ? 'Commercial Governance Audit Log' : role === 'manager' ? 'Discount Authorization Sign-offs' : 'My Discount Requests')}
                {activeTab === 'public_portal' && 'Customer Website Portal Simulation'}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Meridian Estates Group · Chennai Headquarters
              </p>
            </div>

            {/* Global Search */}
            <div className="relative flex-1 max-w-sm ml-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads, properties, ref IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-100/90 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-600 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Separated User Role Cards */}
            <div className="flex items-center gap-2">
              {/* Board / Director */}
              <button
                onClick={() => setRole('director')}
                title="Switch to Board of Directors View"
                className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                  role === 'director'
                    ? 'bg-brand-600 border-brand-500 shadow-md shadow-brand-900/30 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-400 hover:shadow-sm hover:text-slate-900'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                  role === 'director' ? 'bg-gold-400 text-slate-900' : 'bg-slate-100 text-slate-700 group-hover:bg-brand-50'
                }`}>
                  BD
                </div>
                <div className="hidden lg:flex flex-col items-start leading-none">
                  <span className="text-[11px] font-extrabold tracking-tight">Board</span>
                  <span className={`text-[9px] font-mono mt-0.5 ${role === 'director' ? 'text-gold-300' : 'text-slate-400'}`}>Director</span>
                </div>
                <Crown className={`w-3.5 h-3.5 hidden lg:block ${role === 'director' ? 'text-gold-300' : 'text-slate-300 group-hover:text-brand-400'}`} />
              </button>

              {/* Manager */}
              <button
                onClick={() => setRole('manager')}
                title="Switch to Manager View"
                className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                  role === 'manager'
                    ? 'bg-brand-600 border-brand-500 shadow-md shadow-brand-900/30 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-400 hover:shadow-sm hover:text-slate-900'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                  role === 'manager' ? 'bg-gold-400 text-slate-900' : 'bg-slate-100 text-slate-700 group-hover:bg-brand-50'
                }`}>
                  RK
                </div>
                <div className="hidden lg:flex flex-col items-start leading-none">
                  <span className="text-[11px] font-extrabold tracking-tight">Manager</span>
                  <span className={`text-[9px] font-mono mt-0.5 ${role === 'manager' ? 'text-gold-300' : 'text-slate-400'}`}>Branch VP</span>
                </div>
                <Briefcase className={`w-3.5 h-3.5 hidden lg:block ${role === 'manager' ? 'text-gold-300' : 'text-slate-300 group-hover:text-brand-400'}`} />
              </button>

              {/* Agent */}
              <button
                onClick={() => setRole('agent')}
                title="Switch to Agent View"
                className={`group flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-all duration-200 ${
                  role === 'agent'
                    ? 'bg-brand-600 border-brand-500 shadow-md shadow-brand-900/30 text-white'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-brand-400 hover:shadow-sm hover:text-slate-900'
                }`}
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 ${
                  role === 'agent' ? 'bg-gold-400 text-slate-900' : 'bg-slate-100 text-slate-700 group-hover:bg-brand-50'
                }`}>
                  VM
                </div>
                <div className="hidden lg:flex flex-col items-start leading-none">
                  <span className="text-[11px] font-extrabold tracking-tight">Agent</span>
                  <span className={`text-[9px] font-mono mt-0.5 ${role === 'agent' ? 'text-gold-300' : 'text-slate-400'}`}>Sales Rep</span>
                </div>
                <UserCheck className={`w-3.5 h-3.5 hidden lg:block ${role === 'agent' ? 'text-gold-300' : 'text-slate-300 group-hover:text-brand-400'}`} />
              </button>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={() => setLeadModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-all shadow-md shadow-brand-900/20 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-gold-400" />
              <span className="hidden sm:inline">Add Lead</span>
            </button>

            {/* User Profile & Sign Out Button */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 shrink-0">
              <div className="hidden xl:flex flex-col items-end leading-none text-right">
                <span className="text-xs font-extrabold text-slate-800 tracking-tight">
                  {currentUser?.name || currentRoleInfo.name}
                </span>
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                  {currentUser?.branch || 'HQ'}
                </span>
              </div>
              <button
                onClick={logout}
                title="Sign Out / Switch Workstation"
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-300 text-slate-500 hover:text-rose-600 transition-all duration-200 shadow-2xs group flex items-center gap-1.5 text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition-colors" />
                <span className="hidden md:inline text-[11px]">Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* View Viewport */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto animate-fade-in space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
