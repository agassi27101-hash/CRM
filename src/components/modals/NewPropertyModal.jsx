import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import { LOCALITIES, PEOPLE } from '../../data/mockData';
import { X, Building } from 'lucide-react';

export default function NewPropertyModal() {
  const { propertyModalOpen, setPropertyModalOpen, addProperty } = useCRM();

  const [title, setTitle] = useState('');
  const [loc, setLoc] = useState(LOCALITIES[0]);
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Apartment');
  const [bhk, setBhk] = useState('3');
  const [sqft, setSqft] = useState('2100');
  const [facing, setFacing] = useState('East');
  const [agent, setAgent] = useState('VM');
  const [desc, setDesc] = useState('');

  if (!propertyModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price) return;

    addProperty({
      title,
      loc,
      price: parseFloat(price) * 100000, // convert Lakhs to INR
      type,
      bhk: parseInt(bhk),
      sqft: parseInt(sqft),
      facing,
      agent,
      desc: desc || 'Newly listed prime residential property.'
    });

    setTitle('');
    setPrice('');
    setPropertyModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 animate-fade-in">
      <div
        onClick={() => setPropertyModalOpen(false)}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-50 text-brand-700 rounded-lg">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Inventory Listing</h2>
              <p className="text-xs text-slate-500">Publish a new property to the portfolio</p>
            </div>
          </div>

          <button
            onClick={() => setPropertyModalOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
              Property Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Adyar Promenade #7B"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
                Locality
              </label>
              <select
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                {LOCALITIES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
                List Price (₹ Lakhs) *
              </label>
              <input
                type="number"
                required
                placeholder="250 for ₹2.5 Cr"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
                BHK
              </label>
              <select
                value={bhk}
                onChange={(e) => setBhk(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5 BHK</option>
                <option value="0">Plot</option>
              </select>
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
                Area (Sqft)
              </label>
              <input
                type="number"
                placeholder="2100"
                value={sqft}
                onChange={(e) => setSqft(e.target.value)}
                className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
                Facing
              </label>
              <select
                value={facing}
                onChange={(e) => setFacing(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                <option value="East">East</option>
                <option value="North">North</option>
                <option value="North-East">North-East</option>
                <option value="South-East">South-East</option>
              </select>
            </div>

            <div>
              <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
                Listing Advisor
              </label>
              <select
                value={agent}
                onChange={(e) => setAgent(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-brand-600 focus:outline-none"
              >
                {Object.entries(PEOPLE).map(([key, p]) => (
                  <option key={key} value={key}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-mono font-bold text-slate-600 uppercase mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Key architectural highlights and amenities..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-600 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPropertyModalOpen(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-sm"
            >
              Publish Property
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
