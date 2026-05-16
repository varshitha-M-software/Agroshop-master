
import React, { useState, useMemo } from 'react';
import { Product, Visitor, Sale, SaleItem } from '../types';

interface POSProps {
  products: Product[];
  visitors: Visitor[];
  onCompleteSale: (sale: Sale) => void;
}

export const POS: React.FC<POSProps> = ({ products, visitors, onCompleteSale }) => {
  const [selectedVisitorId, setSelectedVisitorId] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
    );
  }, [products, searchTerm]);

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) return;
      setCart(cart.map(item => 
        item.productId === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, {
        productId: product.id,
        productName: product.name,
        quantity: 1,
        priceAtSale: product.price
      }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  const total = cart.reduce((sum, item) => sum + (item.priceAtSale * item.quantity), 0);

  const handleCheckout = () => {
    if (!selectedVisitorId || cart.length === 0) return;
    const visitor = visitors.find(v => v.id === selectedVisitorId);
    
    const newSale: Sale = {
      id: `S-${Date.now()}`,
      visitorId: selectedVisitorId,
      visitorName: visitor?.name || 'Unknown',
      items: [...cart],
      totalAmount: total,
      timestamp: new Date().toISOString()
    };

    onCompleteSale(newSale);
    setCart([]);
    setSelectedVisitorId('');
    alert('Sale completed successfully!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Product Selection */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <input 
            placeholder="🔍 Search products..."
            className="w-full p-4 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProducts.map(p => (
            <div 
              key={p.id} 
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center hover:border-emerald-500 transition cursor-pointer"
              onClick={() => addToCart(p)}
            >
              <div>
                <h4 className="font-bold text-slate-800">{p.name}</h4>
                <p className="text-sm text-slate-500">{p.category} • ${p.price.toFixed(2)}</p>
                <p className="text-xs text-emerald-600 font-semibold mt-1">Stock: {p.stock} {p.unit}</p>
              </div>
              <button className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl">
                +
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Cart/Checkout */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col h-full sticky top-24">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🛒</span> Current Cart
          </h3>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Customer</label>
            <select 
              className="w-full border border-slate-200 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-emerald-500"
              value={selectedVisitorId}
              onChange={e => setSelectedVisitorId(e.target.value)}
            >
              <option value="">-- Choose Visitor --</option>
              {visitors.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.phone})</option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px]">
            {cart.length === 0 ? (
              <p className="text-center py-12 text-slate-400">Cart is empty.</p>
            ) : (
              cart.map(item => (
                <div key={item.productId} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex-1">
                    <p className="font-semibold text-sm line-clamp-1">{item.productName}</p>
                    <p className="text-xs text-slate-500">{item.quantity} x ${item.priceAtSale.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700">${(item.quantity * item.priceAtSale).toFixed(2)}</span>
                    <button onClick={() => removeFromCart(item.productId)} className="text-rose-400 hover:text-rose-600 text-lg">×</button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="flex justify-between text-xl font-bold mb-6">
              <span>Total</span>
              <span className="text-emerald-600">${total.toFixed(2)}</span>
            </div>
            <button 
              disabled={!selectedVisitorId || cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100 disabled:opacity-50 transition transform active:scale-95"
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
