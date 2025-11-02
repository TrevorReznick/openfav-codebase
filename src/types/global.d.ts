// Add type declarations for Vite's import.meta.glob
declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

// Add type declarations for Vite's import.meta.glob
declare module 'virtual:vite-plugin-pages' {
  import { RouteRecordRaw } from 'vue-router'
  const routes: RouteRecordRaw[]
  export default routes
}

// Add type declarations for Vite's environment variables
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
  glob: (pattern: string) => Record<string, () => Promise<{ default: any }>>
}
