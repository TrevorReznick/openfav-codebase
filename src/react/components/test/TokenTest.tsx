import React, { useEffect } from 'react';
import { getColor, getSpacing } from '@/lib/tokens';


const TokenTest = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Design Tokens Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Color Palette</h2>
        <p className="text-sm text-gray-400 mb-4">Design system color tokens</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { key: 'primary-color', label: 'Primary' },
            { key: 'secondary-color', label: 'Secondary' },
            { key: 'accent-color', label: 'Accent' },
            { key: 'hover', label: 'Hover' },
            { key: 'background-color', label: 'Background' },
            { key: 'text-color', label: 'Text' },
            { key: 'card-bg', label: 'Card BG' },
            { key: 'card-border', label: 'Card Border' }
          ].map(({ key, label }) => (
            <div 
              key={key}
              className="w-full aspect-square rounded-lg flex flex-col items-center justify-center text-white text-sm p-2 text-center"
              style={{ 
                backgroundColor: `var(--color-${key})`,
                border: key === 'card-border' ? '1px solid var(--color-card-border)' : 'none',
                color: key === 'card-bg' || key === 'card-border' || key === 'secondary-color' ? 'white' : 'var(--color-text-color)'
              }}
            >
              <span className="font-semibold mb-1">{label}</span>
              <span className="text-xs opacity-80">{key}</span>
              <span className="text-2xs opacity-60 mt-1">{getColor(key as any)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Spacing Scale</h2>
        <p className="text-sm text-gray-400 mb-4">Visual representation of spacing scale values</p>
        <div className="space-y-4">
          {[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32].map((size) => (
            <div key={size} className="flex items-center">
              <div 
                className="bg-blue-500 h-4 rounded"
                style={{ 
                  width: `var(--spacing-${size})`,
                  minWidth: '1px' // Ensure minimum width for better visibility
                }}
              />
              <span className="ml-4 w-16 text-sm">{getSpacing(size as any)}</span>
              <span className="text-gray-400 text-sm">(spacing-{size})</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Typography</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Font Families</p>
            <div className="space-y-2 pl-4 border-l-2 border-gray-700">
              <p className="font-sans">Sans-serif (Inter)</p>
              <p className="font-mono text-sm bg-gray-800 p-2 rounded">Monospace (Roboto Mono)</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-400 mb-1">Font Sizes</p>
            <div className="space-y-2 pl-4 border-l-2 border-gray-700">
              <p className="text-sm">Small text (0.875rem)</p>
              <p className="text-base">Base text (1rem)</p>
              <p className="text-lg">Large text (1.125rem)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenTest;
