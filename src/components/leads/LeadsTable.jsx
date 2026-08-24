import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { STAGES, PEOPLE } from '../../data/mockData';
import { Users, Filter, Plus, Flame, Phone } from 'lucide-react';

export default function LeadsTable() {
  const {
    leads,
    formatCurrency,
    setActiveLeadDrawerId,
    setLeadModalOpen,
    role,
    searchTerm,
    activeSmartList
  } = useCRM();

  const [stageFilter, setStageFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');

  const filteredLeads = leads.filter((l) => {
    if (stageFilter && l.stage !== stageFilter) return false;
    if (agentFilter && l.agent !== agentFilter) return false;
    
    // Smart Lists & Pending Tasks Filters (Matching Sell.do CRM)
    if (activeSmartList === 'hot' && l.temp !== 'hot') return false;
    if (activeSmartList === 'warm' && l.temp !== 'warm') return false;
    if (activeSmartList === 'nri' && !l.name.includes('NRI') && l.source !== 'NRI') return false;
    if (activeSmartList === 'recently_contacted' && l.log.length <= 1) return false;
    if (activeSmartList === 'reengaged' && l.log.length <= 2) return false;
    if (activeSmartList === 'unassigned' && l.agent) return false;
    if (activeSmartList === 'new_enquiries' && l.agent) return false;
    if (activeSmartList === 'missed_calls' && l.temp !== 'hot' && l.stage !== 'new') return false;
    if (activeSmartList === 'missed_followups' && l.stage === 'closed') return false;
    if (activeSmartList === 'unread_emails' && !l.email) return false;
    if (activeSmartList === 'reassigned' && l.agent !== 'VM' && l.agent !== 'AP') return false;
    if ((activeSmartList === 'site_visit' || activeSmartList === 'site_visits') && l.stage !== 'site_visit') return false;
    if (activeSmartList.startsWith('untouched') && l.stage !== 'new' && l.log.length > 1) return false;

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q) ||
        l.loc.toLowerCase().includes(q) ||
        (l.phone && l.phone.includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-600 uppercase tracking-widest mb-1">
            <Users className="w-4 h-4 text-brand-600" /> Buyer Accounts & Contacts
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Lead Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive registry of buyer accounts across all pipeline stages.
          </p>
        </div>

        <button
          onClick={() => setLeadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs hover:bg-brand-700 transition-all shadow-md shadow-brand-900/20 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Lead Account
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase">
          <Filter className="w-4 h-4 text-slate-400" /> Filters:
        </div>

        <select
          value={stageFilter}
          onChange={(e) => setStageFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
        >
          <option value="">All Stages</option>
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={agentFilter}
          onChange={(e) => setAgentFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
        >
          <option value="">All Advisors</option>
          {Object.entries(PEOPLE).map(([key, p]) => (
            <option key={key} value={key}>
              {p.name}
            </option>
          ))}
        </select>

        <span className="text-xs font-mono text-slate-500 ml-auto">
          Showing <strong className="text-slate-900">{filteredLeads.length}</strong> of{' '}
          {leads.length} accounts
        </span>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Ref ID</th>
                <th className="px-6 py-3.5">Buyer Name</th>
                <th className="px-6 py-3.5">Requirement</th>
                <th className="px-6 py-3.5">Budget</th>
                <th className="px-6 py-3.5">Stage</th>
                <th className="px-6 py-3.5">Lead Source</th>
                <th className="px-6 py-3.5">Assigned Owner</th>
                <th className="px-6 py-3.5">Next Milestone Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredLeads.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => setActiveLeadDrawerId(l.id)}
                  className="hover:bg-brand-50/40 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-3.5 font-mono text-slate-400 group-hover:text-brand-700 font-bold">
                    {l.id}
                  </td>
                  <td className="px-6 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                    {l.name}
                    {l.temp === 'hot' && (
                      <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono font-bold bg-rose-100 text-rose-700 rounded">
                        <Flame className="w-3 h-3 text-rose-500 fill-rose-500" /> HOT
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-slate-600">
                    {l.bhk ? `${l.bhk} BHK` : 'Plot'} · {l.loc}
                  </td>
                  <td className="px-6 py-3.5 font-mono font-bold text-brand-700">
                    {formatCurrency(l.budget)}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-bold rounded-md uppercase bg-slate-100 text-slate-700 border border-slate-200">
                      {STAGES.find((s) => s.id === l.stage)?.label || l.stage}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-slate-500">{l.source}</td>
                  <td className="px-6 py-3.5 text-slate-700">
                    {l.agent ? (
                      <span className="font-semibold text-slate-900">
                        {PEOPLE[l.agent]?.name.split(' ')[0]}
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-800 rounded">
                        Unassigned
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 text-slate-500 max-w-xs truncate">{l.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
