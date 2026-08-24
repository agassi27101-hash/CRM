import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { PEOPLE } from '../../data/mockData';
import {
  CheckSquare,
  CheckCircle,
  XCircle,
  Percent,
  Crown,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Plus,
  Lock,
  Building
} from 'lucide-react';

export default function ApprovalsView() {
  const {
    approvals,
    leads,
    properties,
    decideApproval,
    formatCurrency,
    role,
    setActiveLeadDrawerId,
    requestDiscountApproval,
    showToast
  } = useCRM();

  const [newApLeadId, setNewApLeadId] = useState('');
  const [newApPropId, setNewApPropId] = useState('');
  const [newApOffer, setNewApOffer] = useState('');
  const [newApNote, setNewApNote] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);

  const isDirector = role === 'director';
  const isManager = role === 'manager';
  const isAgent = role === 'agent';
  const canDecide = isDirector || isManager;

  const agentKey = 'VM'; // active agent Vikram Mehta
  const displayedApprovals = isAgent
    ? approvals.filter((a) => a.agent === agentKey)
    : approvals;

  const handleCreateRequest = (e) => {
    e.preventDefault();
    if (!newApLeadId || !newApPropId || !newApOffer) {
      showToast('Please select lead, property, and enter offer price', 'warning');
      return;
    }

    const offerNum = parseFloat(newApOffer) * 100000;
    requestDiscountApproval({
      leadId: newApLeadId,
      propId: newApPropId,
      offerAmount: offerNum,
      note: newApNote
    });

    setNewApLeadId('');
    setNewApPropId('');
    setNewApOffer('');
    setNewApNote('');
    setShowRequestForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-600 uppercase tracking-widest mb-1">
            <CheckSquare className="w-4 h-4 text-brand-600" /> Commercial Governance & Sign-offs
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Discount & Special Terms Approvals
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isDirector && 'Executive C-Suite governance & override authorization center.'}
            {isManager && 'Review and authorize price reduction requests from sales advisors.'}
            {isAgent && 'Track status of your submitted price reduction requests.'}
          </p>
        </div>

        {isAgent && (
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs hover:bg-brand-700 transition-all shadow-md shadow-brand-900/20 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" /> Request Discount Approval
          </button>
        )}
      </div>

      {/* Role Authorization Status Bar */}
      <div
        className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium ${
          isDirector
            ? 'bg-gradient-to-r from-brand-950 to-brand-900 text-white border-brand-800 shadow-md'
            : isManager
            ? 'bg-sky-50 text-sky-950 border-sky-200'
            : 'bg-amber-50 text-amber-900 border-amber-200'
        }`}
      >
        <div className="flex items-center gap-2.5">
          {isDirector && <Crown className="w-5 h-5 text-gold-400 shrink-0" />}
          {isManager && <Briefcase className="w-5 h-5 text-sky-600 shrink-0" />}
          {isAgent && <Lock className="w-5 h-5 text-amber-600 shrink-0" />}
          <div>
            <span className="font-bold">
              {isDirector && 'Board Authorization Mode: Executive Override & Sign-off Authority Active.'}
              {isManager && 'VP Operations Mode: Branch Manager Approval Queue Active.'}
              {isAgent && 'Agent Mode: Read-Only Status Tracking. Requests require Manager or Board sign-off.'}
            </span>
          </div>
        </div>

        <span
          className={`px-3 py-1 font-mono font-extrabold text-[10px] rounded-lg uppercase shrink-0 ${
            isDirector
              ? 'bg-gradient-to-r from-gold-400 to-gold-600 text-brand-950 shadow-sm'
              : isManager
              ? 'bg-sky-200 text-sky-900'
              : 'bg-amber-200 text-amber-950'
          }`}
        >
          {isDirector ? 'Board Executive Power' : isManager ? 'Manager Approval' : 'Agent Read-Only'}
        </span>
      </div>

      {/* Agent New Request Form */}
      {isAgent && showRequestForm && (
        <form
          onSubmit={handleCreateRequest}
          className="bg-white p-6 rounded-2xl border border-brand-200 shadow-md space-y-4 text-xs animate-fade-in"
        >
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Percent className="w-4 h-4 text-brand-600" /> New Discount Approval Request
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
                Select Lead Account
              </label>
              <select
                value={newApLeadId}
                onChange={(e) => setNewApLeadId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="">Choose Lead...</option>
                {leads
                  .filter((l) => l.agent === agentKey || !l.agent)
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.id} — {l.name} ({formatCurrency(l.budget)})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
                Property Listing
              </label>
              <select
                value={newApPropId}
                onChange={(e) => setNewApPropId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="">Choose Property...</option>
                {properties
                  .filter((p) => p.status !== 'Sold')
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} — {formatCurrency(p.price)}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
                Offer Price (₹ Lakhs)
              </label>
              <input
                type="number"
                placeholder="e.g. 238 for ₹2.38 Cr"
                value={newApOffer}
                onChange={(e) => setNewApOffer(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
              Commercial Justification for VP / Board
            </label>
            <input
              type="text"
              placeholder="e.g. Buyer willing to sign agreement and transfer 50% advance within 5 days."
              value={newApNote}
              onChange={(e) => setNewApNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowRequestForm(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-sm"
            >
              Submit Approval Request
            </button>
          </div>
        </form>
      )}

      {/* Approvals Cards Grid */}
      <div className="space-y-4">
        {displayedApprovals.length > 0 ? (
          displayedApprovals.map((ap) => {
            const leadObj = leads.find((x) => x.id === ap.leadId) || { name: 'Unknown Lead' };
            const propObj = properties.find((x) => x.id === ap.propId) || {
              title: 'Property Listing'
            };
            const isPending = ap.status === 'pending';
            const isApproved = ap.status === 'approved';
            const isRejected = ap.status === 'rejected';

            return (
              <div
                key={ap.id}
                className={`p-5 rounded-2xl border shadow-sm transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isPending
                    ? 'bg-amber-50/60 border-amber-200'
                    : isApproved
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-rose-50/60 border-rose-200'
                }`}
              >
                {/* Left Metadata */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-500">{ap.id}</span>
                    <span
                      className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded-md ${
                        isPending
                          ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                          : isApproved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {ap.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">({ap.w})</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <button
                      onClick={() => setActiveLeadDrawerId(ap.leadId)}
                      className="hover:text-brand-700 underline decoration-dotted"
                    >
                      {leadObj.name} ({ap.leadId})
                    </button>
                  </h3>

                  <p className="text-xs text-slate-600 font-medium">
                    Property: <strong className="text-slate-800">{propObj.title}</strong> · Advisor:{' '}
                    <strong>{PEOPLE[ap.agent]?.name || ap.agent}</strong>
                  </p>

                  <p className="text-xs text-slate-600 italic bg-white/80 p-2.5 rounded-xl border border-slate-200 mt-2 max-w-xl">
                    "{ap.note}"
                  </p>
                </div>

                {/* Right Offer Metrics & Action Buttons */}
                <div className="flex flex-col items-start md:items-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-200">
                  <div className="text-left md:text-right">
                    <div className="text-xs font-mono text-slate-600 font-medium">
                      List Price:{' '}
                      <span className="line-through text-slate-400 font-bold">
                        {formatCurrency(ap.list)}
                      </span>
                    </div>
                    <div className="text-lg font-mono font-extrabold text-emerald-800">
                      Offer: {formatCurrency(ap.offer)}
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded">
                      -{ap.discountPct ? ap.discountPct.toFixed(1) : 3}% Discount Requested
                    </span>
                  </div>

                  {/* ACTION BUTTONS: ENABLED FOR BOTH BOARD DIRECTORS AND MANAGERS */}
                  {isPending && canDecide ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decideApproval(ap.id, 'rejected', role)}
                        className="px-4 py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject Offer
                      </button>
                      <button
                        onClick={() => decideApproval(ap.id, 'approved', role)}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-brand-900/20 flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4 text-gold-400" />
                        {isDirector ? 'Board Approve' : 'Approve Discount'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-xs font-mono font-semibold text-slate-500">
                      {isPending
                        ? 'Awaiting Sign-off'
                        : `Decided by ${ap.decidedBy || 'VP Rajiv Kapoor'}`}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-slate-800 text-sm">No discount approval requests found</p>
            <p className="mt-1">Price cuts requested during negotiation will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
