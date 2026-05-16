
import React, { useMemo, useState } from 'react';
import { Product, Visitor, Sale } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie 
} from 'recharts';
import { GoogleGenAI } from '@google/genai';

interface DashboardProps {
  products: Product[];
  visitors: Visitor[];
  sales: Sale[];
}

export const Dashboard: React.FC<DashboardProps> = ({ products, visitors, sales }) => {
  const [aiInsight, setAiInsight] = useState<string>('');
  const [loadingInsight, setLoadingInsight] = useState(false);

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const lowStock = products.filter(p => p.stock < 10).length;
    const totalVisitors = visitors.length;
    return { totalRevenue, lowStock, totalVisitors };
  }, [products, visitors, sales]);

  const salesData = useMemo(() => {
    const groups: Record<string, number> = {};
    sales.forEach(s => {
      const date = new Date(s.timestamp).toLocaleDateString();
      groups[date] = (groups[date] || 0) + s.totalAmount;
    });
    return Object.entries(groups).map(([name, total]) => ({ name, total })).slice(-7);
  }, [sales]);

  const categoryDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    products.forEach(p => {
      dist[p.category] = (dist[p.category] || 0) + 1;
    });
    return Object.entries(dist).map(([name, value]) => ({ name, value }));
  }, [products]);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  const getAiInsight = async () => {
    setLoadingInsight(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this Agro shop data and give a brief strategy insight (2 sentences): 
          Total Sales: ${stats.totalRevenue}, Visitors: ${stats.totalVisitors}, Low Stock Items: ${stats.lowStock}. 
          Products: ${products.map(p => `${p.name} (${p.stock})`).join(', ')}`,
      });
      setAiInsight(response.text || 'No insights available.');
    } catch (error) {
      setAiInsight('Connect to Gemini API for smart business insights.');
    } finally {
      setLoadingInsight(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💰" color="text-emerald-600" />
        <StatCard title="Total Visitors" value={stats.totalVisitors.toString()} icon="👥" color="text-blue-600" />
        <StatCard title="Low Stock Warning" value={stats.lowStock.toString()} icon="⚠️" color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sales Trend (Recent)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Inventory Mix</h3>
          <div className="h-64 flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name }) => name}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-emerald-800 flex items-center gap-2">
            <span>✨</span> AI Business Assistant
          </h3>
          <button 
            onClick={getAiInsight}
            disabled={loadingInsight}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
          >
            {loadingInsight ? 'Analyzing...' : 'Get Insight'}
          </button>
        </div>
        <p className="text-emerald-900 leading-relaxed italic">
          {aiInsight || 'Click "Get Insight" to generate a summary of your shop\'s performance using Gemini AI.'}
        </p>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: { title: string, value: string, icon: string, color: string }) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
    <div className="text-3xl p-3 bg-slate-50 rounded-lg">{icon}</div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  </div>
);
