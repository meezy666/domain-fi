'use client';

export default function Hero() {
  return (
    <section className="pt-32 pb-24">
      <div className="w-full flex justify-center">
        <div className="max-w-7xl px-6 lg:px-8 w-full">
          <div className="text-center">
            <div 
              className="inline-flex items-center space-x-3 bg-neutral-800 border border-neutral-700 rounded-full mb-8"
              style={{ 
                paddingLeft: '10px', 
                paddingRight: '10px', 
                paddingTop: '5px', 
                paddingBottom: '5px',
                marginTop: '6px'
              }}
            >
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-neutral-300" style={{ marginLeft: '5px' }}>Powered by Doma Protocol</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
              Domain Rarity
              <br />
              <span className="text-neutral-400">& Analytics</span>
            </h1>
            
            <p 
              className="text-xl text-neutral-300 mb-12 leading-relaxed"
              style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'center' }}
            >
              Discover the true value of domains on Doma Protocol. Get instant rarity scores, 
              market insights, and investment recommendations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
