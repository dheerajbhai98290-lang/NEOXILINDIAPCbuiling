import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  ShoppingBag,
  Users,
  Truck,
  Package,
  Layers,
  Wallet,
  RotateCcw,
  Settings,
  ShieldCheck,
  Menu,
  X,
  PlusCircle,
  Database,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from './components/Navbar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { BillingView } from './components/BillingView.tsx';
import { PurchasesView } from './components/PurchasesView.tsx';
import { CustomersView } from './components/CustomersView.tsx';
import { SuppliersView } from './components/SuppliersView.tsx';
import { ProductsView } from './components/ProductsView.tsx';
import { ProductionView } from './components/ProductionView.tsx';
import { AccountingView } from './components/AccountingView.tsx';
import { ReturnsView } from './components/ReturnsView.tsx';
import { SettingsView } from './components/SettingsView.tsx';
import { ResetAuditView } from './components/ResetAuditView.tsx';
import { MobileFrameWrapper } from './components/MobileFrameWrapper.tsx';
import {
  CompanySettings,
  BankDetails,
  DashboardStats,
  Customer,
  Supplier,
  Product,
  Invoice,
  PurchaseBill,
  Expense,
  PaymentRecord,
  ProductionBatch,
  BillOfMaterials,
  WastageRecord,
  ReturnRecord,
} from './types.ts';
import { api } from './services/api.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [viewMode, setViewMode] = useState<'windows' | 'android'>('windows');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Core State
  const [company, setCompany] = useState<CompanySettings | null>(null);
  const [bank, setBank] = useState<BankDetails | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [purchases, setPurchases] = useState<PurchaseBill[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [productionBatches, setProductionBatches] = useState<ProductionBatch[]>([]);
  const [boms, setBoms] = useState<BillOfMaterials[]>([]);
  const [wastageRecords, setWastageRecords] = useState<WastageRecord[]>([]);
  const [returns, setReturns] = useState<{ salesReturns: ReturnRecord[]; purchaseReturns: ReturnRecord[] }>({
    salesReturns: [],
    purchaseReturns: [],
  });
  const [dbStatus, setDbStatus] = useState<any>(null);

  // Fetch all live data from central API
  const refreshAllData = async () => {
    try {
      const [
        statusRes,
        companyRes,
        bankRes,
        statsRes,
        customersRes,
        suppliersRes,
        productsRes,
        invoicesRes,
        purchasesRes,
        expensesRes,
        paymentsRes,
        productionRes,
        bomsRes,
        wastageRes,
        returnsRes,
      ] = await Promise.all([
        api.getStatus().catch(() => null),
        api.getCompanySettings().catch(() => null),
        api.getBankDetails().catch(() => null),
        api.getDashboardStats().catch(() => null),
        api.getCustomers().catch(() => []),
        api.getSuppliers().catch(() => []),
        api.getProducts().catch(() => []),
        api.getInvoices().catch(() => []),
        api.getPurchases().catch(() => []),
        api.getExpenses().catch(() => []),
        api.getPayments().catch(() => []),
        api.getProduction().catch(() => []),
        api.getBoms().catch(() => []),
        api.getWastage().catch(() => []),
        api.getReturns().catch(() => ({ salesReturns: [], purchaseReturns: [] })),
      ]);

      setDbStatus(statusRes);
      setCompany(companyRes);
      setBank(bankRes);
      setStats(statsRes);
      setCustomers(customersRes || []);
      setSuppliers(suppliersRes || []);
      setProducts(productsRes || []);
      setInvoices(invoicesRes || []);
      setPurchases(purchasesRes || []);
      setExpenses(expensesRes || []);
      setPayments(paymentsRes || []);
      setProductionBatches(productionRes || []);
      setBoms(bomsRes || []);
      setWastageRecords(wastageRes || []);
      setReturns(returnsRes || { salesReturns: [], purchaseReturns: [] });
    } catch (err) {
      console.error('Error fetching system data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleQuickAction = (action: 'invoice' | 'purchase' | 'customer' | 'product') => {
    if (action === 'invoice') setActiveTab('billing');
    else if (action === 'purchase') setActiveTab('purchases');
    else if (action === 'customer') setActiveTab('customers');
    else if (action === 'product') setActiveTab('products');
  };

  // Nav items list
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'billing', label: 'Billing & Invoices', icon: FileText, badge: invoices.length },
    { id: 'purchases', label: 'Purchases & Inward', icon: ShoppingBag, badge: purchases.length },
    { id: 'customers', label: 'Customers Ledger', icon: Users, badge: customers.length },
    { id: 'suppliers', label: 'Suppliers Ledger', icon: Truck, badge: suppliers.length },
    { id: 'products', label: 'Products & Inventory', icon: Package, badge: products.length },
    { id: 'production', label: 'Production & Scrap', icon: Layers },
    { id: 'accounting', label: 'Cash & Bank Ledger', icon: Wallet },
    { id: 'returns', label: 'Credit / Debit Notes', icon: RotateCcw },
    { id: 'settings', label: 'Settings & Bank', icon: Settings },
    { id: 'reset_audit', label: 'Reset Audit (PRD)', icon: ShieldCheck, highlight: true },
  ];

  // Render view router
  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            stats={stats}
            onNavigate={tab => setActiveTab(tab)}
            onQuickAction={handleQuickAction}
          />
        );
      case 'billing':
        return (
          <BillingView
            invoices={invoices}
            customers={customers}
            products={products}
            company={company}
            bank={bank}
            onCreateInvoice={async data => {
              await api.createInvoice(data);
              await refreshAllData();
            }}
            onDeleteInvoice={async id => {
              await api.deleteInvoice(id);
              await refreshAllData();
            }}
            onRefresh={refreshAllData}
          />
        );
      case 'purchases':
        return (
          <PurchasesView
            purchases={purchases}
            suppliers={suppliers}
            products={products}
            company={company}
            onCreatePurchase={async data => {
              await api.createPurchase(data);
              await refreshAllData();
            }}
            onDeletePurchase={async id => {
              await api.deletePurchase(id);
              await refreshAllData();
            }}
          />
        );
      case 'customers':
        return (
          <CustomersView
            customers={customers}
            onCreateCustomer={async data => {
              await api.createCustomer(data);
              await refreshAllData();
            }}
            onUpdateCustomer={async (id, data) => {
              await api.updateCustomer(id, data);
              await refreshAllData();
            }}
            onDeleteCustomer={async id => {
              await api.deleteCustomer(id);
              await refreshAllData();
            }}
          />
        );
      case 'suppliers':
        return (
          <SuppliersView
            suppliers={suppliers}
            onCreateSupplier={async data => {
              await api.createSupplier(data);
              await refreshAllData();
            }}
            onUpdateSupplier={async (id, data) => {
              await api.updateSupplier(id, data);
              await refreshAllData();
            }}
            onDeleteSupplier={async id => {
              await api.deleteSupplier(id);
              await refreshAllData();
            }}
          />
        );
      case 'products':
        return (
          <ProductsView
            products={products}
            onCreateProduct={async data => {
              await api.createProduct(data);
              await refreshAllData();
            }}
            onUpdateProduct={async (id, data) => {
              await api.updateProduct(id, data);
              await refreshAllData();
            }}
            onDeleteProduct={async id => {
              await api.deleteProduct(id);
              await refreshAllData();
            }}
          />
        );
      case 'production':
        return (
          <ProductionView
            batches={productionBatches}
            boms={boms}
            wastage={wastageRecords}
            products={products}
            onCreateBatch={async data => {
              await api.createProduction(data);
              await refreshAllData();
            }}
            onCreateBom={async data => {
              await api.createBom(data);
              await refreshAllData();
            }}
            onCreateWastage={async data => {
              await api.createWastage(data);
              await refreshAllData();
            }}
            onDeleteBatch={async id => {
              await api.deleteProduction(id);
              await refreshAllData();
            }}
            onDeleteWastage={async id => {
              await api.deleteWastage(id);
              await refreshAllData();
            }}
          />
        );
      case 'accounting':
        return (
          <AccountingView
            expenses={expenses}
            payments={payments}
            customers={customers}
            suppliers={suppliers}
            stats={stats}
            onCreateExpense={async data => {
              await api.createExpense(data);
              await refreshAllData();
            }}
            onCreatePayment={async data => {
              await api.createPayment(data);
              await refreshAllData();
            }}
            onDeleteExpense={async id => {
              await api.deleteExpense(id);
              await refreshAllData();
            }}
            onDeletePayment={async id => {
              await api.deletePayment(id);
              await refreshAllData();
            }}
          />
        );
      case 'returns':
        return (
          <ReturnsView
            salesReturns={returns.salesReturns}
            purchaseReturns={returns.purchaseReturns}
            customers={customers}
            suppliers={suppliers}
            onCreateReturn={async data => {
              await api.createReturn(data);
              await refreshAllData();
            }}
          />
        );
      case 'settings':
        return (
          <SettingsView
            company={company}
            bank={bank}
            onUpdateCompany={async data => {
              await api.updateCompanySettings(data);
              await refreshAllData();
            }}
            onUpdateBank={async data => {
              await api.updateBankDetails(data);
              await refreshAllData();
            }}
          />
        );
      case 'reset_audit':
        return <ResetAuditView onRefreshAll={refreshAllData} />;
      default:
        return (
          <DashboardView
            stats={stats}
            onNavigate={tab => setActiveTab(tab)}
            onQuickAction={handleQuickAction}
          />
        );
    }
  };

  const mainContent = (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        company={company}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onRefresh={refreshAllData}
        onQuickAction={handleQuickAction}
        dbStatus={dbStatus}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar (Windows View) */}
        <aside
          className={`w-64 bg-slate-900 border-r border-slate-800 shrink-0 flex flex-col justify-between select-none ${
            sidebarOpen ? 'block fixed inset-y-0 left-0 z-50 shadow-2xl' : 'hidden lg:flex'
          }`}
        >
          <div className="p-3 space-y-1 overflow-y-auto">
            {sidebarOpen && (
              <div className="flex justify-between items-center px-3 py-2 lg:hidden border-b border-slate-800 mb-2">
                <span className="font-bold text-white text-sm">NEOXILINDIA ERP</span>
                <button onClick={() => setSidebarOpen(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Operations &amp; Billing
            </div>

            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : item.highlight
                      ? 'bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40 border border-emerald-800/40'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {typeof item.badge === 'number' && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                        isActive
                          ? 'bg-indigo-700 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800/80 bg-slate-900/90 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Database:</span>
              <span className="text-emerald-400 font-mono">Central SQLite/JSON</span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Mode:</span>
              <span className="text-indigo-400 font-bold">Zero-Data Ready</span>
            </div>
            <div className="pt-1 text-[10px] text-slate-500 text-center">
              NEOXILINDIA v1.0 Clean
            </div>
          </div>
        </aside>

        {/* Mobile menu trigger bar (on small screens) */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-slate-900 border-t border-slate-800 p-2 z-30 flex items-center justify-around text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center p-1 ${
              activeTab === 'dashboard' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex flex-col items-center p-1 ${
              activeTab === 'billing' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Invoices</span>
          </button>
          <button
            onClick={() => setActiveTab('purchases')}
            className={`flex flex-col items-center p-1 ${
              activeTab === 'purchases' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Purchases</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex flex-col items-center p-1 ${
              activeTab === 'products' ? 'text-indigo-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Items</span>
          </button>
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center p-1 text-slate-400"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">More</span>
          </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-400 text-xs">
              <div className="text-center space-y-2">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Connecting to NEOXILINDIA central database...</p>
              </div>
            </div>
          ) : (
            renderCurrentView()
          )}
        </main>
      </div>
    </div>
  );

  // If user selected Android view mode, wrap in Android mobile phone device simulator (PRD Section 11)
  if (viewMode === 'android') {
    return (
      <MobileFrameWrapper onExitMobile={() => setViewMode('windows')}>
        {mainContent}
      </MobileFrameWrapper>
    );
  }

  return mainContent;
}
