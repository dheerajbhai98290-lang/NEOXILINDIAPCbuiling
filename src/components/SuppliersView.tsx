import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Truck, Search } from 'lucide-react';
import { Supplier } from '../types.ts';

interface SuppliersViewProps {
  suppliers: Supplier[];
  onCreateSupplier: (data: Partial<Supplier>) => Promise<void>;
  onUpdateSupplier: (id: string, data: Partial<Supplier>) => Promise<void>;
  onDeleteSupplier: (id: string) => Promise<void>;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  onCreateSupplier,
  onUpdateSupplier,
  onDeleteSupplier,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [openingBalance, setOpeningBalance] = useState<number>(0);

  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setGstin('');
    setAddress('');
    setCity('');
    setState('');
    setOpeningBalance(0);
    setEditingId(null);
  };

  const handleEdit = (s: Supplier) => {
    setEditingId(s.id);
    setName(s.name);
    setPhone(s.phone);
    setEmail(s.email);
    setGstin(s.gstin);
    setAddress(s.address);
    setCity(s.city);
    setState(s.state);
    setOpeningBalance(s.openingBalance);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      await onUpdateSupplier(editingId, {
        name,
        phone,
        email,
        gstin,
        address,
        city,
        state,
        openingBalance,
      });
    } else {
      await onCreateSupplier({
        name,
        phone,
        email,
        gstin,
        address,
        city,
        state,
        openingBalance,
      });
    }

    setShowModal(false);
    resetForm();
  };

  const filtered = suppliers.filter(
    s =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-purple-400" />
            Suppliers &amp; Vendors Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage raw material vendors, supplier contracts, GSTIN details, and accounts payable.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Supplier</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search supplier by name or phone..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
        />
        <span className="text-xs text-slate-500 shrink-0">
          Total Suppliers: {suppliers.length}
        </span>
      </div>

      {/* Table or Empty State */}
      {suppliers.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Truck className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">0 Suppliers in Database</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            All demo supplier entries have been removed. Add your genuine suppliers and vendors here to start recording purchase bills.
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="mt-4 bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition inline-flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Supplier</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Supplier Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">City / State</th>
                  <th className="p-3">GSTIN</th>
                  <th className="p-3 text-right">Opening Bal</th>
                  <th className="p-3 text-right">Current Payable</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-semibold text-white">{s.name}</td>
                    <td className="p-3 text-slate-400">{s.phone || '-'}</td>
                    <td className="p-3 text-slate-300">
                      {s.city || s.state ? `${s.city || ''} ${s.state || ''}` : '-'}
                    </td>
                    <td className="p-3 text-slate-400">{s.gstin || '-'}</td>
                    <td className="p-3 text-right text-slate-400">
                      ₹{s.openingBalance.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-bold text-rose-400">
                      ₹{s.currentBalance.toFixed(2)}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => handleEdit(s)}
                        className="p-1.5 text-purple-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSupplier(s.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-5 shadow-2xl">
            <h3 className="text-white font-bold text-base mb-3">
              {editingId ? 'Edit Supplier' : 'Add New Supplier'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Supplier / Company Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Modern Plastics Corp"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">GSTIN (Optional)</label>
                <input
                  type="text"
                  value={gstin}
                  onChange={e => setGstin(e.target.value.toUpperCase())}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={e => setState(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Opening Balance (₹)</label>
                <input
                  type="number"
                  value={openingBalance}
                  onChange={e => setOpeningBalance(Number(e.target.value))}
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
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-semibold transition"
                >
                  {editingId ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
