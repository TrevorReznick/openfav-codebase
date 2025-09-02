// src/react/lib/autoComponentLoader.ts
import { lazy } from 'react'
import type { ComponentType } from 'react'
import path from 'path';

// Mappatura delle directory base
const COMPONENT_BASES = {
  pages: path.join(process.cwd(), 'src', 'components', 'pages'),
  home: path.join(process.cwd(), 'src', 'react', 'components', 'home'),
  common: path.join(process.cwd(), 'src', 'react', 'components', 'common')
};

interface AutoComponentConfig {
  loader: () => Promise<{ default: ComponentType<any> }>;
  layout?: string;
  requiredAuth?: boolean;
}

export async function getDynamicComponent(componentPath: string): Promise<AutoComponentConfig> {
  // Normalizza il path (es. "home/FeatureCard" -> "home/FeatureCard")
  const normalizedPath = componentPath.replace(/\./g, '/');
  
  // Prova a trovare il componente in diverse directory
  for (const [baseName, basePath] of Object.entries(COMPONENT_BASES)) {
    try {
      const fullPath = path.join(basePath, `${normalizedPath}.tsx`);
      const relativePath = path.relative(process.cwd(), fullPath);
      
      // Verifica se il file esiste (usando dynamic import)
      const module = await import(/* @vite-ignore */ relativePath);
      
      return {
        loader: () => import(/* @vite-ignore */ relativePath),
        layout: baseName === 'pages' ? 'default' : 'minimal',
        requiredAuth: normalizedPath.startsWith('admin/')
      };
    } catch (e) {
      // Continua a provare le altre directory
      continue;
    }
  }
  
  throw new Error(`Component ${componentPath} not found in any base directory`);
}