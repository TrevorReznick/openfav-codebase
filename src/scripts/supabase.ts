import { createClient } from '@supabase/supabase-js'
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey)

type QueryOptions = {
    select?: string
    order?: { column: string; ascending: boolean }
    filter?: (query: PostgrestFilterBuilder<any, any, any>) => PostgrestFilterBuilder<any, any, any>
}

type ApiResponse<T> = {
    success: boolean
    data?: T
    error?: string
}

export async function supabaseQuery(tableName: string, options: QueryOptions = {}): Promise<ApiResponse<any>> {
    try {
        let query = supabase.from(tableName).select(options.select || '*');

        if (options.filter) {
            query = options.filter(query);
        }

        if (options.order) {
            query = query.order(options.order.column, { ascending: options.order.ascending });
        }

        const { data, error } = await query

        if (error) throw error

        return { success: true, data }
    } catch (error) {
        console.error('Supabase query error:', error);
        return { success: false, error: (error as Error).message }
    }
}

export async function supabaseInsert<T extends Record<string, any>>(
    tableName: string,
    data: T | T[]
): Promise<ApiResponse<T[]>> {

    //console.log('supabase params ', tableName ? tableName : 'no table name', data)

    try {
        const { data: insertedData, error } = await supabase

            .from(tableName)
            .insert(data)
            .select()

        if (error) throw error;

        if (!insertedData || insertedData.length === 0) {

            return { success: false, error: 'No rows were inserted' }

        }

        return { success: true, data: insertedData as T[] }

    } catch (error) {

        console.error('Supabase insert error:', error)

        return { success: false, error: (error as Error).message }

    }
}

export async function supabaseUpdate<T extends Record<string, any>>(

    tableName: string,
    data: Partial<T>,
    filter: (query: PostgrestFilterBuilder<any, T, any>) => PostgrestFilterBuilder<any, T, any>
): Promise<ApiResponse<T>> {

    try {
        let query = supabase.from(tableName).update(data);

        if (filter) {
            query = filter(query);
        }

        const { data: updatedData, error } = await query.select();

        if (error) throw error;

        if (!updatedData || updatedData.length === 0) {
            return { success: false, error: 'No rows were updated' };
        }

        return { success: true, data: updatedData[0] as T };
    } catch (error) {
        console.error('Supabase update error:', error);
        return { success: false, error: (error as Error).message };
    }
}

export async function supabaseDelete<T extends Record<string, any>>(
    tableName: string,
    filter: (query: PostgrestFilterBuilder<any, T, any>) => PostgrestFilterBuilder<any, T, any>
): Promise<ApiResponse<T>> {

    try {

        let query = supabase.from(tableName).delete()

        if (filter) {

            query = filter(query)

        }

        const { data: deletedData, error } = await query.select()

        if (error) throw error

        if (!deletedData || deletedData.length === 0) {
            return { success: false, error: 'No rows were deleted' }
        }

        return { success: true, data: deletedData[0] as T }

    } catch (error) {

        console.error('Supabase delete error:', error)
        return { success: false, error: (error as Error).message }

    }
}

// Example usage of supabaseUpdate
async function updateUserEmail(userId: string, newEmail: string) {
    const result = await supabaseUpdate<{ id: string, email: string }>(
        'users',
        { email: newEmail },
        (query) => query.eq('id', userId)
    );

    if (result.success) {
        console.log('User email updated:', result.data);
    } else {
        console.error('Failed to update user email:', result.error);
    }
}
