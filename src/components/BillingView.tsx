import React, { useState } from 'react';
import {
  Plus,
  Printer,
  Trash2,
  Eye,
  FileText,
  Search,
  CheckCircle,
  AlertCircle,
  Calculator,
} from 'lucide-react';
import { Invoice, Customer, Product, CompanySettings, BankDetails } from '../types.ts';
import { InvoicePrintModal } from './InvoicePrintModal.tsx';

interface BillingViewProps {
  invoices: Invoice[];
  customers: Customer[];
  products: Product[];
  company: CompanySettings | null;
  bank: BankDetails | null;
  onCreateInvoice: (data: any) => Promise<void>;
  onDeleteInvoice: (id: string) => Promise<void>;
  onRefresh: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  invoices,
  customers,
  products,
  company,
  bank,
  onCreateInvoice,
  onDeleteInvoice,
  onRefresh,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // New Invoice Form State
  const defaultPrefix = company?.invoicePrefix || 'INV-';
  const defaultNum = company?.nextInvoiceNumber || 1;
  const initialInvNum = `${defaultPrefix}${String(defaultNum).padStart(4, '0')}`;

  const [invoiceNumber, setInvoiceNumber] = useState(initialInvNum);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerId, setCustomerId] = useState('');
  const [paperSize, setPaperSize] = useState<'A5_LANDSCAPE' | 'A5_PORTRAIT' | 'A4_PORTRAIT' | 'A4_LANDSCAPE' | 'CUSTOM'>(
    company?.defaultInvoiceSize || 'A5_LANDSCAPE'
  );
  const [notes, setNotes] = useState('');
  const [paidAmount, setPaidAmount] = useState<number>(0);

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

  // Add Item to Invoice Form
  const [selectedProduct, setSelectedProduct] = useState('');
  const [itemQty, setItemQty] = useState<number>(1);
  const [itemRate, setItemRate] = useState<number>(0);
  const [itemTaxRate, setItemTaxRate] = useState<number>(18);
  const [itemHsn, setItemHsn] = useState('');
  const [itemUnit, setItemUnit] = useState('Pcs');

  const handleProductChange = (prodId: string) => {
    setSelectedProduct(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod) {
      setItemRate(prod.salePrice || 0);
      setItemTaxRate(prod.taxRate || 18);
      setItemHsn(prod.hsnCode || '');
      setItemUnit(prod.unit || 'Pcs');
    }
  };

  const addItemToInvoice = () => {
    const prod = products.find(p => p.id === selectedProduct);
    const prodName = prod ? prod.name : 'Custom Item';
    const sub = itemQty * itemRate;
    const tax = (sub * itemTaxRate) / 100;
    const total = sub + tax;

    setItems(prev => [
      ...prev,
      {
        productId: selectedProduct || 'CUSTOM-' + Date.now(),
        productName: prodName,
        hsnCode: itemHsn,
        quantity: itemQty,
        unit: itemUnit,
        rate: itemRate,
        taxRate: itemTaxRate,
        taxAmount: tax,
        total: total,
      },
    ]);

    // reset item inputs
    setSelectedProduct('');
    setItemQty(1);
    setItemRate(0);
    setItemHsn('');
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((sum, it) => sum + it.quantity * it.rate, 0);
  const taxTotal = items.reduce((sum, it) => sum + it.taxAmount, 0);
  const rawGrandTotal = subtotal + taxTotal;
  const grandTotal = Math.round(rawGrandTotal);
  const roundOff = grandTotal - rawGrandTotal;
  const dueAmount = grandTotal - paidAmount;

  const handleSubmitInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) {
      alert('Please select a customer.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one line item to the invoice.');
      return;
    }

    const customer = customers.find(c => c.id === customerId);

    const payload = {
      invoiceNumber,
      date,
      dueDate,
      customerId,
      customerName: customer ? customer.name : 'Customer',
      customerGstin: customer?.gstin || '',
      customerPhone: customer?.phone || '',
      customerAddress: customer?.address || '',
      items,
      subtotal,
      taxTotal,
      cgst: taxTotal / 2,
      sgst: taxTotal / 2,
      igst: 0,
      roundOff,
      grandTotal,
      paidAmount,
      paperSize,
      notes,
    };

    await onCreateInvoice(payload);
    setShowCreateModal(false);
    // Reset form
    setItems([]);
    setPaidAmount(0);
    setNotes('');
  };

  const filteredInvoices = invoices.filter(
    inv =>
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Billing &amp; Tax Invoices
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, manage, and print GST compliant tax invoices. Default size:{' '}
            <span className="text-indigo-400 font-medium">A5 Landscape</span>.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Invoice</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by invoice number or customer name..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
        />
        <span className="text-xs text-slate-500 shrink-0">
          Total Invoices: {invoices.length}
        </span>
      </div>

      {/* Invoices Table or Clean Empty State */}
      {invoices.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">0 Invoices in Database</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            All demo invoices (INV-DEMO-001, etc.) have been completely removed. Start issuing genuine business invoices from invoice #1.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition inline-flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Generate First Invoice</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Invoice No</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3 text-right">Items</th>
                  <th className="p-3 text-right">Grand Total</th>
                  <th className="p-3 text-right">Due Amount</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-center">Paper</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-semibold text-white">
                      #{inv.invoiceNumber}
                    </td>
                    <td className="p-3 text-slate-400">{inv.date}</td>
                    <td className="p-3 font-medium text-slate-200">
                      {inv.customerName}
                    </td>
                    <td className="p-3 text-right text-slate-400">
                      {inv.items?.length || 0}
                    </td>
                    <td className="p-3 text-right font-bold text-white">
                      ₹{inv.grandTotal.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-medium text-rose-400">
                      ₹{inv.dueAmount.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          inv.paymentStatus === 'Paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : inv.paymentStatus === 'Partial'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 text-center text-slate-400 text-[10px]">
                      {inv.paperSize.replace('_', ' ')}
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        title="Print / View"
                        className="p-1.5 text-indigo-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteInvoice(inv.id)}
                        title="Delete Invoice"
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

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-bold text-sm sm:text-base">
                Create Sales Invoice
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleSubmitInvoice} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Row 1: Invoice metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Invoice Number</label>
                  <input
                    type="text"
                    required
                    value={invoiceNumber}
                    onChange={e => setInvoiceNumber(e.target.value)}
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
                  <label className="text-slate-400 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Paper Layout</label>
                  <select
                    value={paperSize}
                    onChange={e => setPaperSize(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="A5_LANDSCAPE">A5 Landscape (Default)</option>
                    <option value="A5_PORTRAIT">A5 Portrait</option>
                    <option value="A4_PORTRAIT">A4 Portrait</option>
                    <option value="A4_LANDSCAPE">A4 Landscape</option>
                  </select>
                </div>
              </div>

              {/* Customer Selector */}
              <div>
                <label className="text-slate-400 block mb-1">Customer</label>
                {customers.length === 0 ? (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300">
                    No customers found in database. Please create a customer first in the Customers module.
                  </div>
                ) : (
                  <select
                    required
                    value={customerId}
                    onChange={e => setCustomerId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="">-- Select Customer --</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.city ? `(${c.city})` : ''} - Bal: ₹{c.currentBalance.toFixed(2)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Line Items Builder */}
              <div className="border border-slate-800 rounded-xl p-3 bg-slate-950/60 space-y-3">
                <div className="font-semibold text-slate-300 flex items-center justify-between">
                  <span>Invoice Items</span>
                  <span className="text-[11px] text-slate-500">{items.length} items added</span>
                </div>

                {/* Add Item inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-6 gap-2 items-end">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 block mb-0.5">Select Product</label>
                    <select
                      value={selectedProduct}
                      onChange={e => handleProductChange(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                    >
                      <option value="">-- Choose Product --</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name} (Stock: {p.currentStock} {p.unit})
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
                    <label className="text-[10px] text-slate-400 block mb-0.5">Rate (₹)</label>
                    <input
                      type="number"
                      value={itemRate}
                      onChange={e => setItemRate(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">GST %</label>
                    <select
                      value={itemTaxRate}
                      onChange={e => setItemTaxRate(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-white"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={addItemToInvoice}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded font-semibold transition"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Items list */}
                {items.length > 0 && (
                  <table className="w-full text-[11px] text-left border border-slate-800 rounded">
                    <thead className="bg-slate-800 text-slate-400">
                      <tr>
                        <th className="p-2">Item</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2 text-right">Rate</th>
                        <th className="p-2 text-right">GST</th>
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
                          <td className="p-2 text-right">{it.taxRate}%</td>
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

              {/* Invoice Totals & Payment */}
              <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block mb-1">Notes / Terms</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Payment terms, delivery note, etc."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (GST):</span>
                    <span>₹{taxTotal.toFixed(2)}</span>
                  </div>
                  {roundOff !== 0 && (
                    <div className="flex justify-between text-slate-400">
                      <span>Round Off:</span>
                      <span>₹{roundOff.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-slate-700">
                    <span>Grand Total:</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span>Received Amount (₹):</span>
                    <input
                      type="number"
                      value={paidAmount}
                      onChange={e => setPaidAmount(Number(e.target.value))}
                      className="w-24 bg-slate-800 border border-slate-700 rounded p-1 text-right text-white font-semibold"
                    />
                  </div>
                  <div className="flex justify-between font-semibold text-rose-400">
                    <span>Balance Due:</span>
                    <span>₹{dueAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition shadow"
                >
                  Save &amp; Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Print Modal */}
      {selectedInvoice && (
        <InvoicePrintModal
          invoice={selectedInvoice}
          company={company}
          bank={bank}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
