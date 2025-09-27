# DomainFi Trait-Scoring & Analytics Dashboard
## Comprehensive Foundational Project Documentation

### Table of Contents
1. [Project Overview](#project-overview)
2. [Hackathon Requirements & Doma Protocol](#hackathon-requirements--doma-protocol)
3. [Project Vision & Objectives](#project-vision--objectives)
4. [Domain Scoring Methodology](#domain-scoring-methodology)
5. [Technical Architecture](#technical-architecture)
6. [Technology Stack](#technology-stack)
7. [API Integration Details](#api-integration-details)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Deployment Strategy](#deployment-strategy)
10. [Success Metrics & Risk Mitigation](#success-metrics--risk-mitigation)

---

## Project Overview

**Project Name:** DomainFi Trait-Scoring & Analytics Dashboard  
**Hackathon Track:** Track 4 - Trait Scoring & Analytics  
**Timeline:** 7-day MVP development  
**Target Platform:** Next.js + TypeScript on Vercel  

### What We're Building

A comprehensive analytics dashboard that evaluates domain names on the Doma Protocol testnet, providing:
- **Rarity scoring** based on multiple domain traits
- **Market analytics** with trends and insights
- **Investment recommendations** for domain investors
- **On-chain integration** for listing and trading domains

### Why This Project

The domain industry lacks transparency in valuation. Our solution addresses this by:
- Providing data-driven domain rarity scores
- Visualizing market trends and opportunities
- Enabling informed investment decisions
- Driving on-chain activity through Doma Protocol integration

---

## Hackathon Requirements & Doma Protocol

### DomainFi Challenge Overview
The DomainFi Challenge is a Web3 hackathon hosted on DoraHacks in partnership with Doma Protocol. Its goal is to inspire developers to build decentralized applications (dApps) that show how traditional domain names can become programmable, tokenized assets on blockchains. Participants are encouraged to create minimum-viable products (MVPs) that drive on-chain activity and integrate deeply with Doma's domain-tokenization infrastructure.

### Key Dates & Timeline (2025)
- **Pre-registration opens:** August 9, 2025 - teams and individuals can sign up and form teams
- **Submission window opens:** August 16, 2025 - builders may submit projects for judging
- **Final submission deadline:** October 3, 2025 - all entries must be completed and submitted
- **Winners announced:** October 17, 2025 - winners and runners-up are selected per track

### Prize Pool & Judging Criteria
- **Prize Pool:** $50,000 USDC total, divided into five tracks with $10,000 per track winner
- **Additional:** Access to Doma's Forge grants for further development

**Judging Criteria (Must Optimize For):**
1. **Innovation (40%)** - Originality and market impact
2. **Doma Integration & On-chain Impact (30%)** - Depth of integration with Doma and potential to drive transactions
3. **Usability (20%)** - Polish, user experience and practicality
4. **Demo Quality (10%)** - Clarity and professional presentation

### Required Deliverables
- [ ] Public GitHub (or GitLab/Bitbucket) repository
- [ ] Description of how Doma is used specifically for this hackathon
- [ ] Explanation of how the submission addresses the goals of the chosen track
- [ ] Active X/Twitter account for the project
- [ ] Recorded demo video and walkthrough (3-5 minutes)
- [ ] Additional documentation and relevant links

### Team Constraints & Rules
- **Team Size:** Maximum 5 participants
- **Track Selection:** Must submit under a single official track
- **Protocol Usage:** Must use Doma Protocol and testnet
- **Originality:** Must be original work (open source libraries encouraged)
- **Focus:** Must drive metrics like transactions, user adoption, and revenue potential

### Doma Ambassador Bonus Challenges
Additional opportunities for extra points and recognition:
- Join Doma's X/Twitter and Discord channels and share hack progress
- Create helpful content (threads, articles, blogs) about the protocol
- Contribute code or documentation to Doma GitHub/Forge
- Identify bugs in the testnet
- **Rewards:** Doma Ambassador status, cash bonuses, badges, and discounts on new TLDs

### What is DomainFi?
DomainFi is a vision of transforming domain names—traditionally illiquid and highly regulated assets—into dynamic, programmable tokens on blockchains. The Doma Protocol addresses limitations of the conventional domain industry:

1. **Trusted Domain Tokenization:** Secure on-ramp for registrars to tokenize domains onto the blockchain while maintaining ICANN compliance
2. **State Synchronization:** Bi-directional synchronization between on-chain domain assets and ICANN registries
3. **Composable Domain Rights:** Ability to split domains into synthetic tokens representing specific rights (DNS management, sub-domain creation)
4. **DomainFi Application Infrastructure:** Suite of APIs and smart contracts for instant-settlement marketplaces, fractional ownership, domain-collateralized lending

### Network & API Endpoints
**Doma Testnet Environment:**
- **Chain ID:** 97476
- **Native Currency:** ETH
- **Bridge:** https://bridge-testnet.doma.xyz
- **RPC Server:** https://rpc-testnet.doma.xyz
- **Blockchain Explorer:** https://explorer-testnet.doma.xyz
- **REST API:** https://api-testnet.doma.xyz
- **Subgraph API:** https://api-testnet.doma.xyz/graphql

---

## Project Vision & Objectives

### Primary Objectives

1. **Compute Domain Rarity Scores**
   - Analyze domain characteristics (length, patterns, TLD, activity)
   - Generate normalized scores (0-100) for easy comparison
   - Provide factor breakdowns for transparency

2. **Visualize Market Data**
   - Display sales trends and transaction volumes
   - Show popular domain categories and TLDs
   - Highlight market opportunities

3. **Enable Informed Decisions**
   - Suggest similar domains for comparison
   - Identify undervalued opportunities
   - Provide investment insights

4. **Drive On-chain Activity**
   - Integrate listing/offer creation
   - Facilitate domain transactions
   - Generate measurable on-chain impact

### Success Metrics
- **User Engagement:** Domain searches and score views
- **On-chain Impact:** Number of listings/offers created
- **Data Quality:** Accuracy of rarity predictions
- **Market Insights:** Unique analytics provided

---

## Technical Architecture

### System Overview
```
[User Interface] → [Next.js App] → [GraphQL Client] → [Doma Subgraph]
     ↓
[Scoring Engine] → [Analytics Module] → [Recommendation System]
     ↓
[Wallet Integration] → [Serverless API] → [Doma Orderbook]
```

### Core Components

1. **Frontend Layer**
   - Next.js 15 with TypeScript
   - Responsive UI with modern design
   - Real-time data visualization

2. **Data Layer**
   - GraphQL client for Doma subgraph
   - Local caching for performance
   - Serverless API routes for writes

3. **Scoring Engine**
   - Multi-factor analysis algorithm
   - Configurable weights and parameters
   - Extensible for ML integration

4. **Analytics Module**
   - Market trend analysis
   - Comparative domain insights
   - Investment recommendations

---

## Domain Scoring Methodology

### Traits to Score
The rarity scoring system evaluates several domain attributes to produce a comprehensive rarity score:

1. **Name Length:** Shorter names generally command higher value. Scores decrease as character count increases.
2. **Character Pattern:** Names consisting solely of letters or numbers are usually more brandable. The scoring module rewards such patterns and penalizes hyphens or random strings.
3. **TLD Rarity:** Each top-level domain (TLD) on Doma (e.g., .sol, .ape) receives a weight based on supply and popularity. Rarer or trending TLDs boost scores.
4. **On-chain Activity:** Metrics from nameStatistics and nameActivities queries—such as past sales count, average price, and activity frequency—signal market demand. Moderate activity indicates desirability, whereas extremely high turnover may reduce scarcity.
5. **Expiration Factor:** Domains nearing expiration may require renewal fees and carry uncertainty. Names with long remaining durations receive a bonus.

### Mathematical Scoring Formula
The scoring module computes a **Normalized Rarity Score** between 0 and 100 using a weighted formula:

```
Score = 100 × (α·WL + β·WP + γ·WT + δ·WA + ε·WE) / (α + β + γ + δ + ε)
```

Where:
- **WL** = Length factor (normalized 0-1)
- **WP** = Pattern factor (normalized 0-1)  
- **WT** = TLD rarity factor (normalized 0-1)
- **WA** = Activity factor (normalized 0-1)
- **WE** = Expiration factor (normalized 0-1)
- **α, β, γ, δ, ε** = Tunable hyperparameters

### Factor Normalization

#### 1. Length Factor (WL) - Weight: α = 0.25
```
WL = 1 - (length - l_min) / (l_max - l_min)
```
- **Range:** 3-23 characters typically
- **Logic:** Shorter domains are more valuable

#### 2. Character Pattern (WP) - Weight: β = 0.20
- **Only letters or numbers:** 1.0
- **Letters and numbers mixed:** 0.8
- **Includes hyphen or special symbols:** 0.6
- **Random/unpronounceable patterns:** 0.3

#### 3. TLD Rarity (WT) - Weight: γ = 0.20
- **Premium TLDs (.sol, .core):** 1.0
- **Common TLDs (.com, .org):** 0.8
- **New TLDs (.app, .dev):** 0.6
- **Generic TLDs (.net, .info):** 0.4

#### 4. On-chain Activity (WA) - Weight: δ = 0.25
```
WA = normalize(sales_count, volume, activity_frequency)
```
- **High activity (10+ transactions):** 1.0
- **Medium activity (3-9 transactions):** 0.7
- **Low activity (1-2 transactions):** 0.4
- **No activity:** 0.2

#### 5. Expiration Factor (WE) - Weight: ε = 0.10
```
WE = remaining_days / max_observed_days
```
- **Long duration (>1 year):** 1.0
- **Medium duration (6-12 months):** 0.7
- **Short duration (1-6 months):** 0.4
- **Near expiry (<1 month):** 0.1

### Initial Hyperparameter Settings
```
α = 0.25 (Length)
β = 0.20 (Pattern)  
γ = 0.20 (TLD)
δ = 0.25 (Activity)
ε = 0.10 (Expiration)
```

### Score Interpretation
- **90-100:** Exceptional rarity and value
- **80-89:** High value with strong potential
- **70-79:** Good investment opportunity
- **60-69:** Moderate value
- **Below 60:** Lower priority domains

### Future ML Enhancement
As more data accumulates, these parameters can be refined using machine-learning techniques (linear regression, random forest) on historical sales data to improve prediction accuracy.

---

## Technology Stack

### Frontend
- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Headless UI
- **Charts:** Recharts or Chart.js
- **State Management:** Zustand or React Context

### Backend/API
- **Runtime:** Node.js (Vercel serverless)
- **GraphQL Client:** graphql-request or urql
- **API Routes:** Next.js API routes
- **Authentication:** Wallet-based (wagmi + viem)

### Blockchain Integration
- **Wallet:** RainbowKit + wagmi
- **RPC:** Doma testnet RPC
- **Contracts:** Doma Protocol contracts
- **Explorer:** Doma testnet explorer

### Development Tools
- **Package Manager:** npm or pnpm
- **Linting:** ESLint + Prettier
- **Testing:** Jest + React Testing Library
- **Deployment:** Vercel

### Environment Variables
```env
# Doma Testnet Configuration
NEXT_PUBLIC_DOMA_SUBGRAPH=https://api-testnet.doma.xyz/graphql
NEXT_PUBLIC_DOMA_RPC=https://rpc-testnet.doma.xyz
NEXT_PUBLIC_DOMA_EXPLORER=https://explorer-testnet.doma.xyz
NEXT_PUBLIC_DOMA_BRIDGE=https://bridge-testnet.doma.xyz
NEXT_PUBLIC_CHAIN_ID=97476

# API Keys (Server-side only)
DOMA_API_KEY=your_api_key_here
DOMA_API_URL=https://api-testnet.doma.xyz

# Optional: Poll API for real-time updates
NEXT_PUBLIC_ENABLE_POLL_API=false
```

---

## Implementation Roadmap

### Day 1: Research & Setup
**Goals:** Understand Doma Protocol and set up development environment

**Tasks:**
- [ ] Study Doma documentation and API endpoints
- [ ] Experiment with GraphQL queries on testnet
- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Git repository and project structure
- [ ] Configure development environment

**Deliverables:**
- Working Next.js app
- Basic GraphQL client setup
- Project documentation structure

### Day 2: Scoring Engine & Data Integration
**Goals:** Build core scoring algorithm and data fetching

**Tasks:**
- [ ] Implement domain scoring algorithm
- [ ] Create GraphQL queries for domain data
- [ ] Build data fetching utilities
- [ ] Write unit tests for scoring functions
- [ ] Set up data caching layer

**Deliverables:**
- Functional scoring engine
- Data integration layer
- Test suite for core logic

### Day 3: Frontend Pages & UI
**Goals:** Create user interface and domain search functionality

**Tasks:**
- [ ] Design and implement search page
- [ ] Create domain detail page with score breakdown
- [ ] Build responsive UI components
- [ ] Integrate charts and data visualization
- [ ] Implement navigation and routing

**Deliverables:**
- Complete frontend interface
- Domain search and display functionality
- Responsive design implementation

### Day 4: Analytics Dashboard
**Goals:** Build market analytics and trending features

**Tasks:**
- [ ] Create dashboard with market overview
- [ ] Implement trending domains section
- [ ] Build TLD analytics
- [ ] Add comparative domain features
- [ ] Create recommendation engine

**Deliverables:**
- Analytics dashboard
- Market insights and trends
- Domain recommendations

### Day 5: On-chain Integration
**Goals:** Add wallet connectivity and transaction capabilities

**Tasks:**
- [ ] Integrate wallet connection (RainbowKit)
- [ ] Create API routes for orderbook operations
- [ ] Implement listing/offer creation
- [ ] Add transaction status tracking
- [ ] Test on-chain interactions

**Deliverables:**
- Wallet integration
- On-chain transaction capabilities
- API routes for Doma integration

### Day 6: Testing & Polish
**Goals:** Ensure quality and fix any issues

**Tasks:**
- [ ] Comprehensive testing (unit, integration, e2e)
- [ ] Performance optimization
- [ ] UI/UX improvements
- [ ] Error handling and edge cases
- [ ] Accessibility compliance

**Deliverables:**
- Fully tested application
- Optimized performance
- Polished user experience

### Day 7: Documentation & Demo
**Goals:** Prepare for submission and create demo materials

**Tasks:**
- [ ] Write comprehensive README
- [ ] Create API documentation
- [ ] Record demo video
- [ ] Prepare submission materials
- [ ] Deploy to production

**Deliverables:**
- Complete documentation
- Demo video
- Production deployment
- Submission-ready project

---

## API Integration Details

### Multi-Chain Subgraph
Doma's Multi-Chain Subgraph consolidates data about tokenized domain names. It provides queries such as `names`, `listings`, `offers`, `nameActivities`, and `nameStatistics` to fetch metadata, trading activity, auctions, and aggregated statistics. The subgraph is publicly accessible from the browser and eliminates the need to run a separate indexer.

#### Domain Information Query
```graphql
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
```

#### Domain Statistics Query
```graphql
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
```

#### Listings and Offers Query
```graphql
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
```

#### Domain Activities Query
```graphql
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
```

### Orderbook API
The Orderbook API enables creating, cancelling, and querying listings/offers on supported orderbooks (e.g., OpenSea or Doma). **Important:** An Api-Key is mandatory for all POST/GET calls; missing or invalid keys trigger 401 or 403 errors. Secret keys should be used server-side (e.g., in Vercel API routes) rather than exposed on the client.

#### Key Endpoints:
- **Create listing:** `POST /v1/orderbook/list` with orderbook identifier, chain ID, order parameters, and EIP-712 signature
- **Create offer:** `POST /v1/orderbook/offer` with similar parameters
- **Cancel listing/offer:** `POST /v1/orderbook/listing/cancel` or `/v1/orderbook/offer/cancel`
- **Fetch fees/currencies:** `GET /v1/orderbook/fee/{orderbook}/{chainId}/{contractAddress}`
- **Fulfillment info:** Endpoints for listing or offer fulfillment by order ID

#### Serverless API Routes Implementation
```typescript
// /api/orderbook/list
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, price, currency, chainId } = req.body;
  
  const response = await fetch(`${process.env.DOMA_API_URL}/v1/orderbook/list`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Api-Key': process.env.DOMA_API_KEY
    },
    body: JSON.stringify({
      orderbook: 'doma',
      chainId: chainId || 97476,
      name,
      price,
      currency,
      // Additional order parameters
    })
  });
  
  const data = await response.json();
  res.status(200).json(data);
}
```

#### Create Listing (Client-side)
```typescript
const createListing = async (domain: string, price: string, currency: string) => {
  const response = await fetch('/api/orderbook/list', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: domain,
      price,
      currency,
      chainId: 97476
    })
  });
  return response.json();
};
```

#### Create Offer (Client-side)
```typescript
const createOffer = async (domain: string, price: string, currency: string) => {
  const response = await fetch('/api/orderbook/offer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: domain,
      price,
      currency,
      chainId: 97476
    })
  });
  return response.json();
};
```

### Poll API (Optional - Real-time Updates)
To obtain real-time updates, Doma offers a Poll API that streams protocol events. The integration follows a Poll → Acknowledge pattern:

```typescript
// Poll for new events
const pollEvents = async () => {
  const response = await fetch(`${process.env.DOMA_API_URL}/v1/poll`, {
    headers: {
      'Api-Key': process.env.DOMA_API_KEY
    }
  });
  return response.json();
};

// Acknowledge receipt
const acknowledgeEvents = async (lastEventId: string) => {
  await fetch(`${process.env.DOMA_API_URL}/v1/poll/ack/${lastEventId}`, {
    method: 'POST',
    headers: {
      'Api-Key': process.env.DOMA_API_KEY
    }
  });
};
```

### Data Flow Architecture
1. **User enters domain name** (e.g., example.sol) in search bar
2. **Client sends GraphQL query** to Doma subgraph to fetch domain metadata, recent listings/offers, and statistics
3. **Scoring module computes** rarity score using the factors above
4. **UI renders** score, breakdown, price chart, and similar domain suggestions
5. **Optional on-chain actions:** User connects wallet, client calls serverless route, which forwards signed order to Orderbook API using stored Api-Key
6. **Application records** transaction and updates UI with on-chain status

---

## Deployment Strategy

### Vercel Deployment

1. **Repository Setup**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Vercel Configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "framework": "nextjs"
   }
   ```

3. **Environment Variables**
   - Set in Vercel dashboard
   - Include all required API keys
   - Configure for production environment

4. **Domain Configuration**
   - Custom domain setup (optional)
   - SSL certificate (automatic)
   - CDN optimization (automatic)

### Performance Optimization

- **Static Generation:** Pre-render static pages
- **Image Optimization:** Next.js Image component
- **Code Splitting:** Automatic with Next.js
- **Caching:** Implement Redis or similar for API responses

---

## Success Metrics

### Technical Metrics
- **Page Load Time:** < 2 seconds
- **API Response Time:** < 500ms
- **Uptime:** > 99.9%
- **Error Rate:** < 1%

### User Engagement Metrics
- **Domain Searches:** Track daily searches
- **Score Views:** Monitor score page visits
- **On-chain Actions:** Count listings/offers created
- **Return Users:** Measure user retention

### Business Metrics
- **On-chain Impact:** Number of transactions generated
- **Market Insights:** Unique analytics provided
- **User Feedback:** Collect and analyze user input
- **Community Engagement:** Social media metrics

### Hackathon Success Criteria
- **Innovation Score:** Unique features and approach
- **Doma Integration:** Comprehensive protocol usage
- **Usability:** Intuitive and polished interface
- **Demo Quality:** Clear and compelling presentation

---

## Risk Mitigation

### Technical Risks
- **API Rate Limits:** Implement caching and request throttling
- **Data Availability:** Handle missing or incomplete data gracefully
- **Performance Issues:** Optimize queries and implement pagination
- **Browser Compatibility:** Test across major browsers

### Project Risks
- **Timeline Constraints:** Prioritize core features, defer nice-to-haves
- **Scope Creep:** Stick to MVP requirements, document future enhancements
- **Team Coordination:** Use clear communication and task tracking
- **External Dependencies:** Have backup plans for API failures

### Mitigation Strategies
- **Daily Standups:** Track progress and address blockers
- **Incremental Testing:** Test features as they're built
- **Documentation:** Maintain clear documentation throughout
- **Community Support:** Engage with Doma community for help

---

## Future Enhancements

### Phase 2 Features
- **Machine Learning:** Train models on historical data
- **Portfolio Management:** Multi-domain tracking and analysis
- **Real-time Alerts:** Push notifications for market changes
- **Advanced Analytics:** Predictive modeling and trend analysis

### Phase 3 Features
- **Social Features:** User profiles and domain collections
- **API Access:** Public API for third-party integrations
- **Mobile App:** Native mobile application
- **Enterprise Features:** Advanced analytics for institutions

### Long-term Vision
- **Domain Derivatives:** Futures and options trading
- **Fractional Ownership:** Shared domain investments
- **Cross-chain Integration:** Multi-blockchain support
- **AI-Powered Insights:** Advanced recommendation engine

---

## Conclusion

This foundational document provides a comprehensive blueprint for building a DomainFi Trait-Scoring & Analytics Dashboard that meets all hackathon requirements while delivering real value to domain investors. The project leverages modern web technologies, integrates deeply with Doma Protocol, and provides a clear path to success within the 7-day timeline.

The modular architecture ensures scalability, the scoring methodology provides meaningful insights, and the on-chain integration drives the required transaction volume. With careful execution of this plan, the project is positioned to excel in all judging categories and potentially win the Track 4 prize.

**Next Steps:**
1. Review and approve this foundational document
2. Set up development environment
3. Begin Day 1 implementation tasks
4. Track progress against the roadmap
5. Prepare for demo and submission

---

*This document serves as the single source of truth for the project. All development decisions should reference and align with this foundation.*
