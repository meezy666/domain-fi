import { Domain, DomainStats, DomainActivity } from './graphql';

// Scoring weights (hyperparameters)
export const SCORING_WEIGHTS = {
  LENGTH: 0.25,      // α - Length factor
  PATTERN: 0.20,     // β - Pattern factor  
  TLD: 0.20,         // γ - TLD rarity factor
  ACTIVITY: 0.25,    // δ - Activity factor
  EXPIRATION: 0.10   // ε - Expiration factor
} as const;

// TLD rarity mapping
export const TLD_RARITY: Record<string, number> = {
  // Premium TLDs
  '.sol': 1.0,
  '.core': 1.0,
  '.ape': 1.0,
  
  // Common TLDs
  '.com': 0.8,
  '.org': 0.8,
  '.net': 0.8,
  
  // New TLDs
  '.app': 0.6,
  '.dev': 0.6,
  '.io': 0.6,
  
  // Generic TLDs
  '.info': 0.4,
  '.biz': 0.4,
  '.co': 0.4
};

export interface DomainScore {
  totalScore: number;
  breakdown: {
    length: number;
    pattern: number;
    tld: number;
    activity: number;
    expiration: number;
  };
  factors: {
    length: string;
    pattern: string;
    tld: string;
    activity: string;
    expiration: string;
  };
}

/**
 * Calculate domain rarity score using multi-factor analysis
 */
export function calculateDomainScore(
  domain: Domain,
  stats?: DomainStats,
  activities?: DomainActivity[]
): DomainScore {
  const domainName = domain.labelName;
  const tld = extractTLD(domain.id);
  
  // Calculate individual factors
  const lengthScore = calculateLengthScore(domainName);
  const patternScore = calculatePatternScore(domainName);
  const tldScore = calculateTLDScore(tld);
  const activityScore = calculateActivityScore(stats, activities);
  const expirationScore = calculateExpirationScore(domain.createdAt);
  
  // Calculate weighted total score
  const totalScore = Math.round(
    (SCORING_WEIGHTS.LENGTH * lengthScore +
     SCORING_WEIGHTS.PATTERN * patternScore +
     SCORING_WEIGHTS.TLD * tldScore +
     SCORING_WEIGHTS.ACTIVITY * activityScore +
     SCORING_WEIGHTS.EXPIRATION * expirationScore) * 100
  );
  
  return {
    totalScore: Math.min(100, Math.max(0, totalScore)),
    breakdown: {
      length: Math.round(lengthScore * 100),
      pattern: Math.round(patternScore * 100),
      tld: Math.round(tldScore * 100),
      activity: Math.round(activityScore * 100),
      expiration: Math.round(expirationScore * 100)
    },
    factors: {
      length: getLengthDescription(domainName.length),
      pattern: getPatternDescription(domainName),
      tld: getTLDDescription(tld),
      activity: getActivityDescription(stats, activities),
      expiration: getExpirationDescription(domain.createdAt)
    }
  };
}

/**
 * Calculate length factor (shorter = better)
 */
function calculateLengthScore(domainName: string): number {
  const length = domainName.length;
  const minLength = 3;
  const maxLength = 23;
  
  // Normalize to 0-1 range (inverted: shorter is better)
  return Math.max(0, 1 - (length - minLength) / (maxLength - minLength));
}

/**
 * Calculate pattern factor based on character composition
 */
function calculatePatternScore(domainName: string): number {
  const name = domainName.toLowerCase();
  
  // Only letters or numbers
  if (/^[a-z]+$/.test(name) || /^[0-9]+$/.test(name)) {
    return 1.0;
  }
  
  // Letters and numbers mixed
  if (/^[a-z0-9]+$/.test(name)) {
    return 0.8;
  }
  
  // Includes hyphen or special symbols
  if (/^[a-z0-9-]+$/.test(name)) {
    return 0.6;
  }
  
  // Random/unpronounceable patterns
  return 0.3;
}

/**
 * Calculate TLD rarity factor
 */
