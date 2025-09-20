import { supabaseQuery, supabaseInsert, supabaseUpdate, supabaseDelete } from "~/scripts/supabase";
import { SITES_REL_QUERY, SITES_REL_QUERY_WITH_USER, QUERY_SITES_CATEGORIES } from '@/constants'
import type {
  CreateLinkRequest,
  MainTableData,
  SubMainTableData,
  CategoriesTagsData,
  ApiResponse,
  SiteTagData
} from '@/types/api';

// Dummy implementation for getRelatedData, replace with your actual logic
const getRelatedData = async (id: number) => {
  // Example: fetch related data from other tables if needed
  return {};
};

export const deleteSite = async (id: string | number) => {

  return await supabaseDelete('main_table', (query) => query.eq('id', id))

}

export const getSites = async () => {
  return await supabaseQuery('main_table', {
    select: SITES_REL_QUERY
  })
}

export const getSiteById = async (id: string | number) => {
  return await supabaseQuery('main_table', {
    select: SITES_REL_QUERY,
    filter: (query) => query.eq('id', id)
  })
}

export const getSitesByUserId = async (userId: string) => {
  return await supabaseQuery('sub_main_table', {
    select: SITES_REL_QUERY_WITH_USER,
    filter: (query) => query.eq('user_id', userId)
  })
}

export const getSitesCategories = async (/*userId: string*/) => {
  return await supabaseQuery('categories_tags', {
    select: QUERY_SITES_CATEGORIES,
    //filter: (query) => query.eq('user_id', userId),
    order: {
      column: 'id',
      ascending: true
    }
  })
}

export const insertSite = async (
  linkData: CreateLinkRequest
): Promise<ApiResponse<{ id: string | number }>> => {
  try {
    console.log('Inserting site with data:', linkData);
    // --- 1. Inserisci nel main_table ---
    const mainTableData: MainTableData = {
      description: linkData.description ?? undefined,
      icon: linkData.icon ?? undefined,
      image: linkData.image ?? undefined,
      logo: linkData.logo ?? undefined,
      name: linkData.name,
      title: linkData.title ?? undefined,
      url: linkData.url
    };

    const mainResult = await supabaseInsert<MainTableData>('main_table', mainTableData);

    if (!mainResult.success || !mainResult.data || mainResult.data.length === 0) {
      throw new Error('Failed to insert into main_table');
    }

    const insertedMainRecord = mainResult.data[0];
    let sourceId = insertedMainRecord.id;

    if (sourceId === undefined) {
      throw new Error('Inserted main_table record does not have a valid id');
    }

    // Convert bigint to string se necessario
    if (typeof sourceId === 'bigint') {
      sourceId = sourceId.toString();
    }

    // --- 2. Inserisci nel sub_main_table ---
    const subMainTableData: SubMainTableData = {
      id_src: sourceId,
      user_id: linkData.user_id,
      accessible: linkData.accessible ?? false,
      domain_exists: linkData.domain_exists ?? false,
      html_content_exists: linkData.html_content_exists ?? false,
      is_public: linkData.is_public ?? true,
      secure: linkData.secure ?? true,
      status_code: linkData.status_code ?? undefined,
      valid_url: linkData.valid_url ?? true,
      type: linkData.type ?? '',
      AI: linkData.AI ?? false
    };

    const subMainResult = await supabaseInsert<SubMainTableData>('sub_main_table', subMainTableData);

    if (!subMainResult.success) {
      throw new Error('Failed to insert into sub_main_table');
    }

    // --- 3. Se ci sono dati, inserisci in categories_tags ---
    if (
      linkData.id_area !== undefined ||
      linkData.id_cat !== undefined ||
      linkData.id_provider !== undefined
    ) {
      const categoriesTagsData: CategoriesTagsData = {
        id_src: sourceId,
        id_area: linkData.id_area ?? -1,
        id_cat: linkData.id_cat ?? -1,
        id_provider: linkData.id_provider ?? -1,
        ratings: linkData.ratings ?? -1,
        AI_think: linkData.AI_think ?? undefined,
        AI_summary: linkData.AI_summary ?? undefined
      };

      const categoriesResult = await supabaseInsert<CategoriesTagsData>(
        'categories_tags',
        categoriesTagsData
      );

      if (!categoriesResult.success) {
        throw new Error('Failed to insert into categories_tags');
      }
    }

    // --- 4. Se ci sono tag, inseriscili in site_tags ---
    if (linkData.tags && linkData.tags.length > 0) {
      const tagsToInsert = linkData.tags.map(tag => ({
        id_src: sourceId,
        tag_type: tag.tag_type,
        tag_value: tag.tag_value
      }));

      const tagsResult = await supabaseInsert<SiteTagData>('site_tags', tagsToInsert);

      if (!tagsResult.success) {
        throw new Error('Failed to insert into site_tags');
      }
    }

    // --- 5. Restituisci l'ID del record creato ---
    return {
      data: { id: sourceId },
      status: 200
    };
  } catch (error: any) {
    console.error('Error creating site with associations:', error.message);
    return {
      error: error.message || 'Internal server error',
      status: 500
    };
  }
};

