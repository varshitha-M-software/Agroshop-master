
import React from 'react';
import { Sale } from '../types';

interface SalesHistoryProps {
  sales: Sale[];
}

export const SalesHistory: React.FC<SalesHistoryProps> = ({ sales }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <h3 className="font-bold text-slate-700">Transaction History</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Sale ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4 text-right">Total Amount</th>
              <th className="px-6 py-4">Date/Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sales.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No sales recorded yet.</td></tr>
            ) : (
              sales.map(s => (
                <tr key={s.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{s.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{s.visitorName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs truncate text-xs text-slate-500">
                      {s.items.map(i => `${i.productName} (x${i.quantity})`).join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold text-emerald-600">${s.totalAmount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">
                    {new Date(s.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
