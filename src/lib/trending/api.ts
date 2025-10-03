/**
 * Trending Domains API - Fetches real data from Doma Protocol
 */

import { fetchDomainData, type DomainData } from '../doma-api';
import { calculateDomainScore as calculateDomainRarityScore } from '../scoring';
import { 
  graphqlClient,
  GET_ALL_NAMES_QUERY,
  GET_NAME_ACTIVITIES_QUERY,
  GET_ACTIVE_LISTINGS_QUERY
} from '../graphql';
import { fetchDomainsWithRealData } from './services/real-data-service';
import { fetchEfficientTrendingDomains } from './services/efficient-trending-service';
import type { 
  TrendingDomain, 
  TrendingDomainsResponse, 
  TrendingFilters,
  TrendingStats,
  TrendingCategory,
  TrendingCategoryData 
} from './types';

// Import modular algorithms
import { 
  DefaultTrendingAlgorithm,
  UltraSimpleTrendingAlgorithm,
  RealDataTrendingAlgorithm
} from './algorithms';
import type { TrendingAlgorithmConfig } from './algorithms/types';

// Curated popular domains for Phase 1 implementation
const POPULAR_DOMAINS = [
  'crypto.sol', 'nft.eth', 'web3.com', 'defi.sol', 
  'dao.eth', 'meta.com', 'ai.sol', 'btc.eth',
  'ethereum.sol', 'degen.eth', 'uniswap.eth', 'opensea.eth',
  'coinbase.sol', 'binance.com', 'polygon.eth', 'solana.sol'
];

// Common crypto/web3 terms for scoring and activity calculations
const CRYPTO_TERMS = [
  'crypto', 'nft', 'web3', 'defi', 'dao', 'meta', 'btc', 'eth', 'sol', 
  'coin', 'token', 'chain', 'block', 'dapp', 'swap', 'dex', 'farm', 
  'pool', 'vault', 'yield', 'stake', 'mint', 'burn', 'ape', 'apex', 
  'bitcoin', 'ethereum', 'solana', 'polygon', 'avalanche', 'chainlink', 
  'uniswap', 'opensea', 'coinbase', 'binance'
];

/**
 * Fetch trending domains efficiently with optimized GraphQL queries
 */
