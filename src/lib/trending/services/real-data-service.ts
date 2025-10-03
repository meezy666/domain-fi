/**
 * Real Data Service
 * Fetches actual listing prices, activity counts, and offers from Doma API
 */

import { graphqlClient } from '../../graphql';

interface DomainResponse {
  names: {
    items: Array<{
      name: string;
      tokenizedAt: string;
      activeOffersCount: number;
    }>;
  };
}

interface ActivityResponse {
  nameActivities: Array<{
    name: string;
    type: string;
    createdAt: string;
    price?: string;
  }>;
}

export interface DomainWithRealData {
  name: string;
  tokenizedAt: string;
  activeOffersCount: number;
  listingPrice?: string; // Price in wei
  activityCount: number;
  currency?: string;
}

export interface ListingData {
  name: string;
  price: string; // Price in wei
  currency: {
    symbol: string;
  };
  createdAt: string;
}

export interface ActivityData {
  totalCount: number;
  items: Array<{
    type: string;
    createdAt: string;
  }>;
}

/**
 * Fetch all domains with their real data
 */
export async function fetchDomainsWithRealData(limit: number = 100): Promise<DomainWithRealData[]> {
  try {
    console.log('Starting fetchDomainsWithRealData with limit:', limit);
    
    // Step 1: Get domains from different time periods for better variety
    const domainsQuery = `
      query GetAllNames($skip: Int!) {
        names(skip: $skip) {
          items {
            name
            tokenizedAt
            activeOffersCount
          }
          totalCount
        }
      }
    `;

    console.log('Fetching domains with better variety...');
    
    // Fetch a larger batch of domains to get better variety
    const allDomains = [];
    const batchSize = 1000; // Fetch in larger batches
    const maxBatches = 5; // Fetch up to 5 batches (5000 domains)
    
    for (let i = 0; i < maxBatches; i++) {
      try {
        const skip = i * batchSize;
        const domainsResponse = await graphqlClient.request(domainsQuery, { skip });
        const domains = (domainsResponse as DomainResponse).names.items || [];
        
        if (domains.length === 0) {
          console.log(`No more domains at skip ${skip}, stopping`);
          break;
        }
        
        allDomains.push(...domains);
        console.log(`Fetched ${domains.length} domains from skip ${skip} (batch ${i + 1})`);
        
        // If we have enough domains, we can stop early
        if (allDomains.length >= limit * 10) {
          console.log(`Have enough domains (${allDomains.length}), stopping early`);
          break;
        }
      } catch (error) {
        console.warn(`Failed to fetch domains from batch ${i + 1}:`, error);
        // Continue with next batch instead of stopping
      }
    }
    
    console.log(`Total domains fetched: ${allDomains.length}`);
    const domains = allDomains.slice(0, limit * 5); // Get more domains for better selection
    console.log(`Got ${domains.length} domains`);

    // Step 2: Get listing prices for domains
    const listingsQuery = `
      query GetListings {
        listings(take: 100) {
          items {
            name
            price
            currency {
              symbol
            }
            createdAt
          }
          totalCount
        }
      }
    `;

    console.log('Fetching listings...');
    const listingsResponse = await graphqlClient.request(listingsQuery);
    console.log('Listings response:', listingsResponse);
    const listings = (listingsResponse as { listings: { items: ListingData[] } }).listings.items;
    console.log(`Got ${listings.length} listings`);

    // Step 3: Create domains with real data and get activity counts
    const domainsWithData: DomainWithRealData[] = [];
    console.log('Processing domains with real data...');

    for (const domain of domains.slice(0, 10)) { // Limit to 10 domains to avoid rate limits
      try {
        // Get real activity count for this domain
        const activityQuery = `
          query GetDomainActivities($name: String!) {
            nameActivities(name: $name, take: 1) {
              totalCount
            }
          }
        `;

        const activityResponse = await graphqlClient.request(activityQuery, { name: domain.name });
        const activityCount = (activityResponse as { nameActivities: { totalCount: number } }).nameActivities.totalCount || 1;

        // Find listing price for this domain
        const listing = listings.find(l => l.name === domain.name);

        domainsWithData.push({
          name: domain.name,
          tokenizedAt: domain.tokenizedAt,
          activeOffersCount: domain.activeOffersCount,
          listingPrice: listing?.price,
          activityCount,
          currency: listing?.currency.symbol
        });
      } catch (error) {
        console.warn(`Failed to get activity data for ${domain.name}:`, error);
        // Add domain with default activity count
        const listing = listings.find(l => l.name === domain.name);
        domainsWithData.push({
          name: domain.name,
          tokenizedAt: domain.tokenizedAt,
          activeOffersCount: domain.activeOffersCount,
          listingPrice: listing?.price,
          activityCount: 1, // Default activity count
          currency: listing?.currency.symbol
        });
      }
    }

    console.log(`Returning ${domainsWithData.length} domains with real data`);
    return domainsWithData;
  } catch (error) {
    console.error('Failed to fetch domains with real data:', error);
    throw error;
  }
}

/**
 * Get top domains by listing price
 */
export async function getTopDomainsByPrice(limit: number = 20): Promise<ListingData[]> {
  try {
    const query = `
      query GetTopListings {
        listings(take: ${limit}) {
          items {
            name
            price
            currency {
              symbol
            }
            createdAt
          }
          totalCount
        }
      }
    `;

    const response = await graphqlClient.request(query);
    const listings = (response as { listings: { items: ListingData[] } }).listings.items;

    // Sort by price (highest first)
    return listings.sort((a, b) => {
      const priceA = BigInt(a.price);
      const priceB = BigInt(b.price);
      return priceA > priceB ? -1 : priceA < priceB ? 1 : 0;
    });
  } catch (error) {
    console.error('Failed to fetch top domains by price:', error);
    throw error;
  }
}

/**
 * Get domains with highest activity counts
 */
export async function getTopDomainsByActivity(limit: number = 20): Promise<DomainWithRealData[]> {
  try {
    const domains = await fetchDomainsWithRealData(100);
    
    // Sort by activity count (highest first)
    return domains
      .sort((a, b) => b.activityCount - a.activityCount)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch top domains by activity:', error);
    throw error;
  }
}

/**
 * Get domains with most active offers
 */
export async function getTopDomainsByOffers(limit: number = 20): Promise<DomainWithRealData[]> {
  try {
    const domains = await fetchDomainsWithRealData(100);
    
    // Sort by active offers count (highest first)
    return domains
      .sort((a, b) => b.activeOffersCount - a.activeOffersCount)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to fetch top domains by offers:', error);
    throw error;
  }
}

/**
 * Convert wei to ETH
 */
export function weiToEth(wei: string): number {
  return parseFloat(wei) / 1e18;
}

/**
 * Format price for display
 */
export function formatPrice(wei: string, currency: string = 'ETH'): string {
  const eth = weiToEth(wei);
  if (eth >= 1) {
    return `${eth.toFixed(3)} ${currency}`;
  } else {
    return `${eth.toFixed(4)} ${currency}`;
  }
}
