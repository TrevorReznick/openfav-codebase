// @ts-check
import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'
import vercel from '@astrojs/vercel'

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the config file synchronously
const loadConfig = (configPath) => {
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return yaml.load(fileContents);
  } catch (error) {
    console.error('Error loading config file:', error);
    return {};
  }
};

// Load the OpenFav config
const configPath = path.resolve(__dirname, './src/config.yaml');
const openfavConfig = loadConfig(configPath);

// Import the plugin
import openfavConfigPlugin from './vite-plugin-openfav-config.js';

// Create a Vite plugin to make the config available at runtime
const configPlugin = {
  name: 'config-plugin',
  config() {
    return {
      define: {
        'import.meta.env.OPENFAV_CONFIG': JSON.stringify(openfavConfig)
      }
    };
  }
};

// Export the config
export default defineConfig({
  adapter: vercel(),
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    plugins: [
      // Use both plugins
      configPlugin,
      openfavConfigPlugin(openfavConfig)
    ],
    assetsInclude: ['**/*.yaml', '**/*.yml']
  },
  integrations: []
});
