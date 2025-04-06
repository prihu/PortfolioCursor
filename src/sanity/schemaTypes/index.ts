import { type SchemaTypeDefinition } from 'sanity'

import { blockContentType } from './blockContentType'
import { categoryType } from './categoryType'
import { postType } from './postType'
import { authorType } from './authorType'

// Custom types
import { siteSettingsType } from './siteSettingsType'
import { homePageType } from './homePageType'

// Combine predefined blog types with custom types
export const schemaTypes = [
  // Blog types
  postType,
  authorType,
  categoryType,
  blockContentType,
  // Custom types
  siteSettingsType,
  homePageType,
]
