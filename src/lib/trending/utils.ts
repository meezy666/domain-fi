/**
 * Utility functions for trending domains
 */

import type { TrendingDomain, TrendingFilters } from './types';

/**
 * Format time ago from timestamp
 */
export function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return past.toLocaleDateString();
}

/**
 * Format price change with color coding
 */
export function formatPriceChange(change: number): {
  formatted: string;
  color: string;
  isPositive: boolean;
} {
  const isPositive = change >= 0;
  const formatted = `${isPositive ? '+' : ''}${change.toFixed(1)}%`;
  
  return {
    formatted,
    color: isPositive ? 'text-green-400' : 'text-red-400',
    isPositive
  };
}

/**
 * Get rarity score color and label
 */
export function getRarityInfo(score: number): {
  color: string;
  label: string;
  bgColor: string;
} {
  if (score >= 95) {
    return {
      color: 'text-purple-400',
      label: 'Legendary',
      bgColor: 'bg-purple-500/20'
    };
  } else if (score >= 85) {
    return {
      color: 'text-yellow-400',
      label: 'Epic',
      bgColor: 'bg-yellow-500/20'
    };
  } else if (score >= 75) {
    return {
      color: 'text-blue-400',
      label: 'Rare',
      bgColor: 'bg-blue-500/20'
    };
  } else if (score >= 65) {
    return {
      color: 'text-green-400',
      label: 'Uncommon',
      bgColor: 'bg-green-500/20'
    };
  } else {
    return {
      color: 'text-neutral-400',
      label: 'Common',
      bgColor: 'bg-neutral-500/20'
    };
  }
}

/**
 * Sort domains by various criteria
 */
export function sortDomains(
  domains: TrendingDomain[],
  sortBy: TrendingFilters['sortBy']
): TrendingDomain[] {
  const sorted = [...domains];
  
  switch (sortBy) {
    case 'rarity':
      return sorted.sort((a, b) => b.rarityScore - a.rarityScore);
      
    case 'volume':
      return sorted.sort((a, b) => {
        const volumeA = parseFloat(a.volume24h.replace(/[$K,M]/g, ''));
        const volumeB = parseFloat(b.volume24h.replace(/[$K,M]/g, ''));
        return volumeB - volumeA;
      });
      
    case 'activity':
      return sorted.sort((a, b) => b.activityCount - a.activityCount);
      
    case 'price':
      return sorted.sort((a, b) => b.priceChange24h - a.priceChange24h);
      
    default:
      return sorted;
  }
}

/**
 * Filter domains by criteria
 */
export function filterDomains(
  domains: TrendingDomain[],
  filters: Partial<TrendingFilters>
): TrendingDomain[] {
  let filtered = [...domains];
  
  if (filters.minRarityScore) {
    filtered = filtered.filter(d => d.rarityScore >= filters.minRarityScore!);
  }
  
  if (filters.maxPrice) {
    filtered = filtered.filter(d => {
      const price = parseFloat(d.marketValue.replace(/[$K,M]/g, ''));
      return price <= filters.maxPrice!;
    });
  }
  
  return filtered;
}

/**
 * Calculate trending score based on multiple factors
 */
export function calculateTrendingScore(domain: TrendingDomain): number {
  const rarityWeight = 0.3;
  const volumeWeight = 0.25;
  const activityWeight = 0.25;
  const priceChangeWeight = 0.2;
  
  // Normalize values to 0-100 scale
  const normalizedRarity = domain.rarityScore;
  const normalizedVolume = Math.min(parseFloat(domain.volume24h.replace(/[$K,M]/g, '')), 100);
  const normalizedActivity = Math.min(domain.activityCount * 5, 100);
  const normalizedPriceChange = Math.max(0, domain.priceChange24h + 10) * 5; // Convert -10 to +10 range to 0-100
  
  return (
    normalizedRarity * rarityWeight +
    normalizedVolume * volumeWeight +
    normalizedActivity * activityWeight +
    normalizedPriceChange * priceChangeWeight
  );
}

/**
 * Group domains by TLD
 */
export function groupDomainsByTLD(domains: TrendingDomain[]): Record<string, TrendingDomain[]> {
  return domains.reduce((groups, domain) => {
    const tld = domain.name.split('.').pop() || 'unknown';
    if (!groups[tld]) {
      groups[tld] = [];
    }
    groups[tld].push(domain);
    return groups;
  }, {} as Record<string, TrendingDomain[]>);
}

/**
 * Get domain statistics
 */
export function getDomainStats(domains: TrendingDomain[]) {
  const totalVolume = domains.reduce((sum, domain) => {
    return sum + parseFloat(domain.volume24h.replace(/[$K,M]/g, ''));
  }, 0);
  
  const averageRarity = domains.reduce((sum, domain) => {
    return sum + domain.rarityScore;
  }, 0) / domains.length;
  
  const totalActivity = domains.reduce((sum, domain) => {
    return sum + domain.activityCount;
  }, 0);
  
  const activeDomains = domains.filter(d => d.isActive).length;
  
  return {
    totalDomains: domains.length,
    totalVolume: `$${totalVolume.toFixed(1)}K`,
    averageRarity: Math.round(averageRarity),
    totalActivity,
    activeDomains,
    activityRate: (activeDomains / domains.length) * 100
  };
}

/**
 * Validate trending domain data
 */
export function validateTrendingDomain(domain: unknown): domain is TrendingDomain {
  const typedDomain = domain as Record<string, unknown>;
  return (
    typeof typedDomain.id === 'string' &&
    typeof typedDomain.name === 'string' &&
    typeof typedDomain.rarityScore === 'number' &&
    typeof typedDomain.marketValue === 'string' &&
    typeof typedDomain.volume24h === 'string' &&
    typeof typedDomain.priceChange24h === 'number' &&
    typeof typedDomain.activityCount === 'number' &&
    typeof typedDomain.lastActivity === 'string' &&
    typeof typedDomain.isActive === 'boolean'
  );
}

/**
 * Cache key generators
 */
export const cacheKeys = {
  trendingDomains: (limit: number, filters?: TrendingFilters) => 
    `trending-domains-${limit}-${JSON.stringify(filters || {})}`,
  trendingStats: () => 'trending-stats',
  trendingByCategory: (category: string, limit: number) => 
    `trending-category-${category}-${limit}`
};
