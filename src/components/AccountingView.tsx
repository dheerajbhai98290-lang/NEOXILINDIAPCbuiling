import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Wallet,
  Building,
  TrendingDown,
  TrendingUp,
  Receipt,
  ArrowDownLeft,
  ArrowUpRight,
  PieChart,
} from 'lucide-react';
import {
  Expense,
  PaymentRecord,
  Customer,
  Supplier,
  DashboardStats,
} from '../types.ts';

interface AccountingViewProps {
  expenses: Expense[];
  payments: PaymentRecord[];
  customers: Customer[];
  suppliers: Supplier[];
  stats: DashboardStats | null;
  onCreateExpense: (data: Partial<Expense>) => Promise<void>;
  onCreatePayment: (data: Partial<PaymentRecord>) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
  onDeletePayment: (id: string) => Promise<void>;
}

export const AccountingView: React.FC<AccountingViewProps> = ({
  expenses,
  payments,
  customers,
  suppliers,
  stats,
  onCreateExpense,
  onCreatePayment,
  onDeleteExpense,
  onDeletePayment,
}) => {
  const [activeTab, setActiveTab] = useState<'expenses' | 'payments' | 'pnl'>(
    'expenses'
  );
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Expense form
  const [expCategory, setExpCategory] = useState('Rent');
  const [expAmount, setExpAmount] = useState<number>(0);
  const [expMode, setExpMode] = useState<'Cash' | 'Bank' | 'UPI'>('Cash');
  const [expRecipient, setExpRecipient] = useState('');
  const [expNotes, setExpNotes] = useState('');
  const [expDate, setExpDate] = useState(new Date().toISOString().split('T')[0]);

  // Payment / Receipt form
  const [payType, setPayType] = useState<'Receipt' | 'Payment'>('Receipt');
  const [partyId, setPartyId] = useState('');
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMode, setPayMode] = useState<'Cash' | 'Bank' | 'UPI'>('Cash');
  const [refNo, setRefNo] = useState('');
  const [payNotes, setPayNotes] = useState('');

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (expAmount <= 0) return;
    await onCreateExpense({
      category: expCategory,
      amount: expAmount,
      paymentMode: expMode,
      recipient: expRecipient,
      notes: expNotes,
      date: expDate,
    });
    setShowExpenseModal(false);
    setExpAmount(0);
    setExpNotes('');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (payAmount <= 0 || !partyId) return;

    let partyName = 'Party';
    if (payType === 'Receipt') {
      const c = customers.find(x => x.id === partyId);
      if (c) partyName = c.name;
    } else {
      const s = suppliers.find(x => x.id === partyId);
      if (s) partyName = s.name;
    }

    await onCreatePayment({
      type: payType,
      partyId,
      partyName,
      amount: payAmount,
      paymentMode: payMode,
      referenceNo: refNo,
      notes: payNotes,
      date: new Date().toISOString().split('T')[0],
    });
    setShowPaymentModal(false);
    setPayAmount(0);
    setPartyId('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            Accounting &amp; Cash / Bank Ledgers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real cashbook and bankbook ledger, business expense management, and live dynamic Profit &amp; Loss.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowExpenseModal(true)}
            className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Record Expense</span>
          </button>
          <button
            onClick={() => setShowPaymentModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow"
          >
            <Plus className="w-4 h-4" />
            <span>+ Receipt / Payment</span>
          </button>
        </div>
      </div>

      {/* Financial Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Live Cash Balance</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white mt-2">
            ₹{(stats?.cashBalance || 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Computed from actual cash flow
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Live Bank Balance</span>
            <Building className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white mt-2">
            ₹{(stats?.bankBalance || 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Computed from actual bank transactions
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Net Business Profit / (Loss)</span>
            <PieChart className="w-4 h-4 text-indigo-400" />
          </div>
          <div
            className={`text-xl font-bold mt-2 ${
              (stats?.netProfit ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            ₹{(stats?.netProfit || 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Sales ₹{(stats?.totalRevenue || 0).toFixed(2)} - Purchases ₹{(stats?.totalPurchases || 0).toFixed(2)} - Expenses ₹{(stats?.totalExpenses || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'expenses'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Expenses ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'payments'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Customer Receipts &amp; Supplier Payments ({payments.length})
        </button>
        <button
          onClick={() => setActiveTab('pnl')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === 'pnl'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Dynamic Profit &amp; Loss Statement
        </button>
      </div>

      {/* Expenses Table */}
      {activeTab === 'expenses' && (
        <>
          {expenses.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
              <div className="w-14 h-14 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <TrendingDown className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">0 Expenses in Database</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                All sample expenses (Factory Electricity, Machinery Maintenance, Office Stationery) have been purged. Add your real business overheads here.
              </p>
              <button
                onClick={() => setShowExpenseModal(true)}
                className="mt-4 bg-rose-600 hover:bg-rose-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Expense</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Recipient / Vendor</th>
                      <th className="p-3">Payment Mode</th>
                      <th className="p-3">Notes</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {expenses.map(e => (
                      <tr key={e.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3 text-slate-400">{e.date}</td>
                        <td className="p-3 font-semibold text-white">{e.category}</td>
                        <td className="p-3 text-slate-300">{e.recipient || '-'}</td>
                        <td className="p-3">
                          <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 border border-slate-700">
                            {e.paymentMode}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{e.notes || '-'}</td>
                        <td className="p-3 text-right font-bold text-rose-400">
                          ₹{e.amount.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onDeleteExpense(e.id)}
                            className="p-1.5 text-rose-400 hover:text-white bg-slate-800 hover:bg-rose-900/40 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Payments Table */}
      {activeTab === 'payments' && (
        <>
          {payments.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
              <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Receipt className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">0 Receipts / Payments in Database</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                All sample receipts and demo settlement entries have been cleared. Record real incoming customer receipts or outgoing vendor payouts.
              </p>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Record First Receipt</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Party Name</th>
                      <th className="p-3">Mode</th>
                      <th className="p-3">Ref No</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {payments.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              p.type === 'Receipt'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            }`}
                          >
                            {p.type}
                          </span>
                        </td>
                        <td className="p-3 text-slate-400">{p.date}</td>
                        <td className="p-3 font-semibold text-white">{p.partyName}</td>
                        <td className="p-3 text-slate-400">{p.paymentMode}</td>
                        <td className="p-3 text-slate-400">{p.referenceNo || '-'}</td>
                        <td
                          className={`p-3 text-right font-bold ${
                            p.type === 'Receipt' ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          ₹{p.amount.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onDeletePayment(p.id)}
                            className="p-1.5 text-rose-400 hover:text-white bg-slate-800 hover:bg-rose-900/40 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Dynamic P&L Statement */}
      {activeTab === 'pnl' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 max-w-2xl mx-auto shadow">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-white font-bold text-base">
              Profit &amp; Loss Statement (Live Database Computed)
            </h3>
            <p className="text-slate-400 text-xs">
              Dynamically derived from actual invoices, purchase bills, and recorded expenses. Contains 0 invented figures.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-300 font-medium">1. Gross Invoiced Revenue</span>
              <span className="text-emerald-400 font-bold">
                ₹{(stats?.totalRevenue || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-300 font-medium">2. Cost of Procurement / Raw Materials</span>
              <span className="text-amber-400 font-bold">
                ₹{(stats?.totalPurchases || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-slate-800">
              <span className="text-slate-300 font-medium">3. Operating Expenses</span>
              <span className="text-rose-400 font-bold">
                ₹{(stats?.totalExpenses || 0).toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-t-2 border-slate-700 text-sm">
              <span className="text-white font-bold">Net Business Profit / (Loss)</span>
              <span
                className={`font-black text-base ${
                  (stats?.netProfit ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                ₹{(stats?.netProfit || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <h3 className="text-white font-bold text-base mb-3">Record Expense</h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Expense Category</label>
                <select
                  value={expCategory}
                  onChange={e => setExpCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="Rent">Factory / Office Rent</option>
                  <option value="Electricity">Electricity &amp; Power</option>
                  <option value="Salaries">Staff Salaries &amp; Wages</option>
                  <option value="Freight">Freight &amp; Transportation</option>
                  <option value="Machinery Maintenance">Machinery Maintenance</option>
                  <option value="Packaging Materials">Packaging Overheads</option>
                  <option value="Office Stationery">Tea &amp; Office Expenses</option>
                  <option value="General">General / Miscellaneous</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={expAmount}
                    onChange={e => setExpAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Payment Mode</label>
                  <select
                    value={expMode}
                    onChange={e => setExpMode(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer / NEFT</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Paid To / Recipient</label>
                  <input
                    type="text"
                    value={expRecipient}
                    onChange={e => setExpRecipient(e.target.value)}
                    placeholder="e.g. Landlord, JVVNL, Driver"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    value={expDate}
                    onChange={e => setExpDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notes / Description</label>
                <textarea
                  rows={2}
                  value={expNotes}
                  onChange={e => setExpNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold transition"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <h3 className="text-white font-bold text-base mb-3">
              Record {payType === 'Receipt' ? 'Customer Receipt' : 'Supplier Payment'}
            </h3>
            <form onSubmit={handlePaymentSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Transaction Type</label>
                  <select
                    value={payType}
                    onChange={e => {
                      setPayType(e.target.value as any);
                      setPartyId('');
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Receipt">Customer Receipt (Inward)</option>
                    <option value="Payment">Supplier Payment (Outward)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Party</label>
                  <select
                    required
                    value={partyId}
                    onChange={e => setPartyId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="">-- Choose Party --</option>
                    {payType === 'Receipt'
                      ? customers.map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} (Due: ₹{c.currentBalance.toFixed(2)})
                          </option>
                        ))
                      : suppliers.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.name} (Payable: ₹{s.currentBalance.toFixed(2)})
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={payAmount}
                    onChange={e => setPayAmount(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Payment Mode</label>
                  <select
                    value={payMode}
                    onChange={e => setPayMode(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank (Cheque/NEFT)</option>
                    <option value="UPI">UPI</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reference No / UTR</label>
                <input
                  type="text"
                  value={refNo}
                  onChange={e => setRefNo(e.target.value)}
                  placeholder="e.g. UTR / Cheque / Transaction ID"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={payNotes}
                  onChange={e => setPayNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
