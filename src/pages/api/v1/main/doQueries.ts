// src/pages/api/doQueriesNew.ts

import type { APIRoute } from 'astro'
import { makeHandleRequest } from '@/scripts/http/handleRequest'
import * as sites from '@/scripts/db/sites'
import * as events from '@/scripts/db/events'
import * as lists from '@/scripts/db/lists'
import type { CreateLinkRequest } from '@/types/api'


// --- Definizione della callback API ---
const apiRouter = async (
    method: string,
    type: string,
    params: Record<string, string>,
    request?: Request
): Promise<any> => {
    const data = request ? await request.json().catch(() => ({})) : {}

    switch (type) {

        /* ---- DELETE /sites/:id ---- */

        case "deleteSite": {
            if (method !== "DELETE") {
                throw new Error("Invalid method for deleteSite");
            }
            const { id } = params
            if (!id) {
                throw new Error("ID is required for deleteSite");
            }
            return await sites.deleteSite(id)
        }


        /* ---- GET /sites ---- */
        case "getSites": {
            if (method !== "GET") {
                throw new Error("Invalid method for getSites");
            }
            // usa await se la funzione è async e vuoi gestire qui gli errori
            return await sites.getSites();
        }

        /* ---- GET /sites/:id ---- */

        case "getSite": {
            if (method !== "GET") {
                throw new Error("Invalid method for getSiteById");
            }

            const { id } = params;
            if (!id) {
                throw new Error("ID is required for getSiteById");
            }

            return await sites.getSiteById(id);
        }

        case 'getSitesByUserId':

            if (method !== "GET") {
                throw new Error("Invalid method for getSitesByUserId");
            }

            const { userId } = params

            if (method !== 'GET') throw new Error('Invalid method for getSitesByUserId')

            if (!userId) {
                throw new Error("User ID is required for getSitesByUserId");
            }

            return await sites.getSitesByUserId(userId)

        case 'getSitesCategories':

            if (method !== 'GET') throw new Error('Invalid method for getSitesCategories')

            return await sites.getSitesCategories()

        case 'postSite':

            if (method !== 'POST') throw new Error('Invalid method for createSite')

            return await sites.insertSite(data as CreateLinkRequest)

        case 'updateSite':

            if (method !== 'PUT') throw new Error('Invalid method for updateSite')

            return await sites.updateSite(params.id, data)

        /* ---- altri tipi non gestiti ---- */

        case 'deleteEvent':
            if (method !== 'DELETE') throw new Error('Invalid method for deleteEvent')

            const { id: eventId } = params
            if (!eventId) {
                throw new Error("ID is required for deleteEvent");
            }

            return await events.deleteEvent(eventId)

        case 'getEvents':

            if (method !== 'GET') throw new Error('Invalid method for getEvents')

            return await events.getEvents()

        case 'postEvent':

            if (method !== 'POST') throw new Error('Invalid method for getEvents')

            return await events.insertEvent(data)

        case 'updateEvent':
            if (method !== 'PUT') throw new Error('Invalid method for updateEvent')

            const { id } = params
            if (!id) {
                throw new Error("ID is required for updateEvent");
            }


            return await events.updateEvent(data, id)

        case 'getLists':
            if (method !== 'GET') throw new Error('Invalid method for getSites')
            return await lists.getLists()
        case 'getListsByUserId':
            if (method !== 'GET') throw new Error('Invalid method for getListsByUserId')
            if (!params.userId) {
                throw new Error('userId is required for getListsByUserId')
            }
            return await lists.getListsByUserId(params.userId)
        case 'getList':
            if (method !== 'GET') throw new Error('Invalid method for getSites')
            return await lists.getListById(params.id)
        case 'postList':
            if (method !== 'POST') throw new Error('Invalid method for postList')
            return await lists.createList(data)
        case 'updateList':
            if (method !== 'PUT') throw new Error('Invalid method for updateList')
            const { id: listId } = params
            if (!listId) {
                throw new Error("ID is required for updateList");
            }
            const numericListId = Number(listId)
            if (isNaN(numericListId)) {
                throw new Error("ID must be a number for updateList");
            }
            return await lists.updateList(numericListId, data)
        case 'deleteList':
            if (method !== 'DELETE') throw new Error('Invalid method for deleteList')
            const { id: listIdToDelete } = params
            if (!listIdToDelete) {
                throw new Error("ID is required for deleteList");
            }
            const numericListIdToDelete = Number(listIdToDelete)
            if (isNaN(numericListIdToDelete)) {
                throw new Error("ID must be a number for deleteList");
            }
            return await lists.deleteList(numericListIdToDelete)

        default:

            throw new Error(`Unknown operation type: ${type}`);
    }

}

// --- Genera il middleware handleRequest ---
const handleRequest = makeHandleRequest(apiRouter)

// --- Esponi i metodi HTTP ---
export const GET: APIRoute = async ({ url }) => {
    return await handleRequest('GET', url)
}

export const POST: APIRoute = async ({ request, url }) => {
    return await handleRequest('POST', url, request)
}

export const PUT: APIRoute = async ({ request, url }) => {
    return await handleRequest('PUT', url, request)
}

export const DELETE: APIRoute = async ({ url }) => {
    return await handleRequest('DELETE', url)
}
