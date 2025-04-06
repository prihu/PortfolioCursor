import React from 'react'

// Define props type
interface ExperienceProps {
  title?: string;
  experiences?: {
    _key?: string; // Sanity adds a _key to array items
    company?: string;
    role?: string;
    period?: string;
    location?: string;
    achievements?: string[];
  }[];
}

const Experience: React.FC<ExperienceProps> = ({
  title = 'Experience', // Default title
  experiences = [] // Default empty array
}) => {

  if (!experiences || experiences.length === 0) {
    return (
      <section id="experience" className="section-padding bg-gray-50 dark:bg-gray-900">
        <h2 className="heading-2 text-center mb-12">{title}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">Experience details coming soon...</p>
      </section>
    )
  }

  return (
    <section id="experience" className="section-padding bg-gray-50 dark:bg-gray-900">
      <h2 className="heading-2 text-center mb-12">{title}</h2>
      <div className="space-y-8 max-w-4xl mx-auto"> {/* Added max-width and centering */}
        {experiences.map((exp) => (
          <div
            key={exp._key || exp.company} // Use Sanity key or fallback
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-primary">{exp.company || 'N/A'}</h3>
                <p className="text-lg font-semibold">{exp.role || 'N/A'}</p>
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-2 md:mt-0 text-left md:text-right"> {/* Adjusted alignment */}
                <p>{exp.period}</p>
                <p>{exp.location}</p>
              </div>
            </div>
            {exp.achievements && exp.achievements.length > 0 && (
              <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mt-4"> {/* Added margin top */}
                {exp.achievements.map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Experience 