// Vite plugin using ES modules
import configBuilder from './vendor/integrations/files/configBuilder.js';

export default function openfavConfigPlugin(config) {
    const virtualModuleId = 'openfav:config';
    const resolvedVirtualModuleId = '\0' + virtualModuleId;
    // Process the config using the configBuilder
    const { SITE, I18N, METADATA, UI, ANALYTICS } = configBuilder(config);
    // Return the Vite plugin object
    return {
        name: 'openfav-config',
        enforce: 'pre',
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id) {
            if (id === resolvedVirtualModuleId) {
                return `
          export const SITE = ${JSON.stringify(SITE)};
          export const METADATA = ${JSON.stringify(METADATA)};
          export const UI = ${JSON.stringify(UI)};
          export const ANALYTICS = ${JSON.stringify(ANALYTICS)};
          export const I18N = ${JSON.stringify(I18N)};
        `;
            }
        }
    };
}

