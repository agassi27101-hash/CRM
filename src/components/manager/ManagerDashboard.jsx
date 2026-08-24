import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  UserPlus,
  CheckCircle,
  XCircle,
  Sparkles,
  Building,
  Users,
  Percent,
  Clock,
  ArrowRight,
  ShieldAlert,
  Sliders
} from 'lucide-react';

export default function ManagerDashboard() {
  const {
    leads,
    properties,
    approvals,
    assignLead,
    autoAssignLeads,
    decideApproval,
    updatePropertyStatus,
    formatCurrency,
    PEOPLE,
    showToast,
    setActiveTab,
    setActiveLeadDrawerId
  } = useCRM();

  const unassignedLeads = leads.filter((l) => !l.agent);
  const pendingApprovals = approvals.filter((a) => a.status === 'pending');

  return (
    <div className="space-y-6">
      {/* Manager Operations Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-sky-700 uppercase tracking-widest mb-1">
            <Users className="w-4 h-4 text-sky-600" /> VP Branch Operations & Lead Allocation
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Manager Control Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage lead assignments, approve discount requests, and monitor agent sales targets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={autoAssignLeads}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-brand-600 to-brand-700 text-white rounded-xl font-bold text-xs hover:bg-brand-700 transition-all shadow-md shadow-brand-900/20"
          >
            <Sparkles className="w-4 h-4 text-gold-400" />
            AI Auto-Assign ({unassignedLeads.length} Unassigned)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section 1: Unassigned Lead Allocation Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Unassigned Lead Queue
                <span className="px-2 py-0.5 text-xs font-mono bg-amber-100 text-amber-800 rounded-md">
                  {unassignedLeads.length}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Inquiries from website & marketing campaigns requiring assignment
              </p>
            </div>
            <UserPlus className="w-5 h-5 text-slate-400" />
          </div>

          <div className="p-4 flex-1 overflow-y-auto max-h-[380px] space-y-3">
            {unassignedLeads.length > 0 ? (
              unassignedLeads.map((l) => (
                <div
                  key={l.id}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                >
                  <div
                    className="cursor-pointer min-w-0"
                    onClick={() => setActiveLeadDrawerId(l.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-brand-700">{l.id}</span>
                      <h3 className="text-sm font-bold text-slate-900 truncate">{l.name}</h3>
                      <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-slate-200 text-slate-700 rounded">
                        {l.source}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {l.bhk ? `${l.bhk} BHK` : 'Plot'} · {l.loc} ·{' '}
                      <span className="font-mono font-bold text-slate-700">
                        {formatCurrency(l.budget)}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (e.target.value) {
                          assignLead(l.id, e.target.value);
                        }
                      }}
                      className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
                    >
                      <option value="" disabled>
                        Assign Agent...
                      </option>
                      <option value="VM">Vikram Mehta (Besant Nagar)</option>
                      <option value="AP">Ananya Pillai (Anna Nagar)</option>
                      <option value="SK">Siddharth Kumar (OMR)</option>
                      <option value="RD">Divya Ramesh (ECR)</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-bold text-slate-700">All caught up!</p>
                <p className="mt-0.5">No unassigned leads in the queue right now.</p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Discount & Special Offer Approval Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Discount Approval Queue
                <span
                  className={`px-2 py-0.5 text-xs font-mono rounded-md ${
                    pendingApprovals.length > 0
                      ? 'bg-rose-100 text-rose-700 font-bold animate-pulse'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {pendingApprovals.length} Pending
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Agent discount authorization requests requiring VP sign-off
              </p>
            </div>
            <Percent className="w-5 h-5 text-slate-400" />
          </div>

          <div className="p-4 flex-1 overflow-y-auto max-h-[380px] space-y-3">
            {pendingApprovals.length > 0 ? (
              pendingApprovals.map((ap) => {
                const leadObj = leads.find((x) => x.id === ap.leadId) || { name: 'Unknown Lead' };
                const propObj = properties.find((x) => x.id === ap.propId) || {
                  title: 'Property Listing'
                };
                return (
                  <div
                    key={ap.id}
                    className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/80 flex flex-col justify-between gap-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-amber-900">
                            {ap.id}
                          </span>
                          <h3 className="text-sm font-bold text-slate-900">{leadObj.name}</h3>
                          <span className="text-xs text-slate-500">({ap.w})</span>
                        </div>
                        <p className="text-xs text-slate-700 font-medium mt-1">
                          Property: <span className="font-bold">{propObj.title}</span>
                        </p>
                        <p className="text-xs text-slate-600 mt-1 italic bg-white/70 p-2 rounded border border-amber-200">
                          "{ap.note}"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-amber-200/60 text-xs">
                      <div>
                        <span className="text-slate-500 line-through mr-2">
                          List: {formatCurrency(ap.list)}
                        </span>
                        <span className="font-mono font-bold text-emerald-800 text-sm">
                          Offer: {formatCurrency(ap.offer)}
                        </span>
                        <span className="ml-2 text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                          -{ap.discountPct ? ap.discountPct.toFixed(1) : 3}% Off
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decideApproval(ap.id, 'rejected')}
                          className="px-3 py-1.5 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold hover:bg-rose-200 transition-colors flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                        <button
                          onClick={() => decideApproval(ap.id, 'approved')}
                          className="px-3 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-gold-400" /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                <p className="font-bold text-slate-700">No pending approval requests</p>
                <p className="mt-0.5">When agents request price cuts, they will show up here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section 3: Team Attainment & Capacity Dashboard */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Agent Sales Capacity & Target Attainment
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Workload distribution across team members
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3">Agent</th>
                <th className="px-6 py-3">Branch Location</th>
                <th className="px-6 py-3">Target Attainment</th>
                <th className="px-6 py-3">Booked Revenue</th>
                <th className="px-6 py-3">Open Deals</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {Object.entries(PEOPLE).map(([key, p]) => {
                const pct = Math.round((p.booked / p.target) * 100);
                const agentLeadsCount = leads.filter((l) => l.agent === key && l.stage !== 'won').length;
                return (
                  <tr key={key} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900 flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center">
                        {key}
                      </div>
                      <div>
                        <div>{p.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{p.role}</div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600">{p.branch}</td>
                    <td className="px-6 py-3.5 max-w-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 100 ? 'bg-emerald-500' : pct >= 70 ? 'bg-brand-600' : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-800 shrink-0">
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-bold text-brand-700">
                      {formatCurrency(p.booked)}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-700">
                      {agentLeadsCount} active leads
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-mono font-bold rounded-md uppercase ${
                          agentLeadsCount > 4
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {agentLeadsCount > 4 ? 'High Load' : 'Available'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
