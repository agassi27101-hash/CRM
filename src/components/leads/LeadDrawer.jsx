import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  STAGES,
  PEOPLE
} from '../../data/mockData';
import {
  X,
  Phone,
  DollarSign,
  MapPin,
  Calendar,
  Sparkles,
  Send,
  Lock,
  Percent,
  History,
  Building,
  UserCheck
} from 'lucide-react';

export default function LeadDrawer() {
  const {
    activeLeadDrawerId,
    setActiveLeadDrawerId,
    leads,
    properties,
    approvals,
    updateLeadStage,
    addLeadInteractionLog,
    requestDiscountApproval,
    scheduleVisit,
    formatCurrency,
    role,
    showToast
  } = useCRM();

  const [logInput, setLogInput] = useState('');
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountPropId, setDiscountPropId] = useState('');
  const [offerPriceInput, setOfferPriceInput] = useState('');
  const [discountNote, setDiscountNote] = useState('');

  // Site Viewing Schedule State
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [visitPropLoc, setVisitPropLoc] = useState('');

  if (!activeLeadDrawerId) return null;

  const lead = leads.find((l) => l.id === activeLeadDrawerId);
  if (!lead) return null;

  const canEdit = role !== 'director';

  const handleScheduleVisitSubmit = () => {
    scheduleVisit({
      time: visitTime,
      agent: lead.agent || 'VM',
      who: lead.name,
      where: visitPropLoc || `${lead.loc} Viewing`,
      phone: lead.phone
    });
    updateLeadStage(lead.id, 'site_visit');
    addLeadInteractionLog(lead.id, `Site viewing scheduled for ${visitTime} at ${visitPropLoc || lead.loc}`);
    setShowVisitForm(false);
    setVisitPropLoc('');
  };

  // Find matching properties
  const matchedProps = properties
    .filter(
      (p) =>
        p.status !== 'Sold' &&
        p.price <= lead.budget * 1.25 &&
        p.price >= lead.budget * 0.75 &&
        (p.loc === lead.loc || p.bhk === lead.bhk)
    )
    .slice(0, 3);

  const pendingApproval = approvals.find(
    (a) => a.leadId === lead.id && a.status === 'pending'
  );

  const handleAddLog = () => {
    if (!logInput.trim()) return;
    addLeadInteractionLog(lead.id, logInput);
    setLogInput('');
  };

  const handleSendDiscountRequest = () => {
    if (!discountPropId || !offerPriceInput) {
      showToast('Select a property and enter your offer price', 'warning');
      return;
    }
    const offerNum = parseFloat(offerPriceInput) * 100000; // in lakhs to INR
    requestDiscountApproval({
      leadId: lead.id,
      propId: discountPropId,
      offerAmount: offerNum,
      note: discountNote
    });
    setShowDiscountForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Scrim Overlay */}
      <div
        onClick={() => setActiveLeadDrawerId(null)}
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-slate-200 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-brand-950 text-white relative">
            <button
              onClick={() => setActiveLeadDrawerId(null)}
              className="absolute top-5 right-5 p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-mono text-gold-400 uppercase tracking-widest">
              {lead.id} · {lead.source} ·{' '}
              {lead.agent ? PEOPLE[lead.agent]?.name : 'Unassigned'}
            </div>

            <h2 className="text-xl font-extrabold tracking-tight mt-1 flex items-center justify-between">
              <span>{lead.name}</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-400/30">
                ⚡ Jarvis AI Intent: {lead.temp === 'hot' ? '94%' : lead.temp === 'warm' ? '78%' : '45%'}
              </span>
            </h2>

            <p className="text-xs text-brand-200/80 mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono">
                <Phone className="w-3.5 h-3.5 text-gold-400" /> {lead.phone}
              </span>
              <span>·</span>
              <span className="font-mono font-bold text-gold-400">
                {formatCurrency(lead.budget)}
              </span>
            </p>

            {/* Sell.do Quick Communication & Telephony Action Bar */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-brand-900">
              <button
                onClick={() => {
                  addLeadInteractionLog(lead.id, `Cloud Telephony Call initiated to ${lead.phone}. Call Connected (02:15 mins).`);
                  showToast(`Cloud Call connected to ${lead.name} (${lead.phone})`, 'success');
                }}
                className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Phone className="w-3.5 h-3.5" /> Click-to-Call
              </button>
              <button
                onClick={() => {
                  addLeadInteractionLog(lead.id, `WhatsApp Brochure & Project Location sent to ${lead.phone}.`);
                  showToast(`WhatsApp Project Brochure dispatched to ${lead.phone}`, 'info');
                }}
                className="flex-1 py-1.5 px-3 bg-emerald-800/90 hover:bg-emerald-700 text-emerald-100 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm border border-emerald-600/50"
              >
                💬 WhatsApp Info
              </button>
              <button
                onClick={() => {
                  setShowVisitForm(true);
                }}
                className="py-1.5 px-3 bg-brand-800 hover:bg-brand-700 text-gold-300 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-brand-700"
              >
                <Calendar className="w-3.5 h-3.5" /> Site Visit
              </button>
            </div>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Jarvis AI Recommendations Banner */}
            <div className="p-3.5 bg-gradient-to-r from-brand-900/90 via-slate-900 to-brand-950 text-white rounded-xl border border-gold-500/30 flex items-center justify-between text-xs shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-gold-500/20 text-gold-400 rounded-lg shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-gold-300 text-[11px] uppercase tracking-wider font-mono">
                    Jarvis AI Insight & Next Best Action
                  </div>
                  <div className="text-slate-200 text-xs mt-0.5">
                    {lead.temp === 'hot'
                      ? 'High propensity to transact within 7 days. Offer maximum 3.5% discount on Besant Nagar 3BHK.'
                      : 'Recommended action: Schedule weekend site viewing with site cab service.'}
                  </div>
                </div>
              </div>
            </div>

            {/* Stage Selector */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-2">
                Pipeline Stage Progression
              </h3>
              {canEdit ? (
                <div className="grid grid-cols-3 gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => updateLeadStage(lead.id, s.id)}
                      className={`px-2.5 py-2 rounded-lg text-xs font-bold transition-all border ${
                        lead.stage === s.id
                          ? 'bg-brand-600 text-white border-brand-700 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>
                    Board Access is Read-Only. Stage changes belong to lead owner (
                    {lead.agent ? PEOPLE[lead.agent]?.name : 'Unassigned'}).
                  </span>
                </div>
              )}
            </div>

            {/* Pending Approvals Alert */}
            {pendingApproval && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                    <Percent className="w-4 h-4 text-amber-600" /> Discount Approval Pending (
                    {pendingApproval.id})
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded uppercase">
                    Requires Sign-off
                  </span>
                </div>
                <p className="text-xs text-slate-700">
                  Offer of <strong className="text-emerald-800">{formatCurrency(pendingApproval.offer)}</strong> (List: {formatCurrency(pendingApproval.list)}) raised by advisor.
                </p>
                <p className="text-xs text-slate-600 italic bg-white/80 p-2 rounded border border-amber-200">
                  "{pendingApproval.note}"
                </p>

                {(role === 'manager' || role === 'director') ? (
                  <div className="flex items-center gap-2 pt-2 border-t border-amber-200">
                    <button
                      onClick={() => decideApproval(pendingApproval.id, 'rejected', role)}
                      className="flex-1 py-1.5 bg-rose-100 text-rose-800 rounded-lg text-xs font-bold hover:bg-rose-200 transition-colors flex items-center justify-center gap-1"
                    >
                      Reject Offer
                    </button>
                    <button
                      onClick={() => decideApproval(pendingApproval.id, 'approved', role)}
                      className="flex-1 py-1.5 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors shadow-sm flex items-center justify-center gap-1"
                    >
                      {role === 'director' ? 'Board Approve' : 'Approve Discount'}
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] font-mono text-slate-500 pt-1">
                    🔒 Sign-off pending from Manager or Board.
                  </p>
                )}
              </div>
            )}

            {/* Requirement Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
              <h3 className="font-mono font-bold uppercase text-slate-400 text-[10px] tracking-wider mb-1">
                Requirement Details
              </h3>
              <div className="grid grid-cols-2 gap-2 font-medium">
                <div>
                  Locality: <strong className="text-slate-900">{lead.loc}</strong>
                </div>
                <div>
                  Configuration: <strong className="text-slate-900">{lead.bhk ? `${lead.bhk} BHK` : 'Plot'}</strong>
                </div>
                <div>
                  Temperature: <span className="uppercase font-bold text-rose-600">{lead.temp}</span>
                </div>
                <div>
                  Next Action: <span className="text-slate-700">{lead.next}</span>
                </div>
              </div>
            </div>

            {/* AI Inventory Matching & Instant Cost Sheet Generator */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" /> AI Matched Inventory (
                  {matchedProps.length})
                </h3>
              </div>

              <div className="space-y-2">
                {matchedProps.length > 0 ? (
                  matchedProps.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs shadow-xs"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{p.title}</div>
                        <div className="text-[11px] text-slate-500">
                          {p.loc} · {p.sqft} sqft · {p.facing} facing
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="font-mono font-bold text-brand-700">
                          {formatCurrency(p.price)}
                        </div>
                        <button
                          onClick={() => {
                            addLeadInteractionLog(
                              lead.id,
                              `Generated Cost Sheet breakdown for ${p.title} (Total: ${formatCurrency(p.price * 1.13)} incl. Stamp Duty & Registration).`
                            );
                            showToast(`Cost Sheet generated for ${p.title}`, 'success');
                          }}
                          className="px-2 py-0.5 bg-brand-50 text-brand-700 hover:bg-brand-100 rounded text-[10px] font-bold border border-brand-200"
                        >
                          📄 Generate Cost Sheet
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs font-mono">
                    No matching inventory found in this price bracket.
                  </div>
                )}
              </div>
            </div>

            {/* Schedule / Reschedule Site Viewing Section */}
            {canEdit && (
              <div className="p-4 bg-purple-50/70 rounded-xl border border-purple-200 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-purple-950 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-600" /> Schedule / Reschedule Site Viewing
                  </h3>
                  <button
                    onClick={() => setShowVisitForm(!showVisitForm)}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900"
                  >
                    {showVisitForm ? 'Cancel' : 'Book Viewing'}
                  </button>
                </div>

                {showVisitForm && (
                  <div className="space-y-2.5 pt-2 border-t border-purple-200/80">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono text-purple-900 uppercase">
                          Viewing Time
                        </label>
                        <select
                          value={visitTime}
                          onChange={(e) => setVisitTime(e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-medium"
                        >
                          <option>10:00 AM</option>
                          <option>11:30 AM</option>
                          <option>02:00 PM</option>
                          <option>04:00 PM</option>
                          <option>06:00 PM</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono text-purple-900 uppercase">
                          Property Location
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Besant Nagar #4A"
                          value={visitPropLoc}
                          onChange={(e) => setVisitPropLoc(e.target.value)}
                          className="w-full mt-1 px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleScheduleVisitSubmit}
                      className="w-full py-2 bg-purple-600 text-white rounded-lg font-bold text-xs hover:bg-purple-700 transition-colors shadow-sm"
                    >
                      Confirm Site Viewing Appointment
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Discount Request Trigger */}
            {canEdit && lead.stage === 'nego' && !pendingApproval && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900">Request Discount Approval</h3>
                  <button
                    onClick={() => setShowDiscountForm(!showDiscountForm)}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    {showDiscountForm ? 'Cancel' : 'New Request'}
                  </button>
                </div>

                {showDiscountForm && (
                  <div className="space-y-2.5 pt-2">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase">
                        Select Target Property
                      </label>
                      <select
                        value={discountPropId}
                        onChange={(e) => setDiscountPropId(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-medium"
                      >
                        <option value="">Choose property...</option>
                        {properties.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} — {formatCurrency(p.price)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase">
                        Customer Offer Price (₹ Lakhs)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 238 for ₹2.38 Cr"
                        value={offerPriceInput}
                        onChange={(e) => setOfferPriceInput(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase">
                        Justification for VP Manager
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ready for 50% down payment this Friday"
                        value={discountNote}
                        onChange={(e) => setDiscountNote(e.target.value)}
                        className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                      />
                    </div>

                    <button
                      onClick={handleSendDiscountRequest}
                      className="w-full py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors shadow-sm"
                    >
                      Send to VP Rajiv Kapoor for Sign-off
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Interaction Log Timeline */}
            <div>
              <h3 className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider mb-3 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5" /> Interaction Log Timeline
              </h3>

              {canEdit && (
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Log a call, email, or site note..."
                    value={logInput}
                    onChange={(e) => setLogInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLog()}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-600 font-medium"
                  />
                  <button
                    onClick={handleAddLog}
                    className="px-3 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-colors"
                  >
                    Log
                  </button>
                </div>
              )}

              <div className="border-l-2 border-slate-200 ml-2 space-y-4 pl-4">
                {lead.log.map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-gold-500 border-2 border-white" />
                    <p className="text-xs text-slate-800 font-medium leading-snug">{item.t}</p>
                    <span className="text-[10px] font-mono text-slate-400">{item.w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
