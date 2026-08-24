import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ROLES,
  PEOPLE,
  STAGES,
  LOCALITIES,
  INITIAL_PROPERTIES,
  INITIAL_LEADS,
  INITIAL_APPROVALS,
  INITIAL_TASKS,
  INITIAL_VISITS,
  FINANCIAL_METRICS
} from '../data/mockData';

const CRMContext = createContext();

export function CRMProvider({ children }) {
  const [role, setRoleState] = useState(() => {
    return localStorage.getItem('crm_role') || 'director';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSmartList, setActiveSmartList] = useState('all');
  const [activeReport, setActiveReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState([]);

  // Collections state with LocalStorage persistence
  const [leads, setLeads] = useState(() => {
    const saved = localStorage.getItem('crm_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [properties, setProperties] = useState(() => {
    const saved = localStorage.getItem('crm_properties');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [approvals, setApprovals] = useState(() => {
    const saved = localStorage.getItem('crm_approvals');
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('crm_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [visits, setVisits] = useState(() => {
    const saved = localStorage.getItem('crm_visits');
    return saved ? JSON.parse(saved) : INITIAL_VISITS;
  });

  // UI Drawers & Modals
  const [activeLeadDrawerId, setActiveLeadDrawerId] = useState(null);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  const [propertyModalOpen, setPropertyModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('crm_role', role);
  }, [role]);

  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('crm_properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('crm_approvals', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem('crm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('crm_visits', JSON.stringify(visits));
  }, [visits]);

  // Toast Helper
  const showToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const setRole = (newRole) => {
    setRoleState(newRole);
    const roleName = ROLES[newRole.toUpperCase()]?.name || newRole;
    showToast(`Switched view to ${roleName}`, 'success');
  };

  // Currency Formatter Utility (₹ Cr / ₹ Lakhs)
  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(val)) return '₹0';
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)} L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  // Lead Actions
  const addLead = (leadData) => {
    const newId = `L-${1040 + leads.length + 1}`;
    const newLead = {
      id: newId,
      temp: 'warm',
      stage: 'new',
      next: leadData.agent ? 'First call pending' : 'Requires manager assignment',
      log: [{ t: `Enquiry generated via ${leadData.source || 'Direct Entry'}`, w: 'Just now' }],
      ...leadData,
      budget: Number(leadData.budget)
    };

    setLeads((prev) => [newLead, ...prev]);

    if (leadData.agent) {
      // Create auto task
      const newTask = {
        id: Date.now(),
        agent: leadData.agent,
        t: `First call to ${newLead.name}`,
        s: `${newId} · New Lead`,
        when: 'Today',
        done: false
      };
      setTasks((prev) => [newTask, ...prev]);
    }

    showToast(`Lead ${newLead.name} created successfully (${newId})`, 'success');
    return newLead;
  };

  const updateLeadStage = (id, newStage) => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === id) {
          const stageObj = STAGES.find((s) => s.id === newStage);
          const updatedLog = [
            { t: `Stage updated to: ${stageObj?.label || newStage}`, w: 'Just now' },
            ...lead.log
          ];
          return {
            ...lead,
            stage: newStage,
            log: updatedLog
          };
        }
        return lead;
      })
    );
    showToast(`Lead ${id} moved to ${STAGES.find((s) => s.id === newStage)?.label}`, 'info');
  };

  const assignLead = (leadId, agentKey) => {
    const agentObj = PEOPLE[agentKey];
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id === leadId) {
          const updatedLog = [
            { t: `Assigned to ${agentObj?.name || agentKey}`, w: 'Just now' },
            ...lead.log
          ];
          return {
            ...lead,
            agent: agentKey,
            next: `Follow up assigned to ${agentObj?.name.split(' ')[0]}`,
            log: updatedLog
          };
        }
        return lead;
      })
    );

    if (agentKey) {
      setTasks((prev) => [
        {
          id: Date.now(),
          agent: agentKey,
          t: `Contact assigned lead ${leadId}`,
          s: `${leadId} · Assigned by VP`,
          when: 'Today',
          done: false
        },
        ...prev
      ]);
    }

    showToast(`Assigned lead ${leadId} to ${agentObj?.name || 'Agent'}`, 'success');
  };

  const autoAssignLeads = () => {
    const unassigned = leads.filter((l) => !l.agent);
    if (unassigned.length === 0) {
      showToast('No unassigned leads in queue', 'info');
      return;
    }

    const agentKeys = ['VM', 'AP', 'SK', 'RD'];
    let idx = 0;

    setLeads((prev) =>
      prev.map((l) => {
        if (!l.agent) {
          const assignedAgent = agentKeys[idx % agentKeys.length];
          idx++;
          return {
            ...l,
            agent: assignedAgent,
            next: `AI Auto-assigned to ${PEOPLE[assignedAgent].name.split(' ')[0]}`,
            log: [{ t: `AI auto-assigned to ${PEOPLE[assignedAgent].name}`, w: 'Just now' }, ...l.log]
          };
        }
        return l;
      })
    );

    showToast(`AI Auto-assigned ${unassigned.length} leads across active agents`, 'success');
  };

  const addLeadInteractionLog = (leadId, logText) => {
    if (!logText.trim()) return;
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            log: [{ t: logText.trim(), w: 'Just now' }, ...l.log]
          };
        }
        return l;
      })
    );
    showToast('Interaction logged to timeline', 'success');
  };

  // Discount Approvals
  const requestDiscountApproval = ({ leadId, propId, offerAmount, note }) => {
    const newAp = {
      id: `AP-${100 + approvals.length + 1}`,
      leadId,
      propId,
      agent: role === 'agent' ? 'VM' : 'AP',
      list: properties.find((p) => p.id === propId)?.price || offerAmount * 1.05,
      offer: Number(offerAmount),
      discountPct: (((properties.find((p) => p.id === propId)?.price || offerAmount) - offerAmount) / (properties.find((p) => p.id === propId)?.price || 1)) * 100,
      status: 'pending',
      note: note || 'Customer requested special pricing for quick closure.',
      w: 'Just now'
    };

    setApprovals((prev) => [newAp, ...prev]);

    // Update lead next action
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            stage: 'nego',
            next: `Approval ${newAp.id} pending VP sign-off`,
            log: [{ t: `Requested discount approval ${newAp.id} (${formatCurrency(offerAmount)})`, w: 'Just now' }, ...l.log]
          };
        }
        return l;
      })
    );

    showToast(`Discount approval request ${newAp.id} submitted to VP Manager`, 'success');
  };

  const decideApproval = (apId, status, approverRole = role) => {
    const ap = approvals.find((a) => a.id === apId);
    if (!ap) return;

    const approverName = approverRole === 'director' ? 'Executive Board' : 'VP Rajiv Kapoor';

    setApprovals((prev) =>
      prev.map((a) => (a.id === apId ? { ...a, status, decidedBy: approverName } : a))
    );

    // Log in Lead
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === ap.leadId) {
          return {
            ...l,
            next: status === 'approved' ? `Approval granted by ${approverName}. Proceed to close.` : `Approval rejected by ${approverName}.`,
            log: [{ t: `Discount request ${apId} was ${status} by ${approverName}`, w: 'Just now' }, ...l.log]
          };
        }
        return l;
      })
    );

    showToast(`Approval ${apId} ${status.toUpperCase()} by ${approverName}`, status === 'approved' ? 'success' : 'warning');
  };

  // Property Actions
  const addProperty = (propData) => {
    const newProp = {
      id: `PROP-${100 + properties.length + 1}`,
      days: 1,
      status: 'Available',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      ...propData,
      price: Number(propData.price),
      sqft: Number(propData.sqft),
      bhk: Number(propData.bhk)
    };

    setProperties((prev) => [newProp, ...prev]);
    showToast(`Property ${newProp.title} added to inventory`, 'success');
  };

  const updatePropertyStatus = (propId, status) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propId ? { ...p, status } : p))
    );
    showToast(`Property ${propId} status changed to ${status}`, 'info');
  };

  // Task Actions
  const toggleTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    );
  };

  // Visits
  const scheduleVisit = (visitObj) => {
    const newVisit = {
      id: Date.now(),
      ...visitObj
    };
    setVisits((prev) => [newVisit, ...prev]);
    showToast(`Site viewing scheduled for ${visitObj.who}`, 'success');
  };

  const rescheduleVisit = (visitId, newTime, newDate) => {
    setVisits((prev) =>
      prev.map((v) => {
        if (v.id === visitId) {
          const updatedTime = newTime || v.time;
          return {
            ...v,
            time: updatedTime,
            date: newDate || 'Today'
          };
        }
        return v;
      })
    );
    showToast(`Site viewing rescheduled to ${newTime || 'new time'}`, 'success');
  };

  const cancelVisit = (visitId) => {
    setVisits((prev) => prev.filter((v) => v.id !== visitId));
    showToast('Site viewing appointment cancelled', 'info');
  };

  return (
    <CRMContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        activeSmartList,
        setActiveSmartList,
        activeReport,
        setActiveReport,
        searchTerm,
        setSearchTerm,
        toasts,
        showToast,
        leads,
        properties,
        approvals,
        tasks,
        visits,
        activeLeadDrawerId,
        setActiveLeadDrawerId,
        leadModalOpen,
        setLeadModalOpen,
        propertyModalOpen,
        setPropertyModalOpen,
        addLead,
        updateLeadStage,
        assignLead,
        autoAssignLeads,
        addLeadInteractionLog,
        requestDiscountApproval,
        decideApproval,
        addProperty,
        updatePropertyStatus,
        toggleTask,
        scheduleVisit,
        rescheduleVisit,
        cancelVisit,
        formatCurrency,
        PEOPLE,
        STAGES,
        LOCALITIES,
        FINANCIAL_METRICS
      }}
    >
      {children}
    </CRMContext.Provider>
  );
}

export function useCRM() {
  const context = useContext(CRMContext);
  if (!context) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
}
