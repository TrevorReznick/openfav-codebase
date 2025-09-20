import type { ApiResponse } from '@/types/api'

const api_url = ''

// Enhanced logger function
const logger = {
    log: (message: string, data?: any) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${message}`, data || '');
    },
    error: (message: string, error?: any) => {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}`, error || '');
    }
};

export async function makeRequest<T>(
    endpoint: string,
    data?: Record<string, any>,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'
): Promise<ApiResponse<T>> {
    const requestId = Math.random().toString(36).substr(2, 9);

    try {
        logger.log(`[${requestId}] Starting ${method} request to endpoint:`, endpoint);
        logger.log(`[${requestId}] Request data:`, data);

        // Ensure there's no double slash between api_url and endpoint
        const baseUrl = api_url.endsWith('/') ? api_url.slice(0, -1) : api_url;
        let url = `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: method !== 'GET' ? JSON.stringify(data) : undefined,
        };

        if (method === 'GET' && data) {
            const params = new URLSearchParams();
            Object.entries(data).forEach(([key, value]) => {
                if (value !== undefined) {
                    params.append(key, String(value));
                }
            });
            url += `${url.includes('?') ? '&' : '?'}${params.toString()}`;
        }

        logger.log(`[${requestId}] Final URL:`, url);
        logger.log(`[${requestId}] Request options:`, {
            method,
            headers: options.headers,
            credentials: options.credentials,
            body: method !== 'GET' ? data : undefined
        });

        const startTime = Date.now();
        const response = await fetch(url, options);
        const endTime = Date.now();
        const responseTime = endTime - startTime;

        let result;
        try {
            result = await response.json();
        } catch (e) {
            logger.error(`[${requestId}] Failed to parse JSON response:`, e);
            throw new Error('Invalid JSON response from server');
        }

        logger.log(`[${requestId}] Response received in ${responseTime}ms`, {
            status: response.status,
            statusText: response.statusText,
            url: response.url,
            headers: Object.fromEntries(response.headers.entries()),
            body: result
        });

        if (!response.ok) {
            const errorMessage = result?.error || 'Server error';
            logger.error(`[${requestId}] API Error:`, {
                error: errorMessage,
                status: response.status,
                requestId,
                url: response.url
            });
            return {
                error: errorMessage,
                status: response.status
            };
        }

        logger.log(`[${requestId}] Request completed successfully`);
        return {
            data: result,
            status: response.status
        };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`[${requestId}] Request failed:`, {
            error: errorMessage,
            requestId,
            timestamp: new Date().toISOString()
        });
        return {
            error: errorMessage,
            status: 500
        };
    }
}