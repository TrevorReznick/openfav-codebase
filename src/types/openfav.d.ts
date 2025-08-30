declare module 'openfav' {
  export interface OpenfavConfig {
    root: URL
    outDir: URL
    publicDir: URL
    site?: string
    base: string
    integrations: OpenfavIntegration[]
  }

  export interface OpenfavIntegration {
    name: string
    hooks: {
      'openfav:config:setup'?: (params: OpenfavSetupParams) => void | Promise<void>
      'openfav:config:done'?: (params: OpenfavDoneParams) => void | Promise<void>
      'openfav:build:done'?: (params: OpenfavBuildParams) => void | Promise<void>
    }
  }

  export interface OpenfavSetupParams {
    config: OpenfavConfig
    logger: OpenfavLogger
    updateConfig: (newConfig: Partial<OpenfavConfig>) => void
    addWatchFile: (file: URL) => void
  }

  export interface OpenfavDoneParams {
    config: OpenfavConfig
  }

  export interface OpenfavBuildParams {
    logger: OpenfavLogger
  }

  export interface OpenfavLogger {
    info: (message: string) => void
    warn: (message: string) => void
    error: (message: string) => void
    fork: (name: string) => OpenfavLogger
  }
}