/**
* Funzione principale per aggiornare un sito e i suoi dati associati.
*/
export const updateSite = async (
  id: string,
  data: Partial<MainTableData & SubMainTableData & CategoriesTagsData> & { tags?: SiteTagData[] }
): Promise<ApiResponse<any>> => {
  // Validazione ID
  const numericId = parseInt(id, 10)
  if (!numericId || isNaN(numericId)) {
    return {
      error: `ID non valido: ${id}`,
      status: 400
    }
  }

  try {
    // --- 1. Aggiorna main_table ---
    const mainData: Partial<MainTableData> = {
      description: data.description,
      icon: data.icon,
      image: data.image,
      logo: data.logo,
      name: data.name,
      title: data.title,
      url: data.url
    }

    const mainResult = await supabaseUpdate<MainTableData>(
      'main_table',
      mainData,
      (query) => query.eq('id', numericId)
    )

    if (!mainResult.success) {
      throw new Error(`Errore nell'aggiornamento della tabella principale: ${mainResult.error}`)
    }

    // --- 2. Aggiorna sub_main_table se ci sono dati validi ---
    const subMainData: Partial<any> = {}

    if (data.user_id !== undefined) subMainData.user_id = data.user_id
    if (data.accessible !== undefined) subMainData.accessible = data.accessible
    if (data.domain_exists !== undefined) subMainData.domain_exists = data.domain_exists
    if (data.html_content_exists !== undefined) subMainData.html_content_exists = data.html_content_exists
    if (data.is_public !== undefined) subMainData.is_public = data.is_public
    if (data.secure !== undefined) subMainData.secure = data.secure
    if (data.status_code !== undefined) subMainData.status_code = data.status_code
    if (data.valid_url !== undefined) subMainData.valid_url = data.valid_url
    if (data.type !== undefined) subMainData.type = data.type
    if (data.AI !== undefined) subMainData.AI = data.AI

    if (Object.keys(subMainData).length > 0) {
      const subMainResult = await supabaseUpdate(
        'sub_main_table',
        subMainData,
        (query) => query.eq('id_src', numericId)
      )

      if (!subMainResult.success) {
        throw new Error(`Errore nell'aggiornamento di sub_main_table: ${subMainResult.error}`)
      }
    }

    // --- 3. Aggiorna categories_tags se ci sono dati validi ---
    const categoryTagsData: Partial<any> = {}

    if (data.id_area !== undefined) categoryTagsData.id_area = data.id_area
    if (data.id_cat !== undefined) categoryTagsData.id_cat = data.id_cat
    if (data.id_provider !== undefined) categoryTagsData.id_provider = data.id_provider
    if (data.ratings !== undefined) categoryTagsData.ratings = data.ratings
    if (data.AI_summary !== undefined) categoryTagsData.AI_summary = data.AI_summary
    if (data.AI_think !== undefined) categoryTagsData.AI_think = data.AI_think

    if (Object.keys(categoryTagsData).length > 0) {
      const categoryResult = await supabaseUpdate(
        'categories_tags',
        categoryTagsData,
        (query) => query.eq('id_src', numericId)
      )

      if (!categoryResult.success) {
        throw new Error(`Errore nell'aggiornamento di categories_tags: ${categoryResult.error}`)
      }
    }

    // --- 4. Se ci sono tag, aggiorna site_tags solo tramite update ---
    if (data.tags && Array.isArray(data.tags)) {
      for (const tag of data.tags) {
        const updateResult = await supabaseUpdate<SiteTagData>(
          'site_tags',
          {
            tag_type: tag.tag_type,
            tag_value: tag.tag_value
          },
          (query) =>
            query
              .eq('id_src', numericId)
              .eq('tag_type', tag.tag_type)
        );
        if (!updateResult.success) {
          throw new Error(`Errore nell'aggiornamento del tag (${tag.tag_type}): ${updateResult.error}`);
        }
      }
    }

    // --- 5. Restituisce il risultato finale ---
    return {
      data: {
        id: numericId,
        ...(mainResult.data ? mainResult.data : {}), // Dati aggiornati da main_table
        ...(await getRelatedData(numericId)) // Dati extra (categorie, area, ecc.)
      },
      status: 200
    };
  } catch (error: any) {
    console.error('Errore durante l’aggiornamento:', error.message)
    return {
      error: error.message || 'Internal server error',
      status: 500
    }
  }
}
