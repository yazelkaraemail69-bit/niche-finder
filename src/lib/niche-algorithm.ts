// Niş Ürün Puanlama Algoritması
// Bu algoritma her ürüne 0-100 arası bir "niş puanı" verir.
// Yüksek puan = düşük rekabet + yüksek kâr marjı + iyi arama hacmi

export interface ScoreFactors {
  profitMargin: number;       // 0-1 arası (örn: 0.65 = %65)
  competitorCount: number;
  monthlySearchVolume: number;
  trend: 'rising' | 'stable' | 'falling';
  seasonality: 'none' | 'summer' | 'winter' | 'holiday' | 'back-to-school';
  difficulty: 'easy' | 'medium' | 'hard';
}

/**
 * Niş puanı hesaplama algoritması
 * 
 * FORMÜL:
 * 
 * 1. Kârlılık Skoru (0-35 puan)
 *    - %50 üzeri kâr marjı: 35 puan
 *    - %30-50: 25 puan
 *    - %20-30: 15 puan
 *    - %10-20: 8 puan
 *    - %10 altı: 3 puan
 * 
 * 2. Rekabet Skoru (0-30 puan)
 *    - 0-5 rakip: 30 puan
 *    - 5-15 rakip: 22 puan
 *    - 15-30 rakip: 14 puan
 *    - 30-50 rakip: 7 puan
 *    - 50+ rakip: 2 puan
 * 
 * 3. Talep Skoru (0-20 puan)
 *    - 10.000+ aylık arama: 20 puan
 *    - 3.000-10.000: 15 puan
 *    - 1.000-3.000: 10 puan
 *    - 300-1.000: 5 puan
 *    - 300 altı: 2 puan
 * 
 * 4. Trend Bonusu (0-10 puan)
 *    - Yükselen trend: 10 puan
 *    - Dengeli: 5 puan
 *    - Düşen: 0 puan
 * 
 * 5. Zorluk Bonusu (0-5 puan)
 *    - Kolay giriş: 5 puan
 *    - Orta: 3 puan
 *    - Zor: 0 puan
 * 
 * TOPLAM: 0-100 puan
 */
export function calculateNicheScore(factors: ScoreFactors): number {
  // 1. Kârlılık Skoru (max 35)
  let profitScore: number;
  if (factors.profitMargin >= 0.50) profitScore = 35;
  else if (factors.profitMargin >= 0.30) profitScore = 25;
  else if (factors.profitMargin >= 0.20) profitScore = 15;
  else if (factors.profitMargin >= 0.10) profitScore = 8;
  else profitScore = 3;

  // 2. Rekabet Skoru (max 30)
  let competitionScore: number;
  if (factors.competitorCount <= 5) competitionScore = 30;
  else if (factors.competitorCount <= 15) competitionScore = 22;
  else if (factors.competitorCount <= 30) competitionScore = 14;
  else if (factors.competitorCount <= 50) competitionScore = 7;
  else competitionScore = 2;

  // 3. Talep Skoru (max 20)
  let demandScore: number;
  if (factors.monthlySearchVolume >= 10000) demandScore = 20;
  else if (factors.monthlySearchVolume >= 3000) demandScore = 15;
  else if (factors.monthlySearchVolume >= 1000) demandScore = 10;
  else if (factors.monthlySearchVolume >= 300) demandScore = 5;
  else demandScore = 2;

  // 4. Trend Bonusu (max 10)
  let trendScore: number;
  if (factors.trend === 'rising') trendScore = 10;
  else if (factors.trend === 'stable') trendScore = 5;
  else trendScore = 0;

  // 5. Zorluk Bonusu (max 5)
  let difficultyScore: number;
  if (factors.difficulty === 'easy') difficultyScore = 5;
  else if (factors.difficulty === 'medium') difficultyScore = 3;
  else difficultyScore = 0;

  const total = profitScore + competitionScore + demandScore + trendScore + difficultyScore;

  // Mevsimsellik düzeltmesi: mevsimsel ürünler %5 indirim alır
  // (niş sürdürülebilirliğini yansıtmak için)
  if (factors.seasonality !== 'none') {
    return Math.round(total * 0.95);
  }

  return Math.round(total);
}

/**
 * Niche/Volume oranı hesaplar.
 * Bu oran ne kadar yüksekse, arama başına o kadar az rakip var demektir.
 * 
 * Formül: monthlySearchVolume / (competitorCount + 1)
 * 
 * Örnek: 5000 arama / 3 rakip = 1250 (çok iyi niş)
 *        5000 arama / 100 rakip = 49.5 (rekabetçi pazar)
 */
export function calculateNicheVolumeRatio(searchVolume: number, competitorCount: number): number {
  return Math.round(searchVolume / (competitorCount + 1));
}

/**
 * Tahmini aylık kazanç hesaplar
 * Formül: (satışFiyatı - maliyet) * tahminiAylıkSatış
 * Tahmini aylık satış = aylıkAramaHacmi * 0.02 (dönüşüm oranı %2)
 */
export function estimateMonthlyEarnings(
  costPrice: number,
  sellPrice: number,
  monthlySearchVolume: number
): number {
  const estimatedSales = Math.round(monthlySearchVolume * 0.02);
  return Math.round((sellPrice - costPrice) * estimatedSales);
}

/**
 * Niş puanına göre sınıflandırma yapar
 */
export function getNicheScoreLabel(score: number): { label: string; color: string; description: string } {
  if (score >= 80) return {
    label: 'Altın Niş',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    description: 'Hemen gir! Düşük rekabet, yüksek kâr, güçlü talep.'
  };
  if (score >= 65) return {
    label: 'Güçlü Fırsat',
    color: 'text-green-600 bg-green-50 border-green-200',
    description: 'Giriş için ideal. Hızlıca değerlendirilmeli.'
  };
  if (score >= 50) return {
    label: 'Değerlendirilebilir',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    description: 'Araştırmaya değer. Detaylı analiz yapılmalı.'
  };
  if (score >= 35) return {
    label: 'Riskli',
    color: 'text-orange-600 bg-orange-50 border-orange-200',
    description: 'Rekabet yüksek veya kâr düşük olabilir.'
  };
  return {
    label: 'Kaçınılması Önerilir',
    color: 'text-red-600 bg-red-50 border-red-200',
    description: 'Bu pazara girmek şu an mantıklı değil.'
  };
}

/**
 * Kâr marjına göre sınıflandırma
 */
export function getProfitLabel(margin: number): { label: string; color: string } {
  if (margin >= 70) return { label: 'Süper Kârlı', color: 'text-green-600' };
  if (margin >= 50) return { label: 'Yüksek Kârlı', color: 'text-emerald-500' };
  if (margin >= 30) return { label: 'İyi Kârlı', color: 'text-blue-500' };
  if (margin >= 15) return { label: 'Orta Kârlı', color: 'text-yellow-500' };
  return { label: 'Düşük Kârlı', color: 'text-red-500' };
}