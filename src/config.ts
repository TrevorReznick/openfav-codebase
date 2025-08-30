import configBuilder from '../vendor/integrations/files/configBuilder.js';
import loadConfig from '../vendor/integrations/files/loadConfig.js';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the config file
const loadOpenFavConfig = (configPath: string) => {
  try {
    return loadConfig(configPath);
  } catch (error) {
    console.error('Error loading config file:', error);
    return {};
  }
};

// Load the OpenFav config
const rawConfig = loadOpenFavConfig(path.resolve(__dirname, './openfav-config.yaml'));
const { SITE, I18N, METADATA, UI, ANALYTICS } = configBuilder(rawConfig);

export { SITE, I18N, METADATA, UI, ANALYTICS };
