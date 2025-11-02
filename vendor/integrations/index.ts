// integrations/openfav-integration/index.ts
import fs from 'node:fs'
import os from 'node:os'

import type { OpenfavConfig, OpenfavIntegration } from './types.js'
import configBuilder from './files/configBuilder.js'
import type { Config as OpenfavUserConfig } from './files/configBuilder.js'
import loadConfig from './files/loadConfig.js'

export default ({ config: _themeConfig = 'src/config.yaml' } = {}): OpenfavIntegration => {
  let cfg: OpenfavConfig
  return {
    name: 'openfav-integration',
    hooks: {
      'openfav:config:setup': async ({
        config,
        logger,
        updateConfig,
        addWatchFile,
      }) => {
        const buildLogger = logger.fork('openfav')
        const virtualModuleId = 'openfav:config'
        const resolvedVirtualModuleId = '\0' + virtualModuleId
  
        const rawJsonConfig = await loadConfig(_themeConfig) as OpenfavUserConfig;
        const { SITE, I18N, METADATA, UI, ANALYTICS } = configBuilder(rawJsonConfig);
  
        updateConfig({
          site: SITE.site,
          base: SITE.base,
          // @ts-ignore - Astro expects a boolean but we're using a string for compatibility
          trailingSlash: SITE.trailingSlash,
          vite: {
            plugins: [
              {
                name: 'vite-plugin-openfav-config',
                resolveId(id) {
                  if (id === virtualModuleId) {
                    return resolvedVirtualModuleId
                  }
                },
                load(id) {
                  if (id === resolvedVirtualModuleId) {
                    return `
                      export const SITE = ${JSON.stringify(SITE)}
                      export const METADATA = ${JSON.stringify(METADATA)}                          
                      export const UI = ${JSON.stringify(UI)};
                      export const ANALYTICS = ${JSON.stringify(ANALYTICS)}
                      export const I18N = ${JSON.stringify(I18N)}
                    `
                  }
                }
              }
            ]
          }
        })
        
        if (typeof _themeConfig === 'string') {
          addWatchFile(new URL(_themeConfig, config.root))
          buildLogger.info(`Openfav config \`${_themeConfig}\` has been loaded.`)
        } else {
          buildLogger.info(`Openfav config has been loaded.`)
        }
      },
      
      'openfav:config:done': async ({ config }) => {
        cfg = config
      },
      
      'openfav:build:done': async ({ logger }) => {
        const buildLogger = logger.fork('openfav')
        buildLogger.info('Updating `robots.txt` with `sitemap-index.xml` ...')
        try {
          const outDir = cfg.outDir
          const publicDir = cfg.publicDir
          const sitemapName = 'sitemap-index.xml'
          const sitemapFile = new URL(sitemapName, outDir)
          const robotsTxtFile = new URL('robots.txt', publicDir)
          const robotsTxtFileInOut = new URL('robots.txt', outDir)
          const hasIntegration = Array.isArray(cfg?.integrations) && 
            cfg.integrations?.find((e) => e?.name === '@openfavjs/sitemap') !== undefined
          const sitemapExists = fs.existsSync(sitemapFile)
  
          if (hasIntegration && sitemapExists) {
            const robotsTxt = fs.readFileSync(robotsTxtFile, { encoding: 'utf8', flag: 'a+' })
            const sitemapUrl = new URL(sitemapName, String(new URL(cfg.base, cfg.site)))
            const pattern = /^Sitemap:(.*)$/m
  
            if (!pattern.test(robotsTxt)) {
              fs.appendFileSync(robotsTxtFileInOut, `${os.EOL}${os.EOL}Sitemap: ${sitemapUrl}`, {
                encoding: 'utf8',
                flag: 'w',
              })
            } else {
              fs.writeFileSync(robotsTxtFileInOut, robotsTxt.replace(pattern, `Sitemap: ${sitemapUrl}`), {
                encoding: 'utf8',
                flag: 'w',
              })
            }
          }
        } catch (err) {
            buildLogger.error('Failed to update robots.txt')
        }
      }
    }
  }
}