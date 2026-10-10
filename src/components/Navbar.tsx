import React from 'react';
import {
  Building2,
  ShieldCheck,
  Smartphone,
  Monitor,
  RefreshCw,
  PlusCircle,
  FileText,
  UserPlus,
  PackagePlus,
  CheckCircle2,
} from 'lucide-react';
import { CompanySettings } from '../types.ts';

interface NavbarProps {
  company: CompanySettings | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  viewMode: 'windows' | 'android';
  setViewMode: (mode: 'windows' | 'android') => void;
  onRefresh: () => void;
  onQuickAction: (action: 'invoice' | 'purchase' | 'customer' | 'product') => void;
  dbStatus: { counts?: any; bankConfigured?: boolean } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  company,
  activeTab,
  setActiveTab,
  viewMode,
  setViewMode,
  onRefresh,
  onQuickAction,
  dbStatus,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Company Title */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg tracking-wider text-white">
                  {company?.companyName || 'NEOXILINDIA'}
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  Zero-Data Initialized
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Billing &amp; Business Management ERP
              </p>
            </div>
          </div>

          {/* Quick Actions & Device Switcher */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Cross-Device Consistency Simulator (PRD Section 11) */}
            <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex items-center space-x-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode('windows')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition ${
                  viewMode === 'windows'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Windows Desktop Layout"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Windows (Desktop)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('android')}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition ${
                  viewMode === 'android'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Android Mobile Layout"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Android (Mobile)</span>
              </button>
            </div>

            {/* Quick Action Buttons */}
            <div className="hidden lg:flex items-center space-x-1">
              <button
                onClick={() => onQuickAction('invoice')}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg flex items-center space-x-1 transition shadow-sm font-medium"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>+ Sales Invoice</span>
              </button>
              <button
                onClick={() => onQuickAction('customer')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-1 transition"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Customer</span>
              </button>
              <button
                onClick={() => onQuickAction('product')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 flex items-center space-x-1 transition"
              >
                <PackagePlus className="w-3.5 h-3.5" />
                <span>+ Product</span>
              </button>
            </div>

            {/* Refresh DB Button */}
            <button
              onClick={onRefresh}
              title="Sync Central Database"
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Zero Reset Audit Link */}
            <button
              onClick={() => setActiveTab('reset_audit')}
              className={`text-xs px-2.5 py-1.5 rounded-lg border flex items-center space-x-1 transition font-medium ${
                activeTab === 'reset_audit'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : 'bg-emerald-950/40 text-emerald-300 border-emerald-800 hover:bg-emerald-900/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Audit Report</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
