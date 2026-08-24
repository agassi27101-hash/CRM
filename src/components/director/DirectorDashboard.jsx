import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  FINANCIAL_METRICS,
  STAGES,
  PEOPLE
} from '../../data/mockData';
import {
  TrendingUp,
  Target,
  Download,
  RefreshCw,
  BarChart3,
  Calendar,
  CheckSquare,
  ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

const KPI_TILE = ({ label, value, sub, color }) => (
  <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all cursor-default group">
    <div className={`text-3xl font-extrabold font-mono tracking-tight ${color || 'text-emerald-600'} group-hover:scale-105 transition-transform`}>
      {value}
    </div>
    <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 mt-1 leading-tight">
      {label}
    </div>
    {sub && (
      <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
    )}
  </div>
);

export default function DirectorDashboard() {
  const {
    leads,
    approvals,
    tasks,
    visits,
    formatCurrency,
    setActiveTab,
    setActiveSmartList,
    role
  } = useCRM();

  const [selectedReport, setSelectedReport] = useState('pipeline');

  // KPI Counters matching Sell.do Home dashboard
  const newEnquiries = leads.filter(l => !l.agent).length;
  const hotLeads = leads.filter(l => l.temp === 'hot').length;
  const warmLeads = leads.filter(l => l.temp === 'warm').length;
  const missedFollowups = tasks.filter(t => !t.done).length;
  const missedSiteVisits = 6; // demo
  const untouchedLeads = leads.filter(l => l.stage === 'new' && l.log.length <= 1).length;
  const unqualified = leads.filter(l => l.stage === 'lost').length;
  const reengaged = 61; // demo
  const unreadEmails = 3;
  const missedCalls = 2;
  const noFutureActivity = leads.filter(l => !l.next || l.next === '').length;

  // Revenue data
  const totalRevenue = FINANCIAL_METRICS.monthlyAchieved;
  const target = FINANCIAL_METRICS.monthlyTarget;
  const attainment = Math.round((totalRevenue / target) * 100);

  // Pipeline chart by stage
  const stageData = STAGES.map(s => ({
    name: s.label.split(' ').slice(0, 2).join(' '),
    count: leads.filter(l => l.stage === s.id).length,
    value: Math.round(leads.filter(l => l.stage === s.id).reduce((sum, l) => sum + l.budget, 0) / 100000)
  }));

  // Monthly trend data
  const monthlyData = FINANCIAL_METRICS.revenueTrend.map(d => ({ month: d.month, value: d.actual || d.forecast }));

  // Today's agenda
  const todayTasks = tasks.filter(t => t.when === 'Today' && !t.done).slice(0, 4);
  const todayVisits = visits.slice(0, 3);

  const exportCSV = () => {
    const headers = ['Stage', 'Count', 'Value (₹L)'];
    const rows = stageData.map(d => [d.name, d.count, d.value]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url;
    a.download = 'meridian-pipeline-report.csv'; a.click();
  };

  return (
    <div className="space-y-6">
      {/* Home Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            {role === 'director' ? 'Board of Directors — Executive Overview' :
             role === 'manager' ? 'VP Operations — Control Hub' :
             'My Dashboard — Today\'s Overview'}
          </h1>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            Meridian Estates Group · Chennai HQ · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <div className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-mono font-bold border border-brand-200">
            Default Dashboard
          </div>
        </div>
      </div>

      {/* ── KPI Tiles Row 1 (Matching Sell.do Home) ── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <KPI_TILE label="New Enquiries" value={newEnquiries} sub="since today" color="text-emerald-600" />
        <KPI_TILE label="Unread Emails" value={unreadEmails} sub="since today" color="text-sky-600" />
        <KPI_TILE label="Unread WhatsApp" value={12} sub="since a few seconds" color="text-emerald-500" />
        <KPI_TILE label="Missed Calls" value={missedCalls} sub="since 2 months" color="text-rose-500" />
        <KPI_TILE label="No Future Activity" value={noFutureActivity} sub="since 3 years" color="text-orange-500" />
        <KPI_TILE label="Re-engaged Leads" value={reengaged} sub="since a few seconds" color="text-purple-600" />
      </div>

      {/* ── KPI Tiles Row 2 ── */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <KPI_TILE label="Missed Followups" value={missedFollowups} sub="since 2 years" color="text-amber-600" />
        <KPI_TILE label="Missed Site Visits" value={missedSiteVisits} sub="since 2 years" color="text-rose-600" />
        <KPI_TILE label="Untouched - 1 Attempt" value={untouchedLeads} sub="since a few seconds" color="text-slate-700" />
        <KPI_TILE label="Unqualified Leads" value={unqualified} sub="since 3 years" color="text-slate-500" />
        <KPI_TILE label="All Reengaged Leads" value={leads.length} sub="since a month" color="text-brand-700" />
      </div>

      {/* ── Pipeline Analysis + Today's Agenda ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Analysis Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-600" />
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Pipeline Analysis</h2>
                <p className="text-[10px] text-slate-400 font-mono">Stage distribution · {new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <button onClick={() => setActiveTab('pipeline')} className="flex items-center gap-1 text-xs text-brand-600 font-bold hover:text-brand-800">
              View Full <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stageData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B6E4F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B6E4F" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" fontSize={10} tickLine={false} stroke="#94A3B8" />
                <YAxis fontSize={10} tickLine={false} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderRadius: '8px', color: '#fff', border: 'none', fontSize: '11px' }}
                  formatter={(v, n) => [n === 'value' ? `₹${v}L` : v, n === 'value' ? 'Pipeline (₹L)' : 'Leads']}
                />
                <Area type="monotone" dataKey="value" stroke="#3B6E4F" fill="url(#areaGrad)" strokeWidth={2} name="value" />
                <Area type="monotone" dataKey="count" stroke="#C7A434" fill="none" strokeWidth={1.5} strokeDasharray="4 4" name="count" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Stage Quick Stats */}
          <div className="mt-4 grid grid-cols-6 gap-2">
            {stageData.map((d, i) => {
              const colors = ['text-slate-500', 'text-sky-600', 'text-purple-600', 'text-amber-600', 'text-emerald-600', 'text-rose-600'];
              return (
                <div key={d.name} className="text-center">
                  <div className={`text-base font-extrabold font-mono ${colors[i]}`}>{d.count}</div>
                  <div className="text-[9px] text-slate-400 font-mono leading-tight truncate">{d.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Agenda + Open Tasks */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
          {/* Revenue Target */}
          <div className="p-4 bg-brand-950 rounded-xl text-white">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="text-[10px] font-mono text-brand-300 uppercase">Revenue Target</div>
                <div className="text-lg font-extrabold">{formatCurrency(totalRevenue)}</div>
                <div className="text-[10px] text-brand-300">of {formatCurrency(target)} target</div>
              </div>
              <span className="text-xs font-mono font-extrabold px-2 py-1 bg-gold-400/20 text-gold-400 rounded-lg">{attainment}%</span>
            </div>
            <div className="w-full bg-brand-800 rounded-full h-1.5 mt-2">
              <div className="bg-gold-400 h-1.5 rounded-full transition-all" style={{ width: `${Math.min(attainment, 100)}%` }} />
            </div>
          </div>

          {/* Today's Agenda */}
          <div>
            <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Today's Agenda
            </div>
            {todayVisits.length > 0 ? (
              <div className="space-y-2">
                {todayVisits.map((v, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="px-2 py-0.5 bg-purple-600 text-white text-[9px] font-mono font-bold rounded shrink-0">{v.time}</div>
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-800 truncate">{v.who}</div>
                      <div className="text-[10px] text-slate-400 truncate">{v.where}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 text-center py-3">No site visits scheduled today</div>
            )}
          </div>

          {/* Open Tasks */}
          <div>
            <div className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5" /> Open Tasks ({tasks.filter(t => !t.done).length})
            </div>
            {todayTasks.length > 0 ? (
              <div className="space-y-1.5">
                {todayTasks.map((t, i) => (
                  <div key={i} className="text-[11px] p-2 bg-amber-50 rounded-lg border border-amber-100 text-slate-700 font-medium truncate">
                    {t.t}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-400 text-center py-3">All tasks completed! ✅</div>
            )}
          </div>
        </div>
      </div>

      {/* ── TODAY'S PERFORMANCE (Sell.do exact match) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <span className="text-base">⏱</span>
          <h2 className="text-sm font-bold text-slate-900">Today's Performance</h2>
        </div>
        <div className="p-5 space-y-5">
          {/* Call Metrics Row */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {[
              { label: 'Total Calls', value: '5', mono: false },
              { label: 'Total Talktime', value: '0', sub: 'min  0 sec', mono: true },
              { label: 'Average Call Duration', value: '0', sub: 'min  0 sec', mono: true },
              { label: 'Average Callback Time', value: '0', sub: 'min  0 sec', mono: true },
              { label: 'Time To First Contact', value: '0', sub: 'min  0 sec', mono: true }
            ].map(({ label, value, sub, mono }) => (
              <div key={label} className="text-center">
                <div className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-400 mb-1">{label}</div>
                <div className="text-3xl font-extrabold font-mono text-slate-800 leading-none">{value}</div>
                {sub && <div className="text-[11px] font-mono text-slate-500 mt-0.5">{sub}</div>}
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100" />

          {/* Site Visit Metrics Row */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
            {[
              { label: 'Site Visits Created', value: visits.length },
              { label: 'Site Visits Scheduled', value: visits.filter(v => v.status !== 'cancelled').length },
              { label: 'Site Visits Conducted', value: visits.filter(v => v.status === 'conducted').length || 0 },
              { label: 'Followup Schedule', value: tasks.filter(t => !t.done).length },
              { label: 'Leads From Pre-Sales', value: 0 }
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-400 mb-1 leading-tight">{label}</div>
                <div className="text-3xl font-extrabold font-mono text-slate-800 leading-none">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── APPROVALS (Sell.do exact match) ── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <span className="text-base text-amber-500">⚡</span>
          <h2 className="text-sm font-bold text-slate-900">Approvals</h2>
          {approvals.filter(a => a.status === 'pending').length > 0 && (
            <span className="ml-auto text-[10px] font-mono font-bold px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">
              {approvals.filter(a => a.status === 'pending').length} pending
            </span>
          )}
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              label: 'Under Negotiation Approvals\nRequested By Me',
              value: approvals.filter(a => a.status === 'pending' && a.requestedBy === role).length
            },
            {
              label: 'Under Negotiation Approvals\nWaiting On Me',
              value: approvals.filter(a => a.status === 'pending').length
            },
            {
              label: 'All Approvals\nRequested By Me',
              value: approvals.filter(a => a.requestedBy === role).length
            }
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-slate-400 mb-1 leading-tight whitespace-pre-line">{label}</div>
              <div className={`text-4xl font-extrabold font-mono leading-none ${value > 0 ? 'text-rose-600' : 'text-slate-800'}`}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Branch Attainment Table */}

      {role === 'director' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-brand-600" /> Branch Attainment Leaderboard
            </h2>
            <span className="text-[10px] font-mono text-slate-400">FY 2026 YTD</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3">Advisor</th>
                  <th className="px-6 py-3">Branch</th>
                  <th className="px-6 py-3">Active Leads</th>
                  <th className="px-6 py-3">Pipeline Value</th>
                  <th className="px-6 py-3">Attainment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.entries(PEOPLE).map(([key, p]) => {
                  const agentLeads = leads.filter(l => l.agent === key);
                  const pipelineVal = agentLeads.reduce((sum, l) => sum + l.budget, 0);
                  const attainPct = Math.round(Math.random() * 30 + 60);
                  return (
                    <tr key={key} className="hover:bg-brand-50/30 transition-colors">
                      <td className="px-6 py-3 font-bold text-slate-900">{p.name}</td>
                      <td className="px-6 py-3 text-slate-500">{p.branch}</td>
                      <td className="px-6 py-3 font-mono font-bold text-slate-700">{agentLeads.length}</td>
                      <td className="px-6 py-3 font-mono font-bold text-brand-700">{formatCurrency(pipelineVal)}</td>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                            <div className="bg-brand-600 h-1.5 rounded-full" style={{ width: `${attainPct}%` }} />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-600">{attainPct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
