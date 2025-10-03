/**
 * Ultra Simple Trending Algorithm
 * Just get domains within 30 days, no scoring, no simulation, show top 8
 */

import type { TrendingAlgorithm, TrendingAlgorithmConfig } from './types';

export class UltraSimpleTrendingAlgorithm implements TrendingAlgorithm {
  name = 'Ultra Simple';
  description = 'Just get domains within 30 days, no scoring, no simulation, show top 8';

  execute(domains: any[], config: TrendingAlgorithmConfig): any[] {
    // Step 1: Filter for domains within 30 days only
    const recentDomains = this.filterRecentDomains(domains);

    // Step 2: Return top 8 (no scoring, no simulation)
    return recentDomains.slice(0, 8);
  }

  /**
   * Filter for domains within 30 days only
   */
  private filterRecentDomains(domains: any[]): any[] {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    const thirtyDaysAgo = now - (30 * dayMs);

    return domains.filter(domain => {
      const tokenizedAt = new Date(domain.tokenizedAt).getTime();
      return tokenizedAt >= thirtyDaysAgo; // Only domains within 30 days
    });
  }
}
