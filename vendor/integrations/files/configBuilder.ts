import { mergeDeepRight, pathOr } from 'ramda'

interface MetaData {
  title?: {
    default: string
    template: string
  }
  description?: string
  robots?: {
    index?: boolean
    follow?: boolean
  }
  canonical?: string
  image?: string
  openGraph?: {
    title?: string
    description?: string
    type?: string
    url?: string
    image?: string
  }
  twitter?: {
    handle?: string
    site?: string
    cardType?: string
  }
}

export type Config = {
  site?: SiteConfig
  metadata?: MetaDataConfig
  i18n?: I18NConfig    
  analytics?: unknown
  ui?: unknown
}
  
export interface SiteConfig {
  name: string;
  site?: string;
  base?: string;
  trailingSlash?: boolean
  googleSiteVerificationId?: string
}

export interface MetaDataConfig extends Omit<MetaData, 'title'> {
  title?: {
    default: string
    template: string
  }
}

export interface I18NConfig {
  language: string
  textDirection: string
  dateFormatter?: Intl.DateTimeFormat
}

export interface AnalyticsConfig {
  enable?: boolean;
  vendors: {
    googleAnalytics: {
      id?: string
      partytown?: boolean
    }
  }
}

export interface UIConfig {
  theme: string
}

const DEFAULT_SITE_NAME = 'Openfav'

const getSite = (config: Config) => {
  const _default = {
    name: DEFAULT_SITE_NAME,
    site: 'https://openfav.vercel.app/',
    base: '/',
    trailingSlash: false,  
    googleSiteVerificationId: ''
  }
  
  return mergeDeepRight({}, _default, config?.site ?? {}) as SiteConfig;
}

const getI18N = (config: Config) => {
  const _default = {
    language: 'en',
    textDirection: 'ltr',
  };

  const value = mergeDeepRight({}, _default, config?.i18n ?? {})

  return value as I18NConfig
};

const getMetadata = (config: Config) => {
  const siteConfig = getSite(config)
  const _default = {
    title: {
      default: siteConfig?.name || DEFAULT_SITE_NAME,
      template: '%s',
    },
    description: '',
    robots: {
      index: false,
      follow: false,
    },
    openGraph: {
      type: 'website'
    }
  }
  
  return mergeDeepRight({}, _default, config?.metadata ?? {}) as MetaDataConfig
}

const getAnalytics = (config: Config) => {
  const _default = {
    vendors: {
      googleAnalytics: {
        id: undefined,
        partytown: true,
      }
    }
  }
  
  return mergeDeepRight({}, _default, config?.analytics ?? {}) as AnalyticsConfig;
}

const getUI = (config: Config) => {
  const _default = {
    theme: 'system',
  };

  return mergeDeepRight({}, _default, config?.ui ?? {})
};
  
export default (config: Config) => ({
  SITE: getSite(config),    
  METADATA: getMetadata(config),    
  ANALYTICS: getAnalytics(config),
  I18N: getI18N(config),  
  UI: getUI(config)  
})