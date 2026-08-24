import React, { useState, useEffect } from 'react';
import { useCRM } from '../../context/CRMContext';
import { LOCALITIES, PEOPLE } from '../../data/mockData';
import { X, UserPlus, ChevronDown } from 'lucide-react';

const TABS = ['Basic Profile', 'Personal Details', 'Requirement'];

const SALUTATIONS = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.'];
const SOURCES = ['Direct Walk-in', 'Facebook Campaign', 'Google Ads', 'IRIS Channel Partner', 'NRI Referral', 'Influencer Marketing', 'Site Hoarding', 'Public Website', 'Existing Customer'];

export default function NewLeadModal() {
  const { leadModalOpen, setLeadModalOpen, addLead, role, properties } = useCRM();

  useEffect(() => {
    if (leadModalOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [leadModalOpen]);

  const [activeTab, setActiveTab] = useState(0);

  // Basic Profile
  const [salutation, setSalutation] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailType, setEmailType] = useState('Office');
  const [email, setEmail] = useState('');
  const [phoneType, setPhoneType] = useState('Work');
  const [phone, setPhone] = useState('');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [tags, setTags] = useState('');
  const [interestedProjects, setInterestedProjects] = useState('');

  // Personal Details
  const [source, setSource] = useState('Direct Walk-in');
  const [agent, setAgent] = useState(role === 'agent' ? 'VM' : '');
  const [temp, setTemp] = useState('warm');

  // Requirement
  const [budget, setBudget] = useState('');
  const [loc, setLoc] = useState(LOCALITIES[0]);
  const [bhk, setBhk] = useState('3');
  const [propType, setPropType] = useState('Apartment');

  if (!leadModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const fullName = `${salutation} ${firstName} ${lastName}`.trim();
    if (!firstName || !budget) return;

    addLead({
      name: fullName,
      phone: phone ? `+91 ${phone}` : '+91 98400 00000',
      email: email || '',
      budget: parseFloat(budget) * 100000,
      loc,
      bhk: parseInt(bhk),
      source,
      agent,
      temp,
      tags: tags ? tags.split(',').map(t => t.trim()) : []
    });

    // Reset
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setBudget('');
    setActiveTab(0);
    setLeadModalOpen(false);
  };

  const inputCls = 'w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-600 focus:outline-none focus:bg-white text-xs font-medium transition-all';
  const labelCls = 'block text-[10px] font-mono font-extrabold text-slate-500 uppercase tracking-wider mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in">
      <div onClick={() => setLeadModalOpen(false)} className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm" />

      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col z-10 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-brand-950 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-brand-800/80 text-gold-400 rounded-lg">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-tight">New Lead</h2>
          </div>
          <button onClick={() => setLeadModalOpen(false)} className="p-1 text-brand-300 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`flex-1 py-2.5 text-[11px] font-bold tracking-tight transition-colors ${
                activeTab === i
                  ? 'text-brand-700 border-b-2 border-brand-600 bg-white'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4 max-h-[420px] overflow-y-auto text-xs">
            {/* ── TAB 0: Basic Profile ── */}
            {activeTab === 0 && (
              <>
                {/* Salutation + Name */}
                <div>
                  <label className={labelCls}>Salutation & Name *</label>
                  <div className="flex gap-2">
                    <select
                      value={salutation}
                      onChange={(e) => setSalutation(e.target.value)}
                      className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium w-24 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                    >
                      {SALUTATIONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <input
                      type="text"
                      required
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={inputCls + ' flex-1'}
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={inputCls + ' flex-1'}
                    />
                  </div>
                </div>

                {/* Primary Email */}
                <div>
                  <label className={labelCls}>Primary Email</label>
                  <div className="flex gap-2">
                    <select
                      value={emailType}
                      onChange={(e) => setEmailType(e.target.value)}
                      className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium w-24 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                    >
                      <option>Office</option>
                      <option>Personal</option>
                    </select>
                    <input
                      type="email"
                      placeholder="Primary Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputCls + ' flex-1'}
                    />
                  </div>
                </div>

                {/* Primary Phone */}
                <div>
                  <label className={labelCls}>Primary Phone *</label>
                  <div className="flex gap-2">
                    <select
                      value={phoneType}
                      onChange={(e) => setPhoneType(e.target.value)}
                      className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium w-24 focus:ring-2 focus:ring-brand-600 focus:outline-none"
                    >
                      <option>Work</option>
                      <option>Mobile</option>
                      <option>Home</option>
                    </select>
                    <div className="flex-1 flex gap-1">
                      <span className="px-2.5 py-2 bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        placeholder="Primary Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputCls + ' flex-1'}
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">Country code is pre-pended. NRI flag auto-detected.</p>
                </div>

                {/* Timezone */}
                <div>
                  <label className={labelCls}>Time Zone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className={inputCls}
                  >
                    <option>Asia/Kolkata</option>
                    <option>Asia/Dubai</option>
                    <option>America/New_York</option>
                    <option>Europe/London</option>
                    <option>Asia/Singapore</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className={labelCls}>Tags</label>
                  <input
                    type="text"
                    placeholder="e.g. vip, nri, investor (comma separated)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className={inputCls}
                  />
                </div>

                {/* Interested Projects */}
                <div>
                  <label className={labelCls}>Interested Projects</label>
                  <select
                    value={interestedProjects}
                    onChange={(e) => setInterestedProjects(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Select Project...</option>
                    <option>Meridian Bay Residences</option>
                    <option>ECR Villa Estate</option>
                    <option>Adyar Signature Tower</option>
                    <option>OMR Tech Enclave</option>
                    <option>Boat Club Premium Villas</option>
                  </select>
                </div>
              </>
            )}

            {/* ── TAB 1: Personal Details ── */}
            {activeTab === 1 && (
              <>
                <div>
                  <label className={labelCls}>Lead Source</label>
                  <select value={source} onChange={(e) => setSource(e.target.value)} className={inputCls}>
                    {SOURCES.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Lead Temperature</label>
                  <div className="flex gap-2">
                    {['hot', 'warm', 'cold'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTemp(t)}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize border transition-all ${
                          temp === t
                            ? t === 'hot' ? 'bg-rose-600 text-white border-rose-600'
                              : t === 'warm' ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-sky-500 text-white border-sky-500'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {t === 'hot' ? '🔥' : t === 'warm' ? '✨' : '❄️'} {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Assign To Advisor</label>
                  <select value={agent} onChange={(e) => setAgent(e.target.value)} className={inputCls}>
                    <option value="">Unassigned</option>
                    {Object.entries(PEOPLE).map(([key, p]) => (
                      <option key={key} value={key}>{p.name} — {p.branch}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelCls}>Campaign / Medium</label>
                  <input type="text" placeholder="e.g. Facebook Campaign, Google Ads" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Any Notes</label>
                  <textarea
                    placeholder="e.g. Buyer looking for sea-facing unit, flexible timeline"
                    rows={3}
                    className={inputCls + ' resize-none'}
                  />
                </div>
              </>
            )}

            {/* ── TAB 2: Requirement ── */}
            {activeTab === 2 && (
              <>
                <div>
                  <label className={labelCls}>Budget (₹ Lakhs) *</label>
                  <input
                    type="number"
                    required={activeTab === 2}
                    placeholder="e.g. 250 for ₹2.50 Cr"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Preferred Locality</label>
                    <select value={loc} onChange={(e) => setLoc(e.target.value)} className={inputCls}>
                      {LOCALITIES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className={labelCls}>Configuration</label>
                    <select value={bhk} onChange={(e) => setBhk(e.target.value)} className={inputCls}>
                      <option value="1">1 BHK</option>
                      <option value="2">2 BHK</option>
                      <option value="3">3 BHK</option>
                      <option value="4">4 BHK</option>
                      <option value="5">5 BHK Villa</option>
                      <option value="0">Plot / Land</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Property Type</label>
                  <div className="flex flex-wrap gap-2">
                    {['Apartment', 'Villa', 'Plot', 'Commercial'].map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPropType(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                          propType === t ? 'bg-brand-600 text-white border-brand-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-brand-300'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Min Size (sqft)</label>
                    <input type="number" placeholder="e.g. 1200" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Max Size (sqft)</label>
                    <input type="number" placeholder="e.g. 2500" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Possession Timeline</label>
                  <select className={inputCls}>
                    <option>Ready to Move</option>
                    <option>Within 6 Months</option>
                    <option>6–12 Months</option>
                    <option>1–2 Years</option>
                    <option>2+ Years</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex gap-1">
              {TABS.map((_, i) => (
                <div
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                    activeTab === i ? 'bg-brand-600 w-4' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              {activeTab > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab - 1)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs hover:bg-slate-200 transition-colors"
                >
                  Back
                </button>
              )}
              {activeTab < TABS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab + 1)}
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-lg text-xs hover:bg-brand-700 transition-all shadow-sm"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-600 text-white font-bold rounded-lg text-xs hover:bg-brand-700 transition-all shadow-sm"
                >
                  Save Lead
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
