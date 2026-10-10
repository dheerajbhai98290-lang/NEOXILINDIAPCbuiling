import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  Truck,
  Package,
  Layers,
  Trash2,
  Wallet,
  Building,
  Target,
  ArrowUpRight,
  PlusCircle,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { DashboardStats } from '../types.ts';

interface DashboardViewProps {
  stats: DashboardStats | null;
  onNavigate: (tab: string) => void;
  onQuickAction: (action: 'invoice' | 'purchase' | 'customer' | 'product') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onNavigate,
  onQuickAction,
}) => {
  const formatCurrency = (val: number | undefined) => {
    const num = Number(val) || 0;
    return `₹${num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const hasAnyData =
    (stats?.totalRevenue ?? 0) > 0 ||
    (stats?.totalPurchases ?? 0) > 0 ||
    (stats?.totalExpenses ?? 0) > 0 ||
    (stats?.activeCustomersCount ?? 0) > 0 ||
    (stats?.activeSuppliersCount ?? 0) > 0 ||
    (stats?.activeProductsCount ?? 0) > 0;

  return (
    <div className="space-y-6">
      {/* Zero-Data Clean Verification Banner */}
      <div className="bg-gradient-to-r from-emerald-900/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-white font-bold text-base sm:text-lg">
                NEOXILINDIA — Clean Business Operations Active
              </h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-500/30">
                PRD v1.0 Compliant
              </span>
            </div>
            <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
              All demo customers (Jaipur Wholesale Mart, etc.), sample invoices, and fake balances have been safely removed. Every metric is computed strictly from live database records.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigate('reset_audit')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg font-medium transition"
          >
            View Reset Audit Report
          </button>
          <button
            onClick={() => onQuickAction('invoice')}
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg font-medium transition shadow-sm flex items-center space-x-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create First Invoice</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (Mandated by PRD Section 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sales */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Today's Sales</span>
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {formatCurrency(stats?.todaySales)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Monthly: {formatCurrency(stats?.monthlySales)}</span>
            <span className="text-slate-500">Live DB</span>
          </div>
        </div>

        {/* Today's Purchases */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Today's Purchases</span>
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {formatCurrency(stats?.todayPurchases)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Total: {formatCurrency(stats?.totalPurchases)}</span>
            <span className="text-slate-500">Live DB</span>
          </div>
        </div>

        {/* Today's Expenses */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Today's Expenses</span>
            <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-bold text-white tracking-tight">
            {formatCurrency(stats?.todayExpenses)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Total: {formatCurrency(stats?.totalExpenses)}</span>
            <span className="text-slate-500">Live DB</span>
          </div>
        </div>

        {/* Net Profit / Loss */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Net Profit / (Loss)</span>
            <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`mt-2 text-2xl font-bold tracking-tight ${
              (stats?.netProfit ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {formatCurrency(stats?.netProfit)}
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Sales - Purchases - Expenses</span>
            <span className="text-slate-500">Computed</span>
          </div>
        </div>
      </div>

      {/* Secondary Financial & Inventory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Customer Outstanding */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Customer Outstanding</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {formatCurrency(stats?.customerOutstanding)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Active Customers: {stats?.activeCustomersCount ?? 0}
          </p>
        </div>

        {/* Supplier Outstanding */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Supplier Outstanding</span>
            <Truck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {formatCurrency(stats?.supplierOutstanding)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Active Suppliers: {stats?.activeSuppliersCount ?? 0}
          </p>
        </div>

        {/* Cash Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Cash Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {formatCurrency(stats?.cashBalance)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Calculated from cash receipts &amp; payments
          </p>
        </div>

        {/* Bank Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Bank Balance</span>
            <Building className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {formatCurrency(stats?.bankBalance)}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Calculated from bank receipts &amp; payments
          </p>
        </div>
      </div>

      {/* Production & Inventory Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Finished Goods Stock */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Finished Goods Stock</span>
            <Package className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {stats?.finishedGoodsStock ?? 0}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Total products: {stats?.activeProductsCount ?? 0}
          </p>
        </div>

        {/* Raw Material Stock */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Raw Material Stock</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {stats?.rawMaterialStock ?? 0}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Units in stock</p>
        </div>

        {/* Production Quantity */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Production Quantity</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-white">
            {stats?.productionQuantity ?? 0}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Batch output total</p>
        </div>

        {/* Sales Target */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Sales Target</span>
            <Target className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-base font-bold text-slate-300">
            {stats?.salesTargetAchievement || 'Not configured'}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Set by Administrator</p>
        </div>
      </div>

      {/* Mandatory Empty State Banner (PRD Section 4) */}
      {!hasAnyData && (
        <div className="bg-slate-900 border border-dashed border-slate-700 rounded-2xl p-8 sm:p-12 text-center">
          <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Zero-Data Business Baseline Ready
          </h3>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mt-2 leading-relaxed">
            "No business data available. Add your first customer, product, purchase, or sales invoice to get started."
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onQuickAction('customer')}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2.5 rounded-lg border border-slate-700 font-medium transition flex items-center space-x-1.5"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span>1. Add First Customer</span>
            </button>
            <button
              onClick={() => onQuickAction('product')}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2.5 rounded-lg border border-slate-700 font-medium transition flex items-center space-x-1.5"
            >
              <Package className="w-4 h-4 text-emerald-400" />
              <span>2. Add First Product / Raw Material</span>
            </button>
            <button
              onClick={() => onQuickAction('purchase')}
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-4 py-2.5 rounded-lg border border-slate-700 font-medium transition flex items-center space-x-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>3. Record First Purchase</span>
            </button>
            <button
              onClick={() => onQuickAction('invoice')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2.5 rounded-lg font-medium transition shadow-md flex items-center space-x-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>4. Issue First Sales Invoice</span>
            </button>
          </div>
        </div>
      )}

      {/* Quick Launchpad & Operational Guide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          onClick={() => onNavigate('billing')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition">
              <FileText className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
          </div>
          <h4 className="text-white font-semibold text-sm mt-3">
            Billing &amp; GST Invoicing
          </h4>
          <p className="text-slate-400 text-xs mt-1">
            Print invoices in A5 Landscape (default), A5 Portrait, A4 with dynamic GST slabs, HSN, and instant thermal/PDF print.
          </p>
        </div>

        <div
          onClick={() => onNavigate('production')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg group-hover:bg-amber-500/20 transition">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
          </div>
          <h4 className="text-white font-semibold text-sm mt-3">
            Manufacturing &amp; Production
          </h4>
          <p className="text-slate-400 text-xs mt-1">
            Bill of Materials (BOM), production batch tracking, raw material consumption, and wastage scrap recording.
          </p>
        </div>

        <div
          onClick={() => onNavigate('accounting')}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-xl cursor-pointer transition group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20 transition">
              <Wallet className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
          </div>
          <h4 className="text-white font-semibold text-sm mt-3">
            Accounting, Cash &amp; Bank
          </h4>
          <p className="text-slate-400 text-xs mt-1">
            Real customer receipts, supplier payments, categorized expense vouchers, and live dynamic Profit &amp; Loss ledger.
          </p>
        </div>
      </div>
    </div>
  );
};
