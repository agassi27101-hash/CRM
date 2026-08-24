import React from 'react';
import { useCRM } from '../../context/CRMContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts } = useCRM();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium border transition-all duration-300 animate-fade-in ${
            t.type === 'success'
              ? 'bg-brand-900 text-white border-brand-700 shadow-brand-900/20'
              : t.type === 'warning'
              ? 'bg-amber-900 text-amber-50 border-amber-700'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}
        >
          {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />}
          {t.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
          <div className="flex-1 leading-snug">{t.message}</div>
        </div>
      ))}
    </div>
  );
}
