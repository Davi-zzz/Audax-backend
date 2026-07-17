import React, { useState, useMemo } from 'react';
import { Search, Edit2, Trash2, Box, PackageOpen, Filter, ArrowUpDown, Tag, Calendar, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  editingId?: string;
}

type StockFilter = 'all' | 'out_of_stock' | 'low_stock' | 'in_stock';
type SortOption = 'recent' | 'name_asc' | 'name_desc' | 'stock_asc' | 'stock_desc';

export default function ProductList({ products, onEdit, onDelete, editingId }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<StockFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('recent');

  // Filter and sort products dynamically
  const processedProducts = useMemo(() => {
    let result = [...products];

    // 1. Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.sku.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // 2. Stock filter
    if (stockFilter === 'out_of_stock') {
      result = result.filter(p => p.stock === 0);
    } else if (stockFilter === 'low_stock') {
      result = result.filter(p => p.stock > 0 && p.stock < 15);
    } else if (stockFilter === 'in_stock') {
      result = result.filter(p => p.stock >= 15);
    }

    // 3. Sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case 'recent':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        case 'stock_asc':
          return a.stock - b.stock;
        case 'stock_desc':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    return result;
  }, [products, searchTerm, stockFilter, sortOption]);

  // Format Date ISO
  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // Helper for stock badge styling
  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
          Esgotado
        </span>
      );
    }
    if (stock < 15) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 border border-amber-100">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Baixo Estoque ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Disponível ({stock})
      </span>
    );
  };

  return (
    <div className="space-y-6" id="product-list-container">
      {/* Search & Filtering Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
        {/* Search & Sort Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="relative md:col-span-8">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por SKU, nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50/60 hover:bg-slate-50 border border-slate-200 focus:border-indigo-400 rounded-xl transition duration-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-100/50 text-slate-800"
              id="search-products-input"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 hover:text-slate-600 bg-slate-200/50 hover:bg-slate-200/80 px-2 py-0.5 rounded-md cursor-pointer"
                id="clear-search-btn"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Sort Selection */}
          <div className="relative md:col-span-4">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400">
              <ArrowUpDown className="w-4 h-4" />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50/60 border border-slate-200 rounded-xl focus:border-indigo-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-100/50 text-slate-700 cursor-pointer appearance-none"
              id="sort-select"
            >
              <option value="recent">Mais Recentes</option>
              <option value="name_asc">Nome: A-Z</option>
              <option value="name_desc">Nome: Z-A</option>
              <option value="stock_asc">Estoque: Menor ao Maior</option>
              <option value="stock_desc">Estoque: Maior ao Menor</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100" id="filter-pills-row">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Filtros de Estoque:
          </span>
          {[
            { id: 'all', label: 'Todos os Itens', count: products.length },
            { id: 'out_of_stock', label: 'Esgotados 🔴', count: products.filter(p => p.stock === 0).length },
            { id: 'low_stock', label: 'Baixo Estoque 🟡', count: products.filter(p => p.stock > 0 && p.stock < 15).length },
            { id: 'in_stock', label: 'Em Abundância 🟢', count: products.filter(p => p.stock >= 15).length }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setStockFilter(pill.id as StockFilter)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition duration-200 font-medium cursor-pointer flex items-center gap-1.5 ${
                stockFilter === pill.id
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
              id={`filter-pill-${pill.id}`}
            >
              <span>{pill.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                stockFilter === pill.id ? 'bg-white/20 text-white' : 'bg-slate-200/60 text-slate-600'
              }`}>
                {pill.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid List of Products */}
      {processedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="products-grid">
          {processedProducts.map((product) => {
            const isEditing = editingId === product.id;
            return (
              <div
                key={product.id}
                className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden group flex flex-col justify-between ${
                  isEditing 
                    ? 'border-indigo-500 ring-2 ring-indigo-50 shadow-md' 
                    : 'border-slate-100 hover:border-slate-200/80 shadow-xs hover:shadow-md'
                }`}
                id={`product-card-${product.id}`}
              >
                {/* Product Image Header */}
                <div className="aspect-video bg-slate-50 relative flex items-center justify-center overflow-hidden border-b border-slate-100/50">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-500"
                    referrerPolicy="no-referrer"
                    id={`product-image-${product.id}`}
                  />
                  
                  {/* SKU Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md text-white py-1 px-2.5 rounded-lg text-[10px] font-mono tracking-wider font-semibold shadow-xs">
                    <Tag className="w-3 h-3 text-indigo-400" />
                    <span>{product.sku}</span>
                  </div>

                  {/* Stock Level Overlay */}
                  <div className="absolute bottom-3 right-3 shadow-xs">
                    {getStockBadge(product.stock)}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-sans font-semibold text-slate-800 group-hover:text-indigo-600 transition duration-200 line-clamp-1" id={`product-title-${product.id}`}>
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 h-8 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Meta Details */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-50">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>Cadastrado: {formatDate(product.createdAt)}</span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-600">
                      <ShoppingBag className="w-3 h-3 text-slate-400" />
                      <span>{product.stock} un.</span>
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100/80 flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className={`p-2 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 transition duration-200 flex items-center justify-center cursor-pointer ${
                      isEditing ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : ''
                    }`}
                    title="Editar Produto"
                    id={`edit-btn-${product.id}`}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Tem certeza que deseja deletar o produto "${product.name}"?`)) {
                        onDelete(product.id);
                      }
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 transition duration-200 flex items-center justify-center cursor-pointer"
                    title="Excluir Produto"
                    id={`delete-btn-${product.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 px-4 text-center shadow-xs" id="no-products-state">
          <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center mb-4 text-slate-400 border border-slate-100">
            {searchTerm ? <PackageOpen className="w-8 h-8 stroke-1" /> : <Box className="w-8 h-8 stroke-1" />}
          </div>
          <h3 className="text-slate-800 font-semibold text-base mb-1">
            {searchTerm ? 'Nenhum produto corresponde à busca' : 'Nenhum produto cadastrado'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            {searchTerm 
              ? 'Tente ajustar os termos de pesquisa ou remover as pílulas de filtros selecionadas.' 
              : 'Comece preenchendo o formulário ao lado para cadastrar seu primeiro item no catálogo.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStockFilter('all');
              }}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 px-3.5 py-1.8 rounded-xl transition duration-200 cursor-pointer"
              id="reset-search-state-btn"
            >
              Resetar Filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}
