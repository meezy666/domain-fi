import { 
  graphqlClient, 
  GET_DOMAIN_QUERY, 
  GET_DOMAIN_STATS_QUERY, 
  GET_LISTINGS_AND_OFFERS_QUERY, 
  GET_DOMAIN_ACTIVITIES_QUERY,
  type Domain,
  type DomainStats,
  type Listing,
  type Offer,
  type DomainActivity
} from './graphql';

export interface DomainData {
  domain: Domain | null;
  stats: DomainStats | null;
  listings: Listing[];
  offers: Offer[];
  activities: DomainActivity[];
}

/**
 * Fetch comprehensive domain data from Doma subgraph
 */
export async function fetchDomainData(domainName: string): Promise<DomainData> {
  try {
    // Ensure domain name is properly formatted
    const formattedName = formatDomainName(domainName);
    
    // Fetch all domain data in parallel
    const [domainResult, statsResult, listingsOffersResult, activitiesResult] = await Promise.allSettled([
      graphqlClient.request(GET_DOMAIN_QUERY, { name: formattedName }),
      graphqlClient.request(GET_DOMAIN_STATS_QUERY, { name: formattedName }),
      graphqlClient.request(GET_LISTINGS_AND_OFFERS_QUERY, { name: formattedName }),
      graphqlClient.request(GET_DOMAIN_ACTIVITIES_QUERY, { name: formattedName })
    ]);

    return {
      domain: domainResult.status === 'fulfilled' ? domainResult.value.name : null,
      stats: statsResult.status === 'fulfilled' ? statsResult.value.nameStatistics : null,
      listings: listingsOffersResult.status === 'fulfilled' ? listingsOffersResult.value.listings || [] : [],
      offers: listingsOffersResult.status === 'fulfilled' ? listingsOffersResult.value.offers || [] : [],
      activities: activitiesResult.status === 'fulfilled' ? activitiesResult.value.nameActivities || [] : []
    };
  } catch (error) {
    console.error('Error fetching domain data:', error);
    throw new Error(`Failed to fetch data for domain: ${domainName}`);
  }
}

/**
 * Format domain name for API queries
 */
function formatDomainName(domainName: string): string {
  // Remove protocol if present
  let formatted = domainName.replace(/^https?:\/\//, '');
  
  // Remove www prefix
  formatted = formatted.replace(/^www\./, '');
  
  // Ensure it has a TLD
  if (!formatted.includes('.')) {
    // If no TLD specified, assume .sol (common in Doma)
    formatted += '.sol';
  }
  
  return formatted.toLowerCase();
}

/**
 * Search for domains by partial name
 */
export async function searchDomains(query: string, limit: number = 10): Promise<Domain[]> {
  try {
    // This would need a different GraphQL query for searching
    // For now, we'll return empty array as the subgraph might not support search
    // In a real implementation, you'd query the subgraph for domains matching the pattern
    console.log('Search functionality not yet implemented in subgraph');
    return [];
  } catch (error) {
    console.error('Error searching domains:', error);
    return [];
  }
}

/**
 * Get trending domains (most active in last 24h)
 */
export async function getTrendingDomains(limit: number = 10): Promise<DomainActivity[]> {
  try {
    // This would query for recent activities across all domains
    // Implementation depends on available subgraph queries
    console.log('Trending domains functionality not yet implemented');
    return [];
  } catch (error) {
    console.error('Error fetching trending domains:', error);
    return [];
  }
}

/**
 * Get market statistics
 */
export async function getMarketStats(): Promise<{
  totalDomains: number;
  totalVolume: string;
  averagePrice: string;
  activeListings: number;
}> {
  try {
    // This would aggregate data from the subgraph
    // For now, return mock data
    return {
      totalDomains: 0,
      totalVolume: '0',
      averagePrice: '0',
      activeListings: 0
    };
  } catch (error) {
    console.error('Error fetching market stats:', error);
    return {
      totalDomains: 0,
      totalVolume: '0',
      averagePrice: '0',
      activeListings: 0
    };
  }
}

/**
 * Validate domain name format
 */
export function isValidDomainName(domainName: string): boolean {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domainName) && domainName.length <= 253;
}

/**
 * Extract domain name without TLD
 */
export function extractDomainName(fullDomain: string): string {
  const parts = fullDomain.split('.');
  return parts[0] || '';
}

/**
 * Extract TLD from full domain
 */
export function extractTLD(fullDomain: string): string {
  const parts = fullDomain.split('.');
  return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
}
