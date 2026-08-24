import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  X, BarChart3, TrendingUp, Download, Calendar,
  PhoneCall, Megaphone, Building, FileSpreadsheet, ShieldCheck
} from 'lucide-react';

export default function ReportModal() {
  const {
    activeReport, setActiveReport, leads, properties,
    approvals, tasks, formatCurrency, PEOPLE, STAGES
  } = useCRM();
  const [dateRange, setDateRange] = useState('30d');

  if (!activeReport) return null;
  const { id, label, category } = activeReport;

  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.temp === 'hot').length;
  const warmLeads = leads.filter(l => l.temp === 'warm').length;
  const siteVisits = leads.filter(l => l.stage === 'site_visit').length;
  const negotiations = leads.filter(l => l.stage === 'nego').length;
  const closedWon = leads.filter(l => l.stage === 'closed').length;
  const lostLeads = leads.filter(l => l.stage === 'lost').length;
  const untouchedLeads = leads.filter(l => l.log && l.log.length <= 1).length;

  const agentStats = Object.entries(PEOPLE).map(([key, p]) => {
    const al = leads.filter(l => l.agent === key);
    const av = al.filter(l => ['site_visit','nego','closed'].includes(l.stage)).length;
    const ac = al.filter(l => l.stage === 'closed').length;
    const ar = al.filter(l => l.stage === 'closed').reduce((s, l) => s + (l.budget||0), 0);
    return { key, name: p.name, role: p.role, branch: p.branch,
      assigned: al.length, visits: av, closed: ac,
      conversion: al.length ? Math.round((av/al.length)*100) : 0,
      revenue: ar || (key==='VM'?48500000:key==='AP'?32000000:key==='SK'?24000000:18000000) };
  });

  const sources = [
    { name: 'Google Ads', spend: 450000, leads: 18, cpl: 25000, revenue: 145000000, roas: '32.2x' },
    { name: 'Facebook & Meta', spend: 380000, leads: 22, cpl: 17272, revenue: 98000000, roas: '25.7x' },
    { name: 'IRIS Channel Partner', spend: 600000, leads: 12, cpl: 50000, revenue: 210000000, roas: '35.0x' },
    { name: 'NRI Direct Referral', spend: 120000, leads: 6, cpl: 20000, revenue: 165000000, roas: '137.5x' },
    { name: 'Site Hoardings & Walk-in', spend: 250000, leads: 14, cpl: 17857, revenue: 72000000, roas: '28.8x' }
  ];

  const catIcon = {
    'PIPELINE ANALYSIS': <BarChart3 className="w-5 h-5" />,
    'SALES PERFORMANCE': <TrendingUp className="w-5 h-5" />,
    'MARKETING EFFECT': <Megaphone className="w-5 h-5" />,
    'CALL REPORTS': <PhoneCall className="w-5 h-5" />,
    'INVENTORY REPORTS': <Building className="w-5 h-5" />,
    'PRODUCTS & SERVICES': <FileSpreadsheet className="w-5 h-5" />,
    'GOVERNANCE APPROVALS': <ShieldCheck className="w-5 h-5" />
  };

  const TH = ({children}) => <th className="px-4 py-2 text-left text-[10px] font-mono text-slate-500 uppercase">{children}</th>;
  const TD = ({children, className=''}) => <td className={`px-4 py-3 ${className}`}>{children}</td>;
  const Badge = ({children, color='bg-emerald-100 text-emerald-800'}) => (
    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${color}`}>{children}</span>
  );
  const KpiCard = ({label, value, color='text-slate-900'}) => (
    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center">
      <div className="text-[10px] font-mono text-slate-400 uppercase">{label}</div>
      <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
    </div>
  );
  const Bar = ({pct, color='bg-brand-600'}) => (
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full`} style={{width:`${Math.max(pct,4)}%`}} />
    </div>
  );

  const renderBody = () => {
    switch(id) {

      /* ── PIPELINE ANALYSIS ── */
      case 'lead_stage_analysis':
        return <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Lead Stage Distribution</h3>
            {STAGES.map((s,i) => {
              const c = leads.filter(l=>l.stage===s.id).length;
              const pct = Math.round((c/(totalLeads||1))*100);
              const colors=['bg-slate-400','bg-sky-500','bg-purple-500','bg-amber-500','bg-emerald-500','bg-rose-500'];
              return <div key={s.id} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="font-bold text-slate-800">{i+1}. {s.label}</span>
                  <span className="font-mono text-slate-600">{c} ({pct}%)</span>
                </div>
                <Bar pct={pct} color={colors[i]} />
              </div>;
            })}
          </div>
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Total Active" value={totalLeads} />
            <KpiCard label="Site Visits" value={siteVisits} color="text-purple-700" />
            <KpiCard label="Closed Won" value={closedWon} color="text-emerald-700" />
          </div>
        </div>;

      case 'lead_funnel':
        return <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-4">End-to-End Conversion Funnel</h3>
            {[
              {label:'Raw Enquiries Received', value:totalLeads+42, pct:100, color:'bg-slate-400'},
              {label:'Leads Contacted (1st Touch)', value:totalLeads+15, pct:84, color:'bg-sky-500'},
              {label:'Qualified Prospects', value:totalLeads-2, pct:61, color:'bg-blue-500'},
              {label:'Site Visits Scheduled', value:siteVisits+8, pct:38, color:'bg-purple-500'},
              {label:'Offer / Negotiation', value:negotiations+4, pct:22, color:'bg-amber-500'},
              {label:'Bookings Confirmed', value:closedWon+3, pct:14, color:'bg-emerald-500'},
              {label:'Agreements Executed', value:closedWon, pct:9, color:'bg-brand-600'},
            ].map((f,i)=>(
              <div key={i} className="flex items-center gap-3 mb-2">
                <div className="w-36 text-[10px] font-medium text-slate-600 text-right shrink-0">{f.label}</div>
                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${f.color} rounded-full flex items-center justify-end pr-2`} style={{width:`${f.pct}%`}}>
                    <span className="text-[9px] text-white font-bold">{f.value}</span>
                  </div>
                </div>
                <div className="w-9 text-[10px] font-mono font-bold text-slate-500 shrink-0">{f.pct}%</div>
              </div>
            ))}
          </div>
        </div>;

      case 'lead_unqualified_reasons':
        return <div className="space-y-4">
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm">Unqualification Reasons</h3>
            {[
              {reason:'Budget mismatch (>₹50L difference)', pct:42},
              {reason:'Location outside target zone', pct:28},
              {reason:'Invalid phone / unreachable contact', pct:18},
              {reason:'Competitor instant booking', pct:7},
              {reason:'Duplicate / test enquiry', pct:5},
            ].map((r,i)=>(
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{r.reason}</span>
                  <span className="font-mono font-bold text-rose-700">{Math.round(lostLeads*r.pct/100)} leads ({r.pct}%)</span>
                </div>
                <Bar pct={r.pct} color="bg-rose-400" />
              </div>
            ))}
          </div>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
            <strong>AI Recommendation:</strong> Add a pre-qualification budget filter on enquiry forms to reduce wasted agent time.
          </div>
        </div>;

      case 'lead_lost_reasons':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Closed-Lost Reason Analysis</h3>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b"><tr>
              <TH>Lost Reason</TH><TH>Count</TH><TH>% of Lost</TH><TH>Avg Deal Size</TH>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {reason:'Chose competitor project', count:8, pct:38, avg:12500000},
                {reason:'Budget constraints / financing failed', count:6, pct:28, avg:9800000},
                {reason:'Decision postponed / on hold', count:4, pct:19, avg:11200000},
                {reason:'NRI - Relocated / no longer interested', count:2, pct:10, avg:18500000},
                {reason:'Property configuration mismatch', count:1, pct:5, avg:7600000},
              ].map((r,i)=>(
                <tr key={i} className="hover:bg-slate-50">
                  <TD>{r.reason}</TD>
                  <TD className="font-mono font-bold text-center text-rose-700">{r.count}</TD>
                  <TD className="text-center"><Badge color="bg-rose-100 text-rose-800">{r.pct}%</Badge></TD>
                  <TD className="font-mono font-bold text-center text-brand-700">{formatCurrency(r.avg)}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>;

      case 'lead_touched_untouched':
        return <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
              <div className="text-[10px] font-mono text-emerald-800 uppercase font-bold">Touched Leads</div>
              <div className="text-4xl font-extrabold text-emerald-700">{totalLeads - untouchedLeads}</div>
              <div className="text-[10px] text-emerald-600 mt-1">At least 1 contact attempt</div>
            </div>
            <div className="p-5 bg-rose-50 rounded-xl border border-rose-200 text-center">
              <div className="text-[10px] font-mono text-rose-800 uppercase font-bold">Untouched Leads</div>
              <div className="text-4xl font-extrabold text-rose-700">{untouchedLeads}</div>
              <div className="text-[10px] text-rose-600 mt-1">No contact attempt recorded</div>
            </div>
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Untouched by Attempt Count</h3>
            {[
              {label:'1 Attempt — No Response', count:untouchedLeads, pct:100, color:'bg-amber-400'},
              {label:'2 Attempts — No Response', count:2, pct:40, color:'bg-orange-500'},
              {label:'3+ Attempts — Consider Unqualify', count:1, pct:20, color:'bg-rose-600'},
            ].map((r,i)=>(
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{r.label}</span>
                  <span className="font-mono font-bold text-slate-800">{r.count} leads</span>
                </div>
                <Bar pct={r.pct} color={r.color} />
              </div>
            ))}
          </div>
        </div>;

      /* ── SALES PERFORMANCE ── */
      case 'leads_statistics_sales':
        return <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard label="Total Leads" value={totalLeads} />
            <KpiCard label="Hot Prospects" value={hotLeads} color="text-rose-700" />
            <KpiCard label="Warm Prospects" value={warmLeads} color="text-amber-700" />
            <KpiCard label="Conversion Rate" value="28.4%" color="text-emerald-700" />
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Lead Statistics by Agent</h3>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b"><tr>
                <TH>Agent</TH><TH>Assigned</TH><TH>Site Visits</TH><TH>Closed</TH><TH>Conv.%</TH><TH>Revenue</TH>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {agentStats.map(a=>(
                  <tr key={a.key} className="hover:bg-slate-50">
                    <TD className="font-bold text-slate-900">{a.name}</TD>
                    <TD className="font-mono text-center">{a.assigned}</TD>
                    <TD className="font-mono text-center text-purple-700 font-bold">{a.visits}</TD>
                    <TD className="font-mono text-center text-emerald-700 font-bold">{a.closed}</TD>
                    <TD className="text-center"><Badge>{a.conversion}%</Badge></TD>
                    <TD className="font-mono font-bold text-brand-700">{formatCurrency(a.revenue)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>;

      case 'site_visit_by_sales':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Site Visits by Sales Representative</h3>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b"><tr>
              <TH>Agent</TH><TH>Branch</TH><TH>Total</TH><TH>Conducted</TH><TH>Pending</TH><TH>Cancelled</TH><TH>Conv.%</TH>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {agentStats.map((a,i)=>(
                <tr key={a.key} className="hover:bg-slate-50">
                  <TD className="font-bold text-slate-900">{a.name}</TD>
                  <TD className="text-slate-500">{a.branch}</TD>
                  <TD className="font-mono text-center font-bold">{a.visits+2}</TD>
                  <TD className="font-mono text-center text-emerald-700 font-bold">{a.visits}</TD>
                  <TD className="font-mono text-center text-amber-700">1</TD>
                  <TD className="font-mono text-center text-rose-700">1</TD>
                  <TD className="text-center"><Badge color="bg-purple-100 text-purple-800">{72-i*6}%</Badge></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>;

      case 'site_visit_by_stages':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Site Visits → Stage Conversion</h3>
          {[
            {stage:'New Enquiry → Visit Scheduled', visits:12, conv:8, rate:67},
            {stage:'Contacted → Visit Booked', visits:9, conv:7, rate:78},
            {stage:'Site Visit → Negotiation', visits:siteVisits, conv:negotiations, rate:60},
            {stage:'Negotiation → Booking', visits:negotiations||3, conv:closedWon, rate:45},
          ].map((r,i)=>(
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <div className="flex-1 font-medium text-slate-700">{r.stage}</div>
              <span className="font-mono text-slate-400">{r.visits} visits</span>
              <span className="font-mono text-emerald-700 font-bold">{r.conv} converted</span>
              <Badge>{r.rate}%</Badge>
            </div>
          ))}
        </div>;

      case 'follow_ups':
        return <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Scheduled" value={tasks.length} />
            <KpiCard label="Completed" value={tasks.filter(t=>t.done).length} color="text-emerald-700" />
            <KpiCard label="Missed / Overdue" value={tasks.filter(t=>!t.done).length} color="text-rose-700" />
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2 max-h-48 overflow-y-auto">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Follow-up Task Log</h3>
            {tasks.slice(0,8).map((t,i)=>(
              <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${t.done?'bg-emerald-50 border-emerald-200':'bg-amber-50 border-amber-200'}`}>
                <span className={`font-medium truncate ${t.done?'text-slate-400 line-through':'text-slate-700'}`}>{t.t}</span>
                <Badge color={t.done?'bg-emerald-200 text-emerald-800':'bg-amber-200 text-amber-800'}>{t.when}</Badge>
              </div>
            ))}
          </div>
        </div>;

      case 'booking':
        return <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard label="Bookings This Month" value={closedWon+2} color="text-emerald-700" />
            <KpiCard label="Booking Value" value="₹38.4 Cr" color="text-brand-700" />
            <KpiCard label="Avg Token Amount" value="₹5.0 L" color="text-purple-700" />
            <KpiCard label="Agreements Executed" value={closedWon} />
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Booking Register</h3>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b"><tr><TH>Buyer</TH><TH>Unit</TH><TH>Value</TH><TH>Token</TH><TH>Status</TH></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {leads.filter(l=>l.stage==='closed').slice(0,5).map(l=>(
                  <tr key={l.id} className="hover:bg-slate-50">
                    <TD className="font-bold text-slate-900">{l.name}</TD>
                    <TD className="font-mono text-slate-500">{l.bhk} BHK · {l.loc}</TD>
                    <TD className="font-mono font-bold text-brand-700">{formatCurrency(l.budget)}</TD>
                    <TD className="font-mono text-emerald-700">{formatCurrency(l.budget*0.04)}</TD>
                    <TD><Badge>CONFIRMED</Badge></TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>;

      case 'pre_sales_to_sales':
        return <div className="p-4 bg-white rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Pre-Sales → Sales Handover Metrics</h3>
          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="Pre-Sales Enquiries" value={totalLeads+18} color="text-sky-700" />
            <KpiCard label="Qualified & Handed Over" value={totalLeads} color="text-brand-700" />
            <KpiCard label="Handover Conversion" value={`${Math.round((totalLeads/(totalLeads+18))*100)}%`} color="text-purple-700" />
            <KpiCard label="Avg. Time to Handover" value="2.4 days" color="text-amber-700" />
          </div>
        </div>;

      case 'leads_reassignment':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Lead Reassignment Log</h3>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b"><tr><TH>Lead</TH><TH>From</TH><TH>To</TH><TH>Reason</TH><TH>Date</TH></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {lead:'Rajiv Ananthan', from:'VM', to:'AP', reason:'Agent unavailable', date:'22 Aug 2026'},
                {lead:'Priya Krishnan', from:'SK', to:'VM', reason:'Branch transfer', date:'21 Aug 2026'},
                {lead:'Samir Gupta', from:'AP', to:'RD', reason:'Client preference', date:'19 Aug 2026'},
              ].map((r,i)=>(
                <tr key={i} className="hover:bg-slate-50">
                  <TD className="font-bold text-slate-900">{r.lead}</TD>
                  <TD className="font-mono text-rose-700">{PEOPLE[r.from]?.name||r.from}</TD>
                  <TD className="font-mono text-emerald-700">{PEOPLE[r.to]?.name||r.to}</TD>
                  <TD className="text-slate-500">{r.reason}</TD>
                  <TD className="font-mono text-slate-400">{r.date}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>;

      case 'untouched_attempts':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Untouched Lead — Attempt Tracker</h3>
          {[
            {label:'1 Attempt Made (no response)', count:untouchedLeads, color:'bg-amber-400 text-amber-700'},
            {label:'2 Attempts Made (no response)', count:2, color:'bg-orange-500 text-orange-700'},
            {label:'3+ Attempts — Mark Unqualified?', count:1, color:'bg-rose-600 text-rose-700'},
          ].map((r,i)=>(
            <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className={`w-2 h-8 rounded-full ${r.color.split(' ')[0]}`} />
              <span className="flex-1 text-xs font-medium text-slate-700">{r.label}</span>
              <span className={`text-2xl font-extrabold font-mono ${r.color.split(' ')[1]}`}>{r.count}</span>
            </div>
          ))}
        </div>;

      case 'user_tracking_details':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Active User Tracking & Login Log</h3>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b"><tr>
              <TH>User</TH><TH>Branch</TH><TH>Last Login</TH><TH>Calls Today</TH><TH>Actions</TH><TH>Status</TH>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {agentStats.map((a,i)=>(
                <tr key={a.key} className="hover:bg-slate-50">
                  <TD className="font-bold text-slate-900">{a.name}</TD>
                  <TD className="text-slate-500">{a.branch}</TD>
                  <TD className="font-mono text-slate-400">Today {10+i}:{30+i*5>59?'00':30+i*5} AM</TD>
                  <TD className="font-mono font-bold text-center text-sky-700">{4+i*2}</TD>
                  <TD className="font-mono font-bold text-center text-purple-700">{12+i*3}</TD>
                  <TD><Badge>ONLINE</Badge></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>;

      case 'roster_logs':
        return <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {label:'On-Call Reps', value:'4 Active'},
              {label:'Site Visits Today', value:'8 Scheduled'},
              {label:'Avg Response SLA', value:'12 Mins'},
              {label:'Follow-up Compliance', value:'96.8%'},
            ].map(k=>(
              <div key={k.label} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-400 uppercase">{k.label}</div>
                <div className="text-sm font-extrabold text-slate-900 mt-1">{k.value}</div>
              </div>
            ))}
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Duty Roster</h3>
            {agentStats.map(a=>(
              <div key={a.key} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <span className="font-bold text-slate-800">{a.name}</span>
                <span className="text-slate-400 font-mono">{a.branch}</span>
                <Badge>ON DUTY</Badge>
              </div>
            ))}
          </div>
        </div>;

      /* ── MARKETING EFFECT ── */
      case 'marketing_lead_source':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Lead Source Analysis</h3>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b"><tr>
              <TH>Source</TH><TH>Leads</TH><TH>CPL</TH><TH>% of Total</TH><TH>Quality</TH>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {sources.map((s,i)=>(
                <tr key={i} className="hover:bg-slate-50">
                  <TD className="font-bold text-slate-900">{s.name}</TD>
                  <TD className="font-mono text-center font-bold">{s.leads}</TD>
                  <TD className="font-mono text-amber-700 font-bold">{formatCurrency(s.cpl)}</TD>
                  <TD className="text-center"><Badge color="bg-sky-100 text-sky-800">{Math.round((s.leads/72)*100)}%</Badge></TD>
                  <TD className="text-center">{'★'.repeat(Math.min(5,3+i%3))}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>;

      case 'marketing_campaign_perf':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Campaign Performance Report</h3>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b"><tr>
              <TH>Campaign</TH><TH>Impressions</TH><TH>Clicks</TH><TH>CTR</TH><TH>Leads</TH><TH>Conv.</TH>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {name:'Luxury 3BHK — Google Search', imp:'1,24,800', clicks:'3,210', ctr:'2.57%', leads:18, conv:'0.56%'},
                {name:'Arcadia Estates — Meta Video', imp:'2,86,000', clicks:'6,540', ctr:'2.29%', leads:22, conv:'0.34%'},
                {name:'NRI Portal — Email Campaign', imp:'18,400', clicks:'1,890', ctr:'10.27%', leads:6, conv:'0.33%'},
                {name:'OMR Plots — Display Ads', imp:'94,000', clicks:'2,100', ctr:'2.23%', leads:9, conv:'0.43%'},
              ].map((c,i)=>(
                <tr key={i} className="hover:bg-slate-50">
                  <TD className="font-bold text-slate-900">{c.name}</TD>
                  <TD className="font-mono text-slate-500 text-center">{c.imp}</TD>
                  <TD className="font-mono text-center">{c.clicks}</TD>
                  <TD className="font-mono text-center text-sky-700 font-bold">{c.ctr}</TD>
                  <TD className="font-mono text-center text-emerald-700 font-bold">{c.leads}</TD>
                  <TD className="text-center"><Badge>{c.conv}</Badge></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>;

      case 'marketing_cost_per_lead':
        return <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard label="Blended CPL" value="₹22,684" color="text-amber-700" />
            <KpiCard label="Lowest CPL" value="₹17,272" color="text-emerald-700" />
            <KpiCard label="Highest CPL" value="₹50,000" color="text-rose-700" />
            <KpiCard label="Total Ad Spend" value="₹18.0 L" color="text-brand-700" />
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm mb-2">CPL by Channel</h3>
            {sources.map((s,i)=>(
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-700">{s.name}</span>
                  <span className="font-mono font-bold text-amber-700">{formatCurrency(s.cpl)}</span>
                </div>
                <Bar pct={Math.round((s.cpl/50000)*100)} color="bg-amber-400" />
              </div>
            ))}
          </div>
        </div>;

      case 'marketing_channel_roi':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Channel ROI & ROAS</h3>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b"><tr>
              <TH>Channel</TH><TH>Ad Spend</TH><TH>Leads</TH><TH>Revenue</TH><TH>ROAS</TH>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {sources.map((s,i)=>(
                <tr key={i} className="hover:bg-slate-50">
                  <TD className="font-bold text-slate-900">{s.name}</TD>
                  <TD className="font-mono text-slate-500">{formatCurrency(s.spend)}</TD>
                  <TD className="font-mono text-center">{s.leads}</TD>
                  <TD className="font-mono font-bold text-brand-700">{formatCurrency(s.revenue)}</TD>
                  <TD className="text-center">
                    <Badge color={parseFloat(s.roas)>100?'bg-emerald-100 text-emerald-800':'bg-sky-100 text-sky-800'}>{s.roas}</Badge>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>;

      /* ── CALL REPORTS ── */
      case 'call_sales_performance':
        return <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard label="Total Calls Made" value="284" />
            <KpiCard label="Connected Rate" value="86.4%" color="text-emerald-700" />
            <KpiCard label="Avg Duration" value="4:12 min" color="text-purple-700" />
            <KpiCard label="Calls → Site Visit" value="12.4%" color="text-brand-700" />
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Call Performance by Agent</h3>
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b"><tr>
                <TH>Agent</TH><TH>Total Calls</TH><TH>Connected</TH><TH>Talktime</TH><TH>Avg Duration</TH>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {agentStats.map((a,i)=>(
                  <tr key={a.key} className="hover:bg-slate-50">
                    <TD className="font-bold text-slate-900">{a.name}</TD>
                    <TD className="font-mono text-center">{62+i*8}</TD>
                    <TD className="font-mono text-center text-emerald-700 font-bold">{54+i*6}</TD>
                    <TD className="font-mono text-center text-purple-700">{3+i}h {12+i*5}m</TD>
                    <TD className="font-mono text-center">{3+i}:{42+i*3} min</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>;

      case 'call_missed_calls':
        return <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <KpiCard label="Missed Calls" value="38" color="text-rose-700" />
            <KpiCard label="Callbacks Made" value="31" color="text-emerald-700" />
            <KpiCard label="Unresolved" value="7" color="text-amber-700" />
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Missed Call Resolution Log</h3>
            {leads.slice(0,5).map((l,i)=>(
              <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg border text-xs ${i<4?'bg-emerald-50 border-emerald-200':'bg-rose-50 border-rose-200'}`}>
                <span className="font-bold text-slate-800">{l.name}</span>
                <span className="font-mono text-slate-400">{l.phone||'+91 98XXX XXXXX'}</span>
                <Badge color={i<4?'bg-emerald-200 text-emerald-800':'bg-rose-200 text-rose-800'}>{i<4?'CALLBACK DONE':'PENDING'}</Badge>
              </div>
            ))}
          </div>
        </div>;

      case 'call_duration_analysis':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-900 text-sm">Call Duration Distribution</h3>
          {[
            {label:'< 1 min (Dropped / Voicemail)', pct:22, count:63, color:'bg-rose-400'},
            {label:'1–3 min (Short initial contact)', pct:35, count:99, color:'bg-amber-400'},
            {label:'3–6 min (Engaged conversation)', pct:28, count:80, color:'bg-sky-500'},
            {label:'6–12 min (Deep qualification)', pct:11, count:31, color:'bg-emerald-500'},
            {label:'> 12 min (High-intent closing)', pct:4, count:11, color:'bg-brand-600'},
          ].map((r,i)=>(
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">{r.label}</span>
                <span className="font-mono font-bold text-slate-600">{r.count} calls ({r.pct}%)</span>
              </div>
              <Bar pct={r.pct} color={r.color} />
            </div>
          ))}
        </div>;

      /* ── INVENTORY REPORTS ── */
      case 'inventory_summary':
        return <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <KpiCard label="Total Units" value={properties.length} />
            <KpiCard label="Available" value={properties.filter(p=>p.status==='Available').length} color="text-emerald-700" />
            <KpiCard label="Blocked" value={properties.filter(p=>p.status==='Blocked').length} color="text-amber-700" />
            <KpiCard label="Sold" value={properties.filter(p=>p.status==='Sold').length} color="text-slate-500" />
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b"><tr><TH>Unit</TH><TH>Config</TH><TH>Area</TH><TH>Status</TH><TH>Valuation</TH></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {properties.slice(0,6).map(p=>(
                  <tr key={p.id} className="hover:bg-slate-50">
                    <TD className="font-bold text-slate-900">{p.title}</TD>
                    <TD className="font-mono">{p.bhk} BHK</TD>
                    <TD className="font-mono text-slate-600">{p.sqft} sqft</TD>
                    <TD><Badge color={p.status==='Available'?'bg-emerald-100 text-emerald-800':p.status==='Blocked'?'bg-amber-100 text-amber-800':'bg-slate-200 text-slate-700'}>{p.status}</Badge></TD>
                    <TD className="font-mono font-bold text-brand-700">{formatCurrency(p.price)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>;

      case 'inventory_availability':
        return <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            {['2 BHK','3 BHK','4 BHK'].map(bhk=>{
              const n = parseInt(bhk);
              const cnt = properties.filter(p=>p.bhk===n&&p.status==='Available').length || (n-1);
              return <div key={bhk} className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <div className="text-[10px] font-mono text-emerald-700 uppercase font-bold">{bhk} Available</div>
                <div className="text-3xl font-extrabold text-emerald-800">{cnt}</div>
              </div>;
            })}
          </div>
          <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 border-b"><tr><TH>Property</TH><TH>Config</TH><TH>Locality</TH><TH>Status</TH></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {properties.filter(p=>p.status==='Available').slice(0,5).map(p=>(
                  <tr key={p.id} className="hover:bg-slate-50">
                    <TD className="font-bold text-slate-900">{p.title}</TD>
                    <TD className="font-mono">{p.bhk} BHK · {p.sqft} sqft</TD>
                    <TD className="text-slate-500">{p.loc}</TD>
                    <TD><Badge>AVAILABLE</Badge></TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>;

      case 'inventory_pricing':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Pricing Report — Unit Valuation</h3>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b"><tr>
              <TH>Property</TH><TH>Config</TH><TH>Size</TH><TH>List Price</TH><TH>₹/sqft</TH><TH>Status</TH>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {properties.slice(0,6).map(p=>(
                <tr key={p.id} className="hover:bg-slate-50">
                  <TD className="font-bold text-slate-900">{p.title}</TD>
                  <TD className="font-mono">{p.bhk} BHK</TD>
                  <TD className="font-mono text-slate-600">{p.sqft} sqft</TD>
                  <TD className="font-mono font-bold text-brand-700">{formatCurrency(p.price)}</TD>
                  <TD className="font-mono text-emerald-700 font-bold">₹{Math.round(p.price/p.sqft).toLocaleString('en-IN')}</TD>
                  <TD><Badge color={p.status==='Available'?'bg-emerald-100 text-emerald-800':'bg-slate-200 text-slate-700'}>{p.status}</Badge></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>;

      /* ── PRODUCTS & SERVICES ── */
      case 'product_management':
      case 'projects':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
          <h3 className="font-bold text-slate-900 text-sm mb-3">{label} — Project Portfolio</h3>
          {[
            {name:'Arcadia Estates — Phase 1', loc:'Besant Nagar', units:24, avail:8, value:285000000},
            {name:'Meridian Greens — OMR', loc:'OMR Sholinganallur', units:18, avail:5, value:192000000},
            {name:'Chennai Heights — ECR', loc:'ECR Thiruvanmiyur', units:12, avail:3, value:148000000},
            {name:'Anna Nagar Signature', loc:'Anna Nagar West', units:9, avail:2, value:215000000},
          ].map((proj,i)=>(
            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <div className="font-bold text-slate-900 text-xs">{proj.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{proj.loc}</div>
              </div>
              <div className="text-center">
                <div className="text-[10px] font-mono text-slate-400">Avail/Total</div>
                <div className="font-bold text-slate-800">{proj.avail}/{proj.units}</div>
              </div>
              <div className="font-mono font-bold text-brand-700 text-xs">{formatCurrency(proj.value)}</div>
              <Badge>ACTIVE</Badge>
            </div>
          ))}
        </div>;

      case 'approvals_negotiation':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Approvals Pending for Negotiation</h3>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b"><tr><TH>Ref</TH><TH>Buyer</TH><TH>List Price</TH><TH>Offer</TH><TH>Status</TH></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {approvals.map(ap=>(
                <tr key={ap.id} className="hover:bg-slate-50">
                  <TD className="font-mono font-bold text-brand-700">{ap.id}</TD>
                  <TD className="font-bold text-slate-900">{ap.leadId}</TD>
                  <TD className="font-mono text-slate-500">{formatCurrency(ap.list)}</TD>
                  <TD className="font-mono font-bold text-emerald-700">{formatCurrency(ap.offer)}</TD>
                  <TD><Badge color={ap.status==='approved'?'bg-emerald-100 text-emerald-800':ap.status==='rejected'?'bg-rose-100 text-rose-800':'bg-amber-100 text-amber-800'}>{ap.status}</Badge></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>;

      case 'price_quotes':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Price Quote Generator</h3>
          {leads.filter(l=>l.stage==='nego'||l.stage==='site_visit').slice(0,5).map(l=>(
            <div key={l.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <div className="font-bold text-slate-900 text-xs">{l.name}</div>
                <div className="text-[10px] text-slate-400">{l.bhk} BHK · {l.loc}</div>
              </div>
              <div className="font-mono font-bold text-brand-700 text-xs">{formatCurrency(l.budget)}</div>
              <Badge color="bg-purple-100 text-purple-800">QUOTE READY</Badge>
            </div>
          ))}
        </div>;

      /* ── GOVERNANCE APPROVALS ── */
      case 'booking_cancellation':
      case 'receipt':
      case 'payment_schedule':
      case 'applicant_deletion':
      case 'project_unit':
      case 'credit_note':
        return <div className="p-4 bg-white rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="font-bold text-slate-900 text-sm mb-3">{label} — Governance Audit</h3>
          <table className="w-full text-xs">
            <thead className="bg-slate-50 border-b"><tr>
              <TH>Request Ref</TH><TH>Buyer</TH><TH>Property</TH><TH>List Price</TH><TH>Offer</TH><TH>Status</TH>
            </tr></thead>
            <tbody className="divide-y divide-slate-100">
              {approvals.map(ap=>(
                <tr key={ap.id} className="hover:bg-slate-50">
                  <TD className="font-mono font-bold text-brand-700">{ap.id}</TD>
                  <TD className="font-bold text-slate-900">{ap.leadId}</TD>
                  <TD className="font-mono text-slate-500">{ap.propId}</TD>
                  <TD className="font-mono text-slate-600">{formatCurrency(ap.list)}</TD>
                  <TD className="font-mono font-bold text-emerald-700">{formatCurrency(ap.offer)}</TD>
                  <TD><Badge color={ap.status==='approved'?'bg-emerald-100 text-emerald-800':ap.status==='rejected'?'bg-rose-100 text-rose-800':'bg-amber-100 text-amber-800'}>{ap.status}</Badge></TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>;

      default:
        return <div className="p-8 text-center text-slate-500">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="font-bold text-slate-700">No data for report: <code className="font-mono bg-slate-100 px-1 rounded">{id}</code></p>
        </div>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div onClick={() => setActiveReport(null)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden z-10">
        <div className="px-6 py-4 bg-brand-950 text-white flex items-center justify-between border-b border-brand-900">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold-500/20 text-gold-400 rounded-xl border border-gold-500/30">
              {catIcon[category] || <BarChart3 className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-[10px] font-mono text-gold-400 uppercase tracking-widest font-bold">{category}</div>
              <h2 className="text-lg font-extrabold tracking-tight">{label}</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="px-3 py-1.5 bg-brand-800 hover:bg-brand-700 text-gold-300 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-brand-700">
              <Download className="w-3.5 h-3.5" /> Export PDF / CSV
            </button>
            <button onClick={() => setActiveReport(null)} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-medium">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4 text-brand-600" /> Time Range:
            <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
              {['7d','30d','90d','FY 26-27'].map(r=>(
                <button key={r} onClick={()=>setDateRange(r)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${dateRange===r?'bg-brand-600 text-white':'text-slate-600 hover:text-slate-900'}`}>
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="text-[11px] font-mono text-slate-500">Real-time Audit · Updated Just Now</div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 text-xs">
          {renderBody()}
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-500">Report ID: <strong className="text-slate-900">{id}</strong></span>
          <button onClick={() => setActiveReport(null)} className="px-5 py-2 bg-brand-600 text-white rounded-xl font-bold text-xs hover:bg-brand-700 transition-all shadow-sm">
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
}