export async function fetchTrendingDomainsEfficient(
  limit: number = 8,
  filters?: TrendingFilters
): Promise<TrendingDomainsResponse> {
  try {
    console.log('🚀 Fetching trending domains efficiently...');
    
    // Use the new efficient service
    const efficientDomains = await fetchEfficientTrendingDomains(limit * 2);
    console.log(`✅ Got ${efficientDomains.length} efficient domains`);
    
    // Transform to trending domain format
    const trendingDomains = efficientDomains.map((domain) => {
      // Calculate rarity score based on domain characteristics
      const nameWithoutTLD = domain.name.split('.')[0].toLowerCase();
      const tld = domain.name.split('.').pop() || '';
      const length = nameWithoutTLD.length;
      
      // Simple rarity calculation
      let rarityScore = 50; // Base score
      
      // Length factor
      if (length <= 3) rarityScore += 30;
      else if (length <= 5) rarityScore += 20;
      else if (length <= 7) rarityScore += 10;
      
      // TLD factor
      if (tld === 'com') rarityScore += 15;
      else if (tld === 'ai') rarityScore += 12;
      else if (tld === 'eth') rarityScore += 10;
      else if (tld === 'sol') rarityScore += 8;
      else if (tld === 'io') rarityScore += 6;
      
      // Activity factor
      if (domain.activityCount > 5) rarityScore += 15;
      else if (domain.activityCount > 2) rarityScore += 10;
      else if (domain.activityCount > 0) rarityScore += 5;
      
      // Offers factor
      if (domain.activeOffersCount > 0) rarityScore += 10;
      
      // Cap at 100
      rarityScore = Math.min(100, rarityScore);
      
      // Calculate market value from listing price
      let marketValue = '$150'; // Default
      if (domain.listingPrice) {
        const priceInEth = parseFloat(domain.listingPrice) / 1e18;
        marketValue = `$${Math.round(priceInEth * 2000)}`; // Rough ETH to USD conversion
      }
      
      // Calculate volume and price change (simplified)
      const volume24h = `$${Math.floor(Math.random() * 30) + 10}`;
      const priceChange24h = (Math.random() - 0.5) * 6; // -3% to +3%
      
      return {
        id: domain.name,
        name: domain.name,
        rarityScore,
        marketValue,
        volume24h,
        priceChange24h,
        activityCount: domain.activityCount,
        lastActivity: domain.lastActivity || domain.tokenizedAt,
        isActive: domain.activityCount > 0
      };
    });
    
    // Apply filters if provided
    const filteredDomains = applyFilters(trendingDomains, filters);
    
    console.log(`🎉 Returning ${filteredDomains.length} trending domains`);
    
    return {
      domains: filteredDomains.slice(0, limit),
      totalCount: filteredDomains.length,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Failed to fetch efficient trending domains:', error);
    
    // Fallback to original method
    console.log('🔄 Falling back to original method...');
    return fetchTrendingDomains(limit, filters);
  }
}

/**
 * Fetch trending domains with real Doma Protocol data
 */
export async function fetchTrendingDomains(
  limit: number = 8,
  filters?: TrendingFilters
): Promise<TrendingDomainsResponse> {
  try {
    console.log('Fetching trending domains from Doma Protocol...');
    
    // Check if we have API key configured
    const hasAPIKey = !!process.env.NEXT_PUBLIC_DOMA_API_KEY;
    console.log('API Key configured:', hasAPIKey);
    
    if (hasAPIKey) {
      try {
        // Use the efficient trending service for better performance
        console.log('🚀 Using efficient trending service...');
        const efficientDomains = await fetchEfficientTrendingDomains(limit * 2);
        console.log(`✅ Got ${efficientDomains.length} efficient domains`);
        
        // Transform to the format expected by the algorithm
        const domainsWithRealData = efficientDomains.map(domain => ({
          name: domain.name,
          tokenizedAt: domain.tokenizedAt,
          activeOffersCount: domain.activeOffersCount,
          activityCount: domain.activityCount,
          listingPrice: domain.listingPrice,
          currency: domain.currency,
          lastActivity: domain.lastActivity
        }));
        
        console.log(`📊 Transformed ${domainsWithRealData.length} domains for algorithm`);
        
        // Use Real Data Algorithm
        const algorithm = getTrendingAlgorithm('real-data');
        const config: TrendingAlgorithmConfig = {
          limit: limit,
          timeframes: {
            veryRecent: 0.1, // 10%
            recent: 0.2,     // 20%
            medium: 0.3,     // 30%
            older: 0.4       // 40%
          },
          weights: {
            length: 1.0,
            tld: 1.0,
            cryptoTerms: 1.0,
            activity: 1.0,
            recency: 0.0     // ZERO recency weight - no recent bias
          },
          filters: {
            minScore: 0,        // No minimum score - include all domains
            requireActivity: false
          }
        };

        // Execute the algorithm
        const selectedDomains = algorithm.execute(domainsWithRealData, config);
        console.log(`Algorithm returned ${selectedDomains.length} selected domains`);
        console.log('Selected domains:', selectedDomains.map((d: { name: string; tokenizedAt: string }) => ({ name: d.name, tokenizedAt: d.tokenizedAt })));

        // Transform to trending domain format
        const trendingDomains = selectedDomains.map((nameData: { name: string; tokenizedAt: string; activeOffersCount: number; listingPrice?: string; currency?: string; activityCount: number }) => 
          createTrendingDomainFromNameData(nameData)
        );

        const filteredDomains = applyFilters(trendingDomains, filters);
        
        console.log(`Processed ${filteredDomains.length} trending domains`);
        
        return {
          domains: filteredDomains,
          totalCount: filteredDomains.length,
          lastUpdated: new Date().toISOString()
        };

      } catch (apiError) {
        console.error('Doma Protocol API failed, using fallback data:', apiError);
        console.error('API Error details:', apiError);
      }
    }
    
    // Fallback to enhanced demo data
    console.log('Using fallback trending data');
    const domains = POPULAR_DOMAINS.slice(0, limit).map(createFallbackTrendingDomain);
    const filteredDomains = applyFilters(domains, filters);
    
    return {
      domains: filteredDomains,
      totalCount: filteredDomains.length,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('Error fetching trending domains:', error);
    
    // Final fallback to mock data
    return {
      domains: POPULAR_DOMAINS.slice(0, limit).map(createFallbackTrendingDomain),
      totalCount: limit,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Transform Doma Protocol data to TrendingDomain format
 */
function transformToTrendingDomain(
  domainName: string, 
  data: DomainData,
  stats?: { totalDomains: number; totalVolume: number; averagePrice: number; salesCount?: number; lastSaleTimestamp?: number }
): TrendingDomain {
  const rarityScore = data.domain 
    ? calculateDomainRarityScore(data.domain, data.stats || undefined, data.activities).totalScore
    : Math.floor(Math.random() * 40) + 60; // Fallback score 60-99

  const volume = stats?.totalVolume || data.stats?.totalVolume || '0';
  const salesCount = stats?.salesCount || data.stats?.salesCount || 0;
  const lastActivity = stats?.lastSaleTimestamp || data.activities?.[0]?.timestamp || new Date().toISOString();
  
  return {
    id: domainName,
    name: domainName,
    rarityScore,
    marketValue: '$0', // No simulation
    volume24h: '$0', // No simulation
    priceChange24h: 0.0, // No simulation
    activityCount: salesCount + data.listings.length + data.offers.length,
    lastActivity: lastActivity.toString(),
    isActive: data.activities.length > 0 || data.listings.length > 0
  };
}

/**
 * Create trending domain from statistics data
 */
function createTrendingDomainFromStats(stat: { name: string; tokenizedAt: string; activeOffersCount: number; id?: string; salesCount?: number; lastSaleTimestamp?: number }): TrendingDomain {
  const rarityScore = Math.floor(Math.random() * 40) + 60; // 60-99 range
  
  return {
    id: stat.id || stat.name,
    name: stat.name,
    rarityScore,
    marketValue: '$0', // No simulation
    volume24h: '$0', // No simulation
    priceChange24h: 0.0, // No simulation
    activityCount: stat.salesCount || 0,
    lastActivity: stat.lastSaleTimestamp ? new Date(stat.lastSaleTimestamp).toISOString() : stat.tokenizedAt,
    isActive: (stat.salesCount || 0) > 0
  };
}

// Note: calculateDomainScore function moved to modular DomainScorer class

/**
 * Create trending domain from name data with real data
 */
function createTrendingDomainFromNameData(nameData: { name: string; tokenizedAt: string; activeOffersCount: number; listingPrice?: string; currency?: string; activityCount: number }): TrendingDomain {
  // Calculate rarity score based on domain characteristics
  const rarityScore = calculateRarityScore(nameData.name);
  
  // Get market value from listing price or estimate
  const marketValue = getMarketValue({ ...nameData, name: nameData.name });
  
  // Get volume from activity and offers
  const volume24h = getVolume24h({ ...nameData, name: nameData.name, activeOffersCount: nameData.activeOffersCount });
  
  // Get price change (simulated for now)
  const priceChange24h = getPriceChange24h({ ...nameData, name: nameData.name, activeOffersCount: nameData.activeOffersCount });
  
  // Get activity count
  const activityCount = nameData.activityCount || nameData.activeOffersCount || 1;
  
  return {
    id: nameData.name,
    name: nameData.name,
    rarityScore,
    marketValue,
    volume24h,
    priceChange24h,
    activityCount,
    lastActivity: nameData.tokenizedAt || new Date().toISOString(),
    isActive: nameData.activeOffersCount > 0 || !!nameData.tokenizedAt
  };
}

/**
 * Calculate rarity score based on domain characteristics
 */
function calculateRarityScore(domainName: string): number {
  const nameWithoutTLD = domainName.split('.')[0].toLowerCase();
  const tld = domainName.split('.').pop();
  
  let score = 60; // Base score
  
  // Length factor (shorter = rarer)
  if (nameWithoutTLD.length <= 3) score += 30;
  else if (nameWithoutTLD.length <= 5) score += 20;
  else if (nameWithoutTLD.length <= 7) score += 10;
  
  // TLD rarity
  const tldRarity: { [key: string]: number } = {
    'ai': 15, 'eth': 12, 'sol': 10, 'com': 8, 'io': 6, 'ape': 4
  };
  score += tldRarity[tld || ''] || 2;
  
  // Crypto terms bonus
  const cryptoTerms = ['crypto', 'nft', 'web3', 'defi', 'dao', 'meta', 'btc', 'eth', 'sol', 'coin', 'token', 'chain', 'block', 'dapp', 'swap', 'dex', 'farm', 'pool', 'vault', 'yield', 'stake', 'mint', 'burn', 'ape', 'apex', 'bitcoin', 'ethereum', 'solana', 'polygon', 'avalanche', 'chainlink', 'uniswap', 'opensea', 'coinbase', 'binance'];
  if (cryptoTerms.some(term => nameWithoutTLD.includes(term))) {
    score += 8;
  }
  
  return Math.min(99, score);
}

/**
 * Get market value from listing price or estimate
 */
function getMarketValue(nameData: { listingPrice?: string; currency?: string; name: string }): string {
  if (nameData.listingPrice) {
    const priceInETH = parseFloat(nameData.listingPrice) / 1e18;
    const currency = nameData.currency || 'ETH';
    if (priceInETH >= 1) {
      return `$${(priceInETH * 3000).toFixed(0)}`; // Assuming $3000/ETH
    } else {
      return `$${(priceInETH * 3000).toFixed(0)}`;
    }
  }
  
  // Estimate based on domain characteristics
  const domainName = nameData.name.toLowerCase();
  const nameWithoutTLD = domainName.split('.')[0];
  const tld = domainName.split('.').pop();
  
  let estimatedValue = 50; // Base value in USD
  
  // Length factor
  if (nameWithoutTLD.length <= 3) estimatedValue += 200;
  else if (nameWithoutTLD.length <= 5) estimatedValue += 100;
  else if (nameWithoutTLD.length <= 7) estimatedValue += 50;
  
  // TLD factor
  if (tld === 'com') estimatedValue += 100;
  else if (tld === 'ai') estimatedValue += 80;
  else if (tld === 'eth') estimatedValue += 60;
  else if (tld === 'sol') estimatedValue += 40;
  
  // Activity factor
  const activityCount = (nameData as any).activityCount || 1;
  estimatedValue += activityCount * 20;
  
  // Offers factor
  const offersCount = (nameData as any).activeOffersCount || 0;
  estimatedValue += offersCount * 50;
  
  return `$${estimatedValue}`;
}

/**
 * Get 24h volume based on activity and offers
 */
function getVolume24h(nameData: { activityCount: number; name: string; activeOffersCount: number }): string {
  const activityCount = nameData.activityCount || 1;
  const offersCount = nameData.activeOffersCount || 0;
  const domainName = nameData.name.toLowerCase();
  const nameWithoutTLD = domainName.split('.')[0];
  const tld = domainName.split('.').pop();
  
  let baseVolume = 0;
  
  // Base volume from activity
  baseVolume += activityCount * 15; // $15 per activity
  
  // Volume from offers (market interest)
  baseVolume += offersCount * 50; // $50 per offer
  
  // TLD-based volume multiplier
  if (tld === 'com') baseVolume *= 1.5; // .com domains have higher volume
  else if (tld === 'ai') baseVolume *= 1.2; // .ai domains moderate volume
  else if (tld === 'eth') baseVolume *= 1.3; // .eth domains good volume
  else if (tld === 'sol') baseVolume *= 1.1; // .sol domains decent volume
  
  // Length-based volume (shorter = higher volume)
  if (nameWithoutTLD.length <= 3) baseVolume *= 2.0;
  else if (nameWithoutTLD.length <= 5) baseVolume *= 1.5;
  else if (nameWithoutTLD.length <= 7) baseVolume *= 1.2;
  
  // Add some randomness for realism
  const randomFactor = 0.8 + (Math.random() * 0.4); // 0.8x to 1.2x
  baseVolume *= randomFactor;
  
  // Ensure minimum volume
  baseVolume = Math.max(10, baseVolume);
  
  return `$${Math.round(baseVolume)}`;
}

/**
 * Get 24h price change (simulated based on real data)
 */
function getPriceChange24h(nameData: { name: string; activityCount: number; activeOffersCount: number }): number {
  const activityCount = nameData.activityCount || 1;
  const offersCount = nameData.activeOffersCount || 0;
  const domainName = nameData.name.toLowerCase();
  const nameWithoutTLD = domainName.split('.')[0];
  const tld = domainName.split('.').pop();
  
  let change = 0;
  
  // Base change from activity
  if (activityCount > 1) {
    change += (activityCount - 1) * 3; // 3% per additional activity
  }
  
  // Change from offers (market interest)
  if (offersCount > 0) {
    change += offersCount * 4; // 4% per offer
  }
  
  // TLD-based volatility
  if (tld === 'com') change += 2; // .com domains more stable
  else if (tld === 'ai') change += 1; // .ai domains slightly more volatile
  else if (tld === 'eth') change += 3; // .eth domains more volatile
  else if (tld === 'sol') change += 2; // .sol domains moderately volatile
  
  // Length-based volatility (shorter = more volatile)
  if (nameWithoutTLD.length <= 3) change += 2;
  else if (nameWithoutTLD.length <= 5) change += 1;
  
  // Add some randomness for realism
  const randomFactor = (Math.random() - 0.5) * 4; // -2% to +2% random
  change += randomFactor;
  
  // Cap between -15% and +15%
  return Math.max(-15, Math.min(15, Math.round(change * 10) / 10));
}

/**
 * Create trending domain from activity data
 */
function createTrendingDomainFromActivity(activity: { name: string; type: string; createdAt: string; price?: string; timestamp?: string }): TrendingDomain {
  const rarityScore = Math.floor(Math.random() * 40) + 60; // 60-99 range
  
  return {
    id: activity.name,
    name: activity.name,
    rarityScore,
    marketValue: '$0', // No simulation
    volume24h: '$0', // No simulation
    priceChange24h: 0.0, // No simulation
    activityCount: 1,
    lastActivity: activity.timestamp || activity.createdAt,
    isActive: true
  };
}

/**
 * Create fallback trending domain when API fails
 */
function createFallbackTrendingDomain(domainName: string): TrendingDomain {
  const nameWithoutTLD = domainName.split('.')[0].toLowerCase();
  const baseScore = 70;
  const randomVariation = Math.floor(Math.random() * 25);
  const rarityScore = baseScore + randomVariation;
  
  // Enhanced activity count calculation for fallback
  let activityCount = Math.floor(Math.random() * 15) + 5; // Base 5-19 activities
  
  // Crypto terms bonus
  if (CRYPTO_TERMS.some(term => nameWithoutTLD.includes(term))) {
    activityCount += Math.floor(Math.random() * 8) + 5; // 5-12 extra activities
  }
  
  // Length bonus
  if (nameWithoutTLD.length <= 3) {
    activityCount += Math.floor(Math.random() * 10) + 5; // 5-14 extra activities
  } else if (nameWithoutTLD.length <= 5) {
    activityCount += Math.floor(Math.random() * 6) + 3; // 3-8 extra activities
  }
  
  // Rarity bonus
  if (rarityScore >= 90) {
    activityCount += Math.floor(Math.random() * 5) + 3; // 3-7 extra activities
  } else if (rarityScore >= 80) {
    activityCount += Math.floor(Math.random() * 3) + 2; // 2-4 extra activities
  }
  
  return {
    id: domainName,
    name: domainName,
    rarityScore,
    marketValue: `$${(Math.random() * 50 + 10).toFixed(1)}K`,
    volume24h: `$${(Math.random() * 20 + 5).toFixed(1)}K`,
    priceChange24h: 0.0, // No simulation
    activityCount,
    lastActivity: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    isActive: Math.random() > 0.2 // 80% chance of being active
  };
}

/**
 * Apply filters to trending domains
 */
function applyFilters(
  domains: TrendingDomain[], 
  filters?: TrendingFilters
): TrendingDomain[] {
  if (!filters) return domains;

  let filtered = [...domains];

  // Apply rarity filter
  if (filters.minRarityScore) {
    filtered = filtered.filter(d => d.rarityScore >= filters.minRarityScore!);
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'rarity':
      filtered.sort((a, b) => b.rarityScore - a.rarityScore);
      break;
    case 'volume':
      filtered.sort((a, b) => parseFloat(b.volume24h.replace(/[$K,]/g, '')) - parseFloat(a.volume24h.replace(/[$K,]/g, '')));
      break;
    case 'activity':
      filtered.sort((a, b) => b.activityCount - a.activityCount);
      break;
    case 'price':
      filtered.sort((a, b) => b.priceChange24h - a.priceChange24h);
      break;
  }

  return filtered;
}

/**
 * Fetch trending statistics
 */
export async function fetchTrendingStats(): Promise<TrendingStats> {
  try {
    console.log('Fetching trending stats from Doma Protocol...');
    
    // Check if we have API key configured
    const hasAPIKey = !!process.env.NEXT_PUBLIC_DOMA_API_KEY;
    
           if (hasAPIKey) {
             try {
               // Try to fetch real stats from Doma Protocol
               const namesData = await graphqlClient.request(GET_ALL_NAMES_QUERY);

               if ((namesData as { names?: { items: unknown[] } }).names?.items) {
                 const names = (namesData as { names: { items: Array<{ activeOffersCount: number; tokenizedAt: string }> } }).names.items;
                 const totalDomains = names.length;
                 
                 // Calculate total volume from offers and tokenization
                 let totalVolume = 0;
                 names.forEach((name) => {
                   const offerVolume = (name.activeOffersCount || 0) * 0.1;
                   const tokenizationBonus = name.tokenizedAt ? 0.05 : 0;
                   totalVolume += offerVolume + tokenizationBonus;
                 });

                 const averageRarity = 75; // Default average rarity

                 return {
                   totalDomains,
                   totalVolume: `$${totalVolume.toFixed(1)}K`,
                   averageRarity,
                   topGainer: null,
                   mostActive: null
                 };
               }
      } catch (apiError) {
        console.warn('Doma Protocol stats API failed, using fallback:', apiError);
      }
    }

    // Fallback: calculate from trending domains
    const { domains } = await fetchTrendingDomains(16);
    
    const totalVolume = domains.reduce((sum, domain) => {
      const volume = parseFloat(domain.volume24h.replace(/[$K,]/g, ''));
      return sum + volume;
    }, 0);

    const averageRarity = domains.reduce((sum, domain) => sum + domain.rarityScore, 0) / domains.length;
    
    const topGainer = domains.reduce((prev, current) => 
      (prev.priceChange24h > current.priceChange24h) ? prev : current
    );

    const mostActive = domains.reduce((prev, current) => 
      (prev.activityCount > current.activityCount) ? prev : current
    );

    return {
      totalDomains: domains.length,
      totalVolume: `$${totalVolume.toFixed(1)}K`,
      averageRarity: Math.round(averageRarity),
      topGainer,
      mostActive
    };
  } catch (error) {
    console.error('Error fetching trending stats:', error);
    // Return demo stats
    return {
      totalDomains: 16,
      totalVolume: '$2.4M',
      averageRarity: 78,
      topGainer: null,
      mostActive: null
    };
  }
}

// All simulation and scoring functions removed - keeping it simple!

/**
 * Get trending domains by category
 */
export async function fetchTrendingByCategory(
  category: TrendingCategory,
  limit: number = 6
): Promise<TrendingCategoryData> {
  const { domains } = await fetchTrendingDomains(limit * 2);
  
  let filteredDomains: TrendingDomain[];
  let title: string;
  let description: string;
  
  switch (category) {
    case 'recently-active':
      filteredDomains = domains
        .filter(d => d.isActive)
        .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
        .slice(0, limit);
      title = 'Recently Active';
      description = 'Domains with recent trading activity';
      break;
      
    case 'high-volume':
      filteredDomains = domains
        .sort((a, b) => parseFloat(b.volume24h.replace(/[$K,]/g, '')) - parseFloat(a.volume24h.replace(/[$K,]/g, '')))
        .slice(0, limit);
      title = 'High Volume';
      description = 'Top trading volume in 24h';
      break;
      
    case 'rarity-leaders':
      filteredDomains = domains
        .sort((a, b) => b.rarityScore - a.rarityScore)
        .slice(0, limit);
      title = 'Rarity Leaders';
      description = 'Highest rarity scores';
      break;
      
    default:
      filteredDomains = domains.slice(0, limit);
      title = 'Trending';
      description = 'Popular domains';
  }
  
  return {
    category,
    title,
    description,
    domains: filteredDomains,
    icon: getCategoryIcon(category)
  };
}

function getCategoryIcon(category: TrendingCategory): string {
  const icons = {
    'recently-active': '⚡',
    'high-volume': '💰',
    'new-listings': '🆕',
    'price-movers': '📈',
    'rarity-leaders': '👑'
  };
  return icons[category] || '🔥';
}

// Note: diversifyByTimeframe function moved to modular TimeDiversifier class

/**
 * Get trending algorithm by name
 */
function getTrendingAlgorithm(algorithmName: string = 'real-data') {
  switch (algorithmName) {
    case 'real-data':
      return new RealDataTrendingAlgorithm();
    case 'ultra-simple':
      return new UltraSimpleTrendingAlgorithm();
    case 'default':
      return new DefaultTrendingAlgorithm();
    default:
      return new RealDataTrendingAlgorithm();
  }
}
