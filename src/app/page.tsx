import React from 'react'
import Image from 'next/image'
// Remove Sanity imports if no longer used directly on this page for primary structure
// import { groq } from 'next-sanity'
// import { client as sanityClient } from '@/sanity/lib/client'
// import { urlFor } from '@/sanity/lib/image'
// import { PortableText } from '@portabletext/react'
import dynamic from 'next/dynamic'
import Header from '../components/Header'
import ProfileImage from '../components/ProfileImage'
// Keep Prisma types if needed by components directly or for the API response type
import type { HeroComponent, ExperienceComponent as ExperienceDataType, EducationComponent as EducationDataType, Page as PageType } from '@prisma/client';
import prisma from '@/lib/prisma'; // Import prisma client directly

// Define a type for the combined page data expected from Prisma
// Same as before, used for the return type of the direct fetch
interface FullPageData extends PageType {
  heroComponents: HeroComponent[];
  experienceComponents: ExperienceDataType[];
  educationComponents: EducationDataType[]; // Fixed to use the correct type
  // Add other component arrays if included in API (e.g., skillsComponents)
}

// REMOVE the getPageData function that uses fetch
/*
async function getPageData(slug: string): Promise<FullPageData | null> {
  // ... fetch logic ...
}
*/

// Keep dynamic imports for components
const Experience = dynamic(() => import('../components/Experience'), {
  loading: () => (
    <section id="experience" className="section-padding bg-gray-50 dark:bg-gray-900">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-12"></div>
        <div className="space-y-8 max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
});

const Education = dynamic(() => import('../components/Education'), {
  loading: () => (
    <section id="education" className="section-padding">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-12"></div>
        <div className="space-y-8 max-w-4xl mx-auto">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
});

const Skills = dynamic(() => import('../components/Skills'), {
  loading: () => (
    <section id="skills" className="section-padding">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-6">
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 w-4/6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  ),
});

const Contact = dynamic(() => import('../components/Contact'), {
  loading: () => (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mx-auto mb-12"></div>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </section>
  ),
});

export default async function Home() {
  // Fetch data directly using Prisma client
  let pageData: FullPageData | null = null;
  try {
    pageData = await prisma.page.findUnique({
      where: { slug: 'home' },
      include: {
        heroComponents: { orderBy: { order: 'asc' } },
        experienceComponents: { orderBy: { order: 'asc' } },
        educationComponents: { orderBy: { order: 'asc' } },
      },
    });
  } catch (error) {
    console.error("Error fetching page data directly from Prisma:", error);
    // Handle error appropriately, maybe show an error state on the page
  }

  // Extract data (null checks needed as pageData could be null on error)
  const heroData = pageData?.heroComponents?.[0];
  const experienceData = pageData?.experienceComponents || [];
  const educationData = pageData?.educationComponents || [];
  const aboutContent = pageData?.aboutContent || null;

  // Fetch global Skills data separately
  let skillsData = [];
  try {
    skillsData = await prisma.skillCategory.findMany({
        orderBy: { order: 'asc' },
        include: {
            skills: { orderBy: { order: 'asc' } }
        }
    });
  } catch (error) {
     console.error("Error fetching skills data directly from Prisma:", error);
  }

  // Read Contact Email from environment variable
  const contactEmail = process.env.CONTACT_EMAIL || "default-contact@example.com"; // Provide fallback

  // Placeholders - these will eventually come from Prisma Page model or components
  const aboutSectionTitle = pageData?.title || 'About Me'; // Example: Use Page title
  const experienceSectionTitle = 'Work Experience'; // Placeholder for now
  const resumeUrl = '/placeholder-resume.pdf'; // Placeholder - where does this live?

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28">
        {/* Hero Section - uses heroData from Prisma */}
        <section className="section-padding flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 space-y-6">
            {heroData ? (
              <>
                <h1 className="heading-1 mb-2">
                  {heroData.headline || "Priyank Garg"}
                </h1>
                <span className="block text-primary text-2xl sm:text-3xl font-medium">
                  {heroData.subheadline || "Product Manager"}
                </span>
                {heroData.summary && (
                  <p className="paragraph">
                    {heroData.summary}
                  </p>
                )}
                <div className="flex gap-4">
                  <a
                    href={heroData.ctaLink || '#contact'}
                    className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-white hover:bg-blue-600 transition-colors"
                  >
                    {heroData.ctaLabel || 'Contact Me'}
                  </a>
                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 rounded-lg border-2 border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                    >
                      {heroData.resumeLinkLabel || 'View Resume'}
                    </a>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center text-red-500">Hero content could not be loaded. Check database seeding and logs.</div>
            )}
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0 flex justify-center">
            <ProfileImage 
              src={heroData?.imageUrl || undefined} 
              alt={heroData?.headline || 'Profile Picture'} 
            />
          </div>
        </section>

        {/* About Section - Placeholder */}
        <section id="about" className="section-padding bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-2 text-center mb-8">
              {aboutSectionTitle}
            </h2>
            {aboutContent ? (
              <div className="prose dark:prose-invert max-w-none space-y-4 text-center">
                {aboutContent.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)}
              </div>
            ) : (
              <p className="paragraph text-center text-gray-500 italic">About content coming soon.</p>
            )}
          </div>
        </section>

        {/* Experience Section - Use the dynamically imported component */}
        {experienceData.length > 0 && (
          <Experience
            title={experienceSectionTitle}
            experiences={experienceData}
          />
        )}

        {/* Skills are global, fetch separately or pass fetched data */}
        {/* Assuming Skills component expects categories prop */}
        <Skills title="Skills" categories={skillsData} />
        {/* Pass fetched education data */}
        <Education title="Education" educationList={educationData} />
        <Contact title="Contact Me" email={contactEmail} />

      </main>
    </>
  );
}

// Add revalidation if desired (e.g., revalidate every hour)
// export const revalidate = 3600 
