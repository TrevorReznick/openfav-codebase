// Google Analytics type declarations
interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
}

declare const window: Window;

// OpenFav config module
declare module 'openfav:config' {
  import type { 
    OpenfavSiteConfig, 
    OpenfavI18NConfig, 
    OpenfavMetaDataConfig, 
    OpenfavUIConfig, 
    OpenfavAnalyticsConfig 
  } from '../../../vendor/integrations/files/configBuilder'
  
  export const SITE: OpenfavSiteConfig
  export const I18N: OpenfavI18NConfig
  export const METADATA: OpenfavMetaDataConfig
  export const UI: OpenfavUIConfig
  export const ANALYTICS: OpenfavAnalyticsConfig
}
