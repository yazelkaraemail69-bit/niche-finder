'use client';

import { useState, useMemo, useCallback } from 'react';
import { SearchFilters, NicheProduct, CATEGORIES } from '@/lib/types';
import { searchProducts, getDefaultFilters } from '@/lib/search';
import {
  calculateNicheVolumeRatio,
  estimateMonthlyEarnings,
  getNicheScoreLabel,
  getProfitLabel,
} from '@/lib/niche-algorithm';

export default function Home() {
  const [filters, setFilters] = useState<SearchFilters>(getDefaultFilters());
  const [showFilters, setShowFilters] = useState(false);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const handleFilterChange = useCallback(
    (partial: Partial<SearchFilters>) => {
      setFilters((prev) => ({ ...prev, ...partial }));
    },
    []
  );

  const toggleCategory = useCallback(
    (cat: string) => {
      setFilters((prev) => ({
        ...prev,
        categories: prev.categories.includes(cat)
          ? prev.categories.filter((c) => c !== cat)
          : [...prev.categories, cat],
      }));
    },
    []
  );

  const toggleTrend = useCallback(
    (t: string) => {
      setFilters((prev) => ({
        ...prev,
        trends: prev.trends.includes(t)
          ? prev.trends.filter((x) => x !== t)
          : [...prev.trends, t],
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(getDefaultFilters());
    setExpandedProduct(null);
  }, []);

  const result = useMemo(() => searchProducts(filters), [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🔍</span>
              <div>
                <h1 className="text-xl font-bold text-slate-800">Niş Ürün Bulucu</h1>
                <p className="text-xs text-slate-500">Yüksek kâr marjlı, düşük rekabetli fırsatları keşfet</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  showFilters
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>⚙️</span> Filtrele
                {filters.categories.length > 0 && (
                  <span className="bg-white/30 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {filters.categories.length}
                  </span>
                )}
              </button>
              <div className="hidden sm:flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                <span className="text-green-600 font-semibold">{result.total}</span>
                <span className="text-green-700">niş ürün</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
            <p className="text-2xl font-bold text-amber-600">{result.total}</p>
            <p className="text-xs text-slate-500">Ürün Bulundu</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
            <p className="text-2xl font-bold text-green-600">%{result.averageProfitMargin}</p>
            <p className="text-xs text-slate-500">Ort. Kâr Marjı</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
            <p className="text-2xl font-bold text-blue-600">{result.averageNicheScore}</p>
            <p className="text-xs text-slate-500">Ort. Niş Puanı</p>
          </div>
          <div className="bg-white rounded-xl p-3 border border-slate-200 text-center">
            <p className="text-sm font-bold text-purple-600 truncate">
              {result.topCategories[0]?.category || '-'}
            </p>
            <p className="text-xs text-slate-500">En Çok Kategori</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12 flex gap-6">
        {/* Filters Panel */}
        {showFilters && (
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-5">
              <FilterPanelContent
                filters={filters}
                onFilterChange={handleFilterChange}
                toggleCategory={toggleCategory}
                toggleTrend={toggleTrend}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        )}

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800">Filtreler</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="text-slate-400 hover:text-slate-600 text-xl"
                >
                  ✕
                </button>
              </div>
              <FilterPanelContent
                filters={filters}
                onFilterChange={handleFilterChange}
                toggleCategory={toggleCategory}
                toggleTrend={toggleTrend}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Ürün, kategori veya etiket ile ara..."
                value={filters.query}
                onChange={(e) => handleFilterChange({ query: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <span className="absolute left-3 top-2.5 text-slate-400">🔎</span>
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                handleFilterChange({ sortBy: e.target.value as SearchFilters['sortBy'] })
              }
              className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="nicheScore">Niş Puanına Göre</option>
              <option value="profitMargin">Kâr Marjına Göre</option>
              <option value="searchVolume">Arama Hacmine Göre</option>
              <option value="competitorCount">Rakip Sayısına Göre</option>
            </select>
            <button
              onClick={() =>
                handleFilterChange({
                  sortOrder: filters.sortOrder === 'desc' ? 'asc' : 'desc',
                })
              }
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm hover:bg-slate-50"
            >
              {filters.sortOrder === 'desc' ? '↓ Azalan' : '↑ Artan'}
            </button>
          </div>

          {/* Product Cards */}
          {result.products.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-6xl">📦</span>
              <p className="text-slate-500 mt-4 text-lg">Aramanızla eşleşen ürün bulunamadı.</p>
              <button
                onClick={resetFilters}
                className="mt-3 text-amber-600 hover:text-amber-700 font-medium text-sm underline"
              >
                Filtreleri sıfırla
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {result.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isExpanded={expandedProduct === product.id}
                  onToggle={() =>
                    setExpandedProduct(expandedProduct === product.id ? null : product.id)
                  }
                />
              ))}
            </div>
          )}

          {/* Empty state for filters but no results */}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-slate-500">
          <p>
            <strong>Niş Ürün Bulucu</strong> — Veriler pazar araştırmalarına dayalı örnek verilerdir.
            Gerçek piyasa koşulları değişiklik gösterebilir.
          </p>
          <p className="mt-1">
            📌 <strong>Nasıl Kullanılır:</strong> Ürünleri inceleyin, tedarikçi önerilerine bakın, yüksek niş puanlı
            ürünlerle işe başlayın.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ================================================================
   FİLTRE PANELİ İÇERİĞİ
   ================================================================ */
function FilterPanelContent({
  filters,
  onFilterChange,
  toggleCategory,
  toggleTrend,
  resetFilters,
}: {
  filters: SearchFilters;
  onFilterChange: (partial: Partial<SearchFilters>) => void;
  toggleCategory: (cat: string) => void;
  toggleTrend: (t: string) => void;
  resetFilters: () => void;
}) {
  return (
    <>
      {/* Kâr Marjı */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          💰 Minimum Kâr Marjı: <span className="text-amber-600">%{filters.minProfitMargin}</span>
        </label>
        <input
          type="range"
          min="0"
          max="80"
          step="5"
          value={filters.minProfitMargin}
          onChange={(e) => onFilterChange({ minProfitMargin: Number(e.target.value) })}
          className="w-full accent-amber-500"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>%0</span>
          <span>%40</span>
          <span>%80</span>
        </div>
      </div>

      {/* Rakip Sayısı */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          🏪 Maks. Rakip: <span className="text-blue-600">{filters.maxCompetitorCount === 999 ? 'Sınırsız' : filters.maxCompetitorCount}</span>
        </label>
        <input
          type="range"
          min="2"
          max="50"
          step="1"
          value={filters.maxCompetitorCount === 999 ? 50 : filters.maxCompetitorCount}
          onChange={(e) =>
            onFilterChange({
              maxCompetitorCount: Number(e.target.value) === 50 ? 999 : Number(e.target.value),
            })
          }
          className="w-full accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>2</span>
          <span>25</span>
          <span>50+</span>
        </div>
      </div>

      {/* Min Niş Puanı */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          ⭐ Min. Niş Puanı: <span className="text-purple-600">{filters.minNicheScore}</span>
        </label>
        <input
          type="range"
          min="0"
          max="90"
          step="5"
          value={filters.minNicheScore}
          onChange={(e) => onFilterChange({ minNicheScore: Number(e.target.value) })}
          className="w-full accent-purple-500"
        />
      </div>

      {/* Kategoriler */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-2">📂 Kategoriler</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => toggleCategory(cat.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all ${
                filters.categories.includes(cat.name)
                  ? 'bg-amber-100 text-amber-800 font-medium'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span className="mr-2">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Trend */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-2">📈 Trend</h4>
        <div className="flex gap-2">
          {[
            { key: 'rising', label: 'Yükselen 📈', activeClass: 'bg-green-100 text-green-700 border-green-300' },
            { key: 'stable', label: 'Dengeli 📊', activeClass: 'bg-blue-100 text-blue-700 border-blue-300' },
            { key: 'falling', label: 'Düşen 📉', activeClass: 'bg-red-100 text-red-700 border-red-300' },
          ].map(({ key, label, activeClass }) => (
            <button
              key={key}
              onClick={() => toggleTrend(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.trends.includes(key)
                  ? activeClass
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Zorluk */}
      <div>
        <h4 className="text-sm font-semibold text-slate-700 mb-2">🔧 Giriş Zorluğu</h4>
        <div className="flex gap-2">
          {[
            { key: 'easy', label: 'Kolay 😊' },
            { key: 'medium', label: 'Orta 🤔' },
            { key: 'hard', label: 'Zor 😰' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() =>
                onFilterChange({
                  difficulty: filters.difficulty.includes(key)
                    ? filters.difficulty.filter((d) => d !== key)
                    : [...filters.difficulty, key],
                })
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filters.difficulty.includes(key)
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="w-full py-2.5 mt-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-medium transition-all"
      >
        🔄 Filtreleri Sıfırla
      </button>
    </>
  );
}

/* ================================================================
   ÜRÜN KARTI
   ================================================================ */
function ProductCard({
  product,
  isExpanded,
  onToggle,
}: {
  product: NicheProduct;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const scoreLabel = getNicheScoreLabel(product.nicheScore);
  const profitLabel = getProfitLabel(product.profitMargin);
  const nicheVolume = calculateNicheVolumeRatio(product.monthlySearchVolume, product.competitorCount);
  const monthlyEarnings = estimateMonthlyEarnings(
    product.costPrice,
    product.sellPrice,
    product.monthlySearchVolume
  );

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isExpanded ? 'shadow-lg border-amber-300 ring-2 ring-amber-200' : 'border-slate-200'
      }`}
      onClick={onToggle}
    >
      {/* Card Header */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">
            {product.name}
          </h3>
          <span
            className={`shrink-0 text-xs font-bold px-2 py-1 rounded-full border ${scoreLabel.color}`}
          >
            {scoreLabel.label}
          </span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="bg-green-50 rounded-lg p-2 text-center">
            <p className={`text-base font-bold ${profitLabel.color}`}>%{product.profitMargin}</p>
            <p className="text-[10px] text-slate-500">Kâr Marjı</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-2 text-center">
            <p className="text-base font-bold text-blue-600">{product.nicheScore}</p>
            <p className="text-[10px] text-slate-500">Niş Puanı</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-2 text-center">
            <p className="text-base font-bold text-purple-600">{product.competitorCount}</p>
            <p className="text-[10px] text-slate-500">Rakip</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-2 text-center">
            <p className="text-base font-bold text-orange-600">{product.trendScore}</p>
            <p className="text-[10px] text-slate-500">Trend Gücü</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3">
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
            {product.category}
          </span>
          <span className="text-xs text-slate-400">
            {product.monthlySearchVolume.toLocaleString('tr-TR')} arama/ay
          </span>
        </div>
      </div>

      {/* Expanded Detail */}
      {isExpanded && (
        <div className="border-t border-slate-100 p-4 space-y-3 bg-slate-50/50 rounded-b-2xl">
          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

          {/* Financial Details */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-3 border border-slate-100">
              <p className="text-xs text-slate-400">Maliyet</p>
              <p className="text-lg font-bold text-red-500">{product.costPrice} ₺</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-100">
              <p className="text-xs text-slate-400">Satış Fiyatı</p>
              <p className="text-lg font-bold text-green-600">{product.sellPrice} ₺</p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-100">
              <p className="text-xs text-slate-400">Birim Kâr</p>
              <p className="text-lg font-bold text-emerald-600">
                {product.sellPrice - product.costPrice} ₺
              </p>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-100">
              <p className="text-xs text-slate-400">Tah. Aylık Kazanç</p>
              <p className="text-lg font-bold text-amber-600">
                {monthlyEarnings.toLocaleString('tr-TR')} ₺
              </p>
            </div>
          </div>

          {/* Niche/Volume Ratio */}
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
            <p className="text-xs text-amber-600 font-semibold mb-1">
              📊 Niş/Hacim Oranı: <span className="text-lg font-bold">{nicheVolume.toLocaleString('tr-TR')}</span>
            </p>
            <p className="text-[10px] text-amber-700">
              Arama başına düşen rakip sayısı. 500+ idealdir, ne kadar yüksekse pazar o kadar boştur.
            </p>
          </div>

          {/* Supplier Tip */}
          <div className="bg-blue-50 rounded-xl p-3 border border-blue-200">
            <p className="text-xs text-blue-600 font-semibold mb-1">💡 Tedarikçi Önerisi</p>
            <p className="text-xs text-blue-800">{product.supplierTip}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Source */}
          <p className="text-[10px] text-slate-400">
            📍 Kaynak: {product.source} | Trend: {product.trend === 'rising' ? '📈 Yükselen' : product.trend === 'stable' ? '📊 Dengeli' : '📉 Düşen'} | Zorluk: {product.difficulty === 'easy' ? '😊 Kolay' : product.difficulty === 'medium' ? '🤔 Orta' : '😰 Zor'}
          </p>

          {/* Google Trends Link */}
          <a
            href={product.googleTrendsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-red-50 to-amber-50 hover:from-red-100 hover:to-amber-100 border border-red-200 text-red-700 rounded-xl text-xs font-semibold transition-all"
          >
            <span>📈</span>
            Google Trends'te Bu Ürünü İncele
            <span className="text-[10px] bg-white/70 px-1.5 py-0.5 rounded-full text-red-600">
              TR
            </span>
          </a>
        </div>
      )}
    </div>
  );
}
