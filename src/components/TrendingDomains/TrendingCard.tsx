'use client';

import { motion } from 'framer-motion';
import { 
  Globe, 
  Activity, 
  ArrowUp, 
  ArrowDown, 
  Lightning, 
  Star, 
  Crown, 
  Diamond, 
  Fire,
  TrendUp,
  TrendDown,
  Circle,
  Sparkle
} from 'phosphor-react';
import type { TrendingDomain } from '@/lib/trending';
import { formatTimeAgo, formatPriceChange, getRarityInfo } from '@/lib/trending';

interface TrendingCardProps {
  domain: TrendingDomain;
  index: number;
  onDomainClick?: (domain: TrendingDomain) => void;
  variant?: 'default' | 'compact' | 'detailed';
}

// Helper function to get domain-specific icon
function getDomainIcon(domainName: string, rarityScore: number) {
  const name = domainName.toLowerCase();
  
  // Premium domains get special icons
  if (rarityScore >= 95) return { icon: Crown, color: 'text-yellow-400', bgColor: 'bg-yellow-400/10' };
  if (rarityScore >= 90) return { icon: Diamond, color: 'text-purple-400', bgColor: 'bg-purple-400/10' };
  if (rarityScore >= 85) return { icon: Star, color: 'text-blue-400', bgColor: 'bg-blue-400/10' };
  
  // Crypto-related domains
  if (name.includes('crypto') || name.includes('btc') || name.includes('bitcoin')) {
    return { icon: Lightning, color: 'text-orange-400', bgColor: 'bg-orange-400/10' };
  }
  if (name.includes('nft') || name.includes('web3') || name.includes('defi')) {
    return { icon: Sparkle, color: 'text-pink-400', bgColor: 'bg-pink-400/10' };
  }
  if (name.includes('eth') || name.includes('ethereum') || name.includes('sol') || name.includes('solana')) {
    return { icon: Fire, color: 'text-cyan-400', bgColor: 'bg-cyan-400/10' };
  }
  
  // Default for other domains
  return { icon: Globe, color: 'text-green-400', bgColor: 'bg-green-400/10' };
}

// Helper function to get rarity badge styling
function getRarityBadge(rarityScore: number) {
  if (rarityScore >= 95) return { 
    label: 'Legendary', 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-400/20 border-yellow-400/30',
    glow: 'shadow-yellow-400/20'
  };
  if (rarityScore >= 90) return { 
    label: 'Epic', 
    color: 'text-purple-400', 
    bgColor: 'bg-purple-400/20 border-purple-400/30',
    glow: 'shadow-purple-400/20'
  };
  if (rarityScore >= 85) return { 
    label: 'Rare', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-400/20 border-blue-400/30',
    glow: 'shadow-blue-400/20'
  };
  if (rarityScore >= 75) return { 
    label: 'Uncommon', 
    color: 'text-green-400', 
    bgColor: 'bg-green-400/20 border-green-400/30',
    glow: 'shadow-green-400/20'
  };
  return { 
    label: 'Common', 
    color: 'text-neutral-400', 
    bgColor: 'bg-neutral-400/20 border-neutral-400/30',
    glow: 'shadow-neutral-400/20'
  };
}

