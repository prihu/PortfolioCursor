import React from 'react'
import type { EducationComponent as EducationDataType } from '@prisma/client' // Use Prisma type

// Define props type
interface EducationProps {
  title?: string;
  educationList: EducationDataType[]; // Updated prop name and use Prisma type
}

const Education: React.FC<EducationProps> = ({
  title = 'Education',
  educationList = [] // Use updated prop name
}) => {

  if (!educationList || educationList.length === 0) { // Use updated prop name
    return (
      <section id="education" className="section-padding bg-gray-50 dark:bg-gray-900" aria-labelledby="education-heading">
        <h2 id="education-heading" className="heading-2 text-center mb-12">{title}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">Education details coming soon...</p>
      </section>
    )
  }

  return (
    // Make sure the section has the id="education" for the link to work
    <section id="education" className="section-padding bg-gray-50 dark:bg-gray-900" aria-labelledby="education-heading">
      <h2 id="education-heading" className="heading-2 text-center mb-12">{title}</h2>
      <ul className="max-w-3xl mx-auto space-y-8">
        {educationList.map((edu) => { // Use updated prop name and Prisma fields
           // Helper to format dates (could move to utils)
           const startDate = edu.startDate ? new Date(edu.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'N/A';
           const endDate = edu.endDate ? new Date(edu.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';
           const period = `${startDate} - ${endDate}`;

          return (
          <li
            key={edu.id} // Use Prisma id
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-primary mb-2">{edu.institution}</h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{edu.degree}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{period}</p>
             {/* Render description if exists */}
             {edu.description && (
                <div className="prose dark:prose-invert max-w-none mt-4 text-gray-600 dark:text-gray-300">
                  {/* Basic rendering - use PortableText or markdown parser if needed */}
                  {edu.description.split('\n').map((line: string, i: number) => <p key={i}>{line}</p>)}
                </div>
              )}
          </li>
        )})}
      </ul>
    </section>
  )
}

export default Education