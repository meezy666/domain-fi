import { GraphQLClient } from 'graphql-request';

// Doma testnet subgraph endpoint
const DOMA_SUBGRAPH_URL = process.env.NEXT_PUBLIC_DOMA_SUBGRAPH || 'https://api-testnet.doma.xyz/graphql';

// Get API key from environment
const DOMA_API_KEY = process.env.NEXT_PUBLIC_DOMA_API_KEY;

// Create GraphQL client with authentication
export const graphqlClient = new GraphQLClient(DOMA_SUBGRAPH_URL, {
  headers: DOMA_API_KEY ? {
    'Api-Key': DOMA_API_KEY,
    'Content-Type': 'application/json'
  } : {
    'Content-Type': 'application/json'
  }
});

// Domain information query
export const GET_DOMAIN_QUERY = `
  query GetDomain($name: String!) {
    name(id: $name) {
      id
      labelName
      labelhash
      createdAt
      parent {
        id
      }
      resolver {
        address
        textRecords {
          key
          value
        }
      }
    }
  }
`;

// Domain statistics query
export const GET_DOMAIN_STATS_QUERY = `
  query GetDomainStats($name: String!) {
    nameStatistics(id: $name) {
      id
      salesCount
      totalVolume
      averagePrice
      lastSalePrice
      lastSaleTimestamp
    }
  }
`;

// Listings and offers query
export const GET_LISTINGS_AND_OFFERS_QUERY = `
  query GetListingsAndOffers($name: String!) {
    listings(where: { name: $name }) {
      id
      price
      currency
      seller
      createdAt
      expiresAt
    }
    offers(where: { name: $name }) {
      id
      price
      currency
      buyer
      createdAt
      expiresAt
    }
  }
`;

// Domain activities query
export const GET_DOMAIN_ACTIVITIES_QUERY = `
  query GetDomainActivities($name: String!) {
    nameActivities(where: { name: $name }, orderBy: timestamp, orderDirection: desc) {
      id
      type
      timestamp
      price
      currency
      from
      to
      transactionHash
    }
  }
`;

// Get recent domain activities across all domains (for trending)
export const GET_RECENT_ACTIVITIES_QUERY = `
  query GetRecentActivities($first: Int!, $skip: Int!) {
    nameActivities(
      first: $first
      skip: $skip
      orderBy: timestamp
      orderDirection: desc
      where: { timestamp_gte: "${Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)}" }
    ) {
      id
      name
      type
      timestamp
      price
      currency
      from
      to
      transactionHash
    }
  }
`;


// Get all names (for trending domains) - simplified query
export const GET_ALL_NAMES_QUERY = `
  query GetAllNames {
    names {
      items {
        name
        expiresAt
        tokenizedAt
        claimedBy
        isFractionalized
        activeOffersCount
      }
      totalCount
    }
  }
`;

// Get recent name activities (requires name parameter)
export const GET_NAME_ACTIVITIES_QUERY = `
  query GetNameActivities($name: String!) {
    nameActivities(name: $name) {
      items {
        type
        timestamp
        price
        currency
        from
        to
        transactionHash
      }
      totalCount
    }
  }
`;

// Get active listings
export const GET_ACTIVE_LISTINGS_QUERY = `
  query GetActiveListings {
    listings {
      name
      price
      currency
      seller
      createdAt
      expiresAt
    }
  }
`;

// Get trending domains from last 30 days with activity and market data
export const GET_TRENDING_DOMAINS_30_DAYS = `
  query GetTrendingDomains30Days {
    # Get domains with recent listings (last 30 days)
    recentListings: listings(createdSince: "2025-09-03T00:00:00Z", take: 50) {
      items {
        name
        price
        currency { symbol }
        createdAt
      }
    }
    
    # Get domains with active offers
    domainsWithOffers: names(statuses: [OFFERS_RECEIVED], take: 10) {
      items {
        name
        tokenizedAt
        activeOffersCount
      }
    }
    
    # Get domains with active listings
    listedDomains: names(listed: true, take: 20) {
      items {
        name
        tokenizedAt
        activeOffersCount
      }
    }
  }
`;

// Get domains with activity in last 30 days
export const GET_ACTIVE_DOMAINS_30_DAYS = `
  query GetActiveDomains30Days($limit: Int!) {
    names(
      take: $limit
      orderBy: tokenizedAt
      orderDirection: desc
    ) {
      items {
        name
        tokenizedAt
        activeOffersCount
      }
    }
  }
`;

// Get domains with highest activity based on recent listings and offers
export const GET_MOST_ACTIVE_DOMAINS = `
  query GetMostActiveDomains($domainsLimit: Int!, $listingsLimit: Int!) {
    names(take: $domainsLimit) {
      items {
        name
        tokenizedAt
        activeOffersCount
      }
    }
    listings(take: $listingsLimit) {
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

// Get domains with recent activity (listings in last 30 days)
export const GET_RECENT_ACTIVITY_DOMAINS = `
  query GetRecentActivityDomains($listingsLimit: Int!) {
    listings(take: $listingsLimit) {
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

// Types for GraphQL responses
export interface Domain {
  id: string;
  labelName: string;
  labelhash: string;
  createdAt: string;
  parent?: {
    id: string;
  };
  resolver?: {
    address: string;
    textRecords: Array<{
      key: string;
      value: string;
    }>;
  };
}

export interface DomainStats {
  id: string;
  salesCount: number;
  totalVolume: string;
  averagePrice: string;
  lastSalePrice: string;
  lastSaleTimestamp: string;
}

export interface Listing {
  id: string;
  price: string;
  currency: string;
  seller: string;
  createdAt: string;
  expiresAt: string;
}

export interface Offer {
  id: string;
  price: string;
  currency: string;
  buyer: string;
  createdAt: string;
  expiresAt: string;
}

export interface DomainActivity {
  id: string;
  type: string;
  timestamp: string;
  price: string;
  currency: string;
  from: string;
  to: string;
  transactionHash: string;
}
