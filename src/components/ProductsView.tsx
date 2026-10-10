import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Package, Search, Layers, Box, AlertTriangle } from 'lucide-react';
import { Product } from '../types.ts';

interface ProductsViewProps {
  products: Product[];
  onCreateProduct: (data: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, data: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}

export const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState<'Finished Goods' | 'Raw Material' | 'Packaging Material' | 'General'>('Finished Goods');
  const [unit, setUnit] = useState('Pcs');
  const [hsnCode, setHsnCode] = useState('');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [openingStock, setOpeningStock] = useState<number>(0);
  const [minStockAlert, setMinStockAlert] = useState<number>(10);

  const resetForm = () => {
    setName('');
    setCode('');
    setCategory('Finished Goods');
    setUnit('Pcs');
    setHsnCode('');
    setPurchasePrice(0);
    setSalePrice(0);
    setTaxRate(18);
    setOpeningStock(0);
    setMinStockAlert(10);
    setEditingId(null);
  };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setName(p.name);
    setCode(p.code);
    setCategory(p.category);
    setUnit(p.unit);
    setHsnCode(p.hsnCode);
    setPurchasePrice(p.purchasePrice);
    setSalePrice(p.salePrice);
    setTaxRate(p.taxRate);
    setOpeningStock(p.openingStock);
    setMinStockAlert(p.minStockAlert);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      await onUpdateProduct(editingId, {
        name,
        code,
        category,
        unit,
        hsnCode,
        purchasePrice,
        salePrice,
        taxRate,
        minStockAlert,
      });
    } else {
      await onCreateProduct({
        name,
        code,
        category,
        unit,
        hsnCode,
        purchasePrice,
        salePrice,
        taxRate,
        openingStock,
        minStockAlert,
      });
    }

    setShowModal(false);
    resetForm();
  };

  const filtered = products.filter(p => {
    const matchesCat = categoryFilter === 'ALL' || p.category === categoryFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hsnCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            Products &amp; Inventory Catalog
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage finished goods, raw materials, packaging, stock quantities, and HSN codes.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Product / Raw Material</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full sm:w-auto flex-1">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search items by name, SKU or HSN..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-white placeholder-slate-500 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs w-full sm:w-auto overflow-x-auto">
          {['ALL', 'Finished Goods', 'Raw Material', 'Packaging Material'].map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded transition whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-emerald-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table or Empty State */}
      {products.length === 0 ? (
        <div className="bg-slate-900 border border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">0 Products in Database</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mt-1 leading-relaxed">
            All demo products (HDPE Granules Grade-A, Neoxil Industrial Cleaner, etc.) have been completely removed. Add your genuine products or raw materials to begin inventory tracking.
          </p>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2 rounded-lg font-semibold transition inline-flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Product</span>
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">SKU / Code</th>
                  <th className="p-3">Item Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">HSN</th>
                  <th className="p-3 text-right">Purchase (₹)</th>
                  <th className="p-3 text-right">Sale (₹)</th>
                  <th className="p-3 text-right">GST %</th>
                  <th className="p-3 text-right">Current Stock</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition">
                    <td className="p-3 font-mono text-slate-400">{p.code}</td>
                    <td className="p-3 font-semibold text-white">{p.name}</td>
                    <td className="p-3">
                      <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 border border-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{p.hsnCode || '-'}</td>
                    <td className="p-3 text-right text-slate-400">₹{p.purchasePrice.toFixed(2)}</td>
                    <td className="p-3 text-right font-medium text-white">₹{p.salePrice.toFixed(2)}</td>
                    <td className="p-3 text-right text-slate-400">{p.taxRate}%</td>
                    <td className="p-3 text-right">
                      <span
                        className={`font-bold ${
                          p.currentStock <= p.minStockAlert
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {p.currentStock} {p.unit}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <button
                        onClick={() => handleEdit(p)}
                        className="p-1.5 text-emerald-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
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
              {editingId ? 'Edit Product' : 'Add Product / Material'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Neoxil Polymer Compound"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Finished Goods">Finished Goods</option>
                    <option value="Raw Material">Raw Material</option>
                    <option value="Packaging Material">Packaging Material</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit of Measurement</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="Pcs">Pcs (Pieces)</option>
                    <option value="Kg">Kg (Kilograms)</option>
                    <option value="Ltr">Ltr (Liters)</option>
                    <option value="Box">Box</option>
                    <option value="Meter">Meter</option>
                    <option value="Ton">Ton</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">SKU / Code</label>
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value)}
                    placeholder="e.g. PROD-01"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">HSN Code</label>
                  <input
                    type="text"
                    value={hsnCode}
                    onChange={e => setHsnCode(e.target.value)}
                    placeholder="e.g. 3901"
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Purchase Rate (₹)</label>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={e => setPurchasePrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Sale Rate (₹)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={e => setSalePrice(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">GST Tax %</label>
                  <select
                    value={taxRate}
                    onChange={e => setTaxRate(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                  >
                    <option value="0">0%</option>
                    <option value="5">5%</option>
                    <option value="12">12%</option>
                    <option value="18">18%</option>
                    <option value="28">28%</option>
                  </select>
                </div>
              </div>

              {!editingId && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Opening Stock</label>
                    <input
                      type="number"
                      value={openingStock}
                      onChange={e => setOpeningStock(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                    <span className="text-[10px] text-slate-500">Zero unless manually entered</span>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Low Stock Alert Limit</label>
                    <input
                      type="number"
                      value={minStockAlert}
                      onChange={e => setMinStockAlert(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                    />
                  </div>
                </div>
              )}

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
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition"
                >
                  {editingId ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
