import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { STAGES, PEOPLE } from '../../data/mockData';
import {
  Filter,
  Plus,
  Flame,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  Building
} from 'lucide-react';

export default function KanbanBoard() {
  const {
    leads,
    updateLeadStage,
    formatCurrency,
    setActiveLeadDrawerId,
    setLeadModalOpen,
    searchTerm
  } = useCRM();

  const [agentFilter, setAgentFilter] = useState('');

  const filteredLeads = leads.filter((l) => {
    if (agentFilter && l.agent !== agentFilter) return false;
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

  const getStageAccentColor = (stageId) => {
    switch (stageId) {
      case 'new':
        return 'bg-slate-400';
      case 'contacted':
        return 'bg-sky-500';
      case 'site_visit':
        return 'bg-purple-500';
      case 'nego':
        return 'bg-amber-500';
      case 'won':
        return 'bg-emerald-500';
      case 'lost':
        return 'bg-rose-500';
      default:
        return 'bg-brand-600';
    }
  };

  const getNextStageId = (currentStageId) => {
    const idx = STAGES.findIndex((s) => s.id === currentStageId);
    if (idx >= 0 && idx < STAGES.length - 1) {
      return STAGES[idx + 1].id;
    }
    return null;
  };

  const getPrevStageId = (currentStageId) => {
    const idx = STAGES.findIndex((s) => s.id === currentStageId);
    if (idx > 0) {
      return STAGES[idx - 1].id;
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Board Header & Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-slate-400" /> Filter Pipeline:
          </div>

          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
          >
            <option value="">All Advisors & Agents</option>
            {Object.entries(PEOPLE).map(([key, p]) => (
              <option key={key} value={key}>
                {p.name} ({p.branch})
              </option>
            ))}
          </select>

          <span className="text-xs font-mono text-slate-500 border-l border-slate-200 pl-3">
            Showing <strong className="text-slate-900 font-bold">{filteredLeads.length}</strong> of{' '}
            {leads.length} active leads
          </span>
        </div>

        <button
          onClick={() => setLeadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-all shadow-md shadow-brand-900/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-gold-400" /> Add Lead to Pipeline
        </button>
      </div>

      {/* Fit-To-Page Grid Columns (Scrolls Vertically Top-to-Bottom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start w-full">
        {STAGES.map((stage) => {
          const stageLeads = filteredLeads.filter((l) => l.stage === stage.id);
          const stageTotalValue = stageLeads.reduce((sum, l) => sum + (l.budget || 0), 0);

          return (
            <div
              key={stage.id}
              className="w-full bg-slate-100/70 border border-slate-200/80 rounded-2xl flex flex-col shadow-xs overflow-hidden"
            >
              {/* Colored Top Accent Bar */}
              <div className={`h-1.5 w-full ${getStageAccentColor(stage.id)}`} />

              {/* Column Header */}
              <div className="p-3 bg-white border-b border-slate-200/80 shadow-2xs">
                <div className="flex items-center justify-between gap-1">
                  <h3 className="text-[11px] xl:text-[11.5px] 2xl:text-xs font-extrabold text-slate-900 tracking-tight leading-snug">
                    {stage.label}
                  </h3>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-extrabold bg-slate-100 text-slate-700 rounded-full border border-slate-200 shrink-0">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-[11px] font-mono font-extrabold text-brand-700 mt-1">
                  {formatCurrency(stageTotalValue)}
                </div>
              </div>

              {/* Cards Flow Container (Scrolls Up-to-Down) */}
              <div className="p-2.5 space-y-3 min-h-[160px]">
                {stageLeads.length > 0 ? (
                  stageLeads.map((lead) => {
                    const prevStage = getPrevStageId(lead.stage);
                    const nextStage = getNextStageId(lead.stage);

                    return (
                      <div
                        key={lead.id}
                        onClick={() => setActiveLeadDrawerId(lead.id)}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-brand-600/70 transition-all duration-150 cursor-pointer group relative"
                      >
                        {/* Top ID & Temp Badge */}
                        <div className="flex justify-between items-center gap-1.5 mb-1.5">
                          <span className="text-[10px] font-mono font-extrabold text-slate-400">
                            {lead.id}
                          </span>
                          {lead.temp === 'hot' && (
                            <span className="flex items-center gap-0.5 text-[9px] font-mono font-extrabold bg-rose-50 text-rose-700 border border-rose-200 px-1.5 py-0.5 rounded-full shadow-2xs">
                              <Flame className="w-2.5 h-2.5 text-rose-500 fill-rose-500" /> HOT
                            </span>
                          )}
                        </div>

                        {/* Customer Title */}
                        <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-brand-700 transition-colors leading-tight line-clamp-1">
                          {lead.name}
                        </h4>

                        <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                          {lead.bhk ? `${lead.bhk} BHK` : 'Plot'} · {lead.loc}
                        </p>

                        {/* Budget Tag */}
                        <div className="mt-2">
                          <span className="text-xs font-mono font-extrabold text-brand-700 bg-brand-50/80 border border-brand-200/60 px-2 py-0.5 rounded-md inline-block">
                            {formatCurrency(lead.budget)}
                          </span>
                        </div>

                        {/* Next Milestone Action */}
                        <p className="text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-100 italic line-clamp-1">
                          {lead.next}
                        </p>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100">
                          {/* Owner Agent */}
                          <div className="flex items-center gap-1.5 min-w-0">
                            <div className="w-5 h-5 rounded-full bg-brand-700 text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-xs shrink-0">
                              {lead.agent || '?'}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[65px]">
                              {lead.agent ? PEOPLE[lead.agent]?.name.split(' ')[0] : 'Unassigned'}
                            </span>
                          </div>

                          {/* Stage Navigation Buttons */}
                          <div className="flex items-center gap-1 shrink-0">
                            {prevStage && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateLeadStage(lead.id, prevStage);
                                }}
                                className="p-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                                title={`Move back to ${STAGES.find((s) => s.id === prevStage)?.label}`}
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {nextStage && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateLeadStage(lead.id, nextStage);
                                }}
                                className="p-1 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-md transition-colors border border-brand-200"
                                title={`Advance to ${STAGES.find((s) => s.id === nextStage)?.label}`}
                              >
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-[11px] font-mono p-3 text-center">
                    No leads in stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
