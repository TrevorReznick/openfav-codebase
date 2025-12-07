import { lazy } from 'react'
import type { ComponentType } from 'react'

const COMPONENT_BASES = {
  // Percorsi diretti per specifici "moduli" dell'app
  auth: '/src/react/components/auth',
  components: '/src/react/components',
  common: '/src/react/components/common',
  dashboard: '/src/react/components/dashboard',
  examples: '/src/react/components/examples',
  'new-index': '/src/react/components/new-index',
  new_index: '/src/react/components/new-index',
  // Fallback: cartella principale dei componenti
  
  test: '/src/react/components/test',
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

  // Helpers
  const normalize = (p: string) => {
    // Supporta alias '@/': converte in '/src/...'
    const withAlias = p.startsWith('~/') ? p.replace('~/', '/src/') : p;
    const abs = withAlias.startsWith('@/') ? withAlias.replace('@/', '/src/') : withAlias;
    return abs;
  };

  const getBaseKeyForPath = (abs: string) => {
    for (const [key, base] of Object.entries(COMPONENT_BASES)) {
      if (abs.startsWith(base + '/')) return key as ComponentBases;
    }
    return undefined;
  };

  const getComponentNameFromKey = (abs: string) => {
    // Examples:
    // /src/react/components/auth/Auth.tsx           -> Auth
    // /src/react/components/home/index.tsx         -> home (directory name)
    // /src/react/components/examples/Foo/index.tsx -> Foo
    const parts = abs.split('/');
    const file = parts[parts.length - 1];
    const isIndex = /^index\.(tsx|ts|jsx|js)$/.test(file);
    if (isIndex) {
      // Use parent directory name
      return parts[parts.length - 2];
    }
    return file.replace(/\.(tsx|ts|jsx|js)$/, '');
  };

  const isBareName = (p: string) => !p.includes('/') && !p.startsWith('@/') && !p.startsWith('~/');

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

  // 0) Name-only resolution: if input is a bare name, resolve uniquely across bases
  if (isBareName(componentPath)) {
    const nameLC = componentPath.toLowerCase();
    const matches: { key: string; base?: ComponentBases }[] = [];
    for (const key of Object.keys(registry)) {
      // Consider only files under known bases
      const baseKey = getBaseKeyForPath(key);
      if (!baseKey) continue;
      const compName = getComponentNameFromKey(key);
      if (compName.toLowerCase() === nameLC) {
        matches.push({ key, base: baseKey });
      }
    }
    if (matches.length === 1) {
      const matchedKey = matches[0].key;
      if (debug) console.log(`[autoComponentLoader] ✅ Unique name match: '${componentPath}' -> ${matchedKey}`);
      return {
        loader: () => registry[matchedKey](),
        layout: 'default',
        requiredAuth: false,
      };
    }
    if (matches.length > 1) {
      const details = matches
        .map(m => `- ${m.key} (base: ${m.base})`)
        .join('\n');
      const msg = `Ambiguous component name '${componentPath}'. Found multiple matches:\n${details}\nPlease specify a path like '<base>/<Component>' (e.g., 'auth/Auth').`;
      if (debug) console.error('[autoComponentLoader] ❌', msg);
      throw new Error(msg);
    }
    // If no matches, continue with regular resolution below
  }

  // 1) Prova con il path normalizzato così com'è
  const directAbs = normalize(componentPath);
  let matched = tryFromRegistry(directAbs);

  // 1b) Se è un path relativo (non assoluto e non alias), prova relativo alla root dei components
  if (!matched && !directAbs.startsWith('/src/')) {
    const rootRelativeAbs = normalize(`/src/react/components/${componentPath}`);
    matched = tryFromRegistry(rootRelativeAbs);
  }

  // 2) Se non trovato e non inizia da '/src/react/components', prova a pre-pendere ciascuna base
  if (!matched && !directAbs.startsWith('/src/react/components')) {
    const firstSegment = componentPath.split('/')[0];
    for (const [baseKey, basePath] of Object.entries(COMPONENT_BASES)) {
      // Evita duplicare il segmento base (es: 'examples/examples/TestComponent')
      const tail = firstSegment === baseKey
        ? componentPath.substring(firstSegment.length + 1)
        : componentPath;
      const abs = normalize(`${basePath}/${tail}`);
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
  const attemptedPaths = [
    directAbs,
    normalize(`/src/react/components/${componentPath}`),
    ...Object.entries(COMPONENT_BASES).map(([baseKey, b]) => {
      const firstSegment = componentPath.split('/')[0];
      const tail = firstSegment === baseKey
        ? componentPath.substring(firstSegment.length + 1)
        : componentPath;
      return normalize(`${b}/${tail}`);
    })
  ];
  const errorMessage = `Failed to find component via Vite registry: ${componentPath}\nTried:\n${attemptedPaths.map(p => `- ${p}`).join('\n')}`;
  if (debug) console.error('[autoComponentLoader] ❌', errorMessage);
  throw new Error(errorMessage);
}