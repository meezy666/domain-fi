import { GraphQLClient } from 'graphql-request';

// Doma testnet subgraph endpoint
const DOMA_SUBGRAPH_URL = process.env.NEXT_PUBLIC_DOMA_SUBGRAPH || 'https://api-testnet.doma.xyz/graphql';

// Create GraphQL client
export const graphqlClient = new GraphQLClient(DOMA_SUBGRAPH_URL);

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
