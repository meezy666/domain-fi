/**
 * Activity-Based Trending Service
 * Finds domains with the highest activity based on recent listings and offers
 */

import { graphqlClient } from '../../graphql';

export interface ActivityBasedDomain {
  name: string;
  tokenizedAt: string;
  activeOffersCount: number;
  listingPrice?: string;
  currency?: string;
  listingCreatedAt?: string;
  activityScore: number;
  lastActivity: string;
}

export interface ActivityData {
  domains: Array<{
    name: string;
    tokenizedAt: string;
    activeOffersCount: number;
  }>;
  listings: Array<{
    name: string;
    price: string;
    currency: { symbol: string };
    createdAt: string;
  }>;
}

/**
 * Fetch domains with the highest activity in the last 30 days
 */
export async function fetchMostActiveDomains(limit: number = 8): Promise<ActivityBasedDomain[]> {
  try {
    console.log('🔥 Fetching most active domains...');
    
    // Get data from multiple time periods for better variety
    const skipValues = [0, 1000, 5000, 10000, 20000];
    const allActivityData: ActivityData = {
      domains: [],
      listings: []
    };
    
    for (const skip of skipValues) {
      try {
        console.log(`📡 Fetching activity data from skip ${skip}...`);
        
        const query = `
          query GetMostActiveDomains {
            names(skip: ${skip}, take: 50) {
              items {
                name
                tokenizedAt
                activeOffersCount
              }
            }
            listings(take: 100) {
              items {
                name
                price
                currency {
                  symbol
                }
                createdAt
              }
            }
          }
        `;
        
        const response = await graphqlClient.request(query);
        const data = response as any;
        
        allActivityData.domains.push(...(data.names.items || []));
        allActivityData.listings.push(...(data.listings.items || []));
        
        console.log(`✅ Got ${data.names.items?.length || 0} domains, ${data.listings.items?.length || 0} listings`);
        
        // Stop early if we have enough data
        if (allActivityData.domains.length >= limit * 20) {
          console.log(`🎯 Have enough data (${allActivityData.domains.length} domains), stopping early`);
          break;
        }
        
      } catch (error) {
        console.warn(`⚠️ Failed to fetch activity data from skip ${skip}:`, error);
        // Continue with next batch
      }
    }
    
    console.log(`📊 Total data: ${allActivityData.domains.length} domains, ${allActivityData.listings.length} listings`);
    
    // Process and score domains based on activity
    const processedDomains = processActivityData(allActivityData);
    
    // Sort by activity score and return top domains
    const sortedDomains = processedDomains.sort((a, b) => b.activityScore - a.activityScore);
    
    const result = sortedDomains.slice(0, limit);
    console.log(`🎉 Returning ${result.length} most active domains`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Failed to fetch most active domains:', error);
    throw error;
  }
}

/**
 * Process activity data to calculate activity scores
 */
function processActivityData(data: ActivityData): ActivityBasedDomain[] {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  return data.domains.map(domain => {
    // Find listing for this domain
    const domainListing = data.listings.find(listing => 
      listing.name === domain.name
    );
    
    // Calculate activity score based on multiple factors
    let activityScore = 0;
    
    // Base score from active offers
    activityScore += domain.activeOffersCount * 10;
    
    // Score from recent listing
    if (domainListing) {
      const listingDate = new Date(domainListing.createdAt);
      const daysSinceListing = (Date.now() - listingDate.getTime()) / (24 * 60 * 60 * 1000);
      
      // Higher score for more recent listings
      if (daysSinceListing <= 1) activityScore += 50;
      else if (daysSinceListing <= 7) activityScore += 30;
      else if (daysSinceListing <= 30) activityScore += 15;
      
      // Bonus for high-value listings
      const priceInEth = parseFloat(domainListing.price) / 1e18;
      if (priceInEth > 1) activityScore += 20;
      else if (priceInEth > 0.5) activityScore += 10;
      else if (priceInEth > 0.1) activityScore += 5;
    }
    
    // Score from recent tokenization
    const tokenizedDate = new Date(domain.tokenizedAt);
    const daysSinceTokenization = (Date.now() - tokenizedDate.getTime()) / (24 * 60 * 60 * 1000);
    
    if (daysSinceTokenization <= 1) activityScore += 25;
    else if (daysSinceTokenization <= 7) activityScore += 15;
    else if (daysSinceTokenization <= 30) activityScore += 10;
    
    // Determine last activity
    const lastActivity = domainListing?.createdAt || domain.tokenizedAt;
    
    return {
      name: domain.name,
      tokenizedAt: domain.tokenizedAt,
      activeOffersCount: domain.activeOffersCount || 0,
      listingPrice: domainListing?.price,
      currency: domainListing?.currency?.symbol,
      listingCreatedAt: domainListing?.createdAt,
      activityScore: Math.round(activityScore),
      lastActivity: lastActivity
    };
  });
}

/**
 * Get domains with recent activity (listings in last 30 days)
 */
export async function getRecentActivityDomains(limit: number = 20): Promise<ActivityBasedDomain[]> {
  try {
    console.log('📅 Fetching domains with recent activity...');
    
    const query = `
      query GetRecentActivityDomains {
        listings(take: 200) {
          items {
            name
            price
            currency {
              symbol
            }
            createdAt
          }
        }
      }
    `;
    
    const response = await graphqlClient.request(query);
    const data = response as any;
    const listings = data.listings.items || [];
    
    // Filter listings from the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const recentListings = listings.filter((listing: any) => 
      new Date(listing.createdAt) >= thirtyDaysAgo
    );
    
    console.log(`✅ Found ${recentListings.length} recent listings`);
    
    // Convert to activity-based domains
    const activityDomains = recentListings.map((listing: any) => ({
      name: listing.name,
      tokenizedAt: listing.createdAt, // Use listing date as proxy
      activeOffersCount: 0,
      listingPrice: listing.price,
      currency: listing.currency?.symbol,
      listingCreatedAt: listing.createdAt,
      activityScore: 50, // High score for recent listings
      lastActivity: listing.createdAt
    }));
    
    return activityDomains.slice(0, limit);
    
  } catch (error) {
    console.error('❌ Failed to fetch recent activity domains:', error);
    throw error;
  }
}
