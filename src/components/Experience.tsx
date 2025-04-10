import React from 'react'
// Explicitly import the type from the generated location
import type { ExperienceComponent as ExperienceDataType } from '@prisma/client'

// Helper function to format dates (consider moving to a utils file)
const formatDate = (date: Date | string | undefined | null): string => {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

// Define props type using Prisma data type
interface ExperienceSectionProps {
  title?: string;
  experiences: ExperienceDataType[]; // Use Prisma type
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  title = 'Experience',
  experiences = []
}) => {

  if (!experiences || experiences.length === 0) {
    return (
      <section id="experience" className="section-padding bg-gray-50 dark:bg-gray-900">
        <h2 className="heading-2 text-center mb-12">{title}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">No experience details available.</p>
      </section>
    );
  }

  return (
    <section id="experience" className="section-padding bg-gray-50 dark:bg-gray-900">
      <h2 className="heading-2 text-center mb-12">{title}</h2>
      <div className="space-y-8 max-w-4xl mx-auto">
        {experiences.map((exp) => {
          const start = formatDate(exp.startDate);
          const end = exp.endDate ? formatDate(exp.endDate) : 'Present';
          const period = `${start} - ${end}`;

          return (
            <div
              key={exp.id} // Use Prisma id as key
              className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  {/* Use Prisma fields */}
                  <h3 className="text-xl font-bold text-primary">{exp.company}</h3>
                  <p className="text-lg font-semibold">{exp.jobTitle}</p>
                </div>
                <div className="text-gray-600 dark:text-gray-400 mt-2 md:mt-0 text-left md:text-right">
                  <p>{period}</p>
                  {exp.location && <p>{exp.location}</p>} { /* Conditionally render location */}
                </div>
              </div>
              {/* Use Prisma description field - needs parsing if it contains markdown/rich text */}
              {exp.description && (
                <div className="prose dark:prose-invert max-w-none mt-4 text-gray-600 dark:text-gray-300">
                  {/* Basic rendering - use PortableText or markdown parser if needed */}
                  {exp.description.split('\n').map((line: string, i: number) => <p key={i}>{line}</p>)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  )
}

export default ExperienceSection; 