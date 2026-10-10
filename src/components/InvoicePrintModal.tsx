import React, { useState } from 'react';
import { X, Printer, Check, Copy } from 'lucide-react';
import { Invoice, CompanySettings, BankDetails } from '../types.ts';

interface InvoicePrintModalProps {
  invoice: Invoice;
  company: CompanySettings | null;
  bank: BankDetails | null;
  onClose: () => void;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  invoice,
  company,
  bank,
  onClose,
}) => {
  const [paperSize, setPaperSize] = useState<string>(
    invoice.paperSize || company?.defaultInvoiceSize || 'A5_LANDSCAPE'
  );

  const handlePrint = () => {
    window.print();
  };

  const hasConfiguredBank = Boolean(
    bank?.bankName?.trim() && bank?.accountNumber?.trim()
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[96vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Controls Bar (hidden during printing) */}
        <div className="no-print p-4 bg-slate-800 border-b border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <span className="text-white font-bold text-sm sm:text-base">
              Invoice Print &amp; Preview: #{invoice.invoiceNumber}
            </span>
            <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setPaperSize('A5_LANDSCAPE')}
                className={`px-2 py-1 rounded transition ${
                  paperSize === 'A5_LANDSCAPE'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                A5 Landscape (Default)
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('A5_PORTRAIT')}
                className={`px-2 py-1 rounded transition ${
                  paperSize === 'A5_PORTRAIT'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                A5 Portrait
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('A4_PORTRAIT')}
                className={`px-2 py-1 rounded transition ${
                  paperSize === 'A4_PORTRAIT'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                A4 Portrait
              </button>
              <button
                type="button"
                onClick={() => setPaperSize('A4_LANDSCAPE')}
                className={`px-2 py-1 rounded transition ${
                  paperSize === 'A4_LANDSCAPE'
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                A4 Landscape
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-950 flex justify-center items-start">
          <div
            id="printable-invoice"
            className={`bg-white text-black p-6 sm:p-8 shadow-xl border border-slate-300 w-full transition-all ${
              paperSize === 'A5_LANDSCAPE'
                ? 'max-w-[780px] min-h-[520px]'
                : paperSize === 'A5_PORTRAIT'
                ? 'max-w-[540px] min-h-[760px]'
                : paperSize === 'A4_LANDSCAPE'
                ? 'max-w-[1000px] min-h-[700px]'
                : 'max-w-[800px] min-h-[1050px]'
            }`}
          >
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black tracking-wider text-slate-900 uppercase">
                    {company?.companyName || 'NEOXILINDIA'}
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    {company?.tagline || 'Billing & Business Management'}
                  </p>
                  <p className="text-xs text-slate-700 mt-1 max-w-sm whitespace-pre-line">
                    {company?.address || 'Address: As configured in settings'}
                  </p>
                  <div className="text-xs text-slate-700 mt-1 flex flex-wrap gap-x-3">
                    {company?.phone && <span>Ph: {company.phone}</span>}
                    {company?.email && <span>Email: {company.email}</span>}
                    {company?.gstin && <span className="font-bold">GSTIN: {company.gstin}</span>}
                    {company?.state && <span>State: {company.state}</span>}
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-block bg-slate-900 text-white font-bold text-xs uppercase px-3 py-1 rounded tracking-wide mb-1">
                    Tax Invoice
                  </span>
                  <div className="text-sm font-bold text-slate-900">
                    #{invoice.invoiceNumber}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Date: <span className="font-semibold">{invoice.date}</span>
                  </div>
                  {invoice.dueDate && (
                    <div className="text-xs text-slate-600">
                      Due: <span>{invoice.dueDate}</span>
                    </div>
                  )}
                  <div className="mt-1">
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        invoice.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : invoice.paymentStatus === 'Partial'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {invoice.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To Info */}
            <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-4">
              <div className="text-[11px] font-bold uppercase text-slate-500 mb-1">
                Bill To (Customer Details)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-800">
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    {invoice.customerName}
                  </div>
                  {invoice.customerAddress && (
                    <div className="text-slate-600 mt-0.5">{invoice.customerAddress}</div>
                  )}
                </div>
                <div className="sm:text-right">
                  {invoice.customerGstin && (
                    <div>
                      <span className="font-semibold">GSTIN:</span> {invoice.customerGstin}
                    </div>
                  )}
                  {invoice.customerPhone && (
                    <div>
                      <span className="font-semibold">Phone:</span> {invoice.customerPhone}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs text-left border-collapse border border-slate-300 mb-4">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 w-10 text-center">#</th>
                  <th className="p-2 border-r border-slate-300">Item Description</th>
                  <th className="p-2 border-r border-slate-300 text-center w-20">HSN</th>
                  <th className="p-2 border-r border-slate-300 text-right w-16">Qty</th>
                  <th className="p-2 border-r border-slate-300 text-right w-20">Rate (₹)</th>
                  <th className="p-2 border-r border-slate-300 text-right w-16">GST %</th>
                  <th className="p-2 text-right w-24">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-slate-200">
                    <td className="p-2 border-r border-slate-300 text-center text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="p-2 border-r border-slate-300 font-semibold text-slate-900">
                      {item.productName}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-center text-slate-600">
                      {item.hsnCode || '-'}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right">
                      {item.rate.toFixed(2)}
                    </td>
                    <td className="p-2 border-r border-slate-300 text-right">
                      {item.taxRate}%
                    </td>
                    <td className="p-2 text-right font-medium text-slate-900">
                      {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals & Tax Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              {/* Bank Details & QR (PRD Section 8 - Blank by default, no fake QR) */}
              <div className="border border-slate-200 rounded p-3 text-xs bg-slate-50 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-slate-800 uppercase text-[11px] mb-1">
                    Bank &amp; Payment Details
                  </div>
                  {hasConfiguredBank ? (
                    <div className="space-y-0.5 text-slate-700">
                      <div>
                        <span className="font-semibold">Bank Name:</span> {bank?.bankName}
                      </div>
                      <div>
                        <span className="font-semibold">A/c Holder:</span> {bank?.accountHolderName}
                      </div>
                      <div>
                        <span className="font-semibold">A/c No:</span> {bank?.accountNumber}
                      </div>
                      <div>
                        <span className="font-semibold">IFSC Code:</span> {bank?.ifscCode}
                      </div>
                      {bank?.branch && (
                        <div>
                          <span className="font-semibold">Branch:</span> {bank?.branch}
                        </div>
                      )}
                      {bank?.upiId && (
                        <div>
                          <span className="font-semibold">UPI ID:</span> {bank?.upiId}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-2 bg-slate-100 rounded text-slate-500 italic text-[11px]">
                      Bank details not configured.
                      <span className="block text-[10px] text-slate-400 not-italic mt-0.5">
                        (Configure genuine bank information in Settings &gt; Bank Details)
                      </span>
                    </div>
                  )}
                </div>

                {invoice.notes && (
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-700">Notes: </span>
                    <span className="text-slate-600">{invoice.notes}</span>
                  </div>
                )}
              </div>

              {/* Financial Calculation Column */}
              <div className="border border-slate-200 rounded p-3 text-xs bg-slate-50 space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{invoice.subtotal.toFixed(2)}</span>
                </div>
                {invoice.cgst > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>CGST:</span>
                    <span>₹{invoice.cgst.toFixed(2)}</span>
                  </div>
                )}
                {invoice.sgst > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>SGST:</span>
                    <span>₹{invoice.sgst.toFixed(2)}</span>
                  </div>
                )}
                {invoice.igst > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>IGST:</span>
                    <span>₹{invoice.igst.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Total Tax:</span>
                  <span>₹{invoice.taxTotal.toFixed(2)}</span>
                </div>
                {invoice.roundOff !== 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>Round Off:</span>
                    <span>₹{invoice.roundOff.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-300">
                  <span>Grand Total:</span>
                  <span>₹{invoice.grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700 pt-1">
                  <span>Paid Amount:</span>
                  <span>₹{invoice.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-rose-700">
                  <span>Balance Due:</span>
                  <span>₹{invoice.dueAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Terms & Signatory */}
            <div className="border-t border-slate-300 pt-3 flex justify-between items-end text-xs">
              <div className="text-[10px] text-slate-600 max-w-sm whitespace-pre-line">
                <div className="font-bold text-slate-800 uppercase mb-0.5">
                  Terms &amp; Conditions
                </div>
                {company?.termsAndConditions ||
                  '1. Goods once sold will not be taken back.\n2. Payment due on presentation.'}
              </div>

              <div className="text-right">
                <div className="text-slate-700 text-xs font-semibold mb-6">
                  For {company?.companyName || 'NEOXILINDIA'}
                </div>
                <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-500 font-medium">
                  Authorized Signatory
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
