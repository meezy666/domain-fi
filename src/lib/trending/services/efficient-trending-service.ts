/**
 * Efficient Trending Service
 * Uses optimized GraphQL queries to get trending domains with minimal API calls
 */

import { graphqlClient, GET_TRENDING_DOMAINS_30_DAYS } from '../../graphql';

export interface EfficientTrendingDomain {
  name: string;
  tokenizedAt: string;
  activeOffersCount: number;
  activityCount: number;
  listingPrice?: string;
  currency?: string;
  lastActivity?: string;
}

export interface TrendingData {
  domains: EfficientTrendingDomain[];
  activities: Array<{
    name: string;
    type: string;
    createdAt: string;
    price?: string;
  }>;
  listings: Array<{
    name: string;
    price: string;
    currency: { symbol: string };
    createdAt: string;
  }>;
}

interface GraphQLResponse {
  recentListings: {
    items: Array<{
      name: string;
      price: string;
      currency: { symbol: string };
      createdAt: string;
    }>;
  };
  domainsWithOffers: {
    items: Array<{
      name: string;
      tokenizedAt: string;
      activeOffersCount: number;
    }>;
  };
  listedDomains: {
    items: Array<{
      name: string;
      tokenizedAt: string;
      activeOffersCount: number;
    }>;
  };
  names?: {
    items: Array<{
      name: string;
      tokenizedAt: string;
      activeOffersCount: number;
    }>;
  };
  nameActivities?: {
    items: Array<{
      name: string;
      type: string;
      createdAt: string;
      price?: string;
    }>;
  };
}

/**
 * Fetch trending domains efficiently with a single GraphQL query
 */
export async function fetchEfficientTrendingDomains(limit: number = 8): Promise<EfficientTrendingDomain[]> {
  try {
    console.log('🚀 Fetching trending domains efficiently...');
    
    // Use the working 30-day trending query (no need for multiple batches since it gets recent data)
    const response = await graphqlClient.request(GET_TRENDING_DOMAINS_30_DAYS);
    
    const data = response as GraphQLResponse;
    const recentListings = data.recentListings.items || [];
    const domainsWithOffers = data.domainsWithOffers.items || [];
    const listedDomains = data.listedDomains.items || [];

    console.log(`✅ Got ${recentListings.length} recent listings, ${domainsWithOffers.length} domains with offers, ${listedDomains.length} listed domains`);

    // Combine all domains and score by PRICE + ACTIVITY
    const allDomainsMap = new Map();
    
    // Add domains with recent listings (last 30 days) - these have both price and activity
    recentListings.forEach((listing) => {
      const priceInEth = parseFloat(listing.price) / 1e18;
      const activityScore = 3; // High activity for recent listings
      const priceScore = priceInEth; // Price in ETH
      const combinedScore = (priceScore * 0.6) + (activityScore * 0.4); // 60% price, 40% activity
      
      allDomainsMap.set(listing.name, {
        name: listing.name,
        tokenizedAt: listing.createdAt,
        activeOffersCount: 0,
        activityCount: activityScore,
        listingPrice: listing.price,
        currency: listing.currency?.symbol,
        lastActivity: listing.createdAt,
        priceInEth: priceInEth,
        combinedScore: combinedScore,
        priority: 'recent_listing'
      });
    });
    
    // Add domains with offers (medium activity, no price data)
    domainsWithOffers.forEach((domain) => {
      if (!allDomainsMap.has(domain.name)) {
        const activityScore = 2; // Medium activity for offers
        const priceScore = 0; // No price data
        const combinedScore = (priceScore * 0.6) + (activityScore * 0.4);
        
        allDomainsMap.set(domain.name, {
          name: domain.name,
          tokenizedAt: domain.tokenizedAt,
          activeOffersCount: domain.activeOffersCount || 0,
          activityCount: activityScore,
          listingPrice: undefined,
          currency: undefined,
          lastActivity: domain.tokenizedAt,
          priceInEth: 0,
          combinedScore: combinedScore,
          priority: 'has_offers'
        });
      }
    });
    
    // Add other listed domains (lower activity, no price data)
    listedDomains.forEach((domain) => {
      if (!allDomainsMap.has(domain.name)) {
        const activityScore = 1; // Lower activity for just being listed
        const priceScore = 0; // No price data
        const combinedScore = (priceScore * 0.6) + (activityScore * 0.4);
        
        allDomainsMap.set(domain.name, {
          name: domain.name,
          tokenizedAt: domain.tokenizedAt,
          activeOffersCount: domain.activeOffersCount || 0,
          activityCount: activityScore,
          listingPrice: undefined,
          currency: undefined,
          lastActivity: domain.tokenizedAt,
          priceInEth: 0,
          combinedScore: combinedScore,
          priority: 'listed'
        });
      }
    });
    
    const allDomains = Array.from(allDomainsMap.values());
    
    console.log(`📊 Total domains processed: ${allDomains.length}`);
    
    // Sort by COMBINED SCORE (price + activity) ONLY
    const sortedDomains = allDomains.sort((a, b) => {
      return b.combinedScore - a.combinedScore;
    });
    
    // Return top domains with variety
    const result = sortedDomains.slice(0, limit);
    console.log(`🎉 Returning ${result.length} trending domains`);
    
    // Log the top domains with their scores
    console.log('🏆 Top trending domains:');
    result.forEach((domain, index) => {
      console.log(`${index + 1}. ${domain.name} - Price: ${domain.priceInEth} ETH, Activity: ${domain.activityCount}, Combined Score: ${domain.combinedScore.toFixed(2)}`);
    });
    
    return result;
    
  } catch (error) {
    console.error('❌ Failed to fetch efficient trending domains:', error);
    throw error;
  }
}

/**
 * Get domains with activity in the last 30 days
 */
export async function getActiveDomains30Days(limit: number = 20): Promise<EfficientTrendingDomain[]> {
  try {
    console.log('📅 Fetching domains with activity in last 30 days...');
    
    const response = await graphqlClient.request(GET_TRENDING_DOMAINS_30_DAYS, {
      limit: limit * 2, // Get more to filter
      skip: 0
    });
    
    const data = response as GraphQLResponse;
    const domains = data.names?.items || [];
    const activities = data.nameActivities?.items || [];
    
    // Filter domains that have activity in the last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const activeDomains = domains.filter((domain: { name: string }) => {
      const domainActivities = activities.filter((activity: { name: string; createdAt: string }) => 
        activity.name === domain.name && 
        new Date(activity.createdAt) >= thirtyDaysAgo
      );
      return domainActivities.length > 0;
    });
    
    console.log(`✅ Found ${activeDomains.length} domains with recent activity`);
    
    return activeDomains.slice(0, limit).map(domain => ({
      ...domain,
      activityCount: 1 // Add missing activityCount property
    }));
    
  } catch (error) {
    console.error('❌ Failed to fetch active domains:', error);
    throw error;
  }
}
