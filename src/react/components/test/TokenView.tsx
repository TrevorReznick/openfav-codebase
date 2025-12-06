import React from 'react';
import { getColor, getSpacing } from '@/lib/tokens';

const TokenTest = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Design Tokens Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Colors</h2>
        <div className="flex flex-wrap gap-4">
          {[
            'primary-color',
            'secondary-color',
            'accent-color',
            'hover',
            'background-color',
            'text-color',
            'card-bg',
            'card-border',
          ].map((key) => (
            <div
              key={key}
              className="w-24 h-24 rounded-lg flex items-center justify-center text-sm"
              style={{
                backgroundColor:
                  key === 'card-border' ? 'var(--color-card-bg)' : (getColor(key as any) as any),
                border: key === 'card-border' ? '1px solid var(--color-card-border)' : 'none',
                color:
                  key === 'card-bg' || key === 'background-color' || key === 'secondary-color'
                    ? 'white'
                    : 'var(--color-text-color)',
              }}
            >
              {key}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Spacing</h2>
        <div className="space-y-4">
          {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32].map((size) => (
            <div key={size} className="flex items-center">
              <div 
                className="bg-blue-500 h-4 rounded"
                style={{ width: getSpacing(size as any) }}
              />
              <span className="ml-2">spacing-{size}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Typography</h2>
        <div className="space-y-2">
          <p className="font-sans">Sans-serif font (Inter)</p>
          <p className="font-mono">Monospace font (Roboto Mono)</p>
          <p className="text-sm">Small text (0.875rem)</p>
          <p className="text-base">Base text (1rem)</p>
          <p className="text-lg">Large text (1.125rem)</p>
        </div>
      </div>
    </div>
  );
};

export default TokenTest;
