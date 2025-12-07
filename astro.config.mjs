// @ts-check
import { defineConfig } from 'astro/config'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import yaml from 'js-yaml'
import vercel from '@astrojs/vercel'
import react from '@astrojs/react';

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
        'import.meta.env.OPENFAV_CONFIG': JSON.stringify(JSON.stringify(openfavConfig))
      }
    };
  }
};

// Export the config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~': path.resolve(__dirname, './src'),
        // Add alias for design tokens
        //'@/migration/design-system/tokens': path.resolve(__dirname, './src/migration/design-system/tokens')
      }
    },
    plugins: [
      // Use the config plugin
      configPlugin,
      openfavConfigPlugin(openfavConfig),
      // Add JSON plugin
      {
        name: 'json-plugin',
        transform(_, id) {
          if (id.endsWith('.json')) {
            return {
              code: `const data = ${JSON.stringify(require(id))}; export default data;`,
              map: null
            };
          }
        }
      }
    ],
    assetsInclude: ['**/*.yaml', '**/*.yml', '**/*.json'],
    optimizeDeps: {
      include: ['**/*.json']
    }
  },
  integrations: [
    react({
      include: ['**/react/**/*.{jsx,tsx}'],
      experimentalReactChildren: true
    })
  ]
});
