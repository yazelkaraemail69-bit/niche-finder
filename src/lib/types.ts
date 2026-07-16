// Niş Ürün Bulucu - Veri Tipleri

export interface NicheProduct {
  id: string;
  name: string;
  category: string;
  subCategory: string;
  costPrice: number;       // TL - ürün maliyeti
  sellPrice: number;       // TL - satış fiyatı
  profitMargin: number;    // yüzde
  competitorCount: number; // rakip satıcı sayısı
  monthlySearchVolume: number; // aylık arama hacmi
  trend: 'rising' | 'stable' | 'falling';
  seasonality: 'none' | 'summer' | 'winter' | 'holiday' | 'back-to-school';
  difficulty: 'easy' | 'medium' | 'hard';
  source: string;          // ürünün bulunduğu platform
  sourceUrl?: string;
  nicheScore: number;      // 0-100 arası hesaplanan niş puanı
  tags: string[];
  description: string;
  supplierTip: string;     // tedarikçi önerisi
}

export interface SearchFilters {
  query: string;
  minProfitMargin: number;
  maxCompetitorCount: number;
  categories: string[];
  trends: string[];
  seasonality: string[];
  difficulty: string[];
  minNicheScore: number;
  sortBy: 'nicheScore' | 'profitMargin' | 'searchVolume' | 'competitorCount';
  sortOrder: 'asc' | 'desc';
}

export interface SearchResult {
  products: NicheProduct[];
  total: number;
  averageProfitMargin: number;
  averageNicheScore: number;
  topCategories: { category: string; count: number }[];
}

export interface CategoryInfo {
  name: string;
  icon: string;
  subCategories: string[];
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'Ev & Yaşam',
    icon: '🏠',
    subCategories: ['Dekorasyon', 'Mutfak Gereçleri', 'Organizasyon', 'Aydınlatma', 'Banyo', 'Bahçe'],
  },
  {
    name: 'Anne & Bebek',
    icon: '👶',
    subCategories: ['Oyuncak', 'Beslenme', 'Güvenlik', 'Eğitici Materyal', 'Bebek Odası'],
  },
  {
    name: 'Spor & Outdoor',
    icon: '🏕️',
    subCategories: ['Kamp', 'Fitness', 'Bisiklet', 'Su Sporları', 'Koşu'],
  },
  {
    name: 'Evcil Hayvan',
    icon: '🐾',
    subCategories: ['Kedi', 'Köpek', 'Akvaryum', 'Kuş', 'Küçük Hayvan'],
  },
  {
    name: 'Hobi & El Sanatları',
    icon: '🎨',
    subCategories: ['Resim', 'Takı Yapımı', 'Modelleme', 'Örgü', 'DIY Kitleri'],
  },
  {
    name: 'Teknoloji & Aksesuar',
    icon: '📱',
    subCategories: ['Telefon', 'Bilgisayar', 'Giyilebilir', 'Oyun', 'Kablo & Adaptör'],
  },
  {
    name: 'Sağlık & Bakım',
    icon: '💆',
    subCategories: ['Cilt Bakımı', 'Saç Bakımı', 'Ağız Bakımı', 'Masaj', 'Aromaterapi'],
  },
  {
    name: 'Otomotiv & Motosiklet',
    icon: '🏍️',
    subCategories: ['Aksesuar', 'Bakım', 'Tuning', 'Motosiklet Ekipmanı'],
  },
  {
    name: 'Parti & Organizasyon',
    icon: '🎉',
    subCategories: ['Parti Malzemeleri', 'Balon', 'Hediye Paketleme', 'Kostüm'],
  },
  {
    name: 'Kitap & Kırtasiye',
    icon: '📚',
    subCategories: ['Defter', 'Kalem', 'Planlayıcı', 'Sanatsal Malzeme'],
  },
];