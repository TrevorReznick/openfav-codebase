// @ts-ignore - This is injected by Vite at build time
const rawConfig = typeof import.meta.env.OPENFAV_CONFIG !== 'undefined' 
  ? JSON.parse(import.meta.env.OPENFAV_CONFIG) 
  : {};

import configBuilder from '../vendor/integrations/files/configBuilder.js';

// Build the config using the injected values
const { SITE, I18N, METADATA, UI, ANALYTICS } = configBuilder(rawConfig);

export { SITE, I18N, METADATA, UI, ANALYTICS };
