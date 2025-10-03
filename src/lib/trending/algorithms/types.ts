/**
 * Trending Algorithm Types
 */

export interface TrendingAlgorithmConfig {
  limit: number;
  timeframes?: {
    veryRecent: number; // 0-7 days
    recent: number;     // 8-30 days
    medium: number;     // 31-90 days
    older: number;      // 90+ days
  };
  weights?: {
    length: number;
    tld: number;
    cryptoTerms: number;
    activity: number;
    recency: number;
  };
  filters?: {
    minScore: number;
    requireActivity: boolean;
  };
}

export interface TrendingAlgorithm {
  name: string;
  description: string;
  execute(domains: any[], config: TrendingAlgorithmConfig): any[];
}

export interface DomainScore {
  total: number;
  breakdown: {
    length: number;
    tld: number;
    cryptoTerms: number;
    activity: number;
    recency: number;
    premium: number;
  };
}
