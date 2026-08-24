import React from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  CheckSquare,
  Calendar,
  Clock,
  Send,
  Flame,
  MessageSquare,
  Award,
  ArrowRight,
  UserCheck,
  Building
} from 'lucide-react';

export default function AgentDashboard() {
  const {
    leads,
    tasks,
    visits,
    approvals,
    toggleTask,
    rescheduleVisit,
    cancelVisit,
    formatCurrency,
    PEOPLE,
    showToast,
    setActiveLeadDrawerId,
    setActiveTab
  } = useCRM();

  const agentKey = 'VM'; // Vikram Mehta (Active Agent)
  const agentInfo = PEOPLE[agentKey];

  const myLeads = leads.filter((l) => l.agent === agentKey);
  const openLeads = myLeads.filter((l) => l.stage !== 'won' && l.stage !== 'lost');
  const myTasks = tasks.filter((t) => t.agent === agentKey);
  const myVisits = visits.filter((v) => v.agent === agentKey);
  const myApprovals = approvals.filter((a) => a.agent === agentKey);

  const totalInPlayValue = openLeads.reduce((sum, l) => sum + (l.budget || 0), 0);
  const attainmentPct = Math.round((agentInfo.booked / agentInfo.target) * 100);

  const sendReminder = (who, phone) => {
    showToast(`WhatsApp reminder sent to ${who} (${phone || 'SMS'})`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Agent Welcome Header */}
      <div className="bg-gradient-to-r from-brand-950 to-brand-900 text-white rounded-2xl p-6 shadow-xl border border-brand-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gold-400 uppercase tracking-widest mb-1">
            <UserCheck className="w-4 h-4 text-gold-400" /> Sales Agent Workspace ("My Day")
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight">
            Welcome back, {agentInfo.name.split(' ')[0]}!
          </h1>
          <p className="text-xs text-brand-200/80 mt-1">
            Senior Luxury Advisor · {agentInfo.branch} Branch
          </p>
        </div>

        <div className="flex items-center gap-4 bg-brand-900/80 p-3 rounded-xl border border-brand-800">
          <div className="text-right">
            <div className="text-[10px] font-mono text-brand-300 uppercase">Monthly Attainment</div>
            <div className="text-xl font-extrabold text-gold-400">{attainmentPct}%</div>
            <div className="text-[10px] text-brand-200 font-mono">
              {formatCurrency(agentInfo.booked)} of {formatCurrency(agentInfo.target)}
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-gold-400 p-1 flex items-center justify-center">
            <Award className="w-6 h-6 text-gold-400" />
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            My Open Leads
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{openLeads.length}</div>
          <div className="text-xs text-brand-700 font-bold mt-1">
            {formatCurrency(totalInPlayValue)} in play
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Scheduled Viewings
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{myVisits.length}</div>
          <div className="text-xs text-slate-500 mt-1">
            Next viewing at {myVisits[0]?.time || 'None today'}
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Pending Tasks
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">
            {myTasks.filter((t) => !t.done).length}
          </div>
          <div className="text-xs text-amber-700 font-bold mt-1">
            {myTasks.filter((t) => !t.done && t.when === 'Today').length} due today
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider">
            Discount Approvals
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1">{myApprovals.length}</div>
          <div className="text-xs text-slate-500 mt-1">
            {myApprovals.filter((a) => a.status === 'pending').length} waiting for VP sign-off
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Checklist Tasks */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-brand-600" />
                Today's Action Checklist
              </h2>
              <p className="text-xs text-slate-500">Tick items as you complete them today</p>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {myTasks.length > 0 ? (
              myTasks.map((task) => (
                <label
                  key={task.id}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    task.done
                      ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    className="mt-1 w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold leading-snug">{task.t}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{task.s}</div>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${
                      task.when === 'Today'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {task.when}
                  </span>
                </label>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No tasks assigned for today.
              </div>
            )}
          </div>
        </div>

        {/* Scheduled Site Viewings */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                Scheduled Site Viewings
              </h2>
              <p className="text-xs text-slate-500">Confirmed customer property tours</p>
            </div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {myVisits.length > 0 ? (
              myVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-2.5 py-1.5 bg-purple-600 text-white rounded-lg font-mono font-bold text-xs shrink-0">
                      {visit.time}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900">{visit.who}</h3>
                      <p className="text-[11px] text-slate-600 mt-0.5">{visit.where}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={visit.time}
                      onChange={(e) => rescheduleVisit(visit.id, e.target.value)}
                      className="px-2 py-1 bg-white border border-purple-200 text-purple-900 rounded-lg text-xs font-medium"
                      title="Reschedule viewing time"
                    >
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>11:30 AM</option>
                      <option>02:00 PM</option>
                      <option>04:00 PM</option>
                      <option>06:30 PM</option>
                    </select>

                    <button
                      onClick={() => sendReminder(visit.who, visit.phone)}
                      className="flex items-center gap-1 px-2.5 py-1 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-100 transition-colors shadow-xs"
                    >
                      <Send className="w-3 h-3" /> Remind
                    </button>
                    
                    <button
                      onClick={() => cancelVisit(visit.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Cancel viewing appointment"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                No site viewings scheduled for today.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hot Leads Watchlist */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-600" />
              Hot Leads Needing Action
            </h2>
            <p className="text-xs text-slate-500">High temperature deals assigned to you</p>
          </div>
          <button
            onClick={() => setActiveTab('pipeline')}
            className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700"
          >
            Open Kanban Pipeline <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {openLeads
            .filter((l) => l.temp === 'hot')
            .map((l) => (
              <div
                key={l.id}
                onClick={() => setActiveLeadDrawerId(l.id)}
                className="p-4 bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-brand-600 transition-all cursor-pointer shadow-sm group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-brand-700">{l.id}</span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-700">
                      {l.name}
                    </h3>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-800">
                    {formatCurrency(l.budget)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {l.bhk ? `${l.bhk} BHK` : 'Plot'} · {l.loc}
                </p>
                <p className="text-xs font-medium text-slate-500 mt-2 bg-white p-2 rounded border border-slate-200">
                  Next: {l.next}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
