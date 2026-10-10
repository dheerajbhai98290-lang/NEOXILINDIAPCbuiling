import React, { useState, useEffect } from 'react';
import { Settings, Building2, CreditCard, ShieldCheck, Save, CheckCircle2 } from 'lucide-react';
import { CompanySettings, BankDetails } from '../types.ts';

interface SettingsViewProps {
  company: CompanySettings | null;
  bank: BankDetails | null;
  onUpdateCompany: (data: Partial<CompanySettings>) => Promise<void>;
  onUpdateBank: (data: Partial<BankDetails>) => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  company,
  bank,
  onUpdateCompany,
  onUpdateBank,
}) => {
  const [activeTab, setActiveTab] = useState<'company' | 'bank' | 'invoice'>('company');
  const [savedMessage, setSavedMessage] = useState('');

  // Company Form State
  const [companyName, setCompanyName] = useState(company?.companyName || 'NEOXILINDIA');
  const [tagline, setTagline] = useState(company?.tagline || 'Billing & Business Management');
  const [gstin, setGstin] = useState(company?.gstin || '');
  const [phone, setPhone] = useState(company?.phone || '');
  const [email, setEmail] = useState(company?.email || '');
  const [address, setAddress] = useState(company?.address || '');
  const [state, setState] = useState(company?.state || '');
  const [invoicePrefix, setInvoicePrefix] = useState(company?.invoicePrefix || 'INV-');
  const [nextInvoiceNumber, setNextInvoiceNumber] = useState(company?.nextInvoiceNumber || 1);
  const [purchasePrefix, setPurchasePrefix] = useState(company?.purchasePrefix || 'PUR-');
  const [nextPurchaseNumber, setNextPurchaseNumber] = useState(company?.nextPurchaseNumber || 1);
  const [defaultInvoiceSize, setDefaultInvoiceSize] = useState<any>(
    company?.defaultInvoiceSize || 'A5_LANDSCAPE'
  );
  const [termsAndConditions, setTermsAndConditions] = useState(
    company?.termsAndConditions || '1. Goods once sold will not be accepted back.\n2. Payment terms: Due upon receipt.\n3. Subject to local jurisdiction.'
  );

  // Bank Form State (Blank by default per PRD Section 8)
  const [bankName, setBankName] = useState(bank?.bankName || '');
  const [accountHolderName, setAccountHolderName] = useState(bank?.accountHolderName || '');
  const [accountNumber, setAccountNumber] = useState(bank?.accountNumber || '');
  const [ifscCode, setIfscCode] = useState(bank?.ifscCode || '');
  const [branch, setBranch] = useState(bank?.branch || '');
  const [upiId, setUpiId] = useState(bank?.upiId || '');

  useEffect(() => {
    if (company) {
      setCompanyName(company.companyName || 'NEOXILINDIA');
      setTagline(company.tagline || 'Billing & Business Management');
      setGstin(company.gstin || '');
      setPhone(company.phone || '');
      setEmail(company.email || '');
      setAddress(company.address || '');
      setState(company.state || '');
      setInvoicePrefix(company.invoicePrefix || 'INV-');
      setNextInvoiceNumber(company.nextInvoiceNumber || 1);
      setPurchasePrefix(company.purchasePrefix || 'PUR-');
      setNextPurchaseNumber(company.nextPurchaseNumber || 1);
      setDefaultInvoiceSize(company.defaultInvoiceSize || 'A5_LANDSCAPE');
      setTermsAndConditions(company.termsAndConditions || '');
    }
  }, [company]);

  useEffect(() => {
    if (bank) {
      setBankName(bank.bankName || '');
      setAccountHolderName(bank.accountHolderName || '');
      setAccountNumber(bank.accountNumber || '');
      setIfscCode(bank.ifscCode || '');
      setBranch(bank.branch || '');
      setUpiId(bank.upiId || '');
    }
  }, [bank]);

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateCompany({
      companyName,
      tagline,
      gstin,
      phone,
      email,
      address,
      state,
      invoicePrefix,
      nextInvoiceNumber,
      purchasePrefix,
      nextPurchaseNumber,
      defaultInvoiceSize,
      termsAndConditions,
    });
    setSavedMessage('Company settings saved successfully.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateBank({
      bankName,
      accountHolderName,
      accountNumber,
      ifscCode,
      branch,
      upiId,
      paymentQrImage: '',
    });
    setSavedMessage('Bank details updated successfully.');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            System &amp; Business Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure NEOXILINDIA legal business profile, paper size preferences, and banking credentials.
          </p>
        </div>

        {savedMessage && (
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>{savedMessage}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('company')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
            activeTab === 'company'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Company Profile</span>
        </button>
        <button
          onClick={() => setActiveTab('bank')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
            activeTab === 'bank'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Bank &amp; Payment Details</span>
        </button>
        <button
          onClick={() => setActiveTab('invoice')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${
            activeTab === 'invoice'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Invoice &amp; Print Settings</span>
        </button>
      </div>

      {/* Tab: Company Profile */}
      {activeTab === 'company' && (
        <form onSubmit={handleSaveCompany} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white font-bold"
              />
              <span className="text-[10px] text-slate-500">
                Preserved owner company name (PRD Section 7)
              </span>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Tagline / Subheading</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">GSTIN</label>
              <input
                type="text"
                value={gstin}
                onChange={e => setGstin(e.target.value.toUpperCase())}
                placeholder="e.g. 08XXXXX0000X1ZX"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white uppercase"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Full Factory / Office Address</label>
              <textarea
                rows={3}
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">State / Jurisdiction</label>
              <input
                type="text"
                value={state}
                onChange={e => setState(e.target.value)}
                placeholder="e.g. Rajasthan (State Code: 08)"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition shadow"
            >
              <Save className="w-4 h-4" />
              <span>Save Company Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Bank Details (Blank by default per PRD Section 8) */}
      {activeTab === 'bank' && (
        <form onSubmit={handleSaveBank} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300">
            <strong>PRD Section 8 Mandate:</strong> Bank details must remain completely blank unless explicitly entered by the Administrator. No sample bank or fake payment QR codes are ever generated automatically.
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                placeholder="Leave blank if not sharing bank info"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Account Holder Name</label>
              <input
                type="text"
                value={accountHolderName}
                onChange={e => setAccountHolderName(e.target.value)}
                placeholder="e.g. NEOXILINDIA"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                placeholder="Enter bank account number"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">IFSC Code</label>
              <input
                type="text"
                value={ifscCode}
                onChange={e => setIfscCode(e.target.value.toUpperCase())}
                placeholder="e.g. SBIN0001234"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white uppercase"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={e => setBranch(e.target.value)}
                placeholder="Branch name"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={e => setUpiId(e.target.value)}
              placeholder="e.g. neoxilindia@upi"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition shadow"
            >
              <Save className="w-4 h-4" />
              <span>Update Bank Details</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab: Invoice & Print Settings */}
      {activeTab === 'invoice' && (
        <form onSubmit={handleSaveCompany} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 block mb-1">
                Default Invoice Paper Size (PRD Section 9)
              </label>
              <select
                value={defaultInvoiceSize}
                onChange={e => setDefaultInvoiceSize(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-medium"
              >
                <option value="A5_LANDSCAPE">A5 Landscape (Default Standard)</option>
                <option value="A5_PORTRAIT">A5 Portrait</option>
                <option value="A4_PORTRAIT">A4 Portrait</option>
                <option value="A4_LANDSCAPE">A4 Landscape</option>
              </select>
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Invoice Numbering Prefix</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={invoicePrefix}
                  onChange={e => setInvoicePrefix(e.target.value)}
                  className="w-28 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
                <input
                  type="number"
                  min="1"
                  value={nextInvoiceNumber}
                  onChange={e => setNextInvoiceNumber(Number(e.target.value))}
                  className="w-24 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-500">
                Next generated invoice will be #{invoicePrefix}
                {String(nextInvoiceNumber).padStart(4, '0')}
              </span>
            </div>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">
              Standard Terms &amp; Conditions (Printed on Invoice)
            </label>
            <textarea
              rows={4}
              value={termsAndConditions}
              onChange={e => setTermsAndConditions(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg font-semibold flex items-center space-x-1.5 transition shadow"
            >
              <Save className="w-4 h-4" />
              <span>Save Print &amp; Invoice Settings</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
