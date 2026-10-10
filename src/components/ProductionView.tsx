import React, { useState } from 'react';
import { Plus, Trash2, Layers, AlertCircle, FileText, CheckCircle2, Factory } from 'lucide-react';
import { ProductionBatch, BillOfMaterials, WastageRecord, Product } from '../types.ts';

interface ProductionViewProps {
  batches: ProductionBatch[];
  boms: BillOfMaterials[];
  wastage: WastageRecord[];
  products: Product[];
  onCreateBatch: (data: any) => Promise<void>;
  onCreateBom: (data: any) => Promise<void>;
  onCreateWastage: (data: any) => Promise<void>;
  onDeleteBatch: (id: string) => Promise<void>;
  onDeleteWastage: (id: string) => Promise<void>;
}

export const ProductionView: React.FC<ProductionViewProps> = ({
  batches,
  boms,
  wastage,
  products,
  onCreateBatch,
  onCreateBom,
  onCreateWastage,
  onDeleteBatch,
  onDeleteWastage,
}) => {
  const [subTab, setSubTab] = useState<'batches' | 'bom' | 'wastage'>('batches');
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showWastageModal, setShowWastageModal] = useState(false);
  const [showBomModal, setShowBomModal] = useState(false);

  // New Batch Form
  const [batchNumber, setBatchNumber] = useState(`BATCH-${Date.now().toString().slice(-4)}`);
  const [finishedProductId, setFinishedProductId] = useState('');
  const [qtyProduced, setQtyProduced] = useState<number>(100);
  const [batchDate, setBatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [batchNotes, setBatchNotes] = useState('');

  // New Wastage Form
  const [wastageProductId, setWastageProductId] = useState('');
  const [wastageQty, setWastageQty] = useState<number>(1);
  const [wastageCost, setWastageCost] = useState<number>(0);
  const [wastageReason, setWastageReason] = useState('Machine startup scrap');

  const finishedProducts = products.filter(p => p.category === 'Finished Goods');
  const rawMaterials = products.filter(p => p.category === 'Raw Material' || p.category === 'Packaging Material');

  const handleBatchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!finishedProductId) return;
    const prod = products.find(p => p.id === finishedProductId);

    await onCreateBatch({
      batchNumber,
      finishedProductId,
      finishedProductName: prod ? prod.name : 'Finished Good',
      quantityProduced: qtyProduced,
      unit: prod?.unit || 'Pcs',
      date: batchDate,
      materialsConsumed: [],
      notes: batchNotes,
    });

    setShowBatchModal(false);
    setBatchNumber(`BATCH-${Date.now().toString().slice(-4)}`);
  };

  const handleWastageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wastageProductId) return;
    const prod = products.find(p => p.id === wastageProductId);

    await onCreateWastage({
      productId: wastageProductId,
      productName: prod ? prod.name : 'Material',
      quantity: wastageQty,
      unit: prod?.unit || 'Kg',
      estimatedCost: wastageCost,
      reason: wastageReason,
      date: new Date().toISOString().split('T')[0],
    });

    setShowWastageModal(false);
    setWastageQty(1);
    setWastageCost(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Factory className="w-5 h-5 text-indigo-400" />
            Manufacturing &amp; Production Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Record batch processing, raw material consumption, Bill of Materials, and scrap wastage.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {subTab === 'batches' && (
            <button
              onClick={() => setShowBatchModal(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record Production Batch</span>
            </button>
          )}
          {subTab === 'wastage' && (
            <button
              onClick={() => setShowWastageModal(true)}
              className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>+ Log Wastage / Scrap</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setSubTab('batches')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            subTab === 'batches'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Production Batches ({batches.length})
        </button>
        <button
          onClick={() => setSubTab('wastage')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            subTab === 'wastage'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Wastage &amp; Scraps ({wastage.length})
        </button>
      </div>

      {/* Batches Table or Clean Empty State */}
      {subTab === 'batches' && (
        <>
          {batches.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
              <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Factory className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">0 Production Batches in Database</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                All sample production batches (BATCH-DEMO-101, etc.) have been wiped clean. Log genuine manufacturing operations here.
              </p>
              <button
                onClick={() => setShowBatchModal(true)}
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log First Batch</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Batch No</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Finished Product</th>
                      <th className="p-3 text-right">Quantity Produced</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {batches.map(b => (
                      <tr key={b.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3 font-semibold text-white">#{b.batchNumber}</td>
                        <td className="p-3 text-slate-400">{b.date}</td>
                        <td className="p-3 font-medium text-slate-200">
                          {b.finishedProductName}
                        </td>
                        <td className="p-3 text-right font-bold text-emerald-400">
                          {b.quantityProduced} {b.unit}
                        </td>
                        <td className="p-3 text-center">
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onDeleteBatch(b.id)}
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

      {/* Wastage Records */}
      {subTab === 'wastage' && (
        <>
          {wastage.length === 0 ? (
            <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
              <div className="w-14 h-14 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">0 Wastage Records in Database</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
                All sample scrap records have been removed. Track material loss, quality rejection, or production defects accurately.
              </p>
              <button
                onClick={() => setShowWastageModal(true)}
                className="mt-4 bg-rose-600 hover:bg-rose-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Log Scrap Entry</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Item Name</th>
                      <th className="p-3 text-right">Quantity</th>
                      <th className="p-3 text-right">Estimated Cost (₹)</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {wastage.map(w => (
                      <tr key={w.id} className="hover:bg-slate-800/30 transition">
                        <td className="p-3 text-slate-400">{w.date}</td>
                        <td className="p-3 font-semibold text-white">{w.productName}</td>
                        <td className="p-3 text-right font-medium text-rose-400">
                          {w.quantity} {w.unit}
                        </td>
                        <td className="p-3 text-right font-bold text-white">
                          ₹{w.estimatedCost.toFixed(2)}
                        </td>
                        <td className="p-3 text-slate-400">{w.reason}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => onDeleteWastage(w.id)}
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

      {/* Batch Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <h3 className="text-white font-bold text-base mb-3">
              Log Production Batch
            </h3>
            <form onSubmit={handleBatchSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Batch Number</label>
                <input
                  type="text"
                  required
                  value={batchNumber}
                  onChange={e => setBatchNumber(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Product to Produce</label>
                <select
                  required
                  value={finishedProductId}
                  onChange={e => setFinishedProductId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="">-- Choose Finished Good --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={qtyProduced}
                    onChange={e => setQtyProduced(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Production Date</label>
                  <input
                    type="date"
                    required
                    value={batchDate}
                    onChange={e => setBatchDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={batchNotes}
                  onChange={e => setBatchNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBatchModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition shadow"
                >
                  Record Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Wastage Modal */}
      {showWastageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl">
            <h3 className="text-white font-bold text-base mb-3">
              Record Material Wastage
            </h3>
            <form onSubmit={handleWastageSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Item / Raw Material</label>
                <select
                  required
                  value={wastageProductId}
                  onChange={e => setWastageProductId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                >
                  <option value="">-- Choose Item --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Quantity Scrapped</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={wastageQty}
                    onChange={e => setWastageQty(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Estimated Cost (₹)</label>
                  <input
                    type="number"
                    value={wastageCost}
                    onChange={e => setWastageCost(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Reason for Wastage</label>
                <input
                  type="text"
                  value={wastageReason}
                  onChange={e => setWastageReason(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWastageModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold transition"
                >
                  Save Wastage Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
