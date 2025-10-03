'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlass, ChartLine, TrendUp, Activity, CurrencyDollar, Clock, Users, Globe } from 'phosphor-react';
import { getDomainAnalytics, type DomainAnalyticsData } from '@/lib/analytics/domain-analytics';
import Header from '@/components/Layout/Header';

// Use the comprehensive analytics interface from the service

export default function AnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [domainData, setDomainData] = useState<DomainAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for domain parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const domainParam = urlParams.get('domain');
    if (domainParam) {
      setSearchQuery(domainParam);
      // Auto-search for the domain
      setTimeout(() => {
        handleSearchForDomain(domainParam);
      }, 100);
    }
  }, []);

  const handleSearchForDomain = async (domain: string) => {
    console.log(`🎯 Analytics page received domain: ${domain}`);
    setIsLoading(true);
    setError(null);
    setDomainData(null);

    try {
      // Get comprehensive domain analytics
      const analytics = await getDomainAnalytics(domain);
      console.log(`📊 Analytics result for ${domain}:`, analytics);
      setDomainData(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch domain analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    await handleSearchForDomain(searchQuery.trim());
  };


  return (
    <div className="min-h-screen bg-neutral-950 text-white w-full">
      {/* Background */}
      <div className="fixed inset-0 bg-neutral-950">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/30 via-neutral-950/50 to-neutral-900/30"></div>
      </div>

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="relative z-10 w-full">
        {/* Page Header */}
        <div className="border-b border-neutral-800/50">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">Domain Analytics</h1>
                <p className="text-neutral-400">Research and analyze domain performance, pricing, and market trends</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <div className="bg-neutral-900/50 border border-neutral-700 rounded-lg px-4 py-2">
                  <span className="text-sm text-neutral-400">Live Data</span>
                </div>
                {domainData && (
                  <div className="bg-green-900/50 border border-green-700 rounded-lg px-4 py-2">
                    <span className="text-sm text-green-300">Real Analytics</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Search Section */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-xl blur opacity-25 group-hover:opacity-40 group-focus-within:opacity-60 group-focus-within:from-white/30 group-focus-within:to-white/30 transition-all duration-300"></div>
            <div className="relative flex bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-xl overflow-hidden shadow-2xl focus-within:border-white/30 focus-within:shadow-white/20 focus-within:shadow-2xl transition-all duration-300">
              <div className="relative flex-1 flex items-center">
                <MagnifyingGlass size={20} weight="regular" className="absolute left-5 text-neutral-400 transition-colors duration-200 z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter domain name (e.g., crypto.sol, nft.eth)"
                  className="w-full bg-transparent border-0 outline-none text-white placeholder-neutral-400 py-4 pl-14 pr-4 text-lg font-medium"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading || !searchQuery.trim()}
                className="font-bold hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 cursor-pointer hover:scale-105 flex-shrink-0"
                style={{ 
                  backgroundColor: '#ffffff',
                  color: '#0a0a0a',
                  paddingLeft: '20px',
                  paddingRight: '20px',
                  borderRadius: '0 12px 12px 0',
                  minWidth: 'fit-content',
                  whiteSpace: 'nowrap'
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin"></div>
                    <span className="font-semibold text-sm tracking-wide">Analyzing...</span>
                  </>
                ) : (
                  <>
                    <ChartLine size={20} weight="bold" />
                    <span className="font-semibold text-sm tracking-wide">Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-950/50 border border-red-800 rounded-xl p-6 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        </div>
      )}

      {domainData && (
        <div className="container mx-auto px-6 pb-12">
          {/* Domain Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Domain Card */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-neutral-900/50 to-neutral-800/30 border border-neutral-700 rounded-2xl p-8"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <h2 className="text-3xl font-bold text-white mb-3">{domainData.name}</h2>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        domainData.rarityTier === 'Legendary' ? 'bg-purple-900/50 text-purple-300' :
                        domainData.rarityTier === 'Epic' ? 'bg-blue-900/50 text-blue-300' :
                        domainData.rarityTier === 'Rare' ? 'bg-green-900/50 text-green-300' :
                        'bg-yellow-900/50 text-yellow-300'
                      }`}>
                        {domainData.rarityTier}
                      </span>
                      <span className="text-neutral-400 text-sm">{domainData.rarityScore}/100</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        domainData.domainAnalysis.investmentGrade === 'A' ? 'bg-green-900/50 text-green-300' :
                        domainData.domainAnalysis.investmentGrade === 'B' ? 'bg-blue-900/50 text-blue-300' :
                        domainData.domainAnalysis.investmentGrade === 'C' ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        Grade {domainData.domainAnalysis.investmentGrade}
                      </span>
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-4xl font-bold text-white mb-2">{domainData.marketValue}</div>
                    <div className={`flex items-center justify-center lg:justify-end space-x-1 ${
                      domainData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      <TrendUp size={16} className={domainData.priceChange24h < 0 ? 'rotate-180' : ''} />
                      <span className="text-sm font-medium">{domainData.priceChange24h >= 0 ? '+' : ''}{domainData.priceChange24h.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-neutral-800/50 rounded-lg p-4 hover:bg-neutral-800/70 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                      <CurrencyDollar size={16} className="text-green-400" />
                      <span className="text-sm text-neutral-400">24h Volume</span>
                    </div>
                    <div className="text-lg font-semibold text-white">{domainData.volume24h}</div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4 hover:bg-neutral-800/70 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                      <Activity size={16} className="text-blue-400" />
                      <span className="text-sm text-neutral-400">Activities</span>
                    </div>
                    <div className="text-lg font-semibold text-white">{domainData.activityCount}</div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4 hover:bg-neutral-800/70 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                      <Clock size={16} className="text-purple-400" />
                      <span className="text-sm text-neutral-400">Last Activity</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {new Date(domainData.lastActivity).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-4 hover:bg-neutral-800/70 transition-colors">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users size={16} className="text-orange-400" />
                      <span className="text-sm text-neutral-400">Active Offers</span>
                    </div>
                    <div className="text-lg font-semibold text-white">{domainData.activeOffersCount}</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Market Metrics */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-neutral-900/50 border border-neutral-700 rounded-2xl p-6 h-full"
              >
                <div className="flex items-center space-x-2 mb-6">
                  <ChartLine size={20} className="text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Market Metrics</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-neutral-700/50">
                    <span className="text-neutral-400 text-sm">Total Volume</span>
                    <span className="text-white font-semibold">{domainData.totalVolume}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-700/50">
                    <span className="text-neutral-400 text-sm">Average Price</span>
                    <span className="text-white font-semibold">{domainData.averagePrice}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-700/50">
                    <span className="text-neutral-400 text-sm">Highest Price</span>
                    <span className="text-green-400 font-semibold">{domainData.highestPrice}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-neutral-700/50">
                    <span className="text-neutral-400 text-sm">Lowest Price</span>
                    <span className="text-red-400 font-semibold">{domainData.lowestPrice}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-neutral-400 text-sm">Sales Count</span>
                    <span className="text-white font-semibold">{domainData.salesCount}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Price History Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-neutral-900/50 border border-neutral-700 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <ChartLine size={20} className="text-green-400" />
                  <h3 className="text-lg font-semibold text-white">Price History (30 Days)</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-400">Current Price</div>
                  <div className="text-lg font-semibold text-white">{domainData.marketValue}</div>
                </div>
              </div>
              
              {/* Price Chart */}
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-2 pb-4">
                  {domainData.priceHistory.map((point, index) => {
                    const height = Math.max(20, (point.price / Math.max(...domainData.priceHistory.map(p => p.price))) * 200);
                    const isHighest = point.price === Math.max(...domainData.priceHistory.map(p => p.price));
                    const isLowest = point.price === Math.min(...domainData.priceHistory.map(p => p.price));
                    
                    return (
                      <div key={index} className="flex flex-col items-center group">
                        <div 
                          className={`w-2 rounded-t transition-all duration-300 group-hover:w-3 ${
                            isHighest ? 'bg-green-400' : 
                            isLowest ? 'bg-red-400' : 
                            'bg-blue-400'
                          }`}
                          style={{ height: `${height}px` }}
                          title={`$${point.price.toFixed(2)} - ${new Date(point.date).toLocaleDateString()}`}
                        />
                        {index % 5 === 0 && (
                          <div className="text-xs text-neutral-500 mt-2 transform -rotate-45 origin-left">
                            {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {/* Chart Grid Lines */}
                <div className="absolute inset-0 pointer-events-none">
                  {[0, 25, 50, 75, 100].map((percent) => (
                    <div 
                      key={percent}
                      className="absolute w-full border-t border-neutral-700/30"
                      style={{ bottom: `${percent}%` }}
                    />
                  ))}
                </div>
                
                {/* Price Labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500">
                  {(() => {
                    const maxPrice = Math.max(...domainData.priceHistory.map(p => p.price));
                    const minPrice = Math.min(...domainData.priceHistory.map(p => p.price));
                    const range = maxPrice - minPrice;
                    
                    return [maxPrice, maxPrice - range * 0.5, minPrice].map((price, index) => (
                      <div key={index} className="text-right pr-2">
                        ${price.toFixed(0)}
                      </div>
                    ));
                  })()}
                </div>
              </div>
              
              {/* Chart Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-neutral-400">30d High</div>
                  <div className="text-green-400 font-semibold">
                    ${Math.max(...domainData.priceHistory.map(p => p.price)).toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-neutral-400">30d Low</div>
                  <div className="text-red-400 font-semibold">
                    ${Math.min(...domainData.priceHistory.map(p => p.price)).toFixed(2)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-neutral-400">30d Change</div>
                  <div className={`font-semibold ${
                    domainData.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {domainData.priceChange24h >= 0 ? '+' : ''}{domainData.priceChange24h.toFixed(1)}%
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Activity Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-neutral-900/50 border border-neutral-700 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Activity size={20} className="text-blue-400" />
                  <h3 className="text-lg font-semibold text-white">Activity History (7 Days)</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-neutral-400">Total Activities</div>
                  <div className="text-lg font-semibold text-white">{domainData.activityCount}</div>
                </div>
              </div>
              
              {/* Activity Chart */}
              <div className="h-64 relative">
                <div className="absolute inset-0 flex items-end justify-between px-2 pb-4">
                  {domainData.activityHistory.map((day, index) => {
                    const maxActivities = Math.max(...domainData.activityHistory.map(d => d.activities));
                    const height = maxActivities > 0 ? Math.max(20, (day.activities / maxActivities) * 200) : 20;
                    const isHighest = day.activities === maxActivities;
                    
                    return (
                      <div key={index} className="flex flex-col items-center group">
                        <div 
                          className={`w-4 rounded-t transition-all duration-300 group-hover:w-6 ${
                            isHighest ? 'bg-orange-400' : 
                            day.activities > 0 ? 'bg-blue-400' : 
                            'bg-neutral-600'
                          }`}
                          style={{ height: `${height}px` }}
                          title={`${day.activities} activities on ${new Date(day.date).toLocaleDateString()}`}
                        />
                        <div className="text-xs text-neutral-500 mt-2 transform -rotate-45 origin-left">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {/* Chart Grid Lines */}
                <div className="absolute inset-0 pointer-events-none">
                  {[0, 25, 50, 75, 100].map((percent) => (
                    <div 
                      key={percent}
                      className="absolute w-full border-t border-neutral-700/30"
                      style={{ bottom: `${percent}%` }}
                    />
                  ))}
                </div>
                
                {/* Activity Labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-neutral-500">
                  {(() => {
                    const maxActivities = Math.max(...domainData.activityHistory.map(d => d.activities));
                    return [maxActivities, Math.floor(maxActivities * 0.5), 0].map((count, index) => (
                      <div key={index} className="text-right pr-2">
                        {count}
                      </div>
                    ));
                  })()}
                </div>
              </div>
              
              {/* Activity Stats */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-sm text-neutral-400">Peak Day</div>
                  <div className="text-orange-400 font-semibold">
                    {Math.max(...domainData.activityHistory.map(d => d.activities))}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-neutral-400">Avg/Day</div>
                  <div className="text-blue-400 font-semibold">
                    {Math.round(domainData.activityHistory.reduce((sum, day) => sum + day.activities, 0) / domainData.activityHistory.length)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-neutral-400">Active Days</div>
                  <div className="text-green-400 font-semibold">
                    {domainData.activityHistory.filter(day => day.activities > 0).length}/7
                  </div>
                </div>
              </div>
              
              {/* Recent Activities List */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-neutral-300 mb-3">Recent Activities</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {domainData.recentActivities.slice(0, 5).map((activity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-2 px-3 bg-neutral-800/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'sale' ? 'bg-green-400' :
                          activity.type === 'listing' ? 'bg-blue-400' :
                          activity.type === 'offer' ? 'bg-yellow-400' :
                          'bg-neutral-400'
                        }`} />
                        <span className="text-sm text-neutral-300 capitalize">{activity.type}</span>
                      </div>
                      <div className="text-xs text-neutral-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Domain Analysis & Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Domain Analysis */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-neutral-900/50 border border-neutral-700 rounded-2xl p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Globe size={20} className="text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Domain Analysis</h3>
              </div>
              
              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-neutral-800/30 rounded-lg p-4">
                  <span className="text-neutral-400 text-sm block mb-1">TLD</span>
                  <div className="text-white font-semibold text-lg">{domainData.tld}</div>
                </div>
                <div className="bg-neutral-800/30 rounded-lg p-4">
                  <span className="text-neutral-400 text-sm block mb-1">Length</span>
                  <div className="text-white font-semibold text-lg">{domainData.length} chars</div>
                </div>
                <div className="bg-neutral-800/30 rounded-lg p-4">
                  <span className="text-neutral-400 text-sm block mb-1">Tokenized</span>
                  <div className="text-white font-semibold text-sm">
                    {new Date(domainData.tokenizedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-neutral-800/30 rounded-lg p-4">
                  <span className="text-neutral-400 text-sm block mb-1">Premium</span>
                  <div className={`font-semibold text-lg ${domainData.domainAnalysis.isPremium ? 'text-green-400' : 'text-neutral-400'}`}>
                    {domainData.domainAnalysis.isPremium ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
              
              {/* Analysis Indicators */}
              <div className="space-y-4">
                <h4 className="text-white font-medium text-sm uppercase tracking-wide">Market Indicators</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex justify-between items-center py-3 px-4 bg-neutral-800/30 rounded-lg">
                    <span className="text-neutral-400 text-sm">Market Trend</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      domainData.domainAnalysis.marketTrend === 'bullish' ? 'bg-green-900/50 text-green-300' :
                      domainData.domainAnalysis.marketTrend === 'bearish' ? 'bg-red-900/50 text-red-300' :
                      'bg-yellow-900/50 text-yellow-300'
                    }`}>
                      {domainData.domainAnalysis.marketTrend.charAt(0).toUpperCase() + domainData.domainAnalysis.marketTrend.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-neutral-800/30 rounded-lg">
                    <span className="text-neutral-400 text-sm">Risk Level</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      domainData.domainAnalysis.riskLevel === 'low' ? 'bg-green-900/50 text-green-300' :
                      domainData.domainAnalysis.riskLevel === 'medium' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-red-900/50 text-red-300'
                    }`}>
                      {domainData.domainAnalysis.riskLevel.charAt(0).toUpperCase() + domainData.domainAnalysis.riskLevel.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-neutral-800/30 rounded-lg">
                    <span className="text-neutral-400 text-sm">Crypto Related</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      domainData.domainAnalysis.isCryptoRelated ? 'bg-blue-900/50 text-blue-300' : 'bg-neutral-700 text-neutral-400'
                    }`}>
                      {domainData.domainAnalysis.isCryptoRelated ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Investment Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-neutral-900/50 border border-neutral-700 rounded-2xl p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <TrendUp size={20} className="text-green-400" />
                <h3 className="text-lg font-semibold text-white">Investment Recommendations</h3>
              </div>
              
              {/* Recommendation Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {domainData.recommendations.buy && (
                  <span className="px-4 py-2 bg-green-900/50 text-green-300 rounded-full text-sm font-semibold border border-green-700/50">
                    BUY
                  </span>
                )}
                {domainData.recommendations.hold && (
                  <span className="px-4 py-2 bg-yellow-900/50 text-yellow-300 rounded-full text-sm font-semibold border border-yellow-700/50">
                    HOLD
                  </span>
                )}
                {domainData.recommendations.sell && (
                  <span className="px-4 py-2 bg-red-900/50 text-red-300 rounded-full text-sm font-semibold border border-red-700/50">
                    SELL
                  </span>
                )}
                <div className="bg-neutral-800/50 rounded-full px-4 py-2">
                  <span className="text-neutral-300 text-sm font-medium">
                    {domainData.recommendations.confidence}% confidence
                  </span>
                </div>
              </div>
              
              {/* Recommendation Reason */}
              <div className="bg-gradient-to-r from-neutral-800/30 to-neutral-700/20 rounded-lg p-4 border border-neutral-700/50 mb-6">
                <h4 className="text-white font-medium text-sm mb-2">Analysis Summary</h4>
                <p className="text-neutral-300 text-sm leading-relaxed">
                  {domainData.recommendations.reason}
                </p>
              </div>

              {/* Market Comparison */}
              <div className="space-y-3">
                <h4 className="text-white font-medium text-sm uppercase tracking-wide">Market Comparison</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-3 px-4 bg-neutral-800/30 rounded-lg">
                    <span className="text-neutral-400 text-sm">vs Similar Domains</span>
                    <span className={`text-sm font-semibold ${
                      domainData.marketComparison.vsSimilarDomains >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {domainData.marketComparison.vsSimilarDomains >= 0 ? '+' : ''}{domainData.marketComparison.vsSimilarDomains.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-neutral-800/30 rounded-lg">
                    <span className="text-neutral-400 text-sm">vs TLD Average</span>
                    <span className={`text-sm font-semibold ${
                      domainData.marketComparison.vsTLDAverage >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {domainData.marketComparison.vsTLDAverage >= 0 ? '+' : ''}{domainData.marketComparison.vsTLDAverage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 px-4 bg-neutral-800/30 rounded-lg">
                    <span className="text-neutral-400 text-sm">vs Market Average</span>
                    <span className={`text-sm font-semibold ${
                      domainData.marketComparison.vsMarketAverage >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {domainData.marketComparison.vsMarketAverage >= 0 ? '+' : ''}{domainData.marketComparison.vsMarketAverage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          {/* Additional Information Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Domain Characteristics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-neutral-900/50 border border-neutral-700 rounded-2xl p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Activity size={20} className="text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Domain Characteristics</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-neutral-800/30 rounded-lg p-4">
                    <span className="text-neutral-400 text-sm block mb-1">Short Domain</span>
                    <div className={`font-semibold text-lg ${domainData.domainAnalysis.isShort ? 'text-green-400' : 'text-neutral-400'}`}>
                      {domainData.domainAnalysis.isShort ? 'Yes' : 'No'}
                    </div>
                  </div>
                  <div className="bg-neutral-800/30 rounded-lg p-4">
                    <span className="text-neutral-400 text-sm block mb-1">High Activity</span>
                    <div className={`font-semibold text-lg ${domainData.domainAnalysis.hasHighActivity ? 'text-green-400' : 'text-neutral-400'}`}>
                      {domainData.domainAnalysis.hasHighActivity ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
                
                <div className="bg-neutral-800/30 rounded-lg p-4">
                  <span className="text-neutral-400 text-sm block mb-1">Domain Score Breakdown</span>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-300 text-sm">Length Score</span>
                      <span className="text-white font-medium">{domainData.rarityScore > 80 ? 'Excellent' : domainData.rarityScore > 60 ? 'Good' : 'Average'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-300 text-sm">TLD Score</span>
                      <span className="text-white font-medium">{domainData.tld === 'eth' || domainData.tld === 'sol' ? 'Premium' : 'Standard'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-neutral-300 text-sm">Activity Score</span>
                      <span className="text-white font-medium">{domainData.activityCount > 5 ? 'High' : domainData.activityCount > 2 ? 'Medium' : 'Low'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Activity Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-neutral-900/50 border border-neutral-700 rounded-2xl p-6"
            >
              <div className="flex items-center space-x-2 mb-6">
                <Clock size={20} className="text-purple-400" />
                <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>
              </div>
              
              <div className="space-y-4">
                <div className="bg-neutral-800/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-400 text-sm">Tokenized</span>
                    <span className="text-white font-medium text-sm">
                      {new Date(domainData.tokenizedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    {Math.floor((Date.now() - new Date(domainData.tokenizedAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </div>
                </div>
                
                <div className="bg-neutral-800/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-400 text-sm">Last Activity</span>
                    <span className="text-white font-medium text-sm">
                      {new Date(domainData.lastActivity).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    {Math.floor((Date.now() - new Date(domainData.lastActivity).getTime()) / (1000 * 60 * 60 * 24))} days ago
                  </div>
                </div>
                
                <div className="bg-neutral-800/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-neutral-400 text-sm">Total Activities</span>
                    <span className="text-white font-medium text-sm">{domainData.activityCount}</span>
                  </div>
                  <div className="text-xs text-neutral-500">
                    {domainData.activityCount > 10 ? 'Very Active' : domainData.activityCount > 5 ? 'Active' : 'Low Activity'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        </div>
      )}
      </main>
    </div>
  );
}
