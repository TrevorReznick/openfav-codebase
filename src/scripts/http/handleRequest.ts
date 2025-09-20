// src/scripts/http/handleRequest.ts

import type { APIRoute } from 'astro'

/**
 * Tipo della callback che gestisce la logica API.
 */
export type ApiRouter = (
    method: string,
    type: string,
    params: Record<string, string>,
    request?: Request
) => Promise<any>

/**
 * Factory function che genera una funzione `handleRequest` riusabile.
 */
export const makeHandleRequest = (apiRouter: ApiRouter) => async (method: string, url: URL, request?: Request) => {

    console.log(`[${method}] Request received:`, url.searchParams.toString())

    const { type, ...params } = Object.fromEntries(url.searchParams)

    try {
        const response = await apiRouter(method, type, params, request)

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (error) {
        console.error(`[${method}] Error:`, error)
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : String(error),
                type,
                params,
                timestamp: new Date().toISOString()
            }),
            {
                status: 502,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    }
}