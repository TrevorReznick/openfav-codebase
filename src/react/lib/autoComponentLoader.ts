import { lazy } from 'react'
import type { ComponentType } from 'react'
import path from 'path'

const COMPONENT_BASES = {
  // Percorsi diretti per specifici "moduli" dell'app
  auth: '/src/react/components/auth',
  dashboard: '/src/react/components/dashboard',
  examples: '/src/react/components/examples',
  common: '/src/react/components/common',
  // Fallback: cerca nella cartella principale dei componenti come ultima risorsa
  components: '/src/react/components'
} as const

type ComponentBases = keyof typeof COMPONENT_BASES

interface AutoComponentConfig {
  loader: () => Promise<{ default: ComponentType<any> }>;
  layout?: 'default' | 'minimal';
  requiredAuth?: boolean;
}

export async function getDynamicComponent(
  componentPath: string,
  debug = false
): Promise<AutoComponentConfig> {
  if (debug) {
    console.log('[autoComponentLoader] ===== Starting component resolution =====');
    console.log('[autoComponentLoader] Component path:', componentPath);
    console.log('[autoComponentLoader] Available component bases:', Object.entries(COMPONENT_BASES).map(([k, v]) => `${k}: ${v}`).join('\n  '));
    console.log('[autoComponentLoader] Current working directory:', process.cwd());
  }

  // If the path already starts with @, use it as is
  if (componentPath.startsWith('@/')) {
    const potentialPath = componentPath;
    if (debug) {
      console.log(`[autoComponentLoader] Using direct @ path: ${potentialPath}`);
    }
    
    try {
      const componentModule = await import(/* @vite-ignore */ potentialPath);
      if (componentModule && componentModule.default) {
        if (debug) {
          console.log(`[autoComponentLoader] ✅ Successfully imported component from ${potentialPath}`);
          console.log('[autoComponentLoader] Component exports:', Object.keys(componentModule));
        }
        return {
          loader: () => import(/* @vite-ignore */ potentialPath),
          layout: 'default',
          requiredAuth: false
        };
      }
    } catch (error) {
      if (debug) {
        if (error instanceof Error) {
          console.error(`[autoComponentLoader] ❌ Failed to load component from ${potentialPath}:`, error.message);
          console.error('Error details:', {
            name: error.name,
            stack: error.stack
          });
        } else {
          console.error(`[autoComponentLoader] ❌ Unknown error loading component from ${potentialPath}:`, error);
        }
      }
    }
  }

  // Fall back to the original behavior for backward compatibility
  for (const [baseKey, basePath] of Object.entries(COMPONENT_BASES)) {
    const potentialPath = `@${basePath.substring(4)}/${componentPath}`;

    if (debug) {
      console.log(`[autoComponentLoader] Tentativo di caricamento dalla base '${baseKey}': ${potentialPath}`);
    }

    try {
      if (debug) {
        console.log(`[autoComponentLoader] Attempting to import from: ${potentialPath}`);
        console.log(`[autoComponentLoader] Resolved path: ${path.resolve(__dirname, '../../..', potentialPath.replace('@', ''))}.{tsx,jsx,ts,js}`);
      }
      
      // Try to dynamically import the component
      const componentModule = await import(/* @vite-ignore */ potentialPath);

      if (componentModule && componentModule.default) {
        if (debug) {
          console.log('[autoComponentLoader] ✅ Successfully imported component');
          console.log('[autoComponentLoader] Component exports:', Object.keys(componentModule));
        }
        if (debug) {
          console.log(`[autoComponentLoader] ✅ SUCCESS: Component found at ${potentialPath}`);
          console.log(`[autoComponentLoader] Component exports:`, Object.keys(componentModule));
        }
        
        // Restituiamo la configurazione corretta con un loader che punta al percorso trovato.
        return {
          loader: () => import(/* @vite-ignore */ potentialPath),
          layout: 'default', // Per ora hardcoded, vedi "Passaggi Successivi"
          requiredAuth: false // Per ora hardcoded
        };
      } else {
        // If we get here, the module was imported but doesn't have a default export
        if (debug) {
          console.warn(`[autoComponentLoader] ⚠️  Invalid module at ${potentialPath} (missing default export)`);
          console.log('[autoComponentLoader] Module keys:', Object.keys(componentModule));
        }
      }
    } catch (error) {
      // The module doesn't exist or failed to load
      if (debug) {
        console.error(`[autoComponentLoader] ❌ Failed to load module at ${potentialPath}:`);
        if (error instanceof Error) {
          console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            constructor: error.constructor.name
          });
        } else {
          console.error('Unknown error type:', error);
        }
      }
    }
  }

  // If we get here, none of the component bases worked
  const attemptedPaths = Object.entries(COMPONENT_BASES)
    .map(([base, path]) => `@${path.substring(4)}/${componentPath}`);
    
  const errorMessage = `Failed to find component: ${componentPath} in any of the following locations:\n${attemptedPaths.map(p => `- ${p}`).join('\n')}`;
  
  if (debug) {
    console.error(`[autoComponentLoader] ❌ ${errorMessage}`);
    console.error('[autoComponentLoader] Current working directory:', process.cwd());
  }
  
  // Lanciamo un errore definitivo.
  throw new Error(errorMessage);
}