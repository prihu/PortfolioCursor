import React from 'react'

// Define props type
interface EducationProps {
  title?: string;
  educationEntries?: {
    _key?: string;
    institution?: string;
    degree?: string;
    period?: string;
  }[];
}

const Education: React.FC<EducationProps> = ({
  title = 'Education',
  educationEntries = []
}) => {

  if (!educationEntries || educationEntries.length === 0) {
    return (
      <section id="education" className="section-padding bg-gray-50 dark:bg-gray-900">
        <h2 className="heading-2 text-center mb-12">{title}</h2>
        <p className="text-center text-gray-600 dark:text-gray-400">Education details coming soon...</p>
      </section>
    )
  }

  return (
    // Make sure the section has the id="education" for the link to work
    <section id="education" className="section-padding bg-gray-50 dark:bg-gray-900">
      <h2 className="heading-2 text-center mb-12">{title}</h2>
      <div className="max-w-3xl mx-auto space-y-8">
        {educationEntries.map((edu) => (
          <div
            key={edu._key || edu.institution}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <h3 className="text-xl font-bold text-primary mb-2">{edu.institution || 'N/A'}</h3>
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{edu.degree || 'N/A'}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{edu.period}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Education 