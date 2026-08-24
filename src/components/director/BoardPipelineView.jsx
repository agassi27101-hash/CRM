import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { STAGES, PEOPLE } from '../../data/mockData';
import {
  TrendingUp,
  Target,
  Crown,
  Building,
  Award,
  ArrowUpRight,
  PieChart as PieIcon,
  Layers,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';

export default function BoardPipelineView() {
  const { leads, formatCurrency, setActiveLeadDrawerId } = useCRM();

  const totalPipelineValue = leads
    .filter((l) => l.stage !== 'won' && l.stage !== 'lost')
    .reduce((sum, l) => sum + (l.budget || 0), 0);

  const totalWonValue = leads
    .filter((l) => l.stage === 'won')
    .reduce((sum, l) => sum + (l.budget || 0), 0);

  const stageBreakdown = STAGES.map((s) => {
    const stageLeads = leads.filter((l) => l.stage === s.id);
    const stageVal = stageLeads.reduce((sum, l) => sum + (l.budget || 0), 0);
    return {
      name: s.label,
      value: Math.round(stageVal / 100000), // in Lakhs for chart
      rawVal: stageVal,
      count: stageLeads.length
    };
  });

  const STAGE_COLORS = ['#94A3B8', '#0EA5E9', '#A855F7', '#F59E0B', '#10B981', '#F43F5E'];

  // Branch breakdown
  const branchPipeline = Object.entries(PEOPLE).map(([key, p]) => {
    const agentLeads = leads.filter((l) => l.agent === key && l.stage !== 'lost');
    const totalVal = agentLeads.reduce((sum, l) => sum + (l.budget || 0), 0);
    return {
      key,
      name: p.name,
      branch: p.branch,
      count: agentLeads.length,
      val: totalVal
    };
  });

  return (
    <div className="space-y-6">
      {/* Board Pipeline Header */}
      <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-brand-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold-400 uppercase tracking-widest mb-1">
            <Crown className="w-4 h-4 text-gold-400" /> Executive Board Strategic Governance
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Group Deal Pipeline & Conversion Funnel
          </h1>
          <p className="text-xs text-brand-200/80 mt-1">
            Strategic breakdown of pipeline velocity, conversion ratios, and high-value enterprise accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-3.5 py-1.5 bg-gold-400/20 border border-gold-400/40 text-gold-300 rounded-xl text-xs font-mono font-bold uppercase">
            Board Governance View
          </span>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Total Active Pipeline
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(totalPipelineValue)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Across <strong className="text-slate-800">{leads.length}</strong> active buyer accounts
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Deals Closed Won (YTD)
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(totalWonValue)}
          </div>
          <div className="text-xs text-emerald-700 font-bold mt-1">
            {leads.filter((l) => l.stage === 'won').length} deals fully closed
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Pipeline Conversion Rate
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">28.4%</div>
          <div className="text-xs text-brand-700 font-bold mt-1">
            +4.2% higher than industry benchmark
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Average Deal Value
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(totalPipelineValue / (leads.length || 1))}
          </div>
          <div className="text-xs text-slate-500 mt-1">Luxury residential & commercial</div>
        </div>
      </div>

      {/* Stage Breakdown & Funnel Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recharts Stage Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pipeline Value by Stage (₹ Lakhs)
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                Capital distribution across sales stages
              </p>
            </div>
            <Layers className="w-5 h-5 text-brand-600" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stageBreakdown}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tickLine={false} stroke="#64748B" fontSize={11} />
                <YAxis tickLine={false} stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`₹${value} Lakhs`, 'Value']}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {stageBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STAGE_COLORS[index % STAGE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch Concentration Matrix */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">Branch Concentration</h2>
              <Building className="w-5 h-5 text-brand-600" />
            </div>

            <div className="space-y-3.5">
              {branchPipeline.map((b) => (
                <div key={b.key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800">{b.branch}</span>
                    <span className="font-mono font-bold text-brand-700">
                      {formatCurrency(b.val)}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>{b.name}</span>
                    <span>{b.count} deals in play</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Strategic High-Value Accounts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Enterprise Accounts Watchlist (&gt; ₹2.0 Cr)
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Key strategic deals monitored by the Board of Directors
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Ref ID</th>
                <th className="px-6 py-3.5">Account / Client</th>
                <th className="px-6 py-3.5">Locality</th>
                <th className="px-6 py-3.5">Deal Budget</th>
                <th className="px-6 py-3.5">Pipeline Stage</th>
                <th className="px-6 py-3.5">Lead Advisor</th>
                <th className="px-6 py-3.5">Next Strategic Milestone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {leads
                .filter((l) => l.budget >= 20000000)
                .map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => setActiveLeadDrawerId(l.id)}
                    className="hover:bg-brand-50/50 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-3.5 font-mono text-slate-400 font-bold">{l.id}</td>
                    <td className="px-6 py-3.5 font-bold text-slate-900">{l.name}</td>
                    <td className="px-6 py-3.5 text-slate-600">{l.loc}</td>
                    <td className="px-6 py-3.5 font-mono font-extrabold text-brand-700">
                      {formatCurrency(l.budget)}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {STAGES.find((s) => s.id === l.stage)?.label || l.stage}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-700">
                      {l.agent ? PEOPLE[l.agent]?.name : 'Unassigned'}
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
