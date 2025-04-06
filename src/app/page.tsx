import React from 'react'
import Image from 'next/image'
import { groq } from 'next-sanity'
import { client } from '@/sanity/lib/client'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from '@portabletext/react'
import Header from '../components/Header'
import Experience from '../components/Experience'
import Skills from '../components/Skills'
import Contact from '../components/Contact'
import Education from '../components/Education'

// Define the type for the fetched data (optional but recommended for type safety)
// You can generate these types more robustly using tools like sanity-codegen
interface HomePageData {
  _id: string;
  heroName?: string;
  heroRole?: string;
  heroSummary?: string;
  heroCtaContactLabel?: string;
  heroCtaResumeLabel?: string;
  heroImage?: any; // Use a more specific Sanity image type if generated
  aboutSectionTitle?: string;
  aboutContent?: any[]; // Portable Text blocks
  experienceSectionTitle?: string;
  experiences?: any[]; // Array of experience objects
  educationSectionTitle?: string;
  educationEntries?: any[]; // Array of education objects
  skillsSectionTitle?: string;
  skillCategories?: any[]; // Array of skill category objects
  contactSectionTitle?: string;
  contactIntroText?: string;
  contactLinks?: any[]; // Array of contact link objects
  resumeFile?: { asset?: { url?: string } };
}

// GROQ query to fetch the single homePage document
const homePageQuery = groq`*[_type == "homePage"][0]`

// Fetch data function (can be called directly in Server Component)
async function getHomePageData(): Promise<HomePageData> {
  // Add a revalidation tag if needed later: { next: { tags: ['homePage'] } }
  const data = await client.fetch(homePageQuery)
  return data || {}; // Return empty object if no data found
}

export default async function Home() {
  const pageData = await getHomePageData();
  const resumeUrl = pageData.resumeFile?.asset?.url;

  return (
    <>
      {/* Header might need site title later from siteSettings */}
      <Header />
      <main className="min-h-screen pt-28">
        {/* Hero Section - Now uses fetched data */}
        <section className="section-padding flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            <h1 className="heading-1 mb-2">
              {pageData.heroName || "Priyank Garg"} {/* Fallback text */}
            </h1>
            <span className="block text-primary text-2xl sm:text-3xl font-medium">
              {pageData.heroRole || "Product Manager"} {/* Fallback text */}
            </span>
            {pageData.heroSummary && (
              <p className="paragraph">
                {pageData.heroSummary}
              </p>
            )}
            <div className="flex gap-4">
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
              >
                {pageData.heroCtaContactLabel || 'Contact Me'}
              </a>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer" // Good practice for target="_blank"
                  className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  {pageData.heroCtaResumeLabel || 'View Resume'}
                </a>
              )}
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <div className="relative w-64 h-64 rounded-full overflow-hidden">
              {pageData.heroImage ? (
                <Image
                  src={urlFor(pageData.heroImage).url()}
                  alt={pageData.heroName || 'Profile Picture'}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500">No Image</div>
              )}
            </div>
          </div>
        </section>

        {/* About Section - Now uses fetched data */}
        <section id="about" className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 text-center mb-8">
              {pageData.aboutSectionTitle || 'About Me'}
            </h2>
            <div className="prose dark:prose-invert max-w-none space-y-6">
              {pageData.aboutContent ? (
                <PortableText value={pageData.aboutContent} />
              ) : (
                <p className="paragraph">About content coming soon...</p>
              )}
            </div>
          </div>
        </section>

        {/* Pass fetched data to child components */}
        <Experience
          title={pageData.experienceSectionTitle}
          experiences={pageData.experiences}
        />
        <Education
          title={pageData.educationSectionTitle}
          educationEntries={pageData.educationEntries}
        />
        <Skills
          title={pageData.skillsSectionTitle}
          skillCategories={pageData.skillCategories}
        />
        <Contact
          title={pageData.contactSectionTitle}
          introText={pageData.contactIntroText}
          contactLinks={pageData.contactLinks}
          resumeUrl={resumeUrl}
        />
      </main>
    </>
  )
}

// Add revalidation if desired (e.g., revalidate every hour)
// export const revalidate = 3600 
