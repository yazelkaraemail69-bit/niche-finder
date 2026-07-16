// Ürün Arama ve Filtreleme Motoru

import { NicheProduct, SearchFilters, SearchResult } from './types';
import { nicheProducts } from './product-data';

/**
 * Ürünleri filtreler ve sıralar
 */
export function searchProducts(filters: SearchFilters): SearchResult {
  let results = [...nicheProducts];

  // Metin araması (ürün adı, açıklama, kategori, tag)
  if (filters.query.trim()) {
    const q = filters.query.toLowerCase().trim();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subCategory.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  // Kâr marjı filtresi
  if (filters.minProfitMargin > 0) {
    results = results.filter((p) => p.profitMargin >= filters.minProfitMargin);
  }

  // Rakip sayısı filtresi
  if (filters.maxCompetitorCount < 999) {
    results = results.filter((p) => p.competitorCount <= filters.maxCompetitorCount);
  }

  // Kategori filtresi
  if (filters.categories.length > 0) {
    results = results.filter((p) => filters.categories.includes(p.category));
  }

  // Trend filtresi
  if (filters.trends.length > 0) {
    results = results.filter((p) => filters.trends.includes(p.trend));
  }

  // Mevsimsellik filtresi
  if (filters.seasonality.length > 0) {
    results = results.filter((p) => filters.seasonality.includes(p.seasonality));
  }

  // Zorluk filtresi
  if (filters.difficulty.length > 0) {
    results = results.filter((p) => filters.difficulty.includes(p.difficulty));
  }

  // Niş puanı filtresi
  if (filters.minNicheScore > 0) {
    results = results.filter((p) => p.nicheScore >= filters.minNicheScore);
  }

  // Sıralama
  results.sort((a, b) => {
    let valA: number;
    let valB: number;

    switch (filters.sortBy) {
      case 'nicheScore':
        valA = a.nicheScore;
        valB = b.nicheScore;
        break;
      case 'profitMargin':
        valA = a.profitMargin;
        valB = b.profitMargin;
        break;
      case 'searchVolume':
        valA = a.monthlySearchVolume;
        valB = b.monthlySearchVolume;
        break;
      case 'competitorCount':
        valA = a.competitorCount;
        valB = b.competitorCount;
        break;
      default:
        valA = a.nicheScore;
        valB = b.nicheScore;
    }

    return filters.sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  // Kategori dağılımını hesapla
  const categoryMap = new Map<string, number>();
  results.forEach((p) => {
    categoryMap.set(p.category, (categoryMap.get(p.category) || 0) + 1);
  });

  const topCategories = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Ortalama değerleri hesapla
  const avgMargin =
    results.length > 0
      ? Math.round(results.reduce((sum, p) => sum + p.profitMargin, 0) / results.length)
      : 0;
  const avgScore =
    results.length > 0
      ? Math.round(results.reduce((sum, p) => sum + p.nicheScore, 0) / results.length)
      : 0;

  return {
    products: results,
    total: results.length,
    averageProfitMargin: avgMargin,
    averageNicheScore: avgScore,
    topCategories,
  };
}

/**
 * Varsayılan filtreler
 */
export function getDefaultFilters(): SearchFilters {
  return {
    query: '',
    minProfitMargin: 0,
    maxCompetitorCount: 999,
    categories: [],
    trends: [],
    seasonality: [],
    difficulty: [],
    minNicheScore: 0,
    sortBy: 'nicheScore',
    sortOrder: 'desc',
  };
}