import { lazy } from 'react'
import type { ComponentType } from 'react'

const COMPONENT_BASES = {
  // Percorsi diretti per specifici "moduli" dell'app
  auth: '/src/react/components/auth',
  dashboard: '/src/react/components/dashboard',
  examples: '/src/react/components/examples',
  common: '/src/react/components/common',
  // Fallback: cartella principale dei componenti
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
  // Costruiamo un registry dei moduli disponibili con Vite
  const registry: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
    ...import.meta.glob('/src/react/components/**/*.{ts,tsx,js,jsx}'),
  } as any;

  const normalize = (p: string) => {
    // Supporta alias '@/': converte in '/src/...'
    const withAlias = p.startsWith('~/') ? p.replace('~/', '/src/') : p;
    const abs = withAlias.startsWith('@/') ? withAlias.replace('@/', '/src/') : withAlias;
    return abs;
  };

  const ensureCandidates = (abs: string) => {
    // Genera varianti: con/ senza estensione, e index.*
    const exts = ['.tsx', '.ts', '.jsx', '.js'];
    const hasExt = /\.(tsx|ts|jsx|js)$/.test(abs);
    const candidates: string[] = [];

    if (hasExt) {
      candidates.push(abs);
    } else {
      for (const ext of exts) candidates.push(abs + ext);
    }

    // index variants se punta a una directory
    const withoutTrailingSlash = abs.endsWith('/') ? abs.slice(0, -1) : abs;
    const idxBase = withoutTrailingSlash + '/index';
    for (const ext of exts) candidates.push(idxBase + ext);

    return candidates;
  };

  const tryFromRegistry = (abs: string) => {
    const candidates = ensureCandidates(abs);
    for (const c of candidates) {
      if (registry[c]) return c;
    }
    return null;
  };

  if (debug) {
    console.log('[autoComponentLoader] ===== Starting component resolution (glob) =====');
    console.log('[autoComponentLoader] Input path:', componentPath);
  }

  // 1) Prova con il path normalizzato così com'è
  const directAbs = normalize(componentPath);
  let matched = tryFromRegistry(directAbs);

  // 2) Se non trovato e non inizia da '/src/react/components', prova a pre-pendere ciascuna base
  if (!matched && !directAbs.startsWith('/src/react/components')) {
    for (const [, basePath] of Object.entries(COMPONENT_BASES)) {
      const abs = normalize(`${basePath}/${componentPath}`);
      matched = tryFromRegistry(abs);
      if (matched) break;
    }
  }

  if (matched) {
    if (debug) console.log(`[autoComponentLoader] ✅ Matched module: ${matched}`);
    return {
      loader: () => registry[matched](),
      layout: 'default',
      requiredAuth: false,
    };
  }

  // Nessuna corrispondenza trovata
  const attemptedPaths = [directAbs, ...Object.values(COMPONENT_BASES).map(b => normalize(`${b}/${componentPath}`))];
  const errorMessage = `Failed to find component via Vite registry: ${componentPath}\nTried:\n${attemptedPaths.map(p => `- ${p}`).join('\n')}`;
  if (debug) console.error('[autoComponentLoader] ❌', errorMessage);
  throw new Error(errorMessage);
}