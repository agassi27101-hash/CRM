import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  LOCALITIES,
  PEOPLE
} from '../../data/mockData';
import {
  Building,
  Plus,
  Filter,
  Sparkles,
  Users,
  Compass,
  Maximize2,
  CheckCircle,
  Tag
} from 'lucide-react';

export default function PropertyCatalog() {
  const {
    properties,
    leads,
    formatCurrency,
    setPropertyModalOpen,
    updatePropertyStatus,
    showToast,
    searchTerm
  } = useCRM();

  const [locFilter, setLocFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filteredProperties = properties.filter((p) => {
    if (locFilter && p.loc !== locFilter) return false;
    if (typeFilter && p.type !== typeFilter) return false;
    if (statusFilter && p.status !== statusFilter) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.loc.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const matchBuyersForProperty = (property) => {
    const matchingLeads = leads.filter(
      (l) =>
        l.stage !== 'won' &&
        l.stage !== 'lost' &&
        l.budget >= property.price * 0.8 &&
        l.budget <= property.price * 1.25 &&
        (l.loc === property.loc || l.bhk === property.bhk)
    );

    if (matchingLeads.length > 0) {
      const leadNames = matchingLeads.map((l) => l.name).join(', ');
      showToast(
        `AI Match: ${matchingLeads.length} active buyers fit "${property.title}": ${leadNames}`,
        'success'
      );
    } else {
      showToast(`No active buyer leads match "${property.title}" budget & locality right now.`, 'info');
    }
  };

  return (
    <div className="space-y-6">
      {/* Property Catalog Top Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-brand-600 uppercase tracking-widest mb-1">
            <Building className="w-4 h-4 text-brand-600" /> Enterprise Inventory & Portfolio
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Luxury Real Estate Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Browse active developments, manage listing prices, and run AI buyer-matching.
          </p>
        </div>

        <button
          onClick={() => setPropertyModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs hover:bg-brand-700 transition-all shadow-md shadow-brand-900/20 shrink-0 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Inventory Listing
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-slate-500 uppercase">
          <Filter className="w-4 h-4 text-slate-400" /> Filters:
        </div>

        <select
          value={locFilter}
          onChange={(e) => setLocFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
        >
          <option value="">All Localities</option>
          {LOCALITIES.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
        >
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Commercial">Commercial</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
        >
          <option value="">Any Status</option>
          <option value="Available">Available</option>
          <option value="Reserved">Reserved</option>
          <option value="Sold">Sold</option>
        </select>

        <span className="text-xs font-mono text-slate-500 ml-auto">
          Showing <strong className="text-slate-900">{filteredProperties.length}</strong> listings
        </span>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((prop) => (
          <div
            key={prop.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-lg transition-all group"
          >
            {/* Image Header */}
            <div className="h-48 relative overflow-hidden bg-slate-900">
              <img
                src={prop.img}
                alt={prop.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`px-3 py-1 text-xs font-mono font-bold uppercase rounded-lg shadow-md ${
                    prop.status === 'Available'
                      ? 'bg-emerald-600 text-white'
                      : prop.status === 'Reserved'
                      ? 'bg-gold-500 text-slate-950 font-extrabold'
                      : 'bg-slate-900 text-slate-300'
                  }`}
                >
                  {prop.status}
                </span>
              </div>

              {/* Facing & Days Listed */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white text-xs font-mono">
                <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[10px]">
                  <Compass className="w-3 h-3 text-gold-400" /> {prop.facing} Facing
                </span>
                <span className="bg-black/40 backdrop-blur-md px-2 py-0.5 rounded text-[10px]">
                  {prop.days}d listed
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-brand-700 transition-colors">
                      {prop.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{prop.loc}</p>
                  </div>
                  <span className="font-mono text-xs text-slate-400 font-bold">{prop.id}</span>
                </div>

                <div className="text-xl font-extrabold font-mono text-brand-700 mt-3">
                  {formatCurrency(prop.price)}
                </div>

                {/* Specs Tags */}
                <div className="flex items-center gap-2 mt-3 flex-wrap text-xs">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-md">
                    {prop.bhk ? `${prop.bhk} BHK` : 'Plot'}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-md flex items-center gap-1">
                    <Maximize2 className="w-3 h-3 text-slate-400" /> {prop.sqft} sqft
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-medium rounded-md">
                    {prop.type}
                  </span>
                </div>

                <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                  {prop.desc}
                </p>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-500 font-mono">
                  Owner:{' '}
                  <strong className="text-slate-800">
                    {prop.agent ? PEOPLE[prop.agent]?.name.split(' ')[0] : 'Unassigned'}
                  </strong>
                </div>

                <button
                  onClick={() => matchBuyersForProperty(prop)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-bold transition-colors border border-brand-200"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" /> AI Match Buyers
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
