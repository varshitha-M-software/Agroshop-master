
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Visitors } from './components/Visitors';
import { SalesHistory } from './components/SalesHistory';
import { POS } from './components/POS';
import { Product, Visitor, Sale, View, Category } from './types';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Wheat Seeds', category: Category.SEEDS, price: 45.0, stock: 120, unit: 'kg' },
  { id: '2', name: 'Organic NPK Fertilizer', category: Category.FERTILIZER, price: 85.5, stock: 50, unit: 'bag' },
  { id: '3', name: 'Heavy Duty Spade', category: Category.TOOLS, price: 25.0, stock: 15, unit: 'pc' },
];

const INITIAL_VISITORS: Visitor[] = [
  { id: 'v1', name: 'John Doe', phone: '555-0101', visitDate: new Date().toISOString(), purpose: 'Purchasing Seeds' },
];

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('agro_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem('agro_visitors');
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('agro_sales');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('agro_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('agro_visitors', JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem('agro_sales', JSON.stringify(sales));
  }, [sales]);

  const addProduct = (p: Omit<Product, 'id'>) => {
    setProducts([...products, { ...p, id: Date.now().toString() }]);
  };

  const updateProduct = (updated: Product) => {
    setProducts(products.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const addVisitor = (v: Omit<Visitor, 'id'>) => {
    setVisitors([{ ...v, id: Date.now().toString() }, ...visitors]);
  };

  const recordSale = (sale: Sale) => {
    setSales([sale, ...sales]);
    // Deduct stock
    setProducts(prev => prev.map(p => {
      const itemSold = sale.items.find(si => si.productId === p.id);
      if (itemSold) {
        return { ...p, stock: Math.max(0, p.stock - itemSold.quantity) };
      }
      return p;
    }));
  };

  const renderView = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard products={products} visitors={visitors} sales={sales} />;
      case 'inventory':
        return <Inventory products={products} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} />;
      case 'visitors':
        return <Visitors visitors={visitors} onAdd={addVisitor} />;
      case 'sales':
        return <SalesHistory sales={sales} />;
      case 'pos':
        return <POS products={products} visitors={visitors} onCompleteSale={recordSale} />;
      default:
        return <Dashboard products={products} visitors={visitors} sales={sales} />;
    }
  };

  return (
    <Layout currentView={view} setView={setView}>
      {renderView()}
    </Layout>
  );
};

export default App;
