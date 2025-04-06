import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      description: 'The main title of the portfolio website',
    }),
    defineField({
      name: 'description',
      title: 'Site Description',
      type: 'text',
      description: 'A short description for SEO and metadata',
    }),
    // Add more settings later if needed (e.g., design tokens, global header/footer content)
  ],
  // Singleton behavior can be enforced via Desk Structure
}) 