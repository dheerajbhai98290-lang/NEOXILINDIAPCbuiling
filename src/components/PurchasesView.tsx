import React, { useState } from 'react';
import { Plus, Trash2, ShoppingBag, Search, FileText } from 'lucide-react';
import { PurchaseBill, Supplier, Product, CompanySettings } from '../types.ts';

interface PurchasesViewProps {
  purchases: PurchaseBill[];
  suppliers: Supplier[];
  products: Product[];
  company: CompanySettings | null;
  onCreatePurchase: (data: any) => Promise<void>;
  onDeletePurchase: (id: string) => Promise<void>;
}

export const PurchasesView: React.FC<PurchasesViewProps> = ({
  purchases,
  suppliers,
  products,
  company,
  onCreatePurchase,
  onDeletePurchase,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultPrefix = company?.purchasePrefix || 'PUR-';
  const defaultNum = company?.nextPurchaseNumber || 1;
  const initialBillNum = `${defaultPrefix}${String(defaultNum).padStart(4, '0')}`;

  const [billNumber, setBillNumber] = useState(initialBillNum);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [supplierId, setSupplierId] = useState('');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Line items
  const [items, setItems] = useState<
    {
      productId: string;
      productName: string;
      hsnCode: string;
      quantity: number;
      unit: string;
      rate: number;
      taxRate: number;
      taxAmount: number;
      total: number;
    }[]
  >([]);

  const [selectedProduct, setSelectedProduct] = useState('');
  const [itemQty, setItemQty] = useState<number>(1);
  const [itemRate, setItemRate] = useState<number>(0);
  const [itemTaxRate, setItemTaxRate] = useState<number>(18);
  const [itemUnit, setItemUnit] = useState('Pcs');
  const [itemHsn, setItemHsn] = useState('');

  const handleProductChange = (prodId: string) => {
    setSelectedProduct(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setItemRate(prod.purchasePrice || 0);
      setItemTaxRate(prod.taxRate || 18);
      setItemUnit(prod.unit || 'Pcs');
      setItemHsn(prod.hsnCode || '');
    }
  };

  const addItem = () => {
    const prod = products.find(p => p.id === selectedProduct);
    const prodName = prod ? prod.name : 'Raw Material';
    const sub = itemQty * itemRate;
    const tax = (sub * itemTaxRate) / 100;
    const total = sub + tax;

    setItems(prev => [
      ...prev,
      {
        productId: selectedProduct || 'ITEM-' + Date.now(),
        productName: prodName,
        hsnCode: itemHsn,
        quantity: itemQty,
        unit: itemUnit,
        rate: itemRate,
        taxRate: itemTaxRate,
        taxAmount: tax,
        total,
      },
    ]);

    setSelectedProduct('');
    setItemQty(1);
    setItemRate(0);
  };

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.rate, 0);
  const taxTotal = items.reduce((sum, it) => sum + it.taxAmount, 0);
  const grandTotal = subtotal + taxTotal;
  const dueAmount = grandTotal - paidAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplierId) {
      alert('Please select a supplier.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one line item.');
      return;
    }

    const supplier = suppliers.find(s => s.id === supplierId);

    const payload = {
      billNumber,
      date,
      supplierId,
      supplierName: supplier ? supplier.name : 'Supplier',
      supplierGstin: supplier?.gstin || '',
      items,
      subtotal,
      taxTotal,
      grandTotal,
      paidAmount,
      dueAmount,
      notes,
    };

    await onCreatePurchase(payload);
    setShowModal(false);
    setItems([]);
    setPaidAmount(0);
  };

  const filteredPurchases = purchases.filter(
    p =>
      p.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            Purchases &amp; Material Inward
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Record supplier purchase bills. Received quantities automatically increase inventory stock.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ Record Purchase Bill</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by bill number or supplier name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
        />
        <span className="text-xs text-slate-500 shrink-0">
          Total Bills: {purchases.length}
        </span>
      </div>

      {/* Table or Empty State */}
      {purchases.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">0 Purchase Bills in Database</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            All demo purchase records have been completely cleared. Record genuine procurement bills here to track raw materials and supplier outstandings.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition inline-flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Record First Purchase</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Bill No</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Supplier</th>
                  <th className="p-3 text-right">Items</th>
                  <th className="p-3 text-right">Grand Total</th>
                  <th className="p-3 text-right">Balance Due</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredPurchases.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-semibold text-white">#{p.billNumber}</td>
                    <td className="p-3 text-slate-400">{p.date}</td>
                    <td className="p-3 font-medium text-slate-200">{p.supplierName}</td>
                    <td className="p-3 text-right text-slate-400">{p.items?.length || 0}</td>
                    <td className="p-3 text-right font-bold text-white">
                      ₹{p.grandTotal.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-medium text-rose-400">
                      ₹{p.dueAmount.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          p.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : p.paymentStatus === 'Partial'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onDeletePurchase(p.id)}
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

      {/* Create Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm sm:text-base">
                Record Purchase Bill
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Bill Number</label>
                  <input
                    type="text"
                    required
                    value={billNumber}
                    onChange={e => setBillNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Supplier</label>
                  <select
                    required
                    value={supplierId}
                    onChange={e => setSupplierId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="">-- Choose Supplier --</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name} - Bal: ₹{s.currentBalance.toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items */}
              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60 space-y-3">
                <div className="font-semibold text-slate-300">Materials / Items Received</div>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Product / Material</label>
                    <select
                      value={selectedProduct}
                      onChange={e => handleProductChange(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                    >
                      <option value="">-- Choose Item --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={itemQty}
                      onChange={e => setItemQty(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">Purchase Rate (₹)</label>
                    <input
                      type="number"
                      value={itemRate}
                      onChange={e => setItemRate(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={addItem}
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white p-1.5 rounded font-semibold transition"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {items.length > 0 && (
                  <table className="w-full text-[11px] text-left border border-slate-800 rounded">
                    <thead className="bg-slate-800 text-slate-400">
                      <tr>
                        <th className="p-2">Item</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2 text-right">Rate</th>
                        <th className="p-2 text-right">Total</th>
                        <th className="p-2 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2 font-medium text-white">{it.productName}</td>
                          <td className="p-2 text-right">
                            {it.quantity} {it.unit}
                          </td>
                          <td className="p-2 text-right">₹{it.rate.toFixed(2)}</td>
                          <td className="p-2 text-right font-bold text-white">
                            ₹{it.total.toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(idx)}
                              className="text-rose-400 hover:text-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 flex justify-between items-center text-slate-300">
                <span className="font-bold text-sm text-white">Grand Total: ₹{grandTotal.toFixed(2)}</span>
                <div className="flex items-center space-x-2">
                  <span>Paid Now (₹):</span>
                  <input
                    type="number"
                    value={paidAmount}
                    onChange={e => setPaidAmount(Number(e.target.value))}
                    className="w-24 bg-slate-800 border border-slate-700 rounded p-1 text-right text-white font-semibold"
                  />
                </div>
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
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-semibold transition shadow"
                >
                  Save Purchase Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
