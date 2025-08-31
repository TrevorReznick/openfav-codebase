// @ts-ignore - This is injected by Vite at build time
const rawConfig = typeof import.meta.env.OPENFAV_CONFIG !== 'undefined' 
  ? JSON.parse(import.meta.env.OPENFAV_CONFIG) 
  : {};

import configBuilder from '../vendor/integrations/files/configBuilder.js';

// Build the config using the injected values
const config = configBuilder(rawConfig);

// Ensure all required exports exist with defaults
const SITE = config.SITE || {
  name: 'Openfav',
  site: 'https://openfav.vercel.app/',
  base: '/',
  trailingSlash: false,
  googleSiteVerificationId: ''
};

const I18N = config.I18N || { language: 'en', textDirection: 'ltr' };

const METADATA = config.METADATA || {
  title: { default: 'Openfav', template: '%s' },
  description: '',
  robots: { index: false, follow: false },
  openGraph: { type: 'website' }
};

const UI = config.UI || { theme: 'system' };
const ANALYTICS = config.ANALYTICS || { vendors: { googleAnalytics: { id: '' } } };

export { SITE, I18N, METADATA, UI, ANALYTICS };
