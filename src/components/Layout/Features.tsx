'use client';

import { BarChart3, TrendingUp, Zap } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: BarChart3,
      title: "Rarity Scoring",
      description: "Advanced algorithm analyzing length, patterns, TLD rarity, and market activity with AI-powered insights."
    },
    {
      icon: TrendingUp,
      title: "Market Analytics",
      description: "Real-time market trends, price history, and trading volume insights with predictive analytics."
    },
    {
      icon: Zap,
      title: "On-chain Integration",
      description: "Direct integration with Doma Protocol for listings, offers, and seamless transactions."
    }
  ];

  return (
    <section className="pb-24">
      <div className="w-full flex justify-center">
        <div className="max-w-7xl px-6 lg:px-8 w-full">
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={feature.title} className="bg-neutral-900 border border-neutral-700 rounded-xl p-8 text-center">
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-neutral-950" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-neutral-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