export default function TrendingCard({ 
  domain, 
  index, 
  onDomainClick,
  variant = 'default'
}: TrendingCardProps) {
  const priceChange = formatPriceChange(domain.priceChange24h);
  const rarityInfo = getRarityInfo(domain.rarityScore);
  const domainIcon = getDomainIcon(domain.name, domain.rarityScore);
  const rarityBadge = getRarityBadge(domain.rarityScore);

  const handleClick = () => {
    if (onDomainClick) {
      onDomainClick(domain);
    }
  };

  if (variant === 'compact') {
    return (
      <motion.button
        onClick={handleClick}
        className="w-full bg-gradient-to-br from-neutral-800/40 to-neutral-900/40 hover:from-neutral-700/50 hover:to-neutral-800/50 border border-neutral-700/40 hover:border-neutral-600/60 rounded-xl text-left transition-all duration-300 group cursor-pointer backdrop-blur-sm"
        style={{ padding: '4px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Header with domain icon and name */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start">
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${domainIcon.bgColor} border border-neutral-700/50 group-hover:border-neutral-600/70 transition-all duration-300 flex-shrink-0`}>
              <domainIcon.icon size={16} weight="bold" className={`${domainIcon.color} group-hover:scale-110 transition-transform duration-300`} />
            </div>
            <div className="flex-1 min-w-0" style={{ marginLeft: '4px' }}>
              <h3 className="text-white font-bold text-sm group-hover:text-neutral-100 transition-colors duration-300 truncate mb-1">
                {domain.name}
              </h3>
              <div className="flex items-center">
                <span 
                  className={`text-xs font-semibold rounded-full border ${rarityBadge.bgColor} ${rarityBadge.color}`}
                  style={{
                    padding: 'clamp(1px, 0.3em, 1px) clamp(5px, 0.8em, 4px)'
                  }}
                >
                  {rarityBadge.label}
                </span>
                <span className="text-xs text-neutral-400 font-medium" style={{ marginLeft: '4px' }}>{domain.rarityScore}/100</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1 flex-shrink-0">
            <div className={`w-2 h-2 rounded-full ${domain.isActive ? 'bg-green-400 animate-pulse' : 'bg-neutral-500'}`}></div>
            <span className="text-xs text-neutral-400 font-medium">{domain.isActive ? 'Live' : 'Idle'}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center">
            <div className="text-xs text-neutral-500 mb-1 font-medium">Value</div>
            <div className="text-sm font-bold text-white group-hover:text-green-400 transition-colors duration-300">
              {domain.marketValue}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-neutral-500 mb-1 font-medium">24h Vol</div>
            <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
              {domain.volume24h}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-neutral-500 mb-1 font-medium">Change</div>
            <div className={`text-sm font-bold flex items-center justify-center space-x-1 ${priceChange.color} group-hover:scale-105 transition-transform duration-300`}>
              {priceChange.isPositive ? (
                <TrendUp size={10} weight="bold" />
              ) : (
                <TrendDown size={10} weight="bold" />
              )}
              <span>{priceChange.formatted}</span>
            </div>
          </div>
        </div>

        {/* Activity Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-700/50">
          <div className="flex items-center space-x-1">
            <Activity size={12} className="text-green-400" />
            <span className="text-xs text-green-400 font-semibold">{domain.activityCount} activities</span>
          </div>
          <span className="text-xs text-neutral-500 font-medium">
            {formatTimeAgo(domain.lastActivity)}
          </span>
        </div>
      </motion.button>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.button
        onClick={handleClick}
        className="w-full bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 hover:from-neutral-700/60 hover:to-neutral-800/60 border border-neutral-700/50 hover:border-neutral-600/70 rounded-2xl text-left transition-all duration-300 group cursor-pointer backdrop-blur-sm shadow-lg hover:shadow-xl"
        style={{ padding: '32px' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Header with enhanced styling */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start space-x-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${domainIcon.bgColor} border border-neutral-700/50 group-hover:border-neutral-600/70 transition-all duration-300 shadow-lg flex-shrink-0`}>
              <domainIcon.icon size={28} weight="bold" className={`${domainIcon.color} group-hover:scale-110 transition-transform duration-300`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-xl group-hover:text-neutral-100 transition-colors duration-300 truncate mb-3">
                {domain.name}
              </h3>
              <div className="flex items-center space-x-4">
                <span className={`text-sm font-semibold px-4 py-2 rounded-full border ${rarityBadge.bgColor} ${rarityBadge.color} ${rarityBadge.glow} shadow-lg`}>
                  {rarityBadge.label}
                </span>
                <span className="text-sm text-neutral-400 font-medium">{domain.rarityScore}/100</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className={`w-3 h-3 rounded-full ${domain.isActive ? 'bg-green-400 animate-pulse shadow-green-400/50 shadow-lg' : 'bg-neutral-500'}`}></div>
            <span className="text-sm text-neutral-400 font-medium">{domain.isActive ? 'Live Trading' : 'Inactive'}</span>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-all duration-300">
            <div className="text-sm text-neutral-400 mb-3 font-medium">Market Value</div>
            <div className="text-2xl font-bold text-white group-hover:text-green-400 transition-colors duration-300">
              {domain.marketValue}
            </div>
          </div>
          <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-all duration-300">
            <div className="text-sm text-neutral-400 mb-3 font-medium">24h Volume</div>
            <div className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
              {domain.volume24h}
            </div>
          </div>
          <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-all duration-300">
            <div className="text-sm text-neutral-400 mb-3 font-medium">Price Change (24h)</div>
            <div className={`text-2xl font-bold flex items-center space-x-2 ${priceChange.color} group-hover:scale-105 transition-transform duration-300`}>
              {priceChange.isPositive ? (
                <TrendUp size={20} weight="bold" />
              ) : (
                <TrendDown size={20} weight="bold" />
              )}
              <span>{priceChange.formatted}</span>
            </div>
          </div>
          <div className="bg-neutral-800/30 rounded-xl p-6 border border-neutral-700/30 group-hover:border-neutral-600/50 transition-all duration-300">
            <div className="text-sm text-neutral-400 mb-3 font-medium">Rarity Score</div>
            <div className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
              {domain.rarityScore}/100
            </div>
          </div>
        </div>

        {/* Enhanced Activity Footer */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-700/50">
          <div className="flex items-center space-x-4">
            <Activity size={18} className="text-green-400" />
            <span className="text-sm text-green-400 font-semibold">{domain.activityCount} total activities</span>
            {domain.isActive && (
              <div className="flex items-center space-x-2">
                <Circle size={8} weight="fill" className="text-green-400 animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Active</span>
              </div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-neutral-400 mb-1">Last Activity</div>
            <div className="text-sm text-neutral-300 font-semibold">
              {formatTimeAgo(domain.lastActivity)}
            </div>
          </div>
        </div>
      </motion.button>
    );
  }

  // Default variant - enhanced design
  return (
    <motion.button
      onClick={handleClick}
      className="w-full bg-gradient-to-br from-neutral-800/40 to-neutral-900/40 hover:from-neutral-700/50 hover:to-neutral-800/50 border border-neutral-700/40 hover:border-neutral-600/60 rounded-xl text-left transition-all duration-300 group cursor-pointer backdrop-blur-sm shadow-md hover:shadow-lg"
      style={{ padding: '24px' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Header with domain icon and name */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-start space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${domainIcon.bgColor} border border-neutral-700/50 group-hover:border-neutral-600/70 transition-all duration-300 flex-shrink-0`}>
            <domainIcon.icon size={20} weight="bold" className={`${domainIcon.color} group-hover:scale-110 transition-transform duration-300`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-bold text-base group-hover:text-neutral-100 transition-colors duration-300 truncate mb-2">
              {domain.name}
            </h3>
            <div className="flex items-center space-x-3">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${rarityBadge.bgColor} ${rarityBadge.color}`}>
                {rarityBadge.label}
              </span>
              <span className="text-xs text-neutral-400 font-medium">{domain.rarityScore}/100</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className={`w-2.5 h-2.5 rounded-full ${domain.isActive ? 'bg-green-400 animate-pulse' : 'bg-neutral-500'}`}></div>
          <span className="text-xs text-neutral-400 font-medium">{domain.isActive ? 'Live' : 'Idle'}</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-2 font-medium">Value</div>
          <div className="text-sm font-bold text-white group-hover:text-green-400 transition-colors duration-300">
            {domain.marketValue}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-2 font-medium">24h Vol</div>
          <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-300">
            {domain.volume24h}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-neutral-500 mb-2 font-medium">Change</div>
          <div className={`text-sm font-bold flex items-center justify-center space-x-1 ${priceChange.color} group-hover:scale-105 transition-transform duration-300`}>
            {priceChange.isPositive ? (
              <TrendUp size={12} weight="bold" />
            ) : (
              <TrendDown size={12} weight="bold" />
            )}
            <span>{priceChange.formatted}</span>
          </div>
        </div>
      </div>

      {/* Activity Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-neutral-700/50">
        <div className="flex items-center space-x-2">
          <Activity size={14} className="text-green-400" />
          <span className="text-xs text-green-400 font-semibold">{domain.activityCount} activities</span>
        </div>
        <span className="text-xs text-neutral-500 font-medium">
          {formatTimeAgo(domain.lastActivity)}
        </span>
      </div>
    </motion.button>
  );
}
