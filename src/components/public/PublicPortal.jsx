import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { LOCALITIES } from '../../data/mockData';
import {
  Globe,
  Search,
  Building,
  CheckCircle2,
  Phone,
  Send,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';

export default function PublicPortal() {
  const { properties, addLead, formatCurrency, showToast, setActiveTab, setRole } = useCRM();

  const [searchLoc, setSearchLoc] = useState('');
  const [searchBhk, setSearchBhk] = useState('');

  // Form State
  const [custName, setCustName] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custBudget, setCustBudget] = useState('150'); // in Lakhs
  const [custLoc, setCustLoc] = useState(LOCALITIES[0]);
  const [custBhk, setCustBhk] = useState('3');

  const availableProperties = properties
    .filter((p) => p.status === 'Available')
    .filter((p) => {
      if (searchLoc && p.loc !== searchLoc) return false;
      if (searchBhk && String(p.bhk) !== searchBhk) return false;
      return true;
    });

  const handlePublicEnquirySubmit = (e) => {
    e.preventDefault();
    if (!custName || !custBudget) {
      showToast('Please enter your full name and budget', 'warning');
      return;
    }

    const budgetNum = parseFloat(custBudget) * 100000;
    const newLead = addLead({
      name: custName,
      phone: custPhone || '+91 98765 43210',
      budget: budgetNum,
      loc: custLoc,
      bhk: parseInt(custBhk),
      source: 'Website Public Portal',
      agent: '' // Leaves unassigned so VP Manager gets notification!
    });

    setCustName('');
    setCustPhone('');
    showToast(
      `Thank you ${custName}! Your enquiry (${newLead.id}) was sent. Switch to Manager to assign it!`,
      'success'
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Simulation Browser Bar */}
      <div className="bg-slate-900 text-slate-300 p-3 px-4 flex items-center justify-between border-b border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
          </div>
          <span className="ml-4 bg-slate-800 text-slate-200 px-3 py-1 rounded-full text-[11px] border border-slate-700 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" /> https://meridianestates.in
          </span>
        </div>
        <div className="text-[10px] text-amber-400 font-bold hidden sm:block">
          PUBLIC PORTAL SIMULATION — Enquiries land live in CRM Unassigned Queue
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-brand-950 text-white p-8 md:p-14 overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gold-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-gold-400 uppercase tracking-widest bg-brand-900/80 border border-brand-800 px-3 py-1 rounded-full mb-4">
            <Shield className="w-3.5 h-3.5 text-gold-400" /> Chennai Luxury Real Estate Since 2011
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Find the address you'll keep for thirty years.
          </h1>
          <p className="text-sm md:text-base text-brand-200/80 mt-3 font-normal leading-relaxed">
            Verified luxury listings across Besant Nagar, Adyar, Boat Club, and OMR — visited and vetted by our in-house advisory team.
          </p>

          {/* Quick Search Widget */}
          <div className="mt-8 p-3 bg-white rounded-2xl shadow-xl flex flex-wrap gap-2 text-slate-900 text-xs">
            <select
              value={searchLoc}
              onChange={(e) => setSearchLoc(e.target.value)}
              className="flex-1 min-w-[140px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="">Any Locality</option>
              {LOCALITIES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <select
              value={searchBhk}
              onChange={(e) => setSearchBhk(e.target.value)}
              className="flex-1 min-w-[120px] px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
            >
              <option value="">Any Size</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
              <option value="5">5 BHK Villa</option>
            </select>

            <button className="px-5 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-slate-950 font-bold rounded-xl flex items-center gap-1.5 shadow-md">
              <Search className="w-4 h-4" /> Search Properties
            </button>
          </div>
        </div>
      </section>

      {/* Available Properties Grid */}
      <section className="p-8 bg-slate-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Featured Luxury Inventory ({availableProperties.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pulled directly from the live CRM inventory database
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableProperties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col"
            >
              <div className="h-44 relative bg-slate-900">
                <img src={prop.img} alt={prop.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-600 text-white font-mono font-bold text-[10px] uppercase rounded">
                  Available
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{prop.title}</h3>
                  <p className="text-xs text-slate-500">{prop.loc}</p>
                  <div className="text-lg font-extrabold font-mono text-brand-700 mt-2">
                    {formatCurrency(prop.price)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCustLoc(prop.loc);
                    if (prop.bhk) setCustBhk(String(prop.bhk));
                    showToast(`Selected "${prop.title}" requirement in inquiry form`, 'info');
                  }}
                  className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Request a Private Viewing
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Lead Generation Form */}
      <section className="p-8 md:p-12 bg-white border-t border-slate-200 max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-mono font-bold text-gold-600 uppercase tracking-widest">
            Enquire Now
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Speak with a Senior Luxury Property Advisor
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Submit your requirement below. This form automatically inserts a new lead into the CRM unassigned queue.
          </p>
        </div>

        <form
          onSubmit={handlePublicEnquirySubmit}
          className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 space-y-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-600 uppercase mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ramesh Krishnan"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-600 uppercase mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+91 98400 12345"
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold text-slate-600 uppercase mb-1">
                Budget (₹ Lakhs) *
              </label>
              <input
                type="number"
                required
                placeholder="150 for ₹1.5 Cr"
                value={custBudget}
                onChange={(e) => setCustBudget(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-600 uppercase mb-1">
                Preferred Locality
              </label>
              <select
                value={custLoc}
                onChange={(e) => setCustLoc(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-none font-medium"
              >
                {LOCALITIES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-slate-600 uppercase mb-1">
                Configuration
              </label>
              <select
                value={custBhk}
                onChange={(e) => setCustBhk(e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-none font-medium"
              >
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5 BHK Villa</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-brand-600 text-white font-bold rounded-xl text-xs hover:bg-brand-700 transition-all shadow-md shadow-brand-900/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-gold-400" /> Send Property Inquiry
            </button>

            <button
              type="button"
              onClick={() => {
                setRole('manager');
                setActiveTab('dashboard');
              }}
              className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
            >
              Switch to Manager Hub to view queue <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
