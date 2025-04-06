import { defineField, defineType } from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page Content',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'about', title: 'About Section' },
    { name: 'experience', title: 'Experience Section' },
    { name: 'education', title: 'Education Section' },
    { name: 'skills', title: 'Skills Section' },
    { name: 'contact', title: 'Contact Section' },
    { name: 'resume', title: 'Resume File' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Reference Title',
      type: 'string',
      description: 'Title for CMS reference (e.g., "Home Page Data")',
      initialValue: 'Home Page Data',
      readOnly: true,
    }),
    // --- Hero Section --- 
    defineField({
      name: 'heroName',
      title: 'Name',
      type: 'string',
      description: 'Your name displayed in the hero section',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroRole',
      title: 'Role/Title',
      type: 'string',
      description: 'Your role displayed below the name (e.g., Product Manager)',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSummary',
      title: 'Summary',
      type: 'text',
      description: 'The short introductory paragraph in the hero section',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaContactLabel',
      title: 'Contact CTA Label',
      type: 'string',
      initialValue: 'Contact Me',
      group: 'hero',
    }),
    defineField({
      name: 'heroCtaResumeLabel',
      title: 'Resume CTA Label',
      type: 'string',
      initialValue: 'View Resume',
      group: 'hero',
    }),
    defineField({
      name: 'heroImage',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'hero',
    }),
    // --- About Section --- 
    defineField({
      name: 'aboutSectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'About Me',
      group: 'about',
    }),
    defineField({
      name: 'aboutContent',
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }], // Use portable text
      description: 'The main content paragraphs for the About Me section',
      group: 'about',
    }),
    // --- Experience Section --- 
    defineField({
      name: 'experienceSectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Experience',
      group: 'experience',
    }),
    defineField({
      name: 'experiences',
      title: 'Experience Entries',
      type: 'array',
      of: [{
        type: 'object',
        name: 'experienceEntry',
        title: 'Experience Entry',
        fields: [
          defineField({ name: 'company', title: 'Company', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'role', title: 'Role', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'period', title: 'Period', type: 'string' }),
          defineField({ name: 'location', title: 'Location', type: 'string' }),
          defineField({
            name: 'achievements',
            title: 'Achievements / Responsibilities',
            type: 'array',
            of: [{ type: 'text', rows: 3 }],
          }),
        ],
        preview: {
          select: {
            title: 'company',
            subtitle: 'role',
          },
        },
      }],
      group: 'experience',
    }),
    // --- Education Section --- 
    defineField({
      name: 'educationSectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Education',
      group: 'education',
    }),
    defineField({
      name: 'educationEntries',
      title: 'Education Entries',
      type: 'array',
      of: [{
        type: 'object',
        name: 'educationEntry',
        title: 'Education Entry',
        fields: [
          defineField({ name: 'institution', title: 'Institution', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'degree', title: 'Degree', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({ name: 'period', title: 'Period', type: 'string' }),
        ],
        preview: {
          select: {
            title: 'institution',
            subtitle: 'degree',
          },
        },
      }],
      group: 'education',
    }),
    // --- Skills Section --- 
    defineField({
      name: 'skillsSectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Skills & Expertise',
      group: 'skills',
    }),
    defineField({
      name: 'skillCategories',
      title: 'Skill Categories',
      type: 'array',
      of: [{
        type: 'object',
        name: 'skillCategory',
        title: 'Skill Category',
        fields: [
          defineField({ name: 'title', title: 'Category Title', type: 'string', validation: (Rule) => Rule.required() }),
          defineField({
            name: 'skills',
            title: 'Skills',
            type: 'array',
            of: [{ type: 'string' }],
            options: {
              layout: 'tags' // Display skills as tags in the Studio
            }
          }),
        ],
        preview: {
          select: {
            title: 'title',
          },
        },
      }],
      group: 'skills',
    }),
    // --- Contact Section --- 
    defineField({
      name: 'contactSectionTitle',
      title: 'Section Title',
      type: 'string',
      initialValue: 'Get in Touch',
      group: 'contact',
    }),
    defineField({
      name: 'contactIntroText',
      title: 'Intro Text',
      type: 'text',
      group: 'contact',
    }),
    defineField({
      name: 'contactLinks',
      title: 'Contact Links',
      description: 'Links shown in the contact section (e.g., LinkedIn, Email)',
      type: 'array',
      of: [{
        type: 'object',
        name: 'contactLink',
        title: 'Contact Link',
        fields: [
          defineField({ name: 'name', title: 'Link Name', type: 'string', validation: (Rule) => Rule.required(), description: 'e.g., LinkedIn, Email' }),
          defineField({ name: 'url', title: 'URL', type: 'url', validation: (Rule) => Rule.required().uri({}) }),
          // Maybe add an optional icon field later
        ],
        preview: {
          select: {
            title: 'name',
            subtitle: 'url'
          }
        }
      }],
      group: 'contact',
    }),
    // --- Resume File --- 
    defineField({
      name: 'resumeFile',
      title: 'Resume File',
      type: 'file',
      description: 'Upload the latest resume PDF here. This will be linked from the Hero section and Contact links.',
      options: {
        accept: '.pdf' // Only allow PDF uploads
      },
      group: 'resume',
    }),
  ],
}) 