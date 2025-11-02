import { supabaseQuery, supabaseInsert, supabaseUpdate, supabaseDelete } from '~/scripts/supabase'
import type { UserList } from '@/types/api'

export const getLists = async () => {
    return await supabaseQuery('lists_users', {
        select: '*'
    })
}

export async function getListsByUserId(userId: string) {
    return await supabaseQuery('lists_users', {
        select: '*',
        filter: (query) => query.eq('id_user', userId)
    })
}

export async function getListById(id: number | string) {
    return await supabaseQuery('lists_users', {
        select: '*',
        filter: (query) => query.eq('id', id)
    })
}

export async function createList(data: UserList) {
    return await supabaseInsert('lists_users', data)
}

export async function updateList(id: number, data: Partial<UserList>) {
    const tableName = 'lists_users'
    const result = await supabaseUpdate(tableName, data, (query) => query.eq('id', id))
    if (!result.success) {
        throw new Error(result.error)
    }
    return result.data
}

export async function deleteList(id: number) {
    return await supabaseDelete('lists_users', (query) => query.eq('id', id))
}
