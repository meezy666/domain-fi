'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Activity } from 'lucide-react';
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
      <section className="py-16">
        <div className="w-full flex justify-center">
          <div className="max-w-7xl px-6 lg:px-8 w-full">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex bg-neutral-900 border border-neutral-700 rounded-xl overflow-hidden">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Enter domain name (e.g., example.sol)"
                      className="w-full pl-12 pr-4 py-4 text-lg bg-transparent text-white placeholder-neutral-400 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 bg-white text-neutral-950 font-semibold hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-neutral-950/30 border-t-neutral-950 rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Activity className="w-5 h-5" />
                        <span>Analyze</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
              
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
      <div className="py-12"></div>
    </>
  );
}
