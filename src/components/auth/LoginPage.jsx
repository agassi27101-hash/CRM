import React, { useState } from 'react';
import { useCRM } from '../../context/CRMContext';
import {
  Crown,
  Briefcase,
  UserCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function LoginPage() {
  const { login, DEMO_USERS } = useCRM();

  const [selectedRole, setSelectedRole] = useState('director');
  const [email, setEmail] = useState('board@meridianestates.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleRoleSelect = (usr) => {
    setSelectedRole(usr.role);
    setEmail(usr.email);
    setPassword(usr.password);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#03140F] flex items-center justify-center relative overflow-hidden font-inter text-slate-100 selection:bg-gold-500 selection:text-brand-950 p-4 sm:p-6">
      {/* Ambient Luxury Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-gold-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Centered Login Box */}
      <div className="max-w-md w-full relative z-10 my-auto">
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative">
          
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center pb-5 border-b border-slate-800">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-gold-600 flex items-center justify-center shadow-glow text-brand-950 font-extrabold text-2xl tracking-tighter shrink-0 mb-3">
              M
            </div>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Meridian Group CRM
            </h1>
            <p className="text-[11px] text-gold-400 font-mono tracking-wider mt-0.5 uppercase">
              Enterprise Real Estate Workspace
            </p>
          </div>

          {/* 1-Click Role Switcher Badges */}
          <div className="mt-5 space-y-2">
            <label className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-400">
              Select User Profile / Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_USERS.map((u) => {
                const isSelected = selectedRole === u.role;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleRoleSelect(u)}
                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-brand-600/90 border-gold-400 shadow-md text-white ring-1 ring-gold-400/50'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`w-6 h-6 rounded-lg text-[10px] font-extrabold flex items-center justify-center ${
                        isSelected ? 'bg-gold-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.avatar}
                      </span>
                      {u.role === 'director' && <Crown className={`w-3.5 h-3.5 ${isSelected ? 'text-gold-300' : 'text-slate-600'}`} />}
                      {u.role === 'manager' && <Briefcase className={`w-3.5 h-3.5 ${isSelected ? 'text-gold-300' : 'text-slate-600'}`} />}
                      {u.role === 'agent' && <UserCheck className={`w-3.5 h-3.5 ${isSelected ? 'text-gold-300' : 'text-slate-600'}`} />}
                    </div>
                    <div className="mt-2">
                      <div className="font-bold text-xs truncate text-white">{u.name}</div>
                      <div className={`text-[9px] font-mono truncate ${isSelected ? 'text-gold-200' : 'text-slate-500'}`}>
                        {u.badge}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                Corporate Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@meridianestates.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-white text-xs font-roboto placeholder:text-slate-600 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[10px] font-mono font-extrabold uppercase tracking-wider text-slate-400">
                  Security Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[10px] font-mono text-gold-400 hover:text-gold-300 underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none text-white text-xs font-roboto placeholder:text-slate-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-[11px]">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-950 border-slate-700 text-brand-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember this workstation</span>
              </label>
              <span className="text-[10px] font-mono text-slate-500">
                Auto-logout: 8h
              </span>
            </div>

            {/* Submit Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-brand-950/50 flex items-center justify-center gap-2 cursor-pointer group disabled:opacity-70 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to CRM Console</span>
                  <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Security Footer Note */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> End-to-End Encrypted
            </span>
            <span>256-Bit SSL</span>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-extrabold text-white">Reset Security Access</h3>
            <p className="text-xs text-slate-400 font-open-sans">
              Enter your corporate email address to receive password recovery instructions and a secure one-time token.
            </p>

            {forgotSent ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 rounded-xl text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Reset Link Dispatched
                </div>
                <div>Instructions sent to <strong>{forgotEmail || email}</strong>.</div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-[10px] font-mono uppercase text-slate-400">Corporate Email</label>
                <input
                  type="email"
                  value={forgotEmail || email}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@meridianestates.com"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSent(false);
                }}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close
              </button>
              {!forgotSent && (
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="px-4 py-2 bg-brand-600 text-white rounded-xl font-bold text-xs hover:bg-brand-500 cursor-pointer"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
