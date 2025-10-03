/**
 * Real Data Trending Algorithm
 * Uses actual listing prices, activity counts, and offers from Doma API
 */

import type { TrendingAlgorithm, TrendingAlgorithmConfig } from './types';

export class RealDataTrendingAlgorithm implements TrendingAlgorithm {
  name = 'Real Data Trending';
  description = 'Uses real listing prices, activity counts, and offers from Doma API';

  execute(domains: unknown[], config: TrendingAlgorithmConfig): unknown[] {
    // Step 1: Filter domains within 30 days
    const recentDomains = this.filterRecentDomains(domains);

    // Step 2: Calculate trending scores for each domain
    const scoredDomains = this.calculateTrendingScores(recentDomains);

    // Step 3: Sort by trending score (highest first)
    const sortedDomains = this.sortByTrendingScore(scoredDomains);

    // Step 4: Return top domains
    return sortedDomains.slice(0, config.limit);
  }

  /**
   * Filter domains with better variety and less restrictive filtering
   */
  private filterRecentDomains(domains: unknown[]): unknown[] {
    console.log(`Filtering ${domains.length} domains for variety...`);
    
    // Filter domains with valid data
    const validDomains = domains.filter((domain) => {
      const typedDomain = domain as { tokenizedAt: string; name: string };
      return typedDomain.tokenizedAt && typedDomain.name;
    });

    console.log(`Valid domains: ${validDomains.length}`);

    // If we have enough domains, try to get variety by time periods
    if (validDomains.length >= 20) {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      const sevenDaysAgo = now - (7 * dayMs);
      const thirtyDaysAgo = now - (30 * dayMs);

      // Categorize domains by age
      const recentDomains = validDomains.filter((domain) => {
        const typedDomain = domain as { tokenizedAt: string };
        const tokenizedAt = new Date(typedDomain.tokenizedAt).getTime();
        return tokenizedAt >= sevenDaysAgo;
      });

      const olderDomains = validDomains.filter((domain) => {
        const typedDomain = domain as { tokenizedAt: string };
        const tokenizedAt = new Date(typedDomain.tokenizedAt).getTime();
        return tokenizedAt < sevenDaysAgo;
      });

      console.log(`Recent domains: ${recentDomains.length}, Older domains: ${olderDomains.length}`);

      // Mix domains: 60% recent, 40% older for better variety
      const mixedDomains = [
        ...recentDomains.slice(0, Math.min(20, recentDomains.length)),
        ...olderDomains.slice(0, Math.min(15, olderDomains.length))
      ];

      console.log(`Mixed domains: ${mixedDomains.length}`);
      return mixedDomains.length > 0 ? mixedDomains : validDomains.slice(0, 50);
    }

    // If we don't have many domains, just return what we have
    console.log(`Using all ${validDomains.length} valid domains`);
    return validDomains;
  }

  /**
   * Calculate trending score for each domain
   * Score = (Price Score × 0.4) + (Activity Score × 0.3) + (Offers Score × 0.3)
   */
  private calculateTrendingScores(domains: unknown[]): unknown[] {
    return domains.map((domain) => {
      const typedDomain = domain as { name: string; listingPrice?: string; activeOffersCount: number; tokenizedAt: string; activityCount?: number };
      const domainName = typedDomain.name.toLowerCase();
      const tld = domainName.split('.').pop();
      const nameWithoutTLD = domainName.split('.')[0];

      // Get base data
      const activeOffersCount = typedDomain.activeOffersCount || 0;
      const activityCount = typedDomain.activityCount || 1; // Default to 1 if no activity data

      // Calculate Price Score (0-100)
      const priceScore = this.calculatePriceScore(typedDomain);

      // Calculate Activity Score (0-100)
      const activityScore = this.calculateActivityScore(activityCount);

      // Calculate Offers Score (0-100)
      const offersScore = this.calculateOffersScore(activeOffersCount);

      // Calculate Domain Characteristics Score (0-100)
      const characteristicsScore = this.calculateCharacteristicsScore(nameWithoutTLD, tld || '');

      // Calculate final trending score with more emphasis on domain characteristics
      // Since all domains are recent, we'll weight domain quality more heavily
      const trendingScore = Math.round(
        (priceScore * 0.2) +           // 20% weight on price
        (activityScore * 0.2) +        // 20% weight on activity
        (offersScore * 0.2) +          // 20% weight on offers
        (characteristicsScore * 0.4)   // 40% weight on characteristics (increased)
      );

      return {
        name: typedDomain.name,
        listingPrice: typedDomain.listingPrice,
        activeOffersCount: typedDomain.activeOffersCount,
        tokenizedAt: typedDomain.tokenizedAt,
        trendingScore,
        priceScore,
        activityScore,
        offersScore,
        characteristicsScore,
        activityCount
      };
    });
  }

