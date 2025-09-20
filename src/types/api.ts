/**
 * TIPI PRINCIPALI PER LE OPERAZIONI DI BASE
 */

import type { UUID } from "crypto";

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status?: number;
}

/**
 * TIPI PER I LINK E LE RISORSE
 */
/* imported from old types */
export interface Link {
    id: string;
    title: string;
    url: string;
    description: string | null;
    created_at: string;
}

export interface Collection {
    id: string;
    name: string;
    description: string | null;
    is_public: boolean;
}

/**
 * TIPI PER I LINK E LE RISORSE
 */
/* imported from old types */

export interface Link {
    id: string;
    title: string;
    url: string;
    description: string | null;
    created_at: string;
}

export interface Collection {
    id: string;
    name: string;
    description: string | null;
    is_public: boolean;
}

export interface CollectionFormData {
    name: string;
    description: string;
    is_public: boolean;
}


/**
 * TIPI PER LE LISTE
*/

export interface CreateListData {
    name: string;
    description: string;
    public: boolean;
}

export interface LinkFormData {
    title: string;
    url: string;
    description: string;
    context_id: string;
    resource_id: string;
    function_id: string;
}

export interface UserList {
    id?: number;
    name: string;
    id_user: UUID;
    description: string | null;
    public: boolean;
    created_at: string;
    modified_at: string;
}

export interface UpdateListData {
    name?: string;
    description?: string;
    public?: boolean;
}

/**
 * TIPI PER LE OPERAZIONI DI TABELLA
 */

export interface MainTableData {
    id?: string | number | bigint
    description?: string
    icon?: string
    image?: string
    logo?: string
    name: string
    title?: string
    url: string
}

export interface SubMainTableData {
    id_src: string | number | bigint
    user_id: string
    accessible: boolean
    domain_exists: boolean
    html_content_exists: boolean
    is_public: boolean
    secure: boolean
    status_code?: number
    type?: string
    valid_url: boolean
    AI?: boolean
}

export interface CategoriesTagsData {
    id_src: string | number | bigint
    id_area: number
    id_cat: number
    /*
    tag_3: string | number
    tag_4: string | number
    tag_5: string | number
    */
    id_provider?: number
    ratings?: any
    AI_think?: string
    AI_summary?: string
}

export interface SiteTagData {
    tag_type: number; // 3 = ambito, 4 = tecnologia, 5 = sottocategoria
    tag_value: number; // riferimento a sub_categories.id
    tag_name?: string; // nome leggibile del tag (es. "React")
}

export interface CreateLinkRequest
    extends MainTableData,
    Partial<SubMainTableData>,
    Partial<CategoriesTagsData> {
    user_id: string; // obbligatorio
    tags?: SiteTagData[]; // Nuovo campo per i tag
}