'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChartBar, TrendUp } from 'phosphor-react';
import { getScoreInterpretation, getScoreColor } from '@/lib/scoring';

interface DomainResultsProps {
  domainData: {
    domain: {
      id: string;
      name: string;
      createdAt?: string;
      labelhash?: string;
    };
    score: {
      totalScore: number;
      breakdown?: Record<string, number>;
      factors?: Record<string, number>;
    };
    stats: {
      totalVolume: number;
      averagePrice: number;
      salesCount?: number;
    };
    listings: Array<{
      price: string;
      currency: string;
    }>;
    rarityScore: number;
    marketValue: string;
    volume24h: string;
    priceChange24h: number;
    activityCount: number;
    lastActivity: string;
    isActive: boolean;
  };
}

export default function DomainResults({ domainData }: DomainResultsProps) {
  if (!domainData) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <AnimatePresence>
              <motion.div 
                className="w-full"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-8">
                           <div className="flex items-center space-x-4">
                             <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                               <Globe size={24} weight="bold" className="text-neutral-950" />
                             </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {domainData.domain.id}
                        </h3>
                        <p className="text-neutral-400">Domain Analysis</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(domainData.score.totalScore)} mb-1`}>
                        {domainData.score.totalScore}/100
                      </div>
                      <p className="text-neutral-400 text-sm">
                        {getScoreInterpretation(domainData.score.totalScore)}
                      </p>
                    </div>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    {domainData.score.breakdown && Object.entries(domainData.score.breakdown).map(([factor, score]) => (
                      <div key={factor} className="bg-neutral-800 border border-neutral-700 rounded-lg p-4">
                        <div className="text-sm font-medium text-neutral-400 capitalize mb-1">
                          {factor}
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">
                          {score as number}/100
                        </div>
                        <div className="text-xs text-neutral-500">
                          {domainData.score.factors?.[factor as keyof typeof domainData.score.factors]}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Domain Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                             <h4 className="font-semibold text-white mb-4 flex items-center space-x-2">
                               <ChartBar size={20} weight="bold" />
                               <span>Domain Information</span>
                             </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Created:</span>
                          <span className="text-white font-medium">
                            {domainData.domain.createdAt ? new Date(domainData.domain.createdAt).toLocaleDateString() : 'Unknown'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Label Hash:</span>
                          <span className="text-white font-mono text-xs bg-neutral-700 px-2 py-1 rounded">
                            {domainData.domain.labelhash ? domainData.domain.labelhash.slice(0, 8) + '...' : 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6">
                             <h4 className="font-semibold text-white mb-4 flex items-center space-x-2">
                               <TrendUp size={20} weight="bold" />
                               <span>Market Activity</span>
                             </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Sales Count:</span>
                          <span className="text-white font-medium">
                            {domainData.stats?.salesCount || 0}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Total Volume:</span>
                          <span className="text-white font-medium">
                            {domainData.stats?.totalVolume || '0'} ETH
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Active Listings:</span>
                          <span className="text-white font-medium">
                            {domainData.listings.length}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}