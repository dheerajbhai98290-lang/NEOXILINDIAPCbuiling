import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Search, FileText } from 'lucide-react';
import { ReturnRecord, Customer, Supplier } from '../types.ts';

interface ReturnsViewProps {
  salesReturns: ReturnRecord[];
  purchaseReturns: ReturnRecord[];
  customers: Customer[];
  suppliers: Supplier[];
  onCreateReturn: (data: any) => Promise<void>;
}

export const ReturnsView: React.FC<ReturnsViewProps> = ({
  salesReturns,
  purchaseReturns,
  customers,
  suppliers,
  onCreateReturn,
}) => {
  const [tab, setTab] = useState<'credit' | 'debit'>('credit');
  const [showModal, setShowModal] = useState(false);

  const [referenceNumber, setReferenceNumber] = useState('');
  const [partyId, setPartyId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [reason, setReason] = useState('Damaged goods / Specification mismatch');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || !partyId) return;

    let partyName = 'Party';
    if (tab === 'credit') {
      const c = customers.find(x => x.id === partyId);
      if (c) partyName = c.name;
    } else {
      const s = suppliers.find(x => x.id === partyId);
      if (s) partyName = s.name;
    }

    await onCreateReturn({
      type: tab === 'credit' ? 'Credit Note' : 'Debit Note',
      referenceNumber: referenceNumber || `${tab === 'credit' ? 'CN' : 'DN'}-${Date.now().toString().slice(-4)}`,
      partyId,
      partyName,
      amount,
      reason,
      date: new Date().toISOString().split('T')[0],
    });

    setShowModal(false);
    setAmount(0);
    setReferenceNumber('');
  };

  const records = tab === 'credit' ? salesReturns : purchaseReturns;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-indigo-400" />
            Returns &amp; Credit / Debit Notes
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage sales returns (Credit Notes) and purchase returns (Debit Notes) with zero sample entries.
          </p>
        </div>

        <button
          onClick={() => {
            setReferenceNumber(`${tab === 'credit' ? 'CN' : 'DN'}-${Date.now().toString().slice(-4)}`);
            setShowModal(true);
          }}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ Issue {tab === 'credit' ? 'Credit Note' : 'Debit Note'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setTab('credit')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            tab === 'credit'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Sales Returns / Credit Notes ({salesReturns.length})
        </button>
        <button
          onClick={() => setTab('debit')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            tab === 'debit'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Purchase Returns / Debit Notes ({purchaseReturns.length})
        </button>
      </div>

      {/* Table or Empty State */}
      {records.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <RotateCcw className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">
            0 {tab === 'credit' ? 'Credit Notes' : 'Debit Notes'} in Database
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            All sample return notes have been wiped out. Issue real credit or debit notes when products are returned.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Note No</th>
                <th className="p-3">Date</th>
                <th className="p-3">Party Name</th>
                <th className="p-3">Reason</th>
                <th className="p-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {records.map(r => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-semibold text-white">#{r.referenceNumber}</td>
                  <td className="p-3 text-slate-400">{r.date}</td>
                  <td className="p-3 font-medium text-slate-200">{r.partyName}</td>
                  <td className="p-3 text-slate-400">{r.reason}</td>
                  <td className="p-3 text-right font-bold text-indigo-400">
                    ₹{r.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <h3 className="text-white font-bold text-base mb-3">
              Issue {tab === 'credit' ? 'Credit Note (Sales Return)' : 'Debit Note (Purchase Return)'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Reference / Note #</label>
                <input
                  type="text"
                  required
                  value={referenceNumber}
                  onChange={e => setReferenceNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">
                  {tab === 'credit' ? 'Customer' : 'Supplier'}
                </label>
                <select
                  required
                  value={partyId}
                  onChange={e => setPartyId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="">-- Choose Party --</option>
                  {tab === 'credit'
                    ? customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))
                    : suppliers.map(s => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Return Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={e => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason</label>
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition"
                >
                  Save Return Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
