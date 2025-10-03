/**
 * Types for Trending Domains functionality
 */

export interface TrendingDomain {
  id: string;
  name: string;
  rarityScore: number;
  marketValue: string;
  volume24h: string;
  priceChange24h: number;
  activityCount: number;
  lastActivity: string;
  isActive: boolean;
}

export interface TrendingDomainsResponse {
  domains: TrendingDomain[];
  totalCount: number;
  lastUpdated: string;
}

export interface TrendingFilters {
  sortBy: 'rarity' | 'volume' | 'activity' | 'price';
  timeframe: '1h' | '24h' | '7d' | '30d';
  minRarityScore?: number;
  maxPrice?: number;
}

export interface TrendingStats {
  totalDomains: number;
  totalVolume: string;
  averageRarity: number;
  topGainer: TrendingDomain | null;
  mostActive: TrendingDomain | null;
}

export type TrendingCategory = 
  | 'recently-active'   // Domains with recent transactions
  | 'high-volume'       // Domains with highest trading volume
  | 'new-listings'      // Recently listed domains
  | 'price-movers'      // Domains with significant price changes
  | 'rarity-leaders';   // Highest rarity score domains

export interface TrendingCategoryData {
  category: TrendingCategory;
  title: string;
  description: string;
  domains: TrendingDomain[];
  icon: string;
}