function calculateTLDScore(tld: string): number {
  return TLD_RARITY[tld.toLowerCase()] || 0.5; // Default for unknown TLDs
}

/**
 * Calculate activity factor based on trading history
 */
function calculateActivityScore(stats?: DomainStats, activities?: DomainActivity[]): number {
  if (!stats) return 0.2; // No activity data
  
  const salesCount = stats.salesCount || 0;
  const activityCount = activities?.length || 0;
  
  // High activity (10+ transactions)
  if (salesCount >= 10 || activityCount >= 10) {
    return 1.0;
  }
  
  // Medium activity (3-9 transactions)
  if (salesCount >= 3 || activityCount >= 3) {
    return 0.7;
  }
  
  // Low activity (1-2 transactions)
  if (salesCount >= 1 || activityCount >= 1) {
    return 0.4;
  }
  
  // No activity
  return 0.2;
}

/**
 * Calculate expiration factor (longer duration = better)
 */
function calculateExpirationScore(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const daysSinceCreation = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  
  // Assume domains are registered for 1 year by default
  const maxDuration = 365;
  const remainingDays = Math.max(0, maxDuration - daysSinceCreation);
  
  return Math.min(1, remainingDays / maxDuration);
}

/**
 * Extract TLD from full domain name
 */
function extractTLD(fullDomain: string): string {
  const parts = fullDomain.split('.');
  return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
}

/**
 * Get human-readable descriptions for factors
 */
function getLengthDescription(length: number): string {
  if (length <= 4) return 'Very short - highly valuable';
  if (length <= 6) return 'Short - good value';
  if (length <= 8) return 'Medium length - moderate value';
  if (length <= 12) return 'Long - lower value';
  return 'Very long - minimal value';
}

function getPatternDescription(domainName: string): string {
  const name = domainName.toLowerCase();
  
  if (/^[a-z]+$/.test(name)) return 'Pure letters - premium brandable';
  if (/^[0-9]+$/.test(name)) return 'Pure numbers - numeric value';
  if (/^[a-z0-9]+$/.test(name)) return 'Alphanumeric - good brandable';
  if (/^[a-z0-9-]+$/.test(name)) return 'With hyphens - acceptable';
  return 'Complex pattern - lower value';
}

function getTLDDescription(tld: string): string {
  const score = TLD_RARITY[tld.toLowerCase()];
  if (score >= 1.0) return 'Premium TLD - high value';
  if (score >= 0.8) return 'Common TLD - good value';
  if (score >= 0.6) return 'New TLD - moderate value';
  if (score >= 0.4) return 'Generic TLD - lower value';
  return 'Unknown TLD - uncertain value';
}

function getActivityDescription(stats?: DomainStats, activities?: DomainActivity[]): string {
  if (!stats) return 'No trading history';
  
  const salesCount = stats.salesCount || 0;
  const activityCount = activities?.length || 0;
  
  if (salesCount >= 10 || activityCount >= 10) return 'High trading activity - proven demand';
  if (salesCount >= 3 || activityCount >= 3) return 'Moderate activity - some interest';
  if (salesCount >= 1 || activityCount >= 1) return 'Low activity - limited interest';
  return 'No trading activity - untested market';
}

function getExpirationDescription(createdAt: string): string {
  const created = new Date(createdAt);
  const now = new Date();
  const daysSinceCreation = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceCreation < 30) return 'Recently registered - fresh';
  if (daysSinceCreation < 180) return 'Recently registered - established';
  if (daysSinceCreation < 365) return 'Mature registration - stable';
  return 'Long-term registration - very stable';
}

/**
 * Get score interpretation
 */
export function getScoreInterpretation(score: number): string {
  if (score >= 90) return 'Exceptional rarity and value';
  if (score >= 80) return 'High value with strong potential';
  if (score >= 70) return 'Good investment opportunity';
  if (score >= 60) return 'Moderate value';
  return 'Lower priority domain';
}

/**
 * Get score color for UI
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}
