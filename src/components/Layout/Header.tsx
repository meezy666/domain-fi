'use client';

import { motion } from 'framer-motion';
import { Zap, Wallet } from 'lucide-react';

export default function Header() {
  return (
    <motion.header 
      className="relative z-10 bg-neutral-950/80 backdrop-blur-sm border-b border-neutral-800/50 w-full"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="w-full">
        <div className="flex items-center justify-between h-20">
          {/* Left side - Logo */}
          <div className="flex items-center space-x-4" style={{ marginLeft: '15px' }}>
            <div className="w-6 h-7 bg-white rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-3 text-neutral-950" />
            </div>
            <h1 className="text-2xl font-semibold text-white" style={{ marginLeft: '2px' }}>
              DomainFi
            </h1>
          </div>
          
          {/* Right side - Navigation */}
          <div className="flex items-center space-x-8" style={{ marginRight: '15px' }}>
            <nav className="hidden md:flex items-center space-x-10">
              {['Analytics', 'Trending', 'Portfolio'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-white hover:text-neutral-200 font-semibold transition-all duration-500 ease-out relative group"
                  style={{ marginRight: '8px' }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-500 ease-out group-hover:w-full"></span>
                </a>
              ))}
            </nav>
            
            <button 
              className="bg-white text-neutral-950 rounded-lg font-semibold hover:bg-neutral-100 transition-colors duration-200 flex items-center space-x-2"
              style={{ paddingLeft: '9px', paddingRight: '9px', paddingTop: '7px', paddingBottom: '7px' }}
            >
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
