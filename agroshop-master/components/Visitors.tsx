
import React, { useState } from 'react';
import { Visitor } from '../types';

interface VisitorsProps {
  visitors: Visitor[];
  onAdd: (v: Omit<Visitor, 'id'>) => void;
}

export const Visitors: React.FC<VisitorsProps> = ({ visitors, onAdd }) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    visitDate: new Date().toISOString().split('T')[0],
    purpose: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setShowModal(false);
    setFormData({ 
      name: '', 
      phone: '', 
      email: '', 
      visitDate: new Date().toISOString().split('T')[0], 
      purpose: '' 
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-bold text-slate-700">Visitor Logs</h3>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          ➕ Register Visitor
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Visitor Name</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Purpose</th>
              <th className="px-6 py-4">Visit Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visitors.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400">No visitor records found.</td></tr>
            ) : (
              visitors.map(v => (
                <tr key={v.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{v.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{v.phone}</div>
                    <div className="text-xs text-slate-400">{v.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      {v.purpose}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(v.visitDate).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex justify-between">
              <h4 className="text-lg font-bold">New Visitor Registration</h4>
              <button onClick={() => setShowModal(false)} className="text-2xl text-slate-400">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  required
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                  <input 
                    required type="tel"
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input 
                    type="date"
                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={formData.visitDate}
                    onChange={e => setFormData({ ...formData, visitDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose of Visit</label>
                <textarea 
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
                  value={formData.purpose}
                  onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                  placeholder="e.g. Inquiring about seed prices"
                />
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition"
              >
                Complete Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
