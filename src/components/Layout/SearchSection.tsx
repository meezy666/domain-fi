'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Lightning, CaretDown, X } from 'phosphor-react';
import { fetchDomainData, isValidDomainName } from '@/lib/doma-api';
import { calculateDomainScore } from '@/lib/scoring';

interface SearchSectionProps {
  onDomainData: (data: any) => void;
}

export default function SearchSection({ onDomainData }: SearchSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [popularDomains, setPopularDomains] = useState<string[]>([]);
  const [filteredDomains, setFilteredDomains] = useState<string[]>([]);
  const [justSelected, setJustSelected] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Popular domains from Doma Protocol (mock data for now, can be replaced with real API call)
  useEffect(() => {
    const domains = [
      'crypto.sol', 'nft.eth', 'web3.com', 'defi.sol', 'dao.eth', 
      'meta.com', 'ai.sol', 'btc.eth', 'ethereum.sol', 'degen.eth',
      'uniswap.eth', 'opensea.eth', 'coinbase.sol', 'binance.com',
      'polygon.eth', 'solana.sol', 'avalanche.eth', 'chainlink.eth'
    ];
    setPopularDomains(domains);
    setFilteredDomains(domains.slice(0, 6)); // Show top 6 initially
  }, []);

  // Filter domains based on search query
  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = popularDomains.filter(domain =>
        domain.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6);
      setFilteredDomains(filtered);
    } else {
      setFilteredDomains(popularDomains.slice(0, 6));
    }
  }, [searchQuery, popularDomains]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
    setError(null);
  };

  const handleDomainSelect = (domain: string) => {
    setJustSelected(true);
    setSearchQuery(domain);
    setShowDropdown(false);
    setError(null);
    // Use setTimeout to ensure the dropdown hides immediately and reset justSelected
    setTimeout(() => {
      setJustSelected(false);
      inputRef.current?.focus();
    }, 200);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setError(null);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowDropdown(false); // Close dropdown when searching
    
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
                    <div className="absolute -inset-1 bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded-xl blur opacity-25 group-hover:opacity-40 group-focus-within:opacity-60 group-focus-within:from-white/30 group-focus-within:to-white/30 transition-all duration-300"></div>
                    <div className="relative flex bg-neutral-900/80 backdrop-blur-sm border border-neutral-700/50 rounded-xl overflow-hidden shadow-2xl focus-within:border-white/30 focus-within:shadow-white/20 focus-within:shadow-2xl transition-all duration-300">
                      <div className="relative flex-1 flex items-center">
                        <Globe size={20} weight="regular" className="absolute left-5 text-neutral-400 transition-colors duration-200 z-10" />
                        <input
                          ref={inputRef}
                          type="text"
                          value={searchQuery}
                          onChange={handleInputChange}
                          onFocus={() => !justSelected && setShowDropdown(true)}
                          placeholder="Search any domain (e.g., crypto.sol, nft.eth, web3.com)"
                          className="w-full h-full text-lg bg-transparent text-white placeholder-neutral-500 focus:outline-none focus:placeholder-neutral-600 transition-all duration-200 text-left flex items-center"
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
                            paddingLeft: '60px',
                            paddingRight: searchQuery ? '50px' : '16px'
                          }}
                        />
                        {/* Clear Button */}
                        <AnimatePresence>
                          {searchQuery && (
                            <motion.button
                              type="button"
                              onClick={handleClearSearch}
                              className="absolute right-4 p-1 rounded-full hover:bg-neutral-700/50 transition-colors duration-200 cursor-pointer z-10"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.15 }}
                            >
                              <X size={16} weight="bold" className="text-neutral-400 hover:text-neutral-200" />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="font-bold hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2 cursor-pointer hover:scale-105 flex-shrink-0"
                        style={{ 
                          backgroundColor: '#ffffff',
                          color: '#0a0a0a',
                          paddingLeft: '20px',
                          paddingRight: '20px',
                          paddingTop: '16px',
                          paddingBottom: '16px',
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
                            <Lightning size={20} weight="bold" />
                            <span className="font-semibold text-sm tracking-wide">Analyze Now</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                  {showDropdown && filteredDomains.length > 0 && (
                    <motion.div
                      ref={dropdownRef}
                      className="relative z-50 -mt-2"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-neutral-900/95 backdrop-blur-sm border border-neutral-700/50 rounded-xl shadow-2xl overflow-hidden">
                        <div style={{ padding: '16px' }}>
                          <div className="flex items-center justify-between" style={{ marginBottom: '10px', paddingLeft: '8px', paddingRight: '8px' }}>
                            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">Popular Domains</span>
                            <CaretDown size={12} className="text-neutral-500" />
                          </div>
                          <div className="space-y-1">
                            {filteredDomains.map((domain, index) => (
                              <motion.button
                                key={domain}
                                onClick={() => handleDomainSelect(domain)}
                                className="w-full text-left rounded-lg bg-transparent hover:bg-neutral-800/50 transition-colors duration-200 flex items-center justify-between group cursor-pointer"
                                style={{ paddingLeft: '6px', paddingRight: '6px', paddingTop: '6px', paddingBottom: '6px' }}
                                whileHover={{ x: 4 }}
                                transition={{ duration: 0.15 }}
                              >
                                <div className="flex items-center space-x-3">
                                  <Globe size={14} weight="regular" className="text-neutral-500 group-hover:text-neutral-400" />
                                  <span className="text-sm font-medium text-white group-hover:text-neutral-100">{domain}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full opacity-60"></div>
                                  <span className="text-xs text-neutral-500 group-hover:text-neutral-400">
                                    {88 + index * 2}
                                  </span>
                                </div>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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
