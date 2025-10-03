/**
 * Trending Domains Module
 * Barrel exports for clean imports
 */

// Types
export type {
  TrendingDomain,
  TrendingDomainsResponse,
  TrendingFilters,
  TrendingStats,
  TrendingCategory,
  TrendingCategoryData
} from './types';

// API functions
export {
  fetchTrendingDomains,
  fetchTrendingDomainsEfficient,
  fetchTrendingStats,
  fetchTrendingByCategory
} from './api';

// Utility functions
export {
  formatTimeAgo,
  formatPriceChange,
  getRarityInfo,
  sortDomains,
  filterDomains,
  calculateTrendingScore,
  groupDomainsByTLD,
  getDomainStats,
  validateTrendingDomain,
  cacheKeys
} from './utils';
