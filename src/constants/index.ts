export const SITES_REL_QUERY = `
id,
description,
icon,
image,
logo,
name,
title,
url,
categories_tags ( 
  id_area,
  id_cat,
  id_provider,
  ratings,
  AI_think,
  AI_summary
),
sub_main_table (
  user_id,
  accessible,
  domain_exists,
  html_content_exists,
  is_public,
  secure, 
  status_code,
  valid_url,
  type,
  AI
)
`
export const QUERY_SITES_CATEGORIES = `
  id_src,
  main_table (
    *
  ),
  areas (
    area
  ),
  categories (
    id,
    category
  ),
  tags:site_tags (
    tag_type,
    sub_category:tag_value ( sub_category )
  )
`
export const SITES_REL_QUERY_WITH_USER = `
  *,
  main_table (
    id,
    description,
    icon,
    image,
    logo,
    name,
    title,
    url,
    categories_tags (
      id_area,
      id_cat,
      id_provider,
      ratings,
      AI_think,
      AI_summary
    )
  )
`
export const EVENT_LOGS = `
  id,
  id_event_type,
  id_event_family,
  user_id,
  event_data,
  event_type (        
    event_type, 
    event_description
  ),
  event_family (
    event_family
  )
`