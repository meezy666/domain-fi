'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowClockwise } from 'phosphor-react';
import { 
  fetchTrendingDomains, 
  fetchTrendingDomainsEfficient,
  fetchTrendingStats,
  type TrendingDomain,
  type TrendingStats
} from '@/lib/trending';
import TrendingCard from './TrendingCard';

interface TrendingDomainsProps {
  onDomainSelect?: (domain: string) => void;
  limit?: number;
  showStats?: boolean;
  className?: string;
}

export default function TrendingDomains({ 
  onDomainSelect, 
  limit = 8, 
  showStats = true,
  className = ''
}: TrendingDomainsProps) {
  const [domains, setDomains] = useState<TrendingDomain[]>([]);
  const [stats, setStats] = useState<TrendingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrendingData();
  }, [limit]);

  const loadTrendingData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [domainsResponse, statsResponse] = await Promise.all([
        fetchTrendingDomains(limit),
        showStats ? fetchTrendingStats() : Promise.resolve(null)
      ]);

      setDomains(domainsResponse.domains);
      setStats(statsResponse);
    } catch (err) {
      console.error('Error loading trending data:', err);
      setError('Failed to load trending domains');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDomainClick = (domain: TrendingDomain) => {
    console.log(`🔥 Trending domain clicked: ${domain.name}`);
    if (onDomainSelect) {
      onDomainSelect(domain.name);
    }
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span style={{ marginLeft: '6px' }}>Trending Domains</span>
          </h3>
          <span className="text-sm text-neutral-500">Loading...</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="bg-neutral-800/30 border border-neutral-700/30 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-neutral-700 rounded mb-2"></div>
              <div className="h-3 bg-neutral-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span style={{ marginLeft: '6px' }}>Trending Domains</span>
          </h3>
          <span className="text-sm text-red-400">Error</span>
        </div>
        <div className="text-center py-8">
          <p className="text-neutral-400 mb-4">{error}</p>
          <button 
            onClick={loadTrendingData}
            className="px-4 py-2 bg-white text-neutral-950 rounded-lg font-semibold hover:bg-neutral-100 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span style={{ marginLeft: '6px' }}>Trending Domains</span>
        </h3>
        <span className="text-sm text-neutral-500">Live Data</span>
      </div>

      {/* Stats Row */}
      {showStats && stats && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-neutral-900/30 border border-neutral-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{stats.totalDomains}</div>
            <div className="text-sm text-neutral-400">Active Domains</div>
          </div>
          <div className="bg-neutral-900/30 border border-neutral-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{stats.totalVolume}</div>
            <div className="text-sm text-neutral-400">Total Volume</div>
          </div>
          <div className="bg-neutral-900/30 border border-neutral-800/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{stats.averageRarity}</div>
            <div className="text-sm text-neutral-400">Avg Rarity</div>
          </div>
        </div>
      )}

      {/* Domains Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {domains.map((domain, index) => (
            <motion.div
              key={domain.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <TrendingCard 
                domain={domain} 
                index={index}
                variant="compact" 
                onDomainClick={handleDomainClick} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Refresh Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={loadTrendingData}
          className="px-4 py-2 bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors duration-200 flex items-center space-x-2"
        >
          <ArrowClockwise size={14} />
          <span>Refresh Data</span>
        </button>
      </div>
    </div>
  );
}
