import React, { Suspense } from 'react';

export const SectionLoader = ({ title, loading, fallback, children }) => (
  <section className="w-full mb-10"> 
    <div className="max-w-6xl mx-auto px-8 flex items-center justify-between mb-6">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
      <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        View All
      </a>
    </div>
    
    <div className="min-h-[200px]">
      {loading ? fallback : (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      )}
    </div>
  </section>
);