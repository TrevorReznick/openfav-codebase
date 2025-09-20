import { supabaseQuery, supabaseInsert, supabaseUpdate, supabaseDelete } from '~/scripts/supabase'
import { EVENT_LOGS } from '@/constants'

export const getEvents = async () => {
    return await supabaseQuery('event_log', {
        select: EVENT_LOGS
    })
}

export const insertEvent = async (data: any) => {
    const tableName = 'event_log'
    const result = await supabaseInsert(tableName, data)
    if (!result.success) {
        throw new Error(result.error)
    }
    return result.data
}

export const updateEvent = async (data: any, id: string) => {
    const tableName = 'event_log'
    const result = await supabaseUpdate(tableName, data, (query) => query.eq('id', parseInt(id)))
    if (!result.success) {
        throw new Error(result.error)
    }
    return result.data
}

export const deleteEvent = async (id: string | number) => {
    const tableName = 'event_log'

    // Converte l'ID a numero intero
    const numericId = Number(id)

    if (isNaN(numericId)) {
        throw new Error(`Invalid ID format: ${id}`)
    }

    // Chiama la funzione generica di cancellazione
    const result = await supabaseDelete(tableName, (query) =>
        query.eq('id', numericId)
    )

    if (!result.success || !result.data) {
        throw new Error(result.error || 'Failed to delete event')
    }

    return result.data
}
