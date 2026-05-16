
import React, { useState } from 'react';
import { Product, Category } from '../types';

interface InventoryProps {
  products: Product[];
  onAdd: (p: Omit<Product, 'id'>) => void;
  onUpdate: (p: Product) => void;
  onDelete: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: Category.SEEDS,
    price: 0,
    stock: 0,
    unit: 'kg'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdate({ ...formData, id: editingProduct.id });
    } else {
      onAdd(formData);
    }
    closeModal();
  };

  const openModal = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setFormData({ name: p.name, category: p.category, price: p.price, stock: p.stock, unit: p.unit });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: Category.SEEDS, price: 0, stock: 0, unit: 'kg' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-700">Stock Management</h3>
        <button 
          onClick={() => openModal()}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2"
        >
          <span>➕</span> Add Product
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider font-semibold">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Price</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4">Unit</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-800">{p.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs rounded-full border border-emerald-100 uppercase font-semibold">
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">${p.price.toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`${p.stock < 10 ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-400">{p.unit}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openModal(p)} className="text-emerald-600 hover:text-emerald-800 p-2">✏️</button>
                  <button onClick={() => onDelete(p.id)} className="text-rose-600 hover:text-rose-800 p-2">🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h4 className="text-lg font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-2xl">×</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                <input 
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select 
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                  <input 
                    placeholder="kg, bag, pc..."
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.unit}
                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                  <input 
                    type="number" step="0.01" required
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Initial Stock</label>
                  <input 
                    type="number" required
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-semibold"
                >
                  {editingProduct ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
