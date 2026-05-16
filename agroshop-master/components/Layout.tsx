
import React from 'react';
import { View } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (v: View) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'visitors', label: 'Visitors', icon: '👥' },
    { id: 'pos', label: 'New Sale', icon: '🛒' },
    { id: 'sales', label: 'Sales History', icon: '📜' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-emerald-900 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-3xl">🌱</span> AgroShop
          </h1>
          <p className="text-emerald-300 text-xs mt-1 uppercase tracking-widest font-semibold">Manager Pro</p>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-colors text-left ${
                currentView === item.id 
                  ? 'bg-emerald-800 border-l-4 border-emerald-400' 
                  : 'hover:bg-emerald-800/50 text-emerald-100'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-800 capitalize">{currentView}</h2>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">Administrator</p>
              <p className="text-xs text-slate-500">Shop Manager</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
              A
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