  /**
   * Calculate price score based on listing price
   */
  private calculatePriceScore(domain: { listingPrice?: string; name: string }): number {
    // If domain has a listing price, use it
    if (domain.listingPrice) {
      const priceInETH = parseFloat(domain.listingPrice) / 1e18; // Convert from wei
      // Score based on price range (0.005 ETH to 0.951 ETH)
      if (priceInETH >= 0.5) return 100;      // High value domains
      if (priceInETH >= 0.1) return 80;       // Medium-high value
      if (priceInETH >= 0.05) return 60;      // Medium value
      if (priceInETH >= 0.01) return 40;      // Low-medium value
      return 20;                              // Low value
    }

    // If no listing price, estimate based on domain characteristics
    return this.estimatePriceScore(domain);
  }

  /**
   * Estimate price score based on domain characteristics
   */
  private estimatePriceScore(domain: { name: string }): number {
    const domainName = domain.name.toLowerCase();
    const tld = domainName.split('.').pop();
    const nameWithoutTLD = domainName.split('.')[0];

    let score = 20; // Base score

    // Length factor (shorter = more valuable)
    if (nameWithoutTLD.length <= 3) score += 40;
    else if (nameWithoutTLD.length <= 5) score += 30;
    else if (nameWithoutTLD.length <= 7) score += 20;
    else if (nameWithoutTLD.length <= 10) score += 10;

    // TLD factor
    if (tld === 'com') score += 20;
    else if (tld === 'ai') score += 15;
    else if (tld === 'eth') score += 12;
    else if (tld === 'sol') score += 10;
    else if (tld === 'io') score += 8;

    // Crypto terms bonus
    const cryptoTerms = ['crypto', 'nft', 'web3', 'defi', 'dao', 'meta', 'btc', 'eth', 'sol', 'coin', 'token', 'chain', 'block', 'dapp', 'swap', 'dex', 'farm', 'pool', 'vault', 'yield', 'stake', 'mint', 'burn', 'ape', 'apex', 'bitcoin', 'ethereum', 'solana', 'polygon', 'avalanche', 'chainlink', 'uniswap', 'opensea', 'coinbase', 'binance'];
    if (cryptoTerms.some(term => nameWithoutTLD.includes(term))) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Calculate activity score based on activity count
   */
  private calculateActivityScore(activityCount: number): number {
    if (activityCount >= 10) return 100;
    if (activityCount >= 5) return 80;
    if (activityCount >= 3) return 60;
    if (activityCount >= 2) return 40;
    return 20; // Base score for 1 activity
  }

  /**
   * Calculate offers score based on active offers count
   */
  private calculateOffersScore(activeOffersCount: number): number {
    if (activeOffersCount >= 5) return 100;
    if (activeOffersCount >= 3) return 80;
    if (activeOffersCount >= 2) return 60;
    if (activeOffersCount >= 1) return 40;
    return 20; // No offers
  }

  /**
   * Calculate domain characteristics score
   */
  private calculateCharacteristicsScore(nameWithoutTLD: string, tld: string): number {
    let score = 50; // Base score

    // Length factor
    if (nameWithoutTLD.length <= 3) score += 30;
    else if (nameWithoutTLD.length <= 5) score += 20;
    else if (nameWithoutTLD.length <= 7) score += 10;

    // TLD factor
    if (tld === 'com') score += 15;
    else if (tld === 'ai') score += 12;
    else if (tld === 'eth') score += 10;
    else if (tld === 'sol') score += 8;
    else if (tld === 'io') score += 6;

    // Premium patterns
    const isPremiumPattern = /^[a-z]{1,4}[0-9]{1,3}$/i.test(nameWithoutTLD) || /^[0-9]{1,3}[a-z]{1,4}$/i.test(nameWithoutTLD);
    if (isPremiumPattern) {
      score += 10;
    }

    // Common words
    const commonWords = ['app', 'web', 'net', 'dev', 'pro', 'max', 'min', 'top', 'new', 'old', 'big', 'small', 'fast', 'slow', 'hot', 'cool', 'win', 'lose', 'buy', 'sell', 'trade', 'swap', 'mint', 'burn', 'stake', 'farm', 'pool', 'vault', 'yield', 'dao', 'defi', 'nft', 'web3', 'crypto', 'meta', 'ai', 'btc', 'eth', 'sol'];
    if (commonWords.some(word => nameWithoutTLD === word)) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Sort domains by trending score
   */
  private sortByTrendingScore(domains: unknown[]): unknown[] {
    return domains.sort((a, b) => {
      const typedA = a as { trendingScore: number; tokenizedAt: string; activityCount?: number; activeOffersCount?: number };
      const typedB = b as { trendingScore: number; tokenizedAt: string; activityCount?: number; activeOffersCount?: number };
      // Primary sort: trending score
      if (typedB.trendingScore !== typedA.trendingScore) {
        return typedB.trendingScore - typedA.trendingScore;
      }
      
      // Secondary sort: activity count
      if ((typedB.activityCount || 0) !== (typedA.activityCount || 0)) {
        return (typedB.activityCount || 0) - (typedA.activityCount || 0);
      }
      
      // Tertiary sort: active offers count
      return (typedB.activeOffersCount || 0) - (typedA.activeOffersCount || 0);
    });
  }
}
