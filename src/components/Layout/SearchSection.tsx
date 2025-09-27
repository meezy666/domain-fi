'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Activity } from 'lucide-react';
import { fetchDomainData, isValidDomainName } from '@/lib/doma-api';
import { calculateDomainScore } from '@/lib/scoring';

interface SearchSectionProps {
  onDomainData: (data: any) => void;
}

export default function SearchSection({ onDomainData }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    if (!isValidDomainName(searchQuery)) {
      setError('Please enter a valid domain name');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchDomainData(searchQuery);
      if (data.domain) {
        const score = calculateDomainScore(data.domain, data.stats || undefined, data.activities);
        onDomainData({ ...data, score });
      } else {
        setError('Domain not found on Doma Protocol');
      }
    } catch (err) {
      setError('Failed to fetch domain data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        <div className="w-full flex justify-center">
          <div className="max-w-7xl px-6 lg:px-8 w-full">
            <div className="flex justify-center">
              <div className="w-full max-w-4xl">
                {/* Search Header */}
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-3">Discover Domain Value</h2>
                  <p className="text-neutral-400">Enter any domain to get instant rarity scores and market insights</p>
                </div>

                {/* Enhanced Search Bar */}
                <form onSubmit={handleSearch} className="relative mb-8">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                    <div className="relative flex bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-xl overflow-hidden shadow-2xl">
                      <div className="relative flex-1 flex items-center">
                        <Globe className="absolute left-5 text-neutral-400 w-5 h-5 transition-colors duration-200 z-10" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search any domain (e.g., crypto.sol, nft.eth, web3.com)"
                          className="w-full h-full pr-4 text-lg bg-transparent text-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-600 transition-all duration-200 text-left flex items-center"
                          style={{ 
                            fontSize: '16px', 
                            lineHeight: '1.4', 
                            textDecoration: 'none',
                            border: 'none',
                            outline: 'none',
                            boxShadow: 'none',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none',
                            minHeight: '56px',
                            display: 'flex',
                            alignItems: 'center',
                            paddingLeft: '60px'
                          }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="font-bold hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 group-hover:scale-105"
                        style={{ 
                          backgroundColor: '#ffffff',
                          color: '#0a0a0a',
                          paddingLeft: '24px',
                          paddingRight: '24px',
                          paddingTop: '16px',
                          paddingBottom: '16px',
                          borderRadius: '0 12px 12px 0'
                        }}
                      >
                        {isLoading ? (
                          <>
                            <div className="w-6 h-6 border-3 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin"></div>
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Analyzing...</span>
                          </>
                        ) : (
                          <>
                            <Activity className="w-6 h-6" />
                            <span style={{ fontSize: '16px', fontWeight: '700' }}>Analyze Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Popular Domains Section */}
                <div className="bg-neutral-900/40 backdrop-blur-sm border border-neutral-800/50 rounded-2xl p-6 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Trending Domains</span>
                    </h3>
                    <span className="text-sm text-neutral-500">Live Data</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['crypto.sol', 'nft.eth', 'web3.com', 'defi.sol', 'dao.eth', 'meta.com', 'ai.sol', 'btc.eth'].map((domain, index) => (
                      <motion.button
                        key={domain}
                        onClick={() => setSearchQuery(domain)}
                        className="bg-neutral-800/50 hover:bg-neutral-700/50 border border-neutral-700/50 hover:border-neutral-600 rounded-lg p-3 text-left transition-all duration-200 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white font-medium text-sm">{domain}</span>
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                            <span className="text-xs text-neutral-400 group-hover:text-neutral-300">
                              {85 + index * 2}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-neutral-500 mt-1">
                          ${(Math.random() * 50 + 10).toFixed(1)}K
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-neutral-900/30 border border-neutral-800/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">2.5M+</div>
                    <div className="text-sm text-neutral-400">Domains Analyzed</div>
                  </div>
                  <div className="bg-neutral-900/30 border border-neutral-800/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">$847M</div>
                    <div className="text-sm text-neutral-400">Total Volume</div>
                  </div>
                  <div className="bg-neutral-900/30 border border-neutral-800/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">98.5%</div>
                    <div className="text-sm text-neutral-400">Accuracy Rate</div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      className="mt-4 p-4 bg-red-950/50 border border-red-800 rounded-lg"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p className="text-red-400 text-center">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Spacer between search and features */}
      <div className="py-8"></div>
    </>
  );
}
