import { makeRequest } from '@/api/apiBuilder';
import type { ApiResponse, Link, Collection, UserList, CreateListData, UpdateListData, LinkFormData, CollectionFormData } from '@/types/api';

const API_ENDPOINT = import.meta.env.API_ENDPOINT || '/api/v1/main/doQueries'
//console.log('API Endpoint:', API_ENDPOINT)

/**
 * Funzioni generiche per operazioni CRUD.
 */

// GET methods
const fetchElements = <T>(type: string, params?: Record<string, any>): Promise<ApiResponse<T[]>> =>
    makeRequest<T[]>(`${API_ENDPOINT}?type=get${capitalize(type)}`, params);

const fetchElement = <T>(type: string, id: string | number): Promise<ApiResponse<T>> =>
    makeRequest<T>(`${API_ENDPOINT}?type=get${capitalize(type)}`, { id });

// POST methods
const createElement = <T>(type: string, data: any): Promise<ApiResponse<T>> =>
    makeRequest<T>(`${API_ENDPOINT}?type=post${capitalize(type)}`, data, 'POST');

// PUT methods
const updateElement = <T>(type: string, id: string | number, data: any): Promise<ApiResponse<T>> =>
    makeRequest<T>(`${API_ENDPOINT}?type=update${capitalize(type)}&id=${id}`, data, 'PUT');

// DELETE methods
const deleteElement = (type: string, id: string | number): Promise<ApiResponse<void>> =>
    makeRequest<void>(`${API_ENDPOINT}?type=delete${capitalize(type)}&id=${id}`, undefined, 'DELETE');

/**
 * Helper per capitalizzare la prima lettera di una stringa.
 */
const capitalize = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Helpers tipizzati per operazioni specifiche su liste, link e collezioni.
 */
export const sites = {
    getAll: (): Promise<ApiResponse<Link[]>> => fetchElements<Link>('sites'),
    getByUserId: (userId: string): Promise<ApiResponse<Link[]>> => fetchElements<Link>('sitesByUserId', { userId }),
    getOne: (id: string): Promise<ApiResponse<Link>> => fetchElement<Link>('site', id),
    create: (data: LinkFormData): Promise<ApiResponse<Link>> => createElement<Link>('site', data),
    update: (id: string, data: Partial<LinkFormData>): Promise<ApiResponse<Link>> => updateElement<Link>('site', id, data),
    delete: (id: string): Promise<ApiResponse<void>> => deleteElement('site', id),
    joinCategories: (): Promise<ApiResponse<UserList[]>> => fetchElements<UserList>('sitesCategories')
};

export const lists = {
    getAll: (): Promise<ApiResponse<UserList[]>> => fetchElements<UserList>('lists'),
    getListsByUserId: (userId: string): Promise<ApiResponse<UserList[]>> => fetchElements<UserList>('listsByUserId', { userId }),
    getOne: (id: number): Promise<ApiResponse<UserList>> => fetchElement<UserList>('list', id),
    create: (data: CreateListData): Promise<ApiResponse<UserList>> => createElement<UserList>('list', data),
    update: (id: number, data: UpdateListData): Promise<ApiResponse<UserList>> => updateElement<UserList>('list', id, data),
    delete: (id: number): Promise<ApiResponse<void>> => deleteElement('list', id),
}

export const collections = {
    getAll: (): Promise<ApiResponse<Collection[]>> => fetchElements<Collection>('collections'),
    getOne: (id: string): Promise<ApiResponse<Collection>> => fetchElement<Collection>('collection', id),
    create: (data: CollectionFormData): Promise<ApiResponse<Collection>> => createElement<Collection>('collection', data),
    update: (id: string, data: Partial<CollectionFormData>): Promise<ApiResponse<Collection>> => updateElement<Collection>('collection', id, data),
    delete: (id: string): Promise<ApiResponse<void>> => deleteElement('collection', id),
}

export const events = {
    getAll: (): Promise<ApiResponse<any[]>> => fetchElements<any>('events'),
    create: (data: any): Promise<ApiResponse<any>> => createElement<any>('event', data),
    update: (id: number, data: any): Promise<ApiResponse<any>> => updateElement<any>('event', id, data),
    delete: (id: number): Promise<ApiResponse<void>> => deleteElement('event', id),
    getById: (id: number): Promise<ApiResponse<any>> => fetchElement<any>('event', id),
    getByUserId: (userId: string): Promise<ApiResponse<any[]>> => fetchElements<any>('eventsByUserId', { userId }),
}
