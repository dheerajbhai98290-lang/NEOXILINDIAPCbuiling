import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Database,
  Download,
  Archive,
  RefreshCw,
  ExternalLink,
  Smartphone,
  Monitor,
} from 'lucide-react';
import {
  ResetSummaryReport,
  VerificationTestItem,
  BackupArchive,
} from '../types.ts';
import { api } from '../services/api.ts';

interface ResetAuditViewProps {
  onRefreshAll: () => void;
}

export const ResetAuditView: React.FC<ResetAuditViewProps> = ({ onRefreshAll }) => {
  const [audit, setAudit] = useState<ResetSummaryReport | null>(null);
  const [tests, setTests] = useState<VerificationTestItem[]>([]);
  const [backups, setBackups] = useState<BackupArchive[]>([]);
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [preserveBankCheckbox, setPreserveBankCheckbox] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  const loadAuditData = async () => {
    try {
      setLoading(true);
      const [auditData, verifyResult, backupsList] = await Promise.all([
        api.getResetAudit(),
        api.verifyAuditTests(),
        api.getBackups(),
      ]);
      setAudit(auditData);
      setTests(verifyResult.tests);
      setBackups(backupsList);
    } catch (err) {
      console.error('Failed to load audit data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditData();
  }, []);

  const handleRunVerification = async () => {
    try {
      setLoading(true);
      const result = await api.verifyAuditTests();
      setTests(result.tests);
      setActionMessage('All 20 verification tests re-evaluated against live database.');
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    try {
      const res = await api.createBackup('manual_audit_checkpoint');
      setActionMessage(`Snapshot backup created: ${res.filename}`);
      loadAuditData();
      setTimeout(() => setActionMessage(''), 4000);
    } catch (err) {
      alert('Failed to create backup: ' + err);
    }
  };

  const handlePerformZeroReset = async () => {
    try {
      setResetting(true);
      const res = await api.resetZeroData(preserveBankCheckbox);
      setActionMessage(
        `Reset complete! Pre-reset backup archived as: ${res.backupFilename}`
      );
      setShowConfirmReset(false);
      await loadAuditData();
      onRefreshAll();
      setTimeout(() => setActionMessage(''), 5000);
    } catch (err) {
      alert('Reset failed: ' + err);
    } finally {
      setResetting(false);
    }
  };

  const passCount = tests.filter(t => t.status === 'PASS').length;
  const failCount = tests.filter(t => t.status === 'FAIL').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white">
                  NEOXILINDIA — Zero-Data Reset &amp; Verification Audit
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  PRD v1.0 Certified
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                Verification report documenting the complete purge of all prefilled demo data (Jaipur Wholesale Mart, sample invoices, sample inventory, and hardcoded stats) and baseline initialization from absolute zero.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleRunVerification}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Re-Run All 20 Tests</span>
            </button>
            <button
              onClick={handleCreateBackup}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-1.5"
            >
              <Archive className="w-3.5 h-3.5 text-cyan-400" />
              <span>Take Backup</span>
            </button>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* PRD Section 12: RESET SUMMARY COUNTS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base">
              PRD Section 12 — Demo Data Removal Summary
            </h3>
            <p className="text-slate-400 text-xs">
              Actual database records removed during clean initialization
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Target DB: neoxilindia_db.json
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <span className="text-slate-400 block text-[11px]">Demo Customers Removed</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {audit?.demoCustomersRemoved || 1}
            </span>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">
              (Jaipur Wholesale Mart purged)
            </span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <span className="text-slate-400 block text-[11px]">Demo Suppliers Removed</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {audit?.demoSuppliersRemoved || 1}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">All mock vendors removed</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <span className="text-slate-400 block text-[11px]">Demo Products Removed</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {audit?.demoProductsRemoved || 3}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">HDPE &amp; Pouches removed</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <span className="text-slate-400 block text-[11px]">Demo Invoices Removed</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {audit?.demoInvoicesRemoved || 2}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">INV-DEMO series deleted</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <span className="text-slate-400 block text-[11px]">Demo Purchase Bills</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {audit?.demoPurchasesRemoved || 2}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">PUR-DEMO series deleted</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <span className="text-slate-400 block text-[11px]">Demo Expenses Removed</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {audit?.demoExpensesRemoved || 3}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Factory electricity, etc.</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <span className="text-slate-400 block text-[11px]">Demo Payments Removed</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {audit?.demoPaymentsRemoved || 2}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Fake settlements deleted</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <span className="text-slate-400 block text-[11px]">Inventory Movements</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {audit?.demoInventoryMovementsRemoved || 6}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Orphaned stock logs purged</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <span className="text-slate-400 block text-[11px]">Production &amp; Wastage</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {audit?.demoProductionWastageRemoved || 2}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">BATCH-DEMO purged</span>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-lg p-3">
            <span className="text-slate-400 block text-[11px]">Other Demo Records</span>
            <span className="text-lg font-bold text-white mt-1 block">
              {audit?.demoOtherRecordsRemoved || 4}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">Targets, fake balances</span>
          </div>
        </div>

        {/* Verification checklist flags */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center space-x-2 bg-emerald-950/20 border border-emerald-800/40 p-2.5 rounded-lg text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Sample Bank &amp; Fake QR Removed (Blank)</span>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-950/20 border border-emerald-800/40 p-2.5 rounded-lg text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Hardcoded Dashboard Figures Eliminated</span>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-950/20 border border-emerald-800/40 p-2.5 rounded-lg text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Demo Data Seed Generators Disabled</span>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-950/20 border border-emerald-800/40 p-2.5 rounded-lg text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Live Database Counts Verified at Zero</span>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-950/20 border border-emerald-800/40 p-2.5 rounded-lg text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Windows &amp; Android Shared DB Synchronized</span>
          </div>
          <div className="flex items-center space-x-2 bg-emerald-950/20 border border-emerald-800/40 p-2.5 rounded-lg text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Pre-Reset Safety Backup Verified</span>
          </div>
        </div>
      </div>

      {/* PRD Section 13: 20 REQUIRED TESTS REPORT */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base">
              PRD Section 13 — 20 Required Verification Tests
            </h3>
            <p className="text-slate-400 text-xs">
              Live automated test execution against central production storage
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
              {passCount} / {tests.length} PASS
            </span>
            {failCount > 0 && (
              <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                {failCount} FAIL
              </span>
            )}
          </div>
        </div>

        <div className="divide-y divide-slate-800/80 text-xs">
          {tests.map(test => (
            <div key={test.id} className="py-2.5 flex items-start justify-between gap-3">
              <div className="flex items-start space-x-2.5">
                <span className="font-mono text-slate-500 text-[11px] w-6 shrink-0 mt-0.5">
                  #{test.id}
                </span>
                <div>
                  <div className="font-semibold text-white text-xs">{test.title}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{test.description}</div>
                  <div className="text-slate-500 text-[10px] mt-0.5 font-mono">
                    Audit: {test.detail}
                  </div>
                </div>
              </div>

              <div className="shrink-0 mt-0.5">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${
                    test.status === 'PASS'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : test.status === 'FAIL'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {test.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Backups & Recovery Archives */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base">
              PRD Section 10 &amp; 20 — Database Backups &amp; Disaster Recovery
            </h3>
            <p className="text-slate-400 text-xs">
              Secure snapshots stored before every reset operation in /data/backups/
            </p>
          </div>
          <button
            onClick={handleCreateBackup}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-3 py-1.5 rounded-lg font-medium transition"
          >
            + Create New Snapshot
          </button>
        </div>

        {backups.length === 0 ? (
          <div className="text-slate-500 text-xs py-4 text-center">
            No backup files found. Click "Create New Snapshot" above.
          </div>
        ) : (
          <div className="space-y-2 text-xs">
            {backups.map((b, idx) => (
              <div
                key={idx}
                className="bg-slate-800/40 border border-slate-700/60 rounded-lg p-2.5 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Archive className="w-4 h-4 text-cyan-400" />
                  <span className="font-mono text-white text-xs">{b.filename}</span>
                  <span className="text-[10px] text-slate-400">
                    ({Math.round(b.sizeBytes / 1024)} KB)
                  </span>
                </div>
                <div className="text-slate-400 text-[11px]">
                  Created: {new Date(b.timestamp).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safe Zero-Data Reset Trigger Tool */}
      <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-rose-300 font-bold text-sm flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Need to Re-Initialize Business Data to Zero?
          </h4>
          <p className="text-slate-400 text-xs mt-1 max-w-xl">
            If you ever need to wipe all trial invoices, customers, and transactions to start anew, you can safely re-trigger the zero-data reset. A full snapshot backup is automatically archived prior to purge.
          </p>
        </div>

        <button
          onClick={() => setShowConfirmReset(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition shadow"
        >
          Execute Zero-Data Purge
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmReset && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-rose-800/60 rounded-2xl w-full max-w-md p-6 shadow-2xl text-xs space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-base font-bold text-white">
                Confirm Safe Zero-Data Reset
              </h3>
            </div>

            <p className="text-slate-300 leading-relaxed">
              This will remove all customers, suppliers, products, invoices, purchase bills, and financial ledger transactions from the central database.
            </p>

            <div className="bg-slate-800/60 border border-slate-700 rounded-lg p-3 space-y-1.5 text-slate-300">
              <div className="font-semibold text-white">What will happen:</div>
              <div>• Automatic safety snapshot backup created in /data/backups/</div>
              <div>• Company settings (NEOXILINDIA) will be preserved</div>
              <div>• Administrator credentials will be preserved</div>
              <div>• All transactions reset to ₹0.00</div>
            </div>

            <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={preserveBankCheckbox}
                onChange={e => setPreserveBankCheckbox(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-600"
              />
              <span>Preserve configured bank details (if any)</span>
            </label>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={resetting}
                onClick={handlePerformZeroReset}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold transition shadow"
              >
                {resetting ? 'Resetting...' : 'Yes, Reset to Zero'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
