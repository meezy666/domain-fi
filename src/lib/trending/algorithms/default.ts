/**
 * Default Trending Algorithm - Simple approach, no scoring
 */

import type { TrendingAlgorithm, TrendingAlgorithmConfig } from './types';

export class DefaultTrendingAlgorithm implements TrendingAlgorithm {
  name = 'Default';
  description = 'Simple default algorithm, no scoring';

  execute(domains: unknown[], config: TrendingAlgorithmConfig): unknown[] {
    // Just return the first N domains, no filtering or scoring
    return domains.slice(0, config.limit);
  }
}
