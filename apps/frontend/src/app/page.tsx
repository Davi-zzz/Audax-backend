'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  BookOpen, 
  LayoutDashboard, 
  Boxes, 
  ShieldCheck, 
  FileCode, 
  TrendingUp, 
  AlertTriangle,
  User,
  Heart
} from 'lucide-react';
import { Product, ProductFormData, ActiveTab } from '../types';
import { INITIAL_PRODUCTS } from '../initialData';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import Documentation from '../components/Documentation';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Load products from localStorage on mount safely checking for window (SSR safe in Next.js)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('product_catalog_technical_test');
      if (stored) {
        try {
          setProducts(JSON.parse(stored));
        } catch (e) {
          console.error('Error parsing stored products, resetting to initial', e);
          setProducts(INITIAL_PRODUCTS);
        }
      } else {
        setProducts(INITIAL_PRODUCTS);
      }
    }
  }, []);

  // Save products to localStorage on update
  const saveProducts = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('product_catalog_technical_test', JSON.stringify(updatedProducts));
    }
  };

  // Handle addition or updates
  const handleFormSubmit = (formData: ProductFormData) => {
    const stockNum = parseInt(formData.stock, 10) || 0;

    if (editingProduct) {
      // Editing Mode
      const updated = products.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            sku: formData.sku.toUpperCase().trim(),
            name: formData.name.trim(),
            description: formData.description.trim(),
            stock: stockNum,
            image: formData.image,
          };
        }
        return p;
      });
      saveProducts(updated);
      setEditingProduct(null);
    } else {
      // Creating Mode
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        sku: formData.sku.toUpperCase().trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        stock: stockNum,
        image: formData.image,
        createdAt: new Date().toISOString(),
      };
      saveProducts([newProduct, ...products]);
    }
  };

  // Handle Edit Selection
  const handleEditSelect = (product: Product) => {
    setEditingProduct(product);
  };

  // Handle Deletion
  const handleDeleteProduct = (id: string) => {
    const filtered = products.filter((p) => p.id !== id);
    saveProducts(filtered);
    if (editingProduct?.id === id) {
      setEditingProduct(null);
    }
  };

  // Cancel Editing
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // Compute stats for our inventory dashboard cards
  const stats = useMemo(() => {
    const totalSkus = products.length;
    const totalItems = products.reduce((acc, p) => acc + p.stock, 0);
    const lowStockAlerts = products.filter((p) => p.stock > 0 && p.stock < 15).length;
    const outOfStockAlerts = products.filter((p) => p.stock === 0).length;

    return {
      totalSkus,
      totalItems,
      lowStockAlerts,
      outOfStockAlerts,
    };
  }, [products]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans" id="app-root-layout">
      
      {/* SIDEBAR: Brand Navigation & Evaluator Badge */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800" id="sidebar">
        
        {/* Top brand portion */}
        <div>
          {/* Logo Brand Header */}
          <div className="p-6 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Package className="w-5.5 h-5.5 stroke-2" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-100 tracking-tight">Cadastro de Itens</h1>
              <span className="text-[10px] text-slate-400 font-medium font-mono">TESTE TÉCNICO V1.0</span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-4 space-y-1.5" id="sidebar-nav">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3.5 mb-2">Painéis</p>
            
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition duration-200 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
              id="tab-btn-products"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Gerenciar Produtos</span>
            </button>

            <button
              onClick={() => setActiveTab('docs')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition duration-200 cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
              id="tab-btn-docs"
            >
              <BookOpen className="w-4 h-4" />
              <span>Decisões & Docs</span>
            </button>
          </nav>
        </div>

        {/* Footer Candidate Info Details */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-3">
          <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-800/50 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 flex items-center justify-center">
              <User className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidato</p>
              <p className="text-[11px] text-slate-200 font-medium truncate" title="davismoraes.0001@gmail.com">
                davismoraes.0001@gmail.com
              </p>
            </div>
          </div>
          
          <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
            <span>Desenvolvido com</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>

      </aside>

      {/* MAIN VIEW AREA: Header & Switchable Tabs */}
      <main className="flex-1 flex flex-col min-w-0" id="main-content">
        
        {/* TOP STATUS BAR */}
        <header className="bg-white border-b border-slate-100 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0" id="top-bar">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-2">
              {activeTab === 'products' ? (
                <>
                  <Boxes className="w-5 h-5 text-indigo-600" />
                  <span>Controle de Estoque e Cadastro</span>
                </>
              ) : (
                <>
                  <FileCode className="w-5 h-5 text-indigo-600" />
                  <span>Documentação do Desenvolvedor</span>
                </>
              )}
            </h2>
            <p className="text-xs text-slate-400">
              {activeTab === 'products' 
                ? 'Insira novos produtos, pesquise no catálogo ou edite itens em tempo real.' 
                : 'Decisões arquiteturais, justificativas e pilares de validação do teste técnico.'}
            </p>
          </div>

          {/* Quick action helper/indicators */}
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-50 text-emerald-700 text-[11px] font-semibold py-1.5 px-3 rounded-full border border-emerald-100 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Validações Ativas</span>
            </div>
          </div>
        </header>

        {/* COMPONENT ROUTER PANEL CONTAINER */}
        <div className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto" id="view-panel-container">
          
          {activeTab === 'products' ? (
            <div className="space-y-6 animate-fade-in" id="products-tab-view">
              
              {/* Stat Summary Cards Bento Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="stats-dashboard-grid">
                {/* Total SKUs */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4.5 flex items-center justify-between shadow-xs">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Produtos (SKUs)</p>
                    <p className="text-xl font-bold text-slate-800">{stats.totalSkus}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Boxes className="w-4.5 h-4.5" />
                  </div>
                </div>

                {/* Total Stock Count */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4.5 flex items-center justify-between shadow-xs">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estoque Total</p>
                    <p className="text-xl font-bold text-slate-800">{stats.totalItems}</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                </div>

                {/* Low Stock count */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4.5 flex items-center justify-between shadow-xs">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Alerta Estoque Baixo</p>
                    <p className={`text-xl font-bold ${stats.lowStockAlerts > 0 ? 'text-amber-600' : 'text-slate-800'}`}>
                      {stats.lowStockAlerts}
                    </p>
                  </div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stats.lowStockAlerts > 0 ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                    <AlertTriangle className="w-4.5 h-4.5" />
                  </div>
                </div>

                {/* Out of Stock count */}
                <div className="bg-white rounded-2xl border border-slate-100 p-4.5 flex items-center justify-between shadow-xs">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Produtos Esgotados</p>
                    <p className={`text-xl font-bold ${stats.outOfStockAlerts > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {stats.outOfStockAlerts}
                    </p>
                  </div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stats.outOfStockAlerts > 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400'}`}>
                    <AlertTriangle className="w-4.5 h-4.5" />
                  </div>
                </div>
              </div>

              {/* Main Dual Column split: Form left, List right */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                
                {/* Form column (4 units wide) */}
                <div className="xl:col-span-4" id="form-section-wrapper">
                  <ProductForm 
                    onSubmit={handleFormSubmit}
                    editingProduct={editingProduct}
                    onCancelEdit={handleCancelEdit}
                    products={products}
                  />
                </div>

                {/* Catalog List column (8 units wide) */}
                <div className="xl:col-span-8" id="list-section-wrapper">
                  <ProductList 
                    products={products}
                    onEdit={handleEditSelect}
                    onDelete={handleDeleteProduct}
                    editingId={editingProduct?.id}
                  />
                </div>

              </div>

            </div>
          ) : (
            <div className="animate-fade-in" id="docs-tab-view">
              <Documentation />
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
